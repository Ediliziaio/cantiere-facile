

# Piano: Ottimizzazione UX Impostazioni — Allineamento e contenuto

## Problema

Il contenuto della pagina profilo si estende troppo a destra, occupando tutto lo spazio disponibile. I valori vengono tagliati dal bordo. Manca un `max-width` sul contenuto e il layout non è bilanciato rispetto alla sidebar.

## Fix

### 1. `SettingsLayout.tsx` — Aggiungere `max-width` al contenuto
Aggiungere `max-w-4xl` al `<main>` per limitare la larghezza del contenuto e allinearlo meglio con la sidebar.

### 2. `ImpostazioniProfilo.tsx` — Migliorare il layout profilo
- Aggiungere `max-w-3xl` al container dei dati per evitare che le righe si estendano troppo
- Migliorare la leggibilità con `break-words` / `truncate` sui valori lunghi (es. Codice ATECO)
- Rendere le card statistiche più compatte e allineate

### File modificati
| File | Modifica |
|------|----------|
| `src/components/layout/SettingsLayout.tsx` | `max-w-4xl` su main |
| `src/pages/impostazioni/ImpostazioniProfilo.tsx` | Max-width contenuto, truncate valori lunghi |

