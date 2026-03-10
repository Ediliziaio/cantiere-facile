import { useState } from "react";
import { ScanLine, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccessoResultCard } from "@/components/badge/AccessoResultCard";
import { mockBadges, getBadgeLavoratore, getBadgeCantiere, mockVerificheAccesso } from "@/data/mock-badges";
import type { EsitoFinale } from "@/data/mock-badges";

type ScanState = "idle" | "scanning" | "result";

export default function Scan() {
  const [state, setState] = useState<ScanState>("idle");
  const [resultIdx, setResultIdx] = useState(0);

  const simulateScan = () => {
    setState("scanning");
    setTimeout(() => {
      setResultIdx((prev) => (prev + 1) % mockVerificheAccesso.length);
      setState("result");
    }, 1500);
  };

  const result = mockVerificheAccesso[resultIdx];
  const badge = mockBadges.find((b) => b.id === result.badge_id);
  const lav = badge ? getBadgeLavoratore(badge) : null;
  const cant = badge ? getBadgeCantiere(badge) : null;

  const dettaglioMap: Record<EsitoFinale, string> = {
    verde: "",
    giallo: (result.dettaglio as any)?.nota ?? "Documenti in scadenza",
    rosso: (result.dettaglio as any)?.nota ?? "Accesso non consentito",
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center gap-3">
        <ScanLine className="h-5 w-5 text-primary" />
        <span className="font-heading font-bold text-foreground">Scansiona Badge</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
        {state === "idle" && (
          <>
            <div className="w-64 h-64 border-2 border-dashed border-border rounded-2xl flex items-center justify-center">
              <div className="text-center space-y-2">
                <ScanLine className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">
                  Inquadra il QR code del badge
                </p>
              </div>
            </div>
            <Button size="lg" className="w-full max-w-xs text-base py-6" onClick={simulateScan}>
              <ScanLine className="h-5 w-5 mr-2" /> Simula scansione
            </Button>
            <p className="text-xs text-muted-foreground text-center max-w-xs">
              La scansione reale con fotocamera sarà disponibile dopo la connessione al backend.
              Tocca il pulsante per simulare una verifica.
            </p>
          </>
        )}

        {state === "scanning" && (
          <div className="text-center space-y-4">
            <div className="w-64 h-64 border-2 border-primary rounded-2xl flex items-center justify-center animate-pulse">
              <ScanLine className="h-16 w-16 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Verifica in corso…</p>
          </div>
        )}

        {state === "result" && (
          <div className="w-full max-w-sm space-y-4">
            <AccessoResultCard
              esito={result.esito_finale}
              lavoratoreNome={lav ? `${lav.nome} ${lav.cognome}` : "—"}
              cantiere={cant?.nome ?? "—"}
              dettaglio={dettaglioMap[result.esito_finale] || undefined}
            />
            {result.esito_finale !== "rosso" && (
              <div className="grid grid-cols-2 gap-2">
                <Button size="lg" className="py-5" onClick={() => { setState("idle"); }}>
                  ↗ Registra Entrata
                </Button>
                <Button variant="outline" size="lg" className="py-5" onClick={() => { setState("idle"); }}>
                  ↙ Registra Uscita
                </Button>
              </div>
            )}
            <Button variant="ghost" className="w-full" onClick={() => setState("idle")}>
              Nuova scansione
            </Button>
          </div>
        )}
      </div>

      {/* Offline indicator */}
      {!navigator.onLine && (
        <div className="fixed bottom-0 inset-x-0 bg-destructive text-destructive-foreground text-center py-2 text-sm flex items-center justify-center gap-2">
          <WifiOff className="h-4 w-4" /> Connessione assente — scansione non disponibile
        </div>
      )}
    </div>
  );
}
