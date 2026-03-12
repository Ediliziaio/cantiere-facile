import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { getSnapshotsByRange, forecastSpesa, mockBudgets } from "@/data/mock-analytics";
import { format, parseISO } from "date-fns";
import { it } from "date-fns/locale";

function formatDate(dateStr: string) {
  return format(parseISO(dateStr), 'dd MMM', { locale: it });
}

function PresenzeTrend({ days }: { days: number }) {
  const snapshots = getSnapshotsByRange(days);
  const dateMap = new Map<string, { date: string; c1: number; c2: number }>();
  for (const s of snapshots) {
    if (!dateMap.has(s.date)) dateMap.set(s.date, { date: s.date, c1: 0, c2: 0 });
    const entry = dateMap.get(s.date)!;
    if (s.site_id === 'c1') entry.c1 = s.workers_count;
    if (s.site_id === 'c2') entry.c2 = s.workers_count;
  }
  const data = Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Presenze Giornaliere</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11 }} className="text-muted-foreground" />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip labelFormatter={formatDate} />
            <Legend />
            <Area type="monotone" dataKey="c1" name="Via Roma 12" stackId="1" fill="hsl(25, 95%, 53%)" fillOpacity={0.3} stroke="hsl(25, 95%, 53%)" />
            <Area type="monotone" dataKey="c2" name="Palazzina BG" stackId="1" fill="hsl(210, 70%, 50%)" fillOpacity={0.3} stroke="hsl(210, 70%, 50%)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function CostiTrend({ days }: { days: number }) {
  const snapshots = getSnapshotsByRange(days);
  const dateMap = new Map<string, { date: string; manodopera: number; materiali: number }>();
  for (const s of snapshots) {
    if (!dateMap.has(s.date)) dateMap.set(s.date, { date: s.date, manodopera: 0, materiali: 0 });
    const entry = dateMap.get(s.date)!;
    entry.manodopera += s.costs_labor;
    entry.materiali += s.costs_materials;
  }
  const data = Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Costi Giornalieri</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `€${(v / 1000).toFixed(0)}k`} />
            <Tooltip labelFormatter={formatDate} formatter={(v: number) => [`€${v.toLocaleString('it-IT')}`, '']} />
            <Legend />
            <Bar dataKey="manodopera" name="Manodopera" fill="hsl(25, 95%, 53%)" radius={[2, 2, 0, 0]} />
            <Bar dataKey="materiali" name="Materiali" fill="hsl(210, 70%, 50%)" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function ForecastChart() {
  const historical = getSnapshotsByRange(30);
  const dateMap = new Map<string, number>();
  let cumulative = 0;
  for (const s of historical.sort((a, b) => a.date.localeCompare(b.date))) {
    cumulative += s.costs_labor + s.costs_materials;
    dateMap.set(s.date, cumulative);
  }
  const histData = Array.from(dateMap.entries()).map(([date, total]) => ({
    date, actual: total, projected: null as number | null,
  }));

  const forecast = forecastSpesa('c1', 30).concat(forecastSpesa('c2', 30));
  const forecastMap = new Map<string, number>();
  for (const f of forecast) {
    forecastMap.set(f.date, (forecastMap.get(f.date) || 0) + f.projected);
  }
  const forecastData = Array.from(forecastMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, projected]) => ({ date, actual: null as number | null, projected }));

  const lastActual = histData[histData.length - 1];
  if (lastActual && forecastData.length > 0) {
    forecastData[0].actual = lastActual.actual;
  }

  const data = [...histData, ...forecastData];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Proiezione Spesa (30gg)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `€${(v / 1000).toFixed(0)}k`} />
            <Tooltip labelFormatter={formatDate} formatter={(v: number) => [`€${v?.toLocaleString('it-IT') || '-'}`, '']} />
            <Legend />
            <Line type="monotone" dataKey="actual" name="Consuntivo" stroke="hsl(25, 95%, 53%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="projected" name="Proiezione" stroke="hsl(25, 95%, 53%)" strokeWidth={2} strokeDasharray="6 3" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function SafetyTrend({ days }: { days: number }) {
  const snapshots = getSnapshotsByRange(days);
  const dateMap = new Map<string, { date: string; score: number; count: number }>();
  for (const s of snapshots) {
    if (!dateMap.has(s.date)) dateMap.set(s.date, { date: s.date, score: 0, count: 0 });
    const entry = dateMap.get(s.date)!;
    entry.score += s.safety_score;
    entry.count += 1;
  }
  const data = Array.from(dateMap.values())
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(d => ({ date: d.date, safety_score: Math.round(d.score / d.count) }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Safety Score Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11 }} />
            <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} />
            <Tooltip labelFormatter={formatDate} />
            <Line type="monotone" dataKey="safety_score" name="Safety Score" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function TrendCharts({ days }: { days: number }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <PresenzeTrend days={days} />
      <CostiTrend days={days} />
      <ForecastChart />
      <SafetyTrend days={days} />
    </div>
  );
}
