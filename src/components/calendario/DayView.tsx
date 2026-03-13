import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type CalendarDayData } from "@/data/mock-calendar";
import { Users, AlertTriangle, Clock, MapPin, Building2, CalendarX } from "lucide-react";
import { cn } from "@/lib/utils";

interface DayViewProps {
  date: Date;
  data: CalendarDayData | null;
  onSlotClick?: (hour: number) => void;
}

function mapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

const START_HOUR = 7;
const END_HOUR = 20;
const HOUR_HEIGHT = 60;
const TOTAL_HOURS = END_HOUR - START_HOUR;

const COLORE_CLASSES: Record<string, string> = {
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  teal: "bg-teal-500",
  rose: "bg-rose-500",
};

const COLORE_BG: Record<string, string> = {
  blue: "bg-blue-500/10 border-blue-500/30",
  purple: "bg-purple-500/10 border-purple-500/30",
  teal: "bg-teal-500/10 border-teal-500/30",
  rose: "bg-rose-500/10 border-rose-500/30",
};

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function formatKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function DayView({ date, data, onSlotClick }: DayViewProps) {
  const hours = useMemo(() => Array.from({ length: TOTAL_HOURS }, (_, i) => START_HOUR + i), []);

  const appuntamenti = data?.appuntamenti || [];
  const presenze = data?.presenze || [];
  const scadenze = data?.scadenze || [];

  const isToday = formatKey(date) === formatKey(new Date());
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const nowOffset = ((nowMinutes - START_HOUR * 60) / (TOTAL_HOURS * 60)) * (TOTAL_HOURS * HOUR_HEIGHT);
  const showNowLine = isToday && nowMinutes >= START_HOUR * 60 && nowMinutes <= END_HOUR * 60;

  const presenzePerCantiere = useMemo(() => {
    return presenze.reduce<Record<string, { nome: string; count: number; bloccati: number }>>((acc, p) => {
      if (!acc[p.cantiere_id]) acc[p.cantiere_id] = { nome: p.cantiere_nome, count: 0, bloccati: 0 };
      acc[p.cantiere_id].count++;
      if (p.esito === "bloccato") acc[p.cantiere_id].bloccati++;
      return acc;
    }, {});
  }, [presenze]);

  const hasContent = appuntamenti.length > 0 || presenze.length > 0 || scadenze.length > 0;

  return (
    <div className="space-y-3">
      {/* Summary section */}
      {(presenze.length > 0 || scadenze.length > 0) && (
        <div className="flex flex-wrap gap-3">
          {Object.entries(presenzePerCantiere).map(([id, c]) => (
            <Card key={id} className="flex-1 min-w-[200px]">
              <CardContent className="p-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{c.count} presenz{c.count === 1 ? "a" : "e"}</p>
                  <p className="text-xs text-muted-foreground">{c.nome}</p>
                </div>
                {c.bloccati > 0 && (
                  <Badge variant="destructive" className="text-[10px] px-1.5 py-0 ml-auto">
                    {c.bloccati} bloccat{c.bloccati === 1 ? "o" : "i"}
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
          {scadenze.length > 0 && (
            <Card className="flex-1 min-w-[200px]">
              <CardContent className="p-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{scadenze.length} scadenz{scadenze.length === 1 ? "a" : "e"}</p>
                  <p className="text-xs text-muted-foreground">in scadenza oggi</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Timeline */}
      {!hasContent ? (
        <Card>
          <CardContent className="p-8 flex flex-col items-center justify-center text-center gap-2">
            <CalendarX className="w-10 h-10 text-muted-foreground/50" />
            <p className="text-muted-foreground text-sm">Nessuna attività per questa giornata</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <div className="relative flex" style={{ height: TOTAL_HOURS * HOUR_HEIGHT + 1 }}>
              {/* Hour labels */}
              <div className="shrink-0 w-16 border-r border-border">
                {hours.map((h) => (
                  <div
                    key={h}
                    className="absolute left-0 w-16 flex items-start justify-end pr-2"
                    style={{ top: (h - START_HOUR) * HOUR_HEIGHT, height: HOUR_HEIGHT }}
                  >
                    <span className="text-xs text-muted-foreground -mt-2">{String(h).padStart(2, "0")}:00</span>
                  </div>
                ))}
              </div>

              {/* Grid + events area */}
              <div className="relative flex-1 min-w-0">
                {/* Hour slot click targets */}
                {hours.map((h) => (
                  <div
                    key={`slot-${h}`}
                    className={cn(
                      "absolute left-0 right-0 border-t border-border/50",
                      onSlotClick && "cursor-pointer hover:bg-primary/5 transition-colors"
                    )}
                    style={{ top: (h - START_HOUR) * HOUR_HEIGHT, height: HOUR_HEIGHT }}
                    onClick={() => onSlotClick?.(h)}
                  />
                ))}

                {/* Now indicator */}
                {showNowLine && (
                  <div
                    className="absolute left-0 right-0 z-20 flex items-center"
                    style={{ top: nowOffset }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-destructive shrink-0 -ml-1" />
                    <div className="flex-1 h-[2px] bg-destructive" />
                  </div>
                )}

                {/* Appointment blocks */}
                {appuntamenti.map((app) => {
                  const startMin = timeToMinutes(app.ora_inizio);
                  const endMin = timeToMinutes(app.ora_fine);
                  const top = ((startMin - START_HOUR * 60) / 60) * HOUR_HEIGHT;
                  const height = Math.max(((endMin - startMin) / 60) * HOUR_HEIGHT, 28);

                  return (
                    <div
                      key={app.id}
                      className={cn(
                        "absolute left-1 right-1 sm:left-2 sm:right-2 rounded-md border p-2 overflow-hidden z-10 pointer-events-none",
                        COLORE_BG[app.colore] || "bg-primary/10 border-primary/30"
                      )}
                      style={{ top, height }}
                    >
                      <div className="flex gap-1.5 h-full">
                        <div className={cn("w-1 rounded-full shrink-0", COLORE_CLASSES[app.colore] || "bg-primary")} />
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <p className="text-sm font-medium text-foreground truncate leading-tight">{app.titolo}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3 shrink-0" />
                            <span>{app.ora_inizio}–{app.ora_fine}</span>
                          </div>
                          {height >= 56 && app.cantiere_nome && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                              <Building2 className="w-3 h-3 shrink-0" />
                              <span className="truncate">{app.cantiere_nome}</span>
                            </div>
                          )}
                          {height >= 72 && app.indirizzo && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                              <MapPin className="w-3 h-3 shrink-0" />
                              <a href={mapsUrl(app.indirizzo)} target="_blank" rel="noopener noreferrer" className="truncate hover:underline hover:text-primary transition-colors" onClick={(e) => e.stopPropagation()}>{app.indirizzo}</a>
                            </div>
                          )}
                          {height >= 88 && app.assegnato_a.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {app.assegnato_a.slice(0, 3).map((a) => (
                                <Badge key={a.id} variant="secondary" className="text-[10px] px-1.5 py-0">
                                  {a.nome}
                                </Badge>
                              ))}
                              {app.assegnato_a.length > 3 && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                  +{app.assegnato_a.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
