import { useState, useMemo } from "react";
import {
  Settings, Plus, UserCog, Trash2, Shield, ShieldCheck, Building2,
  MoreHorizontal, Activity, LogIn, Upload, PenLine, UserPlus, PlusCircle, XCircle,
  Mail, Send, Eye, CheckCircle2, Clock, AlertTriangle, X, BellRing,
  Smartphone, MessageSquare, CloudRain, ShieldAlert, FileText, UserCheck, Siren,
} from "lucide-react";
import { mockTenant, mockCantieri, mockUtentiAzienda, mockLogAttivita, mockNotificheEmail, mockImpostazioniNotifiche, type UtenteAzienda, type UtenteRuolo, type LogTipoAzione, type NotificaEmailTipo, type NotificaEmailStato } from "@/data/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";

const permessiRuolo = [
  { funzione: "Dashboard", admin: "✅ Completa", manager: "✅ Cantieri assegnati" },
  { funzione: "Cantieri", admin: "✅ Tutti", manager: "Solo assegnati" },
  { funzione: "Documenti", admin: "✅ Tutti", manager: "Solo cantieri assegnati" },
  { funzione: "Lavoratori", admin: "✅ Completo", manager: "Sola lettura" },
  { funzione: "Impostazioni", admin: "✅", manager: "❌" },
  { funzione: "Gestione Utenti", admin: "✅", manager: "❌" },
];

const logIconMap: Record<LogTipoAzione, typeof LogIn> = {
  login: LogIn,
  modifica: PenLine,
  upload: Upload,
  creazione: PlusCircle,
  eliminazione: XCircle,
  invito: UserPlus,
};

const logColorMap: Record<LogTipoAzione, string> = {
  login: "text-blue-600 bg-blue-500/10",
  modifica: "text-amber-600 bg-amber-500/10",
  upload: "text-green-600 bg-green-500/10",
  creazione: "text-primary bg-primary/10",
  eliminazione: "text-destructive bg-destructive/10",
  invito: "text-violet-600 bg-violet-500/10",
};

const logLabelMap: Record<LogTipoAzione, string> = {
  login: "Login",
  modifica: "Modifica",
  upload: "Upload",
  creazione: "Creazione",
  eliminazione: "Eliminazione",
  invito: "Invito",
};

const categoriaEmailMap: Record<NotificaEmailTipo, string> = {
  scadenza_durc: "DURC",
  scadenza_formazione: "Formazione",
  scadenza_idoneita: "Idoneità Sanitaria",
};

const statoEmailBadge = (stato: NotificaEmailStato) => {
  const map = {
    inviata: { label: "Inviata", icon: CheckCircle2, cls: "bg-green-500/10 text-green-700 border-green-500/30" },
    programmata: { label: "Programmata", icon: Clock, cls: "bg-blue-500/10 text-blue-700 border-blue-500/30" },
    errore: { label: "Errore", icon: AlertTriangle, cls: "bg-destructive/10 text-destructive border-destructive/30" },
  };
  const s = map[stato];
  const Icon = s.icon;
  return <Badge variant="outline" className={s.cls}><Icon className="h-3 w-3 mr-1" />{s.label}</Badge>;
};

