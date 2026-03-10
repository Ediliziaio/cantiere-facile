import { cn } from "@/lib/utils";

interface ChecklistProgressProps {
  completed: number;
  total: number;
  size?: "sm" | "md";
  className?: string;
}

export function ChecklistProgress({ completed, total, size = "md", className }: ChecklistProgressProps) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const dim = size === "sm" ? 40 : 56;
  const stroke = size === "sm" ? 4 : 5;
  const r = (dim - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  const color = pct === 100 ? "text-success" : pct >= 70 ? "text-warning" : "text-destructive";

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: dim, height: dim }}>
      <svg width={dim} height={dim} className="-rotate-90">
        <circle cx={dim / 2} cy={dim / 2} r={r} fill="none" stroke="hsl(var(--border))" strokeWidth={stroke} />
        <circle cx={dim / 2} cy={dim / 2} r={r} fill="none" className={color} stroke="currentColor" strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <span className={cn("absolute text-foreground font-semibold font-heading", size === "sm" ? "text-[10px]" : "text-xs")}>
        {pct}%
      </span>
    </div>
  );
}
