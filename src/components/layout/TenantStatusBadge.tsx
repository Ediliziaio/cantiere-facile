import { cn } from "@/lib/utils";

const config: Record<string, { label: string; className: string }> = {
  attivo: { label: "Attivo", className: "bg-success/15 text-success" },
  trial: { label: "Trial", className: "bg-warning/15 text-warning" },
  sospeso: { label: "Sospeso", className: "bg-destructive/15 text-destructive" },
  scaduto: { label: "Scaduto", className: "bg-muted text-muted-foreground" },
};

export function TenantStatusBadge({ stato }: { stato: string }) {
  const c = config[stato] ?? config.scaduto;
  return (
    <span className={cn("rounded-sm px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider", c.className)}>
      {c.label}
    </span>
  );
}
