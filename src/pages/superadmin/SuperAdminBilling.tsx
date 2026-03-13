import { useState, useMemo } from "react";
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
import { usePagination } from "@/hooks/usePagination";
import { useSortable } from "@/hooks/useSortable";
import { PaginationControls } from "@/components/superadmin/PaginationControls";
import { SortableHeader } from "@/components/superadmin/SortableHeader";

const invoiceStatusMap: Record<MockInvoice["stato"], { label: string; variant: "default" | "destructive" | "secondary" | "outline" }> = {
  pagata: { label: "Pagata", variant: "default" },
  in_scadenza: { label: "In scadenza", variant: "secondary" },
  scaduta: { label: "Scaduta", variant: "destructive" },
  bozza: { label: "Bozza", variant: "outline" },
};

const statusWeight: Record<string, number> = { bozza: 0, pagata: 1, in_scadenza: 2, scaduta: 3 };

type BillingSortKey = "totale" | "data_emissione" | "stato";

const comparators: Record<BillingSortKey, (a: MockInvoice, b: MockInvoice) => number> = {
  totale: (a, b) => a.totale - b.totale,
  data_emissione: (a, b) => new Date(a.data_emissione).getTime() - new Date(b.data_emissione).getTime(),
  stato: (a, b) => (statusWeight[a.stato] || 0) - (statusWeight[b.stato] || 0),
};

export default function SuperAdminBilling() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const m = mockBillingMetrics;

  const filteredInvoices = useMemo(() =>
    statusFilter === "all"
      ? mockInvoices
      : mockInvoices.filter((i) => i.stato === statusFilter),
    [statusFilter]);

  const { sortedItems, sortConfig, toggleSort } = useSortable(filteredInvoices, comparators);
  const pagination = usePagination(sortedItems, 10);

  const kpis = [
    { label: "MRR", value: `€${m.mrr.toLocaleString("it-IT")}`, icon: DollarSign, trend: "+5.7%", up: true },
    { label: "ARR", value: `€${m.arr.toLocaleString("it-IT")}`, icon: TrendingUp, trend: "+12%", up: true },
    { label: "Churn Rate", value: `${m.churn_rate}%`, icon: TrendingDown, trend: "-0.3%", up: false },
    { label: "LTV medio", value: `€${m.ltv.toLocaleString("it-IT")}`, icon: Users },
    { label: "Outstanding", value: `€${m.outstanding_revenue.toFixed(2)}`, icon: AlertTriangle, highlight: m.outstanding_revenue > 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Billing & Revenue</h1>
          <p className="text-sm text-muted-foreground">Monitora ricavi, fatture e distribuzione piani</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => toast({ title: "Fattura manuale", description: "Creazione fattura manuale... (simulato)" })}>
            <FileText className="h-4 w-4 mr-1" /> Fattura manuale
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast({ title: "Pagamento manuale", description: "Registrazione pagamento... (simulato)" })}>
            <CreditCard className="h-4 w-4 mr-1" /> Registra pagamento
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className={kpi.highlight ? "border-destructive/50" : ""}>
            <CardContent className="pt-4 pb-3 px-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground font-medium">{kpi.label}</span>
                <kpi.icon className={`h-4 w-4 ${kpi.highlight ? "text-destructive" : "text-muted-foreground"}`} />
              </div>
              <p className="text-xl font-bold text-foreground">{kpi.value}</p>
              {kpi.trend && (
                <p className={`text-xs mt-1 ${kpi.up ? "text-green-500" : "text-destructive"}`}>{kpi.trend} vs mese prec.</p>
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

      {/* Invoices */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
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
          {/* Desktop table */}
          <div className="hidden md:block">
            <Table>
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">N° Fattura</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Azienda</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Descrizione</th>
                  <SortableHeader label="Data emissione" sortKey="data_emissione" sortConfig={sortConfig} onToggle={toggleSort} />
                  <SortableHeader label="Totale" sortKey="totale" sortConfig={sortConfig} onToggle={toggleSort} className="text-right" />
                  <SortableHeader label="Stato" sortKey="stato" sortConfig={sortConfig} onToggle={toggleSort} />
                  <th className="w-10 px-4 py-3"></th>
                </tr>
              </thead>
              <TableBody>
                {pagination.paginatedItems.map((inv) => {
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
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {pagination.paginatedItems.map((inv) => {
              const st = invoiceStatusMap[inv.stato];
              return (
                <div key={inv.id} className="border border-border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-foreground">{inv.tenant_name}</span>
                    <Badge variant={st.variant}>{st.label}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                    <div>N°: <span className="font-mono text-foreground">{inv.numero_fattura}</span></div>
                    <div>Data: <span className="text-foreground">{new Date(inv.data_emissione).toLocaleDateString("it-IT")}</span></div>
                    <div className="col-span-2">{inv.descrizione}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">€{inv.totale.toFixed(2)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() => toast({ title: "Rimborso", description: `Rimborso fattura ${inv.numero_fattura}... (simulato)` })}
                    >
                      <Receipt className="h-3.5 w-3.5 mr-1" /> Rimborso
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4">
            <PaginationControls {...pagination} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
