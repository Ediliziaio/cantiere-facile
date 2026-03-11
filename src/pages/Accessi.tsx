import { useState, useMemo } from "react";
import { ShieldCheck, Users, LogIn, LogOut, OctagonX, Search, CalendarIcon, ChevronDown } from "lucide-react";
import { mockTimbrature, getPresentiOra } from "@/data/mock-badges";
import { mockCantieri, mockLavoratori } from "@/data/mock-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const esitoColors: Record<string, string> = {
  autorizzato: "border-l-emerald-500",
  warning: "border-l-amber-500",
  bloccato: "border-l-red-500",
};

interface DaySummary {
  lavoratoreId: string;
  cantiereId: string;
  entrata: string | null;
  uscita: string | null;
  minutiLavorati: number | null;
  inCorso: boolean;
  esito: string;
  motivoBlocco?: string;
}

export default function Accessi() {
  const [filtroCantiere, setFiltroCantiere] = useState("tutti");
  const [searchLav, setSearchLav] = useState("");
  const [filtroData, setFiltroData] = useState<Date>(new Date("2026-03-10"));
  const [logOpen, setLogOpen] = useState(false);

  const sorted = useMemo(() => [...mockTimbrature].sort((a, b) => b.timestamp.localeCompare(a.timestamp)), []);

  const dateStr = format(filtroData, "yyyy-MM-dd");

  // Build daily summaries grouped by worker+site
  const summaries = useMemo(() => {
    const dayTs = sorted.filter((t) => t.timestamp.startsWith(dateStr));
    const map = new Map<string, DaySummary>();

    for (const t of dayTs) {
      const key = `${t.lavoratore_id}_${t.cantiere_id}`;
      if (!map.has(key)) {
        map.set(key, {
          lavoratoreId: t.lavoratore_id,
          cantiereId: t.cantiere_id,
          entrata: null,
          uscita: null,
          minutiLavorati: null,
          inCorso: false,
          esito: t.esito,
          motivoBlocco: t.motivo_blocco,
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
      }
      if (t.tipo === "uscita" && (!s.uscita || t.timestamp > s.uscita)) {
        s.uscita = t.timestamp;
      }
    }

    for (const s of map.values()) {
      if (s.entrata && s.uscita) {
        s.minutiLavorati = Math.round((new Date(s.uscita).getTime() - new Date(s.entrata).getTime()) / 60000);
      } else if (s.entrata && !s.uscita && s.esito !== "bloccato") {
        s.inCorso = true;
      }
    }

    return Array.from(map.values());
  }, [sorted, dateStr]);

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
  const todayTs = sorted.filter((t) => t.timestamp.startsWith(dateStr));
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
    if (inCorso) return null; // handled separately
    if (min == null || min <= 0) return "—";
    return `${Math.floor(min / 60)}h ${min % 60}m`;
  };

  // Filtered raw log for collapsible section
  const filteredRaw = useMemo(() => {
    return sorted.filter((t) => {
      if (!t.timestamp.startsWith(dateStr)) return false;
      if (filtroCantiere !== "tutti" && t.cantiere_id !== filtroCantiere) return false;
      if (searchLav) {
        const lav = mockLavoratori.find((l) => l.id === t.lavoratore_id);
        if (!lav || !`${lav.nome} ${lav.cognome}`.toLowerCase().includes(searchLav.toLowerCase())) return false;
      }
      return true;
    });
  }, [sorted, dateStr, filtroCantiere, searchLav]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <h1 className="font-heading font-bold text-2xl text-foreground">Registro Accessi</h1>
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

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cerca lavoratore…" value={searchLav} onChange={(e) => setSearchLav(e.target.value)} className="pl-9" />
        </div>
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
              <TableHead className="text-center">Entrata</TableHead>
              <TableHead className="text-center">Uscita</TableHead>
              <TableHead className="text-center">Ore</TableHead>
              <TableHead className="text-center w-16">Esito</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Nessun accesso trovato per questa data
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((s) => {
                const lav = getLav(s.lavoratoreId);
                return (
                  <TableRow key={`${s.lavoratoreId}_${s.cantiereId}`}>
                    <TableCell className="font-medium text-foreground">
                      {lav ? `${lav.nome} ${lav.cognome}` : "—"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-xs">
                      {lav?.mansione ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm">{getCantName(s.cantiereId)}</TableCell>
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
                <TableCell colSpan={5} className="text-right font-semibold text-foreground">Totale ore</TableCell>
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
