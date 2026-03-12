

# Piano: Sistema GPS Production-Grade per Tracciamento Presenze

## Analisi stato attuale

- Nessun codice di geolocalizzazione esiste nel progetto
- Nessun Service Worker o IndexedDB
- Mappa Leaflet già integrata (MappaAccessi.tsx) con haversine
- Scan.tsx ha già QR scan funzionante con html5-qrcode
- Supabase NON connesso — le operazioni di sync e validazione server-side richiederanno la connessione futura
- Mock data per timbrature e cantieri già strutturati con lat/lng e raggio_geofence

## Cosa viene creato

### 1. Hook `useGeolocation.ts`
- Wrapper tipizzato attorno a `navigator.geolocation.watchPosition`
- `enableHighAccuracy: true`, timeout 15s, maximumAge 0
- Stato: `{ lat, lng, accuracy, timestamp, error, signalStrength }` 
- Signal strength calcolato da accuracy (≤10m = ottimo, ≤20m = buono, ≤50m = discreto, >50m = scarso)
- Validazione coordinate Italia: lat 36-47°N, lng 6-18°E
- Mock location detection: confronto `speed` vs distanza tra fix consecutivi
- Auto-cleanup con `clearWatch` su unmount

### 2. Hook `useGeofencing.ts`
- Input: `(siteLat, siteLng, radiusMeters)`
- Output: `{ isInside, distance, status: 'inside'|'entering'|'leaving'|'outside' }`
- Hysteresis 20%: ingresso a `< radius`, uscita a `> radius * 1.2`
- Debounce: richiede 3 fix consecutivi nello stesso stato prima di cambiare
- Trigger callback `onEnter` / `onExit` per auto-check-in/out
- Vibration API su cambio stato (haptic feedback)

### 3. Hook `useOfflineQueue.ts`
- Queue persistente con `localStorage` (IndexedDB opzionale futuro)
- Operazioni pending: `{ type: 'check_in'|'check_out', payload, timestamp, retries }`
- Auto-sync con `navigator.onLine` event listener
- Contatore pending esposto per UI badge
- Retry con backoff esponenziale (max 3 tentativi)
- Quando Supabase sarà connesso: sync verso `attendances` table

### 4. Componente `GpsSignalIndicator.tsx`
- 4 barre stile cellulare basate su accuracy GPS
- Colore: verde/giallo/arancione/rosso
- Tooltip con accuracy in metri

### 5. Componente `GeofenceMap.tsx`
- Mappa Leaflet con:
  - Cerchio geofence del cantiere (verde/rosso in base a dentro/fuori)
  - Marker posizione operaio (punto blu con cerchio accuracy)
  - Linea distanza con label in metri
  - Auto-center sulla posizione utente
- Riusa pattern da MappaAccessi.tsx esistente

### 6. Pagina `CheckIn.tsx` (nuova rotta `/app/checkin`)
- Layout mobile-first con:
  - Pulsante check-in/out enorme (min 80x80px) con bordi arrotondati, pensato per guanti
  - Font 18px+, alto contrasto per outdoor
  - 3 modalità selezionabili: GPS Auto, QR Scan, Manuale
  - GPS Auto: usa useGeofencing per check-in automatico
  - QR Scan: riusa logica da Scan.tsx con html5-qrcode
  - Manuale: form con selezione cantiere + nota obbligatoria
  - GpsSignalIndicator in header
  - GeofenceMap sotto il pulsante (collapsabile)
  - Banner sync offline: "X operazioni in attesa di sincronizzazione"
  - Haptic feedback (Vibration API) su successo
  - Feedback visivo: animazione check verde / croce rossa
- Salvataggio locale in localStorage come fallback (sync futuro con Supabase)

### 7. Integrazione navigazione
- Aggiungere rotta `/app/checkin` in App.tsx
- Aggiungere voce "Check-in" nella MobileBottomNav (icona MapPin, sostituisce o affianca "Scansiona")
- Aggiungere nella sidebar desktop

## File creati/modificati

| File | Azione |
|------|--------|
| `src/hooks/useGeolocation.ts` | Nuovo |
| `src/hooks/useGeofencing.ts` | Nuovo |
| `src/hooks/useOfflineQueue.ts` | Nuovo |
| `src/components/gps/GpsSignalIndicator.tsx` | Nuovo |
| `src/components/gps/GeofenceMap.tsx` | Nuovo |
| `src/pages/CheckIn.tsx` | Nuovo |
| `src/App.tsx` | Aggiunta rotta |
| `src/components/layout/MobileBottomNav.tsx` | Aggiunta voce |
| `src/components/layout/AppSidebar.tsx` | Aggiunta voce |

## Limitazioni senza backend

- **Timestamp server-side**: impossibile senza Supabase — uso `Date.now()` locale con flag `server_validated: false`
- **EXIF validation**: impossibile senza edge function — validazione solo client-side
- **Background geolocation**: limitata dal browser (funziona solo con tab attiva), vera BG tracking richiede Capacitor plugin nativo
- **Push notifications**: richiedono Service Worker + backend per subscription — preparata l'infrastruttura ma non attiva
- **Retention policy 90gg**: implementabile solo con database Supabase
- **Sync reale**: la queue offline salva in localStorage, il sync effettivo partirà quando Supabase sarà connesso

Tutto il codice è strutturato per essere immediatamente funzionale con dati reali GPS del dispositivo e pronto per l'integrazione backend.

