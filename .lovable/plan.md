

## Sezione Comunicazioni — Funzionale a 360°

### Cosa costruisco

Una sezione Comunicazioni completa con: lista conversazioni, chat in tempo reale, creazione nuovi messaggi, filtri per cantiere, notifiche non lette, e allegati.

### Struttura UI

```text
┌─────────────────────────────────────────────────┐
│ Header: Comunicazioni          [+ Nuovo Messaggio] │
├──────────────┬──────────────────────────────────┤
│ Lista thread │  Chat / Dettaglio thread          │
│              │                                    │
│ 🔍 Cerca     │  [Mittente] [Cantiere] [Data]     │
│ Filtro cant. │                                    │
│              │  Messaggio 1...                    │
│ ● Thread 1   │  Messaggio 2...                    │
│   Thread 2   │                                    │
│   Thread 3   │  ┌──────────────────────────────┐ │
│              │  │ Scrivi messaggio...    [Invia]│ │
│              │  └──────────────────────────────┘ │
└──────────────┴──────────────────────────────────┘
```

### File e modifiche

**1. `src/data/mock-comunicazioni.ts`** — Nuovo file mock:
- `mockThreads[]`: id, cantiere_id, oggetto, partecipanti (user ids), ultimo_messaggio, data_ultimo, non_letti count, tipo (generale | urgente | documento)
- `mockMessaggi[]`: id, thread_id, mittente_id, testo, timestamp, letto, allegato (nome_file, tipo)
- ~8 thread e ~25 messaggi distribuiti tra cantieri, lavoratori, subappaltatori

**2. `src/pages/Comunicazioni.tsx`** — Riscrittura completa:
- **Layout split**: lista thread a sinistra (1/3), chat a destra (2/3) su desktop; su mobile vista singola con navigazione back
- **Lista thread**:
  - Ricerca per testo (oggetto/partecipante)
  - Filtro per cantiere (Select)
  - Filtro per tipo (tutti/urgenti/documenti)
  - Badge conteggio non letti
  - Ordinamento per data ultimo messaggio
  - Thread selezionato evidenziato
- **Vista chat**:
  - Header con oggetto, cantiere, partecipanti
  - ScrollArea con messaggi in stile chat (bolle sinistra/destra per mittente/destinatario)
  - Timestamp relativo (date-fns `formatDistanceToNow`)
  - Indicatore allegati con icona Paperclip
  - Badge "urgente" se tipo urgente
- **Composer** in basso:
  - Textarea auto-resize
  - Bottone allega file (UI only, simula aggiunta)
  - Bottone invio — aggiunge messaggio allo state locale
  - Toggle "Urgente"
- **Dialog "Nuovo Messaggio"**:
  - Select cantiere
  - Select destinatari (multi, da mockLavoratori + mockSubappaltatori)
  - Input oggetto
  - Textarea primo messaggio
  - Crea nuovo thread nello state locale
- **Responsive**: su mobile, lista e chat sono due viste separate con pulsante "← Indietro"
- **Empty state**: messaggio placeholder quando nessun thread selezionato

**3. `src/components/layout/AppSidebar.tsx`** — Aggiungo badge notifiche non lette accanto alla voce "Comunicazioni" nella sidebar

### Funzionalità complete
- Visualizzazione thread con messaggi
- Invio nuovi messaggi (state locale)
- Creazione nuovi thread
- Ricerca e filtri (cantiere, tipo, testo)
- Conteggio non letti con badge
- Allegati (UI simulata)
- Layout responsive mobile/desktop
- Messaggi urgenti evidenziati

### Tecnologie
- Componenti UI esistenti: Card, Dialog, Select, ScrollArea, Badge, Button, Input, Textarea, Avatar
- `date-fns` per timestamp relativi (già installato)
- State locale con `useState` (no backend)

