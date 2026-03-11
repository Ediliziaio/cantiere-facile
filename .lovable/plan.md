

## Modifica Registro Accessi — Filtro date e vista multi-giorno

### Cosa farò

Aggiungo la possibilità di vedere **tutte le date disponibili** nel sistema (non solo un singolo giorno) e un filtro per **range di giorni**.

### Modifiche tecniche

**1. Nuovo filtro "Tipo visualizzazione"**:
- Singolo giorno (default) — mostra la tabella giornaliera attuale
- Intervallo giorni — permette di selezionare data inizio e data fine, mostra una riga per ogni lavoratore-giorno

**2. Date picker range**:
- Quando selezionato "Intervallo giorni", mostro due date picker (da/a)
- Calcolo tutti i giorni con timbrature disponibili (dai mock dati)

**3. Tabella multi-giorno**:
- Colonne: Lavoratore | Cantiere | Data | Entrata | Uscita | Ore | Esito
- Raggruppamento per lavoratore e giorno (stessa logica attuale ma ripetuta per ogni giorno del range)

**4. Lista giorni disponibili**:
- Selettore rapido con tutte le date che hanno timbrature nei mock dati (24 Feb - 9 Mar 2026)
- Permette di saltare rapidamente a un giorno specifico

### File coinvolti
- `src/pages/Accessi.tsx` — modifica filtri e logica tabella

