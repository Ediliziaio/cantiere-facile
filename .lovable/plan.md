

## Diario di Cantiere Giornaliero

### Obiettivo
Aggiungere un tab "Diario" nel dettaglio cantiere per registrare giornalmente attività svolte, condizioni meteo, problemi riscontrati e foto collegate. Pensato per uso da campo, anche mobile.

### Modifiche

**1. `src/data/mock-data.ts`** — Nuovi tipi e dati mock:
- `DiarioCantiere` interface: id, cantiere_id, data, meteo (`sereno` | `nuvoloso` | `pioggia` | `neve` | `vento`), temperatura, attivita (testo libero), problemi (testo libero, opzionale), note (opzionale), foto_ids (array di id da `mockFileCantiere`), compilato_da, ore_lavorate, operai_presenti
- `mockDiarioCantiere[]`: ~5-6 voci per c1 e 2-3 per c2, con riferimenti a foto esistenti nella galleria

**2. Nuovo componente `src/components/cantiere/DiarioCantiere.tsx`**:
- **Lista cronologica**: card per ogni giorno, ordinate per data decrescente
- Ogni card mostra: data, icona meteo + temperatura, attività svolte, problemi (evidenziati in rosso/arancione se presenti), foto collegate come thumbnails cliccabili, ore lavorate e operai presenti
- **Form nuova voce**: dialog con campi data (datepicker), select meteo con icone, temperatura, textarea attività, textarea problemi, textarea note, input ore lavorate, input operai presenti, possibilità di collegare foto dalla galleria
- **Filtro per mese**: select per filtrare le voci per mese

**3. `src/pages/CantiereDetail.tsx`** — Nuovo tab "Diario":
- Aggiungere `TabsTrigger` "Diario" con conteggio voci
- `TabsContent` che renderizza `DiarioCantiere` passando il cantiere_id

### File coinvolti
- `src/data/mock-data.ts` — tipo `DiarioCantiere` + mock data
- `src/components/cantiere/DiarioCantiere.tsx` — nuovo componente
- `src/pages/CantiereDetail.tsx` — nuovo tab Diario

