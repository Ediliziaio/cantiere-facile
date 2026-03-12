

# Piano: Sistema Billing Mock per SuperAdmin e Tenant

## Stato attuale

- **Tariffe.tsx**: pagina pricing pubblica con 3 piani (Starter €0, Professional €32/26, Business €42/34) — solo marketing, nessun checkout
- **SuperAdminDashboard**: MRR statico €1.290 in mock stats
- **SuperAdminAziendaDetail**: tab Fatturazione con storico pagamenti mock (subscriptions)
- **mock-superadmin.ts**: `MockSubscription` con 6 record, `platformStats.mrr`
- **No Supabase connesso**, no Stripe connesso — tutto mock

## Cosa implementare (scope ridotto, no Stripe reale)

Dato che non c'è Supabase ne Stripe connessi, implemento UI billing completa con mock data, predisposta per futura integrazione Stripe.

### 1. Pagina Billing Tenant (`src/pages/Billing.tsx`)

Area billing accessibile dall'app tenant (`/app/billing`):
- Card piano attuale con dettagli (nome, prezzo, periodo, prossimo rinnovo)
- Storico fatture/pagamenti con stato (pagato, in scadenza, scaduto) e download PDF mock
- Sezione metodo di pagamento (carta mock last4, scadenza, bottone "Aggiorna" — toast mock)
- Bottone Upgrade/Downgrade piano → apre dialog con i 3 piani e conferma (toast mock)
- Bottone "Gestisci abbonamento" → toast "Apertura portale Stripe..." (predisposto)

### 2. Mock data billing estesi (`src/data/mock-billing.ts`)

- `MockInvoice`: id, tenant_id, numero_fattura (progressivo), importo, iva, totale, stato, data_emissione, data_scadenza, pdf_url (mock)
- `MockPaymentMethod`: tipo (card/sepa), last4, scadenza, is_default
- Dati mock: 6 fatture per tenant t1, 1 metodo pagamento per tenant
- Metriche finanziarie mock: MRR, ARR, churn_rate, ltv, outstanding_revenue, revenue_trend 12 mesi

### 3. Dashboard Finanziaria SuperAdmin (`src/pages/superadmin/SuperAdminBilling.tsx`)

Nuova pagina `/superadmin/billing`:
- KPI cards: MRR, ARR, Churn Rate, LTV, Outstanding
- Line chart revenue trend 12 mesi (recharts)
- Pie chart distribuzione piani (Free/Pro/Enterprise)
- Tabella fatture recenti cross-tenant con filtri stato
- Sezione "Azioni manuali": bottone crea fattura manuale, registra pagamento (toast mock)

### 4. Routing e navigazione

- Aggiungere `/app/billing` in App.tsx dentro AppLayout
- Aggiungere voce "Billing" in SuperAdminSidebar (`/superadmin/billing`)
- Aggiungere voce "Abbonamento" in AppSidebar
- Lazy load entrambe le pagine

## File creati/modificati

| File | Azione |
|------|--------|
| `src/data/mock-billing.ts` | Nuovo — fatture, metodi pagamento, metriche finanziarie |
| `src/pages/Billing.tsx` | Nuovo — pagina billing tenant |
| `src/pages/superadmin/SuperAdminBilling.tsx` | Nuovo — dashboard finanziaria superadmin |
| `src/App.tsx` | Modifica — rotte billing |
| `src/components/layout/SuperAdminSidebar.tsx` | Modifica — voce Billing |
| `src/components/layout/AppSidebar.tsx` | Modifica — voce Abbonamento |

## Vincoli

- **No Stripe reale** — nessun checkout, webhook, o API call. Tutto simulato con mock e toast
- **No fattura XML SDI** — solo UI con download JSON/PDF placeholder
- **No Supabase** — dati in memoria
- Predisposto per Stripe: commenti e struttura dati compatibili con futura integrazione

