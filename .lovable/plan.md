

# Piano: Sicurezza Enterprise SuperAdmin (Mock)

## Stato attuale

- **Login SuperAdmin**: auto-login con mock, nessuna verifica credenziali, nessun 2FA
- **AuthContext**: ruolo singolo `UserRole = "superadmin" | "admin" | "manager"` — no sotto-ruoli superadmin
- **Audit log**: tabella semplice con 9 entry, no hash chain, no immutabilità
- **Impostazioni**: pagina minimale con solo email e nome
- **Sidebar**: uguale per tutti i superadmin, nessun RBAC
- **No Supabase connesso** — tutto mock

## Scope (adattato ai vincoli mock, no backend reale)

Implementare UI completa di security hardening per SuperAdmin: login con 2FA TOTP simulato, RBAC con 4 sotto-ruoli, audit log con hash chain, security settings, e session timeout. Tutto client-side con mock data.

## Implementazione

### 1. Mock data sicurezza (`src/data/mock-security.ts`)

- **`SuperAdminUser`**: id, email, full_name, role (`superadmin` | `superadmin_readonly` | `support_agent` | `finance_admin`), is_active, totp_enabled, last_login_at, failed_login_attempts, locked_until, created_at
- **`SecurityAuditLog`**: estende l'audit log esistente con hash_chain, session_id, changes (old/new values), severity (info/warning/critical)
- **`SecurityAlert`**: id, type (impossible_travel/mass_export/off_hours/unauthorized_access), severity, description, actor, timestamp, resolved
- 4 utenti superadmin mock (uno per ruolo), 12+ security audit log con hash chain, 3 alert mock
- **`permissionMatrix`**: oggetto che mappa ruolo → permessi (tenants.view, tenants.delete, billing.view, tickets.manage, etc.)

### 2. Estensione AuthContext

- Aggiungere `SuperAdminRole` type con 4 sotto-ruoli
- Aggiungere campo `superadminRole` nello state
- Helper `hasPermission(permission: string): boolean` che usa la matrice permessi
- Login ora accetta opzionalmente il sotto-ruolo superadmin

### 3. Login SuperAdmin con 2FA (`src/pages/superadmin/SuperAdminLogin.tsx`)

Rimozione auto-login. Flow a 2 step:
- **Step 1**: email + password (validazione mock)
- **Step 2**: codice TOTP 6 cifre (OTP input con `input-otp` già installato)
- Scelta ruolo mock (select per demo: superadmin/readonly/support/finance)
- Rate limiting simulato: dopo 5 tentativi → toast errore "Account bloccato"
- UI: indicatore sicurezza, icone lock, branding superadmin

### 4. RBAC UI-adaptive

- **SuperAdminSidebar**: filtra voci menu in base al ruolo (support_agent non vede Billing/Analytics/Impostazioni, finance_admin non vede Supporto/Aziende dettaglio)
- **SuperAdminLayout**: mostra ruolo nel header accanto all'email
- **Pagine protette**: componente `RequirePermission` wrapper che mostra "Accesso negato" se ruolo non autorizzato

### 5. Security Settings (`src/pages/superadmin/SuperAdminImpostazioni.tsx`)

Ristrutturazione completa con tabs:
- **Tab Profilo**: info utente, ruolo, ultimo accesso
- **Tab Sicurezza**: stato 2FA (attivo/disattivo), backup codes mock (lista 10 codici mascherati), sessioni attive mock, bottone "Termina tutte le sessioni"
- **Tab Utenti SuperAdmin**: tabella 4 utenti con ruolo, stato, ultimo login, azioni (attiva/disattiva, cambia ruolo — toast mock)
- **Tab Security Alerts**: lista alert anomalie con severity, descrizione, stato (aperto/risolto), azioni

### 6. Audit Log potenziato

Aggiornare `SuperAdminAuditLog.tsx`:
- Colonna severity con colori (info=muted, warning=amber, critical=red)
- Colonna hash (troncato, tooltip con hash completo)
- Filtro per severity
- Badge "Integrità verificata ✓" o "⚠ Hash mismatch" (mock, sempre ok)
- Export CSV mock

### 7. Session timeout

- Hook `useSessionTimeout` con timer 15min inattività
- Dialog avviso 2 minuti prima: "Sessione in scadenza, clicca per continuare"
- Auto-logout se non confermato → redirect a `/superadmin/login`
- Integrato in `SuperAdminLayout`

## File creati/modificati

| File | Azione |
|------|--------|
| `src/data/mock-security.ts` | Nuovo — utenti SA, permessi, alert, audit esteso |
| `src/pages/superadmin/SuperAdminLogin.tsx` | Modifica — 2FA flow + role selector |
| `src/contexts/AuthContext.tsx` | Modifica — sotto-ruoli SA + hasPermission |
| `src/components/layout/SuperAdminSidebar.tsx` | Modifica — filtro voci per ruolo |
| `src/components/layout/SuperAdminLayout.tsx` | Modifica — mostra ruolo + session timeout |
| `src/pages/superadmin/SuperAdminImpostazioni.tsx` | Modifica — tabs sicurezza completa |
| `src/pages/superadmin/SuperAdminAuditLog.tsx` | Modifica — severity, hash chain, export |
| `src/hooks/useSessionTimeout.ts` | Nuovo — timer inattività 15min |

## Vincoli

- **No Supabase** — TOTP, bcrypt, rate limiting tutti simulati con mock/toast
- **No crypto reale** — hash chain calcolato mock (stringhe SHA-like statiche)
- **No HaveIBeenPwned API** — validazione password solo client-side (lunghezza/complessità)
- **No JWT/refresh token** — sessione in-memory come adesso
- Riuso `input-otp` per UI codice 2FA (già installato)

