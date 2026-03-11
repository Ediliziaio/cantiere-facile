

## Mappa interattiva + Grafici ore lavorate — Pagina Accessi

### 1. Mappa interattiva delle timbrature

Aggiungo una sezione **mappa** sotto le stats card che mostra le posizioni GPS delle timbrature rispetto al perimetro del cantiere.

**Approccio**: Uso **Leaflet** (via `react-leaflet`) — libreria open-source, leggera, zero costi API. Le tiles vengono da OpenStreetMap.

**Componente `src/components/accessi/MappaAccessi.tsx`**:
- Mappa centrata sul cantiere selezionato (o vista multi-cantiere se "tutti")
- **Cerchio geofence**: cerchio semitrasparente con raggio = `raggio_geofence` del cantiere
- **Marker timbrature**: pin verdi (in zona) e arancioni (fuori zona) per ogni timbratura filtrata
- **Popup** al click sul marker: nome lavoratore, orario, distanza dal cantiere
- **Marker cantiere**: icona speciale al centro del cantiere
- Altezza fissa ~300px, responsive

**Pacchetti da installare**: `leaflet`, `react-leaflet`, `@types/leaflet`

### 2. Grafici ore lavorate con Recharts

Aggiungo una sezione **grafici** con due chart sotto la mappa, usando Recharts (già installato) e i componenti `ChartContainer`/`ChartTooltip` già presenti.

**Componente `src/components/accessi/GraficiAccessi.tsx`**:

- **Grafico 1 — Ore per lavoratore**: `BarChart` orizzontale, una barra per lavoratore con totale ore nel periodo filtrato. Colore primario, ordinato per ore decrescenti.
- **Grafico 2 — Ore per cantiere**: `PieChart` con distribuzione ore tra cantieri. Colori distinti per cantiere.

Entrambi i grafici usano i dati `filtered` (summaries) già calcolati in `Accessi.tsx`, quindi si aggiornano automaticamente con i filtri attivi.

### 3. Modifiche a `src/pages/Accessi.tsx`

- Aggiungo `Tabs` (Tabella / Mappa / Grafici) per organizzare le tre viste sotto i filtri
- Importo i due nuovi componenti
- Passo `filtered`, `dateFilteredTs` e `mockCantieri` come props

### File coinvolti
- `src/components/accessi/MappaAccessi.tsx` — nuovo
- `src/components/accessi/GraficiAccessi.tsx` — nuovo  
- `src/pages/Accessi.tsx` — tabs + import nuovi componenti
- Installazione pacchetti: `leaflet`, `react-leaflet`, `@types/leaflet`

