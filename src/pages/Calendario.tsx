import { useState, useMemo } from "react";
import { CalendarDayDetail } from "@/components/dashboard/CalendarDayDetail";
import { MonthGrid } from "@/components/calendario/MonthGrid";
import { buildCalendarData, type CalendarDayData } from "@/data/mock-calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { mockCantieri } from "@/data/mock-data";

const MONTH_NAMES = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
];

export default function Calendario() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date("2026-03-10"));
  const [currentMonth, setCurrentMonth] = useState(2); // March (0-indexed)
  const [currentYear, setCurrentYear] = useState(2026);
  const [filterCantiere, setFilterCantiere] = useState("tutti");

  const calendarData = useMemo(
    () => buildCalendarData(filterCantiere === "tutti" ? undefined : filterCantiere),
    [filterCantiere]
  );

  const selectedKey = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
    : null;

  const selectedDayData: CalendarDayData | null = selectedKey ? calendarData.get(selectedKey) || null : null;

  const goToPrevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
  };

  const goToToday = () => {
    const now = new Date();
    setCurrentMonth(now.getMonth());
    setCurrentYear(now.getFullYear());
    setSelectedDate(now);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <CalendarDays className="h-6 w-6 text-primary shrink-0" />
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={goToPrevMonth} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="font-heading text-xl sm:text-2xl font-bold text-foreground min-w-[200px] text-center">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h1>
            <Button variant="outline" size="icon" onClick={goToNextMonth} className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={goToToday} className="text-xs ml-1">
              Oggi
            </Button>
          </div>
        </div>
        <Select value={filterCantiere} onValueChange={setFilterCantiere}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Filtra cantiere" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tutti">Tutti i cantieri</SelectItem>
            {mockCantieri.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Month grid */}
      <MonthGrid
        year={currentYear}
        month={currentMonth}
        data={calendarData}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      {/* Day detail */}
      <CalendarDayDetail date={selectedDate} data={selectedDayData} />
    </div>
  );
}
