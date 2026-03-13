import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { mockCantieri, mockLavoratori } from "@/data/mock-data";
import type { CalendarAppuntamento } from "@/data/mock-calendar";
import { CalendarCheck } from "lucide-react";

interface NuovoAppuntamentoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: string; // YYYY-MM-DD
  defaultOraInizio?: string; // HH:MM
  onSave: (app: CalendarAppuntamento) => void;
  editAppuntamento?: CalendarAppuntamento | null;
}

const COLORI: { value: CalendarAppuntamento["colore"]; label: string }[] = [
  { value: "blue", label: "Blu" },
  { value: "purple", label: "Viola" },
  { value: "teal", label: "Verde acqua" },
  { value: "rose", label: "Rosa" },
];

export function NuovoAppuntamentoDialog({ open, onOpenChange, defaultDate, defaultOraInizio, onSave, editAppuntamento }: NuovoAppuntamentoDialogProps) {
  const [titolo, setTitolo] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [data, setData] = useState(defaultDate || "");
  const [oraInizio, setOraInizio] = useState("09:00");
  const [oraFine, setOraFine] = useState("10:00");
  const [cantiereId, setCantiereId] = useState("nessuno");
  const [indirizzo, setIndirizzo] = useState("");
  const [colore, setColore] = useState<CalendarAppuntamento["colore"]>("blue");
  const [selectedWorkers, setSelectedWorkers] = useState<Set<string>>(new Set());

  // Populate form when editing
  useEffect(() => {
    if (editAppuntamento) {
      setTitolo(editAppuntamento.titolo);
      setDescrizione(editAppuntamento.descrizione);
      setData(editAppuntamento.data);
      setOraInizio(editAppuntamento.ora_inizio);
      setOraFine(editAppuntamento.ora_fine);
      setCantiereId(editAppuntamento.cantiere_id || "nessuno");
      setIndirizzo(editAppuntamento.indirizzo || "");
      setColore(editAppuntamento.colore);
      setSelectedWorkers(new Set(editAppuntamento.assegnato_a.map((a) => a.id)));
    } else {
      resetForm();
    }
  }, [editAppuntamento, open]);

  const resetForm = () => {
    setTitolo("");
    setDescrizione("");
    setData(defaultDate || "");
    setOraInizio("09:00");
    setOraFine("10:00");
    setCantiereId("nessuno");
    setIndirizzo("");
    setColore("blue");
    setSelectedWorkers(new Set());
  };

  // Auto-fill address when selecting a cantiere
  const handleCantiereChange = (value: string) => {
    setCantiereId(value);
    if (value !== "nessuno") {
      const cantiere = mockCantieri.find((c) => c.id === value);
      if (cantiere) {
        setIndirizzo(`${cantiere.indirizzo}, ${cantiere.comune}`);
      }
    }
  };

  const handleSave = () => {
    if (!titolo.trim() || !data) return;
    const cantiere = cantiereId !== "nessuno" ? mockCantieri.find((c) => c.id === cantiereId) : undefined;
    const assegnati = mockLavoratori
      .filter((l) => selectedWorkers.has(l.id))
      .map((l) => ({ id: l.id, nome: `${l.nome} ${l.cognome}` }));

    onSave({
      id: editAppuntamento?.id || `app-custom-${Date.now()}`,
      titolo: titolo.trim(),
      descrizione: descrizione.trim(),
      data,
      ora_inizio: oraInizio,
      ora_fine: oraFine,
      cantiere_id: cantiere?.id,
      cantiere_nome: cantiere?.nome,
      indirizzo: indirizzo.trim() || undefined,
      assegnato_a: assegnati,
      colore,
    });
    resetForm();
    onOpenChange(false);
  };

  const toggleWorker = (id: string) => {
    setSelectedWorkers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-primary" />
            {editAppuntamento ? "Modifica Appuntamento" : "Nuovo Appuntamento"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Titolo */}
          <div className="space-y-1.5">
            <Label htmlFor="titolo">Titolo *</Label>
            <Input id="titolo" value={titolo} onChange={(e) => setTitolo(e.target.value)} placeholder="Es. Sopralluogo tecnico" />
          </div>

          {/* Descrizione */}
          <div className="space-y-1.5">
            <Label htmlFor="descrizione">Descrizione</Label>
            <Textarea id="descrizione" value={descrizione} onChange={(e) => setDescrizione(e.target.value)} placeholder="Dettagli sull'appuntamento..." rows={2} />
          </div>

          {/* Indirizzo */}
          <div className="space-y-1.5">
            <Label htmlFor="indirizzo">Indirizzo</Label>
            <Input id="indirizzo" value={indirizzo} onChange={(e) => setIndirizzo(e.target.value)} placeholder="Es. Via Roma 12, Milano" />
          </div>

          {/* Data + Orari */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="data">Data *</Label>
              <Input id="data" type="date" value={data} onChange={(e) => setData(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ora-inizio">Inizio</Label>
              <Input id="ora-inizio" type="time" value={oraInizio} onChange={(e) => setOraInizio(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ora-fine">Fine</Label>
              <Input id="ora-fine" type="time" value={oraFine} onChange={(e) => setOraFine(e.target.value)} />
            </div>
          </div>

          {/* Cantiere + Colore */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Cantiere</Label>
              <Select value={cantiereId} onValueChange={handleCantiereChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="nessuno">Nessun cantiere</SelectItem>
                  {mockCantieri.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Colore</Label>
              <Select value={colore} onValueChange={(v) => setColore(v as CalendarAppuntamento["colore"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {COLORI.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      <span className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${
                          c.value === "blue" ? "bg-blue-500" :
                          c.value === "purple" ? "bg-purple-500" :
                          c.value === "teal" ? "bg-teal-500" : "bg-rose-500"
                        }`} />
                        {c.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assegna a */}
          <div className="space-y-1.5">
            <Label>Assegna a</Label>
            <div className="border border-border rounded-md max-h-[160px] overflow-y-auto divide-y divide-border">
              {mockLavoratori.map((l) => (
                <label key={l.id} className="flex items-center gap-3 px-3 py-2 hover:bg-accent/50 cursor-pointer">
                  <Checkbox
                    checked={selectedWorkers.has(l.id)}
                    onCheckedChange={() => toggleWorker(l.id)}
                  />
                  <span className="text-sm">{l.nome} {l.cognome}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{l.mansione}</span>
                </label>
              ))}
            </div>
            {selectedWorkers.size > 0 && (
              <p className="text-xs text-muted-foreground">{selectedWorkers.size} lavorator{selectedWorkers.size === 1 ? "e" : "i"} selezionat{selectedWorkers.size === 1 ? "o" : "i"}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annulla</Button>
          <Button onClick={handleSave} disabled={!titolo.trim() || !data}>
            {editAppuntamento ? "Salva modifiche" : "Salva appuntamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
