

# Switch ruolo dalla TopBar durante impersonazione

## Obiettivo
Quando il SuperAdmin sta impersonando un tenant, l'icona utente nella TopBar deve mostrare un dropdown con le opzioni per switchare ruolo (Admin, Manager, Utente) e per tornare al SuperAdmin — tutto senza lasciare la pagina corrente.

## Modifiche

### `src/components/layout/TopBar.tsx`
Quando `impersonation.isImpersonating` è attivo, il dropdown dell'icona utente cambia contenuto:
- **Header**: mostra il tenant impersonato e il ruolo corrente
- **3 voci ruolo**: "Come Admin", "Come Manager", "Come Utente" — quella attiva ha un check. Click chiama `startImpersonation` con lo stesso tenantId/tenantName ma ruolo diverso
- **Separatore**
- **"Torna al SuperAdmin"**: chiama `stopImpersonation()` e naviga a `/superadmin/aziende`

Quando NON si sta impersonando, il dropdown resta come oggi (Impostazioni + Esci).

### `src/components/layout/ImpersonationBanner.tsx`
Aggiungere un piccolo dropdown o i bottoni ruolo anche nel banner per coerenza, oppure lasciarlo com'è dato che il punto di switch principale diventa la TopBar. Mantenere il bottone "Torna al SuperAdmin" nel banner.

Nessun altro file da modificare.

