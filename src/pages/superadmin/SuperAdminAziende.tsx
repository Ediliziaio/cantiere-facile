import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, LogIn, Eye, Plus, Building2, Clock, AlertTriangle, CheckCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockTenantsAll } from "@/data/mock-superadmin";
import { TenantStatusBadge } from "@/components/layout/TenantStatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { usePagination } from "@/hooks/usePagination";
import { useSortable } from "@/hooks/useSortable";
import { PaginationControls } from "@/components/superadmin/PaginationControls";
import { SortableHeader } from "@/components/superadmin/SortableHeader";

const planBadgeVariant: Record<string, "outline" | "default" | "secondary"> = {
  free: "outline",
  pro: "default",
  enterprise: "secondary",
};

type AziendaSortKey = "health_score" | "cantieri_count" | "utenti_count" | "last_active";
type Tenant = typeof mockTenantsAll[0];

const comparators: Record<AziendaSortKey, (a: Tenant, b: Tenant) => number> = {
  health_score: (a, b) => a.health_score - b.health_score,
  cantieri_count: (a, b) => a.cantieri_count - b.cantieri_count,
  utenti_count: (a, b) => a.utenti_count - b.utenti_count,
  last_active: (a, b) => new Date(a.last_active).getTime() - new Date(b.last_active).getTime(),
};

function AziendaAvatar({ name }: { name: string }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
      {initials}
    </div>
  );
}

