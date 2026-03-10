import { useState, useEffect, useRef, useCallback } from "react";
import { ScanLine, WifiOff, Camera, CameraOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccessoResultCard } from "@/components/badge/AccessoResultCard";
import { mockBadges, getBadgeLavoratore, getBadgeCantiere, mockVerificheAccesso } from "@/data/mock-badges";
import type { EsitoFinale } from "@/data/mock-badges";
import { toast } from "sonner";

type ScanState = "idle" | "scanning" | "result";

export default function Scan() {
  const [state, setState] = useState<ScanState>("idle");
  const [resultIdx, setResultIdx] = useState(0);
  const [cameraAvailable, setCameraAvailable] = useState<boolean | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const scannerRef = useRef<any>(null);
  const scannerContainerId = "qr-reader";

  // Check camera availability on mount
  useEffect(() => {
    if (navigator.mediaDevices?.getUserMedia) {
      setCameraAvailable(true);
    } else {
      setCameraAvailable(false);
    }
  }, []);

  const handleScanSuccess = useCallback((decodedText: string) => {
    // Stop scanner
    stopCamera();

    // Try to match scanned code to a badge
    const badge = mockBadges.find(
      (b) => decodedText.includes(b.codice_univoco) || decodedText === b.codice_univoco
    );

    if (badge) {
      // Find matching verifica or create a mock result
      const verifica = mockVerificheAccesso.find((v) => v.badge_id === badge.id);
      if (verifica) {
        const idx = mockVerificheAccesso.indexOf(verifica);
        setResultIdx(idx);
      } else {
        setResultIdx(0);
      }
      setState("result");
    } else {
      // Unknown QR — show first mock result as demo
      toast.info("QR code letto: " + decodedText.substring(0, 50));
      setResultIdx(0);
      setState("result");
    }
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const { Html5Qrcode } = await import("html5-qrcode");

      // Small delay to ensure DOM element exists
      await new Promise((r) => setTimeout(r, 100));

      const scanner = new Html5Qrcode(scannerContainerId);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
        },
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        () => {
          // Ignore scan failures (no QR found in frame)
        }
      );

      setCameraActive(true);
    } catch (err: any) {
      console.error("Camera error:", err);
      toast.error("Impossibile accedere alla fotocamera. Verifica i permessi.");
      setCameraActive(false);
    }
  }, [handleScanSuccess]);

  const stopCamera = useCallback(() => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(() => {});
      scannerRef.current.clear().catch(() => {});
      scannerRef.current = null;
    }
    setCameraActive(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, []);

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
            {/* Camera scanner area */}
            <div className="w-72 h-72 rounded-2xl overflow-hidden border-2 border-border relative">
              <div id={scannerContainerId} className="w-full h-full" />
              {!cameraActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                  <div className="text-center space-y-2">
                    <ScanLine className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      Inquadra il QR code del badge
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 w-full max-w-xs">
              {cameraAvailable !== false && (
                <Button
                  size="lg"
                  className="w-full text-base py-6"
                  onClick={cameraActive ? stopCamera : startCamera}
                >
                  {cameraActive ? (
                    <><CameraOff className="h-5 w-5 mr-2" /> Ferma fotocamera</>
                  ) : (
                    <><Camera className="h-5 w-5 mr-2" /> Attiva fotocamera</>
                  )}
                </Button>
              )}
              <Button
                variant="outline"
                size="lg"
                className="w-full text-base py-6"
                onClick={simulateScan}
              >
                <ScanLine className="h-5 w-5 mr-2" /> Simula scansione
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center max-w-xs">
              {cameraAvailable === false
                ? "Fotocamera non disponibile su questo dispositivo. Usa la simulazione."
                : "Attiva la fotocamera per scansionare un badge QR, oppure simula una verifica con dati demo."}
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
                <Button size="lg" className="py-5" onClick={() => { toast.success("Entrata registrata"); setState("idle"); }}>
                  ↗ Registra Entrata
                </Button>
                <Button variant="outline" size="lg" className="py-5" onClick={() => { toast.success("Uscita registrata"); setState("idle"); }}>
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
