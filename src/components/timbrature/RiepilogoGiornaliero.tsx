import { useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockLavoratori, mockCantieri } from "@/data/mock-data";
import { Coffee } from "lucide-react";

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

  if (rows.length === 0) {
    return <p className="px-4 py-8 text-sm text-muted-foreground text-center">Nessun riepilogo disponibile</p>;
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
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
          {rows.map((r) => (
            <TableRow key={`${r.lavoratoreId}_${r.data}`}>
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
          ))}
        </TableBody>
      </Table>
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
