import { useState, useEffect, useCallback, useRef } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useGeofencing } from "@/hooks/useGeofencing";
import { useOfflineQueue } from "@/hooks/useOfflineQueue";
import { useBadgeVerification } from "@/hooks/useBadgeVerification";
import { useWorkerCompliance } from "@/hooks/useWorkerCompliance";
import { GpsSignalIndicator } from "@/components/gps/GpsSignalIndicator";
import { vibrateCheckIn, vibrateCheckOut, vibrateError } from "@/lib/haptics";
import { GeofenceMap } from "@/components/gps/GeofenceMap";
import { WorkerComplianceCard } from "@/components/badge/WorkerComplianceCard";
import { mockCantieri } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import {
  MapPin, CheckCircle2, XCircle, LogIn, LogOut, ChevronDown,
  WifiOff, AlertTriangle, Clock, Map, Loader2, QrCode, ShieldX, ShieldCheck,
} from "lucide-react";

type CheckMode = "auto_gps" | "qr_scan" | "manual";

export default function CheckIn() {
  const geo = useGeolocation();
  const { addOperation, pendingCount, isOnline, getHistory } = useOfflineQueue();
  const { verify, remainingAttempts } = useBadgeVerification();

  const [selectedCantiere, setSelectedCantiere] = useState(mockCantieri[0]?.id || "");
  const [mode, setMode] = useState<CheckMode>("auto_gps");
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [lastAction, setLastAction] = useState<"in" | "out" | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [manualNote, setManualNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // QR scan state
  const [qrScanning, setQrScanning] = useState(false);
  const [qrResult, setQrResult] = useState<ReturnType<typeof verify> | null>(null);
  const scannerRef = useRef<any>(null);
  const qrContainerRef = useRef<HTMLDivElement>(null);

  const cantiere = mockCantieri.find((c) => c.id === selectedCantiere);

  const geofence = useGeofencing({
    siteLat: cantiere?.latitudine || 0,
    siteLng: cantiere?.longitudine || 0,
    radiusMeters: cantiere?.raggio_geofence || 200,
    enabled: !!cantiere && geo.isTracking && mode === "auto_gps",
    onEnter: () => {
      if (mode === "auto_gps" && !isCheckedIn) {
        handleCheckIn("auto_gps");
      }
    },
    onExit: () => {
      if (mode === "auto_gps" && isCheckedIn) {
        handleCheckOut("auto_gps");
      }
    },
  });

  // Feed position updates to geofencing
  useEffect(() => {
    geofence.updatePosition(geo.position);
  }, [geo.position]);

  // Screen Wake Lock during check-in page
  useEffect(() => {
    let wakeLock: any = null;
    const requestWakeLock = async () => {
      try {
        if ("wakeLock" in navigator) {
          wakeLock = await (navigator as any).wakeLock.request("screen");
        }
      } catch {
        // Wake Lock not supported or denied
      }
    };
    requestWakeLock();
    return () => {
      if (wakeLock) wakeLock.release().catch(() => {});
    };
  }, []);

  // Start GPS tracking on mount
  useEffect(() => {
    geo.startTracking();
    return () => geo.stopTracking();
  }, []);

  const handleCheckIn = useCallback(
    (method: CheckMode = mode) => {
      if (!cantiere || isProcessing) return;

      setIsProcessing(true);

      const accuracyOk = (method as string) === "manual" || (geo.position && geo.position.accuracy <= 50);
      if (!accuracyOk && (method as string) !== "manual") {
        toast.error("Precisione GPS insufficiente", {
          description: "Spostati all'aperto per migliorare il segnale.",
        });
        setIsProcessing(false);
        return;
      }

      addOperation({
        type: "check_in",
        payload: {
          cantiere_id: cantiere.id,
          cantiere_nome: cantiere.nome,
          lat: geo.position?.lat || null,
          lng: geo.position?.lng || null,
          accuracy: geo.position?.accuracy || null,
          verification_method: method === "auto_gps" ? "auto_gps" : method === "qr_scan" ? "qr_scan" : "manual",
          note: method === "manual" ? manualNote : undefined,
          server_validated: false,
        },
        timestamp: Date.now(),
      });

      setIsCheckedIn(true);
      setLastAction("in");
      setManualNote("");

      vibrateCheckIn();

      toast.success("Ingresso registrato", {
        description: `${cantiere.nome} — ${new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}`,
      });

      setTimeout(() => {
        setIsProcessing(false);
        setLastAction(null);
      }, 2000);
    },
    [cantiere, geo.position, mode, manualNote, isProcessing, addOperation]
  );

  const handleCheckOut = useCallback(
    (method: CheckMode = mode) => {
      if (!cantiere || isProcessing) return;

      setIsProcessing(true);

      addOperation({
        type: "check_out",
        payload: {
          cantiere_id: cantiere.id,
          cantiere_nome: cantiere.nome,
          lat: geo.position?.lat || null,
          lng: geo.position?.lng || null,
          accuracy: geo.position?.accuracy || null,
          verification_method: method === "auto_gps" ? "auto_gps" : method === "qr_scan" ? "qr_scan" : "manual",
          note: method === "manual" ? manualNote : undefined,
          server_validated: false,
        },
        timestamp: Date.now(),
      });

      setIsCheckedIn(false);
      setLastAction("out");
      setManualNote("");

      vibrateCheckOut();

      toast.success("Uscita registrata", {
        description: `${cantiere.nome} — ${new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}`,
      });

      setTimeout(() => {
        setIsProcessing(false);
        setLastAction(null);
      }, 2000);
    },
    [cantiere, geo.position, mode, manualNote, isProcessing, addOperation]
  );

  const recentHistory = getHistory().slice(0, 5);

  return (
    <div className="space-y-4 pb-24 md:pb-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Check-in Cantiere</h1>
          <p className="text-sm text-muted-foreground">Registra ingresso e uscita dal cantiere</p>
        </div>
        <div className="flex items-center gap-3">
          {!isOnline && (
            <Badge variant="outline" className="text-orange-600 border-orange-300 gap-1">
              <WifiOff className="h-3 w-3" />
              Offline
            </Badge>
          )}
          <GpsSignalIndicator
            strength={geo.signalStrength}
            accuracy={geo.position?.accuracy || null}
          />
        </div>
      </div>

      {/* GPS Error */}
      {geo.error && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="p-3 flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">Errore GPS</p>
              <p className="text-xs text-muted-foreground">{geo.error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mock location warning */}
      {geo.isMockSuspected && (
        <Card className="border-orange-400 bg-orange-50 dark:bg-orange-950/20">
          <CardContent className="p-3 flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-orange-700 dark:text-orange-400">
                Posizione sospetta
              </p>
              <p className="text-xs text-muted-foreground">
                Rilevato possibile utilizzo di posizione simulata.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending sync banner */}
      {pendingCount > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            {pendingCount} operazion{pendingCount === 1 ? "e" : "i"} in attesa di sincronizzazione
          </span>
        </div>
      )}

      {/* Site selector */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <label className="text-sm font-medium text-foreground">Cantiere</label>
          <Select value={selectedCantiere} onValueChange={setSelectedCantiere}>
            <SelectTrigger>
              <SelectValue placeholder="Seleziona cantiere" />
            </SelectTrigger>
            <SelectContent>
              {mockCantieri.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Mode selector */}
          <div className="flex gap-2">
            {(
              [
                { value: "auto_gps", label: "GPS Auto", icon: MapPin },
                { value: "manual", label: "Manuale", icon: CheckCircle2 },
              ] as const
            ).map(({ value, label, icon: Icon }) => (
              <Button
                key={value}
                variant={mode === value ? "default" : "outline"}
                size="sm"
                onClick={() => setMode(value)}
                className="flex-1 gap-1.5"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Button>
            ))}
          </div>

          {/* Geofence status */}
          {mode === "auto_gps" && cantiere && geofence.distance !== null && (
            <div className="flex items-center justify-between text-sm px-1">
              <span className="text-muted-foreground">
                Distanza: <strong>{geofence.distance}m</strong>
              </span>
              <Badge
                variant={geofence.isInside ? "default" : "outline"}
                className={
                  geofence.isInside
                    ? "bg-green-600 hover:bg-green-600"
                    : ""
                }
              >
                {geofence.status === "inside" && "In cantiere"}
                {geofence.status === "entering" && "Ingresso..."}
                {geofence.status === "leaving" && "Uscita..."}
                {geofence.status === "outside" && "Fuori cantiere"}
                {geofence.status === "unknown" && "Rilevamento..."}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* QR Scan mode */}
      {mode === "qr_scan" && (
        <Card>
          <CardContent className="p-4 space-y-3">
            {!qrResult ? (
              <>
                <div ref={qrContainerRef} id="qr-reader-checkin" className="w-full rounded-lg overflow-hidden" />
                {!qrScanning ? (
                  <Button className="w-full gap-2" onClick={async () => {
                    setQrScanning(true);
                    setQrResult(null);
                    try {
                      const { Html5Qrcode } = await import("html5-qrcode");
                      const scanner = new Html5Qrcode("qr-reader-checkin");
                      scannerRef.current = scanner;
                      await scanner.start(
                        { facingMode: "environment" },
                        { fps: 10, qrbox: { width: 250, height: 250 } },
                        (decodedText) => {
                          const result = verify(decodedText, selectedCantiere);
                          setQrResult(result);
                          scanner.stop().catch(() => {});
                          setQrScanning(false);
                          if (result.canCheckIn) {
                            if ("vibrate" in navigator) navigator.vibrate([100, 50, 100]);
                            toast.success("Badge verificato", { description: `${result.worker?.nome} ${result.worker?.cognome}` });
                          } else {
                            if ("vibrate" in navigator) navigator.vibrate([300, 100, 300]);
                            toast.error("Verifica fallita", { description: result.blocks[0] || "Badge non valido" });
                          }
                        },
                        () => {}
                      );
                    } catch {
                      toast.error("Errore avvio scanner");
                      setQrScanning(false);
                    }
                  }}>
                    <QrCode className="h-4 w-4" />
                    Avvia Scanner
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full" onClick={() => {
                    scannerRef.current?.stop().catch(() => {});
                    setQrScanning(false);
                  }}>
                    Ferma Scanner
                  </Button>
                )}
                <p className="text-xs text-muted-foreground text-center">
                  Tentativi rimasti: {remainingAttempts()}
                </p>
              </>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {qrResult.canCheckIn ? (
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                  ) : (
                    <ShieldX className="h-5 w-5 text-destructive" />
                  )}
                  <span className="font-semibold text-foreground">
                    {qrResult.canCheckIn ? "Verificato — Pronto al check-in" : "Check-in bloccato"}
                  </span>
                </div>
                {qrResult.worker && (
                  <p className="text-sm text-muted-foreground">
                    {qrResult.worker.nome} {qrResult.worker.cognome} — {qrResult.worker.mansione}
                  </p>
                )}
                {qrResult.blocks.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-destructive">
                    <XCircle className="h-4 w-4 shrink-0" />{b}
                  </div>
                ))}
                {qrResult.warnings.map((w, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-yellow-600">
                    <AlertTriangle className="h-4 w-4 shrink-0" />{w}
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setQrResult(null)}>
                    Nuova scansione
                  </Button>
                  {qrResult.canCheckIn && (
                    <Button className="flex-1" onClick={() => handleCheckIn("qr_scan")}>
                      Conferma Ingresso
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Manual note */}
      {mode === "manual" && (
        <Card>
          <CardContent className="p-4">
            <label className="text-sm font-medium text-foreground mb-2 block">
              Nota (obbligatoria per check-in manuale)
            </label>
            <Textarea
              value={manualNote}
              onChange={(e) => setManualNote(e.target.value)}
              placeholder="Motivo del check-in manuale..."
              className="text-base"
              rows={2}
            />
          </CardContent>
        </Card>
      )}

      {/* Main check-in/out button */}
      <div className="flex justify-center py-4">
        <button
          onClick={() => (isCheckedIn ? handleCheckOut() : handleCheckIn())}
          disabled={
            isProcessing ||
            !cantiere ||
            (mode === "manual" && !manualNote.trim()) ||
            (mode === "auto_gps" && !geo.position)
          }
          className={`
            relative w-32 h-32 md:w-36 md:h-36 rounded-full
            flex flex-col items-center justify-center gap-2
            text-white font-bold text-lg
            transition-all duration-300 active:scale-90
            shadow-xl
            disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
            ${
              lastAction === "in"
                ? "bg-green-500 scale-105"
                : lastAction === "out"
                ? "bg-orange-500 scale-105"
                : isCheckedIn
                ? "bg-orange-600 hover:bg-orange-700"
                : "bg-primary hover:bg-primary/90"
            }
          `}
          style={{ minWidth: 80, minHeight: 80, touchAction: "manipulation" }}
        >
          {isProcessing ? (
            <Loader2 className="h-10 w-10 animate-spin" />
          ) : lastAction === "in" ? (
            <CheckCircle2 className="h-10 w-10" />
          ) : lastAction === "out" ? (
            <XCircle className="h-10 w-10" />
          ) : isCheckedIn ? (
            <LogOut className="h-10 w-10" />
          ) : (
            <LogIn className="h-10 w-10" />
          )}
          <span className="text-base">
            {isProcessing
              ? "..."
              : lastAction === "in"
              ? "Entrato!"
              : lastAction === "out"
              ? "Uscito!"
              : isCheckedIn
              ? "USCITA"
              : "ENTRATA"}
          </span>
        </button>
      </div>

      {/* Map collapsible */}
      {cantiere && (
        <Collapsible open={showMap} onOpenChange={setShowMap}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full gap-2">
              <Map className="h-4 w-4" />
              {showMap ? "Nascondi mappa" : "Mostra mappa"}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${showMap ? "rotate-180" : ""}`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <GeofenceMap
              siteLat={cantiere.latitudine}
              siteLng={cantiere.longitudine}
              siteRadius={cantiere.raggio_geofence}
              siteName={cantiere.nome}
              position={geo.position}
              status={geofence.status}
              distance={geofence.distance}
            />
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Recent history */}
      {recentHistory.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Ultime registrazioni</h3>
            <div className="space-y-2">
              {recentHistory.map((op) => (
                <div
                  key={op.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-2">
                    {op.type === "check_in" ? (
                      <LogIn className="h-4 w-4 text-green-600" />
                    ) : (
                      <LogOut className="h-4 w-4 text-orange-600" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{op.payload.cantiere_nome}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(op.timestamp).toLocaleString("it-IT", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">
                      {op.payload.verification_method === "auto_gps"
                        ? "GPS"
                        : op.payload.verification_method === "qr_scan"
                        ? "QR"
                        : "Manuale"}
                    </Badge>
                    {!op.synced && (
                      <div className="h-2 w-2 rounded-full bg-orange-400" title="In attesa sync" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
