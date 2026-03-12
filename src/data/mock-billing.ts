export interface MockInvoice {
  id: string;
  tenant_id: string;
  tenant_name: string;
  numero_fattura: string;
  importo_netto: number;
  iva: number;
  totale: number;
  stato: "pagata" | "in_scadenza" | "scaduta" | "bozza";
  data_emissione: string;
  data_scadenza: string;
  data_pagamento?: string;
  descrizione: string;
  pdf_url?: string;
}

export interface MockPaymentMethod {
  id: string;
  tenant_id: string;
  tipo: "card" | "sepa_debit";
  brand?: string;
  last4: string;
  expiry_month: number;
  expiry_year: number;
  is_default: boolean;
}

export interface MockPlan {
  id: string;
  nome: string;
  prezzo_mensile: number;
  prezzo_annuale: number;
  max_cantieri: number | null;
  max_utenti: number | null;
  max_storage_gb: number;
  features: string[];
}

export interface BillingMetrics {
  mrr: number;
  arr: number;
  churn_rate: number;
  ltv: number;
  outstanding_revenue: number;
  total_customers: number;
  paying_customers: number;
}

export interface RevenueTrendPoint {
  mese: string;
  revenue: number;
}

export interface PlanDistribution {
  piano: string;
  count: number;
  fill: string;
}

export const mockPlans: MockPlan[] = [
  {
    id: "free",
    nome: "Starter",
    prezzo_mensile: 0,
    prezzo_annuale: 0,
    max_cantieri: 3,
    max_utenti: 5,
    max_storage_gb: 1,
    features: ["3 cantieri", "5 utenti", "1 GB storage", "Documenti base", "Badge digitali"],
  },
  {
    id: "pro",
    nome: "Professional",
    prezzo_mensile: 32,
    prezzo_annuale: 26,
    max_cantieri: null,
    max_utenti: null,
    max_storage_gb: 50,
    features: ["Cantieri illimitati", "Utenti illimitati", "50 GB storage", "Firma digitale", "GPS tracking", "OCR documenti", "Supporto prioritario"],
  },
  {
    id: "enterprise",
    nome: "Business",
    prezzo_mensile: 42,
    prezzo_annuale: 34,
    max_cantieri: null,
    max_utenti: null,
    max_storage_gb: 200,
    features: ["Tutto Professional", "200 GB storage", "API access", "SSO aziendale", "Account manager dedicato", "SLA garantito 99.9%"],
  },
];

export const mockInvoices: MockInvoice[] = [
  {
    id: "inv-001",
    tenant_id: "t1",
    tenant_name: "EdilMaster Group",
    numero_fattura: "2025/001",
    importo_netto: 32,
    iva: 7.04,
    totale: 39.04,
    stato: "pagata",
    data_emissione: "2025-01-05",
    data_scadenza: "2025-01-20",
    data_pagamento: "2025-01-05",
    descrizione: "Canone mensile Piano Professional - Gennaio 2025",
  },
  {
    id: "inv-002",
    tenant_id: "t1",
    tenant_name: "EdilMaster Group",
    numero_fattura: "2025/002",
    importo_netto: 32,
    iva: 7.04,
    totale: 39.04,
    stato: "pagata",
    data_emissione: "2025-02-05",
    data_scadenza: "2025-02-20",
    data_pagamento: "2025-02-06",
    descrizione: "Canone mensile Piano Professional - Febbraio 2025",
  },
  {
    id: "inv-003",
    tenant_id: "t1",
    tenant_name: "EdilMaster Group",
    numero_fattura: "2025/003",
    importo_netto: 32,
    iva: 7.04,
    totale: 39.04,
    stato: "pagata",
    data_emissione: "2025-03-05",
    data_scadenza: "2025-03-20",
    data_pagamento: "2025-03-05",
    descrizione: "Canone mensile Piano Professional - Marzo 2025",
  },
  {
    id: "inv-004",
    tenant_id: "t2",
    tenant_name: "Costruzioni Rossi",
    numero_fattura: "2025/004",
    importo_netto: 42,
    iva: 9.24,
    totale: 51.24,
    stato: "pagata",
    data_emissione: "2025-01-10",
    data_scadenza: "2025-01-25",
    data_pagamento: "2025-01-10",
    descrizione: "Canone mensile Piano Business - Gennaio 2025",
  },
  {
    id: "inv-005",
    tenant_id: "t2",
    tenant_name: "Costruzioni Rossi",
    numero_fattura: "2025/005",
    importo_netto: 42,
    iva: 9.24,
    totale: 51.24,
    stato: "in_scadenza",
    data_emissione: "2025-03-10",
    data_scadenza: "2025-03-25",
    descrizione: "Canone mensile Piano Business - Marzo 2025",
  },
  {
    id: "inv-006",
    tenant_id: "t3",
    tenant_name: "GEC Lombarda",
    numero_fattura: "2025/006",
    importo_netto: 32,
    iva: 7.04,
    totale: 39.04,
    stato: "scaduta",
    data_emissione: "2025-02-01",
    data_scadenza: "2025-02-15",
    descrizione: "Canone mensile Piano Professional - Febbraio 2025",
  },
];

export const mockPaymentMethods: MockPaymentMethod[] = [
  { id: "pm-001", tenant_id: "t1", tipo: "card", brand: "Visa", last4: "4242", expiry_month: 12, expiry_year: 2027, is_default: true },
  { id: "pm-002", tenant_id: "t2", tipo: "card", brand: "Mastercard", last4: "8210", expiry_month: 6, expiry_year: 2026, is_default: true },
  { id: "pm-003", tenant_id: "t3", tipo: "sepa_debit", last4: "3456", expiry_month: 0, expiry_year: 0, is_default: true },
];

export const mockBillingMetrics: BillingMetrics = {
  mrr: 1290,
  arr: 15480,
  churn_rate: 2.3,
  ltv: 1856,
  outstanding_revenue: 90.28,
  total_customers: 8,
  paying_customers: 5,
};

export const mockRevenueTrend: RevenueTrendPoint[] = [
  { mese: "Apr 24", revenue: 620 },
  { mese: "Mag 24", revenue: 680 },
  { mese: "Giu 24", revenue: 740 },
  { mese: "Lug 24", revenue: 810 },
  { mese: "Ago 24", revenue: 790 },
  { mese: "Set 24", revenue: 880 },
  { mese: "Ott 24", revenue: 950 },
  { mese: "Nov 24", revenue: 1020 },
  { mese: "Dic 24", revenue: 1080 },
  { mese: "Gen 25", revenue: 1150 },
  { mese: "Feb 25", revenue: 1220 },
  { mese: "Mar 25", revenue: 1290 },
];

export const mockPlanDistribution: PlanDistribution[] = [
  { piano: "Starter", count: 3, fill: "hsl(var(--muted-foreground))" },
  { piano: "Professional", count: 3, fill: "hsl(var(--primary))" },
  { piano: "Business", count: 2, fill: "hsl(var(--accent))" },
];

// Current tenant billing info (for tenant t1)
export const mockCurrentTenantBilling = {
  plan: mockPlans[1], // Professional
  billing_cycle: "monthly" as const,
  current_period_start: "2025-03-05",
  current_period_end: "2025-04-05",
  next_invoice_date: "2025-04-05",
  status: "active" as const,
};
