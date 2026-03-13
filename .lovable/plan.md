

# Fix: Spazio vuoto a sinistra nel contenuto Impostazioni

## Problema

Il `<main>` ha `max-w-4xl` che centra il contenuto nel pannello destro, creando spazio vuoto a sinistra. Il contenuto dovrebbe invece partire dal bordo sinistro, subito dopo la sidebar.

## Fix

In `SettingsLayout.tsx`, rimuovere `max-w-4xl` dal `<main>` e spostare il vincolo di larghezza massima dentro le singole pagine dove serve (es. `ImpostazioniProfilo.tsx` già ha il suo layout). Oppure più semplicemente, aggiungere al main solo il padding senza max-width, lasciando che il contenuto si allinei naturalmente a sinistra.

**Modifica**: Cambiare la riga 76 del `<main>`:
- Da: `className="flex-1 p-4 md:p-6 overflow-auto pb-20 md:pb-6 safe-area-left safe-area-right max-w-4xl"`
- A: `className="flex-1 p-4 md:p-8 overflow-auto pb-20 md:pb-6 safe-area-left safe-area-right"`

Poi in `ImpostazioniProfilo.tsx`, wrappare il contenuto in un `<div className="max-w-3xl">` per evitare che le righe si estendano troppo su schermi molto larghi, mantenendo l'allineamento a sinistra.

### File modificati
| File | Modifica |
|------|----------|
| `src/components/layout/SettingsLayout.tsx` | Rimuovere `max-w-4xl` da main |
| `src/pages/impostazioni/ImpostazioniProfilo.tsx` | Wrappare contenuto in `max-w-3xl` (allineato a sinistra) |

