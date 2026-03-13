import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HardHat, Lock, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { mockSuperAdminUsers, roleLabels, type SuperAdminRole } from "@/data/mock-security";

const VALID_TOTP = "123456";
const MAX_LOGIN_ATTEMPTS = 5;
const MAX_TOTP_ATTEMPTS = 3;

export default function SuperAdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState<"credentials" | "totp">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<SuperAdminRole>("superadmin");
  const [totpCode, setTotpCode] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [totpAttempts, setTotpAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [loading, setLoading] = useState(false);

  const matchedUser = mockSuperAdminUsers.find((u) => u.role === selectedRole);

  const handleCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (locked) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (!email || !password || password.length < 8) {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
          setLocked(true);
          toast({ title: "Account bloccato", description: "Troppi tentativi. Riprova tra 30 minuti.", variant: "destructive" });
          return;
        }
        toast({ title: "Credenziali non valide", description: `Tentativo ${newAttempts}/${MAX_LOGIN_ATTEMPTS}`, variant: "destructive" });
        return;
      }
      setStep("totp");
      setTotpCode("");
      setTotpAttempts(0);
      toast({ title: "Credenziali verificate", description: "Inserisci il codice 2FA dal tuo autenticatore." });
    }, 600);
  };

  const handleTotpVerify = () => {
    if (totpCode.length !== 6) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (totpCode !== VALID_TOTP) {
        const newAttempts = totpAttempts + 1;
        setTotpAttempts(newAttempts);
        setTotpCode("");
        if (newAttempts >= MAX_TOTP_ATTEMPTS) {
          setLocked(true);
          toast({ title: "Account bloccato", description: "Troppi tentativi 2FA. Account bloccato per 30 minuti.", variant: "destructive" });
          return;
        }
        toast({ title: "Codice non valido", description: `Tentativo ${newAttempts}/${MAX_TOTP_ATTEMPTS}`, variant: "destructive" });
        return;
      }

      const user = matchedUser ?? mockSuperAdminUsers[0];
      login(
        { id: user.id, email: user.email, nome: user.full_name.split(" ")[0], cognome: user.full_name.split(" ").slice(1).join(" ") },
        "superadmin",
        null,
        null,
        selectedRole
      );
      toast({ title: "Accesso riuscito", description: `Benvenuto, ${user.full_name}` });
      navigate("/superadmin/dashboard");
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8">
          <HardHat className="h-7 w-7 text-primary" />
          <span className="font-heading font-bold text-xl text-foreground">Cantiere in Cloud</span>
        </div>

        <h1 className="font-heading font-bold text-2xl text-foreground mb-1">Accesso Piattaforma</h1>
        <p className="text-sm text-muted-foreground mb-6">
          {step === "credentials"
            ? "Riservato agli amministratori della piattaforma."
            : "Verifica identità — inserisci il codice dal tuo autenticatore."}
        </p>

        {locked && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>Account bloccato per troppi tentativi. Riprova tra 30 minuti.</span>
          </div>
        )}

        {step === "credentials" ? (
          <form onSubmit={handleCredentials} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="role">Ruolo (demo)</Label>
              <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as SuperAdminRole)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.entries(roleLabels) as [SuperAdminRole, string][]).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder={matchedUser?.email ?? "admin@cantiereincloud.it"} required disabled={locked}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password" type={showPassword ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••••••••" required
                  disabled={locked} className="pr-10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground">Min. 8 caratteri, maiuscole, minuscole, numeri, simboli</p>
            </div>

            <Button type="submit" className="w-full" disabled={locked || loading}>
              {loading ? "Verifica..." : "Continua"}
            </Button>

            <div className="flex items-center gap-2 justify-center text-[11px] text-muted-foreground mt-2">
              <Lock className="h-3 w-3" />
              <span>Connessione protetta • TLS 1.3 • 2FA obbligatorio</span>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-2 p-3 rounded-md bg-muted border border-border text-sm text-muted-foreground">
              <Lock className="h-4 w-4 shrink-0 text-primary" />
              <span>Inserisci il codice a 6 cifre dal tuo autenticatore. Per demo usa: <code className="font-mono text-foreground font-bold">123456</code></span>
            </div>

            <div className="flex flex-col items-center gap-4">
              <InputOTP maxLength={6} value={totpCode} onChange={setTotpCode}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>

              <Button onClick={handleTotpVerify} className="w-full" disabled={totpCode.length !== 6 || locked || loading}>
                {loading ? "Verifica..." : "Verifica Codice"}
              </Button>
            </div>

            <button onClick={() => { setStep("credentials"); setTotpCode(""); }} className="text-sm text-muted-foreground hover:text-foreground underline w-full text-center">
              ← Torna al login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
