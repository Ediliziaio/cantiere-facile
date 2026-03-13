import { useState, useMemo, useCallback, useEffect } from "react";
import { CalendarDayDetail } from "@/components/dashboard/CalendarDayDetail";
import { MonthGrid } from "@/components/calendario/MonthGrid";
import { WeekView } from "@/components/calendario/WeekView";
import { DayView } from "@/components/calendario/DayView";
import { NuovoAppuntamentoDialog } from "@/components/calendario/NuovoAppuntamentoDialog";
import { buildCalendarData, mockAppuntamenti, type CalendarDayData, type CalendarAppuntamento } from "@/data/mock-calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Bell, Grid3X3, List, Clock } from "lucide-react";
import { mockCantieri } from "@/data/mock-data";
import { toast } from "sonner";

const MONTH_NAMES = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
];

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

export default function Calendario() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date("2026-03-10"));
  const [currentMonth, setCurrentMonth] = useState(2);
  const [currentYear, setCurrentYear] = useState(2026);
  const [filterCantiere, setFilterCantiere] = useState("tutti");
  const [extraAppuntamenti, setExtraAppuntamenti] = useState<CalendarAppuntamento[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAppuntamento, setEditingAppuntamento] = useState<CalendarAppuntamento | null>(null);
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");

  const allAppuntamenti = useMemo(() => [...mockAppuntamenti, ...extraAppuntamenti], [extraAppuntamenti]);

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

  const weekStart = useMemo(() => getMonday(selectedDate || new Date()), [selectedDate]);

  // 24h reminder
  const upcomingAppointments = useMemo(() => {
    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    return allAppuntamenti.filter((app) => {
      const appDate = new Date(`${app.data}T${app.ora_inizio}`);
      return appDate >= now && appDate <= in24h;
    });
  }, [allAppuntamenti]);

  useEffect(() => {
    if (upcomingAppointments.length > 0) {
      toast.info(`Hai ${upcomingAppointments.length} appuntament${upcomingAppointments.length === 1 ? "o" : "i"} nelle prossime 24 ore`, {
        description: upcomingAppointments.map((a) => `${a.ora_inizio} — ${a.titolo}`).join(", "),
        duration: 6000,
      });
    }
  }, []);

  const goToPrev = () => {
    if (viewMode === "day") {
      const prev = new Date(selectedDate || new Date());
      prev.setDate(prev.getDate() - 1);
      setSelectedDate(prev);
      setCurrentMonth(prev.getMonth());
      setCurrentYear(prev.getFullYear());
    } else if (viewMode === "week") {
      const prev = new Date(weekStart);
      prev.setDate(prev.getDate() - 7);
      setSelectedDate(prev);
      setCurrentMonth(prev.getMonth());
      setCurrentYear(prev.getFullYear());
    } else {
      if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
      else setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNext = () => {
    if (viewMode === "day") {
      const next = new Date(selectedDate || new Date());
      next.setDate(next.getDate() + 1);
      setSelectedDate(next);
      setCurrentMonth(next.getMonth());
      setCurrentYear(next.getFullYear());
    } else if (viewMode === "week") {
      const next = new Date(weekStart);
      next.setDate(next.getDate() + 7);
      setSelectedDate(next);
      setCurrentMonth(next.getMonth());
      setCurrentYear(next.getFullYear());
    } else {
      if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
      else setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    const now = new Date();
    setCurrentMonth(now.getMonth());
    setCurrentYear(now.getFullYear());
    setSelectedDate(now);
  };

  const headerLabel = useMemo(() => {
    if (viewMode === "week") {
      const end = new Date(weekStart);
      end.setDate(end.getDate() + 6);
      const fmt = (d: Date) => d.toLocaleDateString("it-IT", { day: "numeric", month: "short" });
      return `${fmt(weekStart)} — ${fmt(end)} ${end.getFullYear()}`;
    }
    return `${MONTH_NAMES[currentMonth]} ${currentYear}`;
  }, [viewMode, weekStart, currentMonth, currentYear]);

  const handleSaveAppuntamento = useCallback((app: CalendarAppuntamento) => {
    setExtraAppuntamenti((prev) => {
      const existingIdx = prev.findIndex((a) => a.id === app.id);
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = app;
        return next;
      }
      return [...prev, app];
    });
    setEditingAppuntamento(null);
  }, []);

  const handleEditAppuntamento = useCallback((app: CalendarAppuntamento) => {
    setEditingAppuntamento(app);
    setDialogOpen(true);
  }, []);

  const handleDeleteAppuntamento = useCallback((appId: string) => {
    setExtraAppuntamenti((prev) => prev.filter((a) => a.id !== appId));
    toast.success("Appuntamento eliminato");
  }, []);

  const openDialogForSelectedDate = useCallback(() => {
    setEditingAppuntamento(null);
    setDialogOpen(true);
  }, []);

  return (
    <div className="space-y-4">
      {/* 24h reminder banner */}
      {upcomingAppointments.length > 0 && (
        <Alert className="border-warning/50 bg-warning/5">
          <Bell className="h-4 w-4 text-warning" />
          <AlertTitle className="text-warning">
            {upcomingAppointments.length} appuntament{upcomingAppointments.length === 1 ? "o" : "i"} nelle prossime 24 ore
          </AlertTitle>
          <AlertDescription className="text-sm text-muted-foreground">
            {upcomingAppointments.map((a) => (
              <span key={a.id} className="inline-flex items-center gap-1 mr-3">
                <span className="font-medium text-foreground">{a.ora_inizio}</span> {a.titolo}
              </span>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <CalendarDays className="h-6 w-6 text-primary shrink-0" />
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={goToPrev} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="font-heading text-lg sm:text-2xl font-bold text-foreground min-w-[200px] sm:min-w-[280px] text-center">
              {headerLabel}
            </h1>
            <Button variant="outline" size="icon" onClick={goToNext} className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={goToToday} className="text-xs ml-1">
              Oggi
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(v) => { if (v) setViewMode(v as "month" | "week"); }}
            className="border border-border rounded-md"
          >
            <ToggleGroupItem value="month" aria-label="Vista mensile" className="h-8 px-2.5">
              <Grid3X3 className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="week" aria-label="Vista settimanale" className="h-8 px-2.5">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <Button onClick={() => { setEditingAppuntamento(null); setDialogOpen(true); }} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Appuntamento</span>
          </Button>
          <Select value={filterCantiere} onValueChange={setFilterCantiere}>
            <SelectTrigger className="w-[180px] sm:w-[220px]">
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

      {/* View */}
      {viewMode === "month" ? (
        <MonthGrid
          year={currentYear}
          month={currentMonth}
          data={calendarData}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      ) : (
        <WeekView
          weekStart={weekStart}
          data={calendarData}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      )}

      {/* Day detail */}
      <CalendarDayDetail
        date={selectedDate}
        data={selectedDayData}
        onAddAppuntamento={openDialogForSelectedDate}
        onEditAppuntamento={handleEditAppuntamento}
        onDeleteAppuntamento={handleDeleteAppuntamento}
      />

      {/* Dialog */}
      <NuovoAppuntamentoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultDate={defaultDateStr}
        onSave={handleSaveAppuntamento}
        editAppuntamento={editingAppuntamento}
      />
    </div>
  );
}
