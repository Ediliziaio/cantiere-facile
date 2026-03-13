import { Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockCantieri } from "@/data/mock-data";
import { CantiereSummaryCard } from "@/components/cantiere/CantiereSummaryCard";

export default function Cantieri() {
  const [search, setSearch] = useState("");
  const [filterStato, setFilterStato] = useState("tutti");

  const filtered = mockCantieri.filter((c) => {
    const matchSearch = c.nome.toLowerCase().includes(search.toLowerCase()) || c.comune.toLowerCase().includes(search.toLowerCase());
    const matchStato = filterStato === "tutti" || c.stato === filterStato;
    return matchSearch && matchStato;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading font-bold text-2xl text-foreground">Cantieri</h1>
        <Button size="sm" asChild>
          <Link to="/app/cantieri/nuovo"><Plus className="h-3.5 w-3.5 mr-1" /> Nuovo cantiere</Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cerca cantiere..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterStato} onValueChange={setFilterStato}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Stato" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="tutti">Tutti gli stati</SelectItem>
            <SelectItem value="attivo">Attivo</SelectItem>
            <SelectItem value="completato">Completato</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <CantiereSummaryCard key={c.id} id={c.id} nome={c.nome} comune={c.comune} stato={c.stato} lavoratoriCount={c.lavoratori_count} documentiOk={c.documenti_ok} documentiTotali={c.documenti_totali} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-muted-foreground py-8 text-center">Nessun cantiere trovato.</p>
      )}
    </div>
  );
}
