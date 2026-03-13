

# Restrizioni di accesso per ruolo con pagina "Permesso negato"

## Approccio

Attualmente il sistema nasconde solo le voci di menu per il ruolo Manager (`adminOnly`). Serve estendere il concetto con un nuovo livello: **pagine inaccessibili per il ruolo "utente"**, con protezione sia nella navigazione (nascondere voci) sia a livello di rotta (mostrare messaggio di permesso negato se l'utente accede direttamente via URL).

## Modifiche

### 1. Nuovo componente `src/components/layout/AccessDenied.tsx`
Componente semplice con icona `ShieldX`, titolo "Accesso negato", messaggio "Non hai i permessi per accedere a questa sezione" e bottone "Torna alla Dashboard".

### 2. Nuovo componente `src/components/layout/ProtectedRoute.tsx`
Wrapper che riceve `minRole: "admin" | "manager"` e controlla `effectiveRole` dal context:
- Se il ruolo è sufficiente → renderizza `children`
- Altrimenti → renderizza `<AccessDenied />`

Gerarchia ruoli: `admin > manager > utente`

### 3. `src/App.tsx` — Wrappare le rotte protette
Avvolgere con `<ProtectedRoute minRole="admin">` le pagine:
- `/app/subappaltatori` (già nascosta per manager, ora anche per utente)
- `/app/billing`
- `/app/analytics`

Avvolgere con `<ProtectedRoute minRole="manager">` o `"admin"`:
- `/app/impostazioni/*` (intero blocco settings)

### 4. Aggiornare `adminOnly` nelle sidebar e mobile nav
Nelle definizioni di `navGroups` in `AppSidebar.tsx` e `MobileBottomNav.tsx`, cambiare il flag per riflettere le restrizioni:
- `Abbonamento` → `adminOnly: true`
- `Impostazioni` → `adminOnly: true`  
- `Subappaltatori` → già `adminOnly: true`
- `Analytics` → `adminOnly: true`

Aggiornare la logica di filtro: attualmente filtra solo per `isManager`, estendere per filtrare anche per ruolo `utente`. Sostituire `!isManager || !item.adminOnly` con un check basato su `effectiveRole` e la gerarchia dei ruoli.

### 5. `SettingsSidebar.tsx` — Aggiornare filtro
Già usa `role` per filtrare; aggiornare per usare `effectiveRole` e nascondere l'intera sezione per il ruolo "utente".

## File coinvolti

| File | Azione |
|------|--------|
| `src/components/layout/AccessDenied.tsx` | Nuovo |
| `src/components/layout/ProtectedRoute.tsx` | Nuovo |
| `src/App.tsx` | Wrappare rotte protette |
| `src/components/layout/AppSidebar.tsx` | Aggiornare flag e logica filtro |
| `src/components/layout/MobileBottomNav.tsx` | Aggiornare flag e logica filtro |
| `src/components/layout/SettingsSidebar.tsx` | Usare `effectiveRole` |

