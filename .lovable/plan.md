

# Piano: Unificare UX SuperAdmin con Area Azienda

## Problema

L'area SuperAdmin ha un design completamente diverso dall'area azienda:
- Colori viola/blu (`superadmin`) vs arancione (`primary`) per stati attivi nella sidebar
- Sidebar piatta senza gruppi vs sidebar con sezioni e label
- Header custom inline vs TopBar component riutilizzabile
- Nessun supporto mobile (no bottom nav, sidebar visibile sempre)
- Nessun Suspense fallback per loading

## Soluzione

Allineare completamente l'area SuperAdmin allo stesso design system dell'area azienda, mantenendo solo un piccolo badge/indicatore per distinguere che si è in area admin.

### 1. SuperAdminSidebar — stesso stile di AppSidebar

- Aggiungere gruppi con label (`SidebarGroupLabel`) come AppSidebar:
  - "Generale": Dashboard, Aziende
  - "Monitoraggio": Log Audit, Analytics
  - "Gestione": Billing, Supporto, Impostazioni
- Usare `primary` per active state (`bg-primary/10 text-primary`) invece di `superadmin`
- Aggiungere `hidden md:flex` per nascondere su mobile (come AppSidebar)
- Stessa struttura header con icona `HardHat` + "Cantiere in Cloud" (non Shield + "SuperAdmin")

### 2. SuperAdminLayout — riusare pattern AppLayout

- Sostituire header custom con un componente TopBar simile (o una variante di TopBar)
  - Mostra "Piattaforma Admin" dove ora c'è il nome azienda
  - SidebarTrigger visibile solo su desktop, logo su mobile
  - Ruolo badge + email + logout nel menu utente (dropdown come AppLayout)
  - NotificationCenter se presente
- Aggiungere `Suspense` con `PageFallback` per lazy loading
- Aggiungere `MobileBottomNav` adattato per SuperAdmin con le voci principali

### 3. Colori — rimozione tema superadmin dalla sidebar

- Active state sidebar: `bg-primary/10 text-primary` (arancione, come app)
- Il badge ruolo può restare con colore `superadmin` per distinguere, ma la navigazione usa lo stesso sistema visivo
- Bottoni azioni nelle pagine: usare `primary` invece di `bg-superadmin`

### 4. Mobile SuperAdmin

- Creare `SuperAdminMobileBottomNav` con le voci principali: Dashboard, Aziende, Supporto, Menu (sheet con il resto)
- Stessa struttura a griglia del `MobileBottomNav` dell'app

### 5. Login page

- Cambiare branding da viola Shield a arancione HardHat per coerenza con il resto dell'app
- Mantenere il flow 2FA identico

## File modificati

| File | Azione |
|------|--------|
| `src/components/layout/SuperAdminSidebar.tsx` | Modifica — gruppi, label, colori primary, hidden md:flex |
| `src/components/layout/SuperAdminLayout.tsx` | Modifica — TopBar-style header, Suspense, mobile nav |
| `src/components/layout/SuperAdminMobileBottomNav.tsx` | Nuovo — bottom nav mobile per superadmin |
| `src/pages/superadmin/SuperAdminLogin.tsx` | Modifica — branding arancione/primary |
| `src/pages/superadmin/SuperAdminDashboard.tsx` | Modifica — bottoni primary invece di superadmin |
| `src/pages/superadmin/SuperAdminAziende.tsx` | Modifica — bottoni primary |
| `src/pages/superadmin/SuperAdminImpostazioni.tsx` | Modifica — colori primary |

## Risultato

Area SuperAdmin visivamente identica all'area azienda: stessa sidebar con gruppi, stesso TopBar, stesso sistema colori, stesso supporto mobile. L'unica differenza sarà un piccolo badge "Admin" nell'header per indicare il contesto.

