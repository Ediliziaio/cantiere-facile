import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { mockTimbrature, mockBadges } from "@/data/mock-badges";
import { mockCantieri, mockLavoratori } from "@/data/mock-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Search, IdCard, Clock, Coffee, Play, List, LayoutGrid } from "lucide-react";
import { RiepilogoGiornaliero, exportRiepilogoCsv } from "@/components/timbrature/RiepilogoGiornaliero";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const esitoColors: Record<string, string> = {
  autorizzato: "border-l-emerald-500",
  warning: "border-l-amber-500",
  bloccato: "border-l-red-500",
};

const tipoLabels: Record<string, { icon: React.ReactNode; label: string }> = {
  entrata: { icon: <span>↗</span>, label: "Entrata" },
  uscita: { icon: <span>↙</span>, label: "Uscita" },
  pausa_inizio: { icon: <Coffee className="inline h-3 w-3" />, label: "Pausa" },
  pausa_fine: { icon: <Play className="inline h-3 w-3" />, label: "Fine pausa" },
};

function calcOreLavorate(timbrature: typeof mockTimbrature, lavoratoreId: string, dateStr: string) {
  const dayTs = timbrature
    .filter((t) => t.lavoratore_id === lavoratoreId && t.timestamp.startsWith(dateStr))
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  let totalMinutes = 0;
  let activeStart: Date | null = null;

  for (const t of dayTs) {
    const time = new Date(t.timestamp);
    if (t.tipo === "entrata" || t.tipo === "pausa_fine") {
      if (!activeStart) activeStart = time;
    } else if (t.tipo === "pausa_inizio" || t.tipo === "uscita") {
      if (activeStart) {
        totalMinutes += (time.getTime() - activeStart.getTime()) / 60000;
        activeStart = null;
      }
    }
  }
  return totalMinutes;
}

function calcDurataPausa(timbrature: typeof mockTimbrature, lavoratoreId: string, dateStr: string, pausaTimestamp: string) {
  const dayTs = timbrature
    .filter((t) => t.lavoratore_id === lavoratoreId && t.timestamp.startsWith(dateStr))
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  const idx = dayTs.findIndex((t) => t.timestamp === pausaTimestamp && t.tipo === "pausa_inizio");
  if (idx >= 0) {
    const fine = dayTs.slice(idx + 1).find((t) => t.tipo === "pausa_fine");
    if (fine) {
      return Math.round((new Date(fine.timestamp).getTime() - new Date(pausaTimestamp).getTime()) / 60000);
    }
  }
  return 0;
}

