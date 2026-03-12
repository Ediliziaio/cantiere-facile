import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, ShieldCheck, Euro, FileCheck, HardHat } from "lucide-react";
import {
  getSnapshotsByRange,
  getAverageCompletion,
  getDaysSinceLastAccident,
  getDocumentComplianceRate,
} from "@/data/mock-analytics";

interface KPICardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  trend?: { value: number; label: string };
  color: string;
}

function KPICard({ title, value, subtitle, icon: Icon, trend, color }: KPICardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {trend && (
          <div className="mt-2 flex items-center gap-1">
            <TrendingUp className={`h-3 w-3 ${trend.value >= 0 ? 'text-emerald-600' : 'text-red-500 rotate-180'}`} />
            <span className={`text-xs font-medium ${trend.value >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {trend.value >= 0 ? '+' : ''}{trend.value}%
            </span>
            <span className="text-xs text-muted-foreground">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function KPICards({ days }: { days: number }) {
  const snapshots = getSnapshotsByRange(days);
  const todaySnapshots = getSnapshotsByRange(1);
  const workersToday = todaySnapshots.reduce((s, snap) => s + snap.workers_count, 0);
  const avgCompletion = getAverageCompletion();
  const daysSinceAccident = getDaysSinceLastAccident();
  const docCompliance = getDocumentComplianceRate();

  const totalLaborCost = snapshots.reduce((s, snap) => s + snap.costs_labor, 0);
  const avgDailyCost = snapshots.length > 0 ? Math.round(totalLaborCost / (days || 1)) : 0;

  const avgSafety = snapshots.length > 0
    ? Math.round(snapshots.reduce((s, snap) => s + snap.safety_score, 0) / snapshots.length)
    : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
      <KPICard
        title="Operai Presenti Oggi"
        value={String(workersToday)}
        subtitle="su 2 cantieri attivi"
        icon={Users}
        trend={{ value: 8, label: "vs ieri" }}
        color="bg-primary/10 text-primary"
      />
      <KPICard
        title="Avanzamento Lavori"
        value={`${avgCompletion}%`}
        subtitle="media tutti i cantieri"
        icon={HardHat}
        trend={{ value: 5, label: "vs mese scorso" }}
        color="bg-blue-100 text-blue-700"
      />
      <KPICard
        title="Giorni Senza Incidenti"
        value={String(daysSinceAccident)}
        subtitle={`Safety score: ${avgSafety}/100`}
        icon={ShieldCheck}
        color="bg-emerald-100 text-emerald-700"
      />
      <KPICard
        title="Costo Medio Giornaliero"
        value={`€${avgDailyCost.toLocaleString('it-IT')}`}
        subtitle="manodopera"
        icon={Euro}
        trend={{ value: -3, label: "vs periodo prec." }}
        color="bg-amber-100 text-amber-700"
      />
      <KPICard
        title="Documenti Conformi"
        value={`${docCompliance.pct}%`}
        subtitle={`${docCompliance.ok}/${docCompliance.total} in regola`}
        icon={FileCheck}
        color={`${docCompliance.pct >= 90 ? 'bg-emerald-100 text-emerald-700' : docCompliance.pct >= 70 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}
      />
    </div>
  );
}
