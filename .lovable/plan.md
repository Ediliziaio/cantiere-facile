

# Paginazione + Righe espandibili nel Riepilogo Timbrature

## Modifiche in `src/components/timbrature/RiepilogoGiornaliero.tsx`

### 1. Paginazione
- Importare `usePagination` e `PaginationControls` (pattern standard del progetto)
- Applicare `usePagination(rows, 10)` sulla lista di righe calcolate
- Renderizzare `PaginationControls` sotto la tabella
- Iterare su `paginatedItems` invece di `rows` nel `<TableBody>`

### 2. Righe espandibili con dettaglio timbrature
- Aggiungere stato `expandedKey: string | null` per tracciare quale riga è espansa
- Al click su una `TableRow`, toggle di `expandedKey` (`lavoratoreId_data`)
- Aggiungere un'icona `ChevronRight`/`ChevronDown` nella prima colonna come indicatore visivo
- Dopo ogni riga espansa, inserire una `TableRow` aggiuntiva con `colSpan=8` contenente il dettaglio:
  - Lista ordinata delle timbrature di quel lavoratore/giorno (da `allTimbrature`)
  - Per ogni timbratura: ora, tipo (con icona), esito, metodo
  - Sfondo leggermente diverso (`bg-muted/30`) per distinguere il dettaglio
- Usare le stesse icone/label di `tipoLabels` già definite in `Timbrature.tsx` — duplicare il mapping nel componente per semplicità

Un solo file da modificare.

