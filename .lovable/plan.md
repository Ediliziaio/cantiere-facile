

## Cantiere in Cloud — Implementation Plan

### Phase 1: Foundation & Navigation Shell
- Set up design system: Barlow Semi Condensed (headings) + Inter (body) from Google Fonts, color palette (orange primary #F97316, dark #1C1917, surface #FAFAF9, status colors), no drop shadows anywhere
- Build the app shell with collapsible sidebar navigation (all 10 sections with icons and Italian labels) and top bar (tenant name, avatar, notification bell)
- Create shared UI components: DocumentStatusBadge (🟢🟡🔴⚪), CantiereSummaryCard, ScadenzaAlert banner
- Set up all routes with placeholder pages
- Mobile: floating action button (FAB) navigation instead of bottom bar, per design brief

### Phase 2: Landing Page & Auth
- Public landing page at `/` with hero, features grid, and "Inizia gratis" CTA — industrial-minimal style
- Login page (`/login`) with email/password form
- Registration page (`/register`) for new tenant company signup
- Auth context and protected route wrapper (mock auth for now, Supabase later)

### Phase 3: Dashboard
- `/dashboard` with overview cards: cantieri attivi, documenti in scadenza (30 days), accessi oggi, subappaltatori con problemi
- Quick action buttons for common tasks
- Recent activity feed
- All populated with realistic Italian mock data (Rossi Costruzioni S.r.l.)

### Phase 4: Cantieri Module
- `/cantieri` — "Stato Cantiere" live grid view: each CantiereSummaryCard shows compliance %, plus a semaphore grid of colored squares per subcontractor (hover to reveal name)
- `/cantieri/nuovo` — single-page form (no wizard) with accordion sections for optional fields
- `/cantieri/:id` — detail page with sticky header showing site name + status, tabbed content: Documenti, Subappaltatori, Lavoratori, Mezzi, Accessi, Comunicazioni, Checklist
- Mock data: 2 cantieri (Via Roma Milano + Palazzina Bergamo)

### Phase 5: Documenti & Scadenze
- `/documenti` — filterable table of all documents across sites (filter by cantiere, stato, tipo, scadenza), bulk actions
- DocumentUploadZone component with drag & drop, category selector, expiry date picker
- `/scadenze` — dual view: calendar with color dots on expiry dates + list view, filterable by oggi/7gg/30gg/scaduto
- ChecklistProgress circular indicator component

### Phase 6: Subappaltatori & Lavoratori
- `/subappaltatori` — master list with semaphore indicators and % completamento
- `/subappaltatori/:id` — detail with documents, checklist, communications
- `/lavoratori` — list of all workers with document status
- `/lavoratori/:id` — worker detail with documents and access history
- `/mezzi` — vehicle/equipment registry with expiry tracking

### Phase 7: Accessi & Comunicazioni
- `/accessi` — daily access log with filters, export to CSV
- QRCodeModal for worker QR codes
- AccessoLogRow timeline component
- `/comunicazioni` — threaded messages per cantiere with file attachments

### Phase 8: Impostazioni & Notification System
- `/impostazioni` — tenant profile, user management, custom document categories, email notification config
- NotificationDropdown with unread count and recent alerts

### Seed Data (throughout all phases)
- Tenant: "Rossi Costruzioni S.r.l."
- 2 cantieri, 3 subappaltatori (varying compliance), 5 lavoratori, 2 mezzi
- Sample documents with different expiry states
- 7 days of access log entries

### Design Principles Applied Throughout
- Flat design only — no drop shadows, depth via color/scale/structure
- Stone-200 (#E7E5E4) borders for containment instead of shadows
- Orange reserved exclusively for primary CTAs and active navigation
- Functional empty states with next-action CTAs (no illustrations)
- Dense, information-first layouts — "organized toolbox, not art gallery"
- All copy in Italian, professional and direct

> **Note:** When you're ready to connect Supabase (via Lovable Cloud), we'll set up the full database schema, RLS policies, auth, storage, and edge functions. The frontend will be built to easily swap mock data for real Supabase queries.

