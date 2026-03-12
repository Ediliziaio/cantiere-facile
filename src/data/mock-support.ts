export interface SupportTicket {
  id: string;
  tenant_id: string;
  tenant_name: string;
  requester_name: string;
  requester_email: string;
  assignee_name: string | null;
  subject: string;
  description: string;
  category: "technical" | "billing" | "feature_request" | "training";
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "pending" | "waiting_customer" | "resolved" | "closed";
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  satisfaction_rating: number | null;
  sla_deadline: string;
  sla_breached: boolean;
  tags: string[];
}

export interface TicketComment {
  id: string;
  ticket_id: string;
  author_name: string;
  author_type: "user" | "superadmin";
  content: string;
  is_internal: boolean;
  created_at: string;
}

export interface KBArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: "user_guide" | "admin_guide" | "faq";
  tags: string[];
  is_published: boolean;
  view_count: number;
  helpful_count: number;
  not_helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  target_audience: "all" | "pro" | "enterprise";
  start_date: string;
  end_date: string;
  priority: "info" | "warning" | "critical";
  link_cta: string | null;
}

export const mockTickets: SupportTicket[] = [
  {
    id: "TK-001",
    tenant_id: "t1",
    tenant_name: "Costruzioni Rossi S.r.l.",
    requester_name: "Marco Rossi",
    requester_email: "marco@costruzionirossi.it",
    assignee_name: "Admin Support",
    subject: "Errore caricamento DURC su cantiere Milano Nord",
    description: "Quando provo a caricare il DURC aggiornato nella sezione documenti del cantiere Milano Nord, ricevo un errore 'File non supportato'. Il file è un PDF di 2MB.",
    category: "technical",
    priority: "high",
    status: "pending",
    created_at: "2026-03-10T09:15:00Z",
    updated_at: "2026-03-10T14:30:00Z",
    resolved_at: null,
    satisfaction_rating: null,
    sla_deadline: "2026-03-10T17:15:00Z",
    sla_breached: false,
    tags: ["bug_upload", "durc", "documenti"],
  },
  {
    id: "TK-002",
    tenant_id: "t1",
    tenant_name: "Costruzioni Rossi S.r.l.",
    requester_name: "Laura Bianchi",
    requester_email: "laura@costruzionirossi.it",
    assignee_name: "Admin Support",
    subject: "Come configurare le notifiche scadenze?",
    description: "Vorrei ricevere notifiche email 30 giorni prima della scadenza dei documenti. Non trovo l'opzione nelle impostazioni.",
    category: "training",
    priority: "low",
    status: "resolved",
    created_at: "2026-03-08T11:00:00Z",
    updated_at: "2026-03-09T10:00:00Z",
    resolved_at: "2026-03-09T10:00:00Z",
    satisfaction_rating: 5,
    sla_deadline: "2026-03-09T11:00:00Z",
    sla_breached: false,
    tags: ["notifiche", "scadenze", "onboarding"],
  },
  {
    id: "TK-003",
    tenant_id: "t2",
    tenant_name: "EdilMaster Group",
    requester_name: "Giuseppe Verdi",
    requester_email: "g.verdi@edilmaster.it",
    assignee_name: null,
    subject: "Fattura doppia addebito mese di Febbraio",
    description: "Ho notato un doppio addebito sulla fattura di Febbraio. L'importo addebitato è €598 invece di €299. Chiedo rimborso immediato.",
    category: "billing",
    priority: "critical",
    status: "open",
    created_at: "2026-03-12T08:00:00Z",
    updated_at: "2026-03-12T08:00:00Z",
    resolved_at: null,
    satisfaction_rating: null,
    sla_deadline: "2026-03-12T12:00:00Z",
    sla_breached: false,
    tags: ["fatturazione", "rimborso", "stripe"],
  },
  {
    id: "TK-004",
    tenant_id: "t3",
    tenant_name: "GEC Lombarda",
    requester_name: "Anna Colombo",
    requester_email: "a.colombo@geclombarda.it",
    assignee_name: "Admin Support",
    subject: "Richiesta integrazione con software paghe TeamSystem",
    description: "Sarebbe possibile avere un'integrazione diretta con TeamSystem per esportare le timbrature? Attualmente esportiamo in CSV e reimportiamo manualmente.",
    category: "feature_request",
    priority: "medium",
    status: "waiting_customer",
    created_at: "2026-03-05T14:20:00Z",
    updated_at: "2026-03-07T16:00:00Z",
    resolved_at: null,
    satisfaction_rating: null,
    sla_deadline: "2026-03-06T14:20:00Z",
    sla_breached: true,
    tags: ["integrazione", "teamsystem", "timbrature", "feature_request"],
  },
  {
    id: "TK-005",
    tenant_id: "t2",
    tenant_name: "EdilMaster Group",
    requester_name: "Giuseppe Verdi",
    requester_email: "g.verdi@edilmaster.it",
    assignee_name: "Admin Support",
    subject: "Check-in GPS non funziona su Samsung Galaxy A54",
    description: "Il check-in GPS mostra sempre 'Posizione non disponibile' sul mio Samsung Galaxy A54 con Android 14. Ho già dato i permessi di localizzazione.",
    category: "technical",
    priority: "high",
    status: "pending",
    created_at: "2026-03-11T07:45:00Z",
    updated_at: "2026-03-11T15:00:00Z",
    resolved_at: null,
    satisfaction_rating: null,
    sla_deadline: "2026-03-11T15:45:00Z",
    sla_breached: true,
    tags: ["gps", "android", "bug_mobile", "checkin"],
  },
  {
    id: "TK-006",
    tenant_id: "t4",
    tenant_name: "Impresa Bianchi",
    requester_name: "Roberto Bianchi",
    requester_email: "r.bianchi@impresabianchi.it",
    assignee_name: "Admin Support",
    subject: "Upgrade piano da Starter a Professional",
    description: "Vorrei fare l'upgrade al piano Professional. Abbiamo superato i 5 cantieri del piano Starter. Come procedo?",
    category: "billing",
    priority: "medium",
    status: "resolved",
    created_at: "2026-03-06T09:30:00Z",
    updated_at: "2026-03-06T11:00:00Z",
    resolved_at: "2026-03-06T11:00:00Z",
    satisfaction_rating: 4,
    sla_deadline: "2026-03-07T09:30:00Z",
    sla_breached: false,
    tags: ["upgrade", "piano", "billing"],
  },
  {
    id: "TK-007",
    tenant_id: "t3",
    tenant_name: "GEC Lombarda",
    requester_name: "Luca Ferretti",
    requester_email: "l.ferretti@geclombarda.it",
    assignee_name: null,
    subject: "Firma digitale - documento non si apre in anteprima",
    description: "Quando clicco su 'Anteprima' nel modulo firma digitale, la pagina resta bianca. Succede con tutti i documenti PDF caricati oggi.",
    category: "technical",
    priority: "high",
    status: "open",
    created_at: "2026-03-12T10:30:00Z",
    updated_at: "2026-03-12T10:30:00Z",
    resolved_at: null,
    satisfaction_rating: null,
    sla_deadline: "2026-03-12T18:30:00Z",
    sla_breached: false,
    tags: ["firma_digitale", "anteprima", "pdf", "bug"],
  },
  {
    id: "TK-008",
    tenant_id: "t1",
    tenant_name: "Costruzioni Rossi S.r.l.",
    requester_name: "Marco Rossi",
    requester_email: "marco@costruzionirossi.it",
    assignee_name: "Admin Support",
    subject: "Formazione team su modulo presenze",
    description: "Vorremmo organizzare una sessione di formazione online per il nostro team (8 persone) sull'utilizzo del modulo presenze e timbrature. Disponibili martedì o giovedì pomeriggio.",
    category: "training",
    priority: "low",
    status: "closed",
    created_at: "2026-02-20T10:00:00Z",
    updated_at: "2026-02-28T16:00:00Z",
    resolved_at: "2026-02-28T16:00:00Z",
    satisfaction_rating: 5,
    sla_deadline: "2026-02-21T10:00:00Z",
    sla_breached: false,
    tags: ["formazione", "presenze", "onboarding"],
  },
];

