import { Truck } from "lucide-react";
import { mockMezzi, mockCantieri } from "@/data/mock-data";

export default function Mezzi() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Truck className="h-5 w-5 text-primary" />
        <h1 className="font-heading font-bold text-2xl text-foreground">Mezzi d'opera</h1>
      </div>

      <div className="border border-border rounded-lg divide-y divide-border">
        {mockMezzi.map((m) => {
          const cantiere = mockCantieri.find((c) => c.id === m.cantiere_id);
          return (
            <div key={m.id} className="px-4 py-3">
              <p className="text-sm font-medium text-foreground">{m.tipo} — {m.targa_o_matricola}</p>
              <p className="text-xs text-muted-foreground">{m.descrizione} · {cantiere?.nome}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
