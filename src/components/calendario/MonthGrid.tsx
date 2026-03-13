import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { type CalendarDayData } from "@/data/mock-calendar";
import { Users, AlertTriangle, ShieldX, CalendarCheck, Clock, Building2 } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useIsMobile } from "@/hooks/use-mobile";

interface MonthGridProps {
  year: number;
  month: number;
  data: Map<string, CalendarDayData>;
  selectedDate: Date | undefined;
  onSelectDate: (date: Date) => void;
}

const WEEKDAYS = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

function formatKey(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

interface CellData {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  key: string;
  data: CalendarDayData | undefined;
}

function DayHoverContent({ data }: { data: CalendarDayData }) {
  const presenze = data.presenze;
  const appuntamenti = data.appuntamenti;
  const scadenze = data.scadenze;

  return (
    <div className="space-y-2.5 text-sm">
      {/* Presenze */}
      {presenze.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
            <Users className="w-3.5 h-3.5" />
            {presenze.length} presenz{presenze.length === 1 ? "a" : "e"}
          </div>
          <div className="space-y-0.5">
            {presenze.slice(0, 5).map((p, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full shrink-0",
                  p.esito === "autorizzato" ? "bg-emerald-500" : p.esito === "warning" ? "bg-warning" : "bg-destructive",
                )} />
                <span className="truncate">{p.lavoratore_nome}</span>
                <span className="text-muted-foreground/60 truncate">— {p.cantiere_nome}</span>
              </div>
            ))}
            {presenze.length > 5 && (
              <p className="text-xs text-muted-foreground/60 italic">+{presenze.length - 5} altr{presenze.length - 5 === 1 ? "o" : "i"}</p>
            )}
          </div>
        </div>
      )}

      {/* Appuntamenti */}
      {appuntamenti.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
            <CalendarCheck className="w-3.5 h-3.5" />
            {appuntamenti.length} appuntament{appuntamenti.length === 1 ? "o" : "i"}
          </div>
          <div className="space-y-0.5">
            {appuntamenti.map((a) => (
              <div key={a.id} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3 h-3 shrink-0" />
                <span className="font-medium text-foreground">{a.ora_inizio}</span>
                <span className="truncate">{a.titolo}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scadenze */}
      {scadenze.length > 0 && (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-warning">
          <AlertTriangle className="w-3.5 h-3.5" />
          {scadenze.length} scadenz{scadenze.length === 1 ? "a" : "e"} in scadenza
        </div>
      )}
    </div>
  );
}

export function MonthGrid({ year, month, data, selectedDate, onSelectDate }: MonthGridProps) {
  const isMobile = useIsMobile();

  const cells = useMemo(() => {
    const first = new Date(year, month, 1);
    let startDow = first.getDay() - 1;
    if (startDow < 0) startDow = 6;

    const result: CellData[] = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = startDow - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      result.push({
        date: d, day: d.getDate(), isCurrentMonth: false,
        key: formatKey(d.getFullYear(), d.getMonth(), d.getDate()), data: undefined,
      });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const key = formatKey(year, month, d);
      result.push({ date, day: d, isCurrentMonth: true, key, data: data.get(key) });
    }

    while (result.length < 42) {
      const d = new Date(year, month + 1, result.length - startDow - daysInMonth + 1);
      result.push({
        date: d, day: d.getDate(), isCurrentMonth: false,
        key: formatKey(d.getFullYear(), d.getMonth(), d.getDate()), data: undefined,
      });
    }

    return result;
  }, [year, month, data]);

  const today = new Date();
  const todayKey = formatKey(today.getFullYear(), today.getMonth(), today.getDate());
  const selectedKey = selectedDate
    ? formatKey(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
    : null;

  return (
    <div className="w-full border border-border rounded-lg overflow-hidden bg-card">
      <div className="grid grid-cols-7 border-b border-border bg-muted/50">
        {WEEKDAYS.map((wd) => (
          <div key={wd} className="px-2 py-2.5 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {wd}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((cell, i) => {
          const presenze = cell.data?.presenze.length || 0;
          const scadenze = cell.data?.scadenze.length || 0;
          const appuntamenti = cell.data?.appuntamenti.length || 0;
          const bloccati = cell.data?.presenze.filter((p) => p.esito === "bloccato").length || 0;
          const hasEvents = presenze > 0 || scadenze > 0 || appuntamenti > 0;
          const hasData = cell.data && hasEvents && cell.isCurrentMonth;

          const cantieriNomi = cell.data?.presenze
            ? [...new Set(cell.data.presenze.map((p) => p.cantiere_nome))]
            : [];
          const cantiereLabel = cantieriNomi.length === 1 ? cantieriNomi[0] : cantieriNomi.length > 1 ? `${cantieriNomi.length} cantieri` : "";

          const isSelected = cell.key === selectedKey;
          const isToday = cell.key === todayKey;

          const cellContent = (
            <button
              onClick={() => onSelectDate(cell.date)}
              className={cn(
                "relative flex flex-col items-start p-1.5 sm:p-2 text-left transition-colors border-b border-r border-border w-full",
                "h-[70px] sm:h-[110px] lg:h-[120px]",
                "hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                !cell.isCurrentMonth && "bg-muted/30 text-muted-foreground/50",
                isSelected && "bg-primary/5 ring-2 ring-primary ring-inset",
              )}
            >
              <span className={cn(
                "inline-flex items-center justify-center text-sm font-medium rounded-full w-7 h-7 shrink-0",
                isToday && "bg-primary text-primary-foreground",
                isSelected && !isToday && "bg-primary/15 text-primary font-bold",
                !isToday && !isSelected && cell.isCurrentMonth && "text-foreground",
              )}>
                {cell.day}
              </span>

              {hasEvents && cell.isCurrentMonth && (
                <div className="flex flex-col gap-0.5 mt-0.5 w-full overflow-hidden">
                  <div className="flex gap-1 sm:hidden">
                    {presenze > 0 && <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />}
                    {appuntamenti > 0 && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
                    {scadenze > 0 && <span className="w-2 h-2 rounded-full bg-warning shrink-0" />}
                    {bloccati > 0 && <span className="w-2 h-2 rounded-full bg-destructive shrink-0" />}
                  </div>
                  <div className="hidden sm:flex flex-col gap-0.5 w-full">
                    {presenze > 0 && (
                      <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 rounded px-1.5 py-0.5 truncate">
                        <Users className="w-3 h-3 shrink-0" />
                        <span className="truncate">{presenze} pres.{cantiereLabel ? ` — ${cantiereLabel}` : ""}</span>
                      </div>
                    )}
                    {appuntamenti > 0 && (
                      <div className="flex items-center gap-1 text-[11px] font-medium text-blue-700 dark:text-blue-400 bg-blue-500/10 rounded px-1.5 py-0.5 truncate">
                        <CalendarCheck className="w-3 h-3 shrink-0" />
                        <span className="truncate">{appuntamenti} appuntament{appuntamenti === 1 ? "o" : "i"}</span>
                      </div>
                    )}
                    {scadenze > 0 && (
                      <div className="flex items-center gap-1 text-[11px] font-medium text-warning bg-warning/10 rounded px-1.5 py-0.5 truncate">
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                        <span className="truncate">{scadenze} scadenz{scadenze === 1 ? "a" : "e"}</span>
                      </div>
                    )}
                    {bloccati > 0 && (
                      <div className="flex items-center gap-1 text-[11px] font-medium text-destructive bg-destructive/10 rounded px-1.5 py-0.5 truncate">
                        <ShieldX className="w-3 h-3 shrink-0" />
                        <span className="truncate">{bloccati} bloccat{bloccati === 1 ? "o" : "i"}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </button>
          );

          // Wrap with HoverCard only on desktop and when there's data
          if (!isMobile && hasData && cell.data) {
            return (
              <HoverCard key={i} openDelay={2000} closeDelay={300}>
                <HoverCardTrigger asChild>
                  {cellContent}
                </HoverCardTrigger>
                <HoverCardContent className="w-72 p-3" side="right" align="start">
                  <p className="text-xs font-semibold text-foreground mb-2">
                    {cell.date.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" })}
                  </p>
                  <DayHoverContent data={cell.data} />
                </HoverCardContent>
              </HoverCard>
            );
          }

          return <div key={i}>{cellContent}</div>;
        })}
      </div>
    </div>
  );
}
