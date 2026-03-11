import { HardHat, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { mockLavoratori, mockSubappaltatori } from "@/data/mock-data";

export default function Lavoratori() {
  const [search, setSearch] = useState("");
  const filtered = mockLavoratori.filter((l) =>
    `${l.nome} ${l.cognome}`.toLowerCase().includes(search.toLowerCase()) ||
    l.mansione.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <HardHat className="h-5 w-5 text-primary" />
        <h1 className="font-heading font-bold text-2xl text-foreground">Lavoratori</h1>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Cerca lavoratore..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="border border-border rounded-lg divide-y divide-border">
        {filtered.length === 0 && <p className="p-6 text-sm text-muted-foreground text-center">Nessun lavoratore trovato.</p>}
        {filtered.map((l) => {
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
    </div>
  );
}
