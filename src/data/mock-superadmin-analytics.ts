// Mock data for SuperAdmin Analytics Dashboard
// Predisposto per futura integrazione con materialized views Supabase

export interface CohortRow {
  cohort: string; // "2025-10", "2025-11", etc.
  totalTenants: number;
  retention: number[]; // % retained at month 0, 1, 2, 3, 4, 5
}

export interface DailyActiveSites {
  date: string;
  count: number;
}

export interface ActivationStep {
  step: string;
  label: string;
  count: number;
  percentage: number;
}

export interface MrrMovement {
  month: string;
  new: number;
  expansion: number;
  contraction: number;
  churn: number;
  net: number;
}

export interface ChurnRiskTenant {
  tenantId: string;
  companyName: string;
  plan: string;
  riskScore: number; // 0-100
  daysSinceLastLogin: number;
  usageTrend: number; // % change vs last month, negative = declining
  paymentFailures: number;
  supportTickets: number;
  suggestedAction: string;
}

export interface ExpansionOpportunity {
  tenantId: string;
  companyName: string;
  plan: string;
  metric: string;
  current: number;
  limit: number;
  usagePercent: number;
  suggestedUpgrade: string;
}

export interface GeoRegionData {
  region: string;
  tenantCount: number;
  cantieriCount: number;
}

export interface SectorDistribution {
  sector: string;
  count: number;
  percentage: number;
}

export interface SystemHealthMetrics {
  apiLatency: { p50: number; p95: number; p99: number };
  errorRate: number;
  uptime: number;
  dbConnections: { active: number; max: number };
  storageUsedGb: number;
  storageLimitGb: number;
  lastIncident: { date: string; description: string; duration: string; severity: "low" | "medium" | "high" };
}

// --- COHORT RETENTION ---
export const cohortData: CohortRow[] = [
  { cohort: "2025-10", totalTenants: 12, retention: [100, 83, 75, 67, 58, 50] },
  { cohort: "2025-11", totalTenants: 18, retention: [100, 89, 78, 72, 61] },
  { cohort: "2025-12", totalTenants: 15, retention: [100, 87, 80, 73] },
  { cohort: "2026-01", totalTenants: 22, retention: [100, 91, 82] },
  { cohort: "2026-02", totalTenants: 28, retention: [100, 86] },
  { cohort: "2026-03", totalTenants: 14, retention: [100] },
];

// --- DAILY ACTIVE SITES (last 30 days) ---
export const dailyActiveSites: DailyActiveSites[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2026, 2, 12);
  date.setDate(date.getDate() - (29 - i));
  const base = 42 + Math.floor(Math.random() * 18);
  const weekend = date.getDay() === 0 || date.getDay() === 6 ? -15 : 0;
  return {
    date: date.toISOString().split("T")[0],
    count: Math.max(10, base + weekend),
  };
});

// --- ACTIVATION FUNNEL ---
export const activationFunnel: ActivationStep[] = [
  { step: "signup", label: "Registrazione", count: 109, percentage: 100 },
  { step: "first_login", label: "Primo Login", count: 94, percentage: 86 },
  { step: "first_checkin", label: "Primo Check-in", count: 68, percentage: 62 },
  { step: "first_document", label: "Primo Documento", count: 51, percentage: 47 },
  { step: "active_30d", label: "Attivo 30gg", count: 38, percentage: 35 },
];

// --- MRR MOVEMENT ---
export const mrrMovement: MrrMovement[] = [
  { month: "Ott 25", new: 490, expansion: 120, contraction: -50, churn: -98, net: 462 },
  { month: "Nov 25", new: 640, expansion: 85, contraction: -30, churn: -130, net: 565 },
  { month: "Dic 25", new: 380, expansion: 200, contraction: -80, churn: -65, net: 435 },
  { month: "Gen 26", new: 720, expansion: 150, contraction: -40, churn: -110, net: 720 },
  { month: "Feb 26", new: 580, expansion: 310, contraction: -60, churn: -90, net: 740 },
  { month: "Mar 26", new: 450, expansion: 180, contraction: -35, churn: -75, net: 520 },
];