export default function Impostazioni() {
  const { role } = useAuth();
  const [utenti, setUtenti] = useState<UtenteAzienda[]>(mockUtentiAzienda);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [cantieriDialogUser, setCantieriDialogUser] = useState<UtenteAzienda | null>(null);

  // Log filters
  const [logFilterTipo, setLogFilterTipo] = useState<LogTipoAzione | "tutti">("tutti");
  const [logFilterUtente, setLogFilterUtente] = useState<string>("tutti");

  // Email notification settings state
  const [emailSettings, setEmailSettings] = useState(mockImpostazioniNotifiche);
  const [emailFilterCat, setEmailFilterCat] = useState<NotificaEmailTipo | "tutti">("tutti");
  const [emailFilterStato, setEmailFilterStato] = useState<NotificaEmailStato | "tutti">("tutti");
  const [previewEmail, setPreviewEmail] = useState<typeof mockNotificheEmail[0] | null>(null);
  const [newDestinatario, setNewDestinatario] = useState("");

  const filteredLog = useMemo(() => {
    return mockLogAttivita
      .filter(l => logFilterTipo === "tutti" || l.tipo === logFilterTipo)
      .filter(l => logFilterUtente === "tutti" || l.utente_id === logFilterUtente)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [logFilterTipo, logFilterUtente]);

  const filteredEmails = useMemo(() => {
    return mockNotificheEmail
      .filter(n => emailFilterCat === "tutti" || n.tipo === emailFilterCat)
      .filter(n => emailFilterStato === "tutti" || n.stato_invio === emailFilterStato)
      .sort((a, b) => new Date(b.data_invio).getTime() - new Date(a.data_invio).getTime());
  }, [emailFilterCat, emailFilterStato]);

  // Invite form state
  const [invNome, setInvNome] = useState("");
  const [invCognome, setInvCognome] = useState("");
  const [invEmail, setInvEmail] = useState("");
  const [invRuolo, setInvRuolo] = useState<UtenteRuolo>("manager");
  const [invCantieri, setInvCantieri] = useState<string[]>([]);

  const resetInviteForm = () => {
    setInvNome(""); setInvCognome(""); setInvEmail(""); setInvRuolo("manager"); setInvCantieri([]);
  };

  const handleInvite = () => {
    if (!invNome || !invCognome || !invEmail) { toast.error("Compila tutti i campi"); return; }
    const newUser: UtenteAzienda = {
      id: `ua-${Date.now()}`, tenant_id: "t1", nome: invNome, cognome: invCognome,
      email: invEmail, ruolo: invRuolo, stato: "invitato", ultimo_accesso: null,
      cantieri_assegnati: invRuolo === "admin" ? [] : invCantieri,
    };
    setUtenti(prev => [...prev, newUser]);
    toast.success(`Invito inviato a ${invEmail}`);
    resetInviteForm();
    setInviteOpen(false);
  };

  const toggleStato = (id: string) => {
    setUtenti(prev => prev.map(u => u.id === id
      ? { ...u, stato: u.stato === "disabilitato" ? "attivo" : "disabilitato" }
      : u
    ));
  };

  const changeRuolo = (id: string, ruolo: UtenteRuolo) => {
    setUtenti(prev => prev.map(u => u.id === id
      ? { ...u, ruolo, cantieri_assegnati: ruolo === "admin" ? [] : u.cantieri_assegnati }
      : u
    ));
    toast.success("Ruolo aggiornato");
  };

  const removeUser = (id: string) => {
    setUtenti(prev => prev.filter(u => u.id !== id));
    toast.success("Utente rimosso");
  };

  const updateCantieri = (userId: string, cantiereId: string, checked: boolean) => {
    setUtenti(prev => prev.map(u => {
      if (u.id !== userId) return u;
      const updated = checked
        ? [...u.cantieri_assegnati, cantiereId]
        : u.cantieri_assegnati.filter(c => c !== cantiereId);
      return { ...u, cantieri_assegnati: updated };
    }));
  };

  const getRuoloBadge = (ruolo: UtenteRuolo) => (
    <Badge variant={ruolo === "admin" ? "default" : "secondary"} className={
      ruolo === "admin" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
    }>
      {ruolo === "admin" ? <ShieldCheck className="h-3 w-3 mr-1" /> : <Shield className="h-3 w-3 mr-1" />}
      {ruolo === "admin" ? "Admin" : "Manager"}
    </Badge>
  );

  const getStatoBadge = (stato: UtenteAzienda["stato"]) => {
    const map = {
      attivo: { label: "Attivo", cls: "bg-green-500/10 text-green-700 border-green-500/30" },
      invitato: { label: "Invitato", cls: "bg-yellow-500/10 text-yellow-700 border-yellow-500/30" },
      disabilitato: { label: "Disabilitato", cls: "bg-muted text-muted-foreground border-border" },
    };
    const s = map[stato];
    return <Badge variant="outline" className={s.cls}>{s.label}</Badge>;
  };

  const handleSendNow = () => {
    const pending = mockNotificheEmail.filter(n => n.stato_invio === "programmata").length;
    if (pending === 0) {
      toast.info("Nessuna notifica programmata da inviare");
      return;
    }
    toast.success(`${pending} notifiche email inviate con successo`);
  };

  const addDestinatario = () => {
    if (!newDestinatario || !newDestinatario.includes("@")) {
      toast.error("Inserisci un indirizzo email valido");
      return;
    }
    if (emailSettings.email_destinatari.includes(newDestinatario)) {
      toast.error("Destinatario già presente");
      return;
    }
    setEmailSettings(prev => ({ ...prev, email_destinatari: [...prev.email_destinatari, newDestinatario] }));
    setNewDestinatario("");
    toast.success("Destinatario aggiunto");
  };

  const removeDestinatario = (email: string) => {
    setEmailSettings(prev => ({ ...prev, email_destinatari: prev.email_destinatari.filter(e => e !== email) }));
  };

  // Manager can only see profile tab
  const isAdmin = role === "admin" || role === "superadmin" || !role;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5 text-primary" />
        <h1 className="font-heading font-bold text-2xl text-foreground">Impostazioni</h1>
      </div>

      <Tabs defaultValue="profilo" className="w-full">
        <TabsList className="w-full sm:w-auto flex-wrap">
          <TabsTrigger value="profilo" className="gap-1.5"><Building2 className="h-4 w-4" /> Profilo Azienda</TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="utenti" className="gap-1.5"><UserCog className="h-4 w-4" /> Utenti & Accessi</TabsTrigger>
          )}
          {isAdmin && (
            <TabsTrigger value="log" className="gap-1.5"><Activity className="h-4 w-4" /> Log Attività</TabsTrigger>
          )}
          {isAdmin && (
            <TabsTrigger value="notifiche-email" className="gap-1.5"><Mail className="h-4 w-4" /> Notifiche Email</TabsTrigger>
          )}
          <TabsTrigger value="preferenze-notifiche" className="gap-1.5"><BellRing className="h-4 w-4" /> Preferenze</TabsTrigger>
        </TabsList>

        {/* Tab Profilo */}
        <TabsContent value="profilo">
          <div className="border border-border rounded-lg p-4 space-y-3 mt-4">
            <h2 className="font-heading font-semibold text-foreground">Profilo Azienda</h2>
            <div className="grid gap-2 text-sm">
              {[
                ["Ragione Sociale", mockTenant.nome_azienda],
                ["Partita IVA", mockTenant.p_iva],
                ["Email Admin", mockTenant.email_admin],
                ["Piano", mockTenant.piano.toUpperCase()],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-1 border-b border-border last:border-0">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Tab Utenti */}
        {isAdmin && (
          <TabsContent value="utenti">
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading font-semibold text-foreground">Utenti Azienda</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Admin: accesso completo · Manager: accesso ai cantieri assegnati, no impostazioni
                  </p>
                </div>
                <Dialog open={inviteOpen} onOpenChange={v => { setInviteOpen(v); if (!v) resetInviteForm(); }}>
                  <DialogTrigger asChild>
                    <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Invita Utente</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Invita Nuovo Utente</DialogTitle></DialogHeader>
                    <div className="grid gap-3 py-2">
                      <div className="grid grid-cols-2 gap-3">
                        <div><Label>Nome</Label><Input value={invNome} onChange={e => setInvNome(e.target.value)} /></div>
                        <div><Label>Cognome</Label><Input value={invCognome} onChange={e => setInvCognome(e.target.value)} /></div>
                      </div>
                      <div><Label>Email</Label><Input type="email" value={invEmail} onChange={e => setInvEmail(e.target.value)} /></div>
                      <div>
                        <Label>Ruolo</Label>
                        <Select value={invRuolo} onValueChange={v => setInvRuolo(v as UtenteRuolo)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin — accesso completo</SelectItem>
                            <SelectItem value="manager">Manager — cantieri assegnati</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {invRuolo === "manager" && (
                        <div>
                          <Label>Cantieri Assegnati</Label>
                          <div className="grid gap-2 mt-1.5">
                            {mockCantieri.map(c => (
                              <label key={c.id} className="flex items-center gap-2 text-sm cursor-pointer">
                                <Checkbox
                                  checked={invCantieri.includes(c.id)}
                                  onCheckedChange={checked => {
                                    setInvCantieri(prev => checked ? [...prev, c.id] : prev.filter(x => x !== c.id));
                                  }}
                                />
                                {c.nome} — {c.comune}
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                      <Button onClick={handleInvite} className="mt-2">Invia Invito</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Users Table */}
              <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Ruolo</TableHead>
                      <TableHead>Stato</TableHead>
                      <TableHead className="hidden md:table-cell">Cantieri</TableHead>
                      <TableHead className="hidden lg:table-cell">Ultimo Accesso</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {utenti.map(u => (
                      <TableRow key={u.id} className={u.stato === "disabilitato" ? "opacity-50" : ""}>
                        <TableCell className="font-medium">{u.nome} {u.cognome}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">{u.email}</TableCell>
                        <TableCell>{getRuoloBadge(u.ruolo)}</TableCell>
                        <TableCell>{getStatoBadge(u.stato)}</TableCell>
                        <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                          {u.ruolo === "admin" ? "Tutti" :
                            u.cantieri_assegnati.length === 0 ? "Nessuno" :
                            u.cantieri_assegnati.map(cid => mockCantieri.find(c => c.id === cid)?.nome || cid).join(", ")}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                          {u.ultimo_accesso ? new Date(u.ultimo_accesso).toLocaleString("it-IT") : "—"}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => changeRuolo(u.id, u.ruolo === "admin" ? "manager" : "admin")}>
                                {u.ruolo === "admin" ? "Cambia a Manager" : "Promuovi ad Admin"}
                              </DropdownMenuItem>
                              {u.ruolo === "manager" && (
                                <DropdownMenuItem onClick={() => setCantieriDialogUser(u)}>
                                  Gestisci Cantieri
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => toggleStato(u.id)}>
                                {u.stato === "disabilitato" ? "Riabilita" : "Disabilita"}
                              </DropdownMenuItem>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={e => e.preventDefault()} className="text-destructive">
                                    <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Rimuovi
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Rimuovere {u.nome} {u.cognome}?</AlertDialogTitle>
                                    <AlertDialogDescription>L'utente perderà l'accesso all'azienda. Questa azione non è reversibile.</AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Annulla</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => removeUser(u.id)}>Rimuovi</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Permissions summary */}
              <div className="border border-border rounded-lg p-4 space-y-3">
                <h3 className="font-heading font-semibold text-sm text-foreground">Riepilogo Permessi per Ruolo</h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Funzione</TableHead>
                        <TableHead className="text-center"><ShieldCheck className="h-3.5 w-3.5 inline mr-1" />Admin</TableHead>
                        <TableHead className="text-center"><Shield className="h-3.5 w-3.5 inline mr-1" />Manager</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {permessiRuolo.map(p => (
                        <TableRow key={p.funzione}>
                          <TableCell className="font-medium text-sm">{p.funzione}</TableCell>
                          <TableCell className="text-center text-sm">{p.admin}</TableCell>
                          <TableCell className="text-center text-sm text-muted-foreground">{p.manager}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </TabsContent>
        )}

        {/* Tab Log Attività */}
        {isAdmin && (
          <TabsContent value="log">
            <div className="space-y-4 mt-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-heading font-semibold text-foreground">Log Attività</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Registro di login, modifiche, upload e altre azioni degli utenti
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={logFilterTipo} onValueChange={v => setLogFilterTipo(v as LogTipoAzione | "tutti")}>
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                      <SelectValue placeholder="Tipo azione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tutti">Tutte le azioni</SelectItem>
                      <SelectItem value="login">Login</SelectItem>
                      <SelectItem value="modifica">Modifiche</SelectItem>
                      <SelectItem value="upload">Upload</SelectItem>
                      <SelectItem value="creazione">Creazioni</SelectItem>
                      <SelectItem value="eliminazione">Eliminazioni</SelectItem>
                      <SelectItem value="invito">Inviti</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={logFilterUtente} onValueChange={setLogFilterUtente}>
                    <SelectTrigger className="w-[160px] h-8 text-xs">
                      <SelectValue placeholder="Utente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tutti">Tutti gli utenti</SelectItem>
                      {mockUtentiAzienda.map(u => (
                        <SelectItem key={u.id} value={u.id}>{u.nome} {u.cognome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <ScrollArea className="h-[500px]">
                <div className="space-y-1">
                  {filteredLog.map(log => {
                    const Icon = logIconMap[log.tipo];
                    const colorCls = logColorMap[log.tipo];
                    return (
                      <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${colorCls}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-foreground">{log.utente_nome}</span>
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                              {logLabelMap[log.tipo]}
                            </Badge>
                          </div>
                          <p className="text-sm text-foreground mt-0.5">{log.descrizione}</p>
                          {log.dettaglio && (
                            <p className="text-xs text-muted-foreground mt-0.5">{log.dettaglio}</p>
                          )}
                        </div>
                        <span className="text-[11px] text-muted-foreground whitespace-nowrap shrink-0">
                          {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true, locale: it })}
                        </span>
                      </div>
                    );
                  })}
                  {filteredLog.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground text-sm">
                      Nessuna attività trovata con i filtri selezionati
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        )}

        {/* Tab Notifiche Email */}
        {isAdmin && (
          <TabsContent value="notifiche-email">
            <div className="space-y-6 mt-4">
              {/* Configuration */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Settings className="h-4 w-4" /> Configurazione Notifiche
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="flex items-center justify-between gap-2 rounded-lg border border-border p-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">DURC</p>
                        <p className="text-xs text-muted-foreground">Scadenza documenti DURC</p>
                      </div>
                      <Switch checked={emailSettings.abilitata_durc} onCheckedChange={v => setEmailSettings(prev => ({ ...prev, abilitata_durc: v }))} />
                    </div>
                    <div className="flex items-center justify-between gap-2 rounded-lg border border-border p-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">Formazione</p>
                        <p className="text-xs text-muted-foreground">Attestati sicurezza</p>
                      </div>
                      <Switch checked={emailSettings.abilitata_formazione} onCheckedChange={v => setEmailSettings(prev => ({ ...prev, abilitata_formazione: v }))} />
                    </div>
                    <div className="flex items-center justify-between gap-2 rounded-lg border border-border p-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">Idoneità Sanitaria</p>
                        <p className="text-xs text-muted-foreground">Visite mediche</p>
                      </div>
                      <Switch checked={emailSettings.abilitata_idoneita} onCheckedChange={v => setEmailSettings(prev => ({ ...prev, abilitata_idoneita: v }))} />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Label className="whitespace-nowrap">Preavviso</Label>
                    <Select value={String(emailSettings.soglia_giorni)} onValueChange={v => setEmailSettings(prev => ({ ...prev, soglia_giorni: Number(v) }))}>
                      <SelectTrigger className="w-[140px] h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 giorni</SelectItem>
                        <SelectItem value="15">15 giorni</SelectItem>
                        <SelectItem value="30">30 giorni</SelectItem>
                        <SelectItem value="60">60 giorni</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Destinatari */}
                  <div className="space-y-2">
                    <Label>Destinatari Email</Label>
                    <div className="flex flex-wrap gap-2">
                      {emailSettings.email_destinatari.map(email => (
                        <Badge key={email} variant="secondary" className="gap-1 pr-1">
                          {email}
                          <button onClick={() => removeDestinatario(email)} className="ml-1 hover:text-destructive">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="email"
                        placeholder="nuova@email.it"
                        value={newDestinatario}
                        onChange={e => setNewDestinatario(e.target.value)}
                        className="h-8 text-sm max-w-xs"
                        onKeyDown={e => e.key === "Enter" && addDestinatario()}
                      />
                      <Button size="sm" variant="outline" onClick={addDestinatario} className="h-8">
                        <Plus className="h-3 w-3 mr-1" /> Aggiungi
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* History + Actions */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="font-heading font-semibold text-foreground">Storico Notifiche Inviate</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {mockNotificheEmail.filter(n => n.stato_invio === "inviata").length} inviate · {mockNotificheEmail.filter(n => n.stato_invio === "programmata").length} programmate · {mockNotificheEmail.filter(n => n.stato_invio === "errore").length} errori
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={emailFilterCat} onValueChange={v => setEmailFilterCat(v as NotificaEmailTipo | "tutti")}>
                      <SelectTrigger className="w-[150px] h-8 text-xs">
                        <SelectValue placeholder="Categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tutti">Tutte le categorie</SelectItem>
                        <SelectItem value="scadenza_durc">DURC</SelectItem>
                        <SelectItem value="scadenza_formazione">Formazione</SelectItem>
                        <SelectItem value="scadenza_idoneita">Idoneità Sanitaria</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={emailFilterStato} onValueChange={v => setEmailFilterStato(v as NotificaEmailStato | "tutti")}>
                      <SelectTrigger className="w-[140px] h-8 text-xs">
                        <SelectValue placeholder="Stato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tutti">Tutti gli stati</SelectItem>
                        <SelectItem value="inviata">Inviate</SelectItem>
                        <SelectItem value="programmata">Programmate</SelectItem>
                        <SelectItem value="errore">Errori</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" onClick={handleSendNow} className="h-8">
                      <Send className="h-3 w-3 mr-1" /> Invia ora
                    </Button>
                  </div>
                </div>

                <div className="border border-border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Documento</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead className="hidden md:table-cell">Destinatario</TableHead>
                        <TableHead>Scadenza</TableHead>
                        <TableHead>Stato</TableHead>
                        <TableHead className="hidden lg:table-cell">Data Invio</TableHead>
                        <TableHead className="w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEmails.map(n => (
                        <TableRow key={n.id}>
                          <TableCell className="font-medium text-sm">
                            {n.documento_nome.replace(/_/g, " ").replace(".pdf", "")}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">{categoriaEmailMap[n.tipo]}</Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                            {n.destinatario_nome}
                          </TableCell>
                          <TableCell>
                            <span className={`text-xs font-medium ${n.giorni_rimanenti <= 0 ? "text-destructive" : n.giorni_rimanenti <= 15 ? "text-orange-600" : "text-muted-foreground"}`}>
                              {n.giorni_rimanenti <= 0
                                ? `Scaduto (${Math.abs(n.giorni_rimanenti)}gg)`
                                : `${n.giorni_rimanenti}gg`}
                            </span>
                          </TableCell>
                          <TableCell>{statoEmailBadge(n.stato_invio)}</TableCell>
                          <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                            {new Date(n.data_invio).toLocaleDateString("it-IT")}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setPreviewEmail(n)}>
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredEmails.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-sm">
                            Nessuna notifica trovata con i filtri selezionati
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Cantieri assignment dialog */}
      <Dialog open={!!cantieriDialogUser} onOpenChange={v => { if (!v) setCantieriDialogUser(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cantieri di {cantieriDialogUser?.nome} {cantieriDialogUser?.cognome}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2 py-2">
            {mockCantieri.map(c => (
              <label key={c.id} className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox
                  checked={cantieriDialogUser?.cantieri_assegnati.includes(c.id) ?? false}
                  onCheckedChange={checked => {
                    if (cantieriDialogUser) {
                      updateCantieri(cantieriDialogUser.id, c.id, !!checked);
                      setCantieriDialogUser(prev => prev ? {
                        ...prev,
                        cantieri_assegnati: checked
                          ? [...prev.cantieri_assegnati, c.id]
                          : prev.cantieri_assegnati.filter(x => x !== c.id)
                      } : null);
                    }
                  }}
                />
                {c.nome} — {c.comune}
              </label>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Preview Dialog */}
      <Dialog open={!!previewEmail} onOpenChange={v => { if (!v) setPreviewEmail(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> Anteprima Email
            </DialogTitle>
            <DialogDescription>
              Anteprima del contenuto email inviato al destinatario
            </DialogDescription>
          </DialogHeader>
          {previewEmail && (
            <div className="space-y-4">
              <div className="rounded-lg border border-border p-4 space-y-3 bg-muted/30">
                <div className="space-y-1 text-sm">
                  <div className="flex gap-2">
                    <span className="text-muted-foreground w-8">Da:</span>
                    <span className="text-foreground">noreply@cantiereincloud.it</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-muted-foreground w-8">A:</span>
                    <span className="text-foreground">{previewEmail.destinatario_email}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-muted-foreground w-8">Ogg:</span>
                    <span className="text-foreground font-medium">
                      {previewEmail.giorni_rimanenti <= 0
                        ? `⚠️ SCADUTO: ${previewEmail.categoria} — ${previewEmail.documento_nome.replace(/_/g, " ").replace(".pdf", "")}`
                        : `🔔 Scadenza ${previewEmail.categoria} tra ${previewEmail.giorni_rimanenti} giorni`
                      }
                    </span>
                  </div>
                </div>
                <hr className="border-border" />
                <div className="text-sm text-foreground space-y-2">
                  <p>Gentile {previewEmail.destinatario_nome},</p>
                  <p>
                    {previewEmail.giorni_rimanenti <= 0
                      ? `ti informiamo che il documento "${previewEmail.categoria}" relativo a "${previewEmail.documento_nome.replace(/_/g, " ").replace(".pdf", "")}" è scaduto il ${new Date(previewEmail.data_scadenza).toLocaleDateString("it-IT")}.`
                      : `ti informiamo che il documento "${previewEmail.categoria}" relativo a "${previewEmail.documento_nome.replace(/_/g, " ").replace(".pdf", "")}" scadrà il ${new Date(previewEmail.data_scadenza).toLocaleDateString("it-IT")} (tra ${previewEmail.giorni_rimanenti} giorni).`
                    }
                  </p>
                  <p className="font-medium">
                    {previewEmail.giorni_rimanenti <= 0
                      ? "È necessario provvedere al rinnovo immediato per mantenere la conformità del cantiere."
                      : "Ti invitiamo a provvedere al rinnovo prima della scadenza per garantire la continuità operativa."
                    }
                  </p>
                  <p className="text-muted-foreground text-xs mt-4">
                    — Cantiere in Cloud · Notifica automatica
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={() => setPreviewEmail(null)}>Chiudi</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Tab Preferenze Notifiche */}
      <NotificationPreferencesTab />
    </div>
  );
}

function NotificationPreferencesTab() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEmergencyOnly, setSmsEmergencyOnly] = useState(true);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(true);
  const [quietStart, setQuietStart] = useState("22:00");
  const [quietEnd, setQuietEnd] = useState("06:00");
  const [mutedSites, setMutedSites] = useState<string[]>([]);
  const [enabledTypes, setEnabledTypes] = useState({
    scadenza: true, incidente: true, check_in: true, documento: true,
    emergenza: true, sistema: true, meteo: true,
  });

  const typeLabels: Record<string, { label: string; icon: typeof Clock; desc: string }> = {
    scadenza: { label: "Scadenze", icon: Clock, desc: "DURC, formazione, idoneità" },
    incidente: { label: "Sicurezza", icon: ShieldAlert, desc: "Infortuni, near-miss, ispezioni" },
    check_in: { label: "Presenze", icon: UserCheck, desc: "Check-in, assenze anomale" },
    documento: { label: "Documenti", icon: FileText, desc: "Upload, approvazioni, rifiuti" },
    emergenza: { label: "Emergenze", icon: Siren, desc: "Broadcast emergenza (sempre attivo)" },
    sistema: { label: "Sistema", icon: Settings, desc: "Report, aggiornamenti piattaforma" },
    meteo: { label: "Meteo", icon: CloudRain, desc: "Allerte meteo cantieri" },
  };

  const toggleType = (key: string) => {
    if (key === "emergenza") return; // emergenze sempre attive
    setEnabledTypes(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const toggleMuteSite = (siteId: string) => {
    setMutedSites(prev => prev.includes(siteId) ? prev.filter(s => s !== siteId) : [...prev, siteId]);
  };

  return (
    <TabsContent value="preferenze-notifiche">
      <div className="space-y-6 mt-4">
        {/* Canali */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Smartphone className="h-4 w-4" /> Canali di notifica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Push Notifications</p>
                <p className="text-xs text-muted-foreground">Notifiche in tempo reale sul dispositivo</p>
              </div>
              <Switch checked={pushEnabled} onCheckedChange={setPushEnabled} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-xs text-muted-foreground">Riepilogo e alert via email</p>
              </div>
              <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">SMS</p>
                <p className="text-xs text-muted-foreground">Solo per emergenze critiche</p>
              </div>
              <Switch checked={smsEmergencyOnly} onCheckedChange={setSmsEmergencyOnly} />
            </div>
          </CardContent>
        </Card>

        {/* Quiet hours */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" /> Non disturbare
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Attiva ore silenziose</p>
                <p className="text-xs text-muted-foreground">Le emergenze bypassano sempre questa impostazione</p>
              </div>
              <Switch checked={quietHoursEnabled} onCheckedChange={setQuietHoursEnabled} />
            </div>
            {quietHoursEnabled && (
              <div className="flex items-center gap-3">
                <div>
                  <Label className="text-xs">Dalle</Label>
                  <Input type="time" value={quietStart} onChange={e => setQuietStart(e.target.value)} className="w-28 h-8 text-sm" />
                </div>
                <span className="text-muted-foreground mt-4">→</span>
                <div>
                  <Label className="text-xs">Alle</Label>
                  <Input type="time" value={quietEnd} onChange={e => setQuietEnd(e.target.value)} className="w-28 h-8 text-sm" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tipologie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Tipologie di notifica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(typeLabels).map(([key, cfg]) => {
              const Icon = cfg.icon;
              const isEmergency = key === "emergenza";
              return (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{cfg.label}</p>
                      <p className="text-xs text-muted-foreground">{cfg.desc}</p>
                    </div>
                  </div>
                  <Switch
                    checked={enabledTypes[key as keyof typeof enabledTypes]}
                    onCheckedChange={() => toggleType(key)}
                    disabled={isEmergency}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Mute cantieri */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4" /> Silenzia cantieri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">Disattiva temporaneamente le notifiche per singoli cantieri</p>
            {mockCantieri.map(c => (
              <div key={c.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{c.nome}</p>
                  <p className="text-xs text-muted-foreground">{c.comune}</p>
                </div>
                <Switch
                  checked={!mutedSites.includes(c.id)}
                  onCheckedChange={() => toggleMuteSite(c.id)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Button onClick={() => toast.success("Preferenze notifiche salvate")} className="w-full sm:w-auto">
          Salva preferenze
        </Button>
      </div>
    </TabsContent>
  );
}
