import { Building2, FileText, AlertTriangle, ShieldCheck, Building, Plus, Upload, UserPlus, Users, IdCard } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { dashboardStats, mockCantieri, mockScadenze, mockAccessi } from "@/data/mock-data";
import { CantiereSummaryCard } from "@/components/cantiere/CantiereSummaryCard";
import { ScadenzaAlert } from "@/components/cantiere/ScadenzaAlert";
import { DocumentStatusBadge } from "@/components/cantiere/DocumentStatusBadge";
import { PresenzaLiveWidget } from "@/components/badge/PresenzaLiveWidget";
import { mockBadges } from "@/data/mock-badges";

const badgeInScadenza = mockBadges.filter((b) => {
  const exp = new Date(b.data_scadenza);
  const now = new Date("2026-03-10");
  const diff = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diff <= 30 && diff > 0 && b.stato === "attivo";
}).length;

const statCards = [
  { label: "Cantieri attivi", value: dashboardStats.cantieriAttivi, icon: Building2, href: "/cantieri" },
  { label: "Documenti in scadenza", value: dashboardStats.documentiInScadenza, icon: AlertTriangle, href: "/scadenze", accent: true },
  { label: "Accessi oggi", value: dashboardStats.accessiOggi, icon: ShieldCheck, href: "/accessi" },
  { label: "Subappaltatori con problemi", value: dashboardStats.subAppConProblemi, icon: Building, href: "/subappaltatori" },
  { label: "Badge in scadenza", value: badgeInScadenza, icon: IdCard, href: "/badge" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading font-bold text-2xl text-foreground">Dashboard</h1>
      </div>

      <ScadenzaAlert count={dashboardStats.documentiInScadenza} scadutiCount={dashboardStats.documentiScaduti} />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((s) => (
          <Link
            key={s.label}
            to={s.href}
            className="border border-border bg-card rounded-lg p-4 hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <s.icon className={`h-4 w-4 ${s.accent ? "text-warning" : "text-muted-foreground"}`} />
            </div>
            <p className="font-heading font-bold text-2xl text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Button size="sm" asChild>
          <Link to="/cantieri/nuovo"><Plus className="h-3.5 w-3.5 mr-1" /> Nuovo cantiere</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link to="/documenti"><Upload className="h-3.5 w-3.5 mr-1" /> Carica documento</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link to="/subappaltatori"><UserPlus className="h-3.5 w-3.5 mr-1" /> Aggiungi subappaltatore</Link>
        </Button>
      </div>

      {/* Cantieri */}
      <section>
        <h2 className="font-heading font-semibold text-lg text-foreground mb-3">Cantieri attivi</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {mockCantieri.map((c) => (
            <CantiereSummaryCard
              key={c.id}
              id={c.id}
              nome={c.nome}
              comune={c.comune}
              stato={c.stato}
              lavoratoriCount={c.lavoratori_count}
              documentiOk={c.documenti_ok}
              documentiTotali={c.documenti_totali}
            />
          ))}
        </div>
      </section>

      {/* Prossime scadenze */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading font-semibold text-lg text-foreground">Prossime scadenze</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/scadenze">Vedi tutte</Link>
          </Button>
        </div>
        <div className="border border-border rounded-lg divide-y divide-border">
          {mockScadenze.slice(0, 4).map((s) => (
            <div key={s.id} className="flex items-center justify-between px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{s.categoria}</p>
                <p className="text-xs text-muted-foreground">{s.cantiere} · Scade il {new Date(s.data_scadenza).toLocaleDateString("it-IT")}</p>
              </div>
              <DocumentStatusBadge stato={s.stato} />
            </div>
          ))}
        </div>
      </section>

      {/* Ultimi accessi */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading font-semibold text-lg text-foreground">Accessi oggi</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/accessi">Vedi tutti</Link>
          </Button>
        </div>
        <div className="border border-border rounded-lg divide-y divide-border">
          {mockAccessi.map((a) => (
            <div key={a.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">{a.lavoratore_nome}</p>
                <p className="text-xs text-muted-foreground">
                  {a.tipo === "entrata" ? "↗ Entrata" : "↙ Uscita"} · {new Date(a.timestamp).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground border border-border rounded-sm px-1.5 py-0.5">
                {a.metodo}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
