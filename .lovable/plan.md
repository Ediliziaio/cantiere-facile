

# Fix: OfflineBanner nel SettingsLayout — stesso problema di AppLayout

## Problema

Identico al fix precedente su AppLayout: `OfflineBanner` e `ImpersonationBanner` sono figli diretti di `SidebarProvider` (flex-row), quindi appaiono come colonne verticali arancioni invece che barre orizzontali.

## Fix

**`src/components/layout/SettingsLayout.tsx`** — Spostare `OfflineBanner` e `ImpersonationBanner` dentro il div `flex-1 flex flex-col`, sopra la `TopBar`.

| File | Modifica |
|------|----------|
| `src/components/layout/SettingsLayout.tsx` | Spostare banner dentro la colonna contenuto |

