import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockBadges, getTimbratureForBadge, getBadgeLavoratore, getBadgeCantiere, mockVerificheAccesso } from "@/data/mock-badges";
import { BadgeCard } from "@/components/badge/BadgeCard";
import { BadgeStatusChip } from "@/components/badge/BadgeStatusChip";
import { TimbratureCalendar } from "@/components/badge/TimbratureCalendar";
import { DocumentStatusBadge } from "@/components/cantiere/DocumentStatusBadge";

const esitoColors: Record<string, string> = {
  autorizzato: "text-emerald-600",
  warning: "text-amber-600",
  bloccato: "text-red-600",
};

export default function BadgeDetail() {
  const { id } = useParams<{ id: string }>();
  const badge = mockBadges.find((b) => b.id === id);

  if (!badge) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Badge non trovato</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link to="/badge">Torna ai badge</Link>
        </Button>
      </div>
    );
  }

  const lav = getBadgeLavoratore(badge);
  const timbrature = getTimbratureForBadge(badge.id).sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/badge"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <h1 className="font-heading font-bold text-2xl text-foreground">
          Badge — {lav ? `${lav.nome} ${lav.cognome}` : badge.codice_univoco}
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <BadgeCard badge={badge} />

          <div className="flex gap-2 flex-wrap">
            {badge.stato === "attivo" && (
              <Button variant="outline" size="sm" onClick={() => {}}>Sospendi</Button>
            )}
            {badge.stato === "sospeso" && (
              <Button variant="outline" size="sm" onClick={() => {}}>Riattiva</Button>
            )}
            <Button variant="outline" size="sm" onClick={() => {}}>Esporta PDF</Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-border rounded-lg p-4">
            <TimbratureCalendar badgeId={badge.id} />
          </div>

          {badge.note && (
            <div className="border border-border rounded-lg p-4">
              <p className="text-sm font-medium text-foreground mb-1">Note</p>
              <p className="text-sm text-muted-foreground">{badge.note}</p>
            </div>
          )}
        </div>
      </div>

      {/* Timbrature log */}
      <section>
        <h2 className="font-heading font-semibold text-lg text-foreground mb-3">Registro timbrature</h2>
        <div className="border border-border rounded-lg divide-y divide-border">
          {timbrature.slice(0, 20).map((t) => (
            <div key={t.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm text-foreground">
                  {t.tipo === "entrata" ? "↗ Entrata" : "↙ Uscita"}
                  <span className="text-muted-foreground ml-2">
                    {new Date(t.timestamp).toLocaleString("it-IT", {
                      day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                </p>
                {t.motivo_blocco && (
                  <p className="text-xs text-red-600 mt-0.5">{t.motivo_blocco}</p>
                )}
              </div>
              <span className={`text-xs font-medium ${esitoColors[t.esito] ?? "text-muted-foreground"}`}>
                {t.esito === "autorizzato" ? "🟢" : t.esito === "warning" ? "🟡" : "🔴"} {t.esito}
              </span>
            </div>
          ))}
          {timbrature.length === 0 && (
            <p className="px-4 py-6 text-sm text-muted-foreground text-center">Nessuna timbratura registrata</p>
          )}
        </div>
      </section>
    </div>
  );
}
