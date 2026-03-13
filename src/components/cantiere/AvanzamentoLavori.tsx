import { useState } from "react";
import { ChevronDown, Plus, CheckCircle2, Circle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { WorkTemplateSelector } from "./WorkTemplateSelector";
import { mockWorkPhases } from "@/data/mock-avanzamento";
import type { WorkPhase, FaseStato } from "@/data/mock-avanzamento";
import { cn } from "@/lib/utils";

interface AvanzamentoLavoriProps {
  cantiereId: string;
}

const statoBadge: Record<FaseStato, { label: string; className: string }> = {
  da_iniziare: { label: "Da iniziare", className: "bg-muted text-muted-foreground" },
  in_corso: { label: "In corso", className: "bg-warning/15 text-warning border-warning/30" },
  completato: { label: "Completato", className: "bg-success/15 text-success border-success/30" },
};

function calcFaseStato(phase: WorkPhase): FaseStato {
  const done = phase.steps.filter((s) => s.stato === "completato").length;
  if (done === 0) return "da_iniziare";
  if (done === phase.steps.length) return "completato";
  return "in_corso";
}

export function AvanzamentoLavori({ cantiereId }: AvanzamentoLavoriProps) {
  const [phases, setPhases] = useState<WorkPhase[]>(() =>
    mockWorkPhases.filter((p) => p.cantiere_id === cantiereId)
  );
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [openPhases, setOpenPhases] = useState<Set<string>>(() => {
    const inCorso = phases.find((p) => calcFaseStato(p) === "in_corso");
    return new Set(inCorso ? [inCorso.id] : []);
  });

  const totalSteps = phases.reduce((a, p) => a + p.steps.length, 0);
  const completedSteps = phases.reduce((a, p) => a + p.steps.filter((s) => s.stato === "completato").length, 0);
  const pctGlobal = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  const toggleStep = (phaseId: string, stepId: string) => {
    setPhases((prev) =>
      prev.map((p) => {
        if (p.id !== phaseId) return p;
        const updatedSteps = p.steps.map((s) => {
          if (s.id !== stepId) return s;
          const newStato = s.stato === "completato" ? "da_completare" : "completato";
          return { ...s, stato: newStato as any, data_completamento: newStato === "completato" ? new Date().toISOString().slice(0, 10) : null };
        });
        return { ...p, steps: updatedSteps, stato: calcFaseStato({ ...p, steps: updatedSteps }) };
      })
    );
  };

  const updateNote = (phaseId: string, stepId: string, note: string) => {
    setPhases((prev) =>
      prev.map((p) =>
        p.id !== phaseId ? p : { ...p, steps: p.steps.map((s) => (s.id !== stepId ? s : { ...s, note })) }
      )
    );
  };

  const togglePhaseOpen = (id: string) => {
    setOpenPhases((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleAddPhases = (newPhases: WorkPhase[]) => {
    setPhases((prev) => {
      const maxOrdine = prev.reduce((a, p) => Math.max(a, p.ordine), 0);
      return [...prev, ...newPhases.map((p, i) => ({ ...p, ordine: maxOrdine + i + 1 }))];
    });
  };

  return (
    <div className="space-y-4">
      {/* Progress globale */}
      <div className="border border-border rounded-lg p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Avanzamento complessivo</span>
          <span className="text-sm font-semibold text-foreground">{pctGlobal}%</span>
        </div>
        <Progress value={pctGlobal} className="h-2.5" />
        <p className="text-xs text-muted-foreground">{completedSteps} di {totalSteps} step completati · {phases.length} fasi</p>
      </div>

      {/* Fasi */}
      {phases.length === 0 && (
        <div className="text-center py-8 border border-dashed border-border rounded-lg">
          <p className="text-sm text-muted-foreground mb-3">Nessuna fase di lavoro configurata</p>
          <Button variant="outline" size="sm" onClick={() => setSelectorOpen(true)}>
            <Plus className="h-3.5 w-3.5 mr-1" /> Aggiungi fase
          </Button>
        </div>
      )}

      {phases
        .sort((a, b) => a.ordine - b.ordine)
        .map((phase) => {
          const stato = calcFaseStato(phase);
          const phaseDone = phase.steps.filter((s) => s.stato === "completato").length;
          const phasePct = phase.steps.length > 0 ? Math.round((phaseDone / phase.steps.length) * 100) : 0;
          const badge = statoBadge[stato];

          return (
            <Collapsible key={phase.id} open={openPhases.has(phase.id)} onOpenChange={() => togglePhaseOpen(phase.id)}>
              <div className="border border-border rounded-lg overflow-hidden">
                <CollapsibleTrigger className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors text-left">
                  {stato === "completato" ? (
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  ) : stato === "in_corso" ? (
                    <Clock className="h-4 w-4 text-warning shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground truncate">{phase.nome}</span>
                      <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.className)}>{badge.label}</Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={phasePct} className="h-1.5 flex-1 max-w-[120px]" />
                      <span className="text-[10px] text-muted-foreground">{phaseDone}/{phase.steps.length}</span>
                    </div>
                  </div>
                  <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform shrink-0", openPhases.has(phase.id) && "rotate-180")} />
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="border-t border-border divide-y divide-border">
                    {phase.steps.map((step) => (
                      <div key={step.id} className="px-4 py-2.5 flex items-start gap-3">
                        <Checkbox
                          checked={step.stato === "completato"}
                          onCheckedChange={() => toggleStep(phase.id, step.id)}
                          className="mt-0.5"
                        />
                        <div className="flex-1 min-w-0 space-y-1">
                          <span className={cn("text-sm", step.stato === "completato" ? "line-through text-muted-foreground" : "text-foreground")}>
                            {step.nome}
                          </span>
                          {step.data_completamento && (
                            <p className="text-[10px] text-muted-foreground">
                              Completato il {new Date(step.data_completamento).toLocaleDateString("it-IT")}
                            </p>
                          )}
                          <Input
                            value={step.note}
                            onChange={(e) => updateNote(phase.id, step.id, e.target.value)}
                            placeholder="Note…"
                            className="h-7 text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          );
        })}

      {phases.length > 0 && (
        <Button variant="outline" size="sm" onClick={() => setSelectorOpen(true)}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Aggiungi fase
        </Button>
      )}

      <WorkTemplateSelector
        open={selectorOpen}
        onOpenChange={setSelectorOpen}
        cantiereId={cantiereId}
        onAdd={handleAddPhases}
      />
    </div>
  );
}
