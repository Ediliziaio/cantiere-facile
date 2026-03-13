

# Analisi Completa SuperAdmin — Criticità e Bug

Ho analizzato in dettaglio tutte le 10 pagine SuperAdmin, i layout, la sidebar, la bottom nav mobile e i dati mock. Ecco i risultati.

---

## Criticità trovate

### 1. Rotta `/superadmin` senza redirect — BUG
Navigando a `/superadmin` (senza `/dashboard`) si vede il layout vuoto perché non c'è un `<Route index>` che faccia redirect alla dashboard. L'utente vede solo header + sidebar senza contenuto.

**Fix**: Aggiungere `<Route index element={<Navigate to="dashboard" replace />} />` dentro il blocco `<Route path="/superadmin">`.

### 2. Colore `bg-superadmin` nei pulsanti di NuovaAzienda — Incoerenza Design
I pulsanti "Avanti" e "Crea Azienda" usano `bg-superadmin` (blu/viola `239 84% 67%`) invece del design system arancione (`primary`). Questo è incoerente con la UX unificata documentata nella memoria architetturale.

**Fix**: Sostituire `bg-superadmin hover:bg-superadmin/90` con classi standard del primary button.

### 3. Stepper di NuovaAzienda usa `text-superadmin` — Incoerenza Design
Lo step attivo nello stepper usa `bg-superadmin/10 text-superadmin` invece del primary color.

**Fix**: Uniformare al primary color.

### 4. Impersonation Banner sovrappone la TopBar — BUG UX
Il banner di impersonazione è `fixed top-0 z-[9999]` ma il layout non aggiunge padding-top quando è attivo. Risultato: il banner copre la TopBar e parte del contenuto.

**Fix**: Aggiungere `pt-10` condizionale al wrapper principale in `AppLayout` quando `impersonation.isImpersonating` è true.

### 5. Supporto — Tabella inbox non responsive su mobile
La tab Inbox del Supporto usa `<Table>` senza wrapper `hidden md:block` / card mobile alternative. Su mobile la tabella è troppo larga e richiede scroll orizzontale, a differenza delle altre pagine che hanno card layout dedicato.

**Fix**: Aggiungere card layout mobile per la lista ticket nella tab Inbox, come già fatto per le altre pagine.

### 6. Supporto — Tab bar 4 colonne troppo strette su mobile
`TabsList` con `grid grid-cols-4` e icone + testo comprime i tab su schermi piccoli. Il testo viene troncato.

**Fix**: Su mobile mostrare solo le icone, oppure usare tabs scrollabili.

### 7. Analytics — Tabelle Churn Risk e Cohort non responsive
Le tabelle nel tab Churn & Growth e Cohort Retention non hanno versione mobile card. Su schermi piccoli richiedono scroll orizzontale eccessivo.

**Fix**: Aggiungere card layout mobile per le tabelle più complesse (Churn Risk, Cohort).

### 8. Password validation troppo permissiva nel Login
Il messaggio dice "Min. 16 caratteri" ma il codice accetta qualsiasi password `>= 8` caratteri (`password.length < 8`). Incoerenza tra UI e logica.

**Fix**: Allineare la validazione al messaggio mostrato (16 char) oppure aggiornare il messaggio.

---

## Sezioni funzionanti correttamente

| Pagina | Desktop | Mobile | Note |
|--------|---------|--------|------|
| Dashboard | OK | OK | Stats, grafici, health score, quick actions |
| Aziende | OK | OK | Tabella desktop + card mobile, ricerca, impersonazione |
| Dettaglio Azienda | OK | OK | Tabs, export JSON, sospensione/riattivazione |
| Nuova Azienda | OK | OK | Wizard 4 step (eccetto colori, vedi sopra) |
| Login | OK | OK | 2FA TOTP, lockout (eccetto validazione, vedi sopra) |
| Audit Log | OK | OK | Filtri, export CSV, card mobile, hash chain |
| Billing | OK | OK | KPI, grafici revenue/pie, fatture con card mobile |
| Impostazioni | OK | OK | Profilo, 2FA, backup codes, sessioni, alerts |
| Sidebar | OK | N/A | Collapsible groups, permission-based |
| Bottom Nav | N/A | OK | Sheet menu con permessi |

---

## Piano di fix

| # | Fix | File |
|---|-----|------|
| 1 | Aggiungere redirect `/superadmin` → `/superadmin/dashboard` | `src/App.tsx` |
| 2-3 | Uniformare colori `superadmin` → `primary` nei pulsanti e stepper | `SuperAdminNuovaAzienda.tsx` |
| 4 | Aggiungere padding-top dinamico per impersonation banner | `AppLayout.tsx` |
| 5-6 | Rendere responsive la tab Inbox Supporto (card mobile + tab icons) | `SuperAdminSupporto.tsx` |
| 7 | Aggiungere card mobile per tabelle Churn Risk e Cohort | `SuperAdminAnalytics.tsx` |
| 8 | Allineare validazione password al messaggio (8 → 16 o aggiornare testo) | `SuperAdminLogin.tsx` |

