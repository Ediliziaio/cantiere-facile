import { HardHat, Search, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockLavoratori, mockSubappaltatori, mockCantieri, mockSiteAssignments } from "@/data/mock-data";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/superadmin/PaginationControls";

export default function Lavoratori() {
  const [search, setSearch] = useState("");
  const [filterTipo, setFilterTipo] = useState("tutti");
  const [filterCantiere, setFilterCantiere] = useState("tutti");

  const filtered = mockLavoratori.filter((l) => {
    const matchSearch = `${l.nome} ${l.cognome}`.toLowerCase().includes(search.toLowerCase()) ||
      l.mansione.toLowerCase().includes(search.toLowerCase());
    const matchTipo = filterTipo === "tutti" || l.tipo === filterTipo;
    const matchCantiere = filterCantiere === "tutti" ||
      mockSiteAssignments.some((sa) => sa.lavoratore_id === l.id && sa.cantiere_id === filterCantiere && sa.attivo);
    return matchSearch && matchTipo && matchCantiere;
  });

  const { paginatedItems, page, totalPages, from, to, total, perPage, setPerPage, nextPage, prevPage, showPagination } = usePagination(filtered, 10);

  const exportCsv = () => {
    const header = "Nome,Cognome,Mansione,Tipo,Subappaltatore";
    const rows = filtered.map((l) => {
      const sub = l.subappaltatore_id ? mockSubappaltatori.find((s) => s.id === l.subappaltatore_id) : null;
      return `"${l.nome}","${l.cognome}","${l.mansione}","${l.tipo}","${sub?.ragione_sociale || ""}"`;
    });
    const blob = new Blob([header + "\n" + rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "lavoratori.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HardHat className="h-5 w-5 text-primary" />
          <h1 className="font-heading font-bold text-2xl text-foreground">Lavoratori</h1>
        </div>
        <Button variant="outline" size="sm" onClick={exportCsv}>
          <Download className="h-4 w-4 mr-1" /> CSV
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cerca lavoratore..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterTipo} onValueChange={setFilterTipo}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Tipo" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="tutti">Tutti i tipi</SelectItem>
            <SelectItem value="interno">Interno</SelectItem>
            <SelectItem value="esterno">Esterno</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCantiere} onValueChange={setFilterCantiere}>
          <SelectTrigger className="w-52"><SelectValue placeholder="Cantiere" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="tutti">Tutti i cantieri</SelectItem>
            {mockCantieri.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border border-border rounded-lg divide-y divide-border">
        {paginatedItems.length === 0 && <p className="p-6 text-sm text-muted-foreground text-center">Nessun lavoratore trovato.</p>}
        {paginatedItems.map((l) => {
          const sub = l.subappaltatore_id ? mockSubappaltatori.find((s) => s.id === l.subappaltatore_id) : null;
          return (
            <Link key={l.id} to={`/app/lavoratori/${l.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-accent active:bg-accent transition-colors active:scale-[0.99]">
              <div>
                <p className="text-sm font-medium text-foreground">{l.nome} {l.cognome}</p>
                <p className="text-xs text-muted-foreground">
                  {l.mansione} · {l.tipo === "interno" ? "Interno" : sub?.ragione_sociale || "Esterno"}
                </p>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground border border-border rounded-sm px-1.5 py-0.5">
                {l.tipo}
              </span>
            </Link>
          );
        })}
      </div>

      <PaginationControls from={from} to={to} total={total} page={page} totalPages={totalPages} perPage={perPage} setPerPage={setPerPage} nextPage={nextPage} prevPage={prevPage} showPagination={showPagination} />
    </div>
  );
}
