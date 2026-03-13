

# Calendario: indirizzo, modifica/cancella appuntamenti, notifiche promemoria, mobile check

## Modifiche

### 1. Aggiungere `indirizzo` all'interfaccia appuntamento — `src/data/mock-calendar.ts`
- Aggiungere campo opzionale `indirizzo?: string` a `CalendarAppuntamento`
- Aggiornare i mock con indirizzi esempio (auto-fill dall'indirizzo del cantiere quando presente)

### 2. Campo indirizzo nel dialog — `src/components/calendario/NuovoAppuntamentoDialog.tsx`
- Aggiungere campo `Input` per indirizzo tra descrizione e data/orari
- Auto-compilare l'indirizzo quando l'utente seleziona un cantiere (leggendo `indirizzo` + `comune` da `mockCantieri`)
- Includere `indirizzo` nell'oggetto salvato

### 3. Modifica e cancellazione appuntamenti — `src/components/calendario/NuovoAppuntamentoDialog.tsx` + `CalendarDayDetail.tsx` + `Calendario.tsx`
- Rendere il dialog riutilizzabile per edit: accettare prop opzionale `editAppuntamento?: CalendarAppuntamento` che precompila il form
- In `CalendarDayDetail`, aggiungere pulsanti **Modifica** (icona Pencil) e **Elimina** (icona Trash2) su ogni appuntamento, con conferma per l'eliminazione (AlertDialog)
- In `Calendario.tsx`: aggiungere state per l'appuntamento in modifica, callback `onEditAppuntamento` e `onDeleteAppuntamento` che aggiornano `extraAppuntamenti` e i mock
- Mostrare l'indirizzo nel dettaglio appuntamento con icona MapPin

### 4. Notifiche/promemoria per appuntamenti nelle prossime 24h — `CalendarDayDetail.tsx` + `Calendario.tsx`
- In `Calendario.tsx`, calcolare gli appuntamenti imminenti (entro 24h dalla data corrente) confrontando `data` + `ora_inizio`
- Mostrare un banner/alert giallo in cima alla pagina: "Hai N appuntamenti nelle prossime 24 ore" con elenco compatto (titolo + ora)
- Usare `toast` di sonner per mostrare una notifica al caricamento della pagina se ci sono appuntamenti imminenti

### 5. Responsive mobile — `MonthGrid.tsx` + `CalendarDayDetail.tsx`
- Verificare e correggere:
  - Grid cells su mobile (h-[70px]) con solo pallini colorati — già presente, aggiungere pallino per appuntamenti con indirizzo
  - TabsList nel dettaglio: rendere scrollabile orizzontalmente su mobile con `overflow-x-auto scrollbar-hide`
  - Dialog di creazione: grid cols-3 → cols-1 su mobile per data/orari
  - Font size e padding compatti su mobile

## File coinvolti

| File | Azione |
|------|--------|
| `src/data/mock-calendar.ts` | Aggiunge `indirizzo` all'interfaccia e ai mock |
| `src/components/calendario/NuovoAppuntamentoDialog.tsx` | Campo indirizzo, supporto edit mode |
| `src/components/dashboard/CalendarDayDetail.tsx` | Mostra indirizzo, pulsanti modifica/elimina, responsive tabs |
| `src/pages/Calendario.tsx` | State edit/delete, banner promemoria 24h, toast notifica |

