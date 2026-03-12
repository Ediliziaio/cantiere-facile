import { mockCantieri } from "./mock-data";

export type NotificationPriority = "critical" | "high" | "normal" | "low";
export type NotificationChannel = "push" | "email" | "sms" | "inapp";
export type NotificationType = "scadenza" | "incidente" | "check_in" | "documento" | "emergenza" | "sistema" | "meteo";

export interface AppNotification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  priority: NotificationPriority;
  channels: NotificationChannel[];
  read: boolean;
  created_at: string;
  action_url?: string;
  site_id?: string;
  site_name?: string;
}

export interface EmergencyBroadcast {
  id: string;
  site_id: string;
  site_name: string;
  sender_name: string;
  template: string;
  message: string;
  recipients_count: number;
  confirmations: number;
  timestamp: string;
  status: "inviato" | "confermato" | "annullato";
}

export interface NotificationPreference {
  push_enabled: boolean;
  email_enabled: boolean;
  sms_emergenze_only: boolean;
  quiet_hours_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  muted_sites: string[];
  enabled_types: Record<NotificationType, boolean>;
}

export const emergencyTemplates = [
  { id: "evacuazione", label: "Evacuazione immediata", message: "Evacuazione immediata - Raggiungere il punto di raccolta designato" },
  { id: "infortunio", label: "Infortunio grave", message: "Infortunio grave in corso - Reperire kit primo soccorso e contattare 118" },
  { id: "meteo", label: "Allerta meteo", message: "Allerta meteo severa - Sospendere i lavori e mettere in sicurezza il cantiere" },
  { id: "crollo", label: "Rischio crollo strutturale", message: "Rischio crollo strutturale - Evacuare immediatamente l'area interessata" },
];

const now = new Date();
const ago = (hours: number) => new Date(now.getTime() - hours * 3600000).toISOString();

export const mockAppNotifications: AppNotification[] = [
  {
    id: "n1", user_id: "u1", type: "emergenza", priority: "critical",
    title: "⚠️ Emergenza cantiere Via Roma",
    body: "Segnalazione infortunio grave - Intervento immediato richiesto",
    channels: ["push", "sms", "email", "inapp"], read: false,
    created_at: ago(0.5), action_url: "/app/sicurezza",
    site_id: "c1", site_name: "Residenziale Via Roma 12",
  },
  {
    id: "n2", user_id: "u1", type: "scadenza", priority: "high",
    title: "DURC in scadenza tra 3 giorni",
    body: "Il DURC di Impresa Bianchi S.r.l. scade il 15/03/2026. Rinnovare immediatamente.",
    channels: ["push", "email", "inapp"], read: false,
    created_at: ago(2), action_url: "/app/documenti",
    site_id: "c1", site_name: "Residenziale Via Roma 12",
  },
  {
    id: "n3", user_id: "u1", type: "check_in", priority: "high",
    title: "Check-in mancato: Marco Bianchi",
    body: "Marco Bianchi (solito arrivo 07:00) non risulta presente alle 09:30",
    channels: ["push", "inapp"], read: false,
    created_at: ago(3), action_url: "/app/accessi",
    site_id: "c1", site_name: "Residenziale Via Roma 12",
  },
  {
    id: "n4", user_id: "u1", type: "documento", priority: "normal",
    title: "Documento approvato",
    body: "Il POS aggiornato per Palazzina Bergamo è stato approvato dal coordinatore",
    channels: ["email", "inapp"], read: false,
    created_at: ago(5), action_url: "/app/documenti",
    site_id: "c2", site_name: "Ristrutturazione Palazzina",
  },
  {
    id: "n5", user_id: "u1", type: "incidente", priority: "critical",
    title: "Segnalazione near-miss",
    body: "Caduta materiale dall'alto in zona B - Nessun ferito, area da mettere in sicurezza",
    channels: ["push", "email", "inapp"], read: true,
    created_at: ago(8), action_url: "/app/sicurezza",
    site_id: "c1", site_name: "Residenziale Via Roma 12",
  },
  {
    id: "n6", user_id: "u1", type: "scadenza", priority: "high",
    title: "Formazione sicurezza scaduta",
    body: "Attestato formazione di Luca Verdi scaduto da 2 giorni. Operaio non autorizzato ad accedere.",
    channels: ["push", "email", "inapp"], read: true,
    created_at: ago(12), action_url: "/app/lavoratori",
  },
  {
    id: "n7", user_id: "u1", type: "sistema", priority: "normal",
    title: "Report settimanale disponibile",
    body: "Il report settimanale per tutti i cantieri è stato generato ed è pronto per il download",
    channels: ["email", "inapp"], read: true,
    created_at: ago(24), action_url: "/app/analytics",
  },
  {
    id: "n8", user_id: "u1", type: "meteo", priority: "normal",
    title: "Previsione pioggia domani",
    body: "Prevista pioggia intensa domani 07:00-14:00 per cantiere Bergamo. Valutare sospensione.",
    channels: ["inapp"], read: false,
    created_at: ago(6), site_id: "c2", site_name: "Ristrutturazione Palazzina",
  },
  {
    id: "n9", user_id: "u1", type: "documento", priority: "normal",
    title: "Nuovo documento caricato",
    body: "Piano di montaggio ponteggio caricato da Subappaltatore Verdi S.r.l.",
    channels: ["inapp"], read: true,
    created_at: ago(30), action_url: "/app/documenti",
    site_id: "c2", site_name: "Ristrutturazione Palazzina",
  },
  {
    id: "n10", user_id: "u1", type: "check_in", priority: "normal",
    title: "Ingresso cantiere: 14 operai",
    body: "14 operai hanno effettuato il check-in stamattina a Via Roma 12",
    channels: ["inapp"], read: true,
    created_at: ago(4), site_id: "c1", site_name: "Residenziale Via Roma 12",
  },
  {
    id: "n11", user_id: "u1", type: "sistema", priority: "low",
    title: "Suggerimento: digitalizza i registri",
    body: "Hai ancora 5 registri cartacei non digitalizzati. Caricarli migliora la compliance del 15%.",
    channels: ["inapp"], read: true,
    created_at: ago(48),
  },
  {
    id: "n12", user_id: "u1", type: "scadenza", priority: "normal",
    title: "Idoneità sanitaria in scadenza",
    body: "L'idoneità sanitaria di Paolo Rossi scade tra 15 giorni",
    channels: ["email", "inapp"], read: false,
    created_at: ago(10), action_url: "/app/lavoratori",
  },
  {
    id: "n13", user_id: "u1", type: "incidente", priority: "high",
    title: "Ispezione ASL programmata",
    body: "Ispezione ASL prevista per il 20/03/2026 al cantiere Via Roma 12. Preparare documentazione.",
    channels: ["push", "email", "inapp"], read: false,
    created_at: ago(1), action_url: "/app/sicurezza",
    site_id: "c1", site_name: "Residenziale Via Roma 12",
  },
  {
    id: "n14", user_id: "u1", type: "sistema", priority: "low",
    title: "Nuova funzionalità: Analytics",
    body: "Scopri la nuova dashboard analitica con KPI, trend e report automatici",
    channels: ["inapp"], read: true,
    created_at: ago(72), action_url: "/app/analytics",
  },
  {
    id: "n15", user_id: "u1", type: "documento", priority: "high",
    title: "Documento rifiutato",
    body: "Il DVR aggiornato è stato rifiutato dal coordinatore. Motivo: planimetria non aggiornata.",
    channels: ["push", "email", "inapp"], read: false,
    created_at: ago(7), action_url: "/app/documenti",
    site_id: "c1", site_name: "Residenziale Via Roma 12",
  },
];

