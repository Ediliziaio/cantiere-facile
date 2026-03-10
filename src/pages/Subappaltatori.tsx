import { Link } from "react-router-dom";
import { Building, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { mockSubappaltatori, mockCantieri } from "@/data/mock-data";
import { ChecklistProgress } from "@/components/cantiere/ChecklistProgress";

export default function Subappaltatori() {
  const [search, setSearch] = useState("");
  const filtered = mockSubappaltatori.filter((s) =>
    s.ragione_sociale.toLowerCase().includes(search.toLowerCase())
  );

  const semaphore = (stato: string) => {
    if (stato === "completo") return "bg-success";
    if (stato === "in_scadenza") return "bg-warning";
    return "bg-destructive";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Building className="h-5 w-5 text-primary" />
        <h1 className="font-heading font-bold text-2xl text-foreground">Subappaltatori</h1>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Cerca subappaltatore..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="border border-border rounded-lg divide-y divide-border">
        {filtered.length === 0 && <p className="p-6 text-sm text-muted-foreground text-center">Nessun subappaltatore trovato.</p>}
        {filtered.map((s) => {
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
    </div>
  );
}
