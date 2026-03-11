

## Sidebar per categorie + Ottimizzazione mobile (PWA-ready)

### 1. Sidebar desktop — Raggruppamento per categorie

Riscrivo `AppSidebar.tsx` organizzando le voci in gruppi con `SidebarGroupLabel`:

```text
┌─────────────────────┐
│ 🏗 Cantiere in Cloud │
├─────────────────────┤
│ GENERALE            │
│  Dashboard          │
│  Comunicazioni      │
│  Scadenze           │
├─────────────────────┤
│ CANTIERE            │
│  Cantieri           │
│  Documenti          │
│  Lavoratori         │
│  Subappaltatori     │
│  Mezzi              │
├─────────────────────┤
│ PRESENZE            │
│  Accessi            │
│  Badge Digitali     │
│  Timbrature         │
├─────────────────────┤
│ SISTEMA             │
│  Impostazioni       │
└─────────────────────┘
```

Ogni gruppo usa `SidebarGroup` + `SidebarGroupLabel` con separatori visivi. In modalità collapsed (icon-only) i label si nascondono, restano solo le icone.

### 2. Mobile Bottom Nav — Ottimizzazione per app nativa

Riscrivo `MobileBottomNav.tsx`:
- **5 tab principali** nella barra: Dashboard, Cantieri, Accessi, Badge, Menu
- Il **Menu sheet** organizzato per categorie (come la sidebar) con icone grandi e grid 3 colonne
- Aggiunta `safe-area-inset-bottom` per supporto notch/gesture bar iOS
- Animazione smooth sull'apertura del menu

### 3. TopBar mobile — Header ottimizzato

Aggiorno `TopBar.tsx`:
- Su mobile mostra il logo + nome app (attualmente nascosto)
- Icone notifiche e profilo sempre visibili
- Padding sicuro per status bar mobile

### 4. AppLayout — Safe areas

Aggiorno `AppLayout.tsx`:
- Aggiunta `env(safe-area-inset-*)` nel CSS per supporto dispositivi con notch
- Meta viewport già presente in index.html, verifico `viewport-fit=cover`

### 5. index.html — Meta tag mobile

Aggiungo/aggiorno meta tag per ottimizzazione mobile:
- `viewport-fit=cover` per supporto safe areas
- `apple-mobile-web-app-capable`
- `apple-mobile-web-app-status-bar-style`
- Theme color meta tag

### File modificati

- `src/components/layout/AppSidebar.tsx` — Gruppi per categoria
- `src/components/layout/MobileBottomNav.tsx` — Tab ottimizzati + menu categorizzato
- `src/components/layout/TopBar.tsx` — Header mobile migliorato
- `src/components/layout/AppLayout.tsx` — Safe area support
- `index.html` — Meta tag mobile
- `src/index.css` — Utility safe-area

