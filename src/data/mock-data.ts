// Mock data for Cantiere in Cloud — Rossi Costruzioni S.r.l.

export const mockTenant = {
  id: "t1",
  nome_azienda: "Rossi Costruzioni S.r.l.",
  p_iva: "IT01234567890",
  email_admin: "admin@rossicostruzioni.it",
  piano: "pro" as const,
};

export const mockCantieri = [
  {
    id: "c1",
    tenant_id: "t1",
    nome: "Residenziale Via Roma 12",
    indirizzo: "Via Roma 12",
    comune: "Milano",
    data_inizio: "2025-09-01",
    data_fine_prevista: "2026-08-31",
    stato: "attivo" as const,
    responsabile_id: "u1",
    lavoratori_count: 18,
    documenti_ok: 42,
    documenti_totali: 48,
    subappaltatori_count: 3,
    latitudine: 45.4642,
    longitudine: 9.1900,
    raggio_geofence: 200,
  },
  {
    id: "c2",
    tenant_id: "t1",
    nome: "Ristrutturazione Palazzina",
    indirizzo: "Via Dante 5",
    comune: "Bergamo",
    data_inizio: "2026-01-15",
    data_fine_prevista: "2026-12-20",
    stato: "attivo" as const,
    responsabile_id: "u1",
    lavoratori_count: 12,
    documenti_ok: 28,
    documenti_totali: 36,
    subappaltatori_count: 2,
    latitudine: 45.6983,
    longitudine: 9.6773,
    raggio_geofence: 200,
  },
];

export const mockSubappaltatori = [
  {
    id: "s1",
    tenant_id: "t1",
    cantiere_id: "c1",
    ragione_sociale: "Impianti Elettrici Bianchi S.n.c.",
    p_iva: "IT09876543210",
    email_referente: "info@bianchimpianti.it",
    telefono: "+39 02 1234567",
    stato_documenti: "completo" as const,
    documenti_ok: 12,
    documenti_totali: 12,
    portal_token: "portal-bianchi-abc123",
  },
  {
    id: "s2",
    tenant_id: "t1",
    cantiere_id: "c1",
    ragione_sociale: "Idraulica Verdi & Figli",
    p_iva: "IT05678901234",
    email_referente: "verdi@idraulicaverdi.it",
    telefono: "+39 02 7654321",
    stato_documenti: "in_scadenza" as const,
    documenti_ok: 9,
    documenti_totali: 11,
    portal_token: "portal-verdi-def456",
  },
  {
    id: "s3",
    tenant_id: "t1",
    cantiere_id: "c2",
    ragione_sociale: "Carpenteria Metallica Neri",
    p_iva: "IT03456789012",
    email_referente: "neri@carpenterianeri.it",
    telefono: "+39 035 9876543",
    stato_documenti: "incompleto" as const,
    documenti_ok: 5,
    documenti_totali: 10,
    portal_token: "portal-neri-ghi789",
  },
];

export type HealthStatus = "idoneo" | "idoneo_limitato" | "non_idoneo";

export interface WorkerQualification {
  type: string;
  expiry: string;
  doc_url: string | null;
}

export interface SafetyTraining {
  course: string;
  date: string;
  expiry: string;
  hours: number;
}

export interface Lavoratore {
  id: string;
  tenant_id: string;
  nome: string;
  cognome: string;
  codice_fiscale: string;
  tipo: "interno" | "esterno";
  subappaltatore_id: string | null;
  mansione: string;
  qualifications: WorkerQualification[];
  safety_training: SafetyTraining[];
  durc_valid: boolean;
  durc_expiry: string | null;
  health_status: HealthStatus;
  last_medical_visit: string;
}

export const mockLavoratori: Lavoratore[] = [
  {
    id: "l1", tenant_id: "t1", nome: "Marco", cognome: "Rossi",
    codice_fiscale: "RSSMRC85M01F205Z", tipo: "interno", subappaltatore_id: null, mansione: "Capocantiere",
    qualifications: [
      { type: "patente_gru", expiry: "2027-06-15", doc_url: null },
      { type: "patente_escavatore", expiry: "2027-03-01", doc_url: null },
    ],
    safety_training: [
      { course: "corso_preposto", date: "2025-10-01", expiry: "2027-10-01", hours: 16 },
      { course: "primo_soccorso", date: "2025-06-15", expiry: "2027-06-15", hours: 12 },
    ],
    durc_valid: true, durc_expiry: "2026-07-05",
    health_status: "idoneo", last_medical_visit: "2025-11-20",
  },
  {
    id: "l2", tenant_id: "t1", nome: "Giuseppe", cognome: "Bianchi",
    codice_fiscale: "BNCGPP90A15L219X", tipo: "esterno", subappaltatore_id: "s1", mansione: "Elettricista",
    qualifications: [
      { type: "patente_elettrica_PES", expiry: "2027-01-15", doc_url: null },
    ],
    safety_training: [
      { course: "corso_base_sicurezza", date: "2025-06-15", expiry: "2026-02-15", hours: 8 }, // SCADUTO
    ],
    durc_valid: true, durc_expiry: "2026-07-10",
    health_status: "idoneo", last_medical_visit: "2025-07-01",
  },
  {
    id: "l3", tenant_id: "t1", nome: "Antonio", cognome: "Verdi",
    codice_fiscale: "VRDNTN88D22F205Y", tipo: "esterno", subappaltatore_id: "s2", mansione: "Idraulico",
    qualifications: [
      { type: "patente_saldatura", expiry: "2026-08-15", doc_url: null },
    ],
    safety_training: [
      { course: "corso_base_sicurezza", date: "2025-08-15", expiry: "2026-08-15", hours: 8 },
    ],
    durc_valid: true, durc_expiry: "2026-06-15",
    health_status: "idoneo_limitato", last_medical_visit: "2025-09-20",
  },
  {
    id: "l4", tenant_id: "t1", nome: "Paolo", cognome: "Neri",
    codice_fiscale: "NREPLP92H05A794W", tipo: "esterno", subappaltatore_id: "s3", mansione: "Saldatore",
    qualifications: [
      { type: "patente_saldatura", expiry: "2026-06-01", doc_url: null },
    ],
    safety_training: [
      { course: "corso_base_sicurezza", date: "2025-06-01", expiry: "2026-06-01", hours: 8 }, // In scadenza
    ],
    durc_valid: false, durc_expiry: "2026-02-28", // SCADUTO
    health_status: "idoneo", last_medical_visit: "2025-12-01",
  },
  {
    id: "l5", tenant_id: "t1", nome: "Luca", cognome: "Ferrari",
    codice_fiscale: "FRRLCU87S30F205V", tipo: "interno", subappaltatore_id: null, mansione: "Muratore",
    qualifications: [],
    safety_training: [
      { course: "corso_base_sicurezza", date: "2025-11-10", expiry: "2027-11-10", hours: 8 },
    ],
    durc_valid: true, durc_expiry: "2026-07-05",
    health_status: "idoneo", last_medical_visit: "2025-10-15",
  },
];

