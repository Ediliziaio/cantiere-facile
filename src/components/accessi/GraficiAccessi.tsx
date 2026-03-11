import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { mockLavoratori, mockCantieri } from "@/data/mock-data";

interface DaySummary {
  lavoratoreId: string;
  cantiereId: string;
  minutiLavorati: number | null;
}

interface Props {
  filtered: DaySummary[];
}

const COLORS = [
  "hsl(221, 83%, 53%)",  // primary blue
  "hsl(142, 71%, 45%)",  // emerald
  "hsl(38, 92%, 50%)",   // amber
  "hsl(280, 67%, 55%)",  // purple
  "hsl(0, 72%, 51%)",    // red
  "hsl(190, 80%, 42%)",  // teal
];

export default function GraficiAccessi({ filtered }: Props) {
  // Hours per worker
  const orePerLavoratore = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of filtered) {
      if (s.minutiLavorati && s.minutiLavorati > 0) {
        map.set(s.lavoratoreId, (map.get(s.lavoratoreId) ?? 0) + s.minutiLavorati);
      }
    }
    return Array.from(map.entries())
      .map(([id, min]) => {
        const lav = mockLavoratori.find((l) => l.id === id);
        return { nome: lav ? `${lav.nome} ${lav.cognome}` : id, ore: +(min / 60).toFixed(1) };
      })
      .sort((a, b) => b.ore - a.ore);
  }, [filtered]);

  // Hours per site
  const orePerCantiere = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of filtered) {
      if (s.minutiLavorati && s.minutiLavorati > 0) {
        map.set(s.cantiereId, (map.get(s.cantiereId) ?? 0) + s.minutiLavorati);
      }
    }
    return Array.from(map.entries()).map(([id, min]) => {
      const c = mockCantieri.find((c) => c.id === id);
      return { nome: c?.nome ?? id, ore: +(min / 60).toFixed(1) };
    });
  }, [filtered]);

  if (orePerLavoratore.length === 0) {
    return (
      <div className="border border-border rounded-lg p-8 text-center text-muted-foreground">
        Nessun dato per il periodo selezionato
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar chart — hours per worker */}
      <div className="border border-border rounded-lg p-4">
        <h3 className="font-heading font-semibold text-sm text-foreground mb-4">Ore per lavoratore</h3>
        <ResponsiveContainer width="100%" height={Math.max(200, orePerLavoratore.length * 40 + 40)}>
          <BarChart data={orePerLavoratore} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} unit="h" />
            <YAxis type="category" dataKey="nome" width={120} tick={{ fontSize: 11, fill: "hsl(var(--foreground))" }} />
            <Tooltip
              formatter={(value: number) => [`${value}h`, "Ore lavorate"]}
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Bar dataKey="ore" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie chart — hours per site */}
      <div className="border border-border rounded-lg p-4">
        <h3 className="font-heading font-semibold text-sm text-foreground mb-4">Distribuzione ore per cantiere</h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={orePerCantiere}
              dataKey="ore"
              nameKey="nome"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ nome, ore }) => `${nome.substring(0, 15)}… ${ore}h`}
              labelLine={{ stroke: "hsl(var(--muted-foreground))" }}
            >
              {orePerCantiere.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`${value}h`, "Ore"]}
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Legend
              formatter={(value) => <span style={{ color: "hsl(var(--foreground))", fontSize: 12 }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
