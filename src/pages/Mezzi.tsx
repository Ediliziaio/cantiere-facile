import { useState } from "react";
import { Link } from "react-router-dom";
import { Truck, Wrench, AlertTriangle, CheckCircle2, OctagonX, Search, Eye, Plus } from "lucide-react";
import { mockMezzi, mockCantieri, getScadenzaStatus, type MezzoStatoOperativo } from "@/data/mock-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const statoChip: Record<MezzoStatoOperativo, { label: string; className: string; icon: React.ReactNode }> = {
  operativo: { label: "Operativo", className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30", icon: <CheckCircle2 className="h-3 w-3" /> },
  in_manutenzione: { label: "In manutenzione", className: "bg-amber-500/10 text-amber-700 border-amber-500/30", icon: <Wrench className="h-3 w-3" /> },
  fermo: { label: "Fermo", className: "bg-destructive/10 text-destructive border-destructive/30", icon: <OctagonX className="h-3 w-3" /> },
};

function getNextScadenza(m: typeof mockMezzi[0]) {
  const dates = [
    { label: "Revisione", date: m.data_prossima_revisione },
    { label: "Manutenzione", date: m.data_prossima_manutenzione },
    { label: "Assicurazione", date: m.scadenza_assicurazione },
    ...(m.scadenza_collaudo ? [{ label: "Collaudo", date: m.scadenza_collaudo }] : []),
  ].sort((a, b) => a.date.localeCompare(b.date));
  return dates[0];
}

function hasScadenzaImminente(m: typeof mockMezzi[0]) {
  const dates = [m.data_prossima_revisione, m.data_prossima_manutenzione, m.scadenza_assicurazione, m.scadenza_collaudo].filter(Boolean) as string[];
  return dates.some((d) => getScadenzaStatus(d) !== "valido");
}

export default function Mezzi() {
  const [filtroCantiere, setFiltroCantiere] = useState("tutti");
  const [filtroStato, setFiltroStato] = useState("tutti");
  const [search, setSearch] = useState("");

  const filtered = mockMezzi.filter((m) => {
    if (filtroCantiere !== "tutti" && m.cantiere_id !== filtroCantiere) return false;
    if (filtroStato !== "tutti" && m.stato_operativo !== filtroStato) return false;
    if (search && !`${m.tipo} ${m.targa_o_matricola} ${m.descrizione}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const operativi = mockMezzi.filter((m) => m.stato_operativo === "operativo").length;
  const inManutenzione = mockMezzi.filter((m) => m.stato_operativo === "in_manutenzione").length;
  const conScadenze = mockMezzi.filter(hasScadenzaImminente).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-primary" />
          <h1 className="font-heading font-bold text-2xl text-foreground">Mezzi d'opera</h1>
        </div>
        <Button size="sm" asChild>
          <Link to="/app/mezzi/nuovo"><Plus className="h-3.5 w-3.5 mr-1" /> Nuovo mezzo</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="border border-border rounded-lg p-4 text-center">
          <p className="font-heading font-bold text-2xl text-emerald-600">{operativi}</p>
          <p className="text-xs text-muted-foreground">Operativi</p>
        </div>
        <div className="border border-border rounded-lg p-4 text-center">
          <p className="font-heading font-bold text-2xl text-amber-600">{inManutenzione}</p>
          <p className="text-xs text-muted-foreground">In manutenzione</p>
        </div>
        <div className="border border-border rounded-lg p-4 text-center">
          <p className="font-heading font-bold text-2xl text-destructive">{conScadenze}</p>
          <p className="text-xs text-muted-foreground">Scadenze imminenti</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cerca mezzo…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filtroCantiere} onValueChange={setFiltroCantiere}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="tutti">Tutti i cantieri</SelectItem>
            {mockCantieri.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filtroStato} onValueChange={setFiltroStato}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="tutti">Tutti gli stati</SelectItem>
            <SelectItem value="operativo">Operativo</SelectItem>
            <SelectItem value="in_manutenzione">In manutenzione</SelectItem>
            <SelectItem value="fermo">Fermo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((m) => {
          const cantiere = mockCantieri.find((c) => c.id === m.cantiere_id);
          const chip = statoChip[m.stato_operativo];
          const nextScad = getNextScadenza(m);
          const nextScadStatus = getScadenzaStatus(nextScad.date);

          return (
            <div key={m.id} className="border border-border rounded-lg p-4 space-y-3 hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-foreground">{m.tipo} — {m.targa_o_matricola}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{m.descrizione}</p>
                </div>
                <span className={`inline-flex items-center gap-1 text-[11px] font-medium border rounded-full px-2 py-0.5 ${chip.className}`}>
                  {chip.icon} {chip.label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Cantiere</span>
                  <p className="text-foreground">{cantiere?.nome ?? "—"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Responsabile</span>
                  <p className="text-foreground">{m.responsabile}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Ore lavoro</span>
                  <p className="text-foreground">{m.ore_lavoro.toLocaleString("it-IT")} h</p>
                </div>
                {m.km_percorsi && (
                  <div>
                    <span className="text-muted-foreground">Km percorsi</span>
                    <p className="text-foreground">{m.km_percorsi.toLocaleString("it-IT")} km</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-1.5 text-xs">
                  {nextScadStatus === "scaduto" && <AlertTriangle className="h-3.5 w-3.5 text-destructive" />}
                  {nextScadStatus === "in_scadenza" && <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
                  {nextScadStatus === "valido" && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                  <span className={nextScadStatus === "scaduto" ? "text-destructive font-medium" : nextScadStatus === "in_scadenza" ? "text-amber-600" : "text-muted-foreground"}>
                    {nextScad.label}: {new Date(nextScad.date).toLocaleDateString("it-IT")}
                  </span>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/app/mezzi/${m.id}`}>
                    <Eye className="h-3.5 w-3.5 mr-1" /> Dettaglio
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">Nessun mezzo trovato</p>
      )}
    </div>
  );
}
