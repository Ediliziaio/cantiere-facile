

# Modulo Sicurezza D.Lgs 81/2008 — Già Implementato

## Stato attuale

Il modulo sicurezza è **già completamente implementato** nel progetto. Ecco cosa esiste:

### Dati e Tipi (`src/data/mock-safety.ts`)
- **SafetyPlan**: con `RiskAssessment`, `EmergencyProcedures`, `DPIRequirement`, `TrainingRequirement`
- **Accident**: severity enum, accident_type, DPI status, root cause analysis (5 whys), corrective actions, INAIL notification
- **SafetyInspection**: checklist items con stati ok/ko/na per categoria D.Lgs 81/2008
- **PendingNotification**: deadline INAIL/ASL, status, protocol number
- **Coordinator**: ruoli CSP/CSE, specializzazioni, max concurrent sites
- Mock data completi: 2 piani sicurezza, 3 infortuni, 4 ispezioni, 2 coordinatori

### Componenti UI
- **`AccidentReportForm.tsx`**: wizard multi-step con validazione differenziata per severity
- **`SafetyChecklist.tsx`**: checklist ispezione con categorie normalizzate, score, progress
- **`POSViewer.tsx`**: visualizzatore POS con accordion, matrice rischi, workflow approvazione
- **`NotificationPanel.tsx`**: notifiche obbligatorie con countdown, template PEC, mark as sent

### Dashboard (`src/pages/Sicurezza.tsx`)
- Tabs: Overview, POS, Infortuni, Ispezioni, Coordinatori
- Grafico trend infortuni (recharts)
- Alert critici, contatori, semafori compliance
- Statistiche TFR e indice gravità

### Navigazione
- Rotta `/app/sicurezza` in App.tsx
- Voce "Sicurezza" con icona ShieldAlert in AppSidebar e MobileBottomNav

## Conclusione

Tutti i requirements sono già coperti dall'implementazione esistente. Non ci sono modifiche necessarie.

Se si desidera **estendere** il modulo, le opzioni sono:
1. **Generazione PDF** denuncia INAIL e verbale infortunio (con pdf-lib già installato)
2. **Connessione Supabase** per persistenza reale dei dati sicurezza
3. **Dettaglio singolo infortunio** come pagina dedicata con audit trail
4. **Statistiche avanzate** con benchmark e confronto tra cantieri

