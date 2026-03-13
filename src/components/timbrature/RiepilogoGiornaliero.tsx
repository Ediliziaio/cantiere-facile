import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockLavoratori, mockCantieri } from "@/data/mock-data";
import { Coffee, ChevronRight, ChevronDown, LogIn, LogOut, Clock, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/superadmin/PaginationControls";
import { Badge } from "@/components/ui/badge";

interface Timbratura {
  id: string;
  lavoratore_id: string;
  cantiere_id: string;
  timestamp: string;
  tipo: string;
  esito: string;
  metodo?: string;
  motivo_blocco?: string;
}

interface RiepilogoRow {
  lavoratore: string;
  lavoratoreId: string;
  data: string;
  cantiere: string;
  entrata: string;
  uscita: string;
  numPause: number;
  durataPause: number;
  oreNette: number;
}

const tipoLabels: Record<string, { label: string; icon: React.ReactNode }> = {
  entrata: { label: "Entrata", icon: <LogIn className="h-3.5 w-3.5 text-green-600" /> },
  uscita: { label: "Uscita", icon: <LogOut className="h-3.5 w-3.5 text-red-600" /> },
  pausa_inizio: { label: "Inizio pausa", icon: <Coffee className="h-3.5 w-3.5 text-amber-600" /> },
  pausa_fine: { label: "Fine pausa", icon: <Coffee className="h-3.5 w-3.5 text-green-600" /> },
};

function calcOreLavorate(timbrature: Timbratura[], lavoratoreId: string, dateStr: string) {
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

function calcDurataPauseTotale(timbrature: Timbratura[], lavoratoreId: string, dateStr: string) {
  const dayTs = timbrature
    .filter((t) => t.lavoratore_id === lavoratoreId && t.timestamp.startsWith(dateStr))
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  let total = 0;
  for (let i = 0; i < dayTs.length; i++) {
    if (dayTs[i].tipo === "pausa_inizio") {
      const fine = dayTs.slice(i + 1).find((t) => t.tipo === "pausa_fine");
      if (fine) {
        total += (new Date(fine.timestamp).getTime() - new Date(dayTs[i].timestamp).getTime()) / 60000;
      }
    }
  }
  return Math.round(total);
}

interface Props {
  filtered: Timbratura[];
  allTimbrature: Timbratura[];
}

export function RiepilogoGiornaliero({ filtered, allTimbrature }: Props) {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const rows = useMemo<RiepilogoRow[]>(() => {
    const groups = new Map<string, Timbratura[]>();
    for (const t of filtered) {
      const dateStr = t.timestamp.substring(0, 10);
      const key = `${t.lavoratore_id}_${dateStr}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(t);
    }

    const result: RiepilogoRow[] = [];
    for (const [, items] of groups) {
      const sorted = items.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
      const lid = sorted[0].lavoratore_id;
      const dateStr = sorted[0].timestamp.substring(0, 10);
      const lav = mockLavoratori.find((l) => l.id === lid);
      const cantiere = mockCantieri.find((c) => c.id === sorted[0].cantiere_id);

      const entrata = sorted.find((t) => t.tipo === "entrata");
      const uscita = [...sorted].reverse().find((t) => t.tipo === "uscita");
      const numPause = sorted.filter((t) => t.tipo === "pausa_inizio").length;

      result.push({
        lavoratore: lav ? `${lav.nome} ${lav.cognome}` : "—",
        lavoratoreId: lid,
        data: dateStr,
        cantiere: cantiere?.nome ?? "—",
        entrata: entrata ? new Date(entrata.timestamp).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }) : "—",
        uscita: uscita ? new Date(uscita.timestamp).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }) : "—",
        numPause,
        durataPause: calcDurataPauseTotale(allTimbrature, lid, dateStr),
        oreNette: calcOreLavorate(allTimbrature, lid, dateStr),
      });
    }

    return result.sort((a, b) => b.data.localeCompare(a.data) || a.lavoratore.localeCompare(b.lavoratore));
  }, [filtered, allTimbrature]);

  const { paginatedItems, page, totalPages, from, to, total, perPage, setPerPage, nextPage, prevPage, showPagination } = usePagination(rows, 10);

  const getDetailTimbrature = (lavoratoreId: string, dateStr: string) => {
    return allTimbrature
      .filter((t) => t.lavoratore_id === lavoratoreId && t.timestamp.startsWith(dateStr))
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  };

  if (rows.length === 0) {
    return <p className="px-4 py-8 text-sm text-muted-foreground text-center">Nessun riepilogo disponibile</p>;
  }

  return (
    <div className="space-y-4">
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead>Lavoratore</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Cantiere</TableHead>
              <TableHead>Entrata</TableHead>
              <TableHead>Uscita</TableHead>
              <TableHead className="text-center">
                <Coffee className="h-3.5 w-3.5 inline mr-1" />Pause
              </TableHead>
              <TableHead className="text-center">Durata pause</TableHead>
              <TableHead className="text-center">Ore nette</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.map((r) => {
              const key = `${r.lavoratoreId}_${r.data}`;
              const isExpanded = expandedKey === key;
              return (
                <>
                  <TableRow
                    key={key}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setExpandedKey(isExpanded ? null : key)}
                  >
                    <TableCell className="w-8 px-2">
                      {isExpanded
                        ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                    </TableCell>
                    <TableCell className="font-medium">{r.lavoratore}</TableCell>
                    <TableCell>{new Date(r.data).toLocaleDateString("it-IT")}</TableCell>
                    <TableCell>{r.cantiere}</TableCell>
                    <TableCell>{r.entrata}</TableCell>
                    <TableCell>{r.uscita}</TableCell>
                    <TableCell className="text-center">{r.numPause}</TableCell>
                    <TableCell className="text-center">{r.durataPause > 0 ? `${r.durataPause}min` : "—"}</TableCell>
                    <TableCell className="text-center font-medium">
                      {Math.floor(r.oreNette / 60)}h {Math.round(r.oreNette % 60)}m
                    </TableCell>
                  </TableRow>
                  {isExpanded && (
                    <TableRow key={`${key}_detail`} className="bg-muted/30 hover:bg-muted/30">
                      <TableCell colSpan={9} className="p-0">
                        <div className="px-6 py-3 space-y-1.5">
                          <p className="text-xs font-medium text-muted-foreground mb-2">Dettaglio timbrature</p>
                          {getDetailTimbrature(r.lavoratoreId, r.data).map((t) => {
                            const info = tipoLabels[t.tipo] ?? { label: t.tipo, icon: <Clock className="h-3.5 w-3.5" /> };
                            return (
                              <div key={t.id} className="flex items-center gap-3 text-sm">
                                <span className="text-xs text-muted-foreground w-12">
                                  {new Date(t.timestamp).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  {info.icon}
                                  <span>{info.label}</span>
                                </span>
                                {t.esito === "ok" ? (
                                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                                ) : t.esito === "bloccato" ? (
                                  <XCircle className="h-3.5 w-3.5 text-destructive" />
                                ) : (
                                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                                )}
                                {t.metodo && (
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">{t.metodo}</Badge>
                                )}
                                {t.motivo_blocco && (
                                  <span className="text-xs text-destructive">{t.motivo_blocco}</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <PaginationControls
        from={from} to={to} total={total} page={page} totalPages={totalPages}
        perPage={perPage} setPerPage={setPerPage} nextPage={nextPage} prevPage={prevPage}
        showPagination={showPagination}
      />
    </div>
  );
}

export function exportRiepilogoCsv(filtered: Timbratura[], allTimbrature: Timbratura[]) {
  const groups = new Map<string, Timbratura[]>();
  for (const t of filtered) {
    const dateStr = t.timestamp.substring(0, 10);
    const key = `${t.lavoratore_id}_${dateStr}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(t);
  }

  const header = "Lavoratore,Data,Cantiere,Entrata,Uscita,N. Pause,Durata Pause (min),Ore Nette";
  const rows: string[] = [];

  for (const [, items] of groups) {
    const sorted = items.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    const lid = sorted[0].lavoratore_id;
    const dateStr = sorted[0].timestamp.substring(0, 10);
    const lav = mockLavoratori.find((l) => l.id === lid);
    const cantiere = mockCantieri.find((c) => c.id === sorted[0].cantiere_id);
    const entrata = sorted.find((t) => t.tipo === "entrata");
    const uscita = [...sorted].reverse().find((t) => t.tipo === "uscita");
    const numPause = sorted.filter((t) => t.tipo === "pausa_inizio").length;
    const durataPause = calcDurataPauseTotale(allTimbrature, lid, dateStr);
    const oreNette = Math.round(calcOreLavorate(allTimbrature, lid, dateStr) / 60 * 10) / 10;

    const fmt = (ts?: string) => ts ? new Date(ts).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }) : "";

    rows.push(`"${lav ? `${lav.nome} ${lav.cognome}` : ""}","${new Date(dateStr).toLocaleDateString("it-IT")}","${cantiere?.nome ?? ""}","${fmt(entrata?.timestamp)}","${fmt(uscita?.timestamp)}",${numPause},${durataPause},${oreNette}`);
  }

  const blob = new Blob([header + "\n" + rows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "riepilogo-timbrature.csv"; a.click();
  URL.revokeObjectURL(url);
}
