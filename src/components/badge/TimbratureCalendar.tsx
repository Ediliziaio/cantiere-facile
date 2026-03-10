import { mockTimbrature, type Timbratura } from "@/data/mock-badges";

interface TimbratureCalendarProps {
  lavoratoreId?: string;
  badgeId?: string;
  month?: number; // 0-indexed
  year?: number;
}

export function TimbratureCalendar({ lavoratoreId, badgeId, month = 2, year = 2026 }: TimbratureCalendarProps) {
  const filtered = mockTimbrature.filter((t) => {
    if (lavoratoreId && t.lavoratore_id !== lavoratoreId) return false;
    if (badgeId && t.badge_id !== badgeId) return false;
    return true;
  });

  // Build day map with worst esito
  const dayMap = new Map<number, "autorizzato" | "warning" | "bloccato">();
  for (const t of filtered) {
    const d = new Date(t.timestamp);
    if (d.getMonth() !== month || d.getFullYear() !== year) continue;
    const day = d.getDate();
    const prev = dayMap.get(day);
    if (t.esito === "bloccato" || prev === "bloccato") dayMap.set(day, "bloccato");
    else if (t.esito === "warning" || prev === "warning") dayMap.set(day, "warning");
    else dayMap.set(day, "autorizzato");
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7; // Monday=0
  const dayLabels = ["L", "M", "M", "G", "V", "S", "D"];

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const monthNames = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];

  const esitoColor = (e?: string) => {
    if (e === "bloccato") return "bg-red-500";
    if (e === "warning") return "bg-amber-400";
    if (e === "autorizzato") return "bg-emerald-500";
    return "";
  };

  return (
    <div>
      <p className="font-heading font-semibold text-sm text-foreground mb-2">
        {monthNames[month]} {year}
      </p>
      <div className="grid grid-cols-7 gap-1 text-center">
        {dayLabels.map((l, i) => (
          <span key={i} className="text-[10px] text-muted-foreground font-medium">{l}</span>
        ))}
        {cells.map((day, i) => (
          <div
            key={i}
            className="aspect-square flex items-center justify-center relative text-xs text-muted-foreground"
          >
            {day && (
              <>
                <span className="relative z-10">{day}</span>
                {dayMap.has(day) && (
                  <span className={`absolute bottom-0.5 w-1.5 h-1.5 rounded-full ${esitoColor(dayMap.get(day))}`} />
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
