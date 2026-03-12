

# Piano: Modulo Sicurezza Lavoro D.Lgs 81/2008

## Stato attuale

Il progetto non ha nessun modulo sicurezza dedicato. Esistono riferimenti sparsi (POS come categoria documento, corsi sicurezza nei lavoratori) ma nessuna struttura per piani operativi, registro infortuni, checklist ispezioni o coordinatori CSP/CSE. Supabase non e connesso -- tutto mock/localStorage.

## Piano implementativo

### 1. Mock data sicurezza (`src/data/mock-safety.ts`)

Nuovo file con tipi e dati strutturati:

- **`SafetyPlan`**: id, site_id, version, coordinator_csp/cse, status (draft/approved/suspended), approval_date, expiry_date, contenuto JSONB (valutazione_rischi, procedure_emergenza, DPI, formazione_obbligatoria)
- **`Accident`**: id, site_id, injured_worker_id, date/time, severity (minor/serious/fatal/near_miss), accident_type enum, description, root_cause, witnesses, corrective_actions array, inail_notification, days_absence
- **`SafetyInspection`**: id, site_id, inspector_id, date, type (periodica/straordinaria), checklist_items array con stati (ok/ko/na), firma, prossima_ispezione
- **`PendingNotification`**: accident_id, authority_type (inail/asl), deadline, sent_date, status
- **`Coordinator`**: user_id, role (csp/cse), registration_number, specializations, max_concurrent_sites
- Mock data: 2 piani sicurezza, 3 infortuni (1 grave, 1 near_miss, 1 minor), 4 ispezioni, 2 coordinatori

### 2. Pagina `Sicurezza.tsx` (`/app/sicurezza`) — Dashboard Sicurezza

Widget principali:
- **Stato compliance per cantiere**: semaforo POS (verde/arancione/rosso)
- **Conteggio infortuni ultimi 12 mesi** con trend (recharts gia installato)
- **Alert critici**: POS scaduto, ispezione scaduta, infortunio grave da notificare, formazione in scadenza
- **Prossime scadenze** formazione e ispezioni
- **Statistiche**: TFR (tasso frequenza), indice gravita
- Tabs: Overview, POS, Infortuni, Ispezioni, Coordinatori

### 3. Componente `AccidentReportForm.tsx` — Wizard segnalazione infortunio

Form multi-step:
1. **Dati base**: cantiere, lavoratore infortunato, data/ora precisa, severity
2. **Dettagli**: tipo infortunio (enum), attivita svolta, macchine coinvolte, stato DPI, descrizione dettagliata
3. **Analisi**: cause immediate, root cause (5 whys), testimoni (selezione da lavoratori cantiere)
4. **Azioni correttive**: array di azioni con responsabile, deadline
5. **Riepilogo**: preview completa, submit

Validazione differenziata per severity:
- `fatal`/`serious`: testimoni e descrizione dettagliata obbligatori, macchine coinvolte obbligatorio
- `minor`: solo dati base + descrizione
- `near_miss`: solo dati base

### 4. Componente `SafetyChecklist.tsx` — Checklist ispezione

Checklist normalizzata per categorie D.Lgs 81/2008:
- Impalcature, Ponteggi, Mezzi sollevamento, Impianto elettrico, Movimento terra, DPI
- Per ogni item: stato (ok/ko/na) + nota + foto (placeholder)
- Contatore completamento e score finale
- Calcolo prossima ispezione automatico (cantiere attivo = 1x/mese)

### 5. Componente `POSViewer.tsx` — Visualizzatore POS

- Header con versione, stato, coordinatori assegnati
- Sezioni espandibili (accordion): valutazione rischi, procedure emergenza, DPI richiesti, formazione obbligatoria
- Matrice rischi: probabilita x severita con colori (verde/giallo/rosso)
- Workflow: bottoni per approvare/sospendere (cambia stato)

### 6. Componente `NotificationPanel.tsx` — Notifiche obbligatorie

- Lista notifiche pending per autorita (INAIL, ASL)
- Countdown: ore rimanenti per notifica obbligatoria (24h per grave/fatale, 48h per >3gg)
- Template pre-compilato: dati infortunio formattati per PEC INAIL/ASL
- Stato: da_inviare / inviata / scaduta

### 7. Integrazione navigazione

- Aggiungere "Sicurezza" con icona `ShieldAlert` in AppSidebar (nuovo gruppo "Sicurezza" o dentro "Cantiere")
- Aggiungere in MobileBottomNav nel menu espanso
- Rotta `/app/sicurezza` in App.tsx

## File creati/modificati

| File | Azione |
|------|--------|
| `src/data/mock-safety.ts` | Nuovo — tipi e mock data sicurezza |
| `src/pages/Sicurezza.tsx` | Nuovo — dashboard sicurezza con tabs |
| `src/components/sicurezza/AccidentReportForm.tsx` | Nuovo — wizard infortunio multi-step |
| `src/components/sicurezza/SafetyChecklist.tsx` | Nuovo — checklist ispezione |
| `src/components/sicurezza/POSViewer.tsx` | Nuovo — visualizzatore POS |
| `src/components/sicurezza/NotificationPanel.tsx` | Nuovo — notifiche obbligatorie |
| `src/App.tsx` | Aggiunta rotta /app/sicurezza |
| `src/components/layout/AppSidebar.tsx` | Aggiunta voce Sicurezza |
| `src/components/layout/MobileBottomNav.tsx` | Aggiunta voce nel menu |

## Vincoli

- **No Supabase** — tutto mock/localStorage, strutturato per futura migrazione
- **No edge functions** — le notifiche INAIL/ASL generano template pre-compilati ma non inviano realmente
- **No cifratura AES-256** — richiederebbe backend; i dati sensibili saranno protetti con RLS quando Supabase sara connesso
- **Immutabilita infortuni**: una volta salvato, un infortunio non puo essere eliminato dalla UI, solo rettificato con motivazione
- **PDF generazione**: usa pdf-lib (gia installato) per verbale infortunio e denuncia INAIL

