

## Cantiere in Cloud — SaaS Restructuring Plan

This is a major architectural restructuring of the entire application. The scope is very large, so I'll break it into focused implementation batches. No Supabase is connected yet, so everything remains frontend with mock data.

### Batch 1: Design System + Route Restructuring

**Font swap**: Replace Barlow Semi Condensed + Inter with **Syne** (headings) + **DM Sans** (body) across `index.html`, `index.css`, and `tailwind.config.ts`.

**Add SuperAdmin CSS variables**: Add `--superadmin` indigo accent (`#6366F1`) to the design system.

**Route migration**: Move all tenant routes from `/*` to `/app/*`. Update every `<Link to=...>` and navigation reference across all pages and components. Public routes stay at root level.

New route structure:
```text
/                       Landing
/login                  Tenant login
/register               Tenant registration
/portale/:token         Subcontractor portal (public)
/verifica/:codice       Badge verification (public)
/scan                   QR scanner (public)
/superadmin/login       SuperAdmin login
/superadmin/*           SuperAdmin area
/app/*                  Tenant area (inside AppLayout)
```

**Files modified**: `index.html`, `src/index.css`, `tailwind.config.ts`, `src/App.tsx`, `src/components/layout/AppSidebar.tsx`, `src/components/layout/TopBar.tsx`, `src/pages/Landing.tsx`, `src/pages/Dashboard.tsx`, and all other pages that contain internal `<Link>` references.

### Batch 2: Auth Context + Impersonation System

**Create `src/contexts/AuthContext.tsx`**: React context holding:
- `user` (current logged-in user mock)
- `role` (superadmin / admin / manager)
- `tenantId` (current tenant)
- `isImpersonating` + `impersonatedTenantId` + `impersonatedTenantName`
- `startImpersonation(tenantId)` / `stopImpersonation()`

**Create `src/components/layout/ImpersonationBanner.tsx`**: Fixed orange bar (z-50, 40px) at very top when `isImpersonating === true`. Shows tenant name + "Torna al SuperAdmin" button.

**Create mock data**: `src/data/mock-superadmin.ts` with:
- `mockTenants` array (3-4 tenants with different stati/piani)
- `mockSuperAdmin` user
- `mockImpersonationLog`
- Platform stats (total tenants, active trials, MRR, etc.)

**Create `src/components/layout/TenantStatusBadge.tsx`**: Attivo/Trial/Sospeso/Scaduto pill.

### Batch 3: SuperAdmin UI

**Create `src/components/layout/SuperAdminLayout.tsx`**: Separate layout with indigo-themed sidebar, distinct from tenant AppLayout.

**Create `src/components/layout/SuperAdminSidebar.tsx`**: Indigo accent sidebar with: Dashboard, Aziende, Impostazioni.

**New pages**:
- `src/pages/superadmin/SuperAdminLogin.tsx` — separate login form
- `src/pages/superadmin/SuperAdminDashboard.tsx` — platform metrics cards (aziende attive, trial attivi, cantieri totali, documenti caricati oggi, aziende con doc scaduti, sparkline nuove registrazioni)
- `src/pages/superadmin/SuperAdminAziende.tsx` — tenant list table with columns: Nome, P.IVA, Piano, Stato, Cantieri, Utenti, Ultima attività, Azioni (Visualizza / Entra come Admin / Sospendi)
- `src/pages/superadmin/SuperAdminAziendaDetail.tsx` — single tenant detail page
- `src/pages/superadmin/SuperAdminImpostazioni.tsx` — platform settings

**Impersonation flow**: "Entra come Admin →" button sets impersonation context and redirects to `/app/dashboard`. All tenant pages render normally but with the orange ImpersonationBanner fixed at top.

### Batch 4: Subcontractor Portal

**Create `src/pages/PortaleSubappaltatore.tsx`** at `/portale/:token`:
- Public, no auth, mobile-first
- Shows company name + assigned cantiere
- Document checklist with status indicators (Mancante/In Scadenza/Presente)
- Upload button per document category (reuses DocumentUploadZone)
- Communication thread section
- Overall compliance warning banner

**Mock data**: Add `portal_token` field to existing `mockSubappaltatori`.

### Batch 5: Remaining Integration

- Update `src/pages/Login.tsx` and `src/pages/Register.tsx` to use AuthContext (mock login sets role + tenantId)
- Mobile bottom tab bar for tenant routes (Dashboard, Cantieri, Documenti, Accessi, Menu)
- Wire up AppLayout to check auth context and show ImpersonationBanner conditionally

### Summary of new files
- `src/contexts/AuthContext.tsx`
- `src/data/mock-superadmin.ts`
- `src/components/layout/ImpersonationBanner.tsx`
- `src/components/layout/SuperAdminLayout.tsx`
- `src/components/layout/SuperAdminSidebar.tsx`
- `src/components/layout/TenantStatusBadge.tsx`
- `src/pages/superadmin/SuperAdminLogin.tsx`
- `src/pages/superadmin/SuperAdminDashboard.tsx`
- `src/pages/superadmin/SuperAdminAziende.tsx`
- `src/pages/superadmin/SuperAdminAziendaDetail.tsx`
- `src/pages/superadmin/SuperAdminImpostazioni.tsx`
- `src/pages/PortaleSubappaltatore.tsx`

### Summary of modified files
- `index.html` (fonts)
- `src/index.css` (CSS variables + font families)
- `tailwind.config.ts` (font families + superadmin color)
- `src/App.tsx` (full route restructure)
- `src/components/layout/AppLayout.tsx` (ImpersonationBanner integration)
- `src/components/layout/AppSidebar.tsx` (route prefixes → /app/*)
- `src/components/layout/TopBar.tsx` (auth context)
- `src/pages/Landing.tsx` (link updates)
- `src/pages/Login.tsx` (auth context integration)
- `src/pages/Register.tsx` (auth context integration)
- `src/pages/Dashboard.tsx` (link updates)
- `src/pages/Cantieri.tsx`, `CantiereDetail.tsx`, `NuovoCantiere.tsx` (link updates)
- `src/pages/Documenti.tsx`, `Scadenze.tsx`, `Subappaltatori.tsx`, `Lavoratori.tsx`, `Mezzi.tsx`, `Accessi.tsx`, `Comunicazioni.tsx`, `Impostazioni.tsx` (link updates)
- `src/pages/BadgeList.tsx`, `BadgeNuovo.tsx`, `BadgeDetail.tsx`, `Timbrature.tsx`, `Scan.tsx` (link updates)
- `src/data/mock-data.ts` (add portal_token to subappaltatori)
- `src/components/cantiere/CantiereSummaryCard.tsx` (link prefix update)

> **Note**: This is all frontend with mock data. Database schema, RLS policies, Edge Functions, and real auth will be implemented when Supabase/Lovable Cloud is connected.

