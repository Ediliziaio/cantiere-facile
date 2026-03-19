import { useState, useRef, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FileText, PenTool, CheckCircle2, Eraser, Send, ShieldCheck, AlertTriangle } from "lucide-react";
import logoLight from "@/assets/logo-light.png";
import { mockFirmatari, mockDocumentiFirma } from "@/data/mock-firma";
import { useToast } from "@/hooks/use-toast";

const MOCK_OTP = "123456";

const stepLabels = ["Identifica", "Leggi", "Firma", "Conferma"];
const stepIcons = [PenTool, FileText, PenTool, ShieldCheck];

function ProgressStepper({ current }: { current: number }) {
  const progress = (current / (stepLabels.length - 1)) * 100;
  return (
    <div className="space-y-3 mb-6">
      {/* Animated progress bar */}
      <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-primary rounded-full"
          style={{
            width: `${progress}%`,
            transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </div>
      <div className="flex items-center justify-between">
        {stepLabels.map((label, i) => {
          const Icon = stepIcons[i];
          const done = i < current;
          const active = i === current;
          return (
            <div key={label} className="flex flex-col items-center gap-1">
              <div
                className={`flex items-center justify-center w-9 h-9 rounded-full text-xs font-bold shrink-0 ${
                  done
                    ? "bg-primary text-primary-foreground scale-90"
                    : active
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110"
                    : "bg-muted text-muted-foreground scale-90"
                }`}
                style={{ transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }}
              >
                {done ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              <span
                className={`text-[10px] font-medium ${
                  active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"
                }`}
                style={{ transition: "color 0.3s ease" }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step Transition Wrapper ────────────────────────────────

function StepTransition({ children, stepKey }: { children: React.ReactNode; stepKey: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
    return () => cancelAnimationFrame(raf);
  }, [stepKey]);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {children}
    </div>
  );
}

// ─── Canvas Signature ───────────────────────────────────────

function SignatureCanvas({ onConfirm }: { onConfirm: (data: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [points, setPoints] = useState(0);
  const [hasContent, setHasContent] = useState(false);

  const getCtx = () => canvasRef.current?.getContext("2d");

  const startDraw = useCallback((e: React.PointerEvent) => {
    const ctx = getCtx();
    if (!ctx) return;
    setDrawing(true);
    const rect = canvasRef.current!.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  }, []);

  const draw = useCallback((e: React.PointerEvent) => {
    if (!drawing) return;
    const ctx = getCtx();
    if (!ctx) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#1C1917";
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    setPoints(p => p + 1);
    setHasContent(true);
  }, [drawing]);

  const endDraw = useCallback(() => setDrawing(false), []);

  const clear = () => {
    const ctx = getCtx();
    if (!ctx || !canvasRef.current) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setPoints(0);
    setHasContent(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
  }, []);

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Firma qui con il dito o il mouse</p>
      <div className="border-2 border-dashed border-border rounded-xl bg-white overflow-hidden touch-none">
        <canvas
          ref={canvasRef}
          className="w-full cursor-crosshair"
          style={{ height: 160 }}
          onPointerDown={startDraw}
          onPointerMove={draw}
          onPointerUp={endDraw}
          onPointerLeave={endDraw}
        />
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={clear} className="flex-1"><Eraser className="h-4 w-4 mr-1" /> Cancella</Button>
        <Button
          onClick={() => { if (canvasRef.current) onConfirm(canvasRef.current.toDataURL("image/png")); }}
          disabled={points < 50}
          className="flex-1"
        >
          <CheckCircle2 className="h-4 w-4 mr-1" /> Conferma firma
        </Button>
      </div>
      {hasContent && points < 50 && (
        <p className="text-xs text-amber-600">Firma più lunga richiesta per validazione</p>
      )}
    </div>
  );
}

// ─── OTP Flow ───────────────────────────────────────────────

function OTPFlow({ signerName, onConfirm }: { signerName: string; onConfirm: () => void }) {
  const { toast } = useToast();
  const [nomeDigitato, setNomeDigitato] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [timer, setTimer] = useState(600);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!otpSent || timer <= 0) return;
    const id = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [otpSent, timer]);

  useEffect(() => {
    if (otpSent) {
      const id = setTimeout(() => setCanResend(true), 60000);
      return () => clearTimeout(id);
    }
  }, [otpSent]);

  const sendOtp = () => {
    setOtpSent(true);
    setTimer(600);
    setCanResend(false);
    toast({ title: "Codice OTP inviato", description: "Controlla la tua casella email" });
  };

  const verifyOtp = () => {
    if (otpValue === MOCK_OTP) {
      onConfirm();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 3) {
        setLocked(true);
        toast({ title: "Troppi tentativi", description: "Firma bloccata. Contatta l'amministratore.", variant: "destructive" });
      } else {
        toast({ title: "Codice errato", description: `Hai ancora ${3 - newAttempts} tentativi`, variant: "destructive" });
      }
      setOtpValue("");
    }
  };

  const mm = Math.floor(timer / 60);
  const ss = timer % 60;

  if (locked) {
    return (
      <Card className="border-destructive/30 bg-destructive/5">
        <CardContent className="py-6 text-center">
          <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="font-medium text-destructive">Firma bloccata</p>
          <p className="text-sm text-muted-foreground mt-1">Troppi tentativi errati. Contatta l'amministratore.</p>
        </CardContent>
      </Card>
    );
  }

  if (!otpSent) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Inserisci il tuo nome completo</Label>
          <Input value={nomeDigitato} onChange={e => setNomeDigitato(e.target.value)} placeholder={signerName} className="text-lg h-12" />
        </div>
        <Button onClick={sendOtp} disabled={!nomeDigitato.trim()} className="w-full h-12">
          <Send className="h-4 w-4 mr-2" /> Invia codice OTP alla mia email
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground text-center">Inserisci il codice a 6 cifre inviato alla tua email</p>
      <Input
        value={otpValue}
        onChange={e => setOtpValue(e.target.value.replace(/\D/g, "").slice(0, 6))}
        placeholder="000000"
        className="text-center text-2xl tracking-[0.5em] font-mono h-14"
        maxLength={6}
        inputMode="numeric"
      />
      <p className="text-xs text-muted-foreground text-center">
        Il codice scade tra {mm}:{ss.toString().padStart(2, "0")}
      </p>
      <Button onClick={verifyOtp} disabled={otpValue.length !== 6} className="w-full h-12">
        <ShieldCheck className="h-4 w-4 mr-2" /> Verifica e firma
      </Button>
      {canResend && (
        <Button variant="link" onClick={sendOtp} className="w-full text-xs">Non hai ricevuto il codice? Reinvia</Button>
      )}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────

export default function FirmaPublica() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [letto, setLetto] = useState(false);
  const [accettaLegale, setAccettaLegale] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [otpVerified, setOtpVerified] = useState(false);

  const signer = mockFirmatari.find(f => f.token_firma === token);
  if (!signer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full"><CardContent className="py-8 text-center">
          <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold">Link non valido</h2>
          <p className="text-sm text-muted-foreground mt-1">Questo link di firma non è valido o è scaduto.</p>
        </CardContent></Card>
      </div>
    );
  }

  if (signer.stato === "firmato") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full"><CardContent className="py-8 text-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold">Documento già firmato</h2>
          <p className="text-sm text-muted-foreground mt-1">Hai già firmato questo documento il {signer.data_firma ? new Date(signer.data_firma).toLocaleDateString("it-IT") : ""}.</p>
        </CardContent></Card>
      </div>
    );
  }

  const doc = mockDocumentiFirma.find(d => d.id === signer.documento_id);
  const signerFullName = `${signer.nome} ${signer.cognome}`;
  const isSigned = signatureData !== null || otpVerified;

  const handleFinalSign = () => {
    toast({ title: "✅ Documento firmato con successo!" });
    navigate(`/firma/${token}/completa`);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center gap-2">
          <HardHat className="h-5 w-5 text-primary shrink-0" />
          <span className="font-bold text-sm">Cantiere in Cloud</span>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
        {/* Document info */}
        <div className="text-center space-y-1">
          <h1 className="text-lg font-bold">{doc?.nome || "Documento"}</h1>
          <p className="text-sm text-muted-foreground">{doc?.cantiere_nome}</p>
          <p className="text-xs text-muted-foreground">Richiesto da: {doc?.creato_da}</p>
        </div>

        <ProgressStepper current={step} />

        <StepTransition stepKey={step}>
          {/* Step 0: Identity */}
          {step === 0 && (
            <Card>
              <CardContent className="py-6 space-y-4">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <PenTool className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="font-bold">Identificazione</h2>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-border"><span className="text-muted-foreground">Nome</span><span className="font-medium">{signerFullName}</span></div>
                  <div className="flex justify-between py-2 border-b border-border"><span className="text-muted-foreground">Email</span><span className="font-medium">{signer.email}</span></div>
                  <div className="flex justify-between py-2 border-b border-border"><span className="text-muted-foreground">Ruolo</span><span className="font-medium">{signer.ruolo_descrizione}</span></div>
                  <div className="flex justify-between py-2"><span className="text-muted-foreground">Metodo firma</span><span className="font-medium capitalize">{signer.metodo_preferito}</span></div>
                </div>
                <p className="text-xs text-muted-foreground text-center">Stai per firmare questo documento come <strong>{signer.ruolo_descrizione}</strong></p>
                <Button className="w-full h-12" onClick={() => setStep(1)}>Prosegui →</Button>
              </CardContent>
            </Card>
          )}

          {/* Step 1: Read document */}
          {step === 1 && (
            <Card>
              <CardContent className="py-6 space-y-4">
                <div className="text-center mb-2">
                  <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h2 className="font-bold">Visualizza documento</h2>
                  <p className="text-xs text-muted-foreground">Scorri il documento prima di firmare</p>
                </div>
                <div className="border border-border rounded-xl bg-white p-6 space-y-4 min-h-[300px]">
                  <div className="text-center border-b pb-3">
                    <p className="font-bold text-sm">{doc?.nome}</p>
                    <p className="text-xs text-muted-foreground">{doc?.cantiere_nome}</p>
                  </div>
                  <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                    <p>Il presente documento attesta che in data odierna è stato effettuato il sopralluogo presso il cantiere indicato in oggetto, alla presenza delle parti sottoscriventi.</p>
                    <p>Si dichiara che i lavori eseguiti risultano conformi alle specifiche tecniche di progetto e alle normative vigenti in materia di sicurezza sui luoghi di lavoro (D.Lgs. 81/2008).</p>
                    <p>Le opere realizzate comprendono: strutture in c.a., impianti elettrici, impianti idraulici, opere di finitura secondo il computo metrico allegato al contratto.</p>
                    <p>Si procede pertanto alla firma del presente verbale da parte di tutti i soggetti coinvolti.</p>
                  </div>
                  <div className="flex gap-4 pt-4 border-t">
                    <div className="flex-1 border-2 border-dashed border-amber-300 bg-amber-50 rounded p-3 text-center">
                      <p className="text-[10px] text-amber-700 font-medium">FIRMA QUI</p>
                      <p className="text-[10px] text-amber-600">{signerFullName}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Checkbox id="letto" checked={letto} onCheckedChange={v => setLetto(v === true)} />
                  <Label htmlFor="letto" className="text-sm leading-snug cursor-pointer">Ho letto e compreso il documento</Label>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(0)} className="flex-1">← Indietro</Button>
                  <Button onClick={() => setStep(2)} disabled={!letto} className="flex-1">Prosegui alla firma →</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Sign */}
          {step === 2 && (
            <Card>
              <CardContent className="py-6 space-y-4">
                <div className="text-center mb-2">
                  <PenTool className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h2 className="font-bold">Firma il documento</h2>
                </div>
                {signer.metodo_preferito === "disegno" ? (
                  <SignatureCanvas onConfirm={(data) => { setSignatureData(data); setStep(3); }} />
                ) : (
                  <OTPFlow signerName={signerFullName} onConfirm={() => { setOtpVerified(true); setStep(3); }} />
                )}
                <div className="pt-2">
                  <Button variant="outline" onClick={() => setStep(1)} className="w-full">← Indietro</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && isSigned && (
            <Card>
              <CardContent className="py-6 space-y-4">
                <div className="text-center mb-2">
                  <ShieldCheck className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                  <h2 className="font-bold">Conferma finale</h2>
                </div>
                {signatureData && (
                  <div className="border rounded-lg p-3 bg-white">
                    <p className="text-xs text-muted-foreground mb-2">Anteprima firma:</p>
                    <img src={signatureData} alt="Firma" className="max-h-20 mx-auto" />
                  </div>
                )}
                {otpVerified && (
                  <div className="border rounded-lg p-3 bg-emerald-50 text-center">
                    <p className="text-sm font-medium text-emerald-800">✓ Identità verificata via OTP</p>
                    <p className="text-xs text-emerald-600 mt-1">Firma come: {signerFullName}</p>
                  </div>
                )}
                <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3 space-y-1">
                  <p>La tua firma digitale sarà registrata con: data/ora, indirizzo IP, identificativo univoco del documento.</p>
                  <p>Questo documento ha valore legale ai sensi del D.Lgs. 82/2005 (Codice dell'Amministrazione Digitale).</p>
                </div>
                <div className="flex items-start gap-2">
                  <Checkbox id="legale" checked={accettaLegale} onCheckedChange={v => setAccettaLegale(v === true)} />
                  <Label htmlFor="legale" className="text-sm leading-snug cursor-pointer">Accetto che la mia firma abbia valore legale</Label>
                </div>
                <Button
                  onClick={handleFinalSign}
                  disabled={!accettaLegale}
                  className="w-full h-14 text-base bg-orange-500 hover:bg-orange-600 text-white"
                >
                  ✍️ Firma il documento
                </Button>
                <Button variant="outline" onClick={() => setStep(2)} className="w-full">← Torna alla firma</Button>
              </CardContent>
            </Card>
          )}
        </StepTransition>

        {/* Reject link */}
        {step < 3 && (
          <div className="text-center">
            <Button variant="link" className="text-xs text-muted-foreground" onClick={() => navigate(`/firma/${token}/rifiuta`)}>
              Non voglio firmare questo documento
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
