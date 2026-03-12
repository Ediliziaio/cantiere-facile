import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, ChevronLeft, ChevronRight, Check, Plus, Trash2 } from "lucide-react";
import { mockCantieri, mockLavoratori } from "@/data/mock-data";
import {
  AccidentSeverity, AccidentType, CorrectiveAction,
  accidentTypeLabels, severityLabels, dpiStatusLabels,
} from "@/data/mock-safety";
import { toast } from "@/hooks/use-toast";

interface AccidentFormData {
  site_id: string;
  injured_worker_id: string;
  accident_date: string;
  accident_time: string;
  location_precise: string;
  severity: AccidentSeverity | '';
  accident_type: AccidentType | '';
  activity_at_time: string;
  machines_involved: string;
  dpi_status: string;
  description_detailed: string;
  immediate_causes: string;
  root_cause_steps: string[];
  witnesses_worker_ids: string[];
  corrective_actions: Omit<CorrectiveAction, 'completed_date' | 'verified_by'>[];
}

const initialForm: AccidentFormData = {
  site_id: '', injured_worker_id: '', accident_date: '', accident_time: '',
  location_precise: '', severity: '', accident_type: '', activity_at_time: '',
  machines_involved: '', dpi_status: '', description_detailed: '',
  immediate_causes: '', root_cause_steps: [''], witnesses_worker_ids: [],
  corrective_actions: [],
};

const STEPS = ['Dati Base', 'Dettagli', 'Analisi Cause', 'Azioni Correttive', 'Riepilogo'];

