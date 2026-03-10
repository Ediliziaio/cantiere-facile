import { useState } from "react";
import { mockTimbrature, getBadgeLavoratore, mockBadges } from "@/data/mock-badges";
import { mockCantieri, mockLavoratori } from "@/data/mock-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const esitoColors: Record<string, string> = {
  autorizzato: "border-l-emerald-500",
  warning: "border-l-amber-500",
  bloccato: "border-l-red-500",
};

export default function Timbrature() {
  const [filtroEsito, setFiltroEsito] = useState("tutti");
  const [filtroCantiere, setFiltroCantiere] = useState("tutti");

  const sorted = [...mockTimbrature].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  const filtered = sorted.filter((t) => {
    if (filtroEsito !== "tutti" && t.esito !== filtroEsito) return false;
    if (filtroCantiere !== "tutti" && t.cantiere_id !== filtroCantiere) return false;
    return true;
  });

  const today = "2026-03-10";
  const todayTs = sorted.filter((t) => t.timestamp.startsWith(today));
  const presenti = new Set(todayTs.filter((t) => t.tipo === "entrata").map((t) => t.lavoratore_id)).size;
  const ingressi = todayTs.filter((t) => t.tipo === "entrata").length;
  const bloccati = todayTs.filter((t) => t.esito === "bloccato").length;

  const getLavName = (lid: string) => {
    const l = mockLavoratori.find((x) => x.id === lid);
    return l ? `${l.nome} ${l.cognome}` : "—";
  };
  const getCantName = (cid: string) => mockCantieri.find((c) => c.id === cid)?.nome ?? "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading font-bold text-2xl text-foreground">Timbrature</h1>
        <Button variant="outline" size="sm"><Download className="h-3.5 w-3.5 mr-1" /> Esporta CSV</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="border border-border rounded-lg p-4 text-center">
          <p className="font-heading font-bold text-2xl text-foreground">{presenti}</p>
          <p className="text-xs text-muted-foreground">Presenti oggi</p>
        </div>
        <div className="border border-border rounded-lg p-4 text-center">
          <p className="font-heading font-bold text-2xl text-foreground">{ingressi}</p>
          <p className="text-xs text-muted-foreground">Ingressi oggi</p>
        </div>
        <div className="border border-border rounded-lg p-4 text-center">
          <p className="font-heading font-bold text-2xl text-red-600">{bloccati}</p>
          <p className="text-xs text-muted-foreground">Bloccati oggi</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Cantiere</Label>
          <Select value={filtroCantiere} onValueChange={setFiltroCantiere}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="tutti">Tutti i cantieri</SelectItem>
              {mockCantieri.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Esito</Label>
          <Select value={filtroEsito} onValueChange={setFiltroEsito}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="tutti">Tutti</SelectItem>
              <SelectItem value="autorizzato">🟢 Autorizzato</SelectItem>
              <SelectItem value="warning">🟡 Warning</SelectItem>
              <SelectItem value="bloccato">🔴 Bloccato</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Log */}
      <div className="border border-border rounded-lg divide-y divide-border">
        {filtered.slice(0, 50).map((t) => (
          <div key={t.id} className={`flex items-center justify-between px-4 py-3 border-l-4 ${esitoColors[t.esito]}`}>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">
                {getLavName(t.lavoratore_id)}
                <span className="font-normal text-muted-foreground ml-2">
                  {t.tipo === "entrata" ? "↗ Entrata" : "↙ Uscita"}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                {getCantName(t.cantiere_id)} · {new Date(t.timestamp).toLocaleString("it-IT", {
                  day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
                })}
                {t.metodo && ` · ${t.metodo.replace("_", " ")}`}
              </p>
              {t.motivo_blocco && <p className="text-xs text-red-600 mt-0.5">{t.motivo_blocco}</p>}
            </div>
            <span className="text-xs shrink-0">
              {t.esito === "autorizzato" ? "🟢" : t.esito === "warning" ? "🟡" : "🔴"}
            </span>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="px-4 py-8 text-sm text-muted-foreground text-center">Nessuna timbratura trovata</p>
        )}
      </div>
    </div>
  );
}
