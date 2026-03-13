

# Calendario come pagina dedicata nella sidebar

## Obiettivo

Trasformare il calendario da sezione embedded nella Dashboard a una **pagina standalone** raggiungibile dalla sidebar sotto "Dashboard", nella sezione "Generale". La pagina avrà il contenuto completo: calendario interattivo, dettaglio giorno, filtro cantiere.

## Modifiche

### 1. Nuova pagina `src/pages/Calendario.tsx`
- Pagina dedicata con titolo, filtro cantiere (Select), calendario con indicatori colorati e pannello dettaglio giorno
- Riutilizza i componenti `DashboardCalendar` esistenti oppure li integra direttamente con layout full-page (calendario + dettaglio più grandi rispetto alla versione dashboard)

### 2. Sidebar — `src/components/layout/AppSidebar.tsx`
- Aggiungere voce **"Calendario"** con icona `CalendarDays` subito dopo "Dashboard" nella sezione "Generale"
- URL: `/app/calendario`

### 3. Rotta — `src/App.tsx`
- Aggiungere lazy import per `Calendario`
- Aggiungere `<Route path="calendario" element={<Calendario />} />` dentro le rotte `/app`

### 4. Dashboard — `src/pages/Dashboard.tsx`
- Il calendario resta anche nella Dashboard come widget compatto (invariato)

## File coinvolti

| File | Azione |
|------|----------|
| `src/pages/Calendario.tsx` | Nuovo — pagina dedicata calendario |
| `src/components/layout/AppSidebar.tsx` | Modifica — aggiunge voce sidebar |
| `src/App.tsx` | Modifica — aggiunge rotta |

