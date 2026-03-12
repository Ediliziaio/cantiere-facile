import { useState } from "react";
import { AlertTriangle, Radio, Send, Users, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { mockCantieri } from "@/data/mock-data";
import { emergencyTemplates } from "@/data/mock-notifications";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

export function EmergencyBroadcastModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedSite, setSelectedSite] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [sending, setSending] = useState(false);

  const site = mockCantieri.find(c => c.id === selectedSite);
  const template = emergencyTemplates.find(t => t.id === selectedTemplate);
  const finalMessage = customMessage || template?.message || "";

  const reset = () => {
    setStep(1);
    setSelectedSite("");
    setSelectedTemplate("");
    setCustomMessage("");
    setSending(false);
  };

  const handleConfirm = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setStep(3);
      toast.success("Emergenza broadcast inviato con successo", {
        description: `${site?.lavoratori_count} persone notificate via push, SMS ed email`,
      });
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={v => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className="gap-1.5 h-8">
          <Radio className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Emergenza</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" /> Broadcast Emergenza
          </DialogTitle>
          <DialogDescription>
            Invia una notifica urgente a tutti i presenti in cantiere via push, SMS ed email.
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label>Cantiere</Label>
              <Select value={selectedSite} onValueChange={setSelectedSite}>
                <SelectTrigger><SelectValue placeholder="Seleziona cantiere" /></SelectTrigger>
                <SelectContent>
                  {mockCantieri.filter(c => c.stato === "attivo").map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nome} — {c.comune} ({c.lavoratori_count} operai)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tipo emergenza</Label>
              <Select value={selectedTemplate} onValueChange={v => {
                setSelectedTemplate(v);
                const t = emergencyTemplates.find(t => t.id === v);
                if (t) setCustomMessage(t.message);
              }}>
                <SelectTrigger><SelectValue placeholder="Seleziona template" /></SelectTrigger>
                <SelectContent>
                  {emergencyTemplates.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Messaggio</Label>
              <Textarea
                value={customMessage}
                onChange={e => setCustomMessage(e.target.value)}
                placeholder="Scrivi o modifica il messaggio di emergenza..."
                rows={3}
              />
            </div>
            <Button
              onClick={() => setStep(2)}
              disabled={!selectedSite || !finalMessage}
              className="w-full"
            >
              Continua — Verifica destinatari
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 space-y-3">
              <h3 className="font-semibold text-sm text-foreground">Riepilogo invio</h3>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cantiere</span>
                  <span className="font-medium">{site?.nome}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo</span>
                  <Badge variant="destructive">{template?.label || "Personalizzato"}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Destinatari</span>
                  <span className="font-medium flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" /> {site?.lavoratori_count} persone
                  </span>
                </div>
              </div>
              <div className="bg-background rounded p-3 text-sm border">
                <p className="font-medium text-xs text-muted-foreground mb-1">Messaggio:</p>
                {finalMessage}
              </div>
              <div className="flex gap-1.5 flex-wrap">
                <Badge variant="outline" className="text-[10px]">📱 Push</Badge>
                <Badge variant="outline" className="text-[10px]">📧 Email</Badge>
                <Badge variant="outline" className="text-[10px]">📲 SMS</Badge>
              </div>
            </div>

            <div className="rounded-lg border border-orange-500/30 bg-orange-500/5 p-3">
              <p className="text-sm font-medium text-orange-700">⚠️ Azione irreversibile</p>
              <p className="text-xs text-muted-foreground mt-1">
                Questa azione invierà una notifica di emergenza a tutti i presenti in cantiere e ai contatti esterni (ASL, coordinatore sicurezza).
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Indietro
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirm}
                disabled={sending}
                className="flex-1 gap-1.5"
              >
                {sending ? (
                  <>
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Invio in corso...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Conferma invio
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-4 py-4">
            <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">Broadcast inviato</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {site?.lavoratori_count} persone notificate al cantiere {site?.nome}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-muted p-2">
                <p className="text-lg font-bold text-foreground">{site?.lavoratori_count}</p>
                <p className="text-[10px] text-muted-foreground">Push inviati</p>
              </div>
              <div className="rounded-lg bg-muted p-2">
                <p className="text-lg font-bold text-foreground">{site?.lavoratori_count}</p>
                <p className="text-[10px] text-muted-foreground">SMS inviati</p>
              </div>
              <div className="rounded-lg bg-muted p-2">
                <p className="text-lg font-bold text-foreground">{(site?.lavoratori_count || 0) + 3}</p>
                <p className="text-[10px] text-muted-foreground">Email inviate</p>
              </div>
            </div>
            <Button onClick={() => { setOpen(false); reset(); }} className="w-full">
              Chiudi
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
