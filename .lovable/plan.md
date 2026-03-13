

# Click-to-create su timeline giornaliera + Link indirizzo a Google Maps

## Modifiche

### 1. Click su fascia oraria per creare appuntamento — `DayView.tsx` + `Calendario.tsx`
- Aggiungere prop `onSlotClick: (hour: number) => void` a `DayView`
- Rendere ogni riga oraria cliccabile nella griglia (area vuota, non sopra appuntamenti esistenti): al click, calcolare l'ora dalla posizione Y e chiamare `onSlotClick(hour)`
- Mostrare un cursore `pointer` e un hover leggero sulle righe vuote
- In `Calendario.tsx`: `onSlotClick` apre il dialog di creazione con `defaultDate` già impostata e `oraInizio` pre-compilata all'ora cliccata (es. click su riga 14:00 → inizio 14:00, fine 15:00)

### 2. Link indirizzo alle mappe — `DayView.tsx` + `CalendarDayDetail.tsx` + `WeekView.tsx`
- Ovunque viene mostrato l'indirizzo (icona MapPin + testo), wrappare il testo in un `<a>` che apre Google Maps con l'indirizzo come query: `https://www.google.com/maps/search/?api=1&query=INDIRIZZO_ENCODED`
- Applicare stile link (underline on hover, colore primary) e `target="_blank" rel="noopener"`
- Tocco su mobile apre direttamente l'app Maps nativa

## File coinvolti

| File | Azione |
|------|--------|
| `src/components/calendario/DayView.tsx` | Click su slot orario + link indirizzo a Maps |
| `src/components/calendario/WeekView.tsx` | Link indirizzo a Maps |
| `src/components/dashboard/CalendarDayDetail.tsx` | Link indirizzo a Maps |
| `src/pages/Calendario.tsx` | Handler `onSlotClick` che apre dialog con ora precompilata |

