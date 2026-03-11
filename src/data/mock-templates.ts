import { TipoDocumento } from "./mock-firma";

export interface TemplateVariabile {
  chiave: string;
  label: string;
  esempio: string;
  auto: boolean; // auto-filled from cantiere data
}

export interface TemplateFirma {
  id: string;
  nome: string;
  descrizione: string;
  tipo_documento: TipoDocumento;
  contenuto: string; // HTML-like template with {{variabili}}
  variabili: TemplateVariabile[];
  predefinito: boolean; // system template vs custom
  data_creazione: string;
}

export const templateVariabiliGlobali: TemplateVariabile[] = [
  { chiave: "nome_cantiere", label: "Nome cantiere", esempio: "Residenza Parco Verde", auto: true },
  { chiave: "indirizzo_cantiere", label: "Indirizzo cantiere", esempio: "Via Roma 12, Milano", auto: true },
  { chiave: "data_odierna", label: "Data odierna", esempio: "11/03/2026", auto: true },
  { chiave: "nome_azienda", label: "Nome azienda", esempio: "Rossi Costruzioni S.r.l.", auto: true },
  { chiave: "responsabile_cantiere", label: "Responsabile cantiere", esempio: "Ing. Mario Bianchi", auto: true },
  { chiave: "subappaltatore", label: "Subappaltatore", esempio: "Elettrica S.r.l.", auto: false },
  { chiave: "numero_protocollo", label: "Numero protocollo", esempio: "PROT-2026-0042", auto: false },
  { chiave: "note_aggiuntive", label: "Note aggiuntive", esempio: "", auto: false },
];

