import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { mockBudgets } from "@/data/mock-analytics";

const COLORS = [
  'hsl(25, 95%, 53%)',
  'hsl(210, 70%, 50%)',
  'hsl(142, 71%, 45%)',
  'hsl(38, 92%, 50%)',
  'hsl(280, 60%, 55%)',
];

function CostiBreakdown() {
  const totals = new Map<string, number>();
  for (const budget of mockBudgets) {
    for (const item of budget.items) {
      totals.set(item.voce, (totals.get(item.voce) || 0) + item.consuntivo);
    }
  }
  const data = Array.from(totals.entries()).map(([name, value]) => ({ name, value }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Breakdown Costi per Voce</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={50}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v: number) => `€${v.toLocaleString('it-IT')}`} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function BudgetVsConsuntivo() {
  const data = mockBudgets.map(b => ({
    name: b.site_name.length > 20 ? b.site_name.slice(0, 18) + '…' : b.site_name,
    budget: b.items.reduce((s, i) => s + i.budget, 0),
    consuntivo: b.items.reduce((s, i) => s + i.consuntivo, 0),
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Budget vs Consuntivo</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis type="number" tickFormatter={v => `€${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={120} />
            <Tooltip formatter={(v: number) => `€${v.toLocaleString('it-IT')}`} />
            <Legend />
            <Bar dataKey="budget" name="Budget" fill="hsl(var(--muted))" radius={[0, 2, 2, 0]} />
            <Bar dataKey="consuntivo" name="Consuntivo" fill="hsl(25, 95%, 53%)" radius={[0, 2, 2, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function BudgetDetailTable() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Dettaglio Budget per Cantiere</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {mockBudgets.map(budget => {
            const totalBudget = budget.items.reduce((s, i) => s + i.budget, 0);
            const totalConsuntivo = budget.items.reduce((s, i) => s + i.consuntivo, 0);
            const deltaPct = ((totalConsuntivo - totalBudget) / totalBudget * 100).toFixed(1);
            const isOver = totalConsuntivo > totalBudget;

            return (
              <div key={budget.site_id}>
                <h4 className="text-sm font-semibold mb-2">{budget.site_name}</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Voce</TableHead>
                      <TableHead className="text-right">Budget</TableHead>
                      <TableHead className="text-right">Consuntivo</TableHead>
                      <TableHead className="text-right">Δ%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {budget.items.map(item => {
                      const delta = ((item.consuntivo - item.budget) / item.budget * 100).toFixed(1);
                      const over = item.consuntivo > item.budget;
                      return (
                        <TableRow key={item.voce}>
                          <TableCell className="text-sm">{item.voce}</TableCell>
                          <TableCell className="text-right text-sm">€{item.budget.toLocaleString('it-IT')}</TableCell>
                          <TableCell className="text-right text-sm">€{item.consuntivo.toLocaleString('it-IT')}</TableCell>
                          <TableCell className={`text-right text-sm font-medium ${over ? 'text-red-600' : 'text-emerald-600'}`}>
                            {over ? '+' : ''}{delta}%
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow className="font-semibold">
                      <TableCell>Totale</TableCell>
                      <TableCell className="text-right">€{totalBudget.toLocaleString('it-IT')}</TableCell>
                      <TableCell className="text-right">€{totalConsuntivo.toLocaleString('it-IT')}</TableCell>
                      <TableCell className={`text-right ${isOver ? 'text-red-600' : 'text-emerald-600'}`}>
                        {isOver ? '+' : ''}{deltaPct}%
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export function CostiAnalysis() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CostiBreakdown />
        <BudgetVsConsuntivo />
      </div>
      <BudgetDetailTable />
    </div>
  );
}
