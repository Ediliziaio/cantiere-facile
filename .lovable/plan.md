

## Auto-login SuperAdmin

Modifico il componente `SuperAdminLogin.tsx` per eseguire automaticamente il login al mount (senza richiedere compilazione del form), e fare redirect immediato a `/superadmin/dashboard`.

### Cosa cambia

**`src/pages/superadmin/SuperAdminLogin.tsx`**: Aggiungo un `useEffect` che al primo render chiama `login()` con i dati mock del SuperAdmin e naviga direttamente a `/superadmin/dashboard`. Il form resta visibile come fallback ma l'utente non dovrà mai interagire con esso.