export default function SuperAdminAziende() {
  const [search, setSearch] = useState("");
  const [filterStato, setFilterStato] = useState("all");
  const [filterPiano, setFilterPiano] = useState("all");
  const { startImpersonation } = useAuth();
  const navigate = useNavigate();

  const filtered = useMemo(() =>
    mockTenantsAll.filter((t) => {
      const matchSearch = t.nome_azienda.toLowerCase().includes(search.toLowerCase()) || t.p_iva.includes(search);
      const matchStato = filterStato === "all" || t.stato === filterStato;
      const matchPiano = filterPiano === "all" || t.piano === filterPiano;
      return matchSearch && matchStato && matchPiano;
    }), [search, filterStato, filterPiano]);

  const exportCsv = () => {
    const headers = "Azienda,P.IVA,Piano,Stato,Cantieri,Utenti,Health,Ultima Attività\n";
    const rows = filtered.map((t) =>
      `"${t.nome_azienda}",${t.p_iva},${t.piano},${t.stato},${t.cantieri_count},${t.utenti_count},${t.health_score},${t.last_active}`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `aziende-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const { sortedItems, sortConfig, toggleSort } = useSortable(filtered, comparators);
  const pagination = usePagination(sortedItems, 10);

  const totale = mockTenantsAll.length;
  const attive = mockTenantsAll.filter(t => t.stato === "attivo").length;
  const trial = mockTenantsAll.filter(t => t.stato === "trial").length;
  const sospese = mockTenantsAll.filter(t => t.stato === "sospeso" || t.stato === "scaduto").length;

  const summaryStats = [
    { label: "Totale", value: totale, icon: Building2 },
    { label: "Attive", value: attive, icon: CheckCircle, color: "text-green-500" },
    { label: "Trial", value: trial, icon: Clock, color: "text-yellow-500" },
    { label: "Sospese", value: sospese, icon: AlertTriangle, color: "text-destructive" },
  ];

  const handleImpersonate = (t: Tenant) => {
    startImpersonation(t.id, t.nome_azienda);
    navigate("/app/dashboard");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-foreground">Aziende</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestisci tutte le aziende della piattaforma</p>
        </div>
        <Button asChild>
          <Link to="/superadmin/aziende/nuova"><Plus className="h-4 w-4 mr-1.5" /> Nuova Azienda</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {summaryStats.map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-3 px-4 flex items-center gap-3">
              <s.icon className={`h-5 w-5 ${s.color || "text-muted-foreground"}`} />
              <div>
                <p className="font-heading font-bold text-xl text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cerca azienda..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterStato} onValueChange={setFilterStato}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Stato" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutti gli stati</SelectItem>
            <SelectItem value="attivo">Attivo</SelectItem>
            <SelectItem value="trial">Trial</SelectItem>
            <SelectItem value="sospeso">Sospeso</SelectItem>
            <SelectItem value="scaduto">Scaduto</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterPiano} onValueChange={setFilterPiano}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Piano" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutti i piani</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={exportCsv}>
          <Download className="h-4 w-4 mr-1" /> Export CSV
        </Button>
      </div>

      {/* Desktop table */}
      <div className="border border-border rounded-lg overflow-hidden hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Azienda</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">P.IVA</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Piano</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Stato</th>
              <SortableHeader label="Cantieri" sortKey="cantieri_count" sortConfig={sortConfig} onToggle={toggleSort} className="hidden lg:table-cell" />
              <SortableHeader label="Utenti" sortKey="utenti_count" sortConfig={sortConfig} onToggle={toggleSort} className="hidden lg:table-cell" />
              <SortableHeader label="Health" sortKey="health_score" sortConfig={sortConfig} onToggle={toggleSort} />
              <SortableHeader label="Ultima attività" sortKey="last_active" sortConfig={sortConfig} onToggle={toggleSort} />
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pagination.paginatedItems.map((t) => (
              <tr key={t.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <AziendaAvatar name={t.nome_azienda} />
                    <span className="font-medium text-foreground">{t.nome_azienda}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{t.p_iva}</td>
                <td className="px-4 py-3">
                  <Badge variant={planBadgeVariant[t.piano] || "outline"} className="text-[10px] uppercase">
                    {t.piano}
                  </Badge>
                </td>
                <td className="px-4 py-3"><TenantStatusBadge stato={t.stato} /></td>
                <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{t.cantieri_count}</td>
                <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{t.utenti_count}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Progress value={t.health_score} className="w-14 h-1.5" />
                    <span className={`text-xs font-bold ${t.health_score >= 70 ? "text-green-500" : t.health_score >= 40 ? "text-yellow-500" : "text-destructive"}`}>
                      {t.health_score}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(t.last_active).toLocaleDateString("it-IT")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/superadmin/aziende/${t.id}`}>
                        <Eye className="h-3.5 w-3.5 mr-1" /> Dettaglio
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-primary" onClick={() => handleImpersonate(t)}>
                      <LogIn className="h-3.5 w-3.5 mr-1" /> Entra →
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {pagination.paginatedItems.map((t) => (
          <Card key={t.id}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <AziendaAvatar name={t.nome_azienda} />
                  <span className="font-medium text-foreground">{t.nome_azienda}</span>
                </div>
                <TenantStatusBadge stato={t.stato} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>Piano: <Badge variant={planBadgeVariant[t.piano] || "outline"} className="text-[10px] uppercase ml-1">{t.piano}</Badge></div>
                <div>Cantieri: <span className="font-medium text-foreground">{t.cantieri_count}</span></div>
                <div>Utenti: <span className="font-medium text-foreground">{t.utenti_count}</span></div>
                <div>Attività: <span className="font-medium text-foreground">{new Date(t.last_active).toLocaleDateString("it-IT")}</span></div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Health:</span>
                <Progress value={t.health_score} className="flex-1 h-1.5" />
                <span className={`font-bold ${t.health_score >= 70 ? "text-green-500" : t.health_score >= 40 ? "text-yellow-500" : "text-destructive"}`}>
                  {t.health_score}
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 text-xs" asChild>
                  <Link to={`/superadmin/aziende/${t.id}`}>
                    <Eye className="h-3.5 w-3.5 mr-1" /> Dettaglio
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-xs text-primary" onClick={() => handleImpersonate(t)}>
                  <LogIn className="h-3.5 w-3.5 mr-1" /> Entra
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <PaginationControls {...pagination} />
    </div>
  );
}
