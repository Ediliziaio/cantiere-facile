import { MapPin, Users, FileText } from "lucide-react";
import { ChecklistProgress } from "./ChecklistProgress";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface CantiereSummaryCardProps {
  id: string;
  nome: string;
  comune: string;
  stato: "attivo" | "chiuso" | "sospeso";
  lavoratoriCount: number;
  documentiOk: number;
  documentiTotali: number;
  className?: string;
}

const statoLabel: Record<string, { label: string; className: string }> = {
  attivo: { label: "Attivo", className: "bg-success/15 text-success" },
  chiuso: { label: "Chiuso", className: "bg-muted text-muted-foreground" },
  sospeso: { label: "Sospeso", className: "bg-warning/15 text-warning" },
};

export function CantiereSummaryCard({ id, nome, comune, stato, lavoratoriCount, documentiOk, documentiTotali, className }: CantiereSummaryCardProps) {
  const s = statoLabel[stato];

  return (
    <Link
      to={`/cantieri/${id}`}
      className={cn("block border border-border bg-card p-4 rounded-lg hover:border-primary/40 transition-colors", className)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-heading font-semibold text-base text-foreground truncate">{nome}</h3>
            <span className={cn("shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider", s.className)}>
              {s.label}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{comune}</span>
          </div>
        </div>
        <ChecklistProgress completed={documentiOk} total={documentiTotali} size="md" />
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5" />
          {lavoratoriCount} lavoratori
        </span>
        <span className="flex items-center gap-1">
          <FileText className="h-3.5 w-3.5" />
          {documentiOk}/{documentiTotali} documenti
        </span>
      </div>
    </Link>
  );
}
