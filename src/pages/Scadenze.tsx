import { useState } from "react";
import { CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockScadenze } from "@/data/mock-data";
import { DocumentStatusBadge } from "@/components/cantiere/DocumentStatusBadge";
import type { DocumentoStato } from "@/data/mock-data";

type FilterRange = "tutti" | "oggi" | "7gg" | "30gg" | "scaduto";

export default function Scadenze() {
  const [range, setRange] = useState<FilterRange>("tutti");
  const today = new Date();

  const filtered = mockScadenze.filter((s) => {
    const scad = new Date(s.data_scadenza);
    const diff = Math.ceil((scad.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (range === "oggi") return diff <= 0 && diff >= -1;
    if (range === "7gg") return diff <= 7 && diff > 0;
    if (range === "30gg") return diff <= 30 && diff > 0;
    if (range === "scaduto") return diff < 0;
    return true;
  });

  const ranges: { key: FilterRange; label: string }[] = [
    { key: "tutti", label: "Tutti" },
    { key: "scaduto", label: "Scaduti" },
    { key: "oggi", label: "Oggi" },
    { key: "7gg", label: "7 giorni" },
    { key: "30gg", label: "30 giorni" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CalendarClock className="h-5 w-5 text-primary" />
        <h1 className="font-heading font-bold text-2xl text-foreground">Scadenze</h1>
      </div>

      <div className="overflow-x-auto scrollbar-hide -mx-1 px-1">
        <div className="flex gap-1 w-max">
          {ranges.map((r) => (
            <Button key={r.key} variant={range === r.key ? "default" : "outline"} size="sm" onClick={() => setRange(r.key)} className="text-xs whitespace-nowrap">
              {r.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="border border-border rounded-lg divide-y divide-border">
        {filtered.length === 0 && <p className="p-6 text-sm text-muted-foreground text-center">Nessuna scadenza in questo periodo.</p>}
        {filtered.map((s) => (
          <div key={s.id} className="flex items-center justify-between px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">{s.categoria}</p>
              <p className="text-xs text-muted-foreground">{s.cantiere} · Scade il {new Date(s.data_scadenza).toLocaleDateString("it-IT")}</p>
            </div>
            <DocumentStatusBadge stato={s.stato as DocumentoStato} />
          </div>
        ))}
      </div>
    </div>
  );
}