export const mockComments: TicketComment[] = [
  {
    id: "c1",
    ticket_id: "TK-001",
    author_name: "Marco Rossi",
    author_type: "user",
    content: "Il file è un PDF standard generato dal sito INPS. Allego screenshot dell'errore.",
    is_internal: false,
    created_at: "2026-03-10T09:20:00Z",
  },
  {
    id: "c2",
    ticket_id: "TK-001",
    author_name: "Admin Support",
    author_type: "superadmin",
    content: "Grazie Marco. Abbiamo identificato il problema: il nome file contiene caratteri speciali (parentesi). Stiamo rilasciando un fix. Nel frattempo, rinomina il file senza caratteri speciali e riprova.",
    is_internal: false,
    created_at: "2026-03-10T14:30:00Z",
  },
  {
    id: "c3",
    ticket_id: "TK-001",
    author_name: "Admin Support",
    author_type: "superadmin",
    content: "Bug confermato nel parser filename. Fix in deploy domani mattina. Ticket #DEV-342.",
    is_internal: true,
    created_at: "2026-03-10T14:35:00Z",
  },
  {
    id: "c4",
    ticket_id: "TK-002",
    author_name: "Admin Support",
    author_type: "superadmin",
    content: "Ciao Laura! Puoi configurare le notifiche andando su Impostazioni → Notifiche → Scadenze documenti. Troverai l'opzione per impostare il preavviso a 7, 14, o 30 giorni. Ho anche preparato un articolo guida: /help-center",
    is_internal: false,
    created_at: "2026-03-09T10:00:00Z",
  },
  {
    id: "c5",
    ticket_id: "TK-004",
    author_name: "Admin Support",
    author_type: "superadmin",
    content: "Ciao Anna, l'integrazione TeamSystem è nella nostra roadmap Q3 2026. Nel frattempo, abbiamo migliorato l'export CSV con un formato compatibile con l'import TeamSystem. Puoi testarlo?",
    is_internal: false,
    created_at: "2026-03-07T16:00:00Z",
  },
  {
    id: "c6",
    ticket_id: "TK-005",
    author_name: "Admin Support",
    author_type: "superadmin",
    content: "Ciao Giuseppe, abbiamo riscontrato un problema noto con alcuni dispositivi Samsung e Android 14. Prova ad andare su Impostazioni dispositivo → App → Cantiere in Cloud → Permessi → Posizione → seleziona 'Sempre'. Fammi sapere se risolve.",
    is_internal: false,
    created_at: "2026-03-11T15:00:00Z",
  },
  {
    id: "c7",
    ticket_id: "TK-005",
    author_name: "Admin Support",
    author_type: "superadmin",
    content: "Problema noto Samsung + Android 14. Già segnalato a team mobile, workaround confermato funzionante.",
    is_internal: true,
    created_at: "2026-03-11T15:05:00Z",
  },
  {
    id: "c8",
    ticket_id: "TK-006",
    author_name: "Admin Support",
    author_type: "superadmin",
    content: "Ciao Roberto! Ho attivato il piano Professional sul tuo account. Il cambio sarà effettivo dal prossimo ciclo di fatturazione. Ora puoi gestire fino a 20 cantieri. Buon lavoro!",
    is_internal: false,
    created_at: "2026-03-06T11:00:00Z",
  },
];

