// ═══════════════════════════════════════
// Fatturazione Elettronica — Type System
// ═══════════════════════════════════════

export type TipoDocumento = 'fattura' | 'nota_credito' | 'fattura_pa' | 'parcella';
export type StatoDocumento = 'bozza' | 'emessa' | 'inviata_sdi' | 'consegnata' | 'accettata' | 'rifiutata';
export type StatoSDI = 'AT' | 'RC' | 'NS' | 'MC' | 'EC' | 'DT' | null;
export type RegimeFiscale = 'RF01' | 'RF02' | 'RF04' | 'RF19';
export type CondizioniPagamento = 'TP01' | 'TP02' | 'TP03';
export type ModalitaPagamento = 'MP01' | 'MP02' | 'MP05' | 'MP08' | 'MP12';
export type NaturaIVA = 'N1' | 'N2' | 'N2.1' | 'N2.2' | 'N3' | 'N3.1' | 'N3.2' | 'N3.3' | 'N3.4' | 'N3.5' | 'N3.6' | 'N4' | 'N5' | 'N6' | 'N6.1' | 'N6.2' | 'N6.3' | 'N6.4' | 'N6.5' | 'N6.6' | 'N6.7' | 'N6.8' | 'N6.9' | 'N7';

export interface Indirizzo {
  via: string;
  cap: string;
  citta: string;
  provincia: string;
  nazione: string;
}

export interface AnagraficaAzienda {
  id: string;
  ragione_sociale: string;
  forma_giuridica: string;
  p_iva: string;
  codice_fiscale: string;
  indirizzo: Indirizzo;
  pec: string;
  telefono?: string;
  sito_web?: string;
  logo_url?: string;
  colore_primario: string;
  regime_fiscale: RegimeFiscale;
  codice_rea?: string;
  provincia_rea?: string;
  capitale_sociale?: number;
  socio_unico?: 'SU' | 'SM';
  stato_liquidazione?: 'LN' | 'LS';
  sdi_provider: 'aruba' | 'manuale';
  codice_sdi_proprio?: string;
}

export interface ClienteSnapshot {
  ragione_sociale: string;
  p_iva?: string;
  codice_fiscale?: string;
  indirizzo: Indirizzo;
  codice_sdi?: string;
  pec?: string;
  is_pa?: boolean;
}

export interface RigaFattura {
  numero_linea: number;
  codice?: string;
  descrizione: string;
  quantita: number;
  unita_misura: string;
  prezzo_unitario: number;
  sconto_percentuale?: number;
  aliquota_iva: number;
  natura?: NaturaIVA;
  importo: number;
  note_riga?: string;
  ritenuta?: boolean;
  riferimento_amministrazione?: string;
}

export interface RiepilogoIVA {
  aliquota_iva: number;
  natura?: NaturaIVA;
  imponibile: number;
  imposta: number;
  esigibilita_iva?: 'I' | 'D' | 'S';
}

export interface ScadenzaPagamento {
  data_scadenza: string;
  importo: number;
}

export interface Pagamento {
  condizioni: CondizioniPagamento;
  modalita: ModalitaPagamento;
  iban?: string;
  intestatario_conto?: string;
  istituto_finanziario?: string;
  scadenze: ScadenzaPagamento[];
}

export interface Totali {
  imponibile: number;
  sconto_globale?: number;
  cassa_previdenziale?: number;
  cassa_previdenziale_aliquota?: number;
  totale_iva: number;
  bollo_virtuale?: number;
  totale_documento: number;
  ritenuta_acconto?: number;
  ritenuta_aliquota?: number;
  ritenuta_causale?: string;
  netto_a_pagare: number;
}

export interface RiferimentoOrdine {
  id_documento?: string;
  data?: string;
  numero_linea?: number;
  codice_commessa?: string;
  cig?: string;
  cup?: string;
}

export interface RiferimentoDDT {
  numero_ddt: string;
  data_ddt: string;
  riferimento_linee?: number[];
}

export interface DocumentoFiscale {
  id: string;
  company_id: string;
  tipo: TipoDocumento;
  numero: string;
  numero_progressivo: number;
  data_emissione: string;
  data_scadenza?: string;
  stato: StatoDocumento;
  cliente_snapshot: ClienteSnapshot;
  righe: RigaFattura[];
  riepilogo_iva: RiepilogoIVA[];
  totali: Totali;
  pagamento: Pagamento;
  note_documento?: string;
  
  // Nota di credito
  riferimento_fattura_nc?: string;
  riferimento_fattura_nc_data?: string;
  
  // PA
  riferimenti_ordine?: RiferimentoOrdine[];
  riferimenti_ddt?: RiferimentoDDT[];
  
  // Sconto globale
  sconto_globale_tipo?: 'percentuale' | 'valore';
  sconto_globale_valore?: number;
  
  // Bollo
  bollo_virtuale?: boolean;
  
  // Cassa previdenziale
  cassa_previdenziale_tipo?: string;
  cassa_previdenziale_aliquota?: number;
  cassa_previdenziale_imponibile?: number;
  
  // SDI
  sdi_id_trasmissione?: string;
  sdi_stato?: StatoSDI;
  sdi_notifica_tipo?: string;
  sdi_file_xml_url?: string;
  sdi_errori?: string[];
  pdf_url?: string;
  
  // Metadata
  created_at: string;
  updated_at: string;
}

export interface SDILogEntry {
  id: string;
  documento_id: string;
  evento: 'invio' | 'ricevuta' | 'notifica' | 'errore';
  messaggio: string;
  sdi_id?: string;
  xml_content?: string;
  created_at: string;
}

// Mapping tipo documento → codice FatturaPA
export const TIPO_DOCUMENTO_MAP: Record<TipoDocumento, string> = {
  fattura: 'TD01',
  nota_credito: 'TD04',
  fattura_pa: 'TD01',
  parcella: 'TD06',
};

export const MODALITA_PAGAMENTO_LABELS: Record<ModalitaPagamento, string> = {
  MP01: 'Contanti',
  MP02: 'Assegno',
  MP05: 'Bonifico',
  MP08: 'Carta di pagamento',
  MP12: 'RIBA',
};

export const REGIME_FISCALE_LABELS: Record<RegimeFiscale, string> = {
  RF01: 'Ordinario',
  RF02: 'Contribuenti minimi',
  RF04: 'Agricoltura',
  RF19: 'Regime forfettario',
};

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}
