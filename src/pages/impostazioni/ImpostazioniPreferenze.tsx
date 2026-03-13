import { useState } from "react";
import {
  BellRing, Clock, Smartphone, MessageSquare, CloudRain, ShieldAlert, FileText,
  UserCheck, Siren, Settings, Building2,
} from "lucide-react";
import { mockCantieri } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const typeLabels: Record<string, { label: string; icon: typeof Clock; desc: string }> = {
  scadenza: { label: "Scadenze", icon: Clock, desc: "DURC, formazione, idoneità" },
  incidente: { label: "Sicurezza", icon: ShieldAlert, desc: "Infortuni, near-miss, ispezioni" },
  check_in: { label: "Presenze", icon: UserCheck, desc: "Check-in, assenze anomale" },
  documento: { label: "Documenti", icon: FileText, desc: "Upload, approvazioni, rifiuti" },
  emergenza: { label: "Emergenze", icon: Siren, desc: "Broadcast emergenza (sempre attivo)" },
  sistema: { label: "Sistema", icon: Settings, desc: "Report, aggiornamenti piattaforma" },
  meteo: { label: "Meteo", icon: CloudRain, desc: "Allerte meteo cantieri" },
};

export default function ImpostazioniPreferenze() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEmergencyOnly, setSmsEmergencyOnly] = useState(true);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(true);
  const [quietStart, setQuietStart] = useState("22:00");
  const [quietEnd, setQuietEnd] = useState("06:00");
  const [mutedSites, setMutedSites] = useState<string[]>([]);
  const [enabledTypes, setEnabledTypes] = useState({
    scadenza: true, incidente: true, check_in: true, documento: true,
    emergenza: true, sistema: true, meteo: true,
  });

  const toggleType = (key: string) => {
    if (key === "emergenza") return;
    setEnabledTypes(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };
  const toggleMuteSite = (siteId: string) => {
    setMutedSites(prev => prev.includes(siteId) ? prev.filter(s => s !== siteId) : [...prev, siteId]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-1">
        <BellRing className="h-5 w-5 text-primary" />
        <h1 className="font-heading font-bold text-xl text-foreground">Preferenze</h1>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Smartphone className="h-4 w-4" /> Canali di notifica</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium">Push Notifications</p><p className="text-xs text-muted-foreground">Notifiche in tempo reale sul dispositivo</p></div>
            <Switch checked={pushEnabled} onCheckedChange={setPushEnabled} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium">Email</p><p className="text-xs text-muted-foreground">Riepilogo e alert via email</p></div>
            <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium">SMS</p><p className="text-xs text-muted-foreground">Solo per emergenze critiche</p></div>
            <Switch checked={smsEmergencyOnly} onCheckedChange={setSmsEmergencyOnly} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4" /> Non disturbare</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium">Attiva ore silenziose</p><p className="text-xs text-muted-foreground">Le emergenze bypassano sempre questa impostazione</p></div>
            <Switch checked={quietHoursEnabled} onCheckedChange={setQuietHoursEnabled} />
          </div>
          {quietHoursEnabled && (
            <div className="flex items-center gap-3">
              <div><Label className="text-xs">Dalle</Label><Input type="time" value={quietStart} onChange={e => setQuietStart(e.target.value)} className="w-28 h-8 text-sm" /></div>
              <span className="text-muted-foreground mt-4">→</span>
              <div><Label className="text-xs">Alle</Label><Input type="time" value={quietEnd} onChange={e => setQuietEnd(e.target.value)} className="w-28 h-8 text-sm" /></div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Tipologie di notifica</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(typeLabels).map(([key, cfg]) => {
            const Icon = cfg.icon;
            const isEmergency = key === "emergenza";
            return (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center"><Icon className="h-4 w-4 text-muted-foreground" /></div>
                  <div><p className="text-sm font-medium">{cfg.label}</p><p className="text-xs text-muted-foreground">{cfg.desc}</p></div>
                </div>
                <Switch checked={enabledTypes[key as keyof typeof enabledTypes]} onCheckedChange={() => toggleType(key)} disabled={isEmergency} />
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Building2 className="h-4 w-4" /> Silenzia cantieri</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">Disattiva temporaneamente le notifiche per singoli cantieri</p>
          {mockCantieri.map(c => (
            <div key={c.id} className="flex items-center justify-between">
              <div><p className="text-sm font-medium">{c.nome}</p><p className="text-xs text-muted-foreground">{c.comune}</p></div>
              <Switch checked={!mutedSites.includes(c.id)} onCheckedChange={() => toggleMuteSite(c.id)} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Button onClick={() => toast.success("Preferenze notifiche salvate")} className="w-full sm:w-auto">Salva preferenze</Button>
    </div>
  );
}
