import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart,
} from "recharts";
import {
  Activity, AlertTriangle, ArrowUpRight, ArrowDownRight, CheckCircle2,
  Mail, Phone, Server, TrendingUp, Users, Zap, Shield, Database, Clock,
} from "lucide-react";
import { toast } from "sonner";
import {
  cohortData, dailyActiveSites, activationFunnel, mrrMovement,
  churnRiskTenants, expansionOpportunities, geoRegionData,
  sectorDistribution, systemHealth, analyticsKpis,
} from "@/data/mock-superadmin-analytics";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

function getRetentionColor(value: number): string {
  if (value >= 80) return "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400";
  if (value >= 60) return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400";
  if (value >= 40) return "bg-orange-500/20 text-orange-700 dark:text-orange-400";
  return "bg-red-500/20 text-red-700 dark:text-red-400";
}

function getRiskColor(score: number) {
  if (score >= 70) return "destructive";
  if (score >= 40) return "secondary";
  return "outline";
}

function getHealthStatus(value: number, thresholds: { good: number; warn: number }, invert = false) {
  const isGood = invert ? value <= thresholds.good : value >= thresholds.good;
  const isWarn = invert ? value <= thresholds.warn : value >= thresholds.warn;
  if (isGood) return { color: "text-emerald-600", icon: CheckCircle2, label: "OK" };
  if (isWarn) return { color: "text-yellow-600", icon: AlertTriangle, label: "Attenzione" };
  return { color: "text-red-600", icon: AlertTriangle, label: "Critico" };
}