// Site assignments: which workers are assigned to which sites
export interface SiteAssignment {
  id: string;
  lavoratore_id: string;
  cantiere_id: string;
  data_inizio: string;
  data_fine: string | null;
  attivo: boolean;
}

export const mockSiteAssignments: SiteAssignment[] = [
  { id: "sa1", lavoratore_id: "l1", cantiere_id: "c1", data_inizio: "2025-09-01", data_fine: null, attivo: true },
  { id: "sa2", lavoratore_id: "l2", cantiere_id: "c1", data_inizio: "2025-09-15", data_fine: null, attivo: true },
  { id: "sa3", lavoratore_id: "l3", cantiere_id: "c1", data_inizio: "2025-10-01", data_fine: null, attivo: true },
  { id: "sa4", lavoratore_id: "l4", cantiere_id: "c2", data_inizio: "2026-01-15", data_fine: null, attivo: true },
  { id: "sa5", lavoratore_id: "l5", cantiere_id: "c1", data_inizio: "2025-09-01", data_fine: null, attivo: true },
  { id: "sa6", lavoratore_id: "l1", cantiere_id: "c2", data_inizio: "2026-01-15", data_fine: null, attivo: true },
];

export type MezzoStatoOperativo = "operativo" | "in_manutenzione" | "fermo";

export interface Mezzo {
  id: string;
  tenant_id: string;
  cantiere_id: string;
  tipo: string;
  targa_o_matricola: string;
  descrizione: string;
  stato_operativo: MezzoStatoOperativo;
  data_immatricolazione: string;
  data_ultima_revisione: string | null;
  data_prossima_revisione: string;
  data_ultima_manutenzione: string | null;
  data_prossima_manutenzione: string;
  scadenza_assicurazione: string;
  scadenza_collaudo: string | null;
  ore_lavoro: number;
  km_percorsi: number | null;
  responsabile: string;
  note: string | null;
}

export interface ManutenzioneEntry {
  id: string;
  mezzo_id: string;
  data: string;
  tipo: "ordinaria" | "straordinaria" | "revisione" | "collaudo";
  descrizione: string;
  eseguita_da: string;
  costo: number | null;
}

export const mockMezzi: Mezzo[] = [
  {
    id: "m1", tenant_id: "t1", cantiere_id: "c1",
    tipo: "Escavatore", targa_o_matricola: "RM-2024-001",
    descrizione: "CAT 320 — escavatore cingolato",
    stato_operativo: "operativo",
    data_immatricolazione: "2024-03-15",
    data_ultima_revisione: "2025-09-10",
    data_prossima_revisione: "2026-09-10",
    data_ultima_manutenzione: "2026-01-20",
    data_prossima_manutenzione: "2026-07-20",
    scadenza_assicurazione: "2026-12-31",
    scadenza_collaudo: "2027-03-15",
    ore_lavoro: 3420,
    km_percorsi: null,
    responsabile: "Marco Rossi",
    note: null,
  },
  {
    id: "m2", tenant_id: "t1", cantiere_id: "c1",
    tipo: "Gru a torre", targa_o_matricola: "MI-GRU-045",
    descrizione: "Liebherr 280 EC-H — gru a torre fissa",
    stato_operativo: "operativo",
    data_immatricolazione: "2022-06-01",
    data_ultima_revisione: "2025-06-01",
    data_prossima_revisione: "2026-06-01",
    data_ultima_manutenzione: "2025-12-15",
    data_prossima_manutenzione: "2026-06-15",
    scadenza_assicurazione: "2026-08-30",
    scadenza_collaudo: "2026-06-01",
    ore_lavoro: 8750,
    km_percorsi: null,
    responsabile: "Marco Rossi",
    note: "Collaudo in scadenza — prenotare verifica INAIL",
  },
  {
    id: "m3", tenant_id: "t1", cantiere_id: "c1",
    tipo: "Autocarro", targa_o_matricola: "FG 123 AB",
    descrizione: "IVECO Daily 70C — autocarro ribaltabile",
    stato_operativo: "operativo",
    data_immatricolazione: "2021-11-20",
    data_ultima_revisione: "2025-11-20",
    data_prossima_revisione: "2026-11-20",
    data_ultima_manutenzione: "2026-02-10",
    data_prossima_manutenzione: "2026-08-10",
    scadenza_assicurazione: "2026-05-15",
    scadenza_collaudo: null,
    ore_lavoro: 1200,
    km_percorsi: 67800,
    responsabile: "Luca Ferrari",
    note: null,
  },
  {
    id: "m4", tenant_id: "t1", cantiere_id: "c2",
    tipo: "Piattaforma aerea", targa_o_matricola: "BG-PTA-012",
    descrizione: "JLG 860SJ — piattaforma telescopica",
    stato_operativo: "in_manutenzione",
    data_immatricolazione: "2023-02-28",
    data_ultima_revisione: "2025-02-28",
    data_prossima_revisione: "2026-02-28",
    data_ultima_manutenzione: "2025-08-01",
    data_prossima_manutenzione: "2026-02-01",
    scadenza_assicurazione: "2026-09-30",
    scadenza_collaudo: "2027-02-28",
    ore_lavoro: 2100,
    km_percorsi: null,
    responsabile: "Paolo Neri",
    note: "In manutenzione straordinaria — sostituzione cilindro idraulico",
  },
  {
    id: "m5", tenant_id: "t1", cantiere_id: "c2",
    tipo: "Betoniera", targa_o_matricola: "BG-BET-003",
    descrizione: "IMER L120 — betoniera a bicchiere",
    stato_operativo: "fermo",
    data_immatricolazione: "2019-07-10",
    data_ultima_revisione: "2024-07-10",
    data_prossima_revisione: "2025-07-10",
    data_ultima_manutenzione: "2025-01-15",
    data_prossima_manutenzione: "2025-07-15",
    scadenza_assicurazione: "2025-12-31",
    scadenza_collaudo: "2025-07-10",
    ore_lavoro: 5600,
    km_percorsi: null,
    responsabile: "Paolo Neri",
    note: "Revisione e assicurazione scadute — fermo fino a rinnovo",
  },
];

