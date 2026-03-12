

# Piano: Sistema Gestione Documentale Avanzato

## Stato attuale

Il progetto ha gia:
- **Documenti.tsx**: pagina lista con filtri per stato, ricerca testuale, upload singolo via `DocumentUploadZone`
- **DocumentUploadZone.tsx**: drag & drop singolo file, selezione categoria e data scadenza
- **DocumentActions.tsx**: preview (PDF iframe, immagini) e download
- **DocumentStatusBadge.tsx**: badge colorati per stato documento
- **GalleriaCantiere.tsx**: galleria foto/file per cantiere con upload, preview, delete
- **mockDocumenti**: 21 documenti con categorie, scadenze, riferimenti a cantieri/lavoratori/mezzi/subappaltatori
- **Supabase NON connesso** — tutto mock/localStorage

## Cosa manca

1. **Upload massivo** — attualmente solo 1 file alla volta
2. **Progress bar** per upload individuali e globali
3. **Validazione file avanzata** — no check MIME type reale, no size limit enforcement, no HEIC support
4. **Griglia documenti** con thumbnail e vista alternativa lista/griglia
5. **Filtri avanzati** — manca filtro per cantiere, tipo riferimento, range date
6. **Batch actions** — selezione multipla per download/elimina
7. **OCR e classificazione** — nessuna estrazione dati strutturati
8. **Workflow stati** — manca il flusso uploaded → processing → validated → approved → archived
9. **Audit trail documenti** — nessun log di chi ha scaricato/modificato/approvato

## Piano implementativo

### 1. Estendere mock data (`src/data/mock-data.ts`)

Aggiungere:
- Campi ai documenti esistenti: `processing_status` ('uploaded'|'processing'|'validated'|'approved'|'archived'), `file_size_kb`, `mime_type`, `sha256_hash`, `extracted_fields` (JSONB-like object), `thumbnail_url`
- `mockDocumentAuditLogs`: array con azioni (upload, view, download, approve, archive) per audit trail
- Type `DocumentExtraction` per campi estratti OCR

### 2. Componente `DocumentUploader.tsx` (nuovo)

Upload massivo enterprise:
- Accetta array di file (multi-select + drag & drop multiplo)
- Validazione pre-upload per ogni file: MIME type check, max 50MB singolo, formati supportati (PDF, JPG, PNG, HEIC, DOC, DOCX, DWG, DXF, TIFF)
- Per ogni file nella queue: progress bar individuale (simulata in mock), stato (pending/uploading/done/error)
- Progress bar globale (X di Y completati)
- Auto-classificazione categoria da filename (pattern matching: "DURC" nel nome → categoria DURC, "POS" → POS, etc.)
- Selezione cantiere di destinazione
- Compressione immagini client-side: se immagine > 2048px lato lungo, ridimensiona via canvas prima di "upload"
- Salvataggio in mock state con generazione SHA-256 hash (via SubtleCrypto API)

### 3. Componente `DocumentGrid.tsx` (nuovo)

Vista documenti avanzata:
- Toggle griglia/lista
- **Vista griglia**: card con icona tipo file, nome troncato, badge stato colorato, data scadenza
- **Vista lista**: tabella con colonne sortabili (nome, categoria, cantiere, scadenza, stato, dimensione)
- Selezione multipla con checkbox per batch actions
- Batch actions toolbar: "Scarica selezionati", "Elimina selezionati", "Approva selezionati"

### 4. Componente `DocumentFilters.tsx` (nuovo)

Filtri avanzati collapsabili:
- Filtro per cantiere (select da mockCantieri)
- Filtro per categoria (multi-select)
- Filtro per stato validazione (processing_status)
- Filtro per tipo riferimento (lavoratore/mezzo/subappaltatore)
- Range date (caricamento e scadenza)
- Ricerca full-text (su nome file + campi estratti)
- Contatore risultati

### 5. Componente `DocumentViewer.tsx` (nuovo)

Modal preview avanzata:
- PDF: iframe con controlli zoom (button +/-), download, stampa
- Immagini: zoom, rotazione (90° steps via CSS transform)
- Metadati visibili: hash SHA-256, dimensione, data upload, uploadato da, stato workflow
- Pulsante "Approva" per avanzare nello stato workflow (da validated → approved)
- Tab "Dati Estratti": mostra i campi OCR estratti (se presenti) in formato key-value
- Tab "Cronologia": audit log del documento (chi ha fatto cosa, quando)

### 6. Hook `useDocumentProcessing.ts` (nuovo)

Simula il workflow di processing documento:
- Accetta un file e restituisce status updates via state
- Pipeline: upload → hash SHA-256 (reale via SubtleCrypto) → classificazione automatica (pattern matching filename + mime) → estrazione campi mock per tipo (DURC: scadenza, P.IVA; POS: revisione, coordinatore) → validazione regole (scadenza > oggi) → stato finale
- Return: `{ status, progress, extractedFields, errors, hash }`

### 7. Refactor pagina `Documenti.tsx`

Riscrivere la pagina usando i nuovi componenti:
- Header con contatori rapidi (totali, in scadenza, scaduti, da verificare)
- `DocumentFilters` collapsabile
- `DocumentGrid` con toggle vista
- `DocumentUploader` in dialog/sheet
- `DocumentViewer` per preview dettagliata

### 8. Aggiungere pagina dedicata `/app/documenti` se non gia presente nel routing

Verificare e aggiornare App.tsx se necessario.

## File creati/modificati

| File | Azione |
|------|--------|
| `src/data/mock-data.ts` | Estendere documenti con processing_status, extracted_fields, audit logs |
| `src/components/cantiere/DocumentUploader.tsx` | Nuovo — upload massivo con progress |
| `src/components/cantiere/DocumentGrid.tsx` | Nuovo — vista griglia/lista con batch actions |
| `src/components/cantiere/DocumentFilters.tsx` | Nuovo — filtri avanzati |
| `src/components/cantiere/DocumentViewer.tsx` | Nuovo — preview avanzata con zoom/rotazione/audit |
| `src/hooks/useDocumentProcessing.ts` | Nuovo — pipeline processing simulata |
| `src/pages/Documenti.tsx` | Refactor completo con nuovi componenti |

## Vincoli

- **No Supabase** — tutto mock/localStorage. Storage bucket, OCR edge functions, e audit trail DB saranno integrabili quando il backend sara connesso
- **No OCR reale** — la classificazione usa pattern matching su filename e i campi estratti sono pre-compilati nel mock per tipo documento. La struttura e pronta per Tesseract.js o API esterne
- **SHA-256 reale** — usa `crypto.subtle.digest` del browser per generare hash autentici dei file caricati
- **Compressione immagini reale** — usa Canvas API per ridimensionare immagini > 2048px
- **Mobile-first** — upload da camera con compressione automatica, UI touch-friendly

