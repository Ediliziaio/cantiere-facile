import { useState } from "react";
import { ScrollText, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { mockSuperAdminLog, type AuditActionType } from "@/data/mock-superadmin";

const actionLabels: Record<AuditActionType, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  creazione_tenant: { label: "Creazione", variant: "default" },
  sospensione: { label: "Sospensione", variant: "destructive" },
  riattivazione: { label: "Riattivazione", variant: "default" },
  impersonation: { label: "Impersonation", variant: "secondary" },
  modifica_piano: { label: "Modifica piano", variant: "outline" },
  export_dati: { label: "Export dati", variant: "outline" },
  modifica_settings: { label: "Settings", variant: "outline" },
};

export default function SuperAdminAuditLog() {
  const [search, setSearch] = useState("");
  const [filterAction, setFilterAction] = useState<string>("all");

  const sorted = [...mockSuperAdminLog].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const filtered = sorted.filter((log) => {
    const matchSearch = !search || log.tenant_nome.toLowerCase().includes(search.toLowerCase()) || log.dettaglio.toLowerCase().includes(search.toLowerCase());
    const matchAction = filterAction === "all" || log.azione === filterAction;
    return matchSearch && matchAction;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ScrollText className="h-5 w-5 text-superadmin" />
        <h1 className="font-heading font-bold text-2xl text-foreground">Log Audit</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cerca azienda o dettaglio..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterAction} onValueChange={setFilterAction}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Tipo azione" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutte le azioni</SelectItem>
            <SelectItem value="creazione_tenant">Creazione</SelectItem>
            <SelectItem value="sospensione">Sospensione</SelectItem>
            <SelectItem value="riattivazione">Riattivazione</SelectItem>
            <SelectItem value="impersonation">Impersonation</SelectItem>
            <SelectItem value="modifica_piano">Modifica piano</SelectItem>
            <SelectItem value="export_dati">Export dati</SelectItem>
            <SelectItem value="modifica_settings">Settings</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Data/Ora</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Azione</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Azienda</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Dettaglio</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((log) => {
              const action = actionLabels[log.azione];
              return (
                <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString("it-IT")}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={action.variant} className="text-[10px]">{action.label}</Badge>
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">{log.tenant_nome}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">{log.dettaglio}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground font-mono text-xs">{log.ip_address}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Nessun log trovato</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
