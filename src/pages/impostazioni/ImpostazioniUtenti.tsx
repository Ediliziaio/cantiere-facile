import { useState } from "react";
import {
  Plus, UserCog, Trash2, Shield, ShieldCheck, MoreHorizontal, Users,
} from "lucide-react";
import { mockCantieri, mockUtentiAzienda, type UtenteAzienda, type UtenteRuolo } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

const permessiRuolo = [
  { funzione: "Dashboard", admin: "✅ Completa", manager: "✅ Cantieri assegnati", utente: "✅ Solo i propri dati" },
  { funzione: "Cantieri", admin: "✅ Tutti", manager: "Solo assegnati", utente: "Solo assegnati (lettura)" },
  { funzione: "Documenti", admin: "✅ Tutti", manager: "Solo cantieri assegnati", utente: "Solo i propri" },
  { funzione: "Lavoratori", admin: "✅ Completo", manager: "Sola lettura", utente: "❌" },
  { funzione: "Check-in / Check-out", admin: "✅", manager: "✅", utente: "✅" },
  { funzione: "Comunicazioni", admin: "✅", manager: "✅", utente: "✅" },
  { funzione: "Badge personale", admin: "✅", manager: "✅", utente: "✅" },
  { funzione: "Firma documenti", admin: "✅", manager: "✅", utente: "Se abilitato" },
  { funzione: "Impostazioni", admin: "✅", manager: "❌", utente: "❌" },
  { funzione: "Gestione Utenti", admin: "✅", manager: "❌", utente: "❌" },
];

const getRuoloBadge = (ruolo: UtenteRuolo) => {
  const config = {
    admin: { icon: ShieldCheck, label: "Admin", cls: "bg-primary text-primary-foreground" },
    manager: { icon: Shield, label: "Manager", cls: "bg-accent text-accent-foreground" },
    utente: { icon: Users, label: "Utente", cls: "bg-muted text-muted-foreground" },
  };
  const c = config[ruolo];
  const Icon = c.icon;
  return <Badge variant={ruolo === "admin" ? "default" : "secondary"} className={c.cls}><Icon className="h-3 w-3 mr-1" />{c.label}</Badge>;
};

const getStatoBadge = (stato: UtenteAzienda["stato"]) => {
  const map = {
    attivo: { label: "Attivo", cls: "bg-green-500/10 text-green-700 border-green-500/30" },
    invitato: { label: "Invitato", cls: "bg-yellow-500/10 text-yellow-700 border-yellow-500/30" },
    disabilitato: { label: "Disabilitato", cls: "bg-muted text-muted-foreground border-border" },
  };
  const s = map[stato];
  return <Badge variant="outline" className={s.cls}>{s.label}</Badge>;
};

export default function ImpostazioniUtenti() {
  const [utenti, setUtenti] = useState<UtenteAzienda[]>(mockUtentiAzienda);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [cantieriDialogUser, setCantieriDialogUser] = useState<UtenteAzienda | null>(null);
  const [invNome, setInvNome] = useState("");
  const [invCognome, setInvCognome] = useState("");
  const [invEmail, setInvEmail] = useState("");
  const [invRuolo, setInvRuolo] = useState<UtenteRuolo>("manager");
  const [invCantieri, setInvCantieri] = useState<string[]>([]);

  const resetInviteForm = () => { setInvNome(""); setInvCognome(""); setInvEmail(""); setInvRuolo("manager"); setInvCantieri([]); };

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
    setUtenti(prev => prev.map(u => u.id === id ? { ...u, stato: u.stato === "disabilitato" ? "attivo" : "disabilitato" } : u));
  };
  const changeRuolo = (id: string, ruolo: UtenteRuolo) => {
    setUtenti(prev => prev.map(u => u.id === id ? { ...u, ruolo, cantieri_assegnati: ruolo === "admin" ? [] : u.cantieri_assegnati } : u));
    toast.success("Ruolo aggiornato");
  };
  const removeUser = (id: string) => { setUtenti(prev => prev.filter(u => u.id !== id)); toast.success("Utente rimosso"); };
  const updateCantieri = (userId: string, cantiereId: string, checked: boolean) => {
    setUtenti(prev => prev.map(u => {
      if (u.id !== userId) return u;
      const updated = checked ? [...u.cantieri_assegnati, cantiereId] : u.cantieri_assegnati.filter(c => c !== cantiereId);
      return { ...u, cantieri_assegnati: updated };
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <UserCog className="h-5 w-5 text-primary" />
        <h1 className="font-heading font-bold text-xl text-foreground">Utenti & Accessi</h1>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Admin: accesso completo · Manager: cantieri assegnati · Utente: operativo (check-in, badge, comunicazioni)
        </p>
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
                    <SelectItem value="utente">Utente — operativo (check-in, badge, firma)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {invRuolo !== "admin" && (
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
                      {u.ruolo !== "admin" && <DropdownMenuItem onClick={() => changeRuolo(u.id, "admin")}>Promuovi ad Admin</DropdownMenuItem>}
                      {u.ruolo !== "manager" && (
                        <DropdownMenuItem onClick={() => changeRuolo(u.id, "manager")}>
                          {u.ruolo === "admin" ? "Cambia a Manager" : "Promuovi a Manager"}
                        </DropdownMenuItem>
                      )}
                      {u.ruolo !== "utente" && <DropdownMenuItem onClick={() => changeRuolo(u.id, "utente")}>Cambia a Utente</DropdownMenuItem>}
                      {u.ruolo !== "admin" && <DropdownMenuItem onClick={() => setCantieriDialogUser(u)}>Gestisci Cantieri</DropdownMenuItem>}
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
                            <AlertDialogDescription>L'utente perderà l'accesso all'azienda.</AlertDialogDescription>
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
                <TableHead className="text-center"><Users className="h-3.5 w-3.5 inline mr-1" />Utente</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permessiRuolo.map(p => (
                <TableRow key={p.funzione}>
                  <TableCell className="font-medium text-sm">{p.funzione}</TableCell>
                  <TableCell className="text-center text-sm">{p.admin}</TableCell>
                  <TableCell className="text-center text-sm text-muted-foreground">{p.manager}</TableCell>
                  <TableCell className="text-center text-sm text-muted-foreground">{p.utente}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Cantieri assignment dialog */}
      <Dialog open={!!cantieriDialogUser} onOpenChange={v => { if (!v) setCantieriDialogUser(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Cantieri di {cantieriDialogUser?.nome} {cantieriDialogUser?.cognome}</DialogTitle></DialogHeader>
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
                        cantieri_assegnati: checked ? [...prev.cantieri_assegnati, c.id] : prev.cantieri_assegnati.filter(x => x !== c.id)
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
    </div>
  );
}
