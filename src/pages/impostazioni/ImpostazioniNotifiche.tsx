import { useState, useMemo } from "react";
import {
  Settings, Plus, Mail, Send, Eye, CheckCircle2, Clock, AlertTriangle, X,
} from "lucide-react";
import { mockNotificheEmail, mockImpostazioniNotifiche, type NotificaEmailTipo, type NotificaEmailStato } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const categoriaEmailMap: Record<NotificaEmailTipo, string> = {
  scadenza_durc: "DURC", scadenza_formazione: "Formazione", scadenza_idoneita: "Idoneità Sanitaria",
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

export default function ImpostazioniNotifiche() {
  const [emailSettings, setEmailSettings] = useState(mockImpostazioniNotifiche);
  const [emailFilterCat, setEmailFilterCat] = useState<NotificaEmailTipo | "tutti">("tutti");
  const [emailFilterStato, setEmailFilterStato] = useState<NotificaEmailStato | "tutti">("tutti");
  const [previewEmail, setPreviewEmail] = useState<typeof mockNotificheEmail[0] | null>(null);
  const [newDestinatario, setNewDestinatario] = useState("");

  const filteredEmails = useMemo(() => {
    return mockNotificheEmail
      .filter(n => emailFilterCat === "tutti" || n.tipo === emailFilterCat)
      .filter(n => emailFilterStato === "tutti" || n.stato_invio === emailFilterStato)
      .sort((a, b) => new Date(b.data_invio).getTime() - new Date(a.data_invio).getTime());
  }, [emailFilterCat, emailFilterStato]);

  const handleSendNow = () => {
    const pending = mockNotificheEmail.filter(n => n.stato_invio === "programmata").length;
    if (pending === 0) { toast.info("Nessuna notifica programmata da inviare"); return; }
    toast.success(`${pending} notifiche email inviate con successo`);
  };
  const addDestinatario = () => {
    if (!newDestinatario || !newDestinatario.includes("@")) { toast.error("Inserisci un indirizzo email valido"); return; }
    if (emailSettings.email_destinatari.includes(newDestinatario)) { toast.error("Destinatario già presente"); return; }
    setEmailSettings(prev => ({ ...prev, email_destinatari: [...prev.email_destinatari, newDestinatario] }));
    setNewDestinatario(""); toast.success("Destinatario aggiunto");
  };
  const removeDestinatario = (email: string) => {
    setEmailSettings(prev => ({ ...prev, email_destinatari: prev.email_destinatari.filter(e => e !== email) }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-1">
        <Mail className="h-5 w-5 text-primary" />
        <h1 className="font-heading font-bold text-xl text-foreground">Notifiche Email</h1>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Settings className="h-4 w-4" /> Configurazione Notifiche</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { key: "abilitata_durc", label: "DURC", desc: "Scadenza documenti DURC" },
              { key: "abilitata_formazione", label: "Formazione", desc: "Attestati sicurezza" },
              { key: "abilitata_idoneita", label: "Idoneità Sanitaria", desc: "Visite mediche" },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between gap-2 rounded-lg border border-border p-3">
                <div><p className="text-sm font-medium text-foreground">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                <Switch checked={(emailSettings as any)[item.key]} onCheckedChange={(v: boolean) => setEmailSettings((prev: any) => ({ ...prev, [item.key]: v }))} />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Label className="whitespace-nowrap">Preavviso</Label>
            <Select value={String(emailSettings.soglia_giorni)} onValueChange={v => setEmailSettings((prev: any) => ({ ...prev, soglia_giorni: Number(v) }))}>
              <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 giorni</SelectItem>
                <SelectItem value="15">15 giorni</SelectItem>
                <SelectItem value="30">30 giorni</SelectItem>
                <SelectItem value="60">60 giorni</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Destinatari Email</Label>
            <div className="flex flex-wrap gap-2">
              {emailSettings.email_destinatari.map((email: string) => (
                <Badge key={email} variant="secondary" className="gap-1 pr-1">
                  {email}
                  <button onClick={() => removeDestinatario(email)} className="ml-1 hover:text-destructive"><X className="h-3 w-3" /></button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input type="email" placeholder="nuova@email.it" value={newDestinatario} onChange={e => setNewDestinatario(e.target.value)} className="h-8 text-sm max-w-xs" onKeyDown={e => e.key === "Enter" && addDestinatario()} />
              <Button size="sm" variant="outline" onClick={addDestinatario} className="h-8"><Plus className="h-3 w-3 mr-1" /> Aggiungi</Button>
            </div>
          </div>
        </CardContent>
      </Card>

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
              <SelectTrigger className="w-[150px] h-8 text-xs"><SelectValue placeholder="Categoria" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="tutti">Tutte le categorie</SelectItem>
                <SelectItem value="scadenza_durc">DURC</SelectItem>
                <SelectItem value="scadenza_formazione">Formazione</SelectItem>
                <SelectItem value="scadenza_idoneita">Idoneità Sanitaria</SelectItem>
              </SelectContent>
            </Select>
            <Select value={emailFilterStato} onValueChange={v => setEmailFilterStato(v as NotificaEmailStato | "tutti")}>
              <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue placeholder="Stato" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="tutti">Tutti gli stati</SelectItem>
                <SelectItem value="inviata">Inviate</SelectItem>
                <SelectItem value="programmata">Programmate</SelectItem>
                <SelectItem value="errore">Errori</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" onClick={handleSendNow} className="h-8"><Send className="h-3 w-3 mr-1" /> Invia ora</Button>
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
                  <TableCell className="font-medium text-sm">{n.documento_nome.replace(/_/g, " ").replace(".pdf", "")}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{categoriaEmailMap[n.tipo as NotificaEmailTipo]}</Badge></TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{n.destinatario_nome}</TableCell>
                  <TableCell>
                    <span className={`text-xs font-medium ${n.giorni_rimanenti <= 0 ? "text-destructive" : n.giorni_rimanenti <= 15 ? "text-orange-600" : "text-muted-foreground"}`}>
                      {n.giorni_rimanenti <= 0 ? `Scaduto (${Math.abs(n.giorni_rimanenti)}gg)` : `${n.giorni_rimanenti}gg`}
                    </span>
                  </TableCell>
                  <TableCell>{statoEmailBadge(n.stato_invio)}</TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{new Date(n.data_invio).toLocaleDateString("it-IT")}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setPreviewEmail(n)}><Eye className="h-3.5 w-3.5" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredEmails.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-sm">Nessuna notifica trovata</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Email Preview Dialog */}
      <Dialog open={!!previewEmail} onOpenChange={v => { if (!v) setPreviewEmail(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Mail className="h-4 w-4" /> Anteprima Email</DialogTitle>
            <DialogDescription>Anteprima del contenuto email inviato al destinatario</DialogDescription>
          </DialogHeader>
          {previewEmail && (
            <div className="space-y-4">
              <div className="rounded-lg border border-border p-4 space-y-3 bg-muted/30">
                <div className="space-y-1 text-sm">
                  <div className="flex gap-2"><span className="text-muted-foreground w-8">Da:</span><span className="text-foreground">noreply@cantiereincloud.it</span></div>
                  <div className="flex gap-2"><span className="text-muted-foreground w-8">A:</span><span className="text-foreground">{previewEmail.destinatario_email}</span></div>
                  <div className="flex gap-2"><span className="text-muted-foreground w-8">Ogg:</span>
                    <span className="text-foreground font-medium">
                      {previewEmail.giorni_rimanenti <= 0
                        ? `⚠️ SCADUTO: ${previewEmail.categoria} — ${previewEmail.documento_nome.replace(/_/g, " ").replace(".pdf", "")}`
                        : `🔔 Scadenza ${previewEmail.categoria} tra ${previewEmail.giorni_rimanenti} giorni`}
                    </span>
                  </div>
                </div>
                <hr className="border-border" />
                <div className="text-sm text-foreground space-y-2">
                  <p>Gentile {previewEmail.destinatario_nome},</p>
                  <p>{previewEmail.giorni_rimanenti <= 0
                    ? `ti informiamo che il documento "${previewEmail.categoria}" relativo a "${previewEmail.documento_nome.replace(/_/g, " ").replace(".pdf", "")}" è scaduto il ${new Date(previewEmail.data_scadenza).toLocaleDateString("it-IT")}.`
                    : `ti informiamo che il documento "${previewEmail.categoria}" relativo a "${previewEmail.documento_nome.replace(/_/g, " ").replace(".pdf", "")}" scadrà il ${new Date(previewEmail.data_scadenza).toLocaleDateString("it-IT")} (tra ${previewEmail.giorni_rimanenti} giorni).`}</p>
                  <p className="font-medium">{previewEmail.giorni_rimanenti <= 0
                    ? "È necessario provvedere al rinnovo immediato per mantenere la conformità del cantiere."
                    : "Ti invitiamo a provvedere al rinnovo prima della scadenza per garantire la continuità operativa."}</p>
                  <p className="text-muted-foreground text-xs mt-4">— Cantiere in Cloud · Notifica automatica</p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={() => setPreviewEmail(null)}>Chiudi</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