export function AccidentReportForm({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<AccidentFormData>(initialForm);

  const update = <K extends keyof AccidentFormData>(key: K, val: AccidentFormData[K]) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const isSevere = form.severity === 'fatal' || form.severity === 'serious';

  const canNext = (): boolean => {
    if (step === 0) return !!(form.site_id && form.injured_worker_id && form.accident_date && form.accident_time && form.severity);
    if (step === 1) {
      if (!form.accident_type || !form.description_detailed) return false;
      if (isSevere && (!form.activity_at_time || !form.dpi_status)) return false;
      return true;
    }
    if (step === 2) {
      if (isSevere && form.witnesses_worker_ids.length === 0) return false;
      return true;
    }
    return true;
  };

  const handleSubmit = () => {
    toast({ title: "Infortunio registrato", description: `Infortunio ${form.severity} registrato con successo. ${isSevere ? 'Notifica INAIL/ASL generata.' : ''}` });
    onClose();
  };

  const toggleWitness = (id: string) => {
    update('witnesses_worker_ids',
      form.witnesses_worker_ids.includes(id)
        ? form.witnesses_worker_ids.filter(w => w !== id)
        : [...form.witnesses_worker_ids, id]
    );
  };

  const addCorrectiveAction = () => {
    update('corrective_actions', [...form.corrective_actions, { action: '', responsible_id: '', deadline: '' }]);
  };

  const updateAction = (idx: number, field: string, val: string) => {
    const updated = [...form.corrective_actions];
    (updated[idx] as any)[field] = val;
    update('corrective_actions', updated);
  };

  const removeAction = (idx: number) => {
    update('corrective_actions', form.corrective_actions.filter((_, i) => i !== idx));
  };

  const siteWorkers = mockLavoratori.filter(l => {
    if (!form.site_id) return true;
    return true; // In mock, show all workers
  });

  return (
    <Card className="border-destructive/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Segnalazione Infortunio
          </CardTitle>
          <Badge variant="outline">{step + 1}/{STEPS.length}</Badge>
        </div>
        <div className="flex gap-1 mt-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1 text-center">
              <div className={`text-[10px] mb-1 truncate ${i === step ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{s}</div>
            </div>
          ))}
        </div>
        <Progress value={(step + 1) / STEPS.length * 100} className="h-1.5" />
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Step 0: Dati Base */}
        {step === 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cantiere *</Label>
                <Select value={form.site_id} onValueChange={v => update('site_id', v)}>
                  <SelectTrigger><SelectValue placeholder="Seleziona cantiere" /></SelectTrigger>
                  <SelectContent>
                    {mockCantieri.map(c => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Lavoratore infortunato *</Label>
                <Select value={form.injured_worker_id} onValueChange={v => update('injured_worker_id', v)}>
                  <SelectTrigger><SelectValue placeholder="Seleziona lavoratore" /></SelectTrigger>
                  <SelectContent>
                    {siteWorkers.map(l => <SelectItem key={l.id} value={l.id}>{l.nome} {l.cognome}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Data infortunio *</Label>
                <Input type="date" value={form.accident_date} onChange={e => update('accident_date', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Ora precisa *</Label>
                <Input type="time" value={form.accident_time} onChange={e => update('accident_time', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Gravità *</Label>
                <Select value={form.severity} onValueChange={v => update('severity', v as AccidentSeverity)}>
                  <SelectTrigger><SelectValue placeholder="Seleziona" /></SelectTrigger>
                  <SelectContent>
                    {(Object.entries(severityLabels)).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {isSevere && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                ⚠️ Infortunio grave/fatale: obbligo notifica INAIL entro 24h e ASL entro 48h.
              </div>
            )}
          </div>
        )}

        {/* Step 1: Dettagli */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo infortunio *</Label>
                <Select value={form.accident_type} onValueChange={v => update('accident_type', v as AccidentType)}>
                  <SelectTrigger><SelectValue placeholder="Seleziona tipo" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(accidentTypeLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Posizione precisa</Label>
                <Input value={form.location_precise} onChange={e => update('location_precise', e.target.value)} placeholder="Es. Piano 3, zona ponteggio nord" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Attività svolta al momento {isSevere && '*'}</Label>
              <Input value={form.activity_at_time} onChange={e => update('activity_at_time', e.target.value)} placeholder="Descrivi l'attività in corso" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Macchine/attrezzature coinvolte {isSevere && '*'}</Label>
                <Input value={form.machines_involved} onChange={e => update('machines_involved', e.target.value)} placeholder="Es. Gru a torre, escavatore" />
              </div>
              <div className="space-y-2">
                <Label>Stato DPI {isSevere && '*'}</Label>
                <Select value={form.dpi_status} onValueChange={v => update('dpi_status', v)}>
                  <SelectTrigger><SelectValue placeholder="Seleziona" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(dpiStatusLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descrizione dettagliata *</Label>
              <Textarea value={form.description_detailed} onChange={e => update('description_detailed', e.target.value)} rows={4} placeholder="Descrivi in dettaglio la dinamica dell'infortunio..." />
            </div>
          </div>
        )}

        {/* Step 2: Analisi Cause */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Cause immediate</Label>
              <Textarea value={form.immediate_causes} onChange={e => update('immediate_causes', e.target.value)} rows={2} placeholder="Quali condizioni hanno causato direttamente l'infortunio?" />
            </div>
            <div className="space-y-2">
              <Label>Analisi root cause (metodo 5 Perché)</Label>
              {form.root_cause_steps.map((s, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <span className="text-xs text-muted-foreground font-mono w-6 shrink-0">#{i + 1}</span>
                  <Input value={s} onChange={e => {
                    const steps = [...form.root_cause_steps];
                    steps[i] = e.target.value;
                    update('root_cause_steps', steps);
                  }} placeholder={`Perché ${i + 1}?`} />
                </div>
              ))}
              {form.root_cause_steps.length < 5 && (
                <Button variant="ghost" size="sm" onClick={() => update('root_cause_steps', [...form.root_cause_steps, ''])}>
                  <Plus className="h-3 w-3 mr-1" /> Aggiungi perché
                </Button>
              )}
            </div>
            <div className="space-y-2">
              <Label>Testimoni {isSevere && '(obbligatorio) *'}</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                {siteWorkers.filter(l => l.id !== form.injured_worker_id).map(l => (
                  <label key={l.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer text-sm">
                    <Checkbox
                      checked={form.witnesses_worker_ids.includes(l.id)}
                      onCheckedChange={() => toggleWitness(l.id)}
                    />
                    {l.nome} {l.cognome}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Azioni Correttive */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Azioni correttive</Label>
              <Button variant="outline" size="sm" onClick={addCorrectiveAction}>
                <Plus className="h-3 w-3 mr-1" /> Aggiungi azione
              </Button>
            </div>
            {form.corrective_actions.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Nessuna azione correttiva aggiunta</p>
            )}
            {form.corrective_actions.map((a, i) => (
              <Card key={i} className="p-3">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-medium text-muted-foreground">Azione #{i + 1}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeAction(i)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <Input value={a.action} onChange={e => updateAction(i, 'action', e.target.value)} placeholder="Descrizione azione correttiva" />
                  <div className="grid grid-cols-2 gap-2">
                    <Select value={a.responsible_id} onValueChange={v => updateAction(i, 'responsible_id', v)}>
                      <SelectTrigger className="text-sm"><SelectValue placeholder="Responsabile" /></SelectTrigger>
                      <SelectContent>
                        {siteWorkers.map(l => <SelectItem key={l.id} value={l.id}>{l.nome} {l.cognome}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Input type="date" value={a.deadline} onChange={e => updateAction(i, 'deadline', e.target.value)} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Step 4: Riepilogo */}
        {step === 4 && (
          <div className="space-y-3 text-sm">
            <h4 className="font-semibold">Riepilogo segnalazione</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <span className="text-muted-foreground">Cantiere:</span>
              <span>{mockCantieri.find(c => c.id === form.site_id)?.nome || '-'}</span>
              <span className="text-muted-foreground">Lavoratore:</span>
              <span>{(() => { const l = mockLavoratori.find(l => l.id === form.injured_worker_id); return l ? `${l.nome} ${l.cognome}` : '-'; })()}</span>
              <span className="text-muted-foreground">Data/Ora:</span>
              <span>{form.accident_date} {form.accident_time}</span>
              <span className="text-muted-foreground">Gravità:</span>
              <span><Badge variant={isSevere ? 'destructive' : 'secondary'}>{form.severity ? severityLabels[form.severity as AccidentSeverity] : '-'}</Badge></span>
              <span className="text-muted-foreground">Tipo:</span>
              <span>{form.accident_type ? accidentTypeLabels[form.accident_type as AccidentType] : '-'}</span>
              <span className="text-muted-foreground">Testimoni:</span>
              <span>{form.witnesses_worker_ids.length}</span>
              <span className="text-muted-foreground">Azioni correttive:</span>
              <span>{form.corrective_actions.length}</span>
            </div>
            {form.description_detailed && (
              <div>
                <span className="text-muted-foreground">Descrizione:</span>
                <p className="mt-1 p-2 bg-muted rounded text-xs">{form.description_detailed}</p>
              </div>
            )}
            {isSevere && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm">
                ⚠️ Verrà generata automaticamente la notifica INAIL/ASL con deadline 24/48h.
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={step === 0 ? onClose : () => setStep(s => s - 1)}>
            <ChevronLeft className="h-4 w-4 mr-1" /> {step === 0 ? 'Annulla' : 'Indietro'}
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep(s => s + 1)} disabled={!canNext()}>
              Avanti <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-destructive hover:bg-destructive/90">
              <Check className="h-4 w-4 mr-1" /> Registra Infortunio
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
