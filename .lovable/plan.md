

# Piano: Avanzamento Lavori per Cantieri

## Cosa si costruisce

Un sistema di **tracking avanzamento lavori** per ogni cantiere, con step personalizzabili e template riutilizzabili.

## Struttura dati (mock)

**`src/data/mock-avanzamento.ts`** — Nuovi tipi e dati mock:

- `WorkTemplate`: template riutilizzabile con nome e lista di step predefiniti
- `WorkPhase`: singola fase di lavoro associata a un cantiere, con step e stato (da_iniziare / in_corso / completato)
- `WorkStep`: singolo step dentro una fase, con stato, data completamento, note

Templates di esempio: "Edilizia Residenziale" (Scavi, Fondazioni, Struttura, Impianti, Finiture), "Ristrutturazione" (Demolizioni, Consolidamento, Impianti, Finiture).

## Componenti

**`src/components/cantiere/AvanzamentoLavori.tsx`** — Componente principale (tab nel dettaglio cantiere):
- Progress bar complessiva del cantiere
- Lista fasi collassabili (Collapsible), ogni fase mostra i suoi step con checkbox per marcare completamento
- Badge stato per fase (da_iniziare / in_corso / completato)
- Bottone "Aggiungi fase" che apre un Dialog per aggiungere fase manuale o da template

**`src/components/cantiere/WorkTemplateSelector.tsx`** — Dialog/modale per:
- Scegliere un template predefinito (popola gli step automaticamente)
- Oppure creare una fase custom con step liberi (input + bottone "aggiungi step")

## Modifiche a file esistenti

| File | Modifica |
|------|----------|
| `src/data/mock-avanzamento.ts` | Nuovo file con tipi, template e dati mock |
| `src/components/cantiere/AvanzamentoLavori.tsx` | Nuovo componente principale |
| `src/components/cantiere/WorkTemplateSelector.tsx` | Nuovo selettore template/custom |
| `src/pages/CantiereDetail.tsx` | Aggiungere tab "Avanzamento" con il componente |
| `src/pages/NuovoCantiere.tsx` | Aggiungere sezione opzionale per selezionare template iniziale |

## UX

- Nel **dettaglio cantiere**: nuovo tab "Avanzamento" tra Diario e gli altri, con progress % globale
- Nel **form nuovo cantiere**: sezione "Template avanzamento" con select opzionale per pre-caricare le fasi
- Ogni step ha checkbox + data completamento auto + campo note opzionale
- La progress bar complessiva si aggiorna in tempo reale al click sugli step

