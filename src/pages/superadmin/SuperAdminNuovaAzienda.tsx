import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Building2, Settings2, Puzzle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const steps = [
  { label: "Dati Aziendali", icon: Building2 },
  { label: "Piano", icon: Settings2 },
  { label: "Moduli", icon: Puzzle },
  { label: "Riepilogo", icon: CheckCircle2 },
];

interface FormData {
  nome_azienda: string;
  p_iva: string;
  fiscal_code: string;
  email_admin: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  piano: "free" | "pro" | "enterprise";
  max_users: number;
  max_sites: number;
  max_storage_gb: number;
  gps_tracking: boolean;
  ocr_enabled: boolean;
  api_access: boolean;
  firma_digitale: boolean;
  sicurezza_module: boolean;
}

const defaultForm: FormData = {
  nome_azienda: "",
  p_iva: "",
  fiscal_code: "",
  email_admin: "",
  phone: "",
  address: "",
  city: "",
  province: "",
  piano: "pro",
  max_users: 10,
  max_sites: 5,
  max_storage_gb: 5,
  gps_tracking: true,
  ocr_enabled: true,
  api_access: false,
  firma_digitale: true,
  sicurezza_module: true,
};

const planLimits = {
  free: { max_users: 3, max_sites: 1, max_storage_gb: 1 },
  pro: { max_users: 10, max_sites: 5, max_storage_gb: 5 },
  enterprise: { max_users: 50, max_sites: 20, max_storage_gb: 20 },
};

export default function SuperAdminNuovaAzienda() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(defaultForm);
  const navigate = useNavigate();

  const update = (field: keyof FormData, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlanChange = (piano: "free" | "pro" | "enterprise") => {
    const limits = planLimits[piano];
    setForm((prev) => ({ ...prev, piano, ...limits }));
  };

  const canNext = () => {
    if (step === 0) return form.nome_azienda && form.p_iva && form.email_admin;
    return true;
  };

  const handleSubmit = () => {
    toast.success(`Azienda "${form.nome_azienda}" creata con successo!`, {
      description: `Piano ${form.piano.toUpperCase()} — Email admin: ${form.email_admin}`,
    });
    navigate("/superadmin/aziende");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/superadmin/aziende"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <h1 className="font-heading font-bold text-2xl text-foreground">Nuova Azienda</h1>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-1">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-1 flex-1">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
              i === step ? "bg-primary/10 text-primary" : i < step ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            }`}>
              <s.icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < steps.length - 1 && <div className={`h-px flex-1 ${i < step ? "bg-primary" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      {/* Step 0: Dati Aziendali */}
      {step === 0 && (
        <div className="border border-border rounded-lg p-5 space-y-4">
          <h2 className="font-heading font-semibold text-foreground">Dati Aziendali</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Ragione Sociale *</Label>
              <Input value={form.nome_azienda} onChange={(e) => update("nome_azienda", e.target.value)} placeholder="Es. Costruzioni Rossi S.r.l." />
            </div>
            <div>
              <Label>P.IVA *</Label>
              <Input value={form.p_iva} onChange={(e) => update("p_iva", e.target.value)} placeholder="IT01234567890" />
            </div>
            <div>
              <Label>Codice Fiscale</Label>
              <Input value={form.fiscal_code} onChange={(e) => update("fiscal_code", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label>Email Admin *</Label>
              <Input type="email" value={form.email_admin} onChange={(e) => update("email_admin", e.target.value)} placeholder="admin@azienda.it" />
            </div>
            <div>
              <Label>Telefono</Label>
              <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+39 02 ..." />
            </div>
            <div>
              <Label>Indirizzo</Label>
              <Input value={form.address} onChange={(e) => update("address", e.target.value)} />
            </div>
            <div>
              <Label>Città</Label>
              <Input value={form.city} onChange={(e) => update("city", e.target.value)} />
            </div>
            <div>
              <Label>Provincia</Label>
              <Input value={form.province} onChange={(e) => update("province", e.target.value)} placeholder="MI" />
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Piano */}
      {step === 1 && (
        <div className="border border-border rounded-lg p-5 space-y-4">
          <h2 className="font-heading font-semibold text-foreground">Configurazione Piano</h2>
          <div>
            <Label>Piano</Label>
            <Select value={form.piano} onValueChange={(v) => handlePlanChange(v as "free" | "pro" | "enterprise")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="pro">Pro — €49/mese</SelectItem>
                <SelectItem value="enterprise">Enterprise — €199/mese</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label>Max Utenti</Label>
              <Input type="number" value={form.max_users} onChange={(e) => update("max_users", parseInt(e.target.value) || 0)} />
            </div>
            <div>
              <Label>Max Cantieri</Label>
              <Input type="number" value={form.max_sites} onChange={(e) => update("max_sites", parseInt(e.target.value) || 0)} />
            </div>
            <div>
              <Label>Storage (GB)</Label>
              <Input type="number" value={form.max_storage_gb} onChange={(e) => update("max_storage_gb", parseInt(e.target.value) || 0)} />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Moduli */}
      {step === 2 && (
        <div className="border border-border rounded-lg p-5 space-y-4">
          <h2 className="font-heading font-semibold text-foreground">Moduli Attivi</h2>
          {[
            { key: "gps_tracking" as const, label: "GPS Tracking", desc: "Geofencing e tracciamento accessi" },
            { key: "ocr_enabled" as const, label: "OCR Documenti", desc: "Riconoscimento automatico documenti" },
            { key: "firma_digitale" as const, label: "Firma Digitale", desc: "Firma elettronica qualificata" },
            { key: "sicurezza_module" as const, label: "Modulo Sicurezza", desc: "Checklist, POS, report incidenti" },
            { key: "api_access" as const, label: "Accesso API", desc: "Integrazione sistemi terzi via REST API" },
          ].map((mod) => (
            <div key={mod.key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">{mod.label}</p>
                <p className="text-xs text-muted-foreground">{mod.desc}</p>
              </div>
              <Switch checked={form[mod.key]} onCheckedChange={(v) => update(mod.key, v)} />
            </div>
          ))}
        </div>
      )}

      {/* Step 3: Riepilogo */}
      {step === 3 && (
        <div className="border border-border rounded-lg p-5 space-y-3">
          <h2 className="font-heading font-semibold text-foreground">Riepilogo</h2>
          {[
            ["Ragione Sociale", form.nome_azienda],
            ["P.IVA", form.p_iva],
            ["Email Admin", form.email_admin],
            ["Piano", form.piano.toUpperCase()],
            ["Max Utenti", form.max_users],
            ["Max Cantieri", form.max_sites],
            ["Storage", `${form.max_storage_gb} GB`],
          ].map(([label, value]) => (
            <div key={label as string} className="flex justify-between py-1.5 border-b border-border last:border-0 text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium text-foreground">{value}</span>
            </div>
          ))}
          <div className="pt-2">
            <p className="text-xs text-muted-foreground font-medium mb-1">Moduli attivi:</p>
            <div className="flex flex-wrap gap-1.5">
              {form.gps_tracking && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">GPS</span>}
              {form.ocr_enabled && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">OCR</span>}
              {form.firma_digitale && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Firma</span>}
              {form.sicurezza_module && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Sicurezza</span>}
              {form.api_access && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">API</span>}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>Indietro</Button>
        {step < 3 ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext()} className="bg-superadmin hover:bg-superadmin/90">Avanti</Button>
        ) : (
          <Button onClick={handleSubmit} className="bg-superadmin hover:bg-superadmin/90">Crea Azienda</Button>
        )}
      </div>
    </div>
  );
}
