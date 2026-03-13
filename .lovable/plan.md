

# Riepilogo giornaliero per lavoratore + Esportazione CSV

## 1. Vista toggle: Log / Riepilogo

Aggiungere uno stato `vista` (`"log" | "riepilogo"`) con due bottoni toggle sopra la lista. La vista "log" resta quella attuale. La vista "riepilogo" mostra una tabella raggruppata per lavoratore.

## 2. Riepilogo giornaliero (nuova vista)

Dalla lista `filtered`, raggruppare per `lavoratore_id + data`. Per ogni coppia calcolare:
- **Entrata**: primo timestamp con `tipo === "entrata"`
- **Uscita**: ultimo timestamp con `tipo === "uscita"`
- **N. pause**: conteggio `pausa_inizio`
- **Durata pause**: somma durate (pausa_inizio → pausa_fine)
- **Ore nette**: risultato di `calcOreLavorate()` gia esistente
- **Cantiere**: dal primo record

Renderizzare come tabella (`Table` component) con colonne: Lavoratore, Data, Cantiere, Entrata, Uscita, Pause, Durata pause, Ore nette. Ordinata per data desc, poi nome.

## 3. Esportazione CSV funzionante

Il bottone "Esporta CSV" attualmente non fa nulla. Implementare:
- In modalita **log**: esportare le righe filtrate con colonne: Lavoratore, Data, Ora, Tipo, Cantiere, Esito, Metodo, Motivo blocco
- In modalita **riepilogo**: esportare i dati raggruppati con colonne: Lavoratore, Data, Cantiere, Entrata, Uscita, N. Pause, Durata Pause (min), Ore Nette

Usa lo stesso pattern `Blob + createElement("a")` gia usato in `Scadenze.tsx`.

## File da modificare

| File | Azione |
|------|--------|
| `src/pages/Timbrature.tsx` | Aggiungere toggle vista, tabella riepilogo, logica CSV |

Un solo file da modificare.

