

# Piano: PWA Enterprise-Grade per Cantiere

## Stato attuale

- **No PWA**: nessun vite-plugin-pwa, service worker, o manifest configurato
- **Offline queue esistente**: `useOfflineQueue.ts` usa localStorage per check-in pending — buona base
- **Capacitor configurato**: app nativa gia predisposta ma PWA e complementare
- **Dark mode**: gia implementato con CSS variables in index.css
- **Lazy loading**: nessun code splitting, tutte le pagine importate staticamente in App.tsx

## Piano implementativo

### 1. Installare vite-plugin-pwa e configurare

**vite.config.ts**: aggiungere VitePWA plugin con:
- Manifest: name "Cantiere Facile", short_name "Cantiere", theme_color `#f97316` (arancione esistente, non verde — coerente col design system), icons 192/512
- Workbox: NetworkFirst per API, CacheFirst per assets statici
- `navigateFallbackDenylist: [/^\/~oauth/]` come richiesto
- registerType: 'prompt' per update controllato dall'utente

### 2. Icone PWA (`public/`)

- Creare `pwa-192x192.png` e `pwa-512x512.png` placeholder (SVG inline convertito)
- `apple-touch-icon.png` per iOS

### 3. SW Registration Hook (`src/hooks/useServiceWorker.ts`)

- Gestione update prompt: "Nuova versione disponibile"
- Stato: needRefresh, offlineReady
- Azione: updateServiceWorker()

### 4. Componenti UI offline/PWA

**`src/components/pwa/OfflineBanner.tsx`**:
- Banner sottile top-of-page: online (nascosto), offline (rosso), syncing (giallo)
- Usa `useOfflineQueue` per mostrare pending count

**`src/components/pwa/InstallPrompt.tsx`**:
- Intercetta `beforeinstallprompt` event
- Mostra banner dopo 2 visite (localStorage counter)
- Bottone "Installa App" con vantaggi

**`src/components/pwa/UpdatePrompt.tsx`**:
- Toast/dialog per "Nuova versione disponibile — Aggiorna ora"

### 5. Code Splitting (`src/App.tsx`)

Convertire tutti gli import statici in `React.lazy()`:
- Pagine pesanti (Analytics, Sicurezza, CheckIn, Firma*) → lazy
- Raggruppamento: landing pages in un chunk, app pages in chunks separati
- `<Suspense>` wrapper con skeleton loader

### 6. Network Resilience Hook (`src/hooks/useNetworkStatus.ts`)

- Rileva `navigator.connection.effectiveType` (2g/3g/4g)
- Rileva `navigator.connection.saveData`
- Espone: isOnline, connectionSpeed, isSlowNetwork, isSaveData
- Integrato in AppLayout per mostrare OfflineBanner

### 7. Haptic Feedback Utility (`src/lib/haptics.ts`)

- `vibrateSuccess()`: 50ms
- `vibrateError()`: 50-100-50ms pattern
- Chiamato da CheckIn su successo/errore

### 8. Touch Target & Accessibility Fixes

- Aggiungere utility class `.touch-target` in index.css: min-w-12 min-h-12
- Applicare ai bottoni principali CheckIn (gia 64px per guanti)
- Screen Wake Lock in CheckIn durante QR scan

### 9. Integrazione in AppLayout

- OfflineBanner sopra TopBar
- UpdatePrompt come toast globale
- InstallPrompt in Landing page

## File creati/modificati

| File | Azione |
|------|--------|
| `vite.config.ts` | Modifica — aggiunta VitePWA plugin |
| `index.html` | Modifica — meta tags PWA (apple-touch-icon, manifest link) |
| `src/hooks/useServiceWorker.ts` | Nuovo — gestione SW registration e update |
| `src/hooks/useNetworkStatus.ts` | Nuovo — connection quality detection |
| `src/components/pwa/OfflineBanner.tsx` | Nuovo — banner connessione |
| `src/components/pwa/InstallPrompt.tsx` | Nuovo — prompt installazione |
| `src/components/pwa/UpdatePrompt.tsx` | Nuovo — prompt aggiornamento |
| `src/lib/haptics.ts` | Nuovo — vibration API wrapper |
| `src/App.tsx` | Modifica — lazy loading tutte le pagine |
| `src/components/layout/AppLayout.tsx` | Modifica — integra OfflineBanner |
| `src/pages/CheckIn.tsx` | Modifica — haptics + wake lock |
| `src/index.css` | Modifica — utility class touch-target |
| `public/pwa-192x192.svg` | Nuovo — icona PWA |
| `public/pwa-512x512.svg` | Nuovo — icona PWA |

## Vincoli

- **No IndexedDB/Dexie**: mantiene localStorage esistente (useOfflineQueue gia funziona), IndexedDB per fase successiva con Supabase reale
- **No pako compression**: overengineering per dati mock
- **No periodic background sync**: supporto browser limitato, non implementabile senza backend
- **Icone SVG placeholder**: non PNG reali (non possiamo generare immagini bitmap)
- **theme_color #f97316**: mantiene il design system arancione esistente, non il verde proposto

