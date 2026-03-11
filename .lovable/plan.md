

## Miglioramento Registro Accessi — Vista giornaliera con ore lavorate

### Cosa cambia

Trasformo il log cronologico attuale in una **tabella giornaliera per lavoratore** che mostra chiaramente entrata, uscita e ore lavorate, invece della lista di singole timbrature.

### Nuova struttura della pagina

Le stat card e la sezione "Presenti per cantiere" restano invariate. Sotto, aggiungo:

1. **Filtro data** — selettore giorno (default: oggi 2026-03-10) oltre ai filtri esistenti (cantiere, ricerca)
2. **Tabella riepilogativa** con colonne:

```text
┌──────────────────┬───────────┬─────────┬─────────┬──────────┬────────┬────────┐
│ Lavoratore       │ Mansione  │ Cantiere│ Entrata │ Uscita   │ Ore    │ Esito  │
├──────────────────┼───────────┼─────────┼─────────┼──────────┼────────┼────────┤
│ Mario Rossi      │ Muratore  │ Porta N │ 07:15   │ 16:45    │ 9h 30m │ 🟢     │
│ Luca Bianchi     │ Elettric. │ Porta N │ 08:00   │ 17:10    │ 9h 10m │ 🟡     │
│ Paolo Verdi      │ Carpent.  │ Via Roma│ —       │ —        │ —      │ 🔴     │
└──────────────────┴───────────┴─────────┴─────────┴──────────┴────────┴────────┘
```

3. **Calcolo ore**: differenza tra timestamp uscita e entrata, formattato come `Xh Ym`. Se manca l'uscita (ancora presente), mostra "In corso" con badge verde pulsante. Se bloccato, mostra "—".

4. **Totale ore giornaliere** in fondo alla tabella.

5. **Log dettagliato** collassabile sotto la tabella per chi vuole vedere le singole timbrature (il log attuale).

### Logica

Raggruppo le timbrature per `lavoratore_id + cantiere_id + giorno`, accoppio entrata/uscita, calcolo la differenza in minuti e la converto in `Xh Ym`.

### File modificati

- `src/pages/Accessi.tsx` — riscrittura completa con tabella + log collapsible
- Uso componenti `Table` già presenti in `src/components/ui/table.tsx`

