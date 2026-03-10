export interface MockTenantEntry {
  id: string;
  nome_azienda: string;
  p_iva: string;
  email_admin: string;
  piano: "free" | "pro" | "enterprise";
  stato: "attivo" | "trial" | "sospeso" | "scaduto";
  trial_ends_at: string | null;
  created_at: string;
  cantieri_count: number;
  utenti_count: number;
  last_active: string;
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
    email_admin: "admin@rossicostruzioni.it",
    piano: "pro",
    stato: "attivo",
    trial_ends_at: null,
    created_at: "2025-06-15T10:00:00",
    cantieri_count: 2,
    utenti_count: 3,
    last_active: "2026-03-10T09:30:00",
  },
  {
    id: "t2",
    nome_azienda: "Edilizia Moderna S.p.A.",
    p_iva: "IT09876543210",
    email_admin: "info@ediliziamoderna.it",
    piano: "enterprise",
    stato: "attivo",
    trial_ends_at: null,
    created_at: "2025-03-01T08:00:00",
    cantieri_count: 8,
    utenti_count: 12,
    last_active: "2026-03-10T11:15:00",
  },
  {
    id: "t3",
    nome_azienda: "Fratelli Bianchi Edilizia",
    p_iva: "IT05678901234",
    email_admin: "fbianchi@gmail.com",
    piano: "free",
    stato: "trial",
    trial_ends_at: "2026-03-17T23:59:59",
    created_at: "2026-03-03T14:00:00",
    cantieri_count: 1,
    utenti_count: 1,
    last_active: "2026-03-09T16:45:00",
  },
  {
    id: "t4",
    nome_azienda: "Costruzioni Verdi S.r.l.",
    p_iva: "IT03456789012",
    email_admin: "admin@costruzioniverdi.it",
    piano: "pro",
    stato: "sospeso",
    trial_ends_at: null,
    created_at: "2025-09-20T09:00:00",
    cantieri_count: 3,
    utenti_count: 5,
    last_active: "2026-02-15T10:00:00",
  },
];

export const platformStats = {
  aziendeAttive: 2,
  trialAttivi: 1,
  cantieriAperti: 14,
  documentiCaricatiOggi: 23,
  aziendeConDocScaduti: 1,
  nuoveRegistrazioni30gg: 3,
  mrr: 1290,
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
