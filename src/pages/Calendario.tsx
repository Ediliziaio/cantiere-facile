import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDayDetail } from "@/components/dashboard/CalendarDayDetail";
import { buildCalendarData, type CalendarDayData } from "@/data/mock-calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays } from "lucide-react";
import { mockCantieri } from "@/data/mock-data";

export default function Calendario() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date("2026-03-10"));
  const [filterCantiere, setFilterCantiere] = useState("tutti");

  const calendarData = useMemo(
    () => buildCalendarData(filterCantiere === "tutti" ? undefined : filterCantiere),
    [filterCantiere]
  );

  const selectedKey = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
    : null;

  const selectedDayData: CalendarDayData | null = selectedKey ? calendarData.get(selectedKey) || null : null;

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary" />
            Calendario
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Presenze, scadenze e attività per giorno
          </p>
        </div>
        <Select value={filterCantiere} onValueChange={setFilterCantiere}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Filtra cantiere" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tutti">Tutti i cantieri</SelectItem>
            {cantieri.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
        <Card className="w-fit">
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              defaultMonth={new Date("2026-03-01")}
              className="pointer-events-auto"
              modifiers={{ ok: okDays, warning: warningDays, danger: dangerDays }}
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
    </div>
  );
}
