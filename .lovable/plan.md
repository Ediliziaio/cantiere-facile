

# Calendario stile Google Calendar — Full-width grid

## Problema attuale
Il calendario usa il piccolo componente `react-day-picker` standard con celle 36x36px. Sembra un widget, non una pagina calendario vera. Serve una griglia mensile full-width stile Google Calendar con celle grandi che mostrano gli eventi dentro ogni giorno.

## Approccio

Costruire una **griglia calendario custom** (non usare più `react-day-picker` nella pagina Calendario) che occupa tutta la larghezza disponibile. Ogni cella del giorno è alta ~120px e mostra fino a 2-3 eventi inline (presenze, scadenze) con chip colorati. Cliccando su un giorno si apre il pannello dettaglio laterale/sotto.

### Layout pagina
```text
┌─ Header: Titolo + ◀ Marzo 2026 ▶ + Filtro cantiere ─────────┐
├───────────────────────────────────────────────────────────────┤
│ Lun │ Mar │ Mer │ Gio │ Ven │ Sab │ Dom │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│  1  │  2  │  3  │  4  │  5  │  6  │  7  │
│ ■ 3 │     │ ■ 2 │     │ ⚠ 1 │     │     │  ← chip eventi
│pres.│     │scad.│     │bloc.│     │     │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│ ... │     │     │     │     │     │     │
└─────────────────────────────────────────────────────────────────┘
┌─ Dettaglio giorno selezionato (CalendarDayDetail) ───────────┐
│ Tabs: Presenze | Scadenze | Cantieri                         │
└──────────────────────────────────────────────────────────────┘
```

## Modifiche

### 1. Nuovo componente `src/components/calendario/MonthGrid.tsx`
- Griglia CSS 7 colonne, full-width
- Header con giorni settimana (Lun-Dom)
- Celle alte ~110-130px con:
  - Numero giorno (angolo in alto, evidenziato se oggi, cerchio primary se selezionato)
  - Max 2-3 chip evento: chip verde "3 presenze", chip arancione "1 scadenza", chip rosso "1 bloccato"
  - Se più eventi: "+N altri"
- Giorni fuori mese in grigio chiaro
- Click su cella → seleziona giorno
- Navigazione mese con frecce ◀ ▶

### 2. Aggiornare `src/pages/Calendario.tsx`
- Sostituire il piccolo `Calendar` + Card con `MonthGrid`
- Header con navigazione mese (pulsanti prev/next + label "Marzo 2026")
- Sotto la griglia: `CalendarDayDetail` a tutta larghezza
- Su mobile: griglia con celle più compatte (~70px), solo pallini colorati senza chip testo

### 3. CSS in `src/index.css`
- Stili per la griglia calendario (bordi celle, hover, selezione)

## File coinvolti

| File | Azione |
|------|--------|
| `src/components/calendario/MonthGrid.tsx` | Nuovo — griglia mensile full-width |
| `src/pages/Calendario.tsx` | Modifica — usa MonthGrid, navigazione mese |
| `src/index.css` | Modifica — stili griglia calendario |