export const mockManutenzioni: ManutenzioneEntry[] = [
  { id: "man1", mezzo_id: "m1", data: "2026-01-20", tipo: "ordinaria", descrizione: "Cambio olio e filtri, controllo cingoli", eseguita_da: "Officina Meccanica Brambilla", costo: 1200 },
  { id: "man2", mezzo_id: "m1", data: "2025-09-10", tipo: "revisione", descrizione: "Revisione annuale — esito positivo", eseguita_da: "Centro Revisioni Milano", costo: 350 },
  { id: "man3", mezzo_id: "m2", data: "2025-12-15", tipo: "ordinaria", descrizione: "Controllo funi, pulegge e sistema di sicurezza", eseguita_da: "Liebherr Service Italia", costo: 2800 },
  { id: "man4", mezzo_id: "m2", data: "2025-06-01", tipo: "revisione", descrizione: "Revisione biennale — esito positivo", eseguita_da: "INAIL Verifiche", costo: 500 },
  { id: "man5", mezzo_id: "m3", data: "2026-02-10", tipo: "ordinaria", descrizione: "Tagliando 60.000 km, sostituzione pastiglie freni", eseguita_da: "Iveco Service Milano", costo: 890 },
  { id: "man6", mezzo_id: "m4", data: "2026-03-05", tipo: "straordinaria", descrizione: "Sostituzione cilindro idraulico braccio telescopico", eseguita_da: "JLG Italia", costo: 4500 },
  { id: "man7", mezzo_id: "m4", data: "2025-08-01", tipo: "ordinaria", descrizione: "Manutenzione programmata semestrale", eseguita_da: "JLG Italia", costo: 1600 },
  { id: "man8", mezzo_id: "m5", data: "2025-01-15", tipo: "ordinaria", descrizione: "Controllo motore e ingranaggi", eseguita_da: "Officina Meccanica Brambilla", costo: 450 },
];

export type DocumentoStato = "valido" | "in_scadenza" | "scaduto" | "da_verificare";
export type ProcessingStatus = "uploaded" | "processing" | "validated" | "approved" | "archived";

export interface Documento {
  id: string;
  tenant_id: string;
  cantiere_id: string;
  riferimento_tipo: "subappaltatore" | "lavoratore" | "mezzo";
  riferimento_id: string;
  nome_file: string;
  data_caricamento: string;
  data_scadenza: string | null;
  stato: DocumentoStato;
  categoria: string;
  processing_status: ProcessingStatus;
  file_size_kb: number;
  mime_type: string;
  sha256_hash: string;
  extracted_fields: Record<string, string> | null;
  uploaded_by: string;
}

