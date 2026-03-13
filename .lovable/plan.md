

# Analisi Mobile e Readiness per App Nativa

## Stato attuale della versione mobile

Ho verificato tutte le pagine principali su viewport 375x812 (iPhone). Risultato:

| Area | Stato | Note |
|------|-------|------|
| Dashboard | OK | Card KPI in griglia 2 colonne, pulsanti azione full-width |
| Cantieri | OK | Lista card con progress ring, search bar responsive |
| Check-in GPS | OK | Pulsone ENTRATA grande, toggle GPS/Manuale |
| Badge | OK | Card con filtri, statistiche in griglia 2x2 |
| Bottom Nav | OK | 4 tab + Menu, sheet dal basso con griglia 3 colonne |
| Menu Sheet | OK | Tutte le sezioni visibili, scroll verticale |
| Impostazioni | OK | Tab orizzontali scrollabili, contenuto full-width |
| TopBar | OK | Logo + icone notifiche/profilo |

**Nessun bug critico trovato**. Un warning React minore (`forwardRef` su `App`) che non impatta il funzionamento.

## Readiness per app nativa

Il progetto ha **già Capacitor configurato** (`capacitor.config.ts`, dipendenze `@capacitor/core`, `@capacitor/ios`, `@capacitor/android`). Ha anche la **PWA completa** con service worker, manifest, caching strategies e safe-area utilities.

Sei pronto per fare l'app nativa. Hai due opzioni:

### Opzione 1: PWA installabile (consigliato per partire subito)
L'app è già una PWA completa. Gli utenti possono installarla dal browser (Condividi > Aggiungi a Home) su iPhone e Android. Funziona offline, ha icona personalizzata e si apre in modalità standalone. Non serve pubblicazione su App Store.

### Opzione 2: App nativa con Capacitor (già configurato)
Capacitor è già nel progetto. Per generare l'app nativa:
1. Esporta su GitHub e clona il progetto
2. `npm install` poi `npx cap add ios` e/o `npx cap add android`
3. `npm run build` poi `npx cap sync`
4. `npx cap run ios` (richiede Mac + Xcode) o `npx cap run android` (richiede Android Studio)

La configurazione attuale punta al sandbox per hot-reload durante lo sviluppo. Per la produzione andrà aggiornato `capacitor.config.ts` rimuovendo il campo `server.url`.

## Cosa manca / miglioramenti opzionali

| Miglioramento | Priorità |
|---------------|----------|
| Icone PWA in formato PNG (attualmente SVG, alcuni browser preferiscono PNG) | Media |
| Splash screen per Capacitor (`@capacitor/splash-screen`) | Media |
| Push notifications (`@capacitor/push-notifications`) | Bassa |
| Status bar styling (`@capacitor/status-bar`) | Bassa |

