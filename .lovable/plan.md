

## Geolocalizzazione Accessi

### Cosa farò

Aggiungo il tracciamento della posizione GPS nelle timbrature, con verifica della distanza dal cantiere e visualizzazione nella tabella accessi.

### Modifiche

**1. `src/data/mock-data.ts`** — Aggiungo coordinate GPS ai cantieri (`latitudine`, `longitudine`, `raggio_geofence`) per definire il perimetro valido di ciascun cantiere.

**2. `src/data/mock-badges.ts`** — I mock già generano `latitudine`/`longitudine` casuali vicino a Milano. Aggiusto i valori per renderli coerenti con le coordinate dei cantieri e aggiungo qualche timbratura "fuori zona" per testare il warning.

**3. `src/pages/Accessi.tsx`** — Modifiche principali:

- **DaySummary** esteso con `latEntrata`, `lonEntrata`, `latUscita`, `lonUscita`, `distanzaEntrata`, `distanzaUscita`, `fuoriZona`
- **Colonna "GPS"** nella tabella: icona `MapPin` verde se dentro il raggio del cantiere, arancione/rossa se fuori zona con distanza in metri
- **Tooltip/Popover** al click sull'icona GPS: mostra coordinate, distanza dal cantiere, e un link a Google Maps
- **Funzione `calcolaDistanza()`**: formula Haversine per calcolare distanza tra coordinate timbratura e coordinate cantiere
- **Indicatore "Fuori zona"** nel log dettagliato collapsible
- **Export CSV** aggiornato con colonne GPS (Lat, Lon, Distanza, Fuori zona)

### Logica geofencing

```text
Cantiere (lat, lon, raggio: 200m)
         ┌─────────────┐
         │  ● timbratura│ → distanza < raggio → ✅ In zona
         └─────────────┘
                          ● timbratura → distanza > raggio → ⚠️ Fuori zona (350m)
```

Calcolo con formula Haversine, confronto con `raggio_geofence` del cantiere (default 200m). Mostro warning visivo se fuori zona.

### File coinvolti
- `src/data/mock-data.ts` — coordinate cantieri
- `src/data/mock-badges.ts` — mock timbrature con GPS coerenti
- `src/pages/Accessi.tsx` — colonna GPS, calcolo distanza, tooltip, CSV

