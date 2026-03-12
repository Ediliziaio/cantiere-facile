export interface MockTenantEntry {
  id: string;
  nome_azienda: string;
  p_iva: string;
  fiscal_code: string;
  email_admin: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  piano: "free" | "pro" | "enterprise";
  stato: "attivo" | "trial" | "sospeso" | "scaduto";
  trial_ends_at: string | null;
  created_at: string;
  cantieri_count: number;
  utenti_count: number;
  max_users: number;
  max_sites: number;
  storage_used_mb: number;
  max_storage_gb: number;
  health_score: number; // 0-100
  last_active: string;
}

export interface TenantSettings {
  tenant_id: string;
  timezone: string;
  date_format: string;
  currency: string;
  language: string;
  features_enabled: {
    gps_tracking: boolean;
    ocr_enabled: boolean;
    api_access: boolean;
    firma_digitale: boolean;
    sicurezza_module: boolean;
  };
  branding_primary: string;
  branding_secondary: string;
  email_notifications_enabled: boolean;
}

export interface MockSubscription {
  id: string;
  tenant_id: string;
  piano: "free" | "pro" | "enterprise";
  importo: number;
  stato: "pagato" | "in_scadenza" | "scaduto" | "annullato";
  data_inizio: string;
  data_fine: string;
  metodo_pagamento: string;
}

export type AuditActionType = "creazione_tenant" | "sospensione" | "riattivazione" | "impersonation" | "modifica_piano" | "export_dati" | "modifica_settings";

export interface SuperAdminAuditLog {
  id: string;
  superadmin_id: string;
  superadmin_nome: string;
  tenant_id: string;
  tenant_nome: string;
  azione: AuditActionType;
  dettaglio: string;
  ip_address: string;
  timestamp: string;
}

export const mockSuperAdmin = {
  id: "sa1",
  email: "admin@cantiereincloud.it",
  nome: "Platform Admin",
};

export const mockTenantsAll: MockTenantEntry[] = [
  {
    id: "t1",
    nome_azienda: "Rossi Costruzioni S.r.l.",
    p_iva: "IT01234567890",
    fiscal_code: "RSSCST80A01F205X",
    email_admin: "admin@rossicostruzioni.it",
    phone: "+39 02 1234567",
    address: "Via Milano 45",
    city: "Milano",
    province: "MI",
    piano: "pro",
    stato: "attivo",
    trial_ends_at: null,
    created_at: "2025-06-15T10:00:00",
    cantieri_count: 2,
    utenti_count: 3,
    max_users: 10,
    max_sites: 5,
    storage_used_mb: 1240,
    max_storage_gb: 5,
    health_score: 87,
    last_active: "2026-03-10T09:30:00",
  },
  {
    id: "t2",
    nome_azienda: "Edilizia Moderna S.p.A.",
    p_iva: "IT09876543210",
    fiscal_code: "EDLMDR90B15H501Y",
    email_admin: "info@ediliziamoderna.it",
    phone: "+39 06 9876543",
    address: "Viale Europa 120",
    city: "Roma",
    province: "RM",
    piano: "enterprise",
    stato: "attivo",
    trial_ends_at: null,
    created_at: "2025-03-01T08:00:00",
    cantieri_count: 8,
    utenti_count: 12,
    max_users: 50,
    max_sites: 20,
    storage_used_mb: 8500,
    max_storage_gb: 20,
    health_score: 95,
    last_active: "2026-03-10T11:15:00",
  },
  {
    id: "t3",
    nome_azienda: "Fratelli Bianchi Edilizia",
    p_iva: "IT05678901234",
    fiscal_code: "BNCFRT85C20L219K",
    email_admin: "fbianchi@gmail.com",
    phone: "+39 011 5556789",
    address: "Corso Torino 88",
    city: "Torino",
    province: "TO",
    piano: "free",
    stato: "trial",
    trial_ends_at: "2026-03-17T23:59:59",
    created_at: "2026-03-03T14:00:00",
    cantieri_count: 1,
    utenti_count: 1,
    max_users: 3,
    max_sites: 1,
    storage_used_mb: 45,
    max_storage_gb: 1,
    health_score: 42,
    last_active: "2026-03-09T16:45:00",
  },
  {
    id: "t4",
    nome_azienda: "Costruzioni Verdi S.r.l.",
    p_iva: "IT03456789012",
    fiscal_code: "VRDCST78D10A271Z",
    email_admin: "admin@costruzioniverdi.it",
    phone: "+39 055 3334567",
    address: "Via Firenze 22",
    city: "Firenze",
    province: "FI",
    piano: "pro",
    stato: "sospeso",
    trial_ends_at: null,
    created_at: "2025-09-20T09:00:00",
    cantieri_count: 3,
    utenti_count: 5,
    max_users: 10,
    max_sites: 5,
    storage_used_mb: 2100,
    max_storage_gb: 5,
    health_score: 15,
    last_active: "2026-02-15T10:00:00",
  },
];

