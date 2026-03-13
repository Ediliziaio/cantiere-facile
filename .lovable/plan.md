

# Calendario Dashboard — Sezione attività e presenze

## Obiettivo

Aggiungere una sezione calendario interattiva nella Dashboard che mostra su ogni giorno:
- **Presenze/Check-in**: dove è stato ogni lavoratore (da `mockTimbrature`)
- **Scadenze**: documenti in scadenza/scaduti (da `mockScadenze`)
- **Cantieri attivi**: quali cantieri erano operativi in quella data

Cliccando su un giorno si apre un pannello dettaglio con la lista degli eventi.

## Step di sviluppo

### Step 1 — Dati mock calendario
Creare `src/data/mock-calendar.ts` con una funzione che aggrega per data:
- Timbrature → per ogni giorno, lista lavoratori + cantiere dove erano presenti
- Scadenze → per ogni giorno, documenti in scadenza
- Genera un `Map<string, CalendarDayData>` con conteggi e dettagli

### Step 2 — Componente `DashboardCalendar`
Creare `src/components/dashboard/DashboardCalendar.tsx`:
- Usa il componente `Calendar` (react-day-picker) esistente
- Personalizza il rendering dei giorni con indicatori colorati:
  - **Pallino verde**: presenze normali
  - **Pallino arancione**: warning (scadenze in avvicinamento)
  - **Pallino rosso**: bloccati o scaduti
- Sotto il calendario: conteggio presenze del giorno selezionato

### Step 3 — Componente `CalendarDayDetail`
Creare `src/components/dashboard/CalendarDayDetail.tsx`:
- Pannello che appare quando si seleziona un giorno
- Tre sezioni con tabs: **Presenze** | **Scadenze** | **Cantieri**
- Tab Presenze: lista lavoratori con orario entrata/uscita e cantiere
- Tab Scadenze: documenti in scadenza quel giorno
- Tab Cantieri: cantieri attivi con conteggio presenti

### Step 4 — Integrazione nella Dashboard
Modificare `src/pages/Dashboard.tsx`:
- Aggiungere la sezione calendario dopo le stat cards e prima dei cantieri attivi
- Il calendario rispetta il filtro cantiere già presente nella Dashboard
- Layout responsive: calendario + dettaglio giorno affiancati su desktop, sovrapposti su mobile

## File coinvolti

| File | Azione |
|------|--------|
| `src/data/mock-calendar.ts` | Nuovo — aggregazione dati per calendario |
| `src/components/dashboard/DashboardCalendar.tsx` | Nuovo — calendario con indicatori |
| `src/components/dashboard/CalendarDayDetail.tsx` | Nuovo — dettaglio giorno selezionato |
| `src/pages/Dashboard.tsx` | Modifica — integrazione sezione calendario |

