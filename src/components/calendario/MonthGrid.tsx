import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { type CalendarDayData } from "@/data/mock-calendar";
import { Users, AlertTriangle, ShieldX } from "lucide-react";

interface MonthGridProps {
  year: number;
  month: number; // 0-indexed
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

export function MonthGrid({ year, month, data, selectedDate, onSelectDate }: MonthGridProps) {
  const cells = useMemo(() => {
    const first = new Date(year, month, 1);
    // Monday=0 mapping
    let startDow = first.getDay() - 1;
    if (startDow < 0) startDow = 6;

    const result: CellData[] = [];

    // Previous month padding
    for (let i = startDow - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      result.push({
        date: d,
        day: d.getDate(),
        isCurrentMonth: false,
        key: formatKey(d.getFullYear(), d.getMonth(), d.getDate()),
        data: undefined,
      });
    }

    // Current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const key = formatKey(year, month, d);
      result.push({
        date,
        day: d,
        isCurrentMonth: true,
        key,
        data: data.get(key),
      });
    }

    // Next month padding to fill 6 rows
    while (result.length < 42) {
      const d = new Date(year, month + 1, result.length - startDow - daysInMonth + 1);
      result.push({
        date: d,
        day: d.getDate(),
        isCurrentMonth: false,
        key: formatKey(d.getFullYear(), d.getMonth(), d.getDate()),
        data: undefined,
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
      {/* Weekday header */}
      <div className="grid grid-cols-7 border-b border-border bg-muted/50">
        {WEEKDAYS.map((wd) => (
          <div key={wd} className="px-2 py-2.5 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {wd}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {cells.map((cell, i) => {
          const isSelected = cell.key === selectedKey;
          const isToday = cell.key === todayKey;
          const presenze = cell.data?.presenze.length || 0;
          const scadenze = cell.data?.scadenze.length || 0;
          const bloccati = cell.data?.presenze.filter((p) => p.esito === "bloccato").length || 0;
          const hasEvents = presenze > 0 || scadenze > 0;

          return (
            <button
              key={i}
              onClick={() => onSelectDate(cell.date)}
              className={cn(
                "relative flex flex-col items-start p-1.5 sm:p-2 text-left transition-colors border-b border-r border-border",
                "h-[70px] sm:h-[110px] lg:h-[120px]",
                "hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                !cell.isCurrentMonth && "bg-muted/30 text-muted-foreground/50",
                isSelected && "bg-primary/5 ring-2 ring-primary ring-inset",
              )}
            >
              {/* Day number */}
              <span
                className={cn(
                  "inline-flex items-center justify-center text-sm font-medium rounded-full w-7 h-7 shrink-0",
                  isToday && "bg-primary text-primary-foreground",
                  isSelected && !isToday && "bg-primary/15 text-primary font-bold",
                  !isToday && !isSelected && cell.isCurrentMonth && "text-foreground",
                )}
              >
                {cell.day}
              </span>

              {/* Event chips — hidden on very small screens, shown as dots */}
              {hasEvents && cell.isCurrentMonth && (
                <div className="flex flex-col gap-0.5 mt-0.5 w-full overflow-hidden">
                  {/* Mobile: colored dots only */}
                  <div className="flex gap-1 sm:hidden">
                    {presenze > 0 && <span className="w-2 h-2 rounded-full bg-success shrink-0" />}
                    {scadenze > 0 && <span className="w-2 h-2 rounded-full bg-warning shrink-0" />}
                    {bloccati > 0 && <span className="w-2 h-2 rounded-full bg-destructive shrink-0" />}
                  </div>

                  {/* Desktop: chips */}
                  <div className="hidden sm:flex flex-col gap-0.5 w-full">
                    {presenze > 0 && (
                      <div className="flex items-center gap-1 text-[11px] font-medium text-success bg-success/10 rounded px-1.5 py-0.5 truncate">
                        <Users className="w-3 h-3 shrink-0" />
                        <span className="truncate">{presenze} presenze</span>
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
        })}
      </div>
    </div>
  );
}