export const mockEmergencyBroadcasts: EmergencyBroadcast[] = [
  {
    id: "eb1", site_id: "c1", site_name: "Residenziale Via Roma 12",
    sender_name: "Mario Rossi", template: "infortunio",
    message: "Infortunio grave in zona scavi - Intervento 118 richiesto",
    recipients_count: 18, confirmations: 15,
    timestamp: ago(48), status: "confermato",
  },
  {
    id: "eb2", site_id: "c2", site_name: "Ristrutturazione Palazzina",
    sender_name: "Mario Rossi", template: "meteo",
    message: "Allerta meteo arancione - Sospendere lavori in quota",
    recipients_count: 12, confirmations: 12,
    timestamp: ago(168), status: "confermato",
  },
];

export const defaultNotificationPreference: NotificationPreference = {
  push_enabled: true,
  email_enabled: true,
  sms_emergenze_only: true,
  quiet_hours_enabled: true,
  quiet_hours_start: "22:00",
  quiet_hours_end: "06:00",
  muted_sites: [],
  enabled_types: {
    scadenza: true,
    incidente: true,
    check_in: true,
    documento: true,
    emergenza: true,
    sistema: true,
    meteo: true,
  },
};

export const priorityConfig: Record<NotificationPriority, { label: string; color: string; bgColor: string }> = {
  critical: { label: "Critica", color: "text-destructive", bgColor: "bg-destructive/10" },
  high: { label: "Alta", color: "text-orange-600", bgColor: "bg-orange-500/10" },
  normal: { label: "Normale", color: "text-foreground", bgColor: "bg-muted" },
  low: { label: "Bassa", color: "text-muted-foreground", bgColor: "bg-muted/50" },
};

export const typeConfig: Record<NotificationType, { label: string; icon: string }> = {
  scadenza: { label: "Scadenza", icon: "Clock" },
  incidente: { label: "Sicurezza", icon: "ShieldAlert" },
  check_in: { label: "Presenze", icon: "UserCheck" },
  documento: { label: "Documento", icon: "FileText" },
  emergenza: { label: "Emergenza", icon: "Siren" },
  sistema: { label: "Sistema", icon: "Settings" },
  meteo: { label: "Meteo", icon: "CloudRain" },
};
