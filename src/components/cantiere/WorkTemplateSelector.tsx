import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockWorkTemplates } from "@/data/mock-avanzamento";
import type { WorkPhase, WorkStep } from "@/data/mock-avanzamento";

interface WorkTemplateSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cantiereId: string;
  onAdd: (phases: WorkPhase[]) => void;
}

export function WorkTemplateSelector({ open, onOpenChange, cantiereId, onAdd }: WorkTemplateSelectorProps) {
  const [tab, setTab] = useState("template");
  const [customName, setCustomName] = useState("");
  const [customSteps, setCustomSteps] = useState<string[]>([""]);

  const handleTemplateSelect = (templateId: string) => {
    const tpl = mockWorkTemplates.find((t) => t.id === templateId);
    if (!tpl) return;
    const phases: WorkPhase[] = tpl.fasi.map((f, i) => ({
      id: `wp-new-${Date.now()}-${i}`,
      cantiere_id: cantiereId,
      nome: f.nome,
      stato: "da_iniziare",
      ordine: i + 1,
      steps: f.steps.map((s, j) => ({
        id: `ws-new-${Date.now()}-${i}-${j}`,
        nome: s.nome,
        stato: "da_completare",
        data_completamento: null,
        note: "",
      })),
    }));
    onAdd(phases);
    onOpenChange(false);
  };

  const handleCustomAdd = () => {
    if (!customName.trim()) return;
    const validSteps = customSteps.filter((s) => s.trim());
    if (validSteps.length === 0) return;
    const phase: WorkPhase = {
      id: `wp-new-${Date.now()}`,
      cantiere_id: cantiereId,
      nome: customName.trim(),
      stato: "da_iniziare",
      ordine: 1,
      steps: validSteps.map((s, i) => ({
        id: `ws-new-${Date.now()}-${i}`,
        nome: s.trim(),
        stato: "da_completare",
        data_completamento: null,
        note: "",
      })),
    };
    onAdd([phase]);
    setCustomName("");
    setCustomSteps([""]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Aggiungi fase di lavoro</DialogTitle>
        </DialogHeader>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full">
            <TabsTrigger value="template" className="flex-1">Da template</TabsTrigger>
            <TabsTrigger value="custom" className="flex-1">Personalizzata</TabsTrigger>
          </TabsList>

          <TabsContent value="template" className="space-y-3 mt-3">
            {mockWorkTemplates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => handleTemplateSelect(tpl.id)}
                className="w-full text-left border border-border rounded-lg p-3 hover:bg-accent transition-colors"
              >
                <p className="text-sm font-medium text-foreground">{tpl.nome}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{tpl.descrizione}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {tpl.fasi.length} fasi · {tpl.fasi.reduce((a, f) => a + f.steps.length, 0)} step totali
                </p>
              </button>
            ))}
          </TabsContent>

          <TabsContent value="custom" className="space-y-3 mt-3">
            <div className="space-y-1.5">
              <Label>Nome fase</Label>
              <Input value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="Es. Preparazione terreno" />
            </div>
            <div className="space-y-1.5">
              <Label>Step</Label>
              {customSteps.map((step, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={step}
                    onChange={(e) => {
                      const next = [...customSteps];
                      next[i] = e.target.value;
                      setCustomSteps(next);
                    }}
                    placeholder={`Step ${i + 1}`}
                  />
                  {customSteps.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => setCustomSteps(customSteps.filter((_, j) => j !== i))}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setCustomSteps([...customSteps, ""])} className="mt-1">
                <Plus className="h-3.5 w-3.5 mr-1" /> Aggiungi step
              </Button>
            </div>
            <DialogFooter>
              <Button onClick={handleCustomAdd} disabled={!customName.trim() || customSteps.every((s) => !s.trim())}>
                Aggiungi fase
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
