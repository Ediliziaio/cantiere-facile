

## Galleria Cantiere — Foto, Materiali e File di Cantiere

### Obiettivo
Aggiungere a ogni cantiere la possibilità di caricare e visualizzare foto, materiali e file generici (rapportini, note, avanzamento lavori) tramite un nuovo tab "Galleria" nella pagina dettaglio cantiere. Pensato per essere usato anche da operai sul campo da mobile.

### Modifiche

**1. `src/data/mock-data.ts`** — Nuovi tipi e dati mock:
- `FileCantiere` interface: id, cantiere_id, nome_file, tipo (`foto` | `materiale` | `rapportino` | `altro`), descrizione, data_caricamento, caricato_da (nome), dimensione_kb, url (placeholder), thumbnail_url (per foto)
- `mockFileCantiere[]`: ~8-10 file mock per c1 e c2 (foto cantiere, DDT materiali, rapportini giornalieri, planimetrie)

**2. Nuovo componente `src/components/cantiere/GalleriaCantiere.tsx`**:
- **Filtro per tipo**: chip/toggle per filtrare foto, materiali, rapportini, tutti
- **Griglia foto**: layout a griglia responsive (2 col mobile, 3-4 col desktop) per le foto con thumbnail, data e descrizione
- **Lista file**: per materiali/rapportini, layout lista con icona tipo file, nome, descrizione, data, chi l'ha caricato
- **Dialog anteprima**: click su foto apre lightbox con immagine grande, descrizione e metadati
- **Upload inline**: zona drag & drop (riutilizzando il pattern di `DocumentUploadZone`) con select tipo file e campo descrizione opzionale
- **Azioni**: download e elimina per ogni file

**3. `src/pages/CantiereDetail.tsx`** — Aggiungere tab "Galleria":
- Nuovo `TabsTrigger` "Galleria" con conteggio file
- `TabsContent` che renderizza `GalleriaCantiere` passando il cantiere_id

### File coinvolti
- `src/data/mock-data.ts` — tipo `FileCantiere` + mock data
- `src/components/cantiere/GalleriaCantiere.tsx` — nuovo componente
- `src/pages/CantiereDetail.tsx` — nuovo tab Galleria

