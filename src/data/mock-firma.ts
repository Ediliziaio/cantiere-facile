export type StatoDocumentoFirma = 'bozza' | 'in_attesa' | 'parzialmente_firmato' | 'completato' | 'rifiutato' | 'scaduto';
export type TipoDocumento = 'collaudo' | 'verbale' | 'autorizzazione' | 'modulo_sicurezza' | 'altro';
export type MetodoFirma = 'disegno' | 'otp';
export type StatoFirmatario = 'in_attesa' | 'firmato' | 'rifiutato' | 'scaduto';
export type TipoCampoFirma = 'firma' | 'iniziali' | 'data' | 'testo_libero';
export type AzioneAudit = 'documento_creato' | 'documento_inviato' | 'link_aperto' | 'otp_richiesto' | 'otp_verificato' | 'firmato' | 'rifiutato' | 'documento_completato' | 'reminder_inviato';

export interface DocumentoFirma {
  id: string;
  tenant_id: string;
  cantiere_id: string;
  cantiere_nome: string;
  nome: string;
  descrizione: string;
  tipo_documento: TipoDocumento;
  file_originale_url: string | null;
  file_firmato_url: string | null;
  stato: StatoDocumentoFirma;
  creato_da: string;
  data_creazione: string;
  data_scadenza_firma: string;
  richiede_tutti: boolean;
}

export interface CampoFirma {
  id: string;
  documento_id: string;
  pagina: number;
  x: number;
  y: number;
  larghezza: number;
  altezza: number;
  firmatario_id: string;
  ordine: number;
  tipo: TipoCampoFirma;
  obbligatorio: boolean;
  stato: 'in_attesa' | 'firmato' | 'rifiutato';
}

export interface Firmatario {
  id: string;
  documento_id: string;
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  ruolo_descrizione: string;
  token_firma: string;
  metodo_preferito: MetodoFirma;
  data_firma: string | null;
  stato: StatoFirmatario;
  motivo_rifiuto: string | null;
  ip_address: string | null;
}

export interface FirmaAuditLog {
  id: string;
  documento_id: string;
  firmatario_id: string | null;
  firmatario_nome?: string;
  azione: AzioneAudit;
  timestamp: string;
  ip_address: string | null;
  dettagli: string | null;
}

// ─── MOCK DATA ─────────────────────────────────────────────

export const mockDocumentiFirma: DocumentoFirma[] = [
  {
    id: "df1",
    tenant_id: "t1",
    cantiere_id: "c1",
    cantiere_nome: "Residenza Parco Verde",
    nome: "Verbale di Collaudo Strutturale",
    descrizione: "Collaudo delle strutture in c.a. del lotto A",
    tipo_documento: "collaudo",
    file_originale_url: "/mock/collaudo.pdf",
    file_firmato_url: "/mock/collaudo-firmato.pdf",
    stato: "completato",
    creato_da: "Mario Bianchi",
    data_creazione: "2026-02-15",
    data_scadenza_firma: "2026-03-01",
    richiede_tutti: true,
  },
  {
    id: "df2",
    tenant_id: "t1",
    cantiere_id: "c1",
    cantiere_nome: "Residenza Parco Verde",
    nome: "Autorizzazione Accesso Cantiere",
    descrizione: "Autorizzazione per subappaltatore elettricista",
    tipo_documento: "autorizzazione",
    file_originale_url: "/mock/autorizzazione.pdf",
    file_firmato_url: null,
    stato: "in_attesa",
    creato_da: "Mario Bianchi",
    data_creazione: "2026-03-08",
    data_scadenza_firma: "2026-03-15",
    richiede_tutti: true,
  },
  {
    id: "df3",
    tenant_id: "t1",
    cantiere_id: "c2",
    cantiere_nome: "Ponte San Giorgio",
    nome: "Verbale Riunione Sicurezza",
    descrizione: "Verbale della riunione periodica di sicurezza Q1 2026",
    tipo_documento: "verbale",
    file_originale_url: "/mock/verbale.pdf",
    file_firmato_url: null,
    stato: "parzialmente_firmato",
    creato_da: "Luigi Verdi",
    data_creazione: "2026-03-05",
    data_scadenza_firma: "2026-03-12",
    richiede_tutti: true,
  },
  {
    id: "df4",
    tenant_id: "t1",
    cantiere_id: "c1",
    cantiere_nome: "Residenza Parco Verde",
    nome: "Modulo Consegna DPI",
    descrizione: "Dichiarazione di avvenuta consegna DPI ai lavoratori",
    tipo_documento: "modulo_sicurezza",
    file_originale_url: null,
    file_firmato_url: null,
    stato: "bozza",
    creato_da: "Mario Bianchi",
    data_creazione: "2026-03-10",
    data_scadenza_firma: "2026-03-20",
    richiede_tutti: false,
  },
  {
    id: "df5",
    tenant_id: "t1",
    cantiere_id: "c2",
    cantiere_nome: "Ponte San Giorgio",
    nome: "Dichiarazione Conformità Impianti",
    descrizione: "Conformità impianto elettrico di cantiere",
    tipo_documento: "altro",
    file_originale_url: "/mock/conformita.pdf",
    file_firmato_url: null,
    stato: "rifiutato",
    creato_da: "Luigi Verdi",
    data_creazione: "2026-03-01",
    data_scadenza_firma: "2026-03-10",
    richiede_tutti: true,
  },
];

