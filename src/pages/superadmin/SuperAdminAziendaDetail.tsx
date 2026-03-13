import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, LogIn, Users, ShieldCheck, Shield, Download, Ban, RefreshCw, Building2, FileText, ScrollText, Settings2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { mockTenantsAll, mockTenantSettings, mockSubscriptions, mockSuperAdminLog, mockCantieriAllTenants } from "@/data/mock-superadmin";
import { mockUtentiAzienda } from "@/data/mock-data";
import { TenantStatusBadge } from "@/components/layout/TenantStatusBadge";
import { useAuth, type UserRole } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function SuperAdminAziendaDetail() {
  const { id } = useParams<{ id: string }>();
  const tenant = mockTenantsAll.find((t) => t.id === id);
  const { startImpersonation } = useAuth();
  const navigate = useNavigate();

  if (!tenant) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Azienda non trovata.</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link to="/superadmin/aziende">Torna alla lista</Link>
        </Button>
      </div>
    );
  }

  const settings = mockTenantSettings.find((s) => s.tenant_id === tenant.id);
  const subscriptions = mockSubscriptions.filter((s) => s.tenant_id === tenant.id);
  const cantieri = mockCantieriAllTenants.filter((c) => c.tenant_id === tenant.id);
  const utenti = mockUtentiAzienda.filter((u) => u.tenant_id === tenant.id);
  const auditLogs = mockSuperAdminLog.filter((l) => l.tenant_id === tenant.id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const storagePercent = Math.round((tenant.storage_used_mb / (tenant.max_storage_gb * 1024)) * 100);

  const [roleDialogOpen, setRoleDialogOpen] = useState(false);

  const handleImpersonate = (impRole: UserRole) => {
    startImpersonation(tenant.id, tenant.nome_azienda, impRole);
    setRoleDialogOpen(false);
    navigate("/app/dashboard");
  };

  const handleExport = () => {
    const data = { tenant, settings, subscriptions, cantieri, utenti };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `export_${tenant.p_iva}_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export dati completato");
  };

  const handleSuspend = () => toast.success(`Azienda "${tenant.nome_azienda}" sospesa (mock)`);
  const handleReactivate = () => toast.success(`Azienda "${tenant.nome_azienda}" riattivata (mock)`);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/superadmin/aziende"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <h1 className="font-heading font-bold text-2xl text-foreground">{tenant.nome_azienda}</h1>
          <TenantStatusBadge stato={tenant.stato} />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <LogIn className="h-3.5 w-3.5 mr-1.5" /> Impersona
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Scegli il ruolo da impersonare</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">
                Navigherai come <strong>{tenant.nome_azienda}</strong> con i permessi del ruolo selezionato.
              </p>
              <div className="flex flex-col gap-2 mt-2">
                {([
                  { role: "admin" as UserRole, label: "Admin", desc: "Piena gestione dell'azienda" },
                  { role: "manager" as UserRole, label: "Manager", desc: "Accesso limitato ai cantieri assegnati" },
                  { role: "utente" as UserRole, label: "Utente", desc: "Dipendente operativo (check-in, badge, firma)" },
                ]).map((opt) => (
                  <Button
                    key={opt.role}
                    variant="outline"
                    className="justify-start h-auto py-3 px-4"
                    onClick={() => handleImpersonate(opt.role)}
                  >
                    <div className="text-left">
                      <div className="font-medium">{opt.label}</div>
                      <div className="text-xs text-muted-foreground">{opt.desc}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          <Button size="sm" variant="outline" onClick={handleExport}>
            <Download className="h-3.5 w-3.5 mr-1.5" /> Export
          </Button>
          {tenant.stato === "attivo" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="outline" className="text-destructive border-destructive/30">
                  <Ban className="h-3.5 w-3.5 mr-1.5" /> Sospendi
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Sospendere {tenant.nome_azienda}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tutti gli utenti perderanno l'accesso. L'azienda avrà 30 giorni di grazia in sola lettura.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annulla</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSuspend} className="bg-destructive">Conferma Sospensione</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {tenant.stato === "sospeso" && (
            <Button size="sm" variant="outline" onClick={handleReactivate}>
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Riattiva
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cantieri">Cantieri</TabsTrigger>
          <TabsTrigger value="fatturazione">Fatturazione</TabsTrigger>
          <TabsTrigger value="utenti">Utenti</TabsTrigger>
          <TabsTrigger value="log">Log Audit</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Info */}
            <div className="border border-border rounded-lg p-4 space-y-2">
              <h3 className="font-heading font-semibold text-sm text-foreground flex items-center gap-1.5"><Building2 className="h-4 w-4 text-muted-foreground" /> Informazioni</h3>
              {[
                ["Ragione Sociale", tenant.nome_azienda],
                ["P.IVA", tenant.p_iva],
                ["Codice Fiscale", tenant.fiscal_code],
                ["Email Admin", tenant.email_admin],
                ["Telefono", tenant.phone],
                ["Indirizzo", `${tenant.address}, ${tenant.city} (${tenant.province})`],
                ["Piano", tenant.piano.toUpperCase()],
                ["Data creazione", new Date(tenant.created_at).toLocaleDateString("it-IT")],
                ["Ultima attività", new Date(tenant.last_active).toLocaleString("it-IT")],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-1 border-b border-border last:border-0 text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-foreground text-right max-w-[60%] truncate">{value}</span>
                </div>
              ))}
            </div>

            {/* Stats + Health */}
            <div className="space-y-4">
              <div className="border border-border rounded-lg p-4 space-y-3">
                <h3 className="font-heading font-semibold text-sm text-foreground">Health Score</h3>
                <div className="flex items-end gap-3">
                  <span className={`text-4xl font-bold ${tenant.health_score >= 70 ? "text-green-500" : tenant.health_score >= 40 ? "text-yellow-500" : "text-destructive"}`}>
                    {tenant.health_score}
                  </span>
                  <span className="text-sm text-muted-foreground mb-1">/ 100</span>
                </div>
                <Progress value={tenant.health_score} className="h-2" />
              </div>

              <div className="border border-border rounded-lg p-4 space-y-3">
                <h3 className="font-heading font-semibold text-sm text-foreground">Utilizzo Risorse</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Utenti</span>
                    <span className="font-medium text-foreground">{tenant.utenti_count} / {tenant.max_users}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cantieri</span>
                    <span className="font-medium text-foreground">{tenant.cantieri_count} / {tenant.max_sites}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Storage</span>
                    <span className="font-medium text-foreground">{(tenant.storage_used_mb / 1024).toFixed(1)} / {tenant.max_storage_gb} GB</span>
                  </div>
                  <Progress value={storagePercent} className="h-2" />
                </div>
              </div>

              {/* Features */}
              {settings && (
                <div className="border border-border rounded-lg p-4 space-y-2">
                  <h3 className="font-heading font-semibold text-sm text-foreground flex items-center gap-1.5"><Settings2 className="h-4 w-4 text-muted-foreground" /> Moduli</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(settings.features_enabled).map(([key, enabled]) => (
                      <span key={key} className={`text-xs px-2 py-0.5 rounded ${enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground line-through"}`}>
                        {key.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Cantieri */}
        <TabsContent value="cantieri">
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Nome</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Comune</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Stato</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Lavoratori</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Documenti</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {cantieri.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3 font-medium text-foreground">{c.nome}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.comune}</td>
                    <td className="px-4 py-3">
                      <Badge variant={c.stato === "attivo" ? "default" : c.stato === "completato" ? "secondary" : "destructive"} className="text-[10px]">
                        {c.stato}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{c.lavoratori_count}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{c.documenti_ok}/{c.documenti_totali}</td>
                  </tr>
                ))}
                {cantieri.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Nessun cantiere</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Fatturazione */}
        <TabsContent value="fatturazione" className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="border border-border rounded-lg p-4 text-center">
              <p className="text-xs text-muted-foreground">Piano attuale</p>
              <p className="font-heading font-bold text-lg text-foreground mt-1">{tenant.piano.toUpperCase()}</p>
            </div>
            <div className="border border-border rounded-lg p-4 text-center">
              <p className="text-xs text-muted-foreground">Prossima scadenza</p>
              <p className="font-heading font-bold text-lg text-foreground mt-1">
                {subscriptions.length > 0 ? new Date(subscriptions[0].data_fine).toLocaleDateString("it-IT") : "—"}
              </p>
            </div>
            <div className="border border-border rounded-lg p-4 text-center">
              <p className="text-xs text-muted-foreground">Importo mensile</p>
              <p className="font-heading font-bold text-lg text-foreground mt-1">
                {subscriptions.length > 0 ? `€${subscriptions[0].importo}` : "—"}
              </p>
            </div>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Periodo</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Piano</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Importo</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Stato</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Metodo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {subscriptions.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3 text-foreground text-xs">
                      {new Date(s.data_inizio).toLocaleDateString("it-IT")} — {new Date(s.data_fine).toLocaleDateString("it-IT")}
                    </td>
                    <td className="px-4 py-3 uppercase text-xs text-muted-foreground">{s.piano}</td>
                    <td className="px-4 py-3 font-medium text-foreground">€{s.importo}</td>
                    <td className="px-4 py-3">
                      <Badge variant={s.stato === "pagato" ? "default" : s.stato === "in_scadenza" ? "secondary" : "destructive"} className="text-[10px]">
                        {s.stato.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">{s.metodo_pagamento}</td>
                  </tr>
                ))}
                {subscriptions.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Nessuno storico pagamenti</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Utenti */}
        <TabsContent value="utenti">
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Nome</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Ruolo</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Stato</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Ultimo accesso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {utenti.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3 font-medium text-foreground">{u.nome} {u.cognome}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{u.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-[10px] gap-0.5">
                        {u.ruolo === "admin" ? <><ShieldCheck className="h-3 w-3" />Admin</> : <><Shield className="h-3 w-3" />Manager</>}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <Badge variant={u.stato === "attivo" ? "default" : u.stato === "invitato" ? "secondary" : "destructive"} className="text-[10px]">
                        {u.stato}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">
                      {u.ultimo_accesso ? new Date(u.ultimo_accesso).toLocaleString("it-IT") : "Mai"}
                    </td>
                  </tr>
                ))}
                {utenti.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Nessun utente</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Log Audit */}
        <TabsContent value="log">
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Data/Ora</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Azione</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Dettaglio</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">{new Date(log.timestamp).toLocaleString("it-IT")}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-[10px]">{log.azione.replace(/_/g, " ")}</Badge>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">{log.dettaglio}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground font-mono text-xs">{log.ip_address}</td>
                  </tr>
                ))}
                {auditLogs.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Nessun log per questa azienda</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
