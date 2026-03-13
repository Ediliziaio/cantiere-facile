import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDayData } from "@/data/mock-calendar";
import { Users, AlertTriangle, Building2, CalendarCheck, Plus, Clock, MapPin } from "lucide-react";

interface CalendarDayDetailProps {
  date: Date | undefined;
  data: CalendarDayData | null;
  onAddAppuntamento?: () => void;
}

const COLORE_CLASSES: Record<string, string> = {
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  teal: "bg-teal-500",
  rose: "bg-rose-500",
};

export function CalendarDayDetail({ date, data, onAddAppuntamento }: CalendarDayDetailProps) {
  if (!date) {
    return (
      <Card className="flex items-center justify-center min-h-[280px]">
        <p className="text-sm text-muted-foreground">Seleziona un giorno per vedere i dettagli</p>
      </Card>
    );
  }

  const dateLabel = date.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const presenze = data?.presenze || [];
  const scadenze = data?.scadenze || [];
  const cantieri = data?.cantieriAttivi || [];
  const appuntamenti = data?.appuntamenti || [];

  const isEmpty = presenze.length === 0 && scadenze.length === 0 && appuntamenti.length === 0;

  return (
    <Card className="min-h-[280px]">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base capitalize">{dateLabel}</CardTitle>
        {onAddAppuntamento && (
          <Button variant="outline" size="sm" onClick={onAddAppuntamento} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Appuntamento
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {isEmpty ? (
          <div className="text-center py-6 space-y-2">
            <p className="text-sm text-muted-foreground">Nessuna attività registrata</p>
            {onAddAppuntamento && (
              <Button variant="ghost" size="sm" onClick={onAddAppuntamento} className="gap-1.5 text-primary">
                <Plus className="h-3.5 w-3.5" />
                Aggiungi un appuntamento
              </Button>
            )}
          </div>
        ) : (
          <Tabs defaultValue={appuntamenti.length > 0 ? "appuntamenti" : "presenze"} className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="presenze" className="flex-1 gap-1">
                <Users className="h-3.5 w-3.5" />
                Presenze ({presenze.length})
              </TabsTrigger>
              <TabsTrigger value="appuntamenti" className="flex-1 gap-1">
                <CalendarCheck className="h-3.5 w-3.5" />
                Appuntamenti ({appuntamenti.length})
              </TabsTrigger>
              <TabsTrigger value="scadenze" className="flex-1 gap-1">
                <AlertTriangle className="h-3.5 w-3.5" />
                Scadenze ({scadenze.length})
              </TabsTrigger>
              <TabsTrigger value="cantieri" className="flex-1 gap-1">
                <Building2 className="h-3.5 w-3.5" />
                Cantieri ({cantieri.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="presenze" className="max-h-[200px] overflow-y-auto">
              {presenze.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">Nessuna presenza</p>
              ) : (
                <div className="divide-y divide-border">
                  {presenze.map((p, i) => (
                    <div key={i} className="flex items-center justify-between py-2 gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{p.lavoratore_nome}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {p.cantiere_nome}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            {p.entrata ? new Date(p.entrata).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }) : "—"}
                            {" → "}
                            {p.uscita ? new Date(p.uscita).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }) : "—"}
                          </p>
                        </div>
                        <span className={`w-2 h-2 rounded-full shrink-0 ${
                          p.esito === "bloccato" ? "bg-destructive" :
                          p.esito === "warning" ? "bg-warning" : "bg-emerald-500"
                        }`} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="appuntamenti" className="max-h-[200px] overflow-y-auto">
              {appuntamenti.length === 0 ? (
                <div className="text-center py-4 space-y-2">
                  <p className="text-sm text-muted-foreground">Nessun appuntamento</p>
                  {onAddAppuntamento && (
                    <Button variant="ghost" size="sm" onClick={onAddAppuntamento} className="gap-1.5 text-primary">
                      <Plus className="h-3.5 w-3.5" />
                      Aggiungi
                    </Button>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {appuntamenti.map((app) => (
                    <div key={app.id} className="py-2.5 space-y-1">
                      <div className="flex items-start gap-2">
                        <span className={`w-3 h-3 rounded-full shrink-0 mt-0.5 ${COLORE_CLASSES[app.colore] || "bg-blue-500"}`} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground">{app.titolo}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {app.ora_inizio} — {app.ora_fine}
                            </span>
                            {app.cantiere_nome && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {app.cantiere_nome}
                              </span>
                            )}
                          </div>
                          {app.assegnato_a.length > 0 && (
                            <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                              {app.assegnato_a.map((a) => (
                                <span key={a.id} className="inline-flex items-center text-[11px] font-medium bg-muted text-muted-foreground rounded-full px-2 py-0.5">
                                  {a.nome}
                                </span>
                              ))}
                            </div>
                          )}
                          {app.descrizione && (
                            <p className="text-xs text-muted-foreground mt-1">{app.descrizione}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="scadenze" className="max-h-[200px] overflow-y-auto">
              {scadenze.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">Nessuna scadenza</p>
              ) : (
                <div className="divide-y divide-border">
                  {scadenze.map((s) => (
                    <div key={s.id} className="flex items-center justify-between py-2 gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{s.categoria}</p>
                        <p className="text-xs text-muted-foreground">{s.cantiere}</p>
                      </div>
                      <span className={`inline-flex items-center text-[11px] font-medium border rounded-full px-2 py-0.5 ${
                        s.stato === "scaduto"
                          ? "bg-destructive/10 text-destructive border-destructive/30"
                          : s.stato === "in_scadenza"
                            ? "bg-warning/10 text-warning border-warning/30"
                            : "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                      }`}>
                        {s.stato === "scaduto" ? "Scaduto" : s.stato === "in_scadenza" ? "In scadenza" : "Valido"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="cantieri" className="max-h-[200px] overflow-y-auto">
              {cantieri.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">Nessun cantiere attivo</p>
              ) : (
                <div className="divide-y divide-border">
                  {cantieri.map((c) => (
                    <div key={c.id} className="flex items-center justify-between py-2 gap-2">
                      <p className="text-sm font-medium text-foreground">{c.nome}</p>
                      <span className="text-xs text-muted-foreground">{c.presentiCount} presenti</span>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
