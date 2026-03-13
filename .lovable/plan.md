

# Fix: Gap tra sidebar e contenuto nelle Impostazioni

## Problema

La sidebar impostazioni usa `--sidebar-width: 16rem` (256px) come default, ma il contenuto visivo della sidebar è molto più stretto (5 voci corte). Questo crea un gap visivo eccessivo tra la fine delle voci sidebar e l'inizio del contenuto. In più il padding `md:p-8` aggiunge ulteriore distanza.

## Fix

### 1. `SettingsLayout.tsx` — Override `--sidebar-width` su SidebarProvider

Passare `style={{ "--sidebar-width": "13rem" }}` a `SidebarProvider` per ridurre la larghezza della sidebar impostazioni da 256px a 208px. Questo si propaga automaticamente sia al spacer div che alla sidebar fixed.

Ridurre anche il padding del main da `md:p-8` a `md:p-6`.

### 2. `ImpostazioniProfilo.tsx` — Rimuovere `max-w-3xl`

Rimuovere il vincolo `max-w-3xl` dal wrapper per permettere al contenuto di occupare meglio lo spazio disponibile. Il card interno con i dati si adatterà alla larghezza disponibile.

### File
| File | Modifica |
|------|----------|
| `src/components/layout/SettingsLayout.tsx` | Override `--sidebar-width` a `13rem`, padding `md:p-6` |
| `src/pages/impostazioni/ImpostazioniProfilo.tsx` | Rimuovere `max-w-3xl` |

