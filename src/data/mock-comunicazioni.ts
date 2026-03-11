export type TipoThread = "generale" | "urgente" | "documento";

export interface ComunicazioneThread {
  id: string;
  cantiere_id: string;
  cantiere_nome: string;
  oggetto: string;
  partecipanti: { id: string; nome: string; ruolo: string }[];
  ultimo_messaggio: string;
  data_ultimo: string;
  non_letti: number;
  tipo: TipoThread;
}

export interface Messaggio {
  id: string;
  thread_id: string;
  mittente_id: string;
  mittente_nome: string;
  testo: string;
  timestamp: string;
  letto: boolean;
  allegato?: { nome_file: string; tipo: string };
}

export const mockThreads: ComunicazioneThread[] = [
  {
    id: "th1",
    cantiere_id: "c1",
    cantiere_nome: "Residenziale Via Roma 12",
    oggetto: "Ritardo consegna materiali",
    partecipanti: [
      { id: "u1", nome: "Admin Rossi", ruolo: "Responsabile" },
      { id: "l1", nome: "Marco Rossi", ruolo: "Capocantiere" },
      { id: "s1-ref", nome: "Bianchi Impianti", ruolo: "Subappaltatore" },
    ],
    ultimo_messaggio: "Confermo che i materiali arriveranno giovedì mattina.",
    data_ultimo: "2026-03-11T09:15:00",
    non_letti: 2,
    tipo: "urgente",
  },
  {
    id: "th2",
    cantiere_id: "c1",
    cantiere_nome: "Residenziale Via Roma 12",
    oggetto: "Aggiornamento POS cantiere",
    partecipanti: [
      { id: "u1", nome: "Admin Rossi", ruolo: "Responsabile" },
      { id: "l1", nome: "Marco Rossi", ruolo: "Capocantiere" },
    ],
    ultimo_messaggio: "Ho caricato la versione aggiornata del POS.",
    data_ultimo: "2026-03-10T16:30:00",
    non_letti: 1,
    tipo: "documento",
  },
  {
    id: "th3",
    cantiere_id: "c2",
    cantiere_nome: "Ristrutturazione Palazzina",
    oggetto: "Coordinamento squadre settimana 12",
    partecipanti: [
      { id: "u1", nome: "Admin Rossi", ruolo: "Responsabile" },
      { id: "l5", nome: "Luca Ferrari", ruolo: "Muratore" },
      { id: "l4", nome: "Paolo Neri", ruolo: "Saldatore" },
    ],
    ultimo_messaggio: "Lunedì mattina inizio piano 3, confermate presenza.",
    data_ultimo: "2026-03-10T14:00:00",
    non_letti: 0,
    tipo: "generale",
  },
  {
    id: "th4",
    cantiere_id: "c1",
    cantiere_nome: "Residenziale Via Roma 12",
    oggetto: "Segnalazione rischio area B",
    partecipanti: [
      { id: "l1", nome: "Marco Rossi", ruolo: "Capocantiere" },
      { id: "u1", nome: "Admin Rossi", ruolo: "Responsabile" },
    ],
    ultimo_messaggio: "Area transennata. Intervento previsto per domani.",
    data_ultimo: "2026-03-09T11:45:00",
    non_letti: 0,
    tipo: "urgente",
  },
  {
    id: "th5",
    cantiere_id: "c2",
    cantiere_nome: "Ristrutturazione Palazzina",
    oggetto: "Documenti idoneità lavoratori",
    partecipanti: [
      { id: "u1", nome: "Admin Rossi", ruolo: "Responsabile" },
      { id: "s3-ref", nome: "Carpenteria Neri", ruolo: "Subappaltatore" },
    ],
    ultimo_messaggio: "Mancano ancora 3 certificati medici. Sollecitare.",
    data_ultimo: "2026-03-08T17:20:00",
    non_letti: 3,
    tipo: "documento",
  },
  {
    id: "th6",
    cantiere_id: "c1",
    cantiere_nome: "Residenziale Via Roma 12",
    oggetto: "Riunione sicurezza mensile",
    partecipanti: [
      { id: "u1", nome: "Admin Rossi", ruolo: "Responsabile" },
      { id: "l1", nome: "Marco Rossi", ruolo: "Capocantiere" },
      { id: "l2", nome: "Giuseppe Bianchi", ruolo: "Elettricista" },
      { id: "l3", nome: "Antonio Verdi", ruolo: "Idraulico" },
    ],
    ultimo_messaggio: "Verbale allegato. Prossima riunione 25 marzo.",
    data_ultimo: "2026-03-07T10:00:00",
    non_letti: 0,
    tipo: "generale",
  },
  {
    id: "th7",
    cantiere_id: "c2",
    cantiere_nome: "Ristrutturazione Palazzina",
    oggetto: "Richiesta ferie Pasqua",
    partecipanti: [
      { id: "l5", nome: "Luca Ferrari", ruolo: "Muratore" },
      { id: "u1", nome: "Admin Rossi", ruolo: "Responsabile" },
    ],
    ultimo_messaggio: "Approvate le ferie dal 2 al 7 aprile.",
    data_ultimo: "2026-03-06T09:30:00",
    non_letti: 0,
    tipo: "generale",
  },
  {
    id: "th8",
    cantiere_id: "c1",
    cantiere_nome: "Residenziale Via Roma 12",
    oggetto: "Preventivo nuova fornitura calcestruzzo",
    partecipanti: [
      { id: "u1", nome: "Admin Rossi", ruolo: "Responsabile" },
      { id: "s2-ref", nome: "Idraulica Verdi", ruolo: "Subappaltatore" },
    ],
    ultimo_messaggio: "Allego preventivo aggiornato con sconto 5%.",
    data_ultimo: "2026-03-05T15:10:00",
    non_letti: 1,
    tipo: "documento",
  },
];

