import { cn } from "@/lib/utils";
import type { DocumentoStato } from "@/data/mock-data";

const statusConfig: Record<DocumentoStato, { label: string; className: string }> = {
  valido: { label: "Valido", className: "bg-success/15 text-success border-success/30" },
  in_scadenza: { label: "In scadenza", className: "bg-warning/15 text-warning border-warning/30" },
  scaduto: { label: "Scaduto", className: "bg-destructive/15 text-destructive border-destructive/30" },
  da_verificare: { label: "Da verificare", className: "bg-muted text-muted-foreground border-border" },
};

export function DocumentStatusBadge({ stato, className }: { stato: DocumentoStato; className?: string }) {
  const config = statusConfig[stato];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-xs font-medium uppercase tracking-wide", config.className, className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", {
        "bg-success": stato === "valido",
        "bg-warning": stato === "in_scadenza",
        "bg-destructive": stato === "scaduto",
        "bg-muted-foreground": stato === "da_verificare",
      })} />
      {config.label}
    </span>
  );
}
