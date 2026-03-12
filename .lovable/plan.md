

# Piano: PDF Preview + XML FatturaPA + Invio SDI

## Blocco critico: prerequisiti F0, F1, F2 mancanti

Il progetto **non ha alcuna infrastruttura di fatturazione**. Non esistono:

- Nessun tipo `DocumentoFiscale` o `AnagraficaAzienda`
- Nessun componente in `src/components/fatturazione/`
- Nessuna pagina in `src/pages/azienda/`
- Nessuna libreria `src/lib/fatturazione/`
- Nessun database Supabase connesso (nessuna directory `supabase/`)
- Nessun pacchetto `@react-pdf/renderer` installato

Il prompt richiede esplicitamente "Prerequisites: F0, F1, F2 completed" — queste fondamenta (tipi, anagrafica azienda, editor fattura, righe, clienti, tabelle DB) non sono state implementate.

## Cosa posso costruire ora

Senza i prerequisiti, posso creare l'intera struttura da zero in modalità mock/localStorage, ma devo prima costruire le fondamenta che F0-F2 avrebbero fornito. Ecco il piano completo:

### Fase 0: Fondamenta (ciò che F0-F2 avrebbero creato)

**Tipi TypeScript** (`src/types/fatturazione.ts`):
- `AnagraficaAzienda`: ragione_sociale, p_iva, cf, indirizzo, pec, rea, capitale_sociale, regime_fiscale, logo_url, colore_primario, sdi_provider
- `DocumentoFiscale`: id, tipo (fattura/nota_credito/fattura_pa), numero, data_emissione, data_scadenza, stato (bozza/emessa/inviata_sdi/consegnata/accettata/rifiutata), cliente_snapshot, righe[], riepilogo_iva[], totali, pagamento, note, sdi fields
- `RigaFattura`: numero_linea, codice, descrizione, quantita, unita_misura, prezzo_unitario, sconto_percentuale, aliquota_iva, natura, importo
- `ClienteSnapshot`: ragione_sociale, p_iva, cf, indirizzo, codice_sdi, pec

**Mock data** (`src/data/mock-fatturazione.ts`):
- 1 anagrafica azienda di esempio
- 3-4 fatture di esempio con righe, totali, pagamenti

### Fase 1: PreviewFattura Component

`src/components/fatturazione/PreviewFattura.tsx`:
- Layout A4 pixel-perfect (210×297mm scaled) con prop `scale`
- Header: logo + dati azienda a sinistra, badge tipo documento + numero + date a destra
- Box cliente: bg-slate-50 con dati completi, varianti per NC (amber) e PA (blue con CIG/CUP)
- Tabella righe: righe alternate, colonne # | Descrizione | Q.tà | U.M. | Prezzo | Sc.% | IVA | Importo
- Riepilogo IVA + Totali affiancati
- Blocco pagamento: metodo, IBAN monospace, scadenze
- Note + disclaimer regime forfettario automatico
- Footer: P.IVA + branding

### Fase 2: PDF Generation

Installa `@react-pdf/renderer`. Crea `src/lib/fatturazione/generatePDF.ts`:
- Ricrea lo stesso layout di PreviewFattura come PDF Document/Page
- `downloadPDF()`: genera blob → download automatico
- `uploadAndSavePDF()`: placeholder per futuro upload Supabase Storage

### Fase 3: XML FatturaPA Generator

`src/lib/fatturazione/generateXML.ts`:
- `generateFatturaPAXML()`: genera XML FatturaPA 1.2 completo
  - FPA12/FPR12 in base al tipo
  - Tutti i blocchi: DatiTrasmissione, CedentePrestatore, CessionarioCommittente, DatiGeneraliDocumento, DettaglioLinee, DatiRiepilogo, DatiPagamento
  - Gestione DatiRitenuta, DatiBollo, DatiCassaPrevidenziale, ScontoMaggiorazione opzionali
  - Escape XML chars
- `validateXML()`: controlli strutturali base (elementi obbligatori presenti)

### Fase 4: SDI Edge Functions (struttura mock)

Senza Supabase connesso, creo i file come placeholder strutturati:
- `supabase/functions/invia-sdi/index.ts`: struttura completa con TODO per quando DB sarà connesso
- `supabase/functions/sdi-webhook/index.ts`: parser notifiche XML, mapping stati

### Fase 5: Cassetto SDI Page

`src/pages/fatturazione/CassettoSDI.tsx`:
- Header con selettore periodo + export ZIP
- 4 KPI cards (Trasmesse/Consegnate/Scartate/In attesa)
- Tabella filtrabile con badge stato SDI colorati
- Azioni riga: Scarica XML, Scarica Ricevuta, Reinvia
- Link portali AdE

### Fase 6: Routing

Aggiungere rotte in App.tsx:
- `/app/fatturazione/cassetto-sdi`

## File creati/modificati

| File | Azione |
|------|--------|
| `src/types/fatturazione.ts` | Nuovo — tipi completi |
| `src/data/mock-fatturazione.ts` | Nuovo — dati esempio |
| `src/components/fatturazione/PreviewFattura.tsx` | Nuovo |
| `src/lib/fatturazione/generatePDF.ts` | Nuovo |
| `src/lib/fatturazione/generateXML.ts` | Nuovo |
| `src/pages/fatturazione/CassettoSDI.tsx` | Nuovo |
| `src/App.tsx` | Aggiunta rotte fatturazione |

Edge functions (placeholder, non deployabili senza Supabase):
| `supabase/functions/invia-sdi/index.ts` | Nuovo |
| `supabase/functions/sdi-webhook/index.ts` | Nuovo |

## Vincoli

- **No Supabase** — edge functions create come file ma non deployabili. Upload PDF e XML in localStorage
- **No @react-pdf/renderer** — verrà installato. Se l'installazione fallisce, fallback a generazione PDF con `pdf-lib` (già installato)
- **Mock data** — tutto funziona con dati di esempio. Strutturato per futura migrazione a DB
- **XML FatturaPA reale** — la generazione XML sarà completa e valida secondo lo schema 1.2, testabile con validatori AdE

