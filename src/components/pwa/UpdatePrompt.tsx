import { RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useServiceWorker } from "@/hooks/useServiceWorker";

export function UpdatePrompt() {
  const { needRefresh, offlineReady, updateServiceWorker, dismissRefresh, dismissOfflineReady } =
    useServiceWorker();

  if (!needRefresh && !offlineReady) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-4 max-w-sm">
      <div className="bg-card border border-border rounded-xl shadow-lg p-4 flex items-start gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <RefreshCw className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          {needRefresh ? (
            <>
              <p className="text-sm font-semibold text-foreground">Nuova versione disponibile</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Aggiorna per ottenere le ultime funzionalità
              </p>
              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={updateServiceWorker} className="h-8 text-xs">
                  Aggiorna ora
                </Button>
                <Button size="sm" variant="ghost" onClick={dismissRefresh} className="h-8 text-xs">
                  Più tardi
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-foreground">App pronta offline</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Cantiere Facile funziona anche senza connessione
              </p>
              <Button
                size="sm"
                variant="ghost"
                onClick={dismissOfflineReady}
                className="h-8 text-xs mt-2"
              >
                OK
              </Button>
            </>
          )}
        </div>
        <button
          onClick={needRefresh ? dismissRefresh : dismissOfflineReady}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
