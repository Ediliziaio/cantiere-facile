import { ShieldCheck } from "lucide-react";
import { mockAccessi, mockCantieri } from "@/data/mock-data";

export default function Accessi() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <h1 className="font-heading font-bold text-2xl text-foreground">Registro Accessi</h1>
      </div>

      <div className="border border-border rounded-lg divide-y divide-border">
        {mockAccessi.map((a) => {
          const cantiere = mockCantieri.find((c) => c.id === a.cantiere_id);
          return (
            <div key={a.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">{a.lavoratore_nome}</p>
                <p className="text-xs text-muted-foreground">
                  {a.tipo === "entrata" ? "↗ Entrata" : "↙ Uscita"} · {new Date(a.timestamp).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })} · {cantiere?.nome}
                </p>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground border border-border rounded-sm px-1.5 py-0.5">{a.metodo}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