export const mockFirmatari: Firmatario[] = [
  // df1 – completato
  {
    id: "f1", documento_id: "df1", nome: "Marco", cognome: "Rossi", email: "m.rossi@example.com",
    telefono: "+39 333 1234567", ruolo_descrizione: "Direttore Lavori", token_firma: "tok-abc-001",
    metodo_preferito: "disegno", data_firma: "2026-02-20T14:32:00", stato: "firmato",
    motivo_rifiuto: null, ip_address: "93.42.118.5",
  },
  {
    id: "f2", documento_id: "df1", nome: "Giulia", cognome: "Verdi", email: "g.verdi@example.com",
    telefono: "+39 340 7654321", ruolo_descrizione: "Responsabile Sicurezza", token_firma: "tok-abc-002",
    metodo_preferito: "otp", data_firma: "2026-02-21T10:15:00", stato: "firmato",
    motivo_rifiuto: null, ip_address: "151.38.22.10",
  },
  // df2 – in_attesa
  {
    id: "f3", documento_id: "df2", nome: "Andrea", cognome: "Colombo", email: "a.colombo@example.com",
    telefono: "+39 347 1112233", ruolo_descrizione: "Titolare Subappaltatore", token_firma: "tok-def-001",
    metodo_preferito: "disegno", data_firma: null, stato: "in_attesa",
    motivo_rifiuto: null, ip_address: null,
  },
  {
    id: "f4", documento_id: "df2", nome: "Sara", cognome: "Marino", email: "s.marino@example.com",
    telefono: "+39 328 4455667", ruolo_descrizione: "Direttore Lavori", token_firma: "tok-def-002",
    metodo_preferito: "otp", data_firma: null, stato: "in_attesa",
    motivo_rifiuto: null, ip_address: null,
  },
  // df3 – parzialmente firmato
  {
    id: "f5", documento_id: "df3", nome: "Paolo", cognome: "Neri", email: "p.neri@example.com",
    telefono: "+39 335 9988776", ruolo_descrizione: "RSPP", token_firma: "tok-ghi-001",
    metodo_preferito: "disegno", data_firma: "2026-03-07T09:45:00", stato: "firmato",
    motivo_rifiuto: null, ip_address: "212.45.33.1",
  },
  {
    id: "f6", documento_id: "df3", nome: "Elena", cognome: "Bianchi", email: "e.bianchi@example.com",
    telefono: "+39 339 5544332", ruolo_descrizione: "Coordinatore Sicurezza", token_firma: "tok-ghi-002",
    metodo_preferito: "otp", data_firma: null, stato: "in_attesa",
    motivo_rifiuto: null, ip_address: null,
  },
  // df5 – rifiutato
  {
    id: "f7", documento_id: "df5", nome: "Roberto", cognome: "Ferrari", email: "r.ferrari@example.com",
    telefono: "+39 366 1122334", ruolo_descrizione: "Installatore Impianti", token_firma: "tok-jkl-001",
    metodo_preferito: "disegno", data_firma: null, stato: "rifiutato",
    motivo_rifiuto: "Il documento contiene dati errati sul numero di serie dell'impianto",
    ip_address: "5.170.88.12",
  },
  {
    id: "f8", documento_id: "df5", nome: "Chiara", cognome: "Russo", email: "c.russo@example.com",
    telefono: "+39 342 6677889", ruolo_descrizione: "Direttore Lavori", token_firma: "tok-jkl-002",
    metodo_preferito: "otp", data_firma: null, stato: "in_attesa",
    motivo_rifiuto: null, ip_address: null,
  },
];

