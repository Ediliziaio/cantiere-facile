

## Anteprima e Download documenti

Aggiungo a ogni riga documento (in Documenti, CantiereDetail, e ovunque appaiano) due pulsanti: **Visualizza** (apre anteprima in dialog) e **Scarica** (download diretto).

### Modifiche

**1. Nuovo componente `src/components/cantiere/DocumentActions.tsx`**

Componente riutilizzabile con due pulsanti icona (`Eye` e `Download`):
- **Visualizza**: apre un `Dialog` con anteprima del file. Per PDF mostra un `<iframe>`, per immagini un `<img>`, per altri formati mostra nome + info con link di download.
- **Scarica**: genera un download simulato (essendo mock data, mostra un toast di conferma). Quando ci sarà un backend reale, punterà all'URL del file.

Accetta come props: `nomeFile`, `categoria`, `dataCaricamento`, `stato`.

**2. Aggiorno `src/pages/Documenti.tsx`**

Ogni riga documento mostra i pulsanti `DocumentActions` accanto al badge di stato.

**3. Aggiorno `src/pages/CantiereDetail.tsx`**

Tab "Documenti": aggiungo gli stessi pulsanti di anteprima/download a ogni riga.

**4. Aggiorno `src/pages/MezzoDetail.tsx`**

Se ci sono documenti collegati al mezzo, aggiungo i pulsanti anche lì.

### File coinvolti
- `src/components/cantiere/DocumentActions.tsx` (nuovo)
- `src/pages/Documenti.tsx` (modifica)
- `src/pages/CantiereDetail.tsx` (modifica)
- `src/pages/MezzoDetail.tsx` (modifica)

