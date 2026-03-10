import { Users } from "lucide-react";
import { getPresentiOra } from "@/data/mock-badges";
import { mockCantieri } from "@/data/mock-data";

export function PresenzaLiveWidget() {
  const totale = getPresentiOra();

  return (
    <div className="border border-border bg-card rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Users className="h-4 w-4 text-primary" />
        <span className="font-heading font-semibold text-sm text-foreground">Presenti ora</span>
        <span className="ml-auto relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
      </div>
      <p className="font-heading font-bold text-3xl text-foreground">{totale}</p>
      <p className="text-xs text-muted-foreground mt-1">lavoratori in cantiere</p>
      <div className="mt-3 space-y-1">
        {mockCantieri.map((c) => {
          const n = getPresentiOra(c.id);
          return (
            <div key={c.id} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground truncate">{c.nome}</span>
              <span className="font-medium text-foreground">{n}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
