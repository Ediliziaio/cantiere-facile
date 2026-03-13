import { useState } from "react";
import { CalendarClock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockScadenze, mockCantieri } from "@/data/mock-data";
import { DocumentStatusBadge } from "@/components/cantiere/DocumentStatusBadge";
import type { DocumentoStato } from "@/data/mock-data";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/superadmin/PaginationControls";

type FilterRange = "tutti" | "oggi" | "7gg" | "30gg" | "scaduto";

export default function Scadenze() {
  const [range, setRange] = useState<FilterRange>("tutti");
  const [filterCantiere, setFilterCantiere] = useState("tutti");
  const today = new Date();

  const cantieriNames = [...new Set(mockScadenze.map((s) => s.cantiere))].sort();

  const filtered = mockScadenze.filter((s) => {
    const scad = new Date(s.data_scadenza);
    const diff = Math.ceil((scad.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const matchRange = range === "tutti" ? true
      : range === "oggi" ? diff <= 0 && diff >= -1
      : range === "7gg" ? diff <= 7 && diff > 0
      : range === "30gg" ? diff <= 30 && diff > 0
      : range === "scaduto" ? diff < 0
      : true;
    const matchCantiere = filterCantiere === "tutti" || s.cantiere === filterCantiere;
    return matchRange && matchCantiere;
  });

  const { paginatedItems, page, totalPages, from, to, total, perPage, setPerPage, nextPage, prevPage, showPagination } = usePagination(filtered, 10);

  const ranges: { key: FilterRange; label: string }[] = [
    { key: "tutti", label: "Tutti" },
    { key: "scaduto", label: "Scaduti" },
    { key: "oggi", label: "Oggi" },
    { key: "7gg", label: "7 giorni" },
    { key: "30gg", label: "30 giorni" },
  ];

  const exportCsv = () => {
    const header = "Categoria,Cantiere,Data Scadenza,Stato";
    const rows = filtered.map((s) =>
      `"${s.categoria}","${s.cantiere}","${new Date(s.data_scadenza).toLocaleDateString("it-IT")}","${s.stato}"`
    );
    const blob = new Blob([header + "\n" + rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "scadenze.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-primary" />
          <h1 className="font-heading font-bold text-2xl text-foreground">Scadenze</h1>
        </div>
        <Button variant="outline" size="sm" onClick={exportCsv}>
          <Download className="h-4 w-4 mr-1" /> CSV
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="overflow-x-auto scrollbar-hide -mx-1 px-1">
          <div className="flex gap-1 w-max">
            {ranges.map((r) => (
              <Button key={r.key} variant={range === r.key ? "default" : "outline"} size="sm" onClick={() => setRange(r.key)} className="text-xs whitespace-nowrap">
                {r.label}
              </Button>
            ))}
          </div>
        </div>
        <Select value={filterCantiere} onValueChange={setFilterCantiere}>
          <SelectTrigger className="w-52"><SelectValue placeholder="Cantiere" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="tutti">Tutti i cantieri</SelectItem>
            {cantieriNames.map((name) => (
              <SelectItem key={name} value={name}>{name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border border-border rounded-lg divide-y divide-border">
        {paginatedItems.length === 0 && <p className="p-6 text-sm text-muted-foreground text-center">Nessuna scadenza in questo periodo.</p>}
        {paginatedItems.map((s) => (
          <div key={s.id} className="flex items-center justify-between px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">{s.categoria}</p>
              <p className="text-xs text-muted-foreground">{s.cantiere} · Scade il {new Date(s.data_scadenza).toLocaleDateString("it-IT")}</p>
            </div>
            <DocumentStatusBadge stato={s.stato as DocumentoStato} />
          </div>
        ))}
      </div>

      <PaginationControls from={from} to={to} total={total} page={page} totalPages={totalPages} perPage={perPage} setPerPage={setPerPage} nextPage={nextPage} prevPage={prevPage} showPagination={showPagination} />
    </div>
  );
}
