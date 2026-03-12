

# Piano: Dashboard Analytics Avanzata SuperAdmin

## Stato attuale

- **SuperAdminDashboard**: stats base (aziende, MRR, storage), chart registrazioni, health score, attività recenti
- **SuperAdminBilling**: KPI finanziari (MRR, ARR, Churn, LTV), revenue trend, distribuzione piani, fatture
- **SuperAdminAuditLog**: log filtrabili per azione e ricerca testo
- **Mock data**: 4 tenant, 9 audit log, 6 subscriptions, billing metrics
- **Sidebar**: 5 voci (Dashboard, Aziende, Log Audit, Billing, Impostazioni)
- **No Supabase** — tutto mock data

## Scope (adattato ai vincoli mock, no backend)

Creare una nuova pagina `/superadmin/analytics` con analytics avanzate SaaS: metriche business (cohort, activation, ARPU), churn risk heuristic, expansion opportunities, e geo-analytics Italia. Tutto basato su mock data estesi.

## Implementazione

### 1. Mock data analytics (`src/data/mock-superadmin-analytics.ts`)

Nuovo file con:
- **Cohort data**: matrice retention 6 mesi (% tenant attivi per coorte mensile)
- **Daily Active Sites**: serie 90gg cantieri con almeno 1 checkin/giorno
- **Activation funnel**: signup → first_login → first_checkin → first_document → active_30d (conteggi)
- **MRR Movement**: new, expansion, contraction, churn per mese (6 mesi)
- **Churn risk scores**: per tenant — calcolati da: days_since_last_login, usage_trend, payment_failures, support_tickets — con suggested_action
- **Expansion opportunities**: tenant vicini al cap (utenti/cantieri/storage)
- **Geo data**: distribuzione tenant per regione italiana (20 regioni con count)
- **System health mock**: API p50/p95/p99 response times, error rate, DB connections, uptime

### 2. Pagina Analytics (`src/pages/superadmin/SuperAdminAnalytics.tsx`)

Layout con tabs: **Business** | **Churn & Growth** | **Geo & Market** | **System Health**

**Tab Business:**
- North Star Metric card: "Daily Active Sites" con sparkline 30gg
- ARPU card (MRR / paying_customers)
- Activation funnel (horizontal bar chart o funnel visual)
- MRR Movement stacked bar chart (new/expansion/contraction/churn per mese)
- Cohort retention heatmap table (mesi x coorti, celle colorate per %)

**Tab Churn & Growth:**
- Churn Risk Table: tenant ordinati per risk score, con colonne (nome, score, motivo, giorni ultimo login, azione suggerita, bottone "Contatta")
- Expansion Opportunities: lista tenant con usage % vicino al cap (progress bar), bottone "Suggerisci upgrade"
- Net Revenue Retention rate card

**Tab Geo & Market:**
- Mappa Italia semplificata (tabella con barre orizzontali per regione, no Leaflet — troppo pesante per mock)
- Top 5 province per concentrazione tenant
- Distribuzione per settore (pie chart: residenziale/infrastrutture/industriale/ristrutturazione)

**Tab System Health:**
- Cards: API latency (p50/p95/p99), Error Rate %, Uptime %, DB Connections
- Alert indicators: verde/giallo/rosso basato su soglie
- Mock "ultimo incidente" card

### 3. Routing e sidebar

- Aggiungere voce "Analytics" in SuperAdminSidebar con icona `BarChart3`
- Rotta `/superadmin/analytics` in App.tsx (lazy loaded)

## File creati/modificati

| File | Azione |
|------|--------|
| `src/data/mock-superadmin-analytics.ts` | Nuovo — cohort, funnel, churn risk, geo, system health |
| `src/pages/superadmin/SuperAdminAnalytics.tsx` | Nuovo — pagina analytics con 4 tabs |
| `src/components/layout/SuperAdminSidebar.tsx` | Modifica — voce Analytics |
| `src/App.tsx` | Modifica — rotta analytics |

## Vincoli

- **No Supabase/materialized views** — tutto mock statico
- **No mappa Leaflet** — geo analytics come tabella con barre orizzontali
- **No real-time websocket** — metriche system health statiche mock
- **No ML churn prediction** — heuristic basata su regole semplici (days_since_login, usage_drop)
- Riuso recharts per tutti i grafici

