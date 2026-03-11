

## Firma Digitale — Fase 1: Dashboard + Pagina Firma Pubblica

### Obiettivo
Costruire le parti più visibili del modulo Firma Digitale con dati mock: la dashboard admin per gestire i documenti da firmare e la pagina pubblica mobile-first dove i firmatari firmano (con canvas disegno + flusso OTP simulato).

### Scope Fase 1
- Mock data per documenti firma, firmatari, campi firma, audit log
- Dashboard firma (`/app/firma`) con KPI e lista documenti
- Pagina creazione documento (`/app/firma/nuovo`)
- Dettaglio documento (`/app/firma/:id`) con stato pipeline e audit log
- Pagina firma pubblica (`/firma/:token`) — flusso completo mobile-first con firma disegno (canvas) e OTP simulato
- Pagine post-firma: successo e rifiuto
- Navigazione: aggiunta voce "Firma Digitale" nella sidebar e menu mobile

### File da creare/modificare

**1. `src/data/mock-firma.ts`** — Nuovo file dati mock:
- Interfacce: `DocumentoFirma`, `CampoFirma`, `Firmatario`, `FirmaData`, `FirmaAuditLog`
- `mockDocumentiFirma[]`: ~5 documenti in vari stati (bozza, in_attesa, parzialmente_firmato, completato, rifiutato)
- `mockFirmatari[]`: ~8 firmatari collegati ai documenti
- `mockCampiFirma[]`: campi firma posizionati sui documenti
- `mockFirmaAuditLog[]`: ~15 eventi di audit trail

**2. `src/pages/firma/FirmaDashboard.tsx`** — Dashboard `/app/firma`:
- 4 KPI cards: In attesa, Firmati mese, Scadono oggi, Rifiutati
- Tabella documenti con filtri per stato/tipo/cantiere
- Status badges colorati (bozza grigio, in attesa ambra, completato verde, ecc.)
- Bottone "Nuovo documento"

**3. `src/pages/firma/FirmaNuovo.tsx`** — Upload `/app/firma/nuovo`:
- Form: nome documento, tipo (select), cantiere associato, descrizione, data scadenza
- Zona drag & drop per upload PDF (simulato)
- Anteprima PDF placeholder
- Bottone "Carica e configura firma"

**4. `src/pages/firma/FirmaDetail.tsx`** — Dettaglio `/app/firma/:id`:
- Pipeline stepper orizzontale: Bozza → In attesa → Parz. Firmato → Completato
- Lista firmatari con stato individuale, metodo, data firma
- Bottoni azione: Invia reminder, Revoca
- Tabella audit log con timestamp, azione, IP
- Link a configurazione campi e gestione firmatari (placeholder per Fase 2)

**5. `src/pages/firma/FirmaPublica.tsx`** — Pagina firma `/firma/:token`:
- Progress stepper: ① Identifica → ② Leggi → ③ Firma → ④ Conferma
- Step 1: identità firmatario (precompilata, readonly)
- Step 2: documento PDF simulato (placeholder) + checkbox "Ho letto il documento"
- Step 3a (disegno): canvas HTML5 con pointer events per firma a mano, cancella/conferma
- Step 3b (OTP): input nome completo + invio OTP simulato + 6 digit boxes con timer
- Step 4: informativa legale + checkbox accettazione + bottone finale "Firma il documento"
- Responsive mobile-first, touch-optimized

**6. `src/pages/firma/FirmaCompletata.tsx`** — Successo `/firma/:token/completa`:
- Animazione successo con check verde
- Riepilogo: data, ora, hash documento
- Messaggio "il documento firmato ti sarà inviato via email"

**7. `src/pages/firma/FirmaRifiuta.tsx`** — Rifiuto `/firma/:token/rifiuta`:
- Textarea motivo rifiuto
- Bottone conferma rifiuto
- Messaggio di conferma

**8. `src/App.tsx`** — Nuove rotte:
- `/app/firma`, `/app/firma/nuovo`, `/app/firma/:id` (dentro AppLayout)
- `/firma/:token`, `/firma/:token/completa`, `/firma/:token/rifiuta` (rotte pubbliche)

**9. `src/components/layout/AppSidebar.tsx`** + **`MobileBottomNav.tsx`**:
- Aggiungere voce "Firma Digitale" con icona `PenTool` nel gruppo "Cantiere"

### Dettagli implementativi chiave

**Canvas firma disegno**: HTML5 Canvas con `pointerdown/pointermove/pointerup`, stroke color `#1C1917`, line width 2-3px, `toDataURL()` per export base64 PNG. Validazione: minimo 50 punti di stroke per evitare firme accidentali.

**Flusso OTP simulato**: genera codice `123456` hardcoded, timer countdown 10 minuti, max 3 tentativi, toast "OTP inviato alla tua email" senza invio reale.

**Status badges**: riutilizzo del pattern `Badge` esistente con varianti colore per ogni stato firma.

### Escluso da Fase 1 (Fase 2)
- Editor interattivo posizionamento campi su PDF (react-pdf + drag & drop)
- Gestione firmatari con ordinamento
- Generazione PDF firmato con pdf-lib
- Edge Functions reali
- Sistema template documenti
- Pagina verifica pubblica documento

