import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShieldAlert, AlertTriangle, ClipboardCheck, FileCheck2, Users,
  TrendingUp, Plus, Eye, Calendar, HardHat,
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import {
  mockSafetyPlans, mockAccidents, mockInspections, mockCoordinators,
  mockPendingNotifications, severityLabels, accidentTypeLabels,
} from "@/data/mock-safety";
import { mockCantieri, mockLavoratori } from "@/data/mock-data";
import { AccidentReportForm } from "@/components/sicurezza/AccidentReportForm";
import { SafetyChecklist } from "@/components/sicurezza/SafetyChecklist";
import { POSViewer } from "@/components/sicurezza/POSViewer";
import { NotificationPanel } from "@/components/sicurezza/NotificationPanel";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// ─── Stats ───
const accidentsLast12 = mockAccidents.filter(a => {
  const d = new Date(a.accident_date);
  const yearAgo = new Date();
  yearAgo.setFullYear(yearAgo.getFullYear() - 1);
  return d >= yearAgo;
});

const seriousCount = accidentsLast12.filter(a => a.severity === 'serious' || a.severity === 'fatal').length;
const nearMissCount = accidentsLast12.filter(a => a.severity === 'near_miss').length;
const pendingNotifs = mockPendingNotifications.filter(n => n.status === 'da_inviare').length;

// Monthly trend (mock)
const trendData = [
  { month: 'Set', infortuni: 0, near_miss: 1 },
  { month: 'Ott', infortuni: 0, near_miss: 0 },
  { month: 'Nov', infortuni: 0, near_miss: 0 },
  { month: 'Dic', infortuni: 0, near_miss: 0 },
  { month: 'Gen', infortuni: 1, near_miss: 0 },
  { month: 'Feb', infortuni: 1, near_miss: 0 },
  { month: 'Mar', infortuni: 0, near_miss: 1 },
];

