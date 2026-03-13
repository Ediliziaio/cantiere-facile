

# Filtri avanzati + Export CSV per SuperAdmin

## Modifiche

### 1. Aziende — Filtri stato + piano + Export CSV

Aggiungere sotto la barra di ricerca:
- **Select "Stato"**: tutti / attivo / trial / sospeso / scaduto
- **Select "Piano"**: tutti / free / pro / enterprise
- **Bottone "Export CSV"**: esporta tutte le righe filtrate (nome, P.IVA, piano, stato, cantieri, utenti, health, ultima attività)

Il filtro si applica in cascata: `search → stato → piano → sort → paginate`.

**File**: `src/pages/superadmin/SuperAdminAziende.tsx`

### 2. Audit Log — Filtro range date

L'Audit Log ha già filtro severity. Aggiungere:
- **Due input `type="date"`** (Da / A) per filtrare per range temporale

**File**: `src/pages/superadmin/SuperAdminAuditLog.tsx`

### 3. Billing — Filtro range date + Export CSV

Billing ha già filtro stato. Aggiungere:
- **Due input `type="date"`** (Da / A) per filtrare per data emissione
- **Bottone "Export CSV"**: esporta fatture filtrate (numero, azienda, descrizione, data, totale, stato)

**File**: `src/pages/superadmin/SuperAdminBilling.tsx`

### Riepilogo cambiamenti

| File | Filtri aggiunti | CSV |
|------|----------------|-----|
| `SuperAdminAziende.tsx` | Stato, Piano | Si |
| `SuperAdminAuditLog.tsx` | Range date (Da/A) | Già presente |
| `SuperAdminBilling.tsx` | Range date (Da/A) | Si |

### UI filtri

I filtri saranno inline nella barra esistente, usando i componenti `Select` e `Input type="date"` già nel design system. Su mobile si wrappano naturalmente con `flex-wrap`. Il bottone CSV va accanto ai filtri con icona `Download`.

