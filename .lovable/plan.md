

# Impersonazione con scelta del ruolo

## Obiettivo
Permettere al SuperAdmin di impersonare un tenant scegliendo il ruolo con cui visualizzare (Admin, Manager, Utente), così da vedere esattamente cosa vede ciascun tipo di utente.

## Modifiche

### 1. `src/contexts/AuthContext.tsx` — Aggiungere ruolo all'impersonazione
- Estendere `ImpersonationState` con `impersonatedRole: UserRole | null`
- Aggiornare `startImpersonation` per accettare un parametro `role: UserRole`
- Esporre un getter `effectiveRole` che durante l'impersonazione ritorna `impersonatedRole`, altrimenti il `role` reale — i componenti che oggi leggono `role` useranno questo nuovo campo
- Aggiungere `effectiveRole` al context type

### 2. `src/pages/superadmin/SuperAdminAziendaDetail.tsx` — Dialog scelta ruolo
- Sostituire il click diretto "Impersona" con un Dialog/DropdownMenu che mostra 3 opzioni: "Come Admin", "Come Manager", "Come Utente"
- Ogni opzione chiama `startImpersonation(tenant.id, tenant.nome_azienda, ruolo)` e naviga a `/app/dashboard`

### 3. `src/components/layout/ImpersonationBanner.tsx` — Mostrare ruolo attivo
- Mostrare nel banner il ruolo impersonato (es. "stai navigando come **Rossi Costruzioni** · ruolo: Manager")

### 4. Componenti che usano `role` — Passare a `effectiveRole`
- `AppSidebar.tsx`: usa `role` per nascondere voci admin-only → usare `effectiveRole`
- `TopBar.tsx`: usa `role` per mostrare/nascondere bottoni admin → usare `effectiveRole`
- `MobileBottomNav.tsx`: se usa `role` → aggiornare

Questo garantisce che il superadmin veda esattamente i menu e le funzionalità che vede il ruolo scelto.

