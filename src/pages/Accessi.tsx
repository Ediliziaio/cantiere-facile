import { useState, useMemo, useCallback } from "react";
import { ShieldCheck, Users, LogIn, LogOut, OctagonX, Search, CalendarIcon, ChevronDown, Download, MapPin } from "lucide-react";
import { mockTimbrature, getPresentiOra } from "@/data/mock-badges";
import { mockCantieri, mockLavoratori } from "@/data/mock-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { cn } from "@/lib/utils";

const esitoColors: Record<string, string> = {
  autorizzato: "border-l-emerald-500",
  warning: "border-l-amber-500",
  bloccato: "border-l-red-500",
};

// Haversine distance in meters
function calcolaDistanza(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

interface DaySummary {
  lavoratoreId: string;
  cantiereId: string;
  data: string;
  entrata: string | null;
  uscita: string | null;
  minutiLavorati: number | null;
  inCorso: boolean;
  esito: string;
  motivoBlocco?: string;
  latEntrata: number | null;
  lonEntrata: number | null;
  latUscita: number | null;
  lonUscita: number | null;
  distanzaEntrata: number | null;
  distanzaUscita: number | null;
  fuoriZona: boolean;
}

type DateMode = "giorno" | "intervallo" | "tutte";

// Extract all unique dates from timbrature
const allDates = Array.from(new Set(mockTimbrature.map((t) => t.timestamp.substring(0, 10)))).sort();

function buildSummaries(timbrature: typeof mockTimbrature): DaySummary[] {
  const map = new Map<string, DaySummary>();

  for (const t of timbrature) {
    const dateKey = t.timestamp.substring(0, 10);
    const key = `${t.lavoratore_id}_${t.cantiere_id}_${dateKey}`;
    if (!map.has(key)) {
      map.set(key, {
        lavoratoreId: t.lavoratore_id,
        cantiereId: t.cantiere_id,
        data: dateKey,
        entrata: null,
        uscita: null,
        minutiLavorati: null,
        inCorso: false,
        esito: t.esito,
        motivoBlocco: t.motivo_blocco,
        latEntrata: null, lonEntrata: null,
        latUscita: null, lonUscita: null,
        distanzaEntrata: null, distanzaUscita: null,
        fuoriZona: false,
      });
    }
    const s = map.get(key)!;
    if (t.esito === "bloccato") {
      s.esito = "bloccato";
      s.motivoBlocco = t.motivo_blocco;
    } else if (s.esito !== "bloccato" && t.esito === "warning") {
      s.esito = "warning";
    }
    if (t.tipo === "entrata" && (!s.entrata || t.timestamp < s.entrata)) {
      s.entrata = t.timestamp;
      s.latEntrata = t.latitudine;
      s.lonEntrata = t.longitudine;
    }
    if (t.tipo === "uscita" && (!s.uscita || t.timestamp > s.uscita)) {
      s.uscita = t.timestamp;
      s.latUscita = t.latitudine;
      s.lonUscita = t.longitudine;
    }
  }

  for (const s of map.values()) {
    if (s.entrata && s.uscita) {
      s.minutiLavorati = Math.round((new Date(s.uscita).getTime() - new Date(s.entrata).getTime()) / 60000);
    } else if (s.entrata && !s.uscita && s.esito !== "bloccato") {
      s.inCorso = true;
    }
    // Calculate distances
    const cantiere = mockCantieri.find((c) => c.id === s.cantiereId);
    if (cantiere) {
      if (s.latEntrata != null && s.lonEntrata != null) {
        s.distanzaEntrata = calcolaDistanza(s.latEntrata, s.lonEntrata, cantiere.latitudine, cantiere.longitudine);
        if (s.distanzaEntrata > cantiere.raggio_geofence) s.fuoriZona = true;
      }
      if (s.latUscita != null && s.lonUscita != null) {
        s.distanzaUscita = calcolaDistanza(s.latUscita, s.lonUscita, cantiere.latitudine, cantiere.longitudine);
        if (s.distanzaUscita > cantiere.raggio_geofence) s.fuoriZona = true;
      }
    }
  }

  return Array.from(map.values()).sort((a, b) => b.data.localeCompare(a.data) || a.lavoratoreId.localeCompare(b.lavoratoreId));
}

export default function Accessi() {
  const [filtroCantiere, setFiltroCantiere] = useState("tutti");
  const [searchLav, setSearchLav] = useState("");
  const [dateMode, setDateMode] = useState<DateMode>("giorno");
  const [filtroData, setFiltroData] = useState<Date>(new Date("2026-03-10"));
  const [dataInizio, setDataInizio] = useState<Date>(new Date("2026-03-03"));
  const [dataFine, setDataFine] = useState<Date>(new Date("2026-03-10"));
  const [logOpen, setLogOpen] = useState(false);

  const sorted = useMemo(() => [...mockTimbrature].sort((a, b) => b.timestamp.localeCompare(a.timestamp)), []);

  // Filter timbrature by date mode
  const dateFilteredTs = useMemo(() => {
    if (dateMode === "tutte") return sorted;
    if (dateMode === "giorno") {
      const ds = format(filtroData, "yyyy-MM-dd");
      return sorted.filter((t) => t.timestamp.startsWith(ds));
    }
    // intervallo
    const ds = format(dataInizio, "yyyy-MM-dd");
    const de = format(dataFine, "yyyy-MM-dd");
    return sorted.filter((t) => {
      const d = t.timestamp.substring(0, 10);
      return d >= ds && d <= de;
    });
  }, [sorted, dateMode, filtroData, dataInizio, dataFine]);

  const summaries = useMemo(() => buildSummaries(dateFilteredTs), [dateFilteredTs]);

  // Apply filters
  const filtered = useMemo(() => {
    return summaries.filter((s) => {
      if (filtroCantiere !== "tutti" && s.cantiereId !== filtroCantiere) return false;
      if (searchLav) {
        const lav = mockLavoratori.find((l) => l.id === s.lavoratoreId);
        if (!lav || !`${lav.nome} ${lav.cognome}`.toLowerCase().includes(searchLav.toLowerCase())) return false;
      }
      return true;
    });
  }, [summaries, filtroCantiere, searchLav]);

  const totalMinuti = filtered.reduce((acc, s) => acc + (s.minutiLavorati ?? 0), 0);
  const totalOre = Math.floor(totalMinuti / 60);
  const totalMin = totalMinuti % 60;

  // Stats from today's raw data
  const todayStr = "2026-03-10";
  const todayTs = sorted.filter((t) => t.timestamp.startsWith(todayStr));
  const presentiOra = getPresentiOra();
  const ingressiOggi = todayTs.filter((t) => t.tipo === "entrata").length;
  const usciteOggi = todayTs.filter((t) => t.tipo === "uscita").length;
  const bloccatiOggi = todayTs.filter((t) => t.esito === "bloccato").length;

  const getLav = (lid: string) => mockLavoratori.find((l) => l.id === lid);
  const getCantName = (cid: string) => mockCantieri.find((c) => c.id === cid)?.nome ?? "—";

  const formatTime = (ts: string | null) => {
    if (!ts) return "—";
    return new Date(ts).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDurata = (min: number | null, inCorso: boolean) => {
    if (inCorso) return null;
    if (min == null || min <= 0) return "—";
    return `${Math.floor(min / 60)}h ${min % 60}m`;
  };

  const formatDateLabel = (ds: string) => {
    const d = new Date(ds + "T00:00:00");
    return format(d, "EEE dd MMM", { locale: it });
  };

  // Filtered raw log for collapsible section
  const filteredRaw = useMemo(() => {
    return dateFilteredTs.filter((t) => {
      if (filtroCantiere !== "tutti" && t.cantiere_id !== filtroCantiere) return false;
      if (searchLav) {
        const lav = mockLavoratori.find((l) => l.id === t.lavoratore_id);
        if (!lav || !`${lav.nome} ${lav.cognome}`.toLowerCase().includes(searchLav.toLowerCase())) return false;
      }
      return true;
    });
  }, [dateFilteredTs, filtroCantiere, searchLav]);

  const showDataColumn = dateMode !== "giorno";

  const formatDistanza = (m: number | null) => {
    if (m == null) return "—";
    return m < 1000 ? `${Math.round(m)}m` : `${(m / 1000).toFixed(1)}km`;
  };

  const exportCSV = useCallback(() => {
    const headers = ["Lavoratore", "Mansione", "Cantiere", "Data", "Entrata", "Uscita", "Ore Lavorate", "Esito", "Lat Entrata", "Lon Entrata", "Distanza Entrata (m)", "Lat Uscita", "Lon Uscita", "Distanza Uscita (m)", "Fuori Zona"];
    const rows = filtered.map((s) => {
      const lav = getLav(s.lavoratoreId);
      return [
        lav ? `${lav.nome} ${lav.cognome}` : "—",
        lav?.mansione ?? "—",
        getCantName(s.cantiereId),
        formatDateLabel(s.data),
        formatTime(s.entrata),
        s.inCorso ? "In corso" : formatTime(s.uscita),
        s.inCorso ? "—" : (formatDurata(s.minutiLavorati, false) ?? "—"),
        s.esito,
        s.latEntrata?.toFixed(6) ?? "",
        s.lonEntrata?.toFixed(6) ?? "",
        s.distanzaEntrata != null ? Math.round(s.distanzaEntrata).toString() : "",
        s.latUscita?.toFixed(6) ?? "",
        s.lonUscita?.toFixed(6) ?? "",
        s.distanzaUscita != null ? Math.round(s.distanzaUscita).toString() : "",
        s.fuoriZona ? "Sì" : "No",
      ].map((v) => `"${v}"`).join(",");
    });
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `accessi_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filtered]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h1 className="font-heading font-bold text-2xl text-foreground">Registro Accessi</h1>
        </div>
        <Button variant="outline" size="sm" onClick={exportCSV}>
          <Download className="h-4 w-4 mr-1.5" />
          Esporta CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="border border-border rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Users className="h-4 w-4 text-primary" />
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" /></span>
          </div>
          <p className="font-heading font-bold text-2xl text-foreground">{presentiOra}</p>
          <p className="text-xs text-muted-foreground">Presenti ora</p>
        </div>
        <div className="border border-border rounded-lg p-4 text-center">
          <LogIn className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
          <p className="font-heading font-bold text-2xl text-foreground">{ingressiOggi}</p>
          <p className="text-xs text-muted-foreground">Ingressi oggi</p>
        </div>
        <div className="border border-border rounded-lg p-4 text-center">
          <LogOut className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
          <p className="font-heading font-bold text-2xl text-foreground">{usciteOggi}</p>
          <p className="text-xs text-muted-foreground">Uscite oggi</p>
        </div>
        <div className="border border-border rounded-lg p-4 text-center">
          <OctagonX className="h-4 w-4 text-destructive mx-auto mb-1" />
          <p className="font-heading font-bold text-2xl text-destructive">{bloccatiOggi}</p>
          <p className="text-xs text-muted-foreground">Bloccati oggi</p>
        </div>
      </div>

      {/* Presenti per cantiere */}
      <div className="border border-border rounded-lg p-4">
        <p className="font-heading font-semibold text-sm text-foreground mb-2">Presenti per cantiere</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {mockCantieri.map((c) => (
            <div key={c.id} className="flex items-center justify-between bg-muted/30 rounded px-3 py-2">
              <span className="text-xs text-muted-foreground truncate">{c.nome}</span>
              <span className="font-medium text-sm text-foreground ml-2">{getPresentiOra(c.id)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Date mode toggle */}
      <div className="flex flex-wrap items-center gap-3">
        <ToggleGroup type="single" value={dateMode} onValueChange={(v) => v && setDateMode(v as DateMode)} className="border border-border rounded-lg p-1">
          <ToggleGroupItem value="giorno" className="text-xs px-3 h-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">Giorno</ToggleGroupItem>
          <ToggleGroupItem value="intervallo" className="text-xs px-3 h-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">Intervallo</ToggleGroupItem>
          <ToggleGroupItem value="tutte" className="text-xs px-3 h-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">Tutte le date</ToggleGroupItem>
        </ToggleGroup>

        {dateMode === "giorno" && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-44 justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(filtroData, "dd/MM/yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={filtroData} onSelect={(d) => d && setFiltroData(d)} className={cn("p-3 pointer-events-auto")} />
            </PopoverContent>
          </Popover>
        )}

        {dateMode === "intervallo" && (
          <>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-36 justify-start text-left font-normal text-sm">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(dataInizio, "dd/MM/yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={dataInizio} onSelect={(d) => d && setDataInizio(d)} className={cn("p-3 pointer-events-auto")} />
              </PopoverContent>
            </Popover>
            <span className="text-muted-foreground text-sm">→</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-36 justify-start text-left font-normal text-sm">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(dataFine, "dd/MM/yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={dataFine} onSelect={(d) => d && setDataFine(d)} className={cn("p-3 pointer-events-auto")} />
              </PopoverContent>
            </Popover>
          </>
        )}

        {dateMode === "tutte" && (
          <span className="text-xs text-muted-foreground">
            {allDates.length} giorni disponibili ({formatDateLabel(allDates[0])} — {formatDateLabel(allDates[allDates.length - 1])})
          </span>
        )}
      </div>

      {/* Quick date chips for "tutte" mode */}
      {dateMode === "tutte" && (
        <div className="flex flex-wrap gap-1.5">
          {allDates.map((d) => (
            <Button
              key={d}
              variant="outline"
              size="sm"
              className="text-xs h-7 px-2"
              onClick={() => { setDateMode("giorno"); setFiltroData(new Date(d + "T00:00:00")); }}
            >
              {formatDateLabel(d)}
            </Button>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cerca lavoratore…" value={searchLav} onChange={(e) => setSearchLav(e.target.value)} className="pl-9" />
        </div>
        <Select value={filtroCantiere} onValueChange={setFiltroCantiere}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="tutti">Tutti i cantieri</SelectItem>
            {mockCantieri.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Summary Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lavoratore</TableHead>
              <TableHead className="hidden md:table-cell">Mansione</TableHead>
              <TableHead>Cantiere</TableHead>
              {showDataColumn && <TableHead className="text-center">Data</TableHead>}
              <TableHead className="text-center">Entrata</TableHead>
              <TableHead className="text-center">Uscita</TableHead>
              <TableHead className="text-center">Ore</TableHead>
              <TableHead className="text-center w-16">Esito</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={showDataColumn ? 8 : 7} className="text-center py-8 text-muted-foreground">
                  Nessun accesso trovato
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((s) => {
                const lav = getLav(s.lavoratoreId);
                return (
                  <TableRow key={`${s.lavoratoreId}_${s.cantiereId}_${s.data}`}>
                    <TableCell className="font-medium text-foreground">
                      {lav ? `${lav.nome} ${lav.cognome}` : "—"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-xs">
                      {lav?.mansione ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm">{getCantName(s.cantiereId)}</TableCell>
                    {showDataColumn && (
                      <TableCell className="text-center text-xs text-muted-foreground">
                        {formatDateLabel(s.data)}
                      </TableCell>
                    )}
                    <TableCell className="text-center font-mono text-sm">{formatTime(s.entrata)}</TableCell>
                    <TableCell className="text-center font-mono text-sm">
                      {s.inCorso ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-600 font-sans font-medium text-xs">
                          <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" /></span>
                          In corso
                        </span>
                      ) : formatTime(s.uscita)}
                    </TableCell>
                    <TableCell className="text-center font-mono text-sm">
                      {s.inCorso ? "—" : formatDurata(s.minutiLavorati, false)}
                    </TableCell>
                    <TableCell className="text-center">
                      {s.esito === "autorizzato" ? "🟢" : s.esito === "warning" ? "🟡" : "🔴"}
                      {s.motivoBlocco && <p className="text-[10px] text-destructive">{s.motivoBlocco}</p>}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
          {filtered.length > 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={showDataColumn ? 6 : 5} className="text-right font-semibold text-foreground">Totale ore</TableCell>
                <TableCell className="text-center font-mono font-semibold text-foreground">{totalOre}h {totalMin}m</TableCell>
                <TableCell />
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>

      {/* Collapsible raw log */}
      <Collapsible open={logOpen} onOpenChange={setLogOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between text-muted-foreground">
            <span className="text-sm">Log dettagliato timbrature ({filteredRaw.length})</span>
            <ChevronDown className={cn("h-4 w-4 transition-transform", logOpen && "rotate-180")} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border border-border rounded-lg divide-y divide-border mt-2">
            {filteredRaw.slice(0, 50).map((t) => {
              const lav = getLav(t.lavoratore_id);
              return (
                <div key={t.id} className={`flex items-center justify-between px-4 py-3 border-l-4 ${esitoColors[t.esito]}`}>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {lav ? `${lav.nome} ${lav.cognome}` : "—"}
                      <span className="font-normal text-muted-foreground ml-1.5 text-xs">{lav?.mansione}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.tipo === "entrata" ? "↗ Entrata" : "↙ Uscita"} · {getCantName(t.cantiere_id)} · {new Date(t.timestamp).toLocaleString("it-IT", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                      {t.metodo && ` · ${t.metodo.replace("_", " ")}`}
                    </p>
                    {t.motivo_blocco && <p className="text-xs text-destructive mt-0.5">{t.motivo_blocco}</p>}
                  </div>
                  <span className="text-xs shrink-0">
                    {t.esito === "autorizzato" ? "🟢" : t.esito === "warning" ? "🟡" : "🔴"}
                  </span>
                </div>
              );
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