export const mockDocumenti: Documento[] = [
  { id: "d1", tenant_id: "t1", cantiere_id: "c1", riferimento_tipo: "subappaltatore", riferimento_id: "s1", nome_file: "DURC_Bianchi_2026.pdf", data_caricamento: "2026-01-10", data_scadenza: "2026-07-10", stato: "valido", categoria: "DURC", processing_status: "approved", file_size_kb: 245, mime_type: "application/pdf", sha256_hash: "a1b2c3d4e5f6", extracted_fields: { ragione_sociale: "Impianti Elettrici Bianchi S.n.c.", p_iva: "IT09876543210", data_emissione: "2026-01-10", data_scadenza: "2026-07-10" }, uploaded_by: "Andrea Rossi" },
  { id: "d2", tenant_id: "t1", cantiere_id: "c1", riferimento_tipo: "subappaltatore", riferimento_id: "s2", nome_file: "Visura_Camerale_Verdi.pdf", data_caricamento: "2025-12-01", data_scadenza: "2026-03-25", stato: "in_scadenza", categoria: "Visura Camerale", processing_status: "approved", file_size_kb: 380, mime_type: "application/pdf", sha256_hash: "b2c3d4e5f6g7", extracted_fields: { ragione_sociale: "Idraulica Verdi & Figli", p_iva: "IT05678901234" }, uploaded_by: "Andrea Rossi" },
  { id: "d3", tenant_id: "t1", cantiere_id: "c1", riferimento_tipo: "lavoratore", riferimento_id: "l2", nome_file: "Attestato_Sicurezza_Bianchi.pdf", data_caricamento: "2025-06-15", data_scadenza: "2026-02-15", stato: "scaduto", categoria: "Attestato Sicurezza", processing_status: "approved", file_size_kb: 520, mime_type: "application/pdf", sha256_hash: "c3d4e5f6g7h8", extracted_fields: { corso: "Corso Base Sicurezza", ore: "8", ente: "RLST Lombardia" }, uploaded_by: "Sara Colombo" },
  { id: "d4", tenant_id: "t1", cantiere_id: "c2", riferimento_tipo: "subappaltatore", riferimento_id: "s3", nome_file: "POS_Neri.pdf", data_caricamento: "2026-02-01", data_scadenza: null, stato: "da_verificare", categoria: "POS", processing_status: "validated", file_size_kb: 1800, mime_type: "application/pdf", sha256_hash: "d4e5f6g7h8i9", extracted_fields: { revisione: "Rev. 03", coordinatore: "Ing. Franco Motta" }, uploaded_by: "Fabio Galli" },
  { id: "d5", tenant_id: "t1", cantiere_id: "c1", riferimento_tipo: "mezzo", riferimento_id: "m1", nome_file: "Libretto_Escavatore.pdf", data_caricamento: "2026-01-05", data_scadenza: "2027-01-05", stato: "valido", categoria: "Libretto", processing_status: "approved", file_size_kb: 310, mime_type: "application/pdf", sha256_hash: "e5f6g7h8i9j0", extracted_fields: null, uploaded_by: "Andrea Rossi" },
  { id: "d6", tenant_id: "t1", cantiere_id: "c1", riferimento_tipo: "lavoratore", riferimento_id: "l1", nome_file: "Idoneita_Sanitaria_Rossi.pdf", data_caricamento: "2025-11-20", data_scadenza: "2026-04-20", stato: "in_scadenza", categoria: "Idoneità Sanitaria", processing_status: "approved", file_size_kb: 180, mime_type: "application/pdf", sha256_hash: "f6g7h8i9j0k1", extracted_fields: { esito: "Idoneo", medico: "Dr. Bianchi" }, uploaded_by: "Sara Colombo" },
  { id: "d7", tenant_id: "t1", cantiere_id: "c2", riferimento_tipo: "subappaltatore", riferimento_id: "s3", nome_file: "Polizza_RC_Neri.pdf", data_caricamento: "2026-01-20", data_scadenza: "2026-03-12", stato: "in_scadenza", categoria: "Polizza RC", processing_status: "approved", file_size_kb: 290, mime_type: "application/pdf", sha256_hash: "g7h8i9j0k1l2", extracted_fields: { compagnia: "Generali", massimale: "€5.000.000" }, uploaded_by: "Andrea Rossi" },
  { id: "d8", tenant_id: "t1", cantiere_id: "c1", riferimento_tipo: "mezzo", riferimento_id: "m2", nome_file: "Certificato_Collaudo_Gru.pdf", data_caricamento: "2025-06-01", data_scadenza: "2026-06-01", stato: "in_scadenza", categoria: "Collaudo", processing_status: "approved", file_size_kb: 420, mime_type: "application/pdf", sha256_hash: "h8i9j0k1l2m3", extracted_fields: null, uploaded_by: "Andrea Rossi" },
  { id: "d9", tenant_id: "t1", cantiere_id: "c1", riferimento_tipo: "mezzo", riferimento_id: "m3", nome_file: "Assicurazione_Autocarro.pdf", data_caricamento: "2025-05-15", data_scadenza: "2026-05-15", stato: "in_scadenza", categoria: "Assicurazione", processing_status: "approved", file_size_kb: 350, mime_type: "application/pdf", sha256_hash: "i9j0k1l2m3n4", extracted_fields: null, uploaded_by: "Sara Colombo" },
  { id: "d10", tenant_id: "t1", cantiere_id: "c2", riferimento_tipo: "mezzo", riferimento_id: "m4", nome_file: "Libretto_Piattaforma.pdf", data_caricamento: "2025-02-28", data_scadenza: "2027-02-28", stato: "valido", categoria: "Libretto", processing_status: "approved", file_size_kb: 280, mime_type: "application/pdf", sha256_hash: "j0k1l2m3n4o5", extracted_fields: null, uploaded_by: "Fabio Galli" },
  { id: "d11", tenant_id: "t1", cantiere_id: "c1", riferimento_tipo: "lavoratore", riferimento_id: "l1", nome_file: "Attestato_Sicurezza_Rossi.pdf", data_caricamento: "2025-10-01", data_scadenza: "2027-10-01", stato: "valido", categoria: "Attestato Sicurezza", processing_status: "approved", file_size_kb: 490, mime_type: "application/pdf", sha256_hash: "k1l2m3n4o5p6", extracted_fields: { corso: "Corso Preposto", ore: "16" }, uploaded_by: "Andrea Rossi" },
  { id: "d12", tenant_id: "t1", cantiere_id: "c1", riferimento_tipo: "lavoratore", riferimento_id: "l3", nome_file: "Attestato_Sicurezza_Verdi.pdf", data_caricamento: "2025-08-15", data_scadenza: "2026-08-15", stato: "valido", categoria: "Attestato Sicurezza", processing_status: "approved", file_size_kb: 460, mime_type: "application/pdf", sha256_hash: "l2m3n4o5p6q7", extracted_fields: null, uploaded_by: "Sara Colombo" },
  { id: "d13", tenant_id: "t1", cantiere_id: "c2", riferimento_tipo: "lavoratore", riferimento_id: "l4", nome_file: "Attestato_Sicurezza_Neri.pdf", data_caricamento: "2025-06-01", data_scadenza: "2026-06-01", stato: "in_scadenza", categoria: "Attestato Sicurezza", processing_status: "approved", file_size_kb: 510, mime_type: "application/pdf", sha256_hash: "m3n4o5p6q7r8", extracted_fields: null, uploaded_by: "Fabio Galli" },
  { id: "d14", tenant_id: "t1", cantiere_id: "c1", riferimento_tipo: "lavoratore", riferimento_id: "l5", nome_file: "Attestato_Sicurezza_Ferrari.pdf", data_caricamento: "2025-11-10", data_scadenza: "2027-11-10", stato: "valido", categoria: "Attestato Sicurezza", processing_status: "approved", file_size_kb: 475, mime_type: "application/pdf", sha256_hash: "n4o5p6q7r8s9", extracted_fields: null, uploaded_by: "Andrea Rossi" },
  { id: "d15", tenant_id: "t1", cantiere_id: "c1", riferimento_tipo: "lavoratore", riferimento_id: "l3", nome_file: "Idoneita_Sanitaria_Verdi.pdf", data_caricamento: "2025-09-20", data_scadenza: "2026-03-20", stato: "in_scadenza", categoria: "Idoneità Sanitaria", processing_status: "approved", file_size_kb: 195, mime_type: "application/pdf", sha256_hash: "o5p6q7r8s9t0", extracted_fields: { esito: "Idoneo con limitazioni" }, uploaded_by: "Sara Colombo" },
  { id: "d16", tenant_id: "t1", cantiere_id: "c1", riferimento_tipo: "lavoratore", riferimento_id: "l2", nome_file: "Idoneita_Sanitaria_Bianchi.pdf", data_caricamento: "2025-07-01", data_scadenza: "2026-07-01", stato: "valido", categoria: "Idoneità Sanitaria", processing_status: "approved", file_size_kb: 210, mime_type: "application/pdf", sha256_hash: "p6q7r8s9t0u1", extracted_fields: null, uploaded_by: "Andrea Rossi" },
  { id: "d17", tenant_id: "t1", cantiere_id: "c2", riferimento_tipo: "lavoratore", riferimento_id: "l4", nome_file: "Idoneita_Sanitaria_Neri.pdf", data_caricamento: "2025-12-01", data_scadenza: "2026-12-01", stato: "valido", categoria: "Idoneità Sanitaria", processing_status: "approved", file_size_kb: 185, mime_type: "application/pdf", sha256_hash: "q7r8s9t0u1v2", extracted_fields: null, uploaded_by: "Fabio Galli" },
  { id: "d18", tenant_id: "t1", cantiere_id: "c1", riferimento_tipo: "lavoratore", riferimento_id: "l5", nome_file: "Idoneita_Sanitaria_Ferrari.pdf", data_caricamento: "2025-10-15", data_scadenza: "2026-10-15", stato: "valido", categoria: "Idoneità Sanitaria", processing_status: "approved", file_size_kb: 200, mime_type: "application/pdf", sha256_hash: "r8s9t0u1v2w3", extracted_fields: null, uploaded_by: "Andrea Rossi" },
  { id: "d19", tenant_id: "t1", cantiere_id: "c1", riferimento_tipo: "subappaltatore", riferimento_id: "s2", nome_file: "DURC_Verdi_2026.pdf", data_caricamento: "2025-12-15", data_scadenza: "2026-06-15", stato: "in_scadenza", categoria: "DURC", processing_status: "approved", file_size_kb: 260, mime_type: "application/pdf", sha256_hash: "s9t0u1v2w3x4", extracted_fields: { ragione_sociale: "Idraulica Verdi & Figli", p_iva: "IT05678901234" }, uploaded_by: "Andrea Rossi" },
  { id: "d20", tenant_id: "t1", cantiere_id: "c2", riferimento_tipo: "subappaltatore", riferimento_id: "s3", nome_file: "DURC_Neri_2026.pdf", data_caricamento: "2025-11-01", data_scadenza: "2026-02-28", stato: "scaduto", categoria: "DURC", processing_status: "approved", file_size_kb: 240, mime_type: "application/pdf", sha256_hash: "t0u1v2w3x4y5", extracted_fields: { ragione_sociale: "Carpenteria Metallica Neri" }, uploaded_by: "Fabio Galli" },
  { id: "d21", tenant_id: "t1", cantiere_id: "c1", riferimento_tipo: "subappaltatore", riferimento_id: "t1", nome_file: "DURC_RossiCostruzioni_2026.pdf", data_caricamento: "2026-01-05", data_scadenza: "2026-07-05", stato: "valido", categoria: "DURC", processing_status: "approved", file_size_kb: 255, mime_type: "application/pdf", sha256_hash: "u1v2w3x4y5z6", extracted_fields: { ragione_sociale: "Rossi Costruzioni S.r.l.", p_iva: "IT01234567890" }, uploaded_by: "Andrea Rossi" },
];

