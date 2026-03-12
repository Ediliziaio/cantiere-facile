import { useState } from "react";
import { ScrollText, Search, Download, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { mockSecurityAuditLogs } from "@/data/mock-security";
import { useToast } from "@/hooks/use-toast";

const severityColors: Record<string, string> = {
  info: "bg-muted text-muted-foreground",
  warning: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  critical: "bg-destructive/10 text-destructive border-destructive/30",
};

export default function SuperAdminAuditLog() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  const sorted = [...mockSecurityAuditLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const filtered = sorted.filter((log) => {
    const matchSearch = !search || log.actor_name.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      (log.tenant_name?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchSeverity = filterSeverity === "all" || log.severity === filterSeverity;
    return matchSearch && matchSeverity;
  });

  const exportCsv = () => {
    const headers = "Timestamp,Attore,Azione,Risorsa,Tenant,Severity,IP,Hash\n";
    const rows = filtered.map((l) =>
      `${l.timestamp},${l.actor_name},${l.action},${l.resource_type}:${l.resource_id},${l.tenant_name ?? ""},${l.severity},${l.ip_address},${l.hash_chain}`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Export completato", description: `${filtered.length} righe esportate` });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ScrollText className="h-5 w-5 text-muted-foreground" />
          <h1 className="font-heading font-bold text-2xl text-foreground">Security Audit Log</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-green-500/10 border border-green-500/30 text-green-600 text-xs font-medium">
            <ShieldCheck className="h-3.5 w-3.5" />
            Integrità verificata ✓
          </div>
          <Button variant="outline" size="sm" onClick={exportCsv}>
            <Download className="h-4 w-4 mr-1" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cerca attore, azione, tenant..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterSeverity} onValueChange={setFilterSeverity}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Severity" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutte</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Desktop table */}
      <div className="border border-border rounded-lg overflow-hidden hidden md:block">
        <TooltipProvider>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Data/Ora</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Severity</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Attore</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Azione</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Risorsa</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">IP</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden xl:table-cell">Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString("it-IT")}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={`text-[10px] ${severityColors[log.severity]}`}>
                      {log.severity.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">{log.actor_name}</td>
                  <td className="px-4 py-3 text-foreground">
                    <span className="font-mono text-xs">{log.action}</span>
                    {log.changes && (
                      <span className="block text-[10px] text-muted-foreground mt-0.5">
                        {log.changes.old_val} → {log.changes.new_val}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs">
                    {log.tenant_name ?? log.resource_type}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground font-mono text-xs">{log.ip_address}</td>
                  <td className="px-4 py-3 hidden xl:table-cell">
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="font-mono text-[10px] text-muted-foreground cursor-help">
                          {log.hash_chain.slice(0, 12)}…
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="max-w-xs">
                        <p className="font-mono text-[10px] break-all">{log.hash_chain}</p>
                      </TooltipContent>
                    </Tooltip>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">Nessun log trovato</td></tr>
              )}
            </tbody>
          </table>
        </TooltipProvider>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((log) => (
          <div key={log.id} className="border border-border rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className={`text-[10px] ${severityColors[log.severity]}`}>
                {log.severity.toUpperCase()}
              </Badge>
              <span className="text-[10px] text-muted-foreground">
                {new Date(log.timestamp).toLocaleString("it-IT")}
              </span>
            </div>
            <p className="text-sm font-medium text-foreground">{log.actor_name}</p>
            <p className="font-mono text-xs text-muted-foreground">{log.action}</p>
            {log.changes && (
              <p className="text-[10px] text-muted-foreground">{log.changes.old_val} → {log.changes.new_val}</p>
            )}
            <p className="text-[10px] text-muted-foreground font-mono">{log.ip_address}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Nessun log trovato</p>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        {filtered.length} di {mockSecurityAuditLogs.length} eventi • Append-only • Retention: 7 anni • Hash chain SHA-256
      </p>
    </div>
  );
}
