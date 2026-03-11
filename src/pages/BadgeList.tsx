import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, IdCard, Info, Search, ShieldCheck, ShieldOff, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockBadges, getBadgeLavoratore, getBadgeCantiere, mockTimbrature } from "@/data/mock-badges";
import { mockCantieri } from "@/data/mock-data";
import { BadgeStatusChip } from "@/components/badge/BadgeStatusChip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function BadgeList() {
  const [filtroCantiere, setFiltroCantiere] = useState("tutti");
  const [filtroStato, setFiltroStato] = useState("tutti");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return mockBadges.filter((b) => {
      if (filtroCantiere !== "tutti" && b.cantiere_id !== filtroCantiere) return false;
      if (filtroStato !== "tutti" && b.stato !== filtroStato) return false;
      if (search) {
        const lav = getBadgeLavoratore(b);
        if (!lav || !`${lav.nome} ${lav.cognome}`.toLowerCase().includes(search.toLowerCase())) return false;
      }
      return true;
    });
  }, [filtroCantiere, filtroStato, search]);

  const attivi = mockBadges.filter((b) => b.stato === "attivo").length;
  const sospesi = mockBadges.filter((b) => b.stato === "sospeso").length;
  const revocati = mockBadges.filter((b) => b.stato === "revocato").length;

  const getUltimoAccesso = (badgeId: string) => {
    const ts = mockTimbrature.filter((t) => t.badge_id === badgeId);
    if (!ts.length) return "—";
    const last = ts.sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0];
    return new Date(last.timestamp).toLocaleString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 border border-primary/30 bg-primary/5 rounded-lg p-4">
        <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
        <div className="text-sm text-foreground">
          <p className="font-medium">D.L. 159/2025 — Decreto Sicurezza</p>
          <p className="text-muted-foreground mt-0.5">
            Il modulo Badge Digitale è conforme al D.L. 159/2025. L'implementazione definitiva sarà allineata
            ai decreti attuativi del Ministero del Lavoro, attualmente in fase di definizione.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="border border-border rounded-lg p-4 text-center">
          <p className="font-heading font-bold text-2xl text-foreground">{mockBadges.length}</p>
          <p className="text-xs text-muted-foreground">Totali</p>
        </div>
        <div className="border border-border rounded-lg p-4 text-center">
          <ShieldCheck className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
          <p className="font-heading font-bold text-2xl text-emerald-600">{attivi}</p>
          <p className="text-xs text-muted-foreground">Attivi</p>
        </div>
        <div className="border border-border rounded-lg p-4 text-center">
          <ShieldAlert className="h-4 w-4 text-amber-600 mx-auto mb-1" />
          <p className="font-heading font-bold text-2xl text-amber-600">{sospesi}</p>
          <p className="text-xs text-muted-foreground">Sospesi</p>
        </div>
        <div className="border border-border rounded-lg p-4 text-center">
          <ShieldOff className="h-4 w-4 text-destructive mx-auto mb-1" />
          <p className="font-heading font-bold text-2xl text-destructive">{revocati}</p>
          <p className="text-xs text-muted-foreground">Revocati</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="font-heading font-bold text-2xl text-foreground">Badge Digitali</h1>
        <Button size="sm" asChild>
          <Link to="/app/badge/nuovo"><Plus className="h-3.5 w-3.5 mr-1" /> Emetti badge</Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cerca lavoratore…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-2">
          <Select value={filtroCantiere} onValueChange={setFiltroCantiere}>
            <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="tutti">Tutti i cantieri</SelectItem>
              {mockCantieri.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filtroStato} onValueChange={setFiltroStato}>
            <SelectTrigger className="w-full sm:w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="tutti">Tutti</SelectItem>
              <SelectItem value="attivo">Attivo</SelectItem>
              <SelectItem value="sospeso">Sospeso</SelectItem>
              <SelectItem value="revocato">Revocato</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Lavoratore</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Cantiere</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Codice</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Stato</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Scadenza</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Ultimo accesso</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((b) => {
              const lav = getBadgeLavoratore(b);
              const cant = getBadgeCantiere(b);
              return (
                <tr key={b.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{lav ? `${lav.nome} ${lav.cognome}` : "—"}</p>
                    <p className="text-xs text-muted-foreground">{lav?.mansione}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{cant?.nome ?? "—"}</td>
                  <td className="px-4 py-3 hidden lg:table-cell font-mono text-xs text-muted-foreground">{b.codice_univoco}</td>
                  <td className="px-4 py-3"><BadgeStatusChip stato={b.stato} /></td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                    {new Date(b.data_scadenza).toLocaleDateString("it-IT")}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted-foreground">{getUltimoAccesso(b.id)}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/app/badge/${b.id}`}>
                        <IdCard className="h-3.5 w-3.5 mr-1" /> Dettaglio
                      </Link>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="px-4 py-8 text-sm text-muted-foreground text-center">Nessun badge trovato</p>
        )}
      </div>
    </div>
  );
}
