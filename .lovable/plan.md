

## Badge Digitale Module — Implementation Plan

This is a large module. Since there's no Supabase connected yet, we'll build the full frontend with mock data, matching existing patterns. The Edge Function and database migrations will be planned but deferred until Supabase is connected.

### What we'll build (frontend-only with mock data)

**Phase 1: Data & Components**

1. **Extend `mock-data.ts`** with:
   - `mockBadges` — 5 badges (one per lavoratore), 1 sospeso, linked to cantieri
   - `mockTimbrature` — 14 days of check-in/out data with mix of verde/giallo/rosso esiti
   - `mockVerificheAccesso` — verification snapshots
   - Updated `dashboardStats` with `presentiOra` and `badgeInScadenza`

2. **New components** in `src/components/badge/`:
   - `BadgeCard` — dark ID card layout (credit-card proportions, #1C1917 bg, orange accents, white text) with worker info, QR code, photo placeholder, status dot. Uses `qrcode.react` for QR rendering.
   - `BadgeStatusChip` — attivo/sospeso/revocato pill (green/amber/red)
   - `AccessoResultCard` — large verde/giallo/rosso result card shown after scan, with animated entrance
   - `TimbratureCalendar` — monthly grid heatmap showing presence days (green dots for worked days)
   - `PresenzaLiveWidget` — compact card showing count of workers currently on-site

**Phase 2: Pages & Routes**

3. **`/badge`** — Badge management table with columns: nome lavoratore, cantiere, codice badge, stato, data emissione, scadenza, ultimo accesso. Row actions: Visualizza, Sospendi/Riattiva, Revoca. Compliance banner for D.L. 159/2025 at top.

4. **`/badge/nuovo`** — Badge creation form: select cantiere, select lavoratore(s), auto-generate codice_univoco, set scadenza, preview BadgeCard before confirming.

5. **`/badge/:id`** — Badge detail: full BadgeCard preview, timbrature activity log, document status at each access.

6. **`/timbrature`** — Full timbrature log: filterable table (cantiere, date range, lavoratore, esito), color-coded rows, summary stats at top (presenti oggi, ingressi, bloccati).

7. **`/scan`** — Mobile-optimized QR scanner page. Since `html5-qrcode` requires a real camera, we'll build the UI with a simulated scan flow using mock data (tap to simulate scan → shows AccessoResultCard with result → one-tap entrata/uscita registration). Full-screen layout, large touch targets.

8. **`/verifica/:codice`** — Public verification page (outside AppLayout, no auth). Shows worker name, company, cantiere, badge status, document/training/health validity as checkmarks. Branded footer "Verificato da Cantiere in Cloud".

**Phase 3: Integration**

9. **Update sidebar** — Add "Badge Digitali" (IdCard icon) and "Scansiona" (ScanLine icon) between Accessi and Comunicazioni.

10. **Update routes** in `App.tsx` — Add all new routes. `/verifica/:codice` is a public route outside AppLayout.

11. **Update Dashboard** — Add "Presenti Ora" and "Badge in Scadenza" stat cards using PresenzaLiveWidget.

12. **Install `qrcode.react`** — needed for QR code rendering in BadgeCard and badge detail.

### Files to create
- `src/data/mock-badges.ts` — badge/timbrature mock data
- `src/components/badge/BadgeCard.tsx`
- `src/components/badge/BadgeStatusChip.tsx`
- `src/components/badge/AccessoResultCard.tsx`
- `src/components/badge/TimbratureCalendar.tsx`
- `src/components/badge/PresenzaLiveWidget.tsx`
- `src/pages/BadgeList.tsx` (`/badge`)
- `src/pages/BadgeNuovo.tsx` (`/badge/nuovo`)
- `src/pages/BadgeDetail.tsx` (`/badge/:id`)
- `src/pages/Timbrature.tsx` (`/timbrature`)
- `src/pages/Scan.tsx` (`/scan`)
- `src/pages/VerificaBadge.tsx` (`/verifica/:codice`)

### Files to modify
- `src/App.tsx` — add routes
- `src/components/layout/AppSidebar.tsx` — add nav items
- `src/data/mock-data.ts` — add dashboard stats
- `src/pages/Dashboard.tsx` — add Presenti Ora + Badge stat cards

### New dependency
- `qrcode.react` — QR code generation

### Deferred (requires Supabase connection)
- Database migrations for `badges`, `timbrature`, `verifiche_accesso` tables
- Edge Function `verifica-badge`
- Real camera QR scanning with `html5-qrcode`
- PDF export of badge cards

