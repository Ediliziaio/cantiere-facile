import { useState, useMemo, useCallback } from "react";
import { CalendarDayDetail } from "@/components/dashboard/CalendarDayDetail";
import { MonthGrid } from "@/components/calendario/MonthGrid";
import { NuovoAppuntamentoDialog } from "@/components/calendario/NuovoAppuntamentoDialog";
import { buildCalendarData, type CalendarDayData, type CalendarAppuntamento } from "@/data/mock-calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { mockCantieri } from "@/data/mock-data";

const MONTH_NAMES = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
];

export default function Calendario() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date("2026-03-10"));
  const [currentMonth, setCurrentMonth] = useState(2);
  const [currentYear, setCurrentYear] = useState(2026);
  const [filterCantiere, setFilterCantiere] = useState("tutti");
  const [extraAppuntamenti, setExtraAppuntamenti] = useState<CalendarAppuntamento[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const calendarData = useMemo(
    () => buildCalendarData(filterCantiere === "tutti" ? undefined : filterCantiere, extraAppuntamenti),
    [filterCantiere, extraAppuntamenti]
  );

  const selectedKey = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
    : null;

  const selectedDayData: CalendarDayData | null = selectedKey ? calendarData.get(selectedKey) || null : null;

  const defaultDateStr = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
    : undefined;

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

  const handleAddAppuntamento = useCallback((app: CalendarAppuntamento) => {
    setExtraAppuntamenti((prev) => [...prev, app]);
  }, []);

  const openDialogForSelectedDate = useCallback(() => {
    setDialogOpen(true);
  }, []);

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
        <div className="flex items-center gap-2">
          <Button onClick={() => setDialogOpen(true)} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Appuntamento
          </Button>
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
      <CalendarDayDetail
        date={selectedDate}
        data={selectedDayData}
        onAddAppuntamento={openDialogForSelectedDate}
      />

      {/* Dialog */}
      <NuovoAppuntamentoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultDate={defaultDateStr}
        onSave={handleAddAppuntamento}
      />
    </div>
  );
}
