

# Calendario: cantiere di riferimento + sistema appuntamenti

## Modifiche

### 1. Dati mock appuntamenti — `src/data/mock-calendar.ts`
- Aggiungere interfaccia `CalendarAppuntamento` con: `id`, `titolo`, `descrizione`, `data` (YYYY-MM-DD), `ora_inizio`, `ora_fine`, `cantiere_id?`, `cantiere_nome?`, `assegnato_a` (array di `{id, nome}`), `colore`
- Aggiungere array `mockAppuntamenti` con 5-6 appuntamenti mock distribuiti su date di marzo 2026, alcuni legati a cantieri, altri generici
- Estendere `CalendarDayData` con campo `appuntamenti: CalendarAppuntamento[]`
- In `buildCalendarData`, popolare gli appuntamenti per data (filtrando per cantiere se presente)

### 2. Chip appuntamenti nella griglia — `src/components/calendario/MonthGrid.tsx`
- Aggiungere chip blu/viola per gli appuntamenti (icona `CalendarCheck`) accanto ai chip presenze/scadenze
- Su mobile: pallino blu aggiuntivo
- Mostrare il nome cantiere nel chip presenze quando visibile (es. "3 pres. — Ponte Vecchio")

### 3. Tab Appuntamenti nel dettaglio giorno — `src/components/dashboard/CalendarDayDetail.tsx`
- Aggiungere quarta tab **"Appuntamenti"** con icona `CalendarCheck`
- Ogni appuntamento mostra: titolo, orario, cantiere (se presente), lista assegnatari con avatar/iniziali
- Pulsante "Nuovo appuntamento" che apre il dialog di creazione

### 4. Dialog creazione appuntamento — `src/components/calendario/NuovoAppuntamentoDialog.tsx`
- Dialog con form: titolo, descrizione, data (precompilata con giorno selezionato), ora inizio/fine, cantiere (select opzionale da `mockCantieri`), assegna a (multi-select da `mockLavoratori`)
- Al salvataggio: aggiunge l'appuntamento allo state locale della pagina Calendario (non persistente, mock)

### 5. Pagina Calendario — `src/pages/Calendario.tsx`
- Gestire state locale per appuntamenti aggiunti dall'utente
- Merge appuntamenti mock + appuntamenti creati nella `calendarData`
- Passare callback `onAddAppuntamento` al `CalendarDayDetail`
- Aggiungere pulsante "+ Appuntamento" nell'header della pagina

## File coinvolti

| File | Azione |
|------|--------|
| `src/data/mock-calendar.ts` | Modifica — aggiunge interfaccia e mock appuntamenti |
| `src/components/calendario/MonthGrid.tsx` | Modifica — chip appuntamenti + cantiere |
| `src/components/dashboard/CalendarDayDetail.tsx` | Modifica — tab appuntamenti |
| `src/components/calendario/NuovoAppuntamentoDialog.tsx` | Nuovo — form creazione appuntamento |
| `src/pages/Calendario.tsx` | Modifica — state appuntamenti, pulsante header |

