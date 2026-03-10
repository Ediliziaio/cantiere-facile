import { Building2, Users, FileText, AlertTriangle, TrendingUp, Clock } from "lucide-react";
import { platformStats, registrazioniRecenti } from "@/data/mock-superadmin";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const stats = [
  { label: "Aziende attive", value: platformStats.aziendeAttive, icon: Building2 },
  { label: "Trial attivi", value: platformStats.trialAttivi, icon: Clock, accent: true },
  { label: "Cantieri aperti", value: platformStats.cantieriAperti, icon: Building2 },
  { label: "Documenti caricati oggi", value: platformStats.documentiCaricatiOggi, icon: FileText },
  { label: "Aziende con doc scaduti", value: platformStats.aziendeConDocScaduti, icon: AlertTriangle, danger: true },
  { label: "MRR (€)", value: `€${platformStats.mrr}`, icon: TrendingUp },
];

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading font-bold text-2xl text-foreground">Dashboard Piattaforma</h1>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="border border-border bg-card rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <s.icon className={`h-4 w-4 ${s.danger ? "text-destructive" : s.accent ? "text-warning" : "text-muted-foreground"}`} />
            </div>
            <p className="font-heading font-bold text-2xl text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <section>
        <h2 className="font-heading font-semibold text-lg text-foreground mb-3">Nuove registrazioni (ultimi 6 mesi)</h2>
        <div className="border border-border rounded-lg p-4 bg-card h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={registrazioniRecenti}>
              <XAxis dataKey="mese" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(239, 84%, 67%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
