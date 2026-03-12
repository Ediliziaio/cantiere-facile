

# Piano: Dashboard Analitica Avanzata

## Stato attuale

- **Dashboard.tsx**: pagina operativa con stat cards, scadenze, accessi, presenze live -- nessun grafico analitico
- **GraficiAccessi.tsx**: grafici Recharts (bar chart ore per lavoratore, pie chart per cantiere) -- unico componente analitico esistente
- **Mock data ricchi**: cantieri (2), lavoratori (5), mezzi (5), documenti (21), accessi, manutenzioni, diario cantiere con ore/operai/meteo, safety data (infortuni, ispezioni)
- **Recharts** gia installato, **Leaflet** gia installato
- **react-grid-layout** NON installato (non disponibile nel progetto)

## Piano implementativo

### 1. Mock data analytics (`src/data/mock-analytics.ts`)

Nuovo file con dati aggregati pre-calcolati:
- `mockAnalyticsSnapshots`: 90 giorni di dati giornalieri per cantiere (workers_count, hours_total, costs_labor, safety_score, materials_cost)
- `mockBudgetData`: budget vs consuntivo per cantiere con breakdown voci (manodopera, materiali, noleggio, subappalti)
- `mockMilestones`: avanzamento lavori per cantiere (milestone, % completamento, data prevista vs reale)
- Helper functions: `getSnapshotsByRange()`, `calculateTFR()`, `calculateBurnRate()`, `forecastSpesa()`

### 2. Componente `KPICards.tsx` (`src/components/analytics/`)

Riga di KPI cards con dati calcolati dal mock:
- Operai presenti oggi (da accessi)
- Avanzamento lavori medio % (da milestones)
- Giorni da ultimo infortunio (da mock-safety)
- Costo manodopera giornaliero (da snapshots)
- Documenti in regola % (da documenti)
- Ciascuna card con icona, valore, trend arrow (confronto vs periodo precedente), sparkline mini

### 3. Componente `TrendCharts.tsx` (`src/components/analytics/`)

Grafici Recharts:
- **Presenze giornaliere**: area chart con linee per cantiere, tooltip dettagliato
- **Costi vs Budget**: bar chart stacked (budget in grigio, consuntivo sovrapposto colorato)
- **Forecast spesa**: line chart con linea tratteggiata proiezione 30gg basata su burn rate
- **Sicurezza**: line chart safety score + bar chart infortuni mensili
- Time range selector (7gg/30gg/90gg/anno) con state condiviso

### 4. Componente `SiteComplianceMatrix.tsx` (`src/components/analytics/`)

Tabella/griglia per cantiere con semafori:
- Colonne: POS (verde/arancione/rosso), Documenti %, Ispezione recente, Formazione, DURC
- Calcolato incrociando mock-safety, documenti, ispezioni
- Click su cella porta al dettaglio cantiere

### 5. Componente `CostiAnalysis.tsx` (`src/components/analytics/`)

- Pie chart breakdown costi per voce (manodopera, materiali, noleggio, subappalti)
- Bar chart confronto cantieri
- Tabella riepilogativa budget vs consuntivo con delta % e colore (verde sotto budget, rosso sopra)

### 6. Componente `GeoAnalytics.tsx` (`src/components/analytics/`)

Mappa Leaflet con:
- Marker per ogni cantiere con popup KPI (operai, stato, costo)
- Colore marker basato su compliance (verde/giallo/rosso)
- Riusa coordinate gia presenti in mockCantieri (latitudine/longitudine)

### 7. Componente `ReportExporter.tsx` (`src/components/analytics/`)

Panel per export:
- Selezione periodo e cantieri
- Formato: CSV (genera e scarica), PDF (usa pdf-lib gia installato)
- Preview dati prima di export
- Genera CSV con dati presenze, costi, sicurezza

### 8. Pagina `Analytics.tsx` (`src/pages/Analytics.tsx`)

Layout con tabs:
- **Overview**: KPICards + TrendCharts (presenze + costi)
- **Economica**: CostiAnalysis + forecast
- **Sicurezza**: safety charts + compliance matrix
- **Mappa**: GeoAnalytics
- **Report**: ReportExporter

Time range selector globale in header.

### 9. Navigazione e routing

- Rotta `/app/analytics` in App.tsx
- Voce "Analytics" con icona `BarChart3` in AppSidebar nel gruppo "Generale"
- Link in MobileBottomNav

## File creati/modificati

| File | Azione |
|------|--------|
| `src/data/mock-analytics.ts` | Nuovo — snapshots, budget, milestones, helpers |
| `src/components/analytics/KPICards.tsx` | Nuovo — KPI cards con trend |
| `src/components/analytics/TrendCharts.tsx` | Nuovo — grafici trend Recharts |
| `src/components/analytics/SiteComplianceMatrix.tsx` | Nuovo — matrice compliance cantieri |
| `src/components/analytics/CostiAnalysis.tsx` | Nuovo — analisi costi e budget |
| `src/components/analytics/GeoAnalytics.tsx` | Nuovo — mappa Leaflet con KPI |
| `src/components/analytics/ReportExporter.tsx` | Nuovo — export CSV/PDF |
| `src/pages/Analytics.tsx` | Nuovo — pagina dashboard analitica |
| `src/App.tsx` | Aggiunta rotta /app/analytics |
| `src/components/layout/AppSidebar.tsx` | Aggiunta voce Analytics |
| `src/components/layout/MobileBottomNav.tsx` | Aggiunta voce nel menu |

## Vincoli

- **No react-grid-layout** — layout fisso con CSS grid responsive invece di drag-drop (non disponibile nelle dipendenze)
- **No Supabase** — tutto mock, helpers calcolano aggregazioni client-side
- **No cache Redis** — i calcoli sono leggeri su mock data
- **No webhook export** — solo download diretto CSV/PDF
- **Recharts** per tutti i grafici (gia installato), **Leaflet** per mappa (gia installato)
- **pdf-lib** per generazione PDF report (gia installato)

