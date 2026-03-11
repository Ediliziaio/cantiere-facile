

## Esporta CSV — Registro Accessi

Aggiungo un pulsante **Esporta CSV** nell'header della pagina che genera e scarica un file CSV con i dati filtrati attualmente visibili nella tabella.

### Modifiche

**`src/pages/Accessi.tsx`**

1. Importo `Download` da `lucide-react`
2. Aggiungo una funzione `exportCSV()` che:
   - Prende i `filtered` summaries correnti
   - Genera header CSV: `Lavoratore, Mansione, Cantiere, Data, Entrata, Uscita, Ore Lavorate, Esito`
   - Mappa ogni riga usando le stesse funzioni di formattazione già presenti (`formatTime`, `formatDurata`, `formatDateLabel`)
   - Crea un `Blob` di tipo `text/csv`, genera un URL temporaneo e triggera il download con nome file `accessi_YYYY-MM-DD.csv`
3. Aggiungo il pulsante `Esporta CSV` accanto al titolo "Registro Accessi", stesso stile del pulsante già presente in Timbrature (`variant="outline" size="sm"`)

Un solo file da modificare, nessun componente nuovo necessario.

