import { Building2, Users, FileText, AlertTriangle, TrendingUp, Clock, HardDrive, CreditCard, Plus, ScrollText, Download } from "lucide-react";
import { platformStats, registrazioniRecenti, mockTenantsAll, mockSuperAdminLog } from "@/data/mock-superadmin";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Link } from "react-router-dom";

const stats = [
  { label: "Aziende attive", value: platformStats.aziendeAttive, icon: Building2, to: "/superadmin/aziende" },
  { label: "Trial attivi", value: platformStats.trialAttivi, icon: Clock, accent: true, to: "/superadmin/aziende" },
  { label: "Aziende sospese", value: platformStats.aziendeSospese, icon: AlertTriangle, danger: true, to: "/superadmin/aziende" },
  { label: "Cantieri aperti", value: platformStats.cantieriAperti, icon: Building2, to: "/superadmin/aziende" },
  { label: "Documenti oggi", value: platformStats.documentiCaricatiOggi, icon: FileText, to: "/superadmin/analytics" },
  { label: "MRR", value: `€${platformStats.mrr}`, icon: TrendingUp, to: "/superadmin/billing" },
];

const storagePercent = Math.round((platformStats.storageUsedGb / platformStats.storageTotalGb) * 100);

const healthSorted = [...mockTenantsAll].sort((a, b) => a.health_score - b.health_score);

const recentLogs = [...mockSuperAdminLog].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);

const quickActions = [
  { label: "Nuova Azienda", icon: Plus, to: "/superadmin/aziende/nuova" },
  { label: "Vedi Log Audit", icon: ScrollText, to: "/superadmin/audit-log" },
  { label: "Esporta Report", icon: Download, to: "/superadmin/analytics" },
];

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-2xl text-foreground">Dashboard Piattaforma</h1>
        <p className="text-sm text-muted-foreground mt-1">Panoramica generale della piattaforma</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s) => (
          <Link key={s.label} to={s.to}>
            <Card className="hover:border-primary/40 transition-colors cursor-pointer h-full">
              <CardContent className="pt-4 pb-3 px-4">
                <div className="flex items-center justify-between mb-2">
                  <s.icon className={`h-4 w-4 ${s.danger ? "text-destructive" : s.accent ? "text-yellow-500" : "text-muted-foreground"}`} />
                </div>
                <p className="font-heading font-bold text-2xl text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        {quickActions.map((a) => (
          <Button key={a.label} variant="outline" size="sm" asChild>
            <Link to={a.to}>
              <a.icon className="h-4 w-4 mr-1.5" /> {a.label}
            </Link>
          </Button>
        ))}
      </div>

      {/* Storage + Pagamenti */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm">Storage Piattaforma</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-end gap-2">
              <span className="font-bold text-2xl text-foreground">{platformStats.storageUsedGb}</span>
              <span className="text-sm text-muted-foreground mb-0.5">/ {platformStats.storageTotalGb} GB</span>
            </div>
            <Progress value={storagePercent} className="h-2" />
            <p className="text-xs text-muted-foreground">{storagePercent}% utilizzato</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm">Pagamenti in scadenza</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="font-bold text-2xl text-foreground mb-2">{platformStats.aziendePagamentoScadenza}</p>
            {mockTenantsAll.filter(t => t.stato === "sospeso").map(t => (
              <Link key={t.id} to={`/superadmin/aziende/${t.id}`} className="flex items-center justify-between text-sm py-1.5 border-b border-border last:border-0 hover:bg-muted/20 rounded px-1 -mx-1 transition-colors">
                <span className="text-foreground">{t.nome_azienda}</span>
                <Badge variant="destructive" className="text-[10px]">scaduto</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Chart + Health */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Registrazioni (ultimi 6 mesi)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={registrazioniRecenti}>
                  <XAxis dataKey="mese" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Health Score Aziende</CardTitle>
            <Link to="/superadmin/aziende" className="text-xs text-primary hover:underline">Vedi tutti →</Link>
          </CardHeader>
          <CardContent className="space-y-2">
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
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm">Attività recenti</CardTitle>
          <Link to="/superadmin/audit-log" className="text-xs text-primary hover:underline">Vedi tutti →</Link>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {recentLogs.map((log) => (
            <div key={log.id} className="flex items-center justify-between py-3 text-sm first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-[10px]">{log.azione.replace(/_/g, " ")}</Badge>
                <span className="text-foreground">{log.tenant_nome}</span>
              </div>
              <span className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleDateString("it-IT")}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
