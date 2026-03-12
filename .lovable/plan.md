

# Piano: Fix Sidebar SuperAdmin + Migliorare UX

## Problemi identificati

1. **Sidebar vuota**: La sidebar non mostra nessuna voce di menu. Il problema è che `hasPermission()` restituisce `false` per tutti i permessi quando l'utente accede direttamente alle pagine SuperAdmin senza passare dal login (es. navigando a `/superadmin/aziende` direttamente). Senza `superadminRole` impostato nel contesto, `hasPermission` fallisce e la sidebar filtra via tutte le voci.

2. **Nessun auto-login**: L'area azienda funziona senza login (i dati mock sono sempre disponibili), ma l'area SuperAdmin richiede il login 2FA per impostare il ruolo nel contesto. Quando si naviga direttamente, non c'è nessun ruolo → sidebar vuota.

3. **Colore `superadmin` residuo**: In `SuperAdminBilling.tsx` c'è ancora `hsl(var(--superadmin))` per il chart stroke.

## Soluzione

### 1. Auto-login SuperAdmin nel Layout

Modificare `SuperAdminLayout.tsx`: se `user` è `null` o `role !== "superadmin"`, fare auto-login con il primo utente mock e ruolo `superadmin` (come faceva prima). Questo garantisce che navigando direttamente alle pagine, la sidebar funzioni. Il login manuale con 2FA resta disponibile per chi vuole testare il flow di sicurezza, ma non è più obbligatorio.

In alternativa (più pulito): redirect a `/superadmin/login` se non autenticati. Ma dato che l'area azienda non richiede login, per coerenza conviene auto-login.

### 2. Fix colore chart Billing

Sostituire `hsl(var(--superadmin))` con `hsl(var(--primary))` in `SuperAdminBilling.tsx`.

### 3. Miglioramenti UX pagine SuperAdmin

- **SuperAdminDashboard**: aggiungere sottotitolo descrittivo, card con bordo più definito
- **Tutte le pagine**: verificare coerenza colori (nessun riferimento a `superadmin` color)

## File modificati

| File | Azione |
|------|--------|
| `src/components/layout/SuperAdminLayout.tsx` | Auto-login se user è null |
| `src/pages/superadmin/SuperAdminBilling.tsx` | Fix colore `superadmin` → `primary` |