export const mockCampiFirma: CampoFirma[] = [
  { id: "cf1", documento_id: "df1", pagina: 1, x: 15, y: 75, larghezza: 30, altezza: 8, firmatario_id: "f1", ordine: 1, tipo: "firma", obbligatorio: true, stato: "firmato" },
  { id: "cf2", documento_id: "df1", pagina: 1, x: 55, y: 75, larghezza: 30, altezza: 8, firmatario_id: "f2", ordine: 2, tipo: "firma", obbligatorio: true, stato: "firmato" },
  { id: "cf3", documento_id: "df2", pagina: 1, x: 15, y: 80, larghezza: 30, altezza: 8, firmatario_id: "f3", ordine: 1, tipo: "firma", obbligatorio: true, stato: "in_attesa" },
  { id: "cf4", documento_id: "df2", pagina: 1, x: 55, y: 80, larghezza: 30, altezza: 8, firmatario_id: "f4", ordine: 2, tipo: "firma", obbligatorio: true, stato: "in_attesa" },
  { id: "cf5", documento_id: "df3", pagina: 2, x: 20, y: 70, larghezza: 25, altezza: 8, firmatario_id: "f5", ordine: 1, tipo: "firma", obbligatorio: true, stato: "firmato" },
  { id: "cf6", documento_id: "df3", pagina: 2, x: 55, y: 70, larghezza: 25, altezza: 8, firmatario_id: "f6", ordine: 2, tipo: "firma", obbligatorio: true, stato: "in_attesa" },
  { id: "cf7", documento_id: "df5", pagina: 1, x: 20, y: 85, larghezza: 30, altezza: 8, firmatario_id: "f7", ordine: 1, tipo: "firma", obbligatorio: true, stato: "rifiutato" },
  { id: "cf8", documento_id: "df5", pagina: 1, x: 55, y: 85, larghezza: 30, altezza: 8, firmatario_id: "f8", ordine: 2, tipo: "firma", obbligatorio: true, stato: "in_attesa" },
];