export const mockTemplateFirma: TemplateFirma[] = [
  {
    id: "tpl1",
    nome: "Verbale di Consegna Cantiere",
    descrizione: "Verbale per la consegna formale del cantiere al committente o subappaltatore",
    tipo_documento: "verbale",
    predefinito: true,
    data_creazione: "2026-01-01",
    variabili: [
      { chiave: "nome_cantiere", label: "Nome cantiere", esempio: "Residenza Parco Verde", auto: true },
      { chiave: "indirizzo_cantiere", label: "Indirizzo cantiere", esempio: "Via Roma 12, Milano", auto: true },
      { chiave: "data_odierna", label: "Data odierna", esempio: "11/03/2026", auto: true },
      { chiave: "nome_azienda", label: "Nome azienda", esempio: "Rossi Costruzioni S.r.l.", auto: true },
      { chiave: "responsabile_cantiere", label: "Responsabile cantiere", esempio: "Ing. Mario Bianchi", auto: true },
      { chiave: "subappaltatore", label: "Subappaltatore", esempio: "Elettrica S.r.l.", auto: false },
    ],
    contenuto: `VERBALE DI CONSEGNA CANTIERE

Il giorno {{data_odierna}}, presso il cantiere "{{nome_cantiere}}" sito in {{indirizzo_cantiere}},

TRA
{{nome_azienda}}, nella persona di {{responsabile_cantiere}}, in qualità di Appaltatore

E
{{subappaltatore}}, in qualità di Subappaltatore

Si procede alla consegna formale delle aree e degli spazi di lavoro come da planimetria allegata.

Il Subappaltatore dichiara di aver preso visione dei luoghi e delle condizioni operative del cantiere, e di aver ricevuto tutte le informazioni necessarie relative ai rischi specifici dell'area di lavoro.

Letto, confermato e sottoscritto.`,
  },
  {
    id: "tpl2",
    nome: "Modulo Collaudo Opere",
    descrizione: "Verbale di collaudo per opere strutturali, impiantistiche o edili",
    tipo_documento: "collaudo",
    predefinito: true,
    data_creazione: "2026-01-01",
    variabili: [
      { chiave: "nome_cantiere", label: "Nome cantiere", esempio: "Residenza Parco Verde", auto: true },
      { chiave: "indirizzo_cantiere", label: "Indirizzo cantiere", esempio: "Via Roma 12, Milano", auto: true },
      { chiave: "data_odierna", label: "Data odierna", esempio: "11/03/2026", auto: true },
      { chiave: "nome_azienda", label: "Nome azienda", esempio: "Rossi Costruzioni S.r.l.", auto: true },
      { chiave: "responsabile_cantiere", label: "Responsabile cantiere", esempio: "Ing. Mario Bianchi", auto: true },
      { chiave: "tipo_opera", label: "Tipo opera", esempio: "Strutture in c.a. del lotto A", auto: false },
      { chiave: "esito_collaudo", label: "Esito collaudo", esempio: "Positivo", auto: false },
    ],
    contenuto: `VERBALE DI COLLAUDO OPERE

Cantiere: {{nome_cantiere}}
Indirizzo: {{indirizzo_cantiere}}
Data: {{data_odierna}}

Committente/Appaltatore: {{nome_azienda}}
Direttore Lavori: {{responsabile_cantiere}}

OGGETTO DEL COLLAUDO
Tipo opera: {{tipo_opera}}

ESITO
Il sottoscritto, in qualità di collaudatore, dichiara che le opere sopra descritte risultano eseguite a regola d'arte e conformi al progetto esecutivo approvato.

Esito del collaudo: {{esito_collaudo}}

Il presente verbale viene redatto in duplice copia.`,
  },
  {
    id: "tpl3",
    nome: "Autorizzazione Accesso Cantiere",
    descrizione: "Autorizzazione formale per l'accesso di personale esterno al cantiere",
    tipo_documento: "autorizzazione",
    predefinito: true,
    data_creazione: "2026-01-01",
    variabili: [
      { chiave: "nome_cantiere", label: "Nome cantiere", esempio: "Residenza Parco Verde", auto: true },
      { chiave: "indirizzo_cantiere", label: "Indirizzo cantiere", esempio: "Via Roma 12, Milano", auto: true },
      { chiave: "data_odierna", label: "Data odierna", esempio: "11/03/2026", auto: true },
      { chiave: "nome_azienda", label: "Nome azienda", esempio: "Rossi Costruzioni S.r.l.", auto: true },
      { chiave: "subappaltatore", label: "Ditta autorizzata", esempio: "Elettrica S.r.l.", auto: false },
      { chiave: "numero_protocollo", label: "Numero protocollo", esempio: "PROT-2026-0042", auto: false },
    ],
    contenuto: `AUTORIZZAZIONE ACCESSO CANTIERE

Prot. N. {{numero_protocollo}}
Data: {{data_odierna}}

Il sottoscritto, in qualità di responsabile del cantiere "{{nome_cantiere}}" sito in {{indirizzo_cantiere}}, per conto di {{nome_azienda}},

AUTORIZZA

la ditta {{subappaltatore}} ad accedere alle aree di cantiere per l'esecuzione delle lavorazioni previste dal contratto di subappalto in essere.

L'autorizzazione è subordinata al rispetto delle norme di sicurezza vigenti e alla presentazione della documentazione richiesta (DURC, POS, idoneità sanitaria).`,
  },
  {
    id: "tpl4",
    nome: "Verbale Riunione Sicurezza",
    descrizione: "Verbale della riunione periodica di sicurezza ai sensi del D.Lgs. 81/2008",
    tipo_documento: "modulo_sicurezza",
    predefinito: true,
    data_creazione: "2026-01-01",
    variabili: [
      { chiave: "nome_cantiere", label: "Nome cantiere", esempio: "Residenza Parco Verde", auto: true },
      { chiave: "data_odierna", label: "Data odierna", esempio: "11/03/2026", auto: true },
      { chiave: "nome_azienda", label: "Nome azienda", esempio: "Rossi Costruzioni S.r.l.", auto: true },
      { chiave: "responsabile_cantiere", label: "Responsabile cantiere", esempio: "Ing. Mario Bianchi", auto: true },
      { chiave: "note_aggiuntive", label: "Ordine del giorno", esempio: "Revisione POS, aggiornamento DVR", auto: false },
    ],
    contenuto: `VERBALE RIUNIONE PERIODICA DI SICUREZZA
ai sensi dell'art. 35 D.Lgs. 81/2008

Cantiere: {{nome_cantiere}}
Data: {{data_odierna}}
Convocata da: {{nome_azienda}}
Presieduta da: {{responsabile_cantiere}}

ORDINE DEL GIORNO
{{note_aggiuntive}}

PARTECIPANTI
(I firmatari del presente verbale attestano la propria partecipazione)

DELIBERE E AZIONI
[Da compilare durante la riunione]

Il presente verbale viene sottoscritto da tutti i partecipanti.`,
  },
  {
    id: "tpl5",
    nome: "Dichiarazione Conformità Lavori",
    descrizione: "Dichiarazione di conformità delle opere eseguite rispetto al progetto",
    tipo_documento: "altro",
    predefinito: true,
    data_creazione: "2026-01-01",
    variabili: [
      { chiave: "nome_cantiere", label: "Nome cantiere", esempio: "Residenza Parco Verde", auto: true },
      { chiave: "indirizzo_cantiere", label: "Indirizzo cantiere", esempio: "Via Roma 12, Milano", auto: true },
      { chiave: "data_odierna", label: "Data odierna", esempio: "11/03/2026", auto: true },
      { chiave: "nome_azienda", label: "Nome azienda", esempio: "Rossi Costruzioni S.r.l.", auto: true },
      { chiave: "tipo_opera", label: "Descrizione opere", esempio: "Impianto elettrico di cantiere", auto: false },
    ],
    contenuto: `DICHIARAZIONE DI CONFORMITÀ LAVORI

Cantiere: {{nome_cantiere}}
Indirizzo: {{indirizzo_cantiere}}
Data: {{data_odierna}}

Il sottoscritto, in qualità di rappresentante di {{nome_azienda}},

DICHIARA

che le opere di seguito descritte:
{{tipo_opera}}

sono state eseguite in conformità al progetto esecutivo approvato, nel rispetto delle normative tecniche vigenti e delle prescrizioni contenute nel Capitolato Speciale d'Appalto.

La presente dichiarazione viene rilasciata sotto la propria responsabilità ai sensi del D.P.R. 445/2000.`,
  },
];

export function compilaTemplate(contenuto: string, valori: Record<string, string>): string {
  let result = contenuto;
  for (const [chiave, valore] of Object.entries(valori)) {
    result = result.replace(new RegExp(`\\{\\{${chiave}\\}\\}`, "g"), valore || `[${chiave}]`);
  }
  return result;
}