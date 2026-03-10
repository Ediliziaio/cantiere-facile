import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ScadenzaAlertProps {
  count: number;
  scadutiCount?: number;
  className?: string;
}

export function ScadenzaAlert({ count, scadutiCount = 0, className }: ScadenzaAlertProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed || (count === 0 && scadutiCount === 0)) return null;

  const hasScaduti = scadutiCount > 0;

  return (
    <div className={cn(
      "flex items-center gap-3 rounded-lg border px-4 py-3",
      hasScaduti ? "border-destructive/30 bg-destructive/5" : "border-warning/30 bg-warning/5",
      className
    )}>
      <AlertTriangle className={cn("h-4 w-4 shrink-0", hasScaduti ? "text-destructive" : "text-warning")} />
      <p className="flex-1 text-sm text-foreground">
        {scadutiCount > 0 && (
          <span className="font-semibold text-destructive">{scadutiCount} documenti scaduti. </span>
        )}
        {count > 0 && (
          <span className="font-medium">{count} documenti in scadenza nei prossimi 30 giorni.</span>
        )}
      </p>
      <button onClick={() => setDismissed(true)} className="shrink-0 text-muted-foreground hover:text-foreground">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
