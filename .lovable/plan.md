

# Gestione Pause nelle Timbrature

## Cosa cambia

Attualmente il sistema gestisce solo `entrata` e `uscita`. Aggiungiamo i tipi `pausa_inizio` e `pausa_fine` per tracciare pause pranzo e altre interruzioni, con calcolo corretto delle ore nette lavorate.

## Modifiche

### 1. `src/data/mock-badges.ts` — Estendere tipo e generare dati mock

- Modificare `TimbraturaTipo` da `"entrata" | "uscita"` a `"entrata" | "uscita" | "pausa_inizio" | "pausa_fine"`
- Nella funzione `generateTimbrature()`, per ogni lavoratore/giorno non bloccato, inserire una pausa pranzo (~12:30–13:15) e occasionalmente una pausa breve (~10:00–10:15)
- Le pause avranno esito `"autorizzato"`, metodo ereditato, stesse coordinate

### 2. `src/pages/Timbrature.tsx` — UI e calcolo ore nette

- **`calcOreLavorate()`**: Riscrivere per sottrarre le pause. Ordinare tutte le timbrature del giorno, sommare i periodi entrata→pausa_inizio e pausa_fine→uscita (o entrata→uscita se no pause). Risultato = ore nette
- **Icone nel log**: Aggiungere icone per pause:
  - `pausa_inizio` → "⏸ Pausa" (icona `Coffee` da lucide)
  - `pausa_fine` → "▶ Fine pausa"
- **Stats card**: Aggiungere una card "Pause oggi" che conta le pause del giorno
- **Filtro tipo**: Aggiungere un nuovo Select per filtrare per tipo (entrata/uscita/pausa) oppure integrarlo nel filtro esistente
- **Dettaglio riga**: Per `pausa_inizio`, mostrare la durata della pausa se esiste il corrispondente `pausa_fine`

### 3. `src/components/badge/TimbratureCalendar.tsx` — Compatibilità

- Nessuna modifica necessaria: il calendario usa solo `esito`, non `tipo`

### 4. `src/data/mock-calendar.ts` — Compatibilità presenze

- In `buildCalendarData`, le pause non generano nuove righe presenze — filtrare solo `entrata`/`uscita` per il calcolo presenze

## Dettaglio calcolo ore nette

```text
Giornata tipo:
07:30 entrata
10:00 pausa_inizio (pausa caffè)
10:15 pausa_fine
12:30 pausa_inizio (pranzo)
13:15 pausa_fine
17:00 uscita

Ore lorde: 9h30m
Pause: 15m + 45m = 1h00m
Ore nette: 8h30m
```

L'algoritmo ordina per timestamp e calcola solo i segmenti "attivi" (tra entrata/pausa_fine e pausa_inizio/uscita).

