import type { BadgeStato } from "@/data/mock-badges";

const config: Record<BadgeStato, { label: string; className: string }> = {
  attivo: { label: "Attivo", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  sospeso: { label: "Sospeso", className: "bg-amber-100 text-amber-800 border-amber-200" },
  revocato: { label: "Revocato", className: "bg-red-100 text-red-800 border-red-200" },
};

export function BadgeStatusChip({ stato }: { stato: BadgeStato }) {
  const c = config[stato];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${c.className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {c.label}
    </span>
  );
}
