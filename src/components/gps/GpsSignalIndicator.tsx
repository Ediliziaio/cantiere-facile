import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { SignalStrength } from "@/hooks/useGeolocation";

interface Props {
  strength: SignalStrength;
  accuracy: number | null;
  className?: string;
}

const config: Record<SignalStrength, { bars: number; color: string; label: string }> = {
  excellent: { bars: 4, color: "text-green-500", label: "Ottimo" },
  good: { bars: 3, color: "text-emerald-500", label: "Buono" },
  fair: { bars: 2, color: "text-yellow-500", label: "Discreto" },
  poor: { bars: 1, color: "text-orange-500", label: "Scarso" },
  none: { bars: 0, color: "text-destructive", label: "Nessun segnale" },
};

export function GpsSignalIndicator({ strength, accuracy, className = "" }: Props) {
  const { bars, color, label } = config[strength];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`flex items-end gap-0.5 ${className}`} aria-label={`GPS: ${label}`}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`w-1 rounded-sm transition-colors ${
                i <= bars ? color : "bg-muted"
              }`}
              style={{
                height: `${6 + i * 3}px`,
                backgroundColor: i <= bars ? undefined : undefined,
              }}
            />
          ))}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs font-medium">{label}</p>
        {accuracy !== null && (
          <p className="text-xs text-muted-foreground">Precisione: ±{Math.round(accuracy)}m</p>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
