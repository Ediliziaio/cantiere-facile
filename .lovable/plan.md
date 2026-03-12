

# Piano: Espansione Area SuperAdmin

## Stato attuale

- **SuperAdmin area funzionante**: login (auto-login dev), dashboard con stats/chart, lista aziende con ricerca, dettaglio azienda con utenti, impersonation attiva con banner
- **Mock data**: `mock-superadmin.ts` con 4 tenant, stats piattaforma, log impersonation; `mock-data.ts` con utenti azienda
- **AuthContext**: supporta ruoli superadmin/admin/manager, impersonation state, activeTenantId
- **Componenti esistenti**: SuperAdminLayout, SuperAdminSidebar (3 voci), SuperAdminDashboard, SuperAdminAziende, SuperAdminAziendaDetail, ImpersonationBanner, TenantStatusBadge

## Cosa manca

1. **Onboarding wizard** per creare nuova azienda
2. **Dettaglio azienda con tabs** (overview, cantieri, fatturazione, log) — attualmente layout semplice senza tabs
3. **Azioni gestione**: sospensione/riattivazione con conferma, export dati
4. **Log impersonation** visibile in UI
5. **Dashboard arricchita**: health score aziende, aziende con pagamento in scadenza, storage usage
6. **Sidebar**: voci mancanti (Log Audit)

## Piano implementativo

### 1. Espandere mock data (`src/data/mock-superadmin.ts`)

Aggiungere:
- `mockTenantSettings`: settings per tenant (timezone, features_enabled, branding)
- `mockSubscriptions`: storico abbonamenti/pagamenti per tenant (data, importo, stato)
- `mockSuperAdminLog`: audit log azioni superadmin (creazione, sospensione, impersonation, modifica piano)
- Espandere `mockTenantsAll` con campi: fiscal_code, address, city, province, phone, max_users, max_sites, storage_used_mb, health_score
- Aggiungere `platformStats` estese: storage_total_gb, storage_used_gb, aziende_pagamento_scadenza

### 2. Onboarding Wizard (`src/pages/superadmin/SuperAdminNuovaAzienda.tsx`)

Pagina multi-step per creazione azienda:
- Step 1: Dati aziendali (ragione sociale, P.IVA, CF, indirizzo, email admin)
- Step 2: Configurazione piano (free/pro/enterprise), limiti (max utenti, cantieri, storage)
- Step 3: Moduli attivi (GPS tracking, OCR, API access — toggle switches)
- Step 4: Riepilogo e conferma
- Validazione P.IVA duplicata, email format, campi obbligatori
- Al submit: aggiunge a mock array + toast successo + redirect a lista

### 3. Refactor Dettaglio Azienda (`src/pages/superadmin/SuperAdminAziendaDetail.tsx`)

Ristrutturare con Tabs:
- **Tab Overview**: info aziendali attuali + health score + settings tenant + features attive
- **Tab Cantieri**: lista cantieri del tenant con stato e statistiche
- **Tab Fatturazione**: storico pagamenti, piano attuale, prossima scadenza, bottone upgrade/downgrade
- **Tab Utenti**: lista esistente (già presente) + azioni reset password, disabilita
- **Tab Log Audit**: azioni superadmin su questa azienda (filtrate da mockSuperAdminLog)

Azioni in header: Impersona, Sospendi/Riattiva (con AlertDialog conferma), Export Dati (genera JSON)

### 4. Pagina Log Audit Globale (`src/pages/superadmin/SuperAdminAuditLog.tsx`)

Lista cronologica tutte le azioni superadmin:
- Filtri: tipo azione, tenant, data range
- Colonne: timestamp, azione, tenant, dettaglio, IP (mock)
- Include impersonation log + azioni CRUD

### 5. Dashboard arricchita (`src/pages/superadmin/SuperAdminDashboard.tsx`)

Aggiungere:
- Card "Storage utilizzato" con progress bar
- Card "Pagamenti in scadenza" con count e lista
- Sezione "Aziende per health score" — mini lista con indicatore verde/giallo/rosso
- Sezione "Attività recenti" — ultime 5 azioni dall'audit log

### 6. Sidebar e routing

- Aggiungere voce "Log Audit" in SuperAdminSidebar
- Rotta `/superadmin/aziende/nuova` per wizard onboarding
- Rotta `/superadmin/audit-log` per log globale
- Bottone "Nuova Azienda" in pagina lista aziende

## File creati/modificati

| File | Azione |
|------|--------|
| `src/data/mock-superadmin.ts` | Modifica — tenant settings, subscriptions, audit log, campi estesi |
| `src/pages/superadmin/SuperAdminNuovaAzienda.tsx` | Nuovo — wizard onboarding multi-step |
| `src/pages/superadmin/SuperAdminAziendaDetail.tsx` | Modifica — refactor con tabs e azioni |
| `src/pages/superadmin/SuperAdminAuditLog.tsx` | Nuovo — log audit globale |
| `src/pages/superadmin/SuperAdminDashboard.tsx` | Modifica — widget aggiuntivi |
| `src/components/layout/SuperAdminSidebar.tsx` | Modifica — voce Log Audit |
| `src/App.tsx` | Modifica — rotte nuova-azienda e audit-log |

## Vincoli

- **No Supabase** — tutto mock, nessuna Edge Function reale
- **No 2FA** — simulazione login automatico già in uso
- **No export ZIP/GDPR reale** — genera JSON scaricabile con dati mock del tenant
- **No cursor-based pagination** — lista mock <10 tenant, filtro client-side sufficiente
- Riuso componenti esistenti (TenantStatusBadge, AlertDialog, Tabs, Switch)

