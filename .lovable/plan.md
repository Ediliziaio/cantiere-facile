

# Paginazione Tabelle SuperAdmin

## Approccio

Creare un hook riutilizzabile `usePagination` e applicarlo alle 3 tabelle: Aziende, Audit Log e Fatture (Billing). Ogni tabella mostrerà 10 righe per pagina con controlli Precedente/Successivo e indicatore pagina corrente.

## Cosa viene creato/modificato

| File | Azione |
|------|--------|
| `src/hooks/usePagination.ts` | **Nuovo** — Hook generico con `page`, `totalPages`, `paginatedItems`, `next`, `prev`, `goTo` |
| `src/pages/superadmin/SuperAdminAziende.tsx` | Paginare `filtered` (10/pagina), aggiungere controlli sotto tabella e sotto card mobile |
| `src/pages/superadmin/SuperAdminAuditLog.tsx` | Paginare `filtered` (15/pagina), controlli sotto tabella e card mobile |
| `src/pages/superadmin/SuperAdminBilling.tsx` | Paginare `filteredInvoices` (10/pagina), controlli sotto tabella e card mobile |

## Hook `usePagination`

```ts
function usePagination<T>(items: T[], perPage: number) {
  // state: page (reset a 1 quando items cambia)
  // return: paginatedItems, page, totalPages, nextPage, prevPage, goToPage
}
```

## UI Paginazione

Componente inline leggero (non un file separato): bottoni "← Precedente" / "Successivo →" + "Pagina X di Y" + conteggio totale risultati. Coerente con lo stile esistente usando `Button variant="outline" size="sm"`.

## Comportamento

- Reset a pagina 1 quando cambiano filtri/ricerca
- Nascondere i controlli se c'è una sola pagina
- Il conteggio nel footer mostra "X–Y di Z risultati"