export const mockTenantSettings: TenantSettings[] = [
  {
    tenant_id: "t1",
    timezone: "Europe/Rome",
    date_format: "DD/MM/YYYY",
    currency: "EUR",
    language: "it",
    features_enabled: { gps_tracking: true, ocr_enabled: true, api_access: false, firma_digitale: true, sicurezza_module: true },
    branding_primary: "#f97316",
    branding_secondary: "#1e293b",
    email_notifications_enabled: true,
  },
  {
    tenant_id: "t2",
    timezone: "Europe/Rome",
    date_format: "DD/MM/YYYY",
    currency: "EUR",
    language: "it",
    features_enabled: { gps_tracking: true, ocr_enabled: true, api_access: true, firma_digitale: true, sicurezza_module: true },
    branding_primary: "#2563eb",
    branding_secondary: "#0f172a",
    email_notifications_enabled: true,
  },
  {
    tenant_id: "t3",
    timezone: "Europe/Rome",
    date_format: "DD/MM/YYYY",
    currency: "EUR",
    language: "it",
    features_enabled: { gps_tracking: false, ocr_enabled: false, api_access: false, firma_digitale: false, sicurezza_module: false },
    branding_primary: "#f97316",
    branding_secondary: "#1e293b",
    email_notifications_enabled: false,
  },
  {
    tenant_id: "t4",
    timezone: "Europe/Rome",
    date_format: "DD/MM/YYYY",
    currency: "EUR",
    language: "it",
    features_enabled: { gps_tracking: true, ocr_enabled: false, api_access: false, firma_digitale: true, sicurezza_module: false },
    branding_primary: "#16a34a",
    branding_secondary: "#1e293b",
    email_notifications_enabled: true,
  },
];

export const mockSubscriptions: MockSubscription[] = [
  { id: "sub1", tenant_id: "t1", piano: "pro", importo: 49, stato: "pagato", data_inizio: "2026-02-15", data_fine: "2026-03-15", metodo_pagamento: "Carta *4532" },
  { id: "sub2", tenant_id: "t1", piano: "pro", importo: 49, stato: "pagato", data_inizio: "2026-01-15", data_fine: "2026-02-15", metodo_pagamento: "Carta *4532" },
  { id: "sub3", tenant_id: "t1", piano: "pro", importo: 49, stato: "pagato", data_inizio: "2025-12-15", data_fine: "2026-01-15", metodo_pagamento: "Carta *4532" },
  { id: "sub4", tenant_id: "t2", piano: "enterprise", importo: 199, stato: "pagato", data_inizio: "2026-02-01", data_fine: "2026-03-01", metodo_pagamento: "Bonifico SEPA" },
  { id: "sub5", tenant_id: "t2", piano: "enterprise", importo: 199, stato: "in_scadenza", data_inizio: "2026-03-01", data_fine: "2026-04-01", metodo_pagamento: "Bonifico SEPA" },
  { id: "sub6", tenant_id: "t4", piano: "pro", importo: 49, stato: "scaduto", data_inizio: "2026-01-20", data_fine: "2026-02-20", metodo_pagamento: "Carta *8901" },
];

