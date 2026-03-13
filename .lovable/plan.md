

# Piano: Miglioramento UX pagine SuperAdmin

## Cosa cambia

### 1. SuperAdminDashboard
- Stat cards diventano `Link` cliccabili con `hover:border-primary/40` (come Dashboard azienda)
- Aggiungere sottotitolo "Panoramica generale della piattaforma"
- Quick actions row sotto le stats: "Nuova Azienda", "Vedi Log Audit", "Esporta Report"
- Section headers con link "Vedi tutti →" (Health → /superadmin/aziende, Log → /superadmin/audit-log)
- Usare `Card` component per Storage e Pagamenti (consistenza con Billing)
- Responsive stat grid: `grid-cols-2 md:grid-cols-3 lg:grid-cols-6`

### 2. SuperAdminAziende
- Aggiungere riga summary stats in alto: totale aziende, attive, trial, sospese (4 mini-card)
- Sottotitolo "Gestisci tutte le aziende della piattaforma"
- Avatar/iniziale colorata per ogni azienda nella tabella e nelle card mobile
- Piano con badge colorato (Starter=outline, Pro=default, Business=secondary)
- Health score bar nella tabella desktop (colonna aggiuntiva)
- Mobile cards: aggiungere health score progress bar

### 3. SuperAdminBilling
- KPI grid mobile: `grid-cols-1 sm:grid-cols-2 md:grid-cols-5` (su mobile 1 colonna, non 2)
- Tabella fatture: hidden md:block con card layout per mobile (come pattern Aziende)
- Header azioni: su mobile i bottoni vanno in una riga sotto il titolo (flex-wrap)
- Aggiungere sottotitolo più descrittivo

## File modificati

| File | Azione |
|------|--------|
| `src/pages/superadmin/SuperAdminDashboard.tsx` | Cards cliccabili, quick actions, Card component, "Vedi tutti" |
| `src/pages/superadmin/SuperAdminAziende.tsx` | Summary stats, avatar iniziali, piano badge, health score |
| `src/pages/superadmin/SuperAdminBilling.tsx` | Mobile responsive fatture (table→cards), KPI grid fix |