export const mockMessaggi: Messaggio[] = [
  // th1 — Ritardo consegna materiali
  { id: "m1", thread_id: "th1", mittente_id: "l1", mittente_nome: "Marco Rossi", testo: "Il fornitore ha comunicato un ritardo di 3 giorni sulla consegna del ferro per armature. Rischio blocco gettata.", timestamp: "2026-03-10T08:30:00", letto: true },
  { id: "m2", thread_id: "th1", mittente_id: "u1", mittente_nome: "Admin Rossi", testo: "Ho contattato il fornitore. Stanno verificando disponibilità in altro magazzino.", timestamp: "2026-03-10T10:15:00", letto: true },
  { id: "m3", thread_id: "th1", mittente_id: "s1-ref", mittente_nome: "Bianchi Impianti", testo: "Noi possiamo anticipare il lavoro sugli impianti al piano 2 nel frattempo.", timestamp: "2026-03-10T14:00:00", letto: true },
  { id: "m4", thread_id: "th1", mittente_id: "u1", mittente_nome: "Admin Rossi", testo: "Ottima idea. Marco, puoi coordinare con Bianchi per il piano 2?", timestamp: "2026-03-10T15:30:00", letto: false },
  { id: "m5", thread_id: "th1", mittente_id: "l1", mittente_nome: "Marco Rossi", testo: "Confermo che i materiali arriveranno giovedì mattina.", timestamp: "2026-03-11T09:15:00", letto: false },

  // th2 — Aggiornamento POS
  { id: "m6", thread_id: "th2", mittente_id: "u1", mittente_nome: "Admin Rossi", testo: "Marco, il POS va aggiornato con le nuove misure per il piano 4.", timestamp: "2026-03-10T09:00:00", letto: true },
  { id: "m7", thread_id: "th2", mittente_id: "l1", mittente_nome: "Marco Rossi", testo: "Ho caricato la versione aggiornata del POS.", timestamp: "2026-03-10T16:30:00", letto: false, allegato: { nome_file: "POS_v3_marzo2026.pdf", tipo: "pdf" } },

  // th3 — Coordinamento squadre
  { id: "m8", thread_id: "th3", mittente_id: "u1", mittente_nome: "Admin Rossi", testo: "Ragazzi, settimana prossima dobbiamo iniziare il piano 3. Serve coordinamento.", timestamp: "2026-03-10T08:00:00", letto: true },
  { id: "m9", thread_id: "th3", mittente_id: "l5", mittente_nome: "Luca Ferrari", testo: "Io sono disponibile da lunedì. Servono ponteggi aggiuntivi?", timestamp: "2026-03-10T10:30:00", letto: true },
  { id: "m10", thread_id: "th3", mittente_id: "l4", mittente_nome: "Paolo Neri", testo: "Confermo presenza. Le saldature al piano 2 le finisco venerdì.", timestamp: "2026-03-10T12:00:00", letto: true },
  { id: "m11", thread_id: "th3", mittente_id: "u1", mittente_nome: "Admin Rossi", testo: "Lunedì mattina inizio piano 3, confermate presenza.", timestamp: "2026-03-10T14:00:00", letto: true },

  // th4 — Segnalazione rischio
  { id: "m12", thread_id: "th4", mittente_id: "l1", mittente_nome: "Marco Rossi", testo: "Segnalo cedimento parziale del muro di contenimento nell'area B. Ho fatto allontanare tutti.", timestamp: "2026-03-09T08:30:00", letto: true },
  { id: "m13", thread_id: "th4", mittente_id: "u1", mittente_nome: "Admin Rossi", testo: "Bene, grazie Marco. Ho chiamato l'ingegnere strutturista. Arriva alle 14.", timestamp: "2026-03-09T09:00:00", letto: true },
  { id: "m14", thread_id: "th4", mittente_id: "l1", mittente_nome: "Marco Rossi", testo: "Area transennata. Intervento previsto per domani.", timestamp: "2026-03-09T11:45:00", letto: true },

  // th5 — Documenti idoneità
  { id: "m15", thread_id: "th5", mittente_id: "u1", mittente_nome: "Admin Rossi", testo: "Carpenteria Neri, ci risultano 5 certificati medici mancanti per i vostri operai.", timestamp: "2026-03-07T09:00:00", letto: true },
  { id: "m16", thread_id: "th5", mittente_id: "s3-ref", mittente_nome: "Carpenteria Neri", testo: "Ne abbiamo caricati 2 ieri. Gli altri 3 li stiamo recuperando.", timestamp: "2026-03-07T14:00:00", letto: true, allegato: { nome_file: "cert_medici_neri_x2.zip", tipo: "zip" } },
  { id: "m17", thread_id: "th5", mittente_id: "u1", mittente_nome: "Admin Rossi", testo: "Mancano ancora 3 certificati medici. Sollecitare.", timestamp: "2026-03-08T17:20:00", letto: false },

  // th6 — Riunione sicurezza
  { id: "m18", thread_id: "th6", mittente_id: "u1", mittente_nome: "Admin Rossi", testo: "Riunione sicurezza domani alle 10 in ufficio cantiere. Presenza obbligatoria.", timestamp: "2026-03-06T16:00:00", letto: true },
  { id: "m19", thread_id: "th6", mittente_id: "l1", mittente_nome: "Marco Rossi", testo: "Confermo. Preparo l'aggiornamento sulle non-conformità risolte.", timestamp: "2026-03-06T17:00:00", letto: true },
  { id: "m20", thread_id: "th6", mittente_id: "u1", mittente_nome: "Admin Rossi", testo: "Verbale allegato. Prossima riunione 25 marzo.", timestamp: "2026-03-07T10:00:00", letto: true, allegato: { nome_file: "verbale_sicurezza_marzo.pdf", tipo: "pdf" } },

  // th7 — Richiesta ferie
  { id: "m21", thread_id: "th7", mittente_id: "l5", mittente_nome: "Luca Ferrari", testo: "Buongiorno, chiedo ferie dal 2 al 7 aprile per Pasqua.", timestamp: "2026-03-05T08:00:00", letto: true },
  { id: "m22", thread_id: "th7", mittente_id: "u1", mittente_nome: "Admin Rossi", testo: "Approvate le ferie dal 2 al 7 aprile.", timestamp: "2026-03-06T09:30:00", letto: true },

  // th8 — Preventivo
  { id: "m23", thread_id: "th8", mittente_id: "u1", mittente_nome: "Admin Rossi", testo: "Verdi, ci serve un preventivo aggiornato per la fornitura calcestruzzo Q2.", timestamp: "2026-03-04T10:00:00", letto: true },
  { id: "m24", thread_id: "th8", mittente_id: "s2-ref", mittente_nome: "Idraulica Verdi", testo: "Allego preventivo aggiornato con sconto 5%.", timestamp: "2026-03-05T15:10:00", letto: false, allegato: { nome_file: "preventivo_calcestruzzo_Q2.pdf", tipo: "pdf" } },
];

export const CURRENT_USER_ID = "u1";
export const CURRENT_USER_NAME = "Admin Rossi";
