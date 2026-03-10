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
  },
];

export const mockLavoratori = [
  { id: "l1", tenant_id: "t1", nome: "Marco", cognome: "Rossi", codice_fiscale: "RSSMRC85M01F205Z", tipo: "interno" as const, subappaltatore_id: null, mansione: "Capocantiere" },
  { id: "l2", tenant_id: "t1", nome: "Giuseppe", cognome: "Bianchi", codice_fiscale: "BNCGPP90A15L219X", tipo: "esterno" as const, subappaltatore_id: "s1", mansione: "Elettricista" },
  { id: "l3", tenant_id: "t1", nome: "Antonio", cognome: "Verdi", codice_fiscale: "VRDNTN88D22F205Y", tipo: "esterno" as const, subappaltatore_id: "s2", mansione: "Idraulico" },
  { id: "l4", tenant_id: "t1", nome: "Paolo", cognome: "Neri", codice_fiscale: "NREPLP92H05A794W", tipo: "esterno" as const, subappaltatore_id: "s3", mansione: "Saldatore" },
  { id: "l5", tenant_id: "t1", nome: "Luca", cognome: "Ferrari", codice_fiscale: "FRRLCU87S30F205V", tipo: "interno" as const, subappaltatore_id: null, mansione: "Muratore" },
];

export const mockMezzi = [
  { id: "m1", tenant_id: "t1", cantiere_id: "c1", tipo: "Escavatore", targa_o_matricola: "RM-2024-001", descrizione: "CAT 320 — escavatore cingolato" },
  { id: "m2", tenant_id: "t1", cantiere_id: "c1", tipo: "Gru a torre", targa_o_matricola: "MI-GRU-045", descrizione: "Liebherr 280 EC-H — gru a torre fissa" },
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
