

# Sidebar: sezioni collassabili con animazione

## Cosa cambia

Le macro-sezioni della sidebar (Generale, Cantiere, Sicurezza, Presenze, Sistema) diventeranno collassabili con click sull'etichetta. La sezione che contiene la route attiva sarà aperta di default. Le altre partono chiuse. Animazione smooth di apertura/chiusura con transizione su altezza e opacità.

## Piano tecnico

### 1. `src/components/layout/AppSidebar.tsx`
- Importare `useLocation` da react-router-dom e `Collapsible, CollapsibleTrigger, CollapsibleContent` da radix
- Aggiungere stato `openGroups` (Set di label) — inizializzato con il gruppo che contiene la route corrente
- Ogni `SidebarGroup` diventa un `Collapsible` controllato
- `SidebarGroupLabel` diventa `CollapsibleTrigger` con una freccia `ChevronDown` che ruota
- `SidebarGroupContent` viene wrappato in `CollapsibleContent` con classi di animazione per transizione smooth (overflow-hidden + transition su grid-template-rows o max-height)
- Aggiungere stili CSS per l'animazione: transizione su `max-height` e `opacity` con duration 200ms

### 2. `src/index.css` (o tailwind config)
- Aggiungere utility class per l'animazione collapsible della sidebar:
```css
[data-state=open] > .sidebar-group-content {
  animation: sidebar-expand 0.2s ease-out;
}
[data-state=closed] > .sidebar-group-content {
  animation: sidebar-collapse 0.2s ease-out;
}
```
- Definire keyframes `sidebar-expand` (da height 0/opacity 0 a auto/1) e `sidebar-collapse` (inverso)

### 3. Stesso pattern per `SuperAdminSidebar.tsx`
- Applicare lo stesso meccanismo collapsible alle sezioni Generale, Monitoraggio, Gestione

| File | Modifica |
|------|----------|
| `src/components/layout/AppSidebar.tsx` | Sezioni collassabili con Collapsible + animazione |
| `src/components/layout/SuperAdminSidebar.tsx` | Stesso pattern collapsible |
| `src/index.css` | Keyframes animazione expand/collapse sidebar |

