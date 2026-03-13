import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { type CalendarDayData } from "@/data/mock-calendar";
import { Users, AlertTriangle, CalendarCheck, Clock, MapPin, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeekViewProps {
  weekStart: Date;
  data: Map<string, CalendarDayData>;
  selectedDate: Date | undefined;
  onSelectDate: (date: Date) => void;
}

const DAY_NAMES = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];

const COLORE_CLASSES: Record<string, string> = {
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  teal: "bg-teal-500",
  rose: "bg-rose-500",
};

function formatKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function WeekView({ weekStart, data, selectedDate, onSelectDate }: WeekViewProps) {
  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [weekStart]);

  const today = new Date();
  const todayKey = formatKey(today);
  const selectedKey = selectedDate ? formatKey(selectedDate) : null;

  return (
    <div className="space-y-2">
      {days.map((day, i) => {
        const key = formatKey(day);
        const dayData = data.get(key);
        const isToday = key === todayKey;
        const isSelected = key === selectedKey;
        const presenze = dayData?.presenze || [];
        const appuntamenti = dayData?.appuntamenti || [];
        const scadenze = dayData?.scadenze || [];
        const hasContent = presenze.length > 0 || appuntamenti.length > 0 || scadenze.length > 0;

        // Group presenze by cantiere
        const presenzePerCantiere = presenze.reduce<Record<string, { nome: string; count: number; bloccati: number }>>((acc, p) => {
          if (!acc[p.cantiere_id]) acc[p.cantiere_id] = { nome: p.cantiere_nome, count: 0, bloccati: 0 };
          acc[p.cantiere_id].count++;
          if (p.esito === "bloccato") acc[p.cantiere_id].bloccati++;
          return acc;
        }, {});

        return (
          <Card
            key={key}
            className={cn(
              "cursor-pointer transition-colors hover:bg-accent/30",
              isSelected && "ring-2 ring-primary",
              isToday && "border-primary/50",
            )}
            onClick={() => onSelectDate(day)}
          >
            <CardContent className="p-3 sm:p-4">
              {/* Day header */}
              <div className="flex items-center gap-3 mb-2">
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold shrink-0",
                  isToday ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
                )}>
                  {day.getDate()}
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{DAY_NAMES[i]}</p>
                  <p className="text-xs text-muted-foreground">
                    {day.toLocaleDateString("it-IT", { day: "numeric", month: "long" })}
                  </p>
                </div>
                {!hasContent && (
                  <span className="ml-auto text-xs text-muted-foreground italic">Nessuna attività</span>
                )}
              </div>

              {hasContent && (
                <div className="space-y-2 ml-[52px]">
                  {/* Appuntamenti */}
                  {appuntamenti.map((app) => (
                    <div key={app.id} className="flex items-start gap-2 p-2 rounded-md bg-accent/20">
                      <div className={cn("w-1 h-full min-h-[32px] rounded-full shrink-0", COLORE_CLASSES[app.colore] || "bg-primary")} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-muted-foreground shrink-0" />
                          <span className="text-xs text-muted-foreground">{app.ora_inizio}–{app.ora_fine}</span>
                        </div>
                        <p className="text-sm font-medium text-foreground truncate">{app.titolo}</p>
                        {app.cantiere_nome && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Building2 className="w-3 h-3 shrink-0" />
                            <span className="truncate">{app.cantiere_nome}</span>
                          </div>
                        )}
                        {app.indirizzo && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(app.indirizzo)}`} target="_blank" rel="noopener noreferrer" className="truncate hover:underline hover:text-primary transition-colors" onClick={(e) => e.stopPropagation()}>{app.indirizzo}</a>
                                </TooltipTrigger>
                                <TooltipContent>Apri in Google Maps</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        )}
                        {app.assegnato_a.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {app.assegnato_a.map((a) => (
                              <Badge key={a.id} variant="secondary" className="text-[10px] px-1.5 py-0">
                                {a.nome}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Presenze per cantiere */}
                  {Object.entries(presenzePerCantiere).map(([id, c]) => (
                    <div key={id} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="font-medium text-foreground">{c.count} presenz{c.count === 1 ? "a" : "e"}</span>
                      <span>— {c.nome}</span>
                      {c.bloccati > 0 && (
                        <Badge variant="destructive" className="text-[10px] px-1.5 py-0 ml-1">
                          {c.bloccati} bloccat{c.bloccati === 1 ? "o" : "i"}
                        </Badge>
                      )}
                    </div>
                  ))}

                  {/* Scadenze */}
                  {scadenze.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <AlertTriangle className="w-3.5 h-3.5 text-warning shrink-0" />
                      <span className="font-medium text-foreground">
                        {scadenze.length} scadenz{scadenze.length === 1 ? "a" : "e"}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
