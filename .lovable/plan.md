

## Notifiche Email Automatiche Scadenza Documenti

### Obiettivo
Aggiungere un sistema di notifiche email simulate per documenti DURC e formazione in scadenza, con un tab dedicato in Impostazioni per configurarle e una pagina/sezione per visualizzare lo storico notifiche inviate.

### Approccio
Poiché l'app opera in modalità mock frontend-only, le email saranno simulate: il sistema genera notifiche automatiche basate sullo stato dei documenti e mostra uno storico delle email "inviate" con la possibilità di configurare soglie e destinatari.

### Modifiche

**1. `src/data/mock-data.ts`** — Aggiungere:
- `NotificaEmail` interface: id, tipo (`scadenza_durc` | `scadenza_formazione` | `scadenza_idoneita`), destinatario_email, destinatario_nome, documento_nome, categoria, data_scadenza, giorni_rimanenti, stato_invio (`inviata` | `programmata` | `errore`), data_invio, letto
- `mockNotificheEmail[]`: ~8 notifiche simulate basate sui documenti in scadenza/scaduti reali presenti in `mockDocumenti` (DURC s2/s3, Attestato Sicurezza l2/l4, Idoneità Sanitaria l3)
- `ImpostazioniNotifiche` interface: soglie di preavviso (30gg, 15gg, 7gg, scaduto), email_destinatari, abilitata per categoria (DURC, formazione, idoneità)
- `mockImpostazioniNotifiche`: configurazione default

**2. `src/pages/Impostazioni.tsx`** — Aggiungere tab "Notifiche Email" (solo admin):
- **Configurazione**: card con toggle per abilitare notifiche per DURC, Formazione, Idoneità Sanitaria; select soglie preavviso (30/15/7 giorni); lista destinatari email
- **Storico notifiche inviate**: tabella con documento, categoria, destinatario, giorni rimanenti, stato invio, data invio — con filtro per categoria e stato
- **Bottone "Invia ora"**: simula invio immediato di tutte le notifiche pendenti (toast di conferma)
- **Anteprima email**: dialog che mostra il template dell'email che verrebbe inviata (oggetto, corpo con dati documento, scadenza, azione richiesta)

**3. `src/components/layout/TopBar.tsx`** — Arricchire il dropdown notifiche:
- Aggiungere le notifiche email di scadenza al conteggio badge (unread)
- Mostrare icona Mail per notifiche di tipo email
- Distinguere visivamente notifiche email da notifiche di sistema

### File coinvolti
- `src/data/mock-data.ts` — nuovi tipi e dati mock notifiche email
- `src/pages/Impostazioni.tsx` — nuovo tab "Notifiche Email"
- `src/components/layout/TopBar.tsx` — integrazione notifiche email nel dropdown