// ── Document Audit Logs ──

export type AuditAction = "upload" | "view" | "download" | "approve" | "archive" | "delete";

export interface DocumentAuditLog {
  id: string;
  documento_id: string;
  action: AuditAction;
  user_name: string;
  timestamp: string;
  details: string | null;
}

export const mockDocumentAuditLogs: DocumentAuditLog[] = [
  { id: "al1", documento_id: "d1", action: "upload", user_name: "Andrea Rossi", timestamp: "2026-01-10T09:00:00", details: null },
  { id: "al2", documento_id: "d1", action: "approve", user_name: "Andrea Rossi", timestamp: "2026-01-10T09:15:00", details: "DURC verificato" },
  { id: "al3", documento_id: "d1", action: "view", user_name: "Sara Colombo", timestamp: "2026-03-10T14:00:00", details: null },
  { id: "al4", documento_id: "d4", action: "upload", user_name: "Fabio Galli", timestamp: "2026-02-01T10:00:00", details: null },
  { id: "al5", documento_id: "d4", action: "view", user_name: "Andrea Rossi", timestamp: "2026-02-02T08:30:00", details: null },
  { id: "al6", documento_id: "d3", action: "download", user_name: "Sara Colombo", timestamp: "2026-03-08T11:00:00", details: null },
  { id: "al7", documento_id: "d20", action: "upload", user_name: "Fabio Galli", timestamp: "2025-11-01T14:00:00", details: null },
  { id: "al8", documento_id: "d20", action: "approve", user_name: "Andrea Rossi", timestamp: "2025-11-02T09:00:00", details: "DURC approvato" },
];

export const mockAccessi = [
  { id: "a1", cantiere_id: "c1", lavoratore_id: "l1", lavoratore_nome: "Marco Rossi", tipo: "entrata" as const, timestamp: "2026-03-10T07:30:00", metodo: "qr" as const },
  { id: "a2", cantiere_id: "c1", lavoratore_id: "l2", lavoratore_nome: "Giuseppe Bianchi", tipo: "entrata" as const, timestamp: "2026-03-10T07:45:00", metodo: "qr" as const },
  { id: "a3", cantiere_id: "c1", lavoratore_id: "l5", lavoratore_nome: "Luca Ferrari", tipo: "entrata" as const, timestamp: "2026-03-10T08:00:00", metodo: "manuale" as const },
  { id: "a4", cantiere_id: "c1", lavoratore_id: "l1", lavoratore_nome: "Marco Rossi", tipo: "uscita" as const, timestamp: "2026-03-10T12:30:00", metodo: "qr" as const },
  { id: "a5", cantiere_id: "c2", lavoratore_id: "l4", lavoratore_nome: "Paolo Neri", tipo: "entrata" as const, timestamp: "2026-03-10T08:15:00", metodo: "qr" as const },
];

export const mockScadenze = mockDocumenti
  .filter((d) => d.data_scadenza)
  .map((d) => ({
    id: d.id,
    nome_file: d.nome_file,
    categoria: d.categoria,
    data_scadenza: d.data_scadenza!,
    stato: d.stato,
    cantiere: mockCantieri.find((c) => c.id === d.cantiere_id)?.nome || "",
    riferimento_tipo: d.riferimento_tipo,
  }))
  .sort((a, b) => a.data_scadenza.localeCompare(b.data_scadenza));

export const mockNotifiche = [
  { id: "n1", tipo: "scadenza_documento" as const, testo: "DURC di Idraulica Verdi scade tra 15 giorni", letto: false, created_at: "2026-03-10T09:00:00" },
  { id: "n2", tipo: "documento_caricato" as const, testo: "Carpenteria Neri ha caricato POS_Neri.pdf", letto: false, created_at: "2026-03-09T16:30:00" },
  { id: "n3", tipo: "scadenza_documento" as const, testo: "Attestato Sicurezza di G. Bianchi è scaduto", letto: true, created_at: "2026-03-08T08:00:00" },
];

export const dashboardStats = {
  cantieriAttivi: 2,
  documentiInScadenza: 3,
  documentiScaduti: 1,
  accessiOggi: 5,
  subAppConProblemi: 2,
};

// Helper: get scadenza status for a date
export function getScadenzaStatus(dateStr: string): "valido" | "in_scadenza" | "scaduto" {
  const today = new Date("2026-03-11");
  const date = new Date(dateStr);
  const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "scaduto";
  if (diffDays <= 30) return "in_scadenza";
  return "valido";
}

export type UtenteRuolo = "admin" | "manager";
export type UtenteStato = "attivo" | "invitato" | "disabilitato";

