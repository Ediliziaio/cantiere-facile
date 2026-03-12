import { Building2, Users, FileText, AlertTriangle, TrendingUp, Clock, HardDrive, CreditCard } from "lucide-react";
import { platformStats, registrazioniRecenti, mockTenantsAll, mockSuperAdminLog } from "@/data/mock-superadmin";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Link } from "react-router-dom";

const stats = [
  { label: "Aziende attive", value: platformStats.aziendeAttive, icon: Building2 },
  { label: "Trial attivi", value: platformStats.trialAttivi, icon: Clock, accent: true },
  { label: "Aziende sospese", value: platformStats.aziendeSospese, icon: AlertTriangle, danger: true },
  { label: "Cantieri aperti", value: platformStats.cantieriAperti, icon: Building2 },
  { label: "Documenti oggi", value: platformStats.documentiCaricatiOggi, icon: FileText },
  { label: "MRR", value: `€${platformStats.mrr}`, icon: TrendingUp },
];

const storagePercent = Math.round((platformStats.storageUsedGb / platformStats.storageTotalGb) * 100);

const healthSorted = [...mockTenantsAll].sort((a, b) => a.health_score - b.health_score);

const recentLogs = [...mockSuperAdminLog].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading font-bold text-2xl text-foreground">Dashboard Piattaforma</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="border border-border bg-card rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <s.icon className={`h-4 w-4 ${s.danger ? "text-destructive" : s.accent ? "text-yellow-500" : "text-muted-foreground"}`} />
            </div>
            <p className="font-heading font-bold text-2xl text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Storage + Pagamenti */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-heading font-semibold text-sm text-foreground">Storage Piattaforma</h2>
          </div>
          <div className="flex items-end gap-2">
            <span className="font-bold text-2xl text-foreground">{platformStats.storageUsedGb}</span>
            <span className="text-sm text-muted-foreground mb-0.5">/ {platformStats.storageTotalGb} GB</span>
          </div>
          <Progress value={storagePercent} className="h-2" />
          <p className="text-xs text-muted-foreground">{storagePercent}% utilizzato</p>
        </div>

        <div className="border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-heading font-semibold text-sm text-foreground">Pagamenti in scadenza</h2>
          </div>
          <p className="font-bold text-2xl text-foreground">{platformStats.aziendePagamentoScadenza}</p>
          {mockTenantsAll.filter(t => t.stato === "sospeso").map(t => (
            <Link key={t.id} to={`/superadmin/aziende/${t.id}`} className="flex items-center justify-between text-sm py-1 border-b border-border last:border-0 hover:bg-muted/20 rounded px-1 -mx-1 transition-colors">
              <span className="text-foreground">{t.nome_azienda}</span>
              <Badge variant="destructive" className="text-[10px]">scaduto</Badge>
            </Link>
          ))}
        </div>
      </div>

      {/* Chart + Health */}
      <div className="grid gap-4 md:grid-cols-2">
        <section>
          <h2 className="font-heading font-semibold text-sm text-foreground mb-3">Registrazioni (ultimi 6 mesi)</h2>
          <div className="border border-border rounded-lg p-4 bg-card h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={registrazioniRecenti}>
                <XAxis dataKey="mese" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section>
          <h2 className="font-heading font-semibold text-sm text-foreground mb-3">Health Score Aziende</h2>
          <div className="border border-border rounded-lg p-4 space-y-2">
            {healthSorted.map((t) => (
              <Link key={t.id} to={`/superadmin/aziende/${t.id}`} className="flex items-center justify-between py-1.5 border-b border-border last:border-0 hover:bg-muted/20 rounded px-1 -mx-1 transition-colors">
                <span className="text-sm font-medium text-foreground">{t.nome_azienda}</span>
                <div className="flex items-center gap-2">
                  <Progress value={t.health_score} className="w-16 h-1.5" />
                  <span className={`text-xs font-bold ${t.health_score >= 70 ? "text-green-500" : t.health_score >= 40 ? "text-yellow-500" : "text-destructive"}`}>
                    {t.health_score}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Recent activity */}
      <section>
        <h2 className="font-heading font-semibold text-sm text-foreground mb-3">Attività recenti</h2>
        <div className="border border-border rounded-lg divide-y divide-border">
          {recentLogs.map((log) => (
            <div key={log.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-[10px]">{log.azione.replace(/_/g, " ")}</Badge>
                <span className="text-foreground">{log.tenant_nome}</span>
              </div>
              <span className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleDateString("it-IT")}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
