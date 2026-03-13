import { Link } from "react-router-dom";
import { Building, Search, Download } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockSubappaltatori, mockCantieri } from "@/data/mock-data";
import { ChecklistProgress } from "@/components/cantiere/ChecklistProgress";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/superadmin/PaginationControls";

export default function Subappaltatori() {
  const [search, setSearch] = useState("");
  const [filterCantiere, setFilterCantiere] = useState("tutti");
  const [filterStato, setFilterStato] = useState("tutti");

  const filtered = mockSubappaltatori.filter((s) => {
    const matchSearch = s.ragione_sociale.toLowerCase().includes(search.toLowerCase());
    const matchCantiere = filterCantiere === "tutti" || s.cantiere_id === filterCantiere;
    const matchStato = filterStato === "tutti" || s.stato_documenti === filterStato;
    return matchSearch && matchCantiere && matchStato;
  });

  const { paginatedItems, page, totalPages, from, to, total, perPage, setPerPage, nextPage, prevPage, showPagination } = usePagination(filtered, 10);

  const semaphore = (stato: string) => {
    if (stato === "completo") return "bg-success";
    if (stato === "in_scadenza") return "bg-warning";
    return "bg-destructive";
  };

  const exportCsv = () => {
    const header = "Ragione Sociale,Cantiere,Email Referente,Documenti OK,Documenti Totali,Stato";
    const rows = filtered.map((s) => {
      const cantiere = mockCantieri.find((c) => c.id === s.cantiere_id);
      return `"${s.ragione_sociale}","${cantiere?.nome || ""}","${s.email_referente}",${s.documenti_ok},${s.documenti_totali},"${s.stato_documenti}"`;
    });
    const blob = new Blob([header + "\n" + rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "subappaltatori.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building className="h-5 w-5 text-primary" />
          <h1 className="font-heading font-bold text-2xl text-foreground">Subappaltatori</h1>
        </div>
        <Button variant="outline" size="sm" onClick={exportCsv}>
          <Download className="h-4 w-4 mr-1" /> CSV
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cerca subappaltatore..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterCantiere} onValueChange={setFilterCantiere}>
          <SelectTrigger className="w-52"><SelectValue placeholder="Cantiere" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="tutti">Tutti i cantieri</SelectItem>
            {mockCantieri.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStato} onValueChange={setFilterStato}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Stato documenti" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="tutti">Tutti gli stati</SelectItem>
            <SelectItem value="completo">Completo</SelectItem>
            <SelectItem value="in_scadenza">In scadenza</SelectItem>
            <SelectItem value="incompleto">Incompleto</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border border-border rounded-lg divide-y divide-border">
        {paginatedItems.length === 0 && <p className="p-6 text-sm text-muted-foreground text-center">Nessun subappaltatore trovato.</p>}
        {paginatedItems.map((s) => {
          const cantiere = mockCantieri.find((c) => c.id === s.cantiere_id);
          return (
            <Link key={s.id} to={`/app/subappaltatori/${s.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${semaphore(s.stato_documenti)}`} />
                <div>
                  <p className="text-sm font-medium text-foreground">{s.ragione_sociale}</p>
                  <p className="text-xs text-muted-foreground">{cantiere?.nome} · {s.email_referente}</p>
                </div>
              </div>
              <ChecklistProgress completed={s.documenti_ok} total={s.documenti_totali} size="sm" />
            </Link>
          );
        })}
      </div>

      <PaginationControls from={from} to={to} total={total} page={page} totalPages={totalPages} perPage={perPage} setPerPage={setPerPage} nextPage={nextPage} prevPage={prevPage} showPagination={showPagination} />
    </div>
  );
}