export interface UtenteAzienda {
  id: string;
  tenant_id: string;
  nome: string;
  cognome: string;
  email: string;
  ruolo: UtenteRuolo;
  stato: UtenteStato;
  ultimo_accesso: string | null;
  cantieri_assegnati: string[];
}

export const mockUtentiAzienda: UtenteAzienda[] = [
  {
    id: "ua1", tenant_id: "t1", nome: "Andrea", cognome: "Rossi",
    email: "admin@rossicostruzioni.it", ruolo: "admin", stato: "attivo",
    ultimo_accesso: "2026-03-11T08:30:00", cantieri_assegnati: [],
  },
  {
    id: "ua2", tenant_id: "t1", nome: "Sara", cognome: "Colombo",
    email: "s.colombo@rossicostruzioni.it", ruolo: "manager", stato: "attivo",
    ultimo_accesso: "2026-03-10T17:15:00", cantieri_assegnati: ["c1"],
  },
  {
    id: "ua3", tenant_id: "t1", nome: "Fabio", cognome: "Galli",
    email: "f.galli@rossicostruzioni.it", ruolo: "manager", stato: "attivo",
    ultimo_accesso: "2026-03-09T14:00:00", cantieri_assegnati: ["c1", "c2"],
  },
  {
    id: "ua4", tenant_id: "t1", nome: "Elena", cognome: "Martini",
    email: "e.martini@rossicostruzioni.it", ruolo: "manager", stato: "invitato",
    ultimo_accesso: null, cantieri_assegnati: ["c2"],
  },
  {
    id: "ua5", tenant_id: "t1", nome: "Roberto", cognome: "Conti",
    email: "r.conti@rossicostruzioni.it", ruolo: "admin", stato: "disabilitato",
    ultimo_accesso: "2026-01-20T09:45:00", cantieri_assegnati: [],
  },
];

export type LogTipoAzione = "login" | "modifica" | "upload" | "creazione" | "eliminazione" | "invito";

export interface LogAttivita {
  id: string;
  tenant_id: string;
  utente_id: string;
  utente_nome: string;
  tipo: LogTipoAzione;
  descrizione: string;
  dettaglio: string | null;
  timestamp: string;
}

export const mockLogAttivita: LogAttivita[] = [
  { id: "log1", tenant_id: "t1", utente_id: "ua1", utente_nome: "Andrea Rossi", tipo: "login", descrizione: "Accesso al sistema", dettaglio: null, timestamp: "2026-03-11T08:30:00" },
  { id: "log2", tenant_id: "t1", utente_id: "ua1", utente_nome: "Andrea Rossi", tipo: "upload", descrizione: "Caricamento documento", dettaglio: "DURC_Bianchi_2026.pdf — Cantiere Via Roma 12", timestamp: "2026-03-11T09:15:00" },
  { id: "log3", tenant_id: "t1", utente_id: "ua2", utente_nome: "Sara Colombo", tipo: "login", descrizione: "Accesso al sistema", dettaglio: null, timestamp: "2026-03-10T17:15:00" },
  { id: "log4", tenant_id: "t1", utente_id: "ua2", utente_nome: "Sara Colombo", tipo: "modifica", descrizione: "Modifica dati lavoratore", dettaglio: "Aggiornato mansione di Giuseppe Bianchi", timestamp: "2026-03-10T17:30:00" },
  { id: "log5", tenant_id: "t1", utente_id: "ua1", utente_nome: "Andrea Rossi", tipo: "creazione", descrizione: "Nuovo cantiere creato", dettaglio: "Ristrutturazione Palazzina — Bergamo", timestamp: "2026-03-10T10:00:00" },
  { id: "log6", tenant_id: "t1", utente_id: "ua3", utente_nome: "Fabio Galli", tipo: "login", descrizione: "Accesso al sistema", dettaglio: null, timestamp: "2026-03-09T14:00:00" },
  { id: "log7", tenant_id: "t1", utente_id: "ua3", utente_nome: "Fabio Galli", tipo: "upload", descrizione: "Caricamento documento", dettaglio: "POS_Neri.pdf — Cantiere Palazzina Bergamo", timestamp: "2026-03-09T14:20:00" },
  { id: "log8", tenant_id: "t1", utente_id: "ua1", utente_nome: "Andrea Rossi", tipo: "invito", descrizione: "Invito utente", dettaglio: "Invitata Elena Martini come Manager", timestamp: "2026-03-08T11:00:00" },
  { id: "log9", tenant_id: "t1", utente_id: "ua1", utente_nome: "Andrea Rossi", tipo: "modifica", descrizione: "Modifica impostazioni azienda", dettaglio: "Aggiornata ragione sociale", timestamp: "2026-03-07T16:45:00" },
  { id: "log10", tenant_id: "t1", utente_id: "ua2", utente_nome: "Sara Colombo", tipo: "eliminazione", descrizione: "Documento eliminato", dettaglio: "Vecchio_DURC_Verdi.pdf", timestamp: "2026-03-07T10:30:00" },
  { id: "log11", tenant_id: "t1", utente_id: "ua1", utente_nome: "Andrea Rossi", tipo: "upload", descrizione: "Caricamento documento", dettaglio: "Polizza_RC_Neri.pdf — Cantiere Palazzina Bergamo", timestamp: "2026-03-06T09:00:00" },
  { id: "log12", tenant_id: "t1", utente_id: "ua3", utente_nome: "Fabio Galli", tipo: "login", descrizione: "Accesso al sistema", dettaglio: null, timestamp: "2026-03-05T08:00:00" },
  { id: "log13", tenant_id: "t1", utente_id: "ua1", utente_nome: "Andrea Rossi", tipo: "creazione", descrizione: "Nuovo subappaltatore aggiunto", dettaglio: "Carpenteria Metallica Neri — Cantiere Palazzina", timestamp: "2026-03-04T14:30:00" },
  { id: "log14", tenant_id: "t1", utente_id: "ua5", utente_nome: "Roberto Conti", tipo: "login", descrizione: "Accesso al sistema", dettaglio: null, timestamp: "2026-01-20T09:45:00" },
  { id: "log15", tenant_id: "t1", utente_id: "ua1", utente_nome: "Andrea Rossi", tipo: "modifica", descrizione: "Utente disabilitato", dettaglio: "Disabilitato Roberto Conti", timestamp: "2026-01-21T10:00:00" },
];

// ── Notifiche Email Scadenza ──

export type NotificaEmailTipo = "scadenza_durc" | "scadenza_formazione" | "scadenza_idoneita";
export type NotificaEmailStato = "inviata" | "programmata" | "errore";

