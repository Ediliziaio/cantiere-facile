

# Ottimizzazione e fix bug calendario

## Bug trovati

### 1. Badge manca `forwardRef` — Warning React in console
`src/components/ui/badge.tsx`: Badge e una function component senza `forwardRef`. Radix UI (TooltipTrigger, ecc.) tenta di passare un ref e genera il warning "Function components cannot be given refs". Fix: wrappare con `React.forwardRef`.

### 2. NuovoAppuntamentoDialog non aggiorna `defaultOraInizio`/`defaultDate`
`resetForm()` usa `defaultOraInizio` e `defaultDate` ma lo `useEffect` dipende solo da `[editAppuntamento, open]`, non da queste props. Quando si clicca un nuovo slot orario, il dialog potrebbe mostrare l'ora vecchia. Fix: aggiungere `defaultOraInizio` e `defaultDate` alle dipendenze dell'effect.

### 3. DayView: giorni vuoti non mostrano la timeline
Quando `hasContent === false`, viene mostrato solo "Nessuna attivita" senza timeline. L'utente non puo cliccare sugli slot per creare appuntamenti su giorni vuoti. Fix: mostrare sempre la timeline con gli slot cliccabili, indipendentemente dal contenuto.

### 4. AlertDialog ref warning in CalendarDayDetail
Il warning "Function components cannot be given refs" su AlertDialog e causato dal fatto che `AlertDialogPrimitive.Root` non supporta ref. Non e un vero bug funzionale ma inquina la console. Si puo silenziare assicurandosi che AlertDialog non riceva ref indirettamente (verificare che non ci siano wrapper problematici).

## File da modificare

| File | Azione |
|------|--------|
| `src/components/ui/badge.tsx` | Aggiungere `forwardRef` |
| `src/components/calendario/NuovoAppuntamentoDialog.tsx` | Fix dipendenze useEffect |
| `src/components/calendario/DayView.tsx` | Mostrare timeline anche su giorni vuoti |

