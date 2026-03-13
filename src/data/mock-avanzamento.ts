export type StepStato = "da_completare" | "completato";
export type FaseStato = "da_iniziare" | "in_corso" | "completato";

export interface WorkStep {
  id: string;
  nome: string;
  stato: StepStato;
  data_completamento: string | null;
  note: string;
}

export interface WorkPhase {
  id: string;
  cantiere_id: string;
  nome: string;
  stato: FaseStato;
  ordine: number;
  steps: WorkStep[];
}

export interface WorkTemplateStep {
  nome: string;
}

export interface WorkTemplate {
  id: string;
  nome: string;
  descrizione: string;
  fasi: { nome: string; steps: WorkTemplateStep[] }[];
}

// --- Templates ---

export const mockWorkTemplates: WorkTemplate[] = [
  {
    id: "tpl-1",
    nome: "Edilizia Residenziale",
    descrizione: "Template standard per nuove costruzioni residenziali",
    fasi: [
      { nome: "Scavi e Fondazioni", steps: [{ nome: "Scavo terreno" }, { nome: "Getto fondazioni" }, { nome: "Impermeabilizzazione" }] },
      { nome: "Struttura", steps: [{ nome: "Pilastri piano terra" }, { nome: "Solaio primo piano" }, { nome: "Pilastri primo piano" }, { nome: "Copertura" }] },
      { nome: "Impianti", steps: [{ nome: "Impianto elettrico" }, { nome: "Impianto idraulico" }, { nome: "Impianto termico" }] },
      { nome: "Finiture", steps: [{ nome: "Intonaci" }, { nome: "Pavimentazioni" }, { nome: "Tinteggiatura" }, { nome: "Serramenti" }] },
    ],
  },
  {
    id: "tpl-2",
    nome: "Ristrutturazione",
    descrizione: "Template per interventi di ristrutturazione",
    fasi: [
      { nome: "Demolizioni", steps: [{ nome: "Rimozione tramezzi" }, { nome: "Rimozione pavimenti" }, { nome: "Smaltimento macerie" }] },
      { nome: "Consolidamento", steps: [{ nome: "Rinforzo strutturale" }, { nome: "Trattamento umidità" }] },
      { nome: "Impianti", steps: [{ nome: "Rifacimento impianto elettrico" }, { nome: "Rifacimento impianto idraulico" }] },
      { nome: "Finiture", steps: [{ nome: "Intonaci e rasature" }, { nome: "Pavimenti e rivestimenti" }, { nome: "Tinteggiatura" }] },
    ],
  },
  {
    id: "tpl-3",
    nome: "Opere Stradali",
    descrizione: "Template per lavori stradali e infrastrutture",
    fasi: [
      { nome: "Preparazione", steps: [{ nome: "Tracciamento" }, { nome: "Scavo sede stradale" }, { nome: "Sottofondo" }] },
      { nome: "Posa Sottoservizi", steps: [{ nome: "Tubazioni fognarie" }, { nome: "Cavidotti" }, { nome: "Pozzetti" }] },
      { nome: "Pavimentazione", steps: [{ nome: "Strato base" }, { nome: "Strato binder" }, { nome: "Tappeto d'usura" }] },
      { nome: "Completamento", steps: [{ nome: "Segnaletica orizzontale" }, { nome: "Segnaletica verticale" }, { nome: "Guard-rail" }] },
    ],
  },
];

// --- Dati mock per cantieri esistenti ---

let stepCounter = 0;
const mkStep = (nome: string, completato: boolean): WorkStep => ({
  id: `ws-${++stepCounter}`,
  nome,
  stato: completato ? "completato" : "da_completare",
  data_completamento: completato ? "2025-01-15" : null,
  note: "",
});

export const mockWorkPhases: WorkPhase[] = [
  {
    id: "wp-1", cantiere_id: "c1", nome: "Scavi e Fondazioni", stato: "completato", ordine: 1,
    steps: [mkStep("Scavo terreno", true), mkStep("Getto fondazioni", true), mkStep("Impermeabilizzazione", true)],
  },
  {
    id: "wp-2", cantiere_id: "c1", nome: "Struttura", stato: "in_corso", ordine: 2,
    steps: [mkStep("Pilastri piano terra", true), mkStep("Solaio primo piano", true), mkStep("Pilastri primo piano", false), mkStep("Copertura", false)],
  },
  {
    id: "wp-3", cantiere_id: "c1", nome: "Impianti", stato: "da_iniziare", ordine: 3,
    steps: [mkStep("Impianto elettrico", false), mkStep("Impianto idraulico", false), mkStep("Impianto termico", false)],
  },
  {
    id: "wp-4", cantiere_id: "c1", nome: "Finiture", stato: "da_iniziare", ordine: 4,
    steps: [mkStep("Intonaci", false), mkStep("Pavimentazioni", false), mkStep("Tinteggiatura", false), mkStep("Serramenti", false)],
  },
  {
    id: "wp-5", cantiere_id: "c2", nome: "Demolizioni", stato: "completato", ordine: 1,
    steps: [mkStep("Rimozione tramezzi", true), mkStep("Smaltimento macerie", true)],
  },
  {
    id: "wp-6", cantiere_id: "c2", nome: "Consolidamento", stato: "in_corso", ordine: 2,
    steps: [mkStep("Rinforzo strutturale", true), mkStep("Trattamento umidità", false)],
  },
];