export interface NotificaEmail {
  id: string;
  tipo: NotificaEmailTipo;
  destinatario_email: string;
  destinatario_nome: string;
  documento_nome: string;
  categoria: string;
  data_scadenza: string;
  giorni_rimanenti: number;
  stato_invio: NotificaEmailStato;
  data_invio: string;
  letto: boolean;
}

export const mockNotificheEmail: NotificaEmail[] = [
  { id: "ne1", tipo: "scadenza_formazione", destinatario_email: "admin@rossicostruzioni.it", destinatario_nome: "Andrea Rossi", documento_nome: "Attestato_Sicurezza_Bianchi.pdf", categoria: "Attestato Sicurezza", data_scadenza: "2026-02-15", giorni_rimanenti: -24, stato_invio: "inviata", data_invio: "2026-02-01T08:00:00", letto: true },
  { id: "ne2", tipo: "scadenza_durc", destinatario_email: "admin@rossicostruzioni.it", destinatario_nome: "Andrea Rossi", documento_nome: "DURC_Neri_2026.pdf", categoria: "DURC", data_scadenza: "2026-02-28", giorni_rimanenti: -11, stato_invio: "inviata", data_invio: "2026-02-13T08:00:00", letto: true },
  { id: "ne3", tipo: "scadenza_idoneita", destinatario_email: "admin@rossicostruzioni.it", destinatario_nome: "Andrea Rossi", documento_nome: "Idoneita_Sanitaria_Verdi.pdf", categoria: "Idoneità Sanitaria", data_scadenza: "2026-03-20", giorni_rimanenti: 9, stato_invio: "inviata", data_invio: "2026-03-05T08:00:00", letto: false },
  { id: "ne4", tipo: "scadenza_durc", destinatario_email: "admin@rossicostruzioni.it", destinatario_nome: "Andrea Rossi", documento_nome: "DURC_Verdi_2026.pdf", categoria: "DURC", data_scadenza: "2026-06-15", giorni_rimanenti: 96, stato_invio: "programmata", data_invio: "2026-05-16T08:00:00", letto: false },
  { id: "ne5", tipo: "scadenza_formazione", destinatario_email: "admin@rossicostruzioni.it", destinatario_nome: "Andrea Rossi", documento_nome: "Attestato_Sicurezza_Neri.pdf", categoria: "Attestato Sicurezza", data_scadenza: "2026-06-01", giorni_rimanenti: 82, stato_invio: "programmata", data_invio: "2026-05-02T08:00:00", letto: false },
  { id: "ne6", tipo: "scadenza_idoneita", destinatario_email: "s.colombo@rossicostruzioni.it", destinatario_nome: "Sara Colombo", documento_nome: "Idoneita_Sanitaria_Rossi.pdf", categoria: "Idoneità Sanitaria", data_scadenza: "2026-04-20", giorni_rimanenti: 40, stato_invio: "inviata", data_invio: "2026-03-06T08:00:00", letto: false },
  { id: "ne7", tipo: "scadenza_formazione", destinatario_email: "admin@rossicostruzioni.it", destinatario_nome: "Andrea Rossi", documento_nome: "Attestato_Sicurezza_Bianchi.pdf", categoria: "Attestato Sicurezza", data_scadenza: "2026-02-15", giorni_rimanenti: -10, stato_invio: "errore", data_invio: "2026-02-15T08:00:00", letto: false },
  { id: "ne8", tipo: "scadenza_durc", destinatario_email: "admin@rossicostruzioni.it", destinatario_nome: "Andrea Rossi", documento_nome: "DURC_Neri_2026.pdf", categoria: "DURC", data_scadenza: "2026-02-28", giorni_rimanenti: 0, stato_invio: "inviata", data_invio: "2026-02-28T08:00:00", letto: true },
];

export interface ImpostazioniNotifiche {
  abilitata_durc: boolean;
  abilitata_formazione: boolean;
  abilitata_idoneita: boolean;
  soglia_giorni: number;
  email_destinatari: string[];
}

export const mockImpostazioniNotifiche: ImpostazioniNotifiche = {
  abilitata_durc: true,
  abilitata_formazione: true,
  abilitata_idoneita: true,
  soglia_giorni: 30,
  email_destinatari: ["admin@rossicostruzioni.it", "s.colombo@rossicostruzioni.it"],
};

// ── Galleria Cantiere ──

export type FileCantiereTipo = "foto" | "materiale" | "rapportino" | "altro";

export interface FileCantiere {
  id: string;
  cantiere_id: string;
  nome_file: string;
  tipo: FileCantiereTipo;
  descrizione: string;
  data_caricamento: string;
  caricato_da: string;
  dimensione_kb: number;
  url: string;
  thumbnail_url: string | null;
}

