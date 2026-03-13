

# Piano: Mostrare la posizione GPS nelle registrazioni Check-in

## Problema
Quando l'utente registra un check-in/check-out GPS, il toast di conferma e la cronologia recente non indicano **dove** è stato registrato (coordinate, indirizzo o distanza dal cantiere). L'utente non ha feedback sulla posizione rilevata.

## Soluzione

### 1. Toast di conferma con posizione
Aggiungere nel toast di successo (righe 129-131 e 168-170) le informazioni GPS:
- Coordinate abbreviate (es. `45.4642°N, 9.1900°E`)
- Distanza dal cantiere (es. `a 15m dal cantiere`)
- Precisione GPS (es. `±8m`)

### 2. Cronologia con posizione registrata
Nella sezione "Ultime registrazioni" (righe 507-543), aggiungere sotto il nome cantiere e l'orario:
- Icona `MapPin` + coordinate o distanza se disponibili
- Indicatore se era dentro/fuori geofence

### 3. Salvare la distanza nel payload
Aggiungere `distance` al payload di `QueuedOperation` così da poterlo mostrare nella cronologia. Attualmente il payload salva `lat/lng/accuracy` ma non la distanza calcolata dal geofence.

## File modificati

| File | Modifica |
|------|----------|
| `src/pages/CheckIn.tsx` | Toast con posizione GPS + cronologia arricchita |
| `src/hooks/useOfflineQueue.ts` | Aggiungere campo `distance` al payload |

