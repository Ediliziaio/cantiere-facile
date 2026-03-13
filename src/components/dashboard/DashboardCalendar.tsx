import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDayDetail } from "./CalendarDayDetail";
import { buildCalendarData, type CalendarDayData } from "@/data/mock-calendar";
import { cn } from "@/lib/utils";
import { CalendarDays } from "lucide-react";

interface DashboardCalendarProps {
  filterCantiere?: string;
}

export function DashboardCalendar({ filterCantiere }: DashboardCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date("2026-03-10"));

  const calendarData = useMemo(
    () => buildCalendarData(filterCantiere === "tutti" ? undefined : filterCantiere),
    [filterCantiere]
  );

  const selectedKey = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
    : null;

  const selectedDayData: CalendarDayData | null = selectedKey ? calendarData.get(selectedKey) || null : null;

  // Build modifiers for colored dots
  const okDays: Date[] = [];
  const warningDays: Date[] = [];
  const dangerDays: Date[] = [];

  for (const [key, data] of calendarData) {
    const d = new Date(key + "T00:00:00");
    if (data.worstStatus === "danger") dangerDays.push(d);
    else if (data.worstStatus === "warning") warningDays.push(d);
    else if (data.presenze.length > 0) okDays.push(d);
  }

  return (
    <section>
      <h2 className="font-heading font-semibold text-lg text-foreground mb-3 flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-primary" />
        Calendario attività
      </h2>
      <div className="grid gap-4 lg:grid-cols-[auto_1fr]">
        <Card className="w-fit">
          <CardContent className="p-3">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              defaultMonth={new Date("2026-03-01")}
              className="pointer-events-auto"
              modifiers={{
                ok: okDays,
                warning: warningDays,
                danger: dangerDays,
              }}
              modifiersClassNames={{
                ok: "calendar-dot-ok",
                warning: "calendar-dot-warning",
                danger: "calendar-dot-danger",
              }}
            />
          </CardContent>
        </Card>

        <CalendarDayDetail date={selectedDate} data={selectedDayData} />
      </div>
    </section>
  );
}