// --- TAB: BUSINESS ---
function BusinessTab() {
  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Daily Active Sites (media)</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              {analyticsKpis.dailyActiveSitesAvg}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Oggi: {analyticsKpis.dailyActiveSitesToday} cantieri attivi
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>ARPU</CardDescription>
            <CardTitle className="text-2xl">€{analyticsKpis.arpu}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {analyticsKpis.payingTenants} tenant paganti su {analyticsKpis.totalTenants}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Net Revenue Retention</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              {analyticsKpis.nrr}%
              <ArrowUpRight className="h-4 w-4 text-emerald-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">&gt;100% = crescita da clienti esistenti</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Activation Rate</CardDescription>
            <CardTitle className="text-2xl">
              {activationFunnel[activationFunnel.length - 1].percentage}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {activationFunnel[activationFunnel.length - 1].count} attivi su {activationFunnel[0].count} registrati
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Active Sites Sparkline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daily Active Sites — ultimi 30 giorni</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={dailyActiveSites}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/0.15)" name="Cantieri attivi" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activation Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Funnel di Attivazione</CardTitle>
            <CardDescription>Dal signup al tenant attivo a 30gg</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={activationFunnel} layout="vertical" barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="label" type="category" width={120} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => v} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="Tenant" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* MRR Movement */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">MRR Movement</CardTitle>
            <CardDescription>Nuovi, Expansion, Contraction, Churn (€/mese)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={mrrMovement}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="new" fill="hsl(var(--chart-2))" name="Nuovi" stackId="a" />
                <Bar dataKey="expansion" fill="hsl(var(--primary))" name="Expansion" stackId="a" />
                <Bar dataKey="contraction" fill="hsl(var(--chart-4))" name="Contraction" stackId="a" />
                <Bar dataKey="churn" fill="hsl(var(--destructive))" name="Churn" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Cohort Retention Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cohort Retention</CardTitle>
          <CardDescription>% tenant attivi per coorte mensile</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Coorte</TableHead>
                <TableHead className="text-center w-[60px]">Tenant</TableHead>
                {[0, 1, 2, 3, 4, 5].map((m) => (
                  <TableHead key={m} className="text-center w-[70px]">Mese {m}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {cohortData.map((row) => (
                <TableRow key={row.cohort}>
                  <TableCell className="font-medium text-xs">{row.cohort}</TableCell>
                  <TableCell className="text-center text-xs">{row.totalTenants}</TableCell>
                  {[0, 1, 2, 3, 4, 5].map((m) => (
                    <TableCell key={m} className="text-center p-1">
                      {row.retention[m] !== undefined ? (
                        <span className={`inline-block w-full rounded px-2 py-1 text-xs font-medium ${getRetentionColor(row.retention[m])}`}>
                          {row.retention[m]}%
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// --- TAB: CHURN & GROWTH ---
function ChurnGrowthTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Churn Risk — Tenant a Rischio
          </CardTitle>
          <CardDescription>Ordinati per risk score decrescente</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Azienda</TableHead>
                <TableHead>Piano</TableHead>
                <TableHead className="text-center">Risk Score</TableHead>
                <TableHead className="text-center">Ultimo Login</TableHead>
                <TableHead className="text-center">Usage Trend</TableHead>
                <TableHead className="text-center">Pag. Falliti</TableHead>
                <TableHead>Azione Suggerita</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {churnRiskTenants.map((t) => (
                <TableRow key={t.tenantId}>
                  <TableCell className="font-medium text-sm">{t.companyName}</TableCell>
                  <TableCell><Badge variant="outline">{t.plan}</Badge></TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getRiskColor(t.riskScore) as any}>{t.riskScore}</Badge>
                  </TableCell>
                  <TableCell className="text-center text-sm">{t.daysSinceLastLogin}gg fa</TableCell>
                  <TableCell className="text-center">
                    <span className={`text-sm font-medium flex items-center justify-center gap-1 ${t.usageTrend < -30 ? "text-destructive" : t.usageTrend < 0 ? "text-yellow-600" : "text-emerald-600"}`}>
                      {t.usageTrend < 0 ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                      {t.usageTrend}%
                    </span>
                  </TableCell>
                  <TableCell className="text-center text-sm">{t.paymentFailures}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[200px]">{t.suggestedAction}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => toast.info(`Email inviata a ${t.companyName}`)}>
                        <Mail className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => toast.info(`Chiamata pianificata per ${t.companyName}`)}>
                        <Phone className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Opportunità di Espansione
          </CardTitle>
          <CardDescription>Tenant vicini al limite del piano attuale</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expansionOpportunities.map((o) => (
              <div key={o.tenantId} className="flex items-center gap-4 p-3 rounded-lg border border-border">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{o.companyName}</span>
                    <Badge variant="outline" className="text-xs">{o.plan}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {o.metric}: {o.current}/{o.limit} ({o.usagePercent}%)
                  </p>
                  <Progress value={o.usagePercent} className="h-2" />
                </div>
                <Button size="sm" onClick={() => toast.success(`Proposta upgrade "${o.suggestedUpgrade}" inviata a ${o.companyName}`)}>
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  Upgrade
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- TAB: GEO & MARKET ---
function GeoMarketTab() {
  const maxTenants = geoRegionData[0].tenantCount;
  const top5 = geoRegionData.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribuzione per Regione</CardTitle>
            <CardDescription>Tenant e cantieri per regione italiana</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {geoRegionData.map((r) => (
                <div key={r.region} className="flex items-center gap-3">
                  <span className="text-xs w-[140px] truncate font-medium">{r.region}</span>
                  <div className="flex-1">
                    <div
                      className="h-5 rounded bg-primary/20 flex items-center"
                      style={{ width: `${(r.tenantCount / maxTenants) * 100}%`, minWidth: 20 }}
                    >
                      <span className="text-[10px] font-medium px-1.5 text-primary">{r.tenantCount}</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground w-[60px] text-right">{r.cantieriCount} cant.</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top 5 Regioni</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {top5.map((r, i) => (
                  <div key={r.region} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium">{r.region}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold">{r.tenantCount} aziende</span>
                      <span className="text-xs text-muted-foreground ml-2">({r.cantieriCount} cantieri)</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Distribuzione per Settore</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={sectorDistribution}
                    dataKey="count"
                    nameKey="sector"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ sector, percentage }) => `${sector.split(" ")[0]} ${percentage}%`}
                    labelLine={false}
                  >
                    {sectorDistribution.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// --- TAB: SYSTEM HEALTH ---
function SystemHealthTab() {
  const h = systemHealth;
  const latencyStatus = getHealthStatus(h.apiLatency.p95, { good: 200, warn: 500 }, true);
  const errorStatus = getHealthStatus(h.errorRate, { good: 0.5, warn: 2 }, true);
  const uptimeStatus = getHealthStatus(h.uptime, { good: 99.9, warn: 99.5 });
  const dbStatus = getHealthStatus(
    (h.dbConnections.active / h.dbConnections.max) * 100,
    { good: 60, warn: 80 },
    true
  );

  const severityColor = {
    low: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
    medium: "bg-orange-500/10 text-orange-700 border-orange-500/20",
    high: "bg-red-500/10 text-red-700 border-red-500/20",
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Zap className="h-3 w-3" /> API Latency (p95)
            </CardDescription>
            <CardTitle className={`text-2xl ${latencyStatus.color}`}>
              {h.apiLatency.p95}ms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">p50: {h.apiLatency.p50}ms · p99: {h.apiLatency.p99}ms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" /> Error Rate
            </CardDescription>
            <CardTitle className={`text-2xl ${errorStatus.color}`}>
              {h.errorRate}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Soglia alert: &gt;1%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Shield className="h-3 w-3" /> Uptime
            </CardDescription>
            <CardTitle className={`text-2xl ${uptimeStatus.color}`}>
              {h.uptime}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Ultimi 30 giorni</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Database className="h-3 w-3" /> DB Connections
            </CardDescription>
            <CardTitle className={`text-2xl ${dbStatus.color}`}>
              {h.dbConnections.active}/{h.dbConnections.max}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={(h.dbConnections.active / h.dbConnections.max) * 100} className="h-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Server className="h-4 w-4" /> Storage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{h.storageUsedGb} GB usati</span>
                <span className="text-muted-foreground">{h.storageLimitGb} GB totali</span>
              </div>
              <Progress value={(h.storageUsedGb / h.storageLimitGb) * 100} className="h-3" />
              <p className="text-xs text-muted-foreground">
                {((h.storageUsedGb / h.storageLimitGb) * 100).toFixed(1)}% utilizzato
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className={`border ${severityColor[h.lastIncident.severity]}`}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" /> Ultimo Incidente
            </CardTitle>
            <CardDescription>{h.lastIncident.date} · Durata: {h.lastIncident.duration}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{h.lastIncident.description}</p>
            <Badge variant="outline" className="mt-2 capitalize">{h.lastIncident.severity}</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- MAIN PAGE ---
export default function SuperAdminAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Analytics Avanzate</h1>
        <p className="text-muted-foreground text-sm">Metriche business, churn risk, geo-analytics e system health</p>
      </div>

      <Tabs defaultValue="business">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="churn">Churn & Growth</TabsTrigger>
          <TabsTrigger value="geo">Geo & Market</TabsTrigger>
          <TabsTrigger value="health">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="business"><BusinessTab /></TabsContent>
        <TabsContent value="churn"><ChurnGrowthTab /></TabsContent>
        <TabsContent value="geo"><GeoMarketTab /></TabsContent>
        <TabsContent value="health"><SystemHealthTab /></TabsContent>
      </Tabs>
    </div>
  );
}
