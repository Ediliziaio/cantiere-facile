// Mock Analytics Data — Daily snapshots, budgets, milestones

import { format, subDays, addDays } from 'date-fns';

export interface AnalyticsSnapshot {
  date: string;
  site_id: string;
  workers_count: number;
  hours_total: number;
  costs_labor: number;
  costs_materials: number;
  safety_score: number;
}

export interface BudgetItem {
  voce: string;
  budget: number;
  consuntivo: number;
}

export interface SiteBudget {
  site_id: string;
  site_name: string;
  items: BudgetItem[];
}

export interface Milestone {
  id: string;
  site_id: string;
  name: string;
  planned_date: string;
  actual_date: string | null;
  completion_pct: number;
}

// Generate 90 days of daily snapshots for each site
function generateSnapshots(): AnalyticsSnapshot[] {
  const snapshots: AnalyticsSnapshot[] = [];
  const today = new Date('2026-03-11');
  const sites = [
    { id: 'c1', baseWorkers: 14, baseHours: 105, baseLaborCost: 3200, baseMaterialsCost: 1800, baseSafety: 85 },
    { id: 'c2', baseWorkers: 9, baseHours: 68, baseLaborCost: 2100, baseMaterialsCost: 1200, baseSafety: 80 },
  ];

  for (let i = 89; i >= 0; i--) {
    const date = subDays(today, i);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const dateStr = format(date, 'yyyy-MM-dd');

    for (const site of sites) {
      const seasonalFactor = 1 + Math.sin(i / 30) * 0.15;
      const noise = () => 0.85 + Math.random() * 0.3;

      snapshots.push({
        date: dateStr,
        site_id: site.id,
        workers_count: isWeekend ? Math.floor(site.baseWorkers * 0.2) : Math.round(site.baseWorkers * noise() * seasonalFactor),
        hours_total: isWeekend ? Math.round(site.baseHours * 0.1) : Math.round(site.baseHours * noise() * seasonalFactor),
        costs_labor: isWeekend ? Math.round(site.baseLaborCost * 0.1) : Math.round(site.baseLaborCost * noise() * seasonalFactor),
        costs_materials: isWeekend ? 0 : Math.round(site.baseMaterialsCost * noise() * seasonalFactor),
        safety_score: Math.min(100, Math.max(60, Math.round(site.baseSafety + (Math.random() - 0.3) * 15))),
      });
    }
  }
  return snapshots;
}

export const mockAnalyticsSnapshots = generateSnapshots();

export const mockBudgets: SiteBudget[] = [
  {
    site_id: 'c1',
    site_name: 'Residenziale Via Roma 12',
    items: [
      { voce: 'Manodopera', budget: 320000, consuntivo: 285000 },
      { voce: 'Materiali', budget: 180000, consuntivo: 195000 },
      { voce: 'Noleggio mezzi', budget: 85000, consuntivo: 72000 },
      { voce: 'Subappalti', budget: 120000, consuntivo: 110000 },
      { voce: 'Oneri sicurezza', budget: 45000, consuntivo: 42000 },
    ],
  },
  {
    site_id: 'c2',
    site_name: 'Ristrutturazione Palazzina',
    items: [
      { voce: 'Manodopera', budget: 180000, consuntivo: 95000 },
      { voce: 'Materiali', budget: 120000, consuntivo: 68000 },
      { voce: 'Noleggio mezzi', budget: 45000, consuntivo: 28000 },
      { voce: 'Subappalti', budget: 75000, consuntivo: 35000 },
      { voce: 'Oneri sicurezza', budget: 30000, consuntivo: 18000 },
    ],
  },
];

export const mockMilestones: Milestone[] = [
  { id: 'ms1', site_id: 'c1', name: 'Fondazioni', planned_date: '2025-11-15', actual_date: '2025-11-20', completion_pct: 100 },
  { id: 'ms2', site_id: 'c1', name: 'Struttura Piano Terra', planned_date: '2026-01-15', actual_date: '2026-01-18', completion_pct: 100 },
  { id: 'ms3', site_id: 'c1', name: 'Struttura Piani Superiori', planned_date: '2026-04-30', actual_date: null, completion_pct: 65 },
  { id: 'ms4', site_id: 'c1', name: 'Copertura', planned_date: '2026-06-15', actual_date: null, completion_pct: 0 },
  { id: 'ms5', site_id: 'c1', name: 'Finiture', planned_date: '2026-08-31', actual_date: null, completion_pct: 0 },
  { id: 'ms6', site_id: 'c2', name: 'Demolizioni interne', planned_date: '2026-02-15', actual_date: '2026-02-12', completion_pct: 100 },
  { id: 'ms7', site_id: 'c2', name: 'Rifacimento impianti', planned_date: '2026-04-30', actual_date: null, completion_pct: 35 },
  { id: 'ms8', site_id: 'c2', name: 'Finiture interne', planned_date: '2026-08-30', actual_date: null, completion_pct: 0 },
];

// Helper functions
export function getSnapshotsByRange(days: number, siteId?: string): AnalyticsSnapshot[] {
  const cutoff = format(subDays(new Date('2026-03-11'), days), 'yyyy-MM-dd');
  return mockAnalyticsSnapshots.filter(s =>
    s.date >= cutoff && (!siteId || s.site_id === siteId)
  );
}

export function calculateBurnRate(siteId: string, days: number = 30): number {
  const snapshots = getSnapshotsByRange(days, siteId);
  if (snapshots.length === 0) return 0;
  const totalCost = snapshots.reduce((sum, s) => sum + s.costs_labor + s.costs_materials, 0);
  return totalCost / snapshots.length;
}

export function forecastSpesa(siteId: string, forecastDays: number = 30): { date: string; projected: number }[] {
  const burnRate = calculateBurnRate(siteId, 30);
  const lastSnapshot = mockAnalyticsSnapshots
    .filter(s => s.site_id === siteId)
    .sort((a, b) => b.date.localeCompare(a.date))[0];

  if (!lastSnapshot) return [];

  const currentTotal = mockAnalyticsSnapshots
    .filter(s => s.site_id === siteId)
    .reduce((sum, s) => sum + s.costs_labor + s.costs_materials, 0);

  const result: { date: string; projected: number }[] = [];
  for (let i = 1; i <= forecastDays; i++) {
    result.push({
      date: format(addDays(new Date('2026-03-11'), i), 'yyyy-MM-dd'),
      projected: Math.round(currentTotal + burnRate * i),
    });
  }
  return result;
}

export function getAverageCompletion(siteId?: string): number {
  const milestones = siteId
    ? mockMilestones.filter(m => m.site_id === siteId)
    : mockMilestones;
  if (milestones.length === 0) return 0;
  return Math.round(milestones.reduce((sum, m) => sum + m.completion_pct, 0) / milestones.length);
}

export function getDaysSinceLastAccident(): number {
  // Last accident was 2026-03-05 (acc2 near_miss)
  return 6;
}

export function getDocumentComplianceRate(): { total: number; ok: number; pct: number } {
  // From mockDocumenti: 21 docs, count valid ones
  const total = 21;
  const ok = 14; // valido count
  return { total, ok, pct: Math.round((ok / total) * 100) };
}
