

# Fix: Link Maps non funzionante

## Problema identificato

Ci sono due problemi probabili:

1. **DayView**: L'indirizzo viene mostrato solo se il blocco appuntamento e alto almeno 72px (`height >= 72`). Appuntamenti di 1 ora = 60px, quindi l'indirizzo non appare mai per appuntamenti di durata inferiore a ~1h15m.

2. **Click intercettato**: Nella DayView, i slot cliccabili sotto gli appuntamenti non hanno z-index, ma il blocco appuntamento ha `cursor-default` che potrebbe confondere. Il `stopPropagation` c'e gia sull'`<a>`, ma il problema principale e che l'indirizzo non viene proprio renderizzato per la maggior parte degli appuntamenti.

## Soluzione

### `src/components/calendario/DayView.tsx`
- Abbassare la soglia `height >= 72` a `height >= 44` per mostrare l'indirizzo anche su appuntamenti piu corti
- Oppure: mostrare sempre l'indirizzo se disponibile, adattando il layout (overflow hidden gestisce il taglio visivo)
- Aggiungere `pointer-events-none` al div contenitore dell'appuntamento e `pointer-events-auto` solo sull'`<a>` per garantire che il click sul link funzioni sempre

### `src/components/calendario/WeekView.tsx`
- Verificare che il link Maps sia cliccabile (il `stopPropagation` c'e gia, il `target="_blank"` anche)

### `src/components/dashboard/CalendarDayDetail.tsx`
- L'indirizzo e gia linkato correttamente da implementazione precedente

## Riepilogo modifiche

| File | Azione |
|------|--------|
| `src/components/calendario/DayView.tsx` | Abbassare soglia visibilita indirizzo, fixare pointer events |
| `src/components/calendario/WeekView.tsx` | Verificare/fixare click link |