// --- CHURN RISK ---
export const churnRiskTenants: ChurnRiskTenant[] = [
  {
    tenantId: "t3", companyName: "Impresa Verdi Srl", plan: "Pro",
    riskScore: 85, daysSinceLastLogin: 21, usageTrend: -62,
    paymentFailures: 2, supportTickets: 3,
    suggestedAction: "Chiamata urgente — calo utilizzo drastico e pagamenti falliti",
  },
  {
    tenantId: "t5", companyName: "GEC Lombarda SpA", plan: "Pro",
    riskScore: 68, daysSinceLastLogin: 14, usageTrend: -35,
    paymentFailures: 0, supportTickets: 5,
    suggestedAction: "Contatto supporto — molti ticket aperti, verificare soddisfazione",
  },
  {
    tenantId: "t7", companyName: "Rizzo Costruzioni", plan: "Starter",
    riskScore: 52, daysSinceLastLogin: 8, usageTrend: -28,
    paymentFailures: 0, supportTickets: 1,
    suggestedAction: "Email check-in — utilizzo in calo graduale",
  },
  {
    tenantId: "t2", companyName: "EdilMaster Group", plan: "Enterprise",
    riskScore: 25, daysSinceLastLogin: 2, usageTrend: -5,
    paymentFailures: 0, supportTickets: 0,
    suggestedAction: "Monitorare — leggero calo ma stabile",
  },
];

// --- EXPANSION OPPORTUNITIES ---
export const expansionOpportunities: ExpansionOpportunity[] = [
  {
    tenantId: "t1", companyName: "Costruzioni Rossi SpA", plan: "Pro",
    metric: "Utenti attivi", current: 9, limit: 10, usagePercent: 90,
    suggestedUpgrade: "Enterprise (utenti illimitati)",
  },
  {
    tenantId: "t4", companyName: "General Contracting Sud", plan: "Pro",
    metric: "Cantieri", current: 14, limit: 15, usagePercent: 93,
    suggestedUpgrade: "Enterprise (cantieri illimitati)",
  },
  {
    tenantId: "t6", companyName: "Cantieri del Nord Srl", plan: "Starter",
    metric: "Cantieri", current: 3, limit: 3, usagePercent: 100,
    suggestedUpgrade: "Pro (fino a 15 cantieri)",
  },
];

// --- GEO DATA ---
export const geoRegionData: GeoRegionData[] = [
  { region: "Lombardia", tenantCount: 28, cantieriCount: 142 },
  { region: "Lazio", tenantCount: 19, cantieriCount: 87 },
  { region: "Veneto", tenantCount: 16, cantieriCount: 73 },
  { region: "Emilia-Romagna", tenantCount: 14, cantieriCount: 65 },
  { region: "Piemonte", tenantCount: 12, cantieriCount: 54 },
  { region: "Toscana", tenantCount: 11, cantieriCount: 48 },
  { region: "Campania", tenantCount: 9, cantieriCount: 41 },
  { region: "Sicilia", tenantCount: 7, cantieriCount: 32 },
  { region: "Puglia", tenantCount: 6, cantieriCount: 28 },
  { region: "Liguria", tenantCount: 5, cantieriCount: 22 },
  { region: "Friuli-Venezia Giulia", tenantCount: 4, cantieriCount: 18 },
  { region: "Marche", tenantCount: 4, cantieriCount: 16 },
  { region: "Trentino-Alto Adige", tenantCount: 3, cantieriCount: 14 },
  { region: "Abruzzo", tenantCount: 3, cantieriCount: 12 },
  { region: "Sardegna", tenantCount: 3, cantieriCount: 11 },
  { region: "Calabria", tenantCount: 2, cantieriCount: 9 },
  { region: "Umbria", tenantCount: 2, cantieriCount: 8 },
  { region: "Basilicata", tenantCount: 1, cantieriCount: 4 },
  { region: "Molise", tenantCount: 1, cantieriCount: 3 },
  { region: "Valle d'Aosta", tenantCount: 1, cantieriCount: 2 },
];

export const sectorDistribution: SectorDistribution[] = [
  { sector: "Edilizia Residenziale", count: 52, percentage: 38 },
  { sector: "Infrastrutture", count: 34, percentage: 25 },
  { sector: "Industriale", count: 28, percentage: 20 },
  { sector: "Ristrutturazione", count: 23, percentage: 17 },
];

// --- SYSTEM HEALTH ---
export const systemHealth: SystemHealthMetrics = {
  apiLatency: { p50: 45, p95: 180, p99: 420 },
  errorRate: 0.12,
  uptime: 99.97,
  dbConnections: { active: 23, max: 100 },
  storageUsedGb: 18.4,
  storageLimitGb: 50,
  lastIncident: {
    date: "2026-02-28",
    description: "Latenza elevata Edge Functions per 12 minuti — causa: spike traffico da import massivo",
    duration: "12 min",
    severity: "low",
  },
};

// Aggregate metrics
export const analyticsKpis = {
  dailyActiveSitesAvg: Math.round(dailyActiveSites.reduce((s, d) => s + d.count, 0) / dailyActiveSites.length),
  dailyActiveSitesToday: dailyActiveSites[dailyActiveSites.length - 1].count,
  arpu: 34.2,
  nrr: 108, // Net Revenue Retention %
  totalTenants: 150,
  payingTenants: 109,
};
