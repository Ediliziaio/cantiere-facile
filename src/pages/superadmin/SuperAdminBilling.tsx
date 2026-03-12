import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, DollarSign, Users, AlertTriangle, Receipt, FileText, CreditCard } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import {
  mockBillingMetrics, mockRevenueTrend, mockPlanDistribution, mockInvoices, type MockInvoice,
} from "@/data/mock-billing";

const invoiceStatusMap: Record<MockInvoice["stato"], { label: string; variant: "default" | "destructive" | "secondary" | "outline" }> = {
  pagata: { label: "Pagata", variant: "default" },
  in_scadenza: { label: "In scadenza", variant: "secondary" },
  scaduta: { label: "Scaduta", variant: "destructive" },
  bozza: { label: "Bozza", variant: "outline" },
};

export default function SuperAdminBilling() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const m = mockBillingMetrics;

  const filteredInvoices = statusFilter === "all"
    ? mockInvoices
    : mockInvoices.filter((i) => i.stato === statusFilter);

  const kpis = [
    { label: "MRR", value: `€${m.mrr.toLocaleString("it-IT")}`, icon: DollarSign, trend: "+5.7%", up: true },
    { label: "ARR", value: `€${m.arr.toLocaleString("it-IT")}`, icon: TrendingUp, trend: "+12%", up: true },
    { label: "Churn Rate", value: `${m.churn_rate}%`, icon: TrendingDown, trend: "-0.3%", up: false },
    { label: "LTV medio", value: `€${m.ltv.toLocaleString("it-IT")}`, icon: Users },
    { label: "Outstanding", value: `€${m.outstanding_revenue.toFixed(2)}`, icon: AlertTriangle, highlight: m.outstanding_revenue > 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Billing & Revenue</h1>
          <p className="text-sm text-muted-foreground">Dashboard finanziaria della piattaforma</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast({ title: "Fattura manuale", description: "Creazione fattura manuale... (simulato)" })}
          >
            <FileText className="h-4 w-4 mr-1" /> Fattura manuale
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast({ title: "Pagamento manuale", description: "Registrazione pagamento... (simulato)" })}
          >
            <CreditCard className="h-4 w-4 mr-1" /> Registra pagamento
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className={kpi.highlight ? "border-destructive/50" : ""}>
            <CardContent className="pt-4 pb-3 px-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground font-medium">{kpi.label}</span>
                <kpi.icon className={`h-4 w-4 ${kpi.highlight ? "text-destructive" : "text-muted-foreground"}`} />
              </div>
              <p className="text-xl font-bold text-foreground">{kpi.value}</p>
              {kpi.trend && (
                <p className={`text-xs mt-1 ${kpi.up ? "text-success" : "text-destructive"}`}>{kpi.trend} vs mese prec.</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue trend (12 mesi)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockRevenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="mese" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                    formatter={(val: number) => [`€${val}`, "Revenue"]}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Distribuzione piani</CardTitle>
            <CardDescription>{m.total_customers} aziende totali, {m.paying_customers} paganti</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={mockPlanDistribution} dataKey="count" nameKey="piano" cx="50%" cy="50%" outerRadius={80} label={({ piano, count }) => `${piano}: ${count}`}>
                    {mockPlanDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base">Fatture recenti</CardTitle>
            <CardDescription>Tutte le fatture cross-tenant</CardDescription>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Filtra stato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti</SelectItem>
              <SelectItem value="pagata">Pagate</SelectItem>
              <SelectItem value="in_scadenza">In scadenza</SelectItem>
              <SelectItem value="scaduta">Scadute</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Fattura</TableHead>
                <TableHead>Azienda</TableHead>
                <TableHead>Descrizione</TableHead>
                <TableHead>Data emissione</TableHead>
                <TableHead className="text-right">Totale</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((inv) => {
                const st = invoiceStatusMap[inv.stato];
                return (
                  <TableRow key={inv.id}>
                    <TableCell className="font-mono text-xs">{inv.numero_fattura}</TableCell>
                    <TableCell className="font-medium text-sm">{inv.tenant_name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{inv.descrizione}</TableCell>
                    <TableCell className="text-sm">{new Date(inv.data_emissione).toLocaleDateString("it-IT")}</TableCell>
                    <TableCell className="text-right font-medium">€{inv.totale.toFixed(2)}</TableCell>
                    <TableCell><Badge variant={st.variant}>{st.label}</Badge></TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toast({ title: "Rimborso", description: `Rimborso fattura ${inv.numero_fattura}... (simulato)` })}
                      >
                        <Receipt className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
