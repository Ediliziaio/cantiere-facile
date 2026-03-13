

# Fix: Barra arancione — OfflineBanner posizionato male nel layout flex

## Causa

`SidebarProvider` renderizza un `<div className="flex w-full">` — cioè flex-row. L'`OfflineBanner` è un figlio diretto di questo div, quindi invece di apparire come una barra orizzontale sopra il contenuto, diventa una colonna verticale arancione a sinistra della sidebar.

Lo stesso problema potenziale esiste per `ImpersonationBanner` e `MobileBottomNav`.

## Fix

**`src/components/layout/AppLayout.tsx`** — Spostare `OfflineBanner` e `ImpersonationBanner` dentro la colonna del contenuto (il div `flex-1 flex flex-col`), sopra la `TopBar`. Spostare `MobileBottomNav` fuori dal `SidebarProvider` o dentro la colonna.

```text
Prima:
SidebarProvider (flex-row)
  ├── OfflineBanner  ← ERRORE: diventa colonna verticale
  ├── ImpersonationBanner
  ├── div.flex (sidebar + content)
  └── MobileBottomNav

Dopo:
SidebarProvider (flex-row)
  └── div.flex.w-full
       ├── AppSidebar
       └── div.flex-col
            ├── OfflineBanner  ← barra orizzontale sopra TopBar
            ├── ImpersonationBanner
            ├── TopBar
            └── main
  MobileBottomNav (fuori)
```

| File | Modifica |
|------|----------|
| `src/components/layout/AppLayout.tsx` | Riorganizzare figli di SidebarProvider |

