import { useState } from "react";
import { Settings, ShieldCheck, Users, AlertTriangle, Copy, Eye, EyeOff, Monitor, LogOut as LogOutIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  mockSuperAdminUsers, mockBackupCodes, mockActiveSessions, mockSecurityAlerts,
  roleLabels, type SuperAdminRole, type SuperAdminUser,
} from "@/data/mock-security";

export default function SuperAdminImpostazioni() {
  const { user, superadminRole, hasPermission } = useAuth();
  const { toast } = useToast();
  const canManage = hasPermission("superadmin_users.manage");

  const [saUsers, setSaUsers] = useState<SuperAdminUser[]>(mockSuperAdminUsers);
  const [alerts, setAlerts] = useState(mockSecurityAlerts);
  const [showCodes, setShowCodes] = useState(false);

  const currentSaUser = saUsers.find((u) => u.id === user?.id) ?? saUsers[0];

  const toggleUserActive = (id: string) => {
    setSaUsers((prev) => prev.map((u) => u.id === id ? { ...u, is_active: !u.is_active } : u));
    toast({ title: "Stato utente aggiornato" });
  };

  const changeUserRole = (id: string, newRole: SuperAdminRole) => {
    setSaUsers((prev) => prev.map((u) => u.id === id ? { ...u, role: newRole } : u));
    toast({ title: "Ruolo aggiornato" });
  };

  const resolveAlert = (id: string) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, resolved: true, resolved_at: new Date().toISOString() } : a));
    toast({ title: "Alert risolto" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5 text-muted-foreground" />
        <h1 className="font-heading font-bold text-2xl text-foreground">Impostazioni Piattaforma</h1>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="w-full max-w-xl overflow-x-auto scrollbar-hide">
          <TabsTrigger value="profile">Profilo</TabsTrigger>
          <TabsTrigger value="security">Sicurezza</TabsTrigger>
          <TabsTrigger value="users" disabled={!hasPermission("superadmin_users.view")}>Utenti SA</TabsTrigger>
          <TabsTrigger value="alerts" disabled={!hasPermission("alerts.view")}>Alerts</TabsTrigger>
        </TabsList>

        {/* PROFILE TAB */}
        <TabsContent value="profile" className="space-y-4 max-w-lg">
          <div className="border border-border rounded-lg p-4 space-y-3">
            <h2 className="font-heading font-semibold text-foreground">Informazioni Profilo</h2>
            <div className="grid gap-2 text-sm">
              {[
                ["Nome completo", currentSaUser.full_name],
                ["Email", currentSaUser.email],
                ["Telefono", currentSaUser.phone],
                ["Ruolo", roleLabels[currentSaUser.role]],
                ["Ultimo accesso", currentSaUser.last_login_at ? new Date(currentSaUser.last_login_at).toLocaleString("it-IT") : "Mai"],
                ["Account creato", new Date(currentSaUser.created_at).toLocaleDateString("it-IT")],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-1 border-b border-border last:border-0">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* SECURITY TAB */}
        <TabsContent value="security" className="space-y-4 max-w-lg">
          <div className="border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <h2 className="font-heading font-semibold text-foreground">Autenticazione a Due Fattori</h2>
              </div>
              <Badge variant={currentSaUser.totp_enabled ? "default" : "destructive"} className="text-[10px]">
                {currentSaUser.totp_enabled ? "Attivo" : "Disattivo"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {currentSaUser.totp_enabled
                ? "Il tuo account è protetto con autenticazione TOTP."
                : "2FA non configurato. Configura per proteggere il tuo account."}
            </p>
          </div>

          <div className="border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-semibold text-foreground">Codici di Backup</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowCodes(!showCodes)}>
                {showCodes ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {mockBackupCodes.map((code, i) => (
                <div key={i} className="font-mono text-xs bg-muted rounded px-2 py-1.5 text-center text-foreground">
                  {showCodes ? code : "••••-••••"}
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(mockBackupCodes.join("\n")); toast({ title: "Codici copiati" }); }}>
              <Copy className="h-3 w-3 mr-1" /> Copia tutti
            </Button>
          </div>

          <div className="border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-muted-foreground" />
                <h2 className="font-heading font-semibold text-foreground">Sessioni Attive</h2>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast({ title: "Tutte le sessioni terminate", description: "(mock)" })}>
                <LogOutIcon className="h-3 w-3 mr-1" /> Termina tutte
              </Button>
            </div>
            <div className="space-y-2">
              {mockActiveSessions.map((s) => (
                <div key={s.id} className="text-xs flex justify-between items-center py-1.5 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-foreground">{s.device}</p>
                    <p className="text-muted-foreground">{s.ip} — {new Date(s.last_activity).toLocaleString("it-IT")}</p>
                  </div>
                  {s.user_id === user?.id && <Badge variant="outline" className="text-[9px]">Corrente</Badge>}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* USERS TAB */}
        <TabsContent value="users" className="space-y-4">
          {/* Desktop table */}
          <div className="border border-border rounded-lg overflow-hidden hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Nome</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Ruolo</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">2FA</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Stato</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Ultimo Accesso</th>
                  {canManage && <th className="text-left px-4 py-3 font-medium text-muted-foreground">Azioni</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {saUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{u.full_name}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{u.email}</td>
                    <td className="px-4 py-3">
                      {canManage && u.id !== user?.id ? (
                        <Select value={u.role} onValueChange={(v) => changeUserRole(u.id, v as SuperAdminRole)}>
                          <SelectTrigger className="h-7 text-xs w-36"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {(Object.entries(roleLabels) as [SuperAdminRole, string][]).map(([k, v]) => (
                              <SelectItem key={k} value={k} className="text-xs">{v}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant="outline" className="text-[10px]">{roleLabels[u.role]}</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={u.totp_enabled ? "default" : "destructive"} className="text-[10px]">
                        {u.totp_enabled ? "Attivo" : "No"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {canManage && u.id !== user?.id ? (
                        <Switch checked={u.is_active} onCheckedChange={() => toggleUserActive(u.id)} />
                      ) : (
                        <Badge variant={u.is_active ? "default" : "secondary"} className="text-[10px]">
                          {u.is_active ? "Attivo" : "Disattivo"}
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                      {u.last_login_at ? new Date(u.last_login_at).toLocaleString("it-IT") : "Mai"}
                    </td>
                    {canManage && (
                      <td className="px-4 py-3">
                        {u.id === user?.id ? (
                          <span className="text-[10px] text-muted-foreground">Tu</span>
                        ) : (
                          <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => toggleUserActive(u.id)}>
                            {u.is_active ? "Disattiva" : "Attiva"}
                          </Button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {saUsers.map((u) => (
              <div key={u.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{u.full_name}</span>
                  <Badge variant={u.is_active ? "default" : "secondary"} className="text-[10px]">
                    {u.is_active ? "Attivo" : "Disattivo"}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>{u.email}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">{roleLabels[u.role]}</Badge>
                    <Badge variant={u.totp_enabled ? "default" : "destructive"} className="text-[10px]">
                      2FA: {u.totp_enabled ? "Sì" : "No"}
                    </Badge>
                  </div>
                </div>
                {canManage && u.id !== user?.id && (
                  <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => toggleUserActive(u.id)}>
                    {u.is_active ? "Disattiva" : "Attiva"}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ALERTS TAB */}
        <TabsContent value="alerts" className="space-y-4">
          <div className="space-y-3">
            {alerts.map((a) => (
              <div key={a.id} className={`border rounded-lg p-4 ${a.severity === "critical" ? "border-destructive/50 bg-destructive/5" : "border-amber-500/30 bg-amber-500/5"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className={`h-4 w-4 mt-0.5 shrink-0 ${a.severity === "critical" ? "text-destructive" : "text-amber-500"}`} />
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge variant={a.severity === "critical" ? "destructive" : "secondary"} className="text-[10px]">
                          {a.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">{a.type.replace("_", " ")}</Badge>
                        {a.resolved && <Badge variant="outline" className="text-[10px] border-green-500/50 text-green-600">Risolto</Badge>}
                      </div>
                      <p className="text-sm text-foreground">{a.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {a.actor_name} — {new Date(a.timestamp).toLocaleString("it-IT")}
                      </p>
                    </div>
                  </div>
                  {!a.resolved && hasPermission("alerts.manage") && (
                    <Button variant="outline" size="sm" className="text-xs shrink-0" onClick={() => resolveAlert(a.id)}>
                      Risolvi
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {alerts.length === 0 && (
              <p className="text-center text-muted-foreground py-8">Nessun alert di sicurezza</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
