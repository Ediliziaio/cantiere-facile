
# Paginazione + Export CSV per Lavoratori, Subappaltatori, Scadenze

## Modifiche

### 1. Lavoratori
- Aggiungere `usePagination` con `perPage` dinamico
- Bottone **Export CSV** (nome, cognome, mansione, tipo, subappaltatore)
- `PaginationControls` in fondo alla lista

### 2. Subappaltatori
- Aggiungere `usePagination` con `perPage` dinamico
- Bottone **Export CSV** (ragione sociale, cantiere, email, documenti ok/totali, stato)
- `PaginationControls` in fondo alla lista

### 3. Scadenze
- Aggiungere `usePagination` con `perPage` dinamico
- Bottone **Export CSV** (categoria, cantiere, data scadenza, stato)
- `PaginationControls` in fondo alla lista

## Pattern

Tutte e 3 le pagine seguono lo stesso schema:
1. `filtered` come già presente
2. `usePagination(filtered.length, 10)` → `paginatedItems = filtered.slice(startIndex, endIndex)`
3. `PaginationControls` dal componente SuperAdmin esistente
4. Funzione `exportCsv` che genera blob CSV dalle righe filtrate
5. Bottone `Download` inline nella barra filtri

## File modificati

| File | Modifica |
|------|----------|
| `src/pages/Lavoratori.tsx` | + paginazione + CSV export |
| `src/pages/Subappaltatori.tsx` | + paginazione + CSV export |
| `src/pages/Scadenze.tsx` | + paginazione + CSV export |