export default function Timbrature() {
  const [filtroEsito, setFiltroEsito] = useState("tutti");
  const [filtroCantiere, setFiltroCantiere] = useState("tutti");
  const [filtroTipo, setFiltroTipo] = useState("tutti");
  const [filtroData, setFiltroData] = useState<Date | undefined>(undefined);
  const [searchLav, setSearchLav] = useState("");
  const [vista, setVista] = useState<"log" | "riepilogo">("log");

  const sorted = useMemo(() => [...mockTimbrature].sort((a, b) => b.timestamp.localeCompare(a.timestamp)), []);

  const filtered = useMemo(() => {
    return sorted.filter((t) => {
      if (filtroEsito !== "tutti" && t.esito !== filtroEsito) return false;
      if (filtroCantiere !== "tutti" && t.cantiere_id !== filtroCantiere) return false;
      if (filtroTipo !== "tutti") {
        if (filtroTipo === "pause") {
          if (t.tipo !== "pausa_inizio" && t.tipo !== "pausa_fine") return false;
        } else if (t.tipo !== filtroTipo) return false;
      }
      if (filtroData) {
        const dateStr = format(filtroData, "yyyy-MM-dd");
        if (!t.timestamp.startsWith(dateStr)) return false;
      }
      if (searchLav) {
        const lav = mockLavoratori.find((l) => l.id === t.lavoratore_id);
        if (!lav || !`${lav.nome} ${lav.cognome}`.toLowerCase().includes(searchLav.toLowerCase())) return false;
      }
      return true;
    });
  }, [sorted, filtroEsito, filtroCantiere, filtroTipo, filtroData, searchLav]);

  const today = "2026-03-10";
  const todayTs = sorted.filter((t) => t.timestamp.startsWith(today));
  const presenti = new Set(todayTs.filter((t) => t.tipo === "entrata").map((t) => t.lavoratore_id)).size;
  const ingressi = todayTs.filter((t) => t.tipo === "entrata").length;
  const bloccati = todayTs.filter((t) => t.esito === "bloccato").length;
  const pauseOggi = todayTs.filter((t) => t.tipo === "pausa_inizio").length;

  const oreTotali = useMemo(() => {
    const dayWorkerPairs = new Set<string>();
    let total = 0;
    for (const t of filtered) {
      const dateStr = t.timestamp.substring(0, 10);
      const key = `${t.lavoratore_id}_${dateStr}`;
      if (!dayWorkerPairs.has(key)) {
        dayWorkerPairs.add(key);
        total += calcOreLavorate(mockTimbrature, t.lavoratore_id, dateStr);
      }
    }
    return Math.round(total / 60 * 10) / 10;
  }, [filtered]);

  const getLav = (lid: string) => mockLavoratori.find((x) => x.id === lid);
  const getCantName = (cid: string) => mockCantieri.find((c) => c.id === cid)?.nome ?? "—";
  const getBadgeForLav = (lid: string) => mockBadges.find((b) => b.lavoratore_id === lid);
  const handleExportCsv = () => {
    if (vista === "riepilogo") {
      exportRiepilogoCsv(filtered, mockTimbrature);
      return;
    }
    const header = "Lavoratore,Data,Ora,Tipo,Cantiere,Esito,Metodo,Motivo blocco";
    const rows = filtered.map((t) => {
      const lav = getLav(t.lavoratore_id);
      const ts = new Date(t.timestamp);
      return `"${lav ? `${lav.nome} ${lav.cognome}` : ""}","${ts.toLocaleDateString("it-IT")}","${ts.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}","${t.tipo}","${getCantName(t.cantiere_id)}","${t.esito}","${t.metodo ?? ""}","${t.motivo_blocco ?? ""}"`;
    });
    const blob = new Blob([header + "\n" + rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "timbrature-log.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-heading font-bold text-2xl text-foreground">Timbrature</h1>
          <div className="flex border border-border rounded-md overflow-hidden">
            <Button variant={vista === "log" ? "default" : "ghost"} size="sm" className="rounded-none h-8 px-3" onClick={() => setVista("log")}>
              <List className="h-3.5 w-3.5 mr-1" /> Log
            </Button>
            <Button variant={vista === "riepilogo" ? "default" : "ghost"} size="sm" className="rounded-none h-8 px-3" onClick={() => setVista("riepilogo")}>
              <LayoutGrid className="h-3.5 w-3.5 mr-1" /> Riepilogo
            </Button>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleExportCsv}><Download className="h-3.5 w-3.5 mr-1" /> Esporta CSV</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="border border-border rounded-lg p-4 text-center">
          <p className="font-heading font-bold text-2xl text-foreground">{presenti}</p>
          <p className="text-xs text-muted-foreground">Presenti oggi</p>
        </div>
        <div className="border border-border rounded-lg p-4 text-center">
          <p className="font-heading font-bold text-2xl text-foreground">{ingressi}</p>
          <p className="text-xs text-muted-foreground">Ingressi oggi</p>
        </div>
        <div className="border border-border rounded-lg p-4 text-center">
          <p className="font-heading font-bold text-2xl text-destructive">{bloccati}</p>
          <p className="text-xs text-muted-foreground">Bloccati oggi</p>
        </div>
        <div className="border border-border rounded-lg p-4 text-center">
          <Coffee className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
          <p className="font-heading font-bold text-2xl text-foreground">{pauseOggi}</p>
          <p className="text-xs text-muted-foreground">Pause oggi</p>
        </div>
        <div className="border border-border rounded-lg p-4 text-center">
          <Clock className="h-4 w-4 text-primary mx-auto mb-1" />
          <p className="font-heading font-bold text-2xl text-foreground">{oreTotali}h</p>
          <p className="text-xs text-muted-foreground">Ore nette (filtro)</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cerca lavoratore…" value={searchLav} onChange={(e) => setSearchLav(e.target.value)} className="pl-9" />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-full sm:w-44 justify-start text-left font-normal", !filtroData && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filtroData ? format(filtroData, "dd/MM/yyyy") : "Filtra data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={filtroData} onSelect={setFiltroData} className={cn("p-3 pointer-events-auto")} />
            </PopoverContent>
          </Popover>
          <Select value={filtroCantiere} onValueChange={setFiltroCantiere}>
            <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="tutti">Tutti i cantieri</SelectItem>
              {mockCantieri.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filtroTipo} onValueChange={setFiltroTipo}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="tutti">Tutti i tipi</SelectItem>
              <SelectItem value="entrata">↗ Entrata</SelectItem>
              <SelectItem value="uscita">↙ Uscita</SelectItem>
              <SelectItem value="pause">☕ Pause</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filtroEsito} onValueChange={setFiltroEsito}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="tutti">Tutti</SelectItem>
              <SelectItem value="autorizzato">🟢 Autorizzato</SelectItem>
              <SelectItem value="warning">🟡 Warning</SelectItem>
              <SelectItem value="bloccato">🔴 Bloccato</SelectItem>
            </SelectContent>
          </Select>
          {filtroData && (
            <Button variant="ghost" size="sm" onClick={() => setFiltroData(undefined)}>Cancella data</Button>
          )}
        </div>
      </div>

      {/* Content */}
      {vista === "riepilogo" ? (
        <RiepilogoGiornaliero filtered={filtered} allTimbrature={mockTimbrature} />
      ) : (
        <div className="border border-border rounded-lg divide-y divide-border">
          {filtered.slice(0, 50).map((t) => {
            const lav = getLav(t.lavoratore_id);
            const badge = getBadgeForLav(t.lavoratore_id);
            const dateStr = t.timestamp.substring(0, 10);
            const ore = t.tipo === "uscita" ? calcOreLavorate(mockTimbrature, t.lavoratore_id, dateStr) : 0;
            const pausaDurata = t.tipo === "pausa_inizio" ? calcDurataPausa(mockTimbrature, t.lavoratore_id, dateStr, t.timestamp) : 0;
            const tipoInfo = tipoLabels[t.tipo] || tipoLabels.entrata;

            return (
              <div key={t.id} className={`flex items-center justify-between px-4 py-3 border-l-4 ${esitoColors[t.esito]}`}>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {lav ? `${lav.nome} ${lav.cognome}` : "—"}
                    <span className="font-normal text-muted-foreground ml-1.5 text-xs">{lav?.mansione}</span>
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    {tipoInfo.icon} {tipoInfo.label} · {getCantName(t.cantiere_id)} · {new Date(t.timestamp).toLocaleString("it-IT", {
                      day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
                    })}
                    {t.metodo && ` · ${t.metodo.replace("_", " ")}`}
                    {t.tipo === "uscita" && ore > 0 && ` · ${Math.floor(ore / 60)}h ${Math.round(ore % 60)}m netti`}
                    {t.tipo === "pausa_inizio" && pausaDurata > 0 && ` · ${pausaDurata}min`}
                  </p>
                  {t.motivo_blocco && <p className="text-xs text-destructive mt-0.5">{t.motivo_blocco}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs">
                    {t.esito === "autorizzato" ? "🟢" : t.esito === "warning" ? "🟡" : "🔴"}
                  </span>
                  {badge && (
                    <Button variant="ghost" size="sm" className="h-7 px-2" asChild>
                      <Link to={`/app/badge/${badge.id}`}><IdCard className="h-3 w-3" /></Link>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="px-4 py-8 text-sm text-muted-foreground text-center">Nessuna timbratura trovata</p>
          )}
        </div>
      )}
    </div>
  );
}
