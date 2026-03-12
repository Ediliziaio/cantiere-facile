import { WifiOff, RefreshCw, Wifi } from "lucide-react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useOfflineQueue } from "@/hooks/useOfflineQueue";

export function OfflineBanner() {
  const { isOnline, isSlowNetwork, connectionSpeed } = useNetworkStatus();
  const { pendingCount } = useOfflineQueue();

  if (isOnline && pendingCount === 0 && !isSlowNetwork) return null;

  return (
    <div
      className={`flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium ${
        !isOnline
          ? "bg-destructive text-destructive-foreground"
          : pendingCount > 0
          ? "bg-warning text-warning-foreground"
          : "bg-muted text-muted-foreground"
      }`}
    >
      {!isOnline ? (
        <>
          <WifiOff className="h-3.5 w-3.5" />
          <span>Offline — Le modifiche saranno sincronizzate al ripristino della connessione</span>
          {pendingCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
              {pendingCount}
            </span>
          )}
        </>
      ) : pendingCount > 0 ? (
        <>
          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          <span>
            Sincronizzazione: {pendingCount} operazion{pendingCount === 1 ? "e" : "i"} in coda
          </span>
        </>
      ) : isSlowNetwork ? (
        <>
          <Wifi className="h-3.5 w-3.5" />
          <span>Connessione lenta ({connectionSpeed}) — Funzionalità ridotte</span>
        </>
      ) : null}
    </div>
  );
}
