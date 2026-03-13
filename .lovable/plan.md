

# Fix: Sidebar sempre aperta + layout allineato

## Analisi

Ho verificato il layout con il browser e il contenuto risulta allineato correttamente alla sidebar. Il file `App.css` non era mai importato nel progetto (non c'e nessun `import "./App.css"` in nessun file), quindi le modifiche precedenti su quel file non hanno avuto alcun effetto -- ma il layout funzionava gia correttamente senza quei vincoli.

Il problema percepito potrebbe essere legato alla cache del browser o al fatto che la sidebar collassabile crea un layout "mobile" con posizionamento `fixed`. L'utente ha scelto **sidebar sempre aperta**, il che semplifica il layout e rimuove qualsiasi ambiguita.

## Piano

### 1. `src/components/layout/AppSidebar.tsx`
Cambiare `collapsible="icon"` a `collapsible="none"` per rendere la sidebar sempre aperta e non collassabile su desktop.

### 2. `src/components/layout/SettingsSidebar.tsx`
Stessa modifica: `collapsible="none"`.

### 3. `src/components/layout/SuperAdminSidebar.tsx`
Stessa modifica: `collapsible="none"`.

### 4. `src/components/layout/TopBar.tsx`
Rimuovere il `SidebarTrigger` desktop (il pulsante per collassare la sidebar) dato che non serve piu.

### 5. `src/components/layout/SuperAdminLayout.tsx`
Rimuovere il `SidebarTrigger` desktop dalla header del SuperAdmin.

Con `collapsible="none"`, il componente `Sidebar` di shadcn renderizza un semplice `<div>` non-fixed con larghezza fissa (`16rem`), eliminando completamente il posizionamento `fixed` e il meccanismo di spacer. Questo produce un layout flexbox pulito dove sidebar e contenuto sono elementi adiacenti senza gap.

| File | Modifica |
|------|----------|
| `src/components/layout/AppSidebar.tsx` | `collapsible="icon"` → `collapsible="none"` |
| `src/components/layout/SettingsSidebar.tsx` | `collapsible="icon"` → `collapsible="none"` |
| `src/components/layout/SuperAdminSidebar.tsx` | `collapsible="icon"` → `collapsible="none"` |
| `src/components/layout/TopBar.tsx` | Rimuovere `SidebarTrigger` desktop |
| `src/components/layout/SuperAdminLayout.tsx` | Rimuovere `SidebarTrigger` desktop |

