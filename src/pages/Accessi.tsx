import { useState } from "react";
import { ShieldCheck, Users, LogIn, LogOut, OctagonX, Search } from "lucide-react";
import { mockTimbrature, getPresentiOra } from "@/data/mock-badges";
import { mockCantieri, mockLavoratori } from "@/data/mock-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const esitoColors: Record<string, string> = {
  autorizzato: "border-l-emerald-500",
  warning: "border-l-amber-500",
  bloccato: "border-l-red-500",
};

export default function Accessi() {
  const [filtroCantiere, setFiltroCantiere] = useState("tutti");
  const [searchLav, setSearchLav] = useState("");

  const today = "2026-03-10";
  const sorted = [...mockTimbrature].sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  const filtered = sorted.filter((t) => {
    if (filtroCantiere !== "tutti" && t.cantiere_id !== filtroCantiere) return false;
    if (searchLav) {
      const lav = mockLavoratori.find((l) => l.id === t.lavoratore_id);
      if (!lav || !`${lav.nome} ${lav.cognome}`.toLowerCase().includes(searchLav.toLowerCase())) return false;
    }
    return true;
  });

  const todayTs = sorted.filter((t) => t.timestamp.startsWith(today));
  const presentiOra = getPresentiOra();
  const ingressiOggi = todayTs.filter((t) => t.tipo === "entrata").length;
  const usciteOggi = todayTs.filter((t) => t.tipo === "uscita").length;
  const bloccatiOggi = todayTs.filter((t) => t.esito === "bloccato").length;

  const getLav = (lid: string) => mockLavoratori.find((l) => l.id === lid);
  const getCantName = (cid: string) => mockCantieri.find((c) => c.id === cid)?.nome ?? "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <h1 className="font-heading font-bold text-2xl text-foreground">Registro Accessi</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="border border-border rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Users className="h-4 w-4 text-primary" />
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" /></span>
          </div>
          <p className="font-heading font-bold text-2xl text-foreground">{presentiOra}</p>
          <p className="text-xs text-muted-foreground">Presenti ora</p>
        </div>
        <div className="border border-border rounded-lg p-4 text-center">
          <LogIn className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
          <p className="font-heading font-bold text-2xl text-foreground">{ingressiOggi}</p>
          <p className="text-xs text-muted-foreground">Ingressi oggi</p>
        </div>
        <div className="border border-border rounded-lg p-4 text-center">
          <LogOut className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
          <p className="font-heading font-bold text-2xl text-foreground">{usciteOggi}</p>
          <p className="text-xs text-muted-foreground">Uscite oggi</p>
        </div>
        <div className="border border-border rounded-lg p-4 text-center">
          <OctagonX className="h-4 w-4 text-destructive mx-auto mb-1" />
          <p className="font-heading font-bold text-2xl text-destructive">{bloccatiOggi}</p>
          <p className="text-xs text-muted-foreground">Bloccati oggi</p>
        </div>
      </div>

      {/* Presenti per cantiere */}
      <div className="border border-border rounded-lg p-4">
        <p className="font-heading font-semibold text-sm text-foreground mb-2">Presenti per cantiere</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {mockCantieri.map((c) => (
            <div key={c.id} className="flex items-center justify-between bg-muted/30 rounded px-3 py-2">
              <span className="text-xs text-muted-foreground truncate">{c.nome}</span>
              <span className="font-medium text-sm text-foreground ml-2">{getPresentiOra(c.id)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cerca lavoratore…" value={searchLav} onChange={(e) => setSearchLav(e.target.value)} className="pl-9" />
        </div>
        <Select value={filtroCantiere} onValueChange={setFiltroCantiere}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="tutti">Tutti i cantieri</SelectItem>
            {mockCantieri.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Log */}
      <div className="border border-border rounded-lg divide-y divide-border">
        {filtered.slice(0, 50).map((t) => {
          const lav = getLav(t.lavoratore_id);
          return (
            <div key={t.id} className={`flex items-center justify-between px-4 py-3 border-l-4 ${esitoColors[t.esito]}`}>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {lav ? `${lav.nome} ${lav.cognome}` : "—"}
                  <span className="font-normal text-muted-foreground ml-1.5 text-xs">{lav?.mansione}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {t.tipo === "entrata" ? "↗ Entrata" : "↙ Uscita"} · {getCantName(t.cantiere_id)} · {new Date(t.timestamp).toLocaleString("it-IT", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                  {t.metodo && ` · ${t.metodo.replace("_", " ")}`}
                </p>
                {t.motivo_blocco && <p className="text-xs text-destructive mt-0.5">{t.motivo_blocco}</p>}
              </div>
              <span className="text-xs shrink-0">
                {t.esito === "autorizzato" ? "🟢" : t.esito === "warning" ? "🟡" : "🔴"}
              </span>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="px-4 py-8 text-sm text-muted-foreground text-center">Nessun accesso trovato</p>
        )}
      </div>
    </div>
  );
}
