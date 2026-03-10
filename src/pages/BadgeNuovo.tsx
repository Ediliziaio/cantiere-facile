import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { mockCantieri, mockLavoratori } from "@/data/mock-data";
import { mockBadges } from "@/data/mock-badges";
import { BadgeCard } from "@/components/badge/BadgeCard";
import { toast } from "sonner";
import type { Badge } from "@/data/mock-badges";

export default function BadgeNuovo() {
  const navigate = useNavigate();
  const [cantiereId, setCantiereId] = useState("");
  const [lavoratoreId, setLavoratoreId] = useState("");
  const [scadenza, setScadenza] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split("T")[0];
  });

  const lavoratoriDisponibili = mockLavoratori.filter(
    (l) => !mockBadges.some((b) => b.lavoratore_id === l.id && b.cantiere_id === cantiereId)
  );

  const previewBadge: Badge | null =
    cantiereId && lavoratoreId
      ? {
          id: "preview",
          tenant_id: "t1",
          lavoratore_id: lavoratoreId,
          cantiere_id: cantiereId,
          codice_univoco: `CIC-2026-ANTEPR`,
          qr_payload: "preview",
          stato: "attivo",
          data_emissione: new Date().toISOString(),
          data_scadenza: scadenza,
          note: null,
          created_at: new Date().toISOString(),
        }
      : null;

  const handleSubmit = () => {
    toast.success("Badge emesso con successo");
    navigate("/badge");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-heading font-bold text-2xl text-foreground">Emissione Badge</h1>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Cantiere</Label>
          <Select value={cantiereId} onValueChange={setCantiereId}>
            <SelectTrigger><SelectValue placeholder="Seleziona cantiere" /></SelectTrigger>
            <SelectContent>
              {mockCantieri.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Lavoratore</Label>
          <Select value={lavoratoreId} onValueChange={setLavoratoreId}>
            <SelectTrigger><SelectValue placeholder="Seleziona lavoratore" /></SelectTrigger>
            <SelectContent>
              {lavoratoriDisponibili.map((l) => (
                <SelectItem key={l.id} value={l.id}>{l.nome} {l.cognome} — {l.mansione}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Data scadenza</Label>
          <Input type="date" value={scadenza} onChange={(e) => setScadenza(e.target.value)} />
        </div>
      </div>

      {previewBadge && (
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Anteprima badge</p>
          <BadgeCard badge={previewBadge} />
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={handleSubmit} disabled={!cantiereId || !lavoratoreId}>
          Emetti badge
        </Button>
        <Button variant="outline" onClick={() => navigate("/badge")}>Annulla</Button>
      </div>
    </div>
  );
}