export default function Sicurezza() {
  const [showAccidentForm, setShowAccidentForm] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedInspection, setSelectedInspection] = useState<string | null>(null);

  const viewedPlan = mockSafetyPlans.find(p => p.id === selectedPlan);
  const viewedInspection = mockInspections.find(i => i.id === selectedInspection);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-primary" /> Sicurezza Cantieri
          </h1>
          <p className="text-sm text-muted-foreground">D.Lgs 81/2008 — Piano Operativo, Infortuni, Ispezioni</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowChecklist(true)}>
            <ClipboardCheck className="h-4 w-4 mr-1" /> Nuova Ispezione
          </Button>
          <Button variant="destructive" onClick={() => setShowAccidentForm(true)}>
            <AlertTriangle className="h-4 w-4 mr-1" /> Segnala Infortunio
          </Button>
        </div>
      </div>

      {/* Alert critici */}
      {(pendingNotifs > 0 || mockSafetyPlans.some(p => p.status === 'draft')) && (
        <div className="space-y-2">
          {pendingNotifs > 0 && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm">
              <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
              <span className="text-destructive font-medium">{pendingNotifs} notifica/e obbligatoria/e INAIL/ASL da inviare</span>
            </div>
          )}
          {mockSafetyPlans.filter(p => p.status === 'draft').map(p => (
            <div key={p.id} className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm">
              <FileCheck2 className="h-4 w-4 text-yellow-600 shrink-0" />
              <span>POS cantiere <strong>{mockCantieri.find(c => c.id === p.site_id)?.nome}</strong> in bozza — da approvare</span>
            </div>
          ))}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Infortuni 12 mesi</div>
            <div className="text-2xl font-bold mt-1">{accidentsLast12.length}</div>
            <div className="text-xs text-muted-foreground">{seriousCount} gravi</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Near Miss</div>
            <div className="text-2xl font-bold mt-1">{nearMissCount}</div>
            <div className="text-xs text-muted-foreground">Quasi infortuni</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">POS Attivi</div>
            <div className="text-2xl font-bold mt-1">{mockSafetyPlans.filter(p => p.status === 'approved').length}</div>
            <div className="text-xs text-muted-foreground">{mockSafetyPlans.filter(p => p.status === 'draft').length} bozze</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Ispezioni mese</div>
            <div className="text-2xl font-bold mt-1">{mockInspections.filter(i => i.inspection_date >= '2026-03-01').length}</div>
            <div className="text-xs text-muted-foreground">Score medio: {Math.round(mockInspections.reduce((s, i) => s + i.overall_score, 0) / mockInspections.length)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> Trend Infortuni (ultimi 7 mesi)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis allowDecimals={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip />
                <Area type="monotone" dataKey="infortuni" stackId="1" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" fillOpacity={0.3} name="Infortuni" />
                <Area type="monotone" dataKey="near_miss" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} name="Near Miss" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="pos" className="space-y-4">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="pos"><FileCheck2 className="h-3.5 w-3.5 mr-1" /> POS</TabsTrigger>
          <TabsTrigger value="infortuni"><AlertTriangle className="h-3.5 w-3.5 mr-1" /> Infortuni</TabsTrigger>
          <TabsTrigger value="ispezioni"><ClipboardCheck className="h-3.5 w-3.5 mr-1" /> Ispezioni</TabsTrigger>
          <TabsTrigger value="notifiche"><ShieldAlert className="h-3.5 w-3.5 mr-1" /> Notifiche</TabsTrigger>
          <TabsTrigger value="coordinatori"><Users className="h-3.5 w-3.5 mr-1" /> Coordinatori</TabsTrigger>
        </TabsList>

        {/* POS Tab */}
        <TabsContent value="pos" className="space-y-4">
          {selectedPlan && viewedPlan ? (
            <div>
              <Button variant="ghost" size="sm" className="mb-2" onClick={() => setSelectedPlan(null)}>← Torna alla lista</Button>
              <POSViewer plan={viewedPlan} />
            </div>
          ) : (
            <div className="space-y-3">
              {mockSafetyPlans.map(plan => {
                const site = mockCantieri.find(c => c.id === plan.site_id);
                return (
                  <Card key={plan.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedPlan(plan.id)}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <FileCheck2 className={`h-5 w-5 shrink-0 ${plan.status === 'approved' ? 'text-green-600' : plan.status === 'draft' ? 'text-yellow-600' : 'text-destructive'}`} />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{site?.nome} — v{plan.version_number}</p>
                          <p className="text-xs text-muted-foreground">Scadenza: {plan.expiry_date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={plan.status === 'approved' ? 'default' : plan.status === 'draft' ? 'secondary' : 'destructive'}>
                          {plan.status === 'approved' ? 'Approvato' : plan.status === 'draft' ? 'Bozza' : 'Sospeso'}
                        </Badge>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Infortuni Tab */}
        <TabsContent value="infortuni" className="space-y-3">
          {mockAccidents.map(acc => {
            const site = mockCantieri.find(c => c.id === acc.site_id);
            const worker = mockLavoratori.find(l => l.id === acc.injured_worker_id);
            return (
              <Card key={acc.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={acc.severity === 'serious' || acc.severity === 'fatal' ? 'destructive' : acc.severity === 'near_miss' ? 'outline' : 'secondary'}>
                          {severityLabels[acc.severity]}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">{accidentTypeLabels[acc.accident_type]}</Badge>
                      </div>
                      <p className="text-sm font-medium mt-1">{worker?.nome} {worker?.cognome} — {site?.nome}</p>
                      <p className="text-xs text-muted-foreground">{acc.accident_date} ore {acc.accident_time} · {acc.location_precise}</p>
                      <p className="text-xs mt-2 text-muted-foreground line-clamp-2">{acc.description_detailed}</p>
                    </div>
                    <div className="text-right shrink-0 space-y-1">
                      {acc.days_absence > 0 && <p className="text-xs"><span className="font-medium">{acc.days_absence}</span> gg assenza</p>}
                      {acc.inail_notification_number && <p className="text-[10px] text-muted-foreground font-mono">{acc.inail_notification_number}</p>}
                      <p className="text-[10px] text-muted-foreground">Azioni: {acc.corrective_actions.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Ispezioni Tab */}
        <TabsContent value="ispezioni" className="space-y-3">
          {selectedInspection && viewedInspection ? (
            <div>
              <Button variant="ghost" size="sm" className="mb-2" onClick={() => setSelectedInspection(null)}>← Torna alla lista</Button>
              <SafetyChecklist inspection={viewedInspection} onClose={() => setSelectedInspection(null)} />
            </div>
          ) : (
            mockInspections.map(insp => {
              const site = mockCantieri.find(c => c.id === insp.site_id);
              const koCount = insp.checklist_items.filter(i => i.status === 'ko').length;
              return (
                <Card key={insp.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedInspection(insp.id)}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <ClipboardCheck className={`h-5 w-5 shrink-0 ${insp.overall_score >= 85 ? 'text-green-600' : insp.overall_score >= 70 ? 'text-yellow-600' : 'text-destructive'}`} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{site?.nome} — {insp.type === 'periodica' ? 'Periodica' : 'Straordinaria'}</p>
                        <p className="text-xs text-muted-foreground">{insp.inspection_date} · Score: {insp.overall_score}% · {koCount} non conformità</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={insp.signed_by_coordinator ? 'default' : 'secondary'} className="text-[10px]">
                        {insp.signed_by_coordinator ? 'Firmata' : 'Da firmare'}
                      </Badge>
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        {/* Notifiche Tab */}
        <TabsContent value="notifiche">
          <NotificationPanel />
        </TabsContent>

        {/* Coordinatori Tab */}
        <TabsContent value="coordinatori" className="space-y-3">
          {mockCoordinators.map(coord => (
            <Card key={coord.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <HardHat className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{coord.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {coord.role.toUpperCase()} · {coord.registration_number}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {coord.specializations.map(s => (
                        <Badge key={s} variant="outline" className="text-[10px]">{s.replace(/_/g, ' ')}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0 text-xs space-y-0.5">
                  <p><span className="font-medium">{coord.current_sites_count}</span>/{coord.max_concurrent_sites} cantieri</p>
                  <Badge variant={coord.available ? 'default' : 'secondary'} className="text-[10px]">
                    {coord.available ? 'Disponibile' : 'Occupato'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Accident Report Dialog */}
      <Dialog open={showAccidentForm} onOpenChange={setShowAccidentForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">Segnalazione Infortunio</DialogTitle>
          <AccidentReportForm onClose={() => setShowAccidentForm(false)} />
        </DialogContent>
      </Dialog>

      {/* New Checklist Dialog */}
      <Dialog open={showChecklist} onOpenChange={setShowChecklist}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">Nuova Ispezione</DialogTitle>
          <SafetyChecklist onClose={() => setShowChecklist(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