export const mockSuperAdminLog: SuperAdminAuditLog[] = [
  { id: "al1", superadmin_id: "sa1", superadmin_nome: "Platform Admin", tenant_id: "t3", tenant_nome: "Fratelli Bianchi Edilizia", azione: "creazione_tenant", dettaglio: "Creazione account trial", ip_address: "93.42.115.12", timestamp: "2026-03-03T14:00:00" },
  { id: "al2", superadmin_id: "sa1", superadmin_nome: "Platform Admin", tenant_id: "t1", tenant_nome: "Rossi Costruzioni S.r.l.", azione: "impersonation", dettaglio: "Sessione impersonation avviata", ip_address: "93.42.115.12", timestamp: "2026-03-09T14:00:00" },
  { id: "al3", superadmin_id: "sa1", superadmin_nome: "Platform Admin", tenant_id: "t2", tenant_nome: "Edilizia Moderna S.p.A.", azione: "impersonation", dettaglio: "Sessione impersonation avviata", ip_address: "93.42.115.12", timestamp: "2026-03-08T10:30:00" },
  { id: "al4", superadmin_id: "sa1", superadmin_nome: "Platform Admin", tenant_id: "t4", tenant_nome: "Costruzioni Verdi S.r.l.", azione: "sospensione", dettaglio: "Account sospeso per mancato pagamento", ip_address: "93.42.115.12", timestamp: "2026-02-20T11:00:00" },
  { id: "al5", superadmin_id: "sa1", superadmin_nome: "Platform Admin", tenant_id: "t2", tenant_nome: "Edilizia Moderna S.p.A.", azione: "modifica_piano", dettaglio: "Upgrade da pro a enterprise", ip_address: "93.42.115.12", timestamp: "2026-01-15T09:30:00" },
  { id: "al6", superadmin_id: "sa1", superadmin_nome: "Platform Admin", tenant_id: "t1", tenant_nome: "Rossi Costruzioni S.r.l.", azione: "modifica_settings", dettaglio: "Attivato modulo firma digitale", ip_address: "93.42.115.12", timestamp: "2025-11-10T16:00:00" },
  { id: "al7", superadmin_id: "sa1", superadmin_nome: "Platform Admin", tenant_id: "t1", tenant_nome: "Rossi Costruzioni S.r.l.", azione: "creazione_tenant", dettaglio: "Creazione account pro", ip_address: "93.42.115.12", timestamp: "2025-06-15T10:00:00" },
  { id: "al8", superadmin_id: "sa1", superadmin_nome: "Platform Admin", tenant_id: "t4", tenant_nome: "Costruzioni Verdi S.r.l.", azione: "creazione_tenant", dettaglio: "Creazione account pro", ip_address: "93.42.115.12", timestamp: "2025-09-20T09:00:00" },
  { id: "al9", superadmin_id: "sa1", superadmin_nome: "Platform Admin", tenant_id: "t2", tenant_nome: "Edilizia Moderna S.p.A.", azione: "export_dati", dettaglio: "Export completo dati azienda (JSON)", ip_address: "93.42.115.12", timestamp: "2026-03-05T15:00:00" },
];

export const platformStats = {
  aziendeAttive: 2,
  trialAttivi: 1,
  aziendeSospese: 1,
  cantieriAperti: 14,
  documentiCaricatiOggi: 23,
  aziendeConDocScaduti: 1,
  nuoveRegistrazioni30gg: 3,
  mrr: 1290,
  storageTotalGb: 50,
  storageUsedGb: 11.6,
  aziendePagamentoScadenza: 1,
};

export const mockImpersonationLog = [
  { id: "imp1", superadmin_id: "sa1", tenant_id: "t1", started_at: "2026-03-09T14:00:00", ended_at: "2026-03-09T14:15:00" },
  { id: "imp2", superadmin_id: "sa1", tenant_id: "t2", started_at: "2026-03-08T10:30:00", ended_at: "2026-03-08T10:45:00" },
];

export const registrazioniRecenti = [
  { mese: "Ott", count: 4 },
  { mese: "Nov", count: 6 },
  { mese: "Dic", count: 3 },
  { mese: "Gen", count: 5 },
  { mese: "Feb", count: 7 },
  { mese: "Mar", count: 3 },
];

// Mock cantieri per tutti i tenant
export const mockCantieriAllTenants = [
  { id: "c1", tenant_id: "t1", nome: "Residenziale Via Roma 12", comune: "Milano", stato: "attivo", lavoratori_count: 18, documenti_ok: 42, documenti_totali: 48 },
  { id: "c2", tenant_id: "t1", nome: "Ristrutturazione Palazzina", comune: "Bergamo", stato: "attivo", lavoratori_count: 12, documenti_ok: 28, documenti_totali: 36 },
  { id: "c3", tenant_id: "t2", nome: "Centro Commerciale Nord", comune: "Roma", stato: "attivo", lavoratori_count: 45, documenti_ok: 120, documenti_totali: 130 },
  { id: "c4", tenant_id: "t2", nome: "Ponte Autostradale A1", comune: "Firenze", stato: "attivo", lavoratori_count: 30, documenti_ok: 85, documenti_totali: 90 },
  { id: "c5", tenant_id: "t2", nome: "Scuola Elementare Renovation", comune: "Napoli", stato: "completato", lavoratori_count: 0, documenti_ok: 60, documenti_totali: 60 },
  { id: "c6", tenant_id: "t3", nome: "Villetta Unifamiliare", comune: "Torino", stato: "attivo", lavoratori_count: 4, documenti_ok: 8, documenti_totali: 15 },
  { id: "c7", tenant_id: "t4", nome: "Complesso Residenziale", comune: "Firenze", stato: "sospeso", lavoratori_count: 0, documenti_ok: 30, documenti_totali: 40 },
  { id: "c8", tenant_id: "t4", nome: "Uffici Direzionali", comune: "Prato", stato: "sospeso", lavoratori_count: 0, documenti_ok: 20, documenti_totali: 25 },
];
