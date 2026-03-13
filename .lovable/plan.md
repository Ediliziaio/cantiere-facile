

# Fix: Allineamento globale contenuto — rimuovere vincoli Vite default

## Causa principale

Il file `src/App.css` contiene gli stili default del template Vite:

```css
#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
}
```

Questo centra l'intero `#root` a 1280px con padding 2rem, creando lo spazio vuoto a sinistra su schermi larghi (il viewport dell'utente e 1711px). L'app usa gia flexbox e sidebar per il layout, quindi questi vincoli sono controproducenti.

## Fix

### 1. `src/App.css` — Rimuovere vincoli su `#root`
Svuotare o rimuovere le regole `max-width`, `margin: 0 auto`, `padding: 2rem` e `text-align: center` da `#root`. Queste sono resti del template Vite e non servono.

### 2. `src/components/layout/SettingsLayout.tsx` — Allineare padding
Cambiare `md:p-8` a `md:p-6` sul `<main>` per uniformare con `AppLayout`.

### File

| File | Modifica |
|------|----------|
| `src/App.css` | Rimuovere `max-width`, `margin`, `padding`, `text-align` da `#root` |
| `src/components/layout/SettingsLayout.tsx` | `md:p-8` → `md:p-6` |

Questo fix risolve il problema su tutte le pagine dell'app (Dashboard, Cantieri, Impostazioni, ecc.) in un colpo solo.