export const mockFileCantiere: FileCantiere[] = [
  { id: "fc1", cantiere_id: "c1", nome_file: "Fondazioni_lotto_A.jpg", tipo: "foto", descrizione: "Stato avanzamento fondazioni lotto A", data_caricamento: "2026-03-10T14:30:00", caricato_da: "Marco Rossi", dimensione_kb: 3200, url: "/placeholder.svg", thumbnail_url: "/placeholder.svg" },
  { id: "fc2", cantiere_id: "c1", nome_file: "Armatura_pilastro_P3.jpg", tipo: "foto", descrizione: "Armatura pilastro P3 prima del getto", data_caricamento: "2026-03-09T11:15:00", caricato_da: "Luca Ferrari", dimensione_kb: 2800, url: "/placeholder.svg", thumbnail_url: "/placeholder.svg" },
  { id: "fc3", cantiere_id: "c1", nome_file: "DDT_Cemento_2026_03.pdf", tipo: "materiale", descrizione: "DDT consegna cemento — 15 m³ calcestruzzo C25/30", data_caricamento: "2026-03-08T09:00:00", caricato_da: "Marco Rossi", dimensione_kb: 450, url: "/placeholder.svg", thumbnail_url: null },
  { id: "fc4", cantiere_id: "c1", nome_file: "DDT_Acciaio_tondini.pdf", tipo: "materiale", descrizione: "DDT fornitura tondini acciaio B450C — 8 ton", data_caricamento: "2026-03-05T16:00:00", caricato_da: "Sara Colombo", dimensione_kb: 380, url: "/placeholder.svg", thumbnail_url: null },
  { id: "fc5", cantiere_id: "c1", nome_file: "Rapportino_2026_03_10.pdf", tipo: "rapportino", descrizione: "Rapportino giornaliero — getto fondazioni lotto A", data_caricamento: "2026-03-10T18:00:00", caricato_da: "Marco Rossi", dimensione_kb: 220, url: "/placeholder.svg", thumbnail_url: null },
  { id: "fc6", cantiere_id: "c1", nome_file: "Rapportino_2026_03_09.pdf", tipo: "rapportino", descrizione: "Rapportino giornaliero — casseratura pilastri", data_caricamento: "2026-03-09T17:45:00", caricato_da: "Marco Rossi", dimensione_kb: 195, url: "/placeholder.svg", thumbnail_url: null },
  { id: "fc7", cantiere_id: "c1", nome_file: "Panoramica_cantiere.jpg", tipo: "foto", descrizione: "Vista panoramica del cantiere da nord-est", data_caricamento: "2026-03-07T10:00:00", caricato_da: "Luca Ferrari", dimensione_kb: 4100, url: "/placeholder.svg", thumbnail_url: "/placeholder.svg" },
  { id: "fc8", cantiere_id: "c1", nome_file: "Planimetria_piano_terra.pdf", tipo: "altro", descrizione: "Planimetria aggiornata piano terra con modifiche strutturali", data_caricamento: "2026-03-04T15:30:00", caricato_da: "Sara Colombo", dimensione_kb: 1800, url: "/placeholder.svg", thumbnail_url: null },
  { id: "fc9", cantiere_id: "c2", nome_file: "Demolizione_parete.jpg", tipo: "foto", descrizione: "Demolizione parete interna piano 2", data_caricamento: "2026-03-10T09:30:00", caricato_da: "Paolo Neri", dimensione_kb: 2500, url: "/placeholder.svg", thumbnail_url: "/placeholder.svg" },
  { id: "fc10", cantiere_id: "c2", nome_file: "DDT_Mattoni_forati.pdf", tipo: "materiale", descrizione: "DDT consegna mattoni forati — 2 pallet", data_caricamento: "2026-03-06T08:45:00", caricato_da: "Paolo Neri", dimensione_kb: 310, url: "/placeholder.svg", thumbnail_url: null },
];

// ── Diario di Cantiere ──

export type MeteoCondizione = "sereno" | "nuvoloso" | "pioggia" | "neve" | "vento";

export interface DiarioCantiere {
  id: string;
  cantiere_id: string;
  data: string;
  meteo: MeteoCondizione;
  temperatura: number;
  attivita: string;
  problemi?: string;
  note?: string;
  foto_ids: string[];
  compilato_da: string;
  ore_lavorate: number;
  operai_presenti: number;
}

export const mockDiarioCantiere: DiarioCantiere[] = [
  { id: "dc1", cantiere_id: "c1", data: "2026-03-10", meteo: "sereno", temperatura: 14, attivita: "Getto fondazioni lotto A completato. Posizionamento armatura pilastri P1-P4.", problemi: "Ritardo consegna calcestruzzo di 2 ore — fornitore avvisato.", note: "Programmato getto pilastri per il 12/03.", foto_ids: ["fc1", "fc2"], compilato_da: "Marco Rossi", ore_lavorate: 8, operai_presenti: 14 },
  { id: "dc2", cantiere_id: "c1", data: "2026-03-09", meteo: "nuvoloso", temperatura: 11, attivita: "Casseratura pilastri piano terra. Posa armatura travi T1-T6.", problemi: undefined, note: undefined, foto_ids: ["fc2"], compilato_da: "Marco Rossi", ore_lavorate: 8, operai_presenti: 16 },
  { id: "dc3", cantiere_id: "c1", data: "2026-03-08", meteo: "pioggia", temperatura: 8, attivita: "Lavori sospesi per maltempo dalle 11:00. Attività di magazzino e preparazione materiali al coperto.", problemi: "Sospensione lavori esterni per pioggia intensa.", note: "Verificare previsioni per i prossimi giorni.", foto_ids: [], compilato_da: "Marco Rossi", ore_lavorate: 4, operai_presenti: 10 },
  { id: "dc4", cantiere_id: "c1", data: "2026-03-07", meteo: "sereno", temperatura: 12, attivita: "Scavo fondazioni lotto A completato. Verifica quote con geometra. Foto panoramica cantiere.", problemi: undefined, note: undefined, foto_ids: ["fc7"], compilato_da: "Luca Ferrari", ore_lavorate: 8, operai_presenti: 15 },
  { id: "dc5", cantiere_id: "c1", data: "2026-03-06", meteo: "vento", temperatura: 9, attivita: "Gru ferma per vento forte (>60 km/h). Lavori a terra: preparazione casseri e taglio ferri.", problemi: "Gru fuori servizio per condizioni meteo avverse.", note: "Limite operativo gru superato — ripresa domani.", foto_ids: [], compilato_da: "Marco Rossi", ore_lavorate: 6, operai_presenti: 12 },
  { id: "dc6", cantiere_id: "c1", data: "2026-03-05", meteo: "nuvoloso", temperatura: 10, attivita: "Consegna acciaio B450C (8 ton). Inizio preparazione armatura fondazioni.", problemi: undefined, note: undefined, foto_ids: [], compilato_da: "Marco Rossi", ore_lavorate: 8, operai_presenti: 14 },
  { id: "dc7", cantiere_id: "c2", data: "2026-03-10", meteo: "nuvoloso", temperatura: 10, attivita: "Demolizione pareti interne piano 2. Rimozione detriti e pulizia.", problemi: "Trovata tubazione amianto non mappata — sospeso lavoro zona nord.", note: "Contattata ditta specializzata per bonifica amianto.", foto_ids: ["fc9"], compilato_da: "Paolo Neri", ore_lavorate: 7, operai_presenti: 8 },
  { id: "dc8", cantiere_id: "c2", data: "2026-03-09", meteo: "sereno", temperatura: 12, attivita: "Demolizione pareti interne piano 1 completata. Verifica strutturale con ingegnere.", problemi: undefined, note: undefined, foto_ids: [], compilato_da: "Paolo Neri", ore_lavorate: 8, operai_presenti: 9 },
  { id: "dc9", cantiere_id: "c2", data: "2026-03-06", meteo: "pioggia", temperatura: 7, attivita: "Consegna materiali (mattoni forati). Lavori interni: rimozione pavimenti piano 1.", problemi: undefined, note: undefined, foto_ids: [], compilato_da: "Paolo Neri", ore_lavorate: 6, operai_presenti: 7 },
];
