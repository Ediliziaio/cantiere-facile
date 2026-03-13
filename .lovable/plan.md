

# Selettore righe per pagina + Ordinamento colonne

## Modifiche

### 1. Hook `usePagination` — supporto `perPage` dinamico
Aggiungere `setPerPage` allo stato interno dell'hook, con reset a pagina 1 quando cambia.

### 2. Componente `PaginationControls` — riutilizzabile
Creare un componente inline condiviso che include:
- Selettore righe/pagina (Select con opzioni 10, 25, 50)
- Conteggio risultati "X–Y di Z"
- Bottoni Precedente/Successivo + indicatore pagina

### 3. Ordinamento colonne per tabella

Ogni pagina avrà un proprio stato `sortKey` + `sortDir` (asc/desc). Click sull'header toglie la direzione. Icona `ArrowUpDown` / `ArrowUp` / `ArrowDown` nell'header.

| Pagina | Colonne ordinabili |
|--------|-------------------|
| Aziende | Health score, Cantieri, Utenti, Ultima attività |
| Audit Log | Severity (critical > warning > info), Data/Ora |
| Billing | Totale, Data emissione, Stato |

### File modificati

| File | Cosa cambia |
|------|-------------|
| `src/hooks/usePagination.ts` | `perPage` diventa stato, espone `setPerPage` e `perPage` |
| `src/pages/superadmin/SuperAdminAziende.tsx` | Aggiunge sorting su health/cantieri/utenti/data, selettore righe, componente pagination unificato |
| `src/pages/superadmin/SuperAdminAuditLog.tsx` | Aggiunge sorting su severity/data, selettore righe |
| `src/pages/superadmin/SuperAdminBilling.tsx` | Aggiunge sorting su totale/data/stato, selettore righe |

### Approccio ordinamento

Sorting applicato PRIMA della paginazione: `filtered → sorted → paginated`. Ogni pagina gestisce il proprio `sortConfig = { key: string, dir: 'asc' | 'desc' }` con `useState`. Header cliccabile con `cursor-pointer` e icona che indica direzione corrente.

Per Audit Log severity, ordine custom: `critical=3, warning=2, info=1`.

### UI header ordinabile

```
<th onClick={toggleSort('health_score')} className="cursor-pointer select-none">
  Health <ArrowUpDown className="inline h-3 w-3 ml-1" />
</th>
```

Quando attivo, l'icona diventa `ArrowUp` o `ArrowDown`.

