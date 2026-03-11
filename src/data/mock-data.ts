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

export const mockLavoratori = [
  { id: "l1", tenant_id: "t1", nome: "Marco", cognome: "Rossi", codice_fiscale: "RSSMRC85M01F205Z", tipo: "interno" as const, subappaltatore_id: null, mansione: "Capocantiere" },
  { id: "l2", tenant_id: "t1", nome: "Giuseppe", cognome: "Bianchi", codice_fiscale: "BNCGPP90A15L219X", tipo: "esterno" as const, subappaltatore_id: "s1", mansione: "Elettricista" },
  { id: "l3", tenant_id: "t1", nome: "Antonio", cognome: "Verdi", codice_fiscale: "VRDNTN88D22F205Y", tipo: "esterno" as const, subappaltatore_id: "s2", mansione: "Idraulico" },
  { id: "l4", tenant_id: "t1", nome: "Paolo", cognome: "Neri", codice_fiscale: "NREPLP92H05A794W", tipo: "esterno" as const, subappaltatore_id: "s3", mansione: "Saldatore" },
  { id: "l5", tenant_id: "t1", nome: "Luca", cognome: "Ferrari", codice_fiscale: "FRRLCU87S30F205V", tipo: "interno" as const, subappaltatore_id: null, mansione: "Muratore" },
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

export const mockDocumenti = [
  { id: "d1", tenant_id: "t1", cantiere_id: "c1", riferimento_tipo: "subappaltatore" as const, riferimento_id: "s1", nome_file: "DURC_Bianchi_2026.pdf", data_caricamento: "2026-01-10", data_scadenza: "2026-07-10", stato: "valido" as DocumentoStato, categoria: "DURC" },
  { id: "d2", tenant_id: "t1", cantiere_id: "c1", riferimento_tipo: "subappaltatore" as const, riferimento_id: "s2", nome_file: "Visura_Camerale_Verdi.pdf", data_caricamento: "2025-12-01", data_scadenza: "2026-03-25", stato: "in_scadenza" as DocumentoStato, categoria: "Visura Camerale" },
  { id: "d3", tenant_id: "t1", cantiere_id: "c1", riferimento_tipo: "lavoratore" as const, riferimento_id: "l2", nome_file: "Attestato_Sicurezza_Bianchi.pdf", data_caricamento: "2025-06-15", data_scadenza: "2026-02-15", stato: "scaduto" as DocumentoStato, categoria: "Attestato Sicurezza" },
  { id: "d4", tenant_id: "t1", cantiere_id: "c2", riferimento_tipo: "subappaltatore" as const, riferimento_id: "s3", nome_file: "POS_Neri.pdf", data_caricamento: "2026-02-01", data_scadenza: null, stato: "da_verificare" as DocumentoStato, categoria: "POS" },
  { id: "d5", tenant_id: "t1", cantiere_id: "c1", riferimento_tipo: "mezzo" as const, riferimento_id: "m1", nome_file: "Libretto_Escavatore.pdf", data_caricamento: "2026-01-05", data_scadenza: "2027-01-05", stato: "valido" as DocumentoStato, categoria: "Libretto" },
  { id: "d6", tenant_id: "t1", cantiere_id: "c1", riferimento_tipo: "lavoratore" as const, riferimento_id: "l1", nome_file: "Idoneita_Sanitaria_Rossi.pdf", data_caricamento: "2025-11-20", data_scadenza: "2026-04-20", stato: "in_scadenza" as DocumentoStato, categoria: "Idoneità Sanitaria" },
  { id: "d7", tenant_id: "t1", cantiere_id: "c2", riferimento_tipo: "subappaltatore" as const, riferimento_id: "s3", nome_file: "Polizza_RC_Neri.pdf", data_caricamento: "2026-01-20", data_scadenza: "2026-03-12", stato: "in_scadenza" as DocumentoStato, categoria: "Polizza RC" },
  { id: "d8", tenant_id: "t1", cantiere_id: "c1", riferimento_tipo: "mezzo" as const, riferimento_id: "m2", nome_file: "Certificato_Collaudo_Gru.pdf", data_caricamento: "2025-06-01", data_scadenza: "2026-06-01", stato: "in_scadenza" as DocumentoStato, categoria: "Collaudo" },
  { id: "d9", tenant_id: "t1", cantiere_id: "c1", riferimento_tipo: "mezzo" as const, riferimento_id: "m3", nome_file: "Assicurazione_Autocarro.pdf", data_caricamento: "2025-05-15", data_scadenza: "2026-05-15", stato: "in_scadenza" as DocumentoStato, categoria: "Assicurazione" },
  { id: "d10", tenant_id: "t1", cantiere_id: "c2", riferimento_tipo: "mezzo" as const, riferimento_id: "m4", nome_file: "Libretto_Piattaforma.pdf", data_caricamento: "2025-02-28", data_scadenza: "2027-02-28", stato: "valido" as DocumentoStato, categoria: "Libretto" },
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