export const mockFirmaAuditLog: FirmaAuditLog[] = [
  { id: "al1", documento_id: "df1", firmatario_id: null, azione: "documento_creato", timestamp: "2026-02-15T09:00:00", ip_address: "10.0.0.1", dettagli: null },
  { id: "al2", documento_id: "df1", firmatario_id: null, azione: "documento_inviato", timestamp: "2026-02-15T09:30:00", ip_address: "10.0.0.1", dettagli: "Inviate 2 richieste di firma" },
  { id: "al3", documento_id: "df1", firmatario_id: "f1", firmatario_nome: "Marco Rossi", azione: "link_aperto", timestamp: "2026-02-20T14:20:00", ip_address: "93.42.118.5", dettagli: null },
  { id: "al4", documento_id: "df1", firmatario_id: "f1", firmatario_nome: "Marco Rossi", azione: "firmato", timestamp: "2026-02-20T14:32:00", ip_address: "93.42.118.5", dettagli: "Metodo: disegno" },
  { id: "al5", documento_id: "df1", firmatario_id: "f2", firmatario_nome: "Giulia Verdi", azione: "link_aperto", timestamp: "2026-02-21T10:00:00", ip_address: "151.38.22.10", dettagli: null },
  { id: "al6", documento_id: "df1", firmatario_id: "f2", firmatario_nome: "Giulia Verdi", azione: "otp_richiesto", timestamp: "2026-02-21T10:10:00", ip_address: "151.38.22.10", dettagli: null },
  { id: "al7", documento_id: "df1", firmatario_id: "f2", firmatario_nome: "Giulia Verdi", azione: "otp_verificato", timestamp: "2026-02-21T10:12:00", ip_address: "151.38.22.10", dettagli: null },
  { id: "al8", documento_id: "df1", firmatario_id: "f2", firmatario_nome: "Giulia Verdi", azione: "firmato", timestamp: "2026-02-21T10:15:00", ip_address: "151.38.22.10", dettagli: "Metodo: OTP" },
  { id: "al9", documento_id: "df1", firmatario_id: null, azione: "documento_completato", timestamp: "2026-02-21T10:15:01", ip_address: null, dettagli: "Tutti i firmatari hanno firmato" },
  { id: "al10", documento_id: "df2", firmatario_id: null, azione: "documento_creato", timestamp: "2026-03-08T08:00:00", ip_address: "10.0.0.1", dettagli: null },
  { id: "al11", documento_id: "df2", firmatario_id: null, azione: "documento_inviato", timestamp: "2026-03-08T08:15:00", ip_address: "10.0.0.1", dettagli: "Inviate 2 richieste di firma" },
  { id: "al12", documento_id: "df3", firmatario_id: "f5", firmatario_nome: "Paolo Neri", azione: "firmato", timestamp: "2026-03-07T09:45:00", ip_address: "212.45.33.1", dettagli: "Metodo: disegno" },
  { id: "al13", documento_id: "df3", firmatario_id: null, azione: "reminder_inviato", timestamp: "2026-03-10T08:00:00", ip_address: null, dettagli: "Reminder automatico a Elena Bianchi" },
  { id: "al14", documento_id: "df5", firmatario_id: "f7", firmatario_nome: "Roberto Ferrari", azione: "rifiutato", timestamp: "2026-03-05T16:30:00", ip_address: "5.170.88.12", dettagli: "Dati errati sul numero di serie" },
  { id: "al15", documento_id: "df4", firmatario_id: null, azione: "documento_creato", timestamp: "2026-03-10T11:00:00", ip_address: "10.0.0.1", dettagli: null },
];

// Helper
export function getStatoLabel(stato: StatoDocumentoFirma) {
  const map: Record<StatoDocumentoFirma, { label: string; variant: string }> = {
    bozza: { label: "Bozza", variant: "secondary" },
    in_attesa: { label: "In attesa", variant: "warning" },
    parzialmente_firmato: { label: "Parz. firmato", variant: "info" },
    completato: { label: "Completato", variant: "success" },
    rifiutato: { label: "Rifiutato", variant: "destructive" },
    scaduto: { label: "Scaduto", variant: "muted" },
  };
  return map[stato];
}

export function getTipoLabel(tipo: TipoDocumento) {
  const map: Record<TipoDocumento, string> = {
    collaudo: "Collaudo",
    verbale: "Verbale",
    autorizzazione: "Autorizzazione",
    modulo_sicurezza: "Modulo Sicurezza",
    altro: "Altro",
  };
  return map[tipo];
}
