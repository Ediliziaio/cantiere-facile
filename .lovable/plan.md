

# Vista settimanale + Hover card con dettaglio giornata

## Funzionalita richieste

1. **Vista settimanale**: lista degli appuntamenti della settimana corrente (Lun-Dom), con timeline giornaliera
2. **Hover card su celle griglia**: passando sopra una cella per 2 secondi, appare una scheda popup con il riepilogo della giornata (presenze, appuntamenti, scadenze)

## Modifiche

### 1. Toggle vista Mese/Settimana — `src/pages/Calendario.tsx`
- Aggiungere state `viewMode: "month" | "week"` con toggle button group nell'header (icone Grid3x3 / List)
- Calcolare `weekStart` (lunedi) basato su `selectedDate`
- In vista "week": nascondere `MonthGrid`, mostrare nuovo componente `WeekView`
- Navigazione settimana con frecce prev/next (sposta di 7 giorni)

### 2. Nuovo componente `src/components/calendario/WeekView.tsx`
- Lista verticale dei 7 giorni della settimana (Lun-Dom)
- Ogni giorno mostra: data, nome giorno, e sotto tutti gli appuntamenti + presenze come card compatte
- Appuntamenti con orario, titolo, cantiere, assegnatari (chip colorati)
- Presenze raggruppate per cantiere con conteggio
- Scadenze con badge stato
- Se giorno vuoto: testo "Nessuna attivita"
- Click su giorno seleziona la data nel calendario

### 3. Hover card con delay 2s sulle celle — `src/components/calendario/MonthGrid.tsx`
- Wrappare ogni cella con `HoverCard` di Radix (`@radix-ui/react-hover-card`, gia installato)
- Impostare `openDelay={2000}` e `closeDelay={300}` per il comportamento "resta sopra 2 secondi"
- Il contenuto della hover card mostra un mini-riepilogo:
  - Presenze: lista nomi lavoratori con cantiere (max 5, poi "+N altri")
  - Appuntamenti: titolo + orario
  - Scadenze: conteggio con stato
- Su mobile: disabilitare hover card (non funziona con touch)

## File coinvolti

| File | Azione |
|------|--------|
| `src/components/calendario/WeekView.tsx` | Nuovo — vista lista settimanale |
| `src/components/calendario/MonthGrid.tsx` | Modifica — aggiunge HoverCard con delay 2s |
| `src/pages/Calendario.tsx` | Modifica — toggle mese/settimana, navigazione settimana |

