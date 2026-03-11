

## Setup Capacitor per App Nativa Android/iOS

### Cosa farò

Installerò e configurerò Capacitor nel progetto per permetterti di compilare una vera app nativa pubblicabile su Play Store e App Store.

### Modifiche tecniche

1. **Installazione dipendenze**: `@capacitor/core`, `@capacitor/cli`, `@capacitor/ios`, `@capacitor/android`

2. **Configurazione `capacitor.config.ts`**:
   - appId: `app.lovable.72fb55796dcb4052a729905080034084`
   - appName: `Cantiere in Cloud`
   - webDir: `dist`
   - Server con hot-reload dal sandbox per sviluppo

3. **Nessuna modifica al codice dell'app** — il progetto è già ottimizzato per mobile (safe areas, bottom nav, meta tag).

### Dopo la configurazione — cosa dovrai fare tu

1. Esporta il progetto su GitHub (bottone "Export to Github")
2. Clona il repo e fai `npm install`
3. Aggiungi la piattaforma: `npx cap add android` e/o `npx cap add ios`
4. `npx cap update android` (o ios)
5. `npm run build`
6. `npx cap sync`
7. `npx cap run android` (serve Android Studio) o `npx cap run ios` (serve Mac + Xcode)

Per iOS serve un Mac. Per Android serve Android Studio installato.