export const mockKBArticles: KBArticle[] = [
  {
    id: "kb-001",
    title: "Come caricare un documento su un cantiere",
    slug: "caricare-documento-cantiere",
    content: `## Come caricare un documento

1. Vai alla sezione **Cantieri** e seleziona il cantiere desiderato
2. Clicca sulla tab **Documenti**
3. Premi il pulsante **Carica documento** in alto a destra
4. Seleziona il file dal tuo dispositivo (formati supportati: PDF, JPG, PNG, DOC, DOCX)
5. Compila i campi richiesti: tipo documento, data scadenza (se applicabile)
6. Clicca **Conferma caricamento**

### Limiti
- Dimensione massima: 20MB per file
- Massimo 10 file contemporaneamente

### Problemi comuni
- **Errore "File non supportato"**: verifica che l'estensione sia corretta e il file non sia corrotto
- **Upload lento**: controlla la connessione internet`,
    category: "user_guide",
    tags: ["documenti", "upload", "cantiere"],
    is_published: true,
    view_count: 342,
    helpful_count: 89,
    not_helpful_count: 5,
    created_at: "2025-11-15T10:00:00Z",
    updated_at: "2026-02-20T14:00:00Z",
  },
  {
    id: "kb-002",
    title: "Configurare le notifiche scadenze",
    slug: "configurare-notifiche-scadenze",
    content: `## Notifiche scadenze documenti

Per non perdere mai una scadenza, configura le notifiche automatiche:

1. Vai su **Impostazioni** → **Notifiche**
2. Nella sezione **Scadenze documenti**, attiva il toggle
3. Seleziona il preavviso: **7 giorni**, **14 giorni** o **30 giorni**
4. Scegli il canale: **Email**, **Push notification** o entrambi

### Chi riceve le notifiche?
- L'**amministratore** dell'azienda riceve sempre le notifiche
- I **capocantiere** ricevono le notifiche relative ai loro cantieri
- I **lavoratori** ricevono notifiche solo per i propri documenti personali (badge, certificati)`,
    category: "user_guide",
    tags: ["notifiche", "scadenze", "impostazioni"],
    is_published: true,
    view_count: 218,
    helpful_count: 67,
    not_helpful_count: 3,
    created_at: "2025-12-01T09:00:00Z",
    updated_at: "2026-01-15T11:00:00Z",
  },
  {
    id: "kb-003",
    title: "Come funziona il Check-in GPS",
    slug: "checkin-gps",
    content: `## Check-in GPS

Il check-in GPS consente di registrare la presenza dei lavoratori in cantiere tramite geolocalizzazione.

### Requisiti
- Smartphone con GPS attivo
- Permessi di localizzazione concessi all'app
- Trovarsi entro il **raggio geofence** del cantiere (default: 100m)

### Come fare check-in
1. Apri l'app e vai su **Check-in GPS**
2. L'app rileva automaticamente la tua posizione
3. Se sei nel raggio del cantiere, vedrai il pulsante **Check-in** verde
4. Premi per registrare l'ingresso
5. A fine giornata, premi **Check-out**

### Troubleshooting
- **"Posizione non disponibile"**: assicurati che il GPS sia attivo e i permessi concessi
- **"Fuori dal cantiere"**: verifica di essere entro il raggio configurato dall'amministratore
- **Dispositivi Samsung Android 14**: vai su Impostazioni → App → Permessi → Posizione → "Sempre"`,
    category: "user_guide",
    tags: ["gps", "checkin", "presenze", "geofence"],
    is_published: true,
    view_count: 456,
    helpful_count: 112,
    not_helpful_count: 18,
    created_at: "2025-10-20T08:00:00Z",
    updated_at: "2026-03-01T10:00:00Z",
  },
  {
    id: "kb-004",
    title: "Gestione utenti e ruoli",
    slug: "gestione-utenti-ruoli",
    content: `## Gestione utenti

### Ruoli disponibili
- **Amministratore**: accesso completo a tutte le funzionalità
- **Capocantiere**: gestione cantieri assegnati, documenti, presenze
- **Lavoratore**: visualizzazione propri dati, check-in, badge

### Invitare un nuovo utente
1. Vai su **Impostazioni** → **Utenti**
2. Clicca **Invita utente**
3. Inserisci email e seleziona il ruolo
4. L'utente riceverà un'email con il link di attivazione

### Disattivare un utente
1. Vai su **Impostazioni** → **Utenti**
2. Trova l'utente e clicca il menu ⋮
3. Seleziona **Disattiva**
4. L'utente non potrà più accedere ma i suoi dati saranno conservati`,
    category: "admin_guide",
    tags: ["utenti", "ruoli", "amministrazione"],
    is_published: true,
    view_count: 189,
    helpful_count: 45,
    not_helpful_count: 2,
    created_at: "2025-11-01T10:00:00Z",
    updated_at: "2026-01-10T09:00:00Z",
  },
  {
    id: "kb-005",
    title: "Domande frequenti sulla fatturazione",
    slug: "faq-fatturazione",
    content: `## FAQ Fatturazione

### Quando viene addebitato il pagamento?
Il pagamento viene addebitato il primo giorno di ogni mese per il mese corrente.

### Posso cambiare piano in qualsiasi momento?
Sì, l'upgrade è immediato e il costo viene calcolato pro-rata. Il downgrade diventa effettivo dal mese successivo.

### Come ottengo la fattura?
Le fatture sono disponibili nella sezione **Abbonamento** → **Storico fatture**. Vengono anche inviate via email.

### Posso avere la fattura intestata diversamente?
Sì, vai su **Impostazioni** → **Dati fiscali** e aggiorna le informazioni. Le modifiche si applicano dalla fattura successiva.

### Cosa succede se il pagamento fallisce?
Ritentiamo il pagamento dopo 3 e 7 giorni. Se fallisce ancora, l'account viene sospeso ma i dati sono conservati per 90 giorni.`,
    category: "faq",
    tags: ["fatturazione", "pagamento", "piano", "billing"],
    is_published: true,
    view_count: 567,
    helpful_count: 134,
    not_helpful_count: 8,
    created_at: "2025-09-15T10:00:00Z",
    updated_at: "2026-02-01T14:00:00Z",
  },
  {
    id: "kb-006",
    title: "Firma digitale: guida completa",
    slug: "firma-digitale-guida",
    content: `## Firma Digitale

### Cos'è la firma digitale in Cantiere in Cloud?
È un sistema di firma elettronica avanzata che consente di firmare documenti direttamente dalla piattaforma, con valore legale.

### Come creare un documento da firmare
1. Vai su **Firma Digitale** → **Nuovo documento**
2. Carica il PDF o seleziona un template
3. Configura i campi firma (posizione, firmatari)
4. Invia ai firmatari

### Come firmare
I firmatari ricevono un link via email. Cliccando il link possono:
1. Visualizzare il documento
2. Disegnare la propria firma
3. Confermare con OTP via SMS

### Verifica autenticità
Ogni documento firmato ha un codice hash univoco. Chiunque può verificare l'autenticità su /verifica inserendo il codice.`,
    category: "user_guide",
    tags: ["firma", "digitale", "documenti", "guida"],
    is_published: true,
    view_count: 234,
    helpful_count: 78,
    not_helpful_count: 4,
    created_at: "2026-01-10T10:00:00Z",
    updated_at: "2026-03-05T12:00:00Z",
  },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: "ann-001",
    title: "Nuova funzione: Firma Digitale",
    message: "Ora puoi firmare documenti direttamente dalla piattaforma con valore legale. Scopri come funziona!",
    target_audience: "all",
    start_date: "2026-03-01T00:00:00Z",
    end_date: "2026-03-31T23:59:00Z",
    priority: "info",
    link_cta: "/app/firma",
  },
  {
    id: "ann-002",
    title: "Manutenzione programmata 15 Marzo",
    message: "Il servizio sarà in manutenzione dalle 02:00 alle 06:00 del 15 Marzo per aggiornamenti infrastruttura. I dati non saranno persi.",
    target_audience: "all",
    start_date: "2026-03-12T00:00:00Z",
    end_date: "2026-03-15T06:00:00Z",
    priority: "warning",
    link_cta: null,
  },
];

// Helper: category/priority/status labels
export const categoryLabels: Record<SupportTicket["category"], string> = {
  technical: "Tecnico",
  billing: "Fatturazione",
  feature_request: "Richiesta funzionalità",
  training: "Formazione",
};

export const priorityLabels: Record<SupportTicket["priority"], string> = {
  low: "Bassa",
  medium: "Media",
  high: "Alta",
  critical: "Critica",
};

export const statusLabels: Record<SupportTicket["status"], string> = {
  open: "Aperto",
  pending: "In lavorazione",
  waiting_customer: "In attesa cliente",
  resolved: "Risolto",
  closed: "Chiuso",
};

export const kbCategoryLabels: Record<KBArticle["category"], string> = {
  user_guide: "Guide Utente",
  admin_guide: "Guide Amministratore",
  faq: "FAQ",
};
