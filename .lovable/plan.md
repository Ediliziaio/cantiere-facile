

## Potenziamento Mezzi + Ottimizzazione Badge/Timbrature/Accessi

### 1. Mezzi d'opera — Da lista semplice a modulo completo

**Mock data (`mock-data.ts`)**: Espando `mockMezzi` con campi completi:
- `stato_operativo`: "operativo" | "in_manutenzione" | "fermo"
- `data_immatricolazione`, `data_ultima_revisione`, `data_prossima_revisione`
- `data_ultima_manutenzione`, `data_prossima_manutenzione`
- `scadenza_assicurazione`, `scadenza_collaudo`
- `ore_lavoro`, `km_percorsi` (opzionale per mezzi su ruote)
- `responsabile`, `note`

Aggiungo 4-5 mezzi con stati diversi (uno con revisione scaduta, uno in manutenzione, ecc.).

**Pagina Mezzi (`Mezzi.tsx`)**: Riscrittura completa:
- Stats in alto: Mezzi operativi / In manutenzione / Con scadenze imminenti
- Filtri per cantiere e stato
- Card per ogni mezzo con: tipo, targa, cantiere, stato operativo (chip colorato), prossima scadenza, documenti collegati
- Click su mezzo → dialog/sezione dettaglio con tutte le info, timeline manutenzioni, documenti allegati

**Nuova pagina `MezzoDetail.tsx`** (o dialog espanso):
- Info generali, stato operativo con chip
- Sezione "Scadenze e Revisioni" con timeline/lista: revisione, manutenzione, assicurazione, collaudo — ognuna con stato (valida/in scadenza/scaduta)
- Sezione "Documenti collegati" che filtra `mockDocumenti` per `riferimento_tipo === "mezzo"`
- Sezione "Storico manutenzioni" con mock entries

### 2. Badge/Timbrature/Accessi — Ottimizzazione e coesione

**Problema attuale**: Accessi (`mockAccessi`) e Timbrature (`mockTimbrature`) sono dati separati e duplicati. La pagina Accessi è troppo semplice.

**Unificazione dati**: Elimino `mockAccessi` come fonte separata. La pagina Accessi usa direttamente `mockTimbrature` (che è già più completa con esito, metodo, geolocalizzazione).

**Pagina Accessi (`Accessi.tsx`)** — Riscrittura completa:
- Stats: Presenti ora (live dot), Ingressi oggi, Uscite oggi, Bloccati
- Widget "Presenti in cantiere" con breakdown per cantiere (riusa `PresenzaLiveWidget`)
- Filtri: cantiere, data, lavoratore
- Log accessi con border-left colorato per esito (come Timbrature)
- Per ogni riga: nome lavoratore, mansione, cantiere, orario, metodo, esito
- Bottone "Registra accesso manuale"

**Pagina Timbrature (`Timbrature.tsx`)** — Miglioramenti:
- Aggiunta filtro per data (date picker)
- Filtro per lavoratore (search/select)
- Colonna mansione del lavoratore
- Link al badge del lavoratore da ogni riga
- Calcolo ore lavorate per giornata (entrata→uscita)
- Riepilogo ore totali nel periodo filtrato

**Pagina BadgeList (`BadgeList.tsx`)** — Miglioramenti:
- Stats in alto: Badge attivi / Sospesi / Revocati / Totali
- Filtro per cantiere e stato
- Search per nome lavoratore
- Bulk actions placeholder (sospendi selezionati)

**Pagina BadgeDetail (`BadgeDetail.tsx`)** — Miglioramenti:
- Sezione "Stato conformità" con checks documenti/formazione/idoneità (come VerificaBadge)
- Sezione "Statistiche presenze": giorni lavorati nel mese, ore totali, media ore/giorno
- Calendario timbrature con possibilità di cambiare mese (prev/next)
- Link rapido a timbrature filtrate per questo badge

**Pagina Scan** — Piccolo miglioramento:
- Dopo registrazione entrata/uscita, mostra riepilogo con ore lavorate oggi

### File modificati/creati

**Modificati**:
- `src/data/mock-data.ts` — Espansione mockMezzi con tutti i campi
- `src/pages/Mezzi.tsx` — Riscrittura completa
- `src/pages/Accessi.tsx` — Riscrittura completa con dati da mockTimbrature
- `src/pages/Timbrature.tsx` — Filtri avanzati + ore lavorate
- `src/pages/BadgeList.tsx` — Stats + filtri + search
- `src/pages/BadgeDetail.tsx` — Conformità + statistiche presenze + navigazione mese calendario

**Creati**:
- `src/pages/MezzoDetail.tsx` — Pagina dettaglio mezzo
- `src/App.tsx` — Aggiunta route `/app/mezzi/:id`

