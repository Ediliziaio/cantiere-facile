import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ClipboardCheck, CheckCircle2, XCircle, MinusCircle, Camera, Save } from "lucide-react";
import { checklistTemplate, ChecklistItemStatus, SafetyInspection } from "@/data/mock-safety";
import { mockCantieri } from "@/data/mock-data";
import { toast } from "@/hooks/use-toast";

interface ChecklistState {
  [itemKey: string]: { status: ChecklistItemStatus; note: string };
}

interface Props {
  inspection?: SafetyInspection;
  onClose?: () => void;
}

export function SafetyChecklist({ inspection, onClose }: Props) {
  const [siteId, setSiteId] = useState(inspection?.site_id || '');
  const [checklist, setChecklist] = useState<ChecklistState>(() => {
    if (inspection) {
      const state: ChecklistState = {};
      inspection.checklist_items.forEach(item => {
        state[`${item.category}-${item.description}`] = { status: item.status, note: item.note };
      });
      return state;
    }
    return {};
  });

  const getItemState = (cat: string, desc: string) =>
    checklist[`${cat}-${desc}`] || { status: 'na' as ChecklistItemStatus, note: '' };

  const setItemState = (cat: string, desc: string, field: 'status' | 'note', value: string) => {
    setChecklist(prev => ({
      ...prev,
      [`${cat}-${desc}`]: { ...getItemState(cat, desc), [field]: value },
    }));
  };

  const totalItems = checklistTemplate.reduce((s, c) => s + c.items.length, 0);
  const checkedItems = Object.values(checklist).filter(v => v.status === 'ok' || v.status === 'ko').length;
  const okItems = Object.values(checklist).filter(v => v.status === 'ok').length;
  const koItems = Object.values(checklist).filter(v => v.status === 'ko').length;
  const score = checkedItems > 0 ? Math.round((okItems / (okItems + koItems)) * 100) : 0;

  const handleSave = () => {
    toast({ title: "Ispezione salvata", description: `Score: ${score}%. Prossima ispezione programmata tra 30 giorni.` });
    onClose?.();
  };

  const statusIcon = (s: ChecklistItemStatus) => {
    if (s === 'ok') return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    if (s === 'ko') return <XCircle className="h-4 w-4 text-destructive" />;
    return <MinusCircle className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ClipboardCheck className="h-5 w-5 text-primary" />
          {inspection ? 'Dettaglio Ispezione' : 'Nuova Ispezione Sicurezza'}
        </CardTitle>
        <div className="flex flex-wrap gap-4 mt-2">
          {!inspection && (
            <div className="w-48">
              <Select value={siteId} onValueChange={setSiteId}>
                <SelectTrigger className="text-sm"><SelectValue placeholder="Cantiere" /></SelectTrigger>
                <SelectContent>
                  {mockCantieri.map(c => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm">
            <Badge variant="secondary">{checkedItems}/{totalItems} controllati</Badge>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">{okItems} OK</Badge>
            {koItems > 0 && <Badge variant="destructive">{koItems} KO</Badge>}
          </div>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <Progress value={checkedItems / totalItems * 100} className="flex-1 h-2" />
          <span className="text-sm font-semibold text-primary">{score}%</span>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={checklistTemplate.map(c => c.cat)} className="space-y-2">
          {checklistTemplate.map(cat => {
            const catOk = cat.items.filter(d => getItemState(cat.cat, d).status === 'ok').length;
            const catKo = cat.items.filter(d => getItemState(cat.cat, d).status === 'ko').length;
            return (
              <AccordionItem key={cat.cat} value={cat.cat} className="border rounded-lg px-3">
                <AccordionTrigger className="py-3 hover:no-underline">
                  <div className="flex items-center gap-3 flex-1 text-left">
                    <span className="font-medium text-sm">{cat.cat}</span>
                    <div className="flex gap-1 ml-auto mr-2">
                      {catOk > 0 && <Badge variant="outline" className="text-[10px] text-green-700 border-green-300">{catOk} ok</Badge>}
                      {catKo > 0 && <Badge variant="outline" className="text-[10px] text-destructive border-destructive/30">{catKo} ko</Badge>}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-3 space-y-2">
                  {cat.items.map(desc => {
                    const state = getItemState(cat.cat, desc);
                    return (
                      <div key={desc} className="flex flex-col sm:flex-row sm:items-center gap-2 p-2 rounded-md bg-muted/50">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {statusIcon(state.status)}
                          <span className="text-sm truncate">{desc}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex border rounded-md overflow-hidden">
                            {(['ok', 'ko', 'na'] as ChecklistItemStatus[]).map(s => (
                              <button
                                key={s}
                                onClick={() => setItemState(cat.cat, desc, 'status', s)}
                                className={`px-2 py-1 text-xs font-medium transition-colors ${
                                  state.status === s
                                    ? s === 'ok' ? 'bg-green-600 text-white' : s === 'ko' ? 'bg-destructive text-destructive-foreground' : 'bg-muted-foreground text-white'
                                    : 'bg-background text-muted-foreground hover:bg-accent'
                                }`}
                              >
                                {s.toUpperCase()}
                              </button>
                            ))}
                          </div>
                          <Input
                            value={state.note}
                            onChange={e => setItemState(cat.cat, desc, 'note', e.target.value)}
                            placeholder="Note..."
                            className="w-32 h-7 text-xs"
                          />
                          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" title="Scatta foto">
                            <Camera className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        <div className="flex justify-between mt-6 pt-4 border-t">
          {onClose && <Button variant="outline" onClick={onClose}>Annulla</Button>}
          <Button onClick={handleSave} className="ml-auto">
            <Save className="h-4 w-4 mr-1" /> Salva Ispezione
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
