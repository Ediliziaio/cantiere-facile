import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileCheck2, Shield, AlertTriangle, HardHat, GraduationCap, CheckCircle2, XCircle, Pause } from "lucide-react";
import { SafetyPlan, mockCoordinators } from "@/data/mock-safety";
import { mockCantieri, mockLavoratori } from "@/data/mock-data";
import { toast } from "@/hooks/use-toast";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ElementType }> = {
  approved: { label: 'Approvato', variant: 'default', icon: CheckCircle2 },
  draft: { label: 'Bozza', variant: 'secondary', icon: FileCheck2 },
  suspended: { label: 'Sospeso', variant: 'destructive', icon: Pause },
};

function riskColor(p: number, s: number): string {
  const score = p * s;
  if (score >= 9) return 'bg-destructive text-destructive-foreground';
  if (score >= 4) return 'bg-yellow-500 text-white';
  return 'bg-green-600 text-white';
}

export function POSViewer({ plan }: { plan: SafetyPlan }) {
  const site = mockCantieri.find(c => c.id === plan.site_id);
  const csp = mockCoordinators.find(c => c.id === plan.coordinator_csp_id);
  const cse = mockCoordinators.find(c => c.id === plan.coordinator_cse_id);
  const cfg = statusConfig[plan.status] || statusConfig.draft;
  const StatusIcon = cfg.icon;

  const handleApprove = () => {
    toast({ title: "POS Approvato", description: `Piano versione ${plan.version_number} approvato con successo.` });
  };

  const handleSuspend = () => {
    toast({ title: "POS Sospeso", description: "Il piano è stato sospeso. È necessaria una revisione." });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileCheck2 className="h-5 w-5 text-primary" />
              Piano Operativo Sicurezza — v{plan.version_number}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{site?.nome || plan.site_id}</p>
          </div>
          <Badge variant={cfg.variant} className="flex items-center gap-1">
            <StatusIcon className="h-3 w-3" /> {cfg.label}
          </Badge>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-sm">
          <div><span className="text-muted-foreground">CSP:</span> <span className="font-medium">{csp?.name || '-'}</span></div>
          <div><span className="text-muted-foreground">CSE:</span> <span className="font-medium">{cse?.name || '-'}</span></div>
          <div><span className="text-muted-foreground">Approvazione:</span> <span className="font-medium">{plan.approval_date || 'In attesa'}</span></div>
          <div><span className="text-muted-foreground">Scadenza:</span> <span className="font-medium">{plan.expiry_date}</span></div>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={['rischi']} className="space-y-2">
          {/* Valutazione Rischi */}
          <AccordionItem value="rischi" className="border rounded-lg px-3">
            <AccordionTrigger className="py-3 hover:no-underline">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="font-medium text-sm">Valutazione Rischi ({plan.content.valutazione_rischi.length})</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              {/* Risk Matrix Legend */}
              <div className="flex gap-3 text-xs mb-3">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-600" /> Basso</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-500" /> Medio</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-destructive" /> Alto</span>
              </div>
              <div className="space-y-2">
                {plan.content.valutazione_rischi.map((r, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 p-2 rounded-md bg-muted/50">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Badge className={`text-[10px] shrink-0 ${riskColor(r.probability, r.severity)}`}>
                        {r.probability}×{r.severity}={r.probability * r.severity}
                      </Badge>
                      <span className="text-sm font-medium">{r.risk_type}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{r.mitigation_measures}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Procedure Emergenza */}
          <AccordionItem value="emergenza" className="border rounded-lg px-3">
            <AccordionTrigger className="py-3 hover:no-underline">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-destructive" />
                <span className="font-medium text-sm">Procedure Emergenza</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-3 space-y-3">
              <div>
                <span className="text-xs text-muted-foreground">Punto di raccolta:</span>
                <p className="text-sm font-medium">{plan.content.procedure_emergenza.assembly_point}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Vie di fuga:</span>
                <ul className="list-disc list-inside text-sm">
                  {plan.content.procedure_emergenza.escape_routes.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Contatti emergenza:</span>
                <div className="space-y-1 mt-1">
                  {plan.content.procedure_emergenza.emergency_contacts.map((c, i) => (
                    <div key={i} className="flex justify-between text-sm bg-muted/50 rounded px-2 py-1">
                      <span>{c.name} <span className="text-muted-foreground">({c.role})</span></span>
                      <span className="font-mono">{c.phone}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* DPI */}
          <AccordionItem value="dpi" className="border rounded-lg px-3">
            <AccordionTrigger className="py-3 hover:no-underline">
              <div className="flex items-center gap-2">
                <HardHat className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">DPI ({plan.content.dispositivi_protezione.length})</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              <div className="grid gap-2">
                {plan.content.dispositivi_protezione.map((d, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-md bg-muted/50 text-sm">
                    <span>{d.type}</span>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Qtà: {d.required_quantity}</span>
                      <span>Forniti: {d.provided_date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Formazione */}
          <AccordionItem value="formazione" className="border rounded-lg px-3">
            <AccordionTrigger className="py-3 hover:no-underline">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-green-600" />
                <span className="font-medium text-sm">Formazione Obbligatoria</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              <div className="space-y-2">
                {plan.content.formazione_obbligatoria.map((f, i) => (
                  <div key={i} className="p-2 rounded-md bg-muted/50">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{f.topic}</span>
                      <Badge variant={f.completion_date ? 'default' : 'secondary'} className="text-[10px]">
                        {f.completion_date ? 'Completato' : 'Da completare'}
                      </Badge>
                    </div>
                    <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                      <span>{f.hours}h</span>
                      <span>{f.worker_ids.length} lavoratori</span>
                      {f.completion_date && <span>Completato: {f.completion_date}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Actions */}
        <div className="flex gap-2 mt-6 pt-4 border-t justify-end">
          {plan.status === 'draft' && (
            <Button onClick={handleApprove}>
              <CheckCircle2 className="h-4 w-4 mr-1" /> Approva POS
            </Button>
          )}
          {plan.status === 'approved' && (
            <Button variant="destructive" onClick={handleSuspend}>
              <XCircle className="h-4 w-4 mr-1" /> Sospendi POS
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
