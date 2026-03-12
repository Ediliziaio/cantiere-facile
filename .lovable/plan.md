

# Piano: Sistema Comunicazione Unificato

## Stato attuale

- **Comunicazioni.tsx**: chat thread-based funzionante con filtri, ricerca, creazione thread, allegati simulati — buona base
- **TopBar.tsx**: dropdown notifiche con mock system + email notifications, badge count
- **Impostazioni.tsx**: tab "Notifiche Email" con destinatari e soglie scadenze
- **mock-comunicazioni.ts**: tipi `ComunicazioneThread`, `Messaggio`, 8 thread, 24 messaggi mock
- **useOfflineQueue.ts**: hook offline queue per check-in (riusabile pattern)
- **No Supabase connesso** — tutto mock/localStorage

## Cosa manca vs requirements

1. Centro notifiche strutturato con priorita e multi-canale
2. Emergency broadcast system con conferma doppia
3. Preferenze notifiche granulari per utente
4. Delivery tracking e receipt status

## Piano implementativo

### 1. Mock data notifiche (`src/data/mock-notifications.ts`)

Tipi e dati:
- **`AppNotification`**: id, user_id, type (scadenza/incidente/check_in/documento/emergenza/sistema), title, body, priority (critical/high/normal/low), channel (push/email/sms/inapp), read, created_at, action_url, site_id
- **`EmergencyBroadcast`**: id, site_id, sender_id, template, message, recipients_count, confirmations, timestamp
- **`NotificationPreference`**: user_id, channel_enabled (push/email/sms), quiet_hours, muted_sites
- Mock data: 15-20 notifiche miste per priorita, 2 emergency broadcasts, preferenze default

### 2. Componente `NotificationCenter.tsx` (`src/components/notifications/`)

Sostituisce il dropdown notifiche in TopBar con un pannello completo:
- Bell icon con badge count (invariato posizione)
- Sheet/panel laterale con lista notifiche filtrabili per priorita e tipo
- Indicatori visivi per priorita: rosso (critical), arancione (high), default (normal), grigio (low)
- Azioni: segna come letto, segna tutto come letto, filtra per cantiere
- Click su notifica naviga a action_url

### 3. Componente `EmergencyBroadcastModal.tsx` (`src/components/notifications/`)

Dialog emergenza con conferma doppia:
- Step 1: selezione cantiere + template predefinito (evacuazione, infortunio grave, allerta meteo) + messaggio custom
- Step 2: preview destinatari (tutti presenti in cantiere + contatti esterni) + conferma "Sei sicuro? Azione irreversibile"
- Step 3: conferma invio con animazione + log risultato
- Accessibile solo da admin/coordinatori
- Bottone rosso "Emergenza" visibile in TopBar o dashboard

### 4. Pagina `NotificationSettings.tsx` — sezione in Impostazioni

Nuova tab "Preferenze Notifiche" in Impostazioni.tsx:
- Toggle per canale: push on/off, email on/off, SMS solo emergenze
- Quiet hours: picker orario inizio/fine (default 22:00-06:00), bypass per critical
- Mute per cantiere: lista cantieri con toggle mute temporaneo
- Filtro tipologie: toggle per tipo notifica (scadenze, check-in, documenti, sicurezza)

### 5. Hook `useNotifications.ts`

Hook per gestione notifiche in-app:
- State: lista notifiche, unread count, loading
- Actions: markAsRead, markAllRead, addNotification, dismissNotification
- Persistenza localStorage (mock)
- Filtri per priorita, tipo, cantiere

### 6. Aggiornamento TopBar e Dashboard

- **TopBar**: sostituire dropdown notifiche con NotificationCenter (sheet laterale)
- **Dashboard**: aggiungere sezione "Alert Critici" con notifiche critical/high non lette
- Bottone "Emergenza" in TopBar (visibile solo admin)

## File creati/modificati

| File | Azione |
|------|--------|
| `src/data/mock-notifications.ts` | Nuovo — tipi e mock notifiche, emergenze, preferenze |
| `src/components/notifications/NotificationCenter.tsx` | Nuovo — pannello notifiche con filtri |
| `src/components/notifications/EmergencyBroadcastModal.tsx` | Nuovo — modal emergenza 2-step |
| `src/hooks/useNotifications.ts` | Nuovo — hook gestione notifiche |
| `src/components/layout/TopBar.tsx` | Modifica — integra NotificationCenter + bottone emergenza |
| `src/pages/Impostazioni.tsx` | Modifica — aggiunta tab preferenze notifiche |

## Vincoli

- **No Supabase Realtime** — simulato con state React e localStorage
- **No push reali** — simulazione in-app, predisposto per futura integrazione FCM/OneSignal
- **No SMS** — template generato ma non inviato (come notifiche INAIL)
- **No Service Worker** — richiederebbe setup PWA separato
- Chat cantiere gia coperta da Comunicazioni.tsx esistente (non duplicata)

