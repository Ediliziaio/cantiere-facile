

# Piano: Infrastruttura Backend Supabase Multi-Tenant

## Panoramica

Configurare Supabase come backend del progetto, creando lo schema database completo per una gestione cantieri multi-tenant con RLS, e integrare il client Supabase nel frontend React.

## Step 1 — Connettere Supabase

Il progetto non ha ancora una connessione Supabase. Sarà necessario inizializzare la connessione tramite Lovable Cloud (preferred) o connessione esterna, che genererà automaticamente il client in `src/integrations/supabase/`.

## Step 2 — Schema Database (Migrazioni)

### Enum types
```sql
create type public.user_role as enum ('admin', 'capo_cantiere', 'operaio', 'contabile');
create type public.site_status as enum ('attivo', 'completato', 'sospeso');
create type public.verification_method as enum ('manual', 'qr', 'gps_auto');
create type public.doc_type as enum ('pdf', 'image', 'dwg');
create type public.doc_category as enum ('sicurezza', 'amministrativo', 'foto_tecnica', 'durc');
create type public.incident_severity as enum ('minor', 'serious', 'fatal');
create type public.subscription_tier as enum ('starter', 'professional', 'business');
```

### Tabelle (9 tabelle + 1 ruoli)

1. **`companies`** — Aziende tenant: id (uuid PK), name, vat_number (unique, formato IT + 11 cifre con CHECK), address, created_at, subscription_tier
2. **`profiles`** — Estensione auth.users: id (FK auth.users), company_id (FK companies), phone, avatar_url, is_active, codice_fiscale (CHECK formato 16 char alfanumerico)
3. **`user_roles`** — Ruoli separati (come da security requirements): user_id (FK auth.users), role (user_role enum), unique(user_id, role)
4. **`sites`** — Cantieri: company_id (FK), name, address, lat/lng (float8), radius_meters (default 100), status, cig_code, importo_contratto (numeric), data_inizio, data_fine_prevista
5. **`workers`** — Operai: company_id (FK), name, surname, codice_fiscale (unique + CHECK), phone, email, qualifications (text[]), tesserino_qr_hash (unique), avatar_url, is_active
6. **`site_assignments`** — Associazioni: site_id, worker_id, start_date, end_date, role_on_site (text)
7. **`attendances`** — Presenze: site_id, worker_id, check_in (timestamptz), check_out, gps coords (float8), gps_accuracy_meters, verification_method, note
8. **`documents`** — Documenti cantiere: site_id, uploaded_by (FK auth.users), file_name, file_type, storage_path, category, metadata (jsonb), created_at
9. **`safety_incidents`** — Registro infortuni: site_id, worker_id, incident_date, description, severity, witnesses (text[]), corrective_actions, dpr_81_compliance_checked (boolean)
10. **`equipment`** — Attrezzature: site_id, name, type, serial_number, maintenance_date, gps_tracker_id (nullable)

### Vincoli di validazione
- `vat_number`: CHECK con pattern `^IT[0-9]{11}$`
- `codice_fiscale` (profiles): CHECK lunghezza 16, alfanumerico
- `codice_fiscale` (workers): CHECK lunghezza 16, alfanumerico, UNIQUE

## Step 3 — Security Definer Function + RLS

### Funzione helper (evita ricorsione)
```sql
create or replace function public.get_user_company_id(_user_id uuid)
returns uuid language sql stable security definer set search_path = public
as $$ select company_id from public.profiles where id = _user_id $$;

create or replace function public.has_role(_user_id uuid, _role user_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;
```

### Policy pattern (per ogni tabella con company_id)
- **SELECT**: `company_id = get_user_company_id(auth.uid())`
- **INSERT**: `company_id = get_user_company_id(auth.uid())` — solo admin
- **UPDATE/DELETE**: solo admin della stessa company

Per tabelle senza company_id diretto (attendances, documents, ecc.), il filtro passa tramite JOIN con `sites.company_id`.

## Step 4 — Integrazione Frontend

### File da modificare/creare:
1. **`src/integrations/supabase/client.ts`** — Generato automaticamente dalla connessione
2. **`src/integrations/supabase/types.ts`** — Generato automaticamente
3. **`src/contexts/AuthContext.tsx`** — Refactor per usare `supabase.auth` invece dello state locale: login con `signInWithPassword`, logout con `signOut`, onAuthStateChange listener, fetch profilo e ruolo da `profiles` + `user_roles`
4. **`src/pages/Login.tsx`** — Collegare a `supabase.auth.signInWithPassword`
5. **`src/pages/Register.tsx`** — Collegare a `supabase.auth.signUp` + insert in `profiles` e `user_roles`

### Trigger automatico profilo
Un trigger `on_auth_user_created` creerà automaticamente una riga in `profiles` quando un utente si registra.

## Step 5 — Storage Bucket

Creare un bucket `documents` per i file dei cantieri, con policy RLS che filtra per company_id tramite la tabella documents.

## Ordine di esecuzione

1. Connettere Supabase al progetto
2. Creare migrazioni (enum → tabelle → funzioni → RLS → trigger)
3. Aggiornare AuthContext per Supabase Auth
4. Aggiornare Login/Register
5. Creare bucket storage

## Note tecniche

- I dati mock (`src/data/mock-data.ts`) resteranno come fallback durante la transizione; verranno sostituiti progressivamente con query reali via `@tanstack/react-query` + Supabase client
- Tutti i `company_id` non sono nullable per garantire isolamento tenant
- I ruoli sono in tabella separata `user_roles` come richiesto dalle security guidelines

