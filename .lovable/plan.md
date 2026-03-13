

# Vista giornaliera con timeline oraria

## Cosa fare

Aggiungere una terza modalità di visualizzazione "day" al calendario, con una timeline verticale oraria (07:00–20:00) dove gli appuntamenti sono posizionati come blocchi colorati in base al loro orario e durata.

## Modifiche

### 1. Nuovo componente `src/components/calendario/DayView.tsx`
- Timeline verticale con righe orarie dalle 07:00 alle 20:00 (ogni riga = 1 ora, 60px di altezza)
- Colonna orari a sinistra (etichette "07:00", "08:00", ecc.) + area principale con linee orizzontali separatrici
- Gli appuntamenti vengono posizionati come blocchi `absolute` calcolando `top` e `height` in base a `ora_inizio` e `ora_fine`
- Ogni blocco mostra: barra colorata laterale, titolo, orario, cantiere, assegnatari (chip)
- Indicatore "ora corrente" (linea rossa orizzontale) se il giorno è oggi
- Presenze e scadenze mostrate in una sezione riassuntiva sopra la timeline
- Se non ci sono eventi: messaggio "Nessuna attività per questa giornata"

### 2. Aggiornare `src/pages/Calendario.tsx`
- Estendere `viewMode` a `"month" | "week" | "day"`
- Aggiungere terzo toggle item con icona `CalendarDays` (o `Clock`)
- In modalità "day": navigazione prev/next sposta di 1 giorno, header mostra "Martedì 10 Marzo 2026"
- Rendere il componente `DayView` sotto il toggle condizionale
- Click su un giorno nella MonthGrid o WeekView potrebbe anche switchare a day view (opzionale)

## File coinvolti

| File | Azione |
|------|--------|
| `src/components/calendario/DayView.tsx` | Nuovo — timeline oraria giornaliera |
| `src/pages/Calendario.tsx` | Modifica — terzo viewMode + navigazione giornaliera |

