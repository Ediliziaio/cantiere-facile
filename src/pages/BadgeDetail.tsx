import { useRef, useCallback, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download, ShieldCheck, ShieldAlert, Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, FileCheck, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockBadges, getTimbratureForBadge, getBadgeLavoratore, getBadgeCantiere, mockVerificheAccesso, mockTimbrature } from "@/data/mock-badges";
import { mockDocumenti } from "@/data/mock-data";
import { BadgeCard } from "@/components/badge/BadgeCard";
import { BadgeStatusChip } from "@/components/badge/BadgeStatusChip";
import { TimbratureCalendar } from "@/components/badge/TimbratureCalendar";
import { toast } from "sonner";

const esitoColors: Record<string, string> = {
  autorizzato: "text-emerald-600",
  warning: "text-amber-600",
  bloccato: "text-destructive",
};

const checkIcon = (stato: string) => {
  if (stato === "ok") return <ShieldCheck className="h-4 w-4 text-emerald-600" />;
  if (stato === "warning") return <ShieldAlert className="h-4 w-4 text-amber-600" />;
  return <ShieldAlert className="h-4 w-4 text-destructive" />;
};

const checkLabel: Record<string, string> = {
  ok: "Conforme",
  warning: "In scadenza",
  bloccato: "Non conforme",
  non_dichiarata: "Non dichiarata",
};

export default function BadgeDetail() {
  const { id } = useParams<{ id: string }>();
  const badge = mockBadges.find((b) => b.id === id);
  const badgeCardRef = useRef<HTMLDivElement>(null);
  const [calMonth, setCalMonth] = useState(2); // March (0-indexed)
  const [calYear, setCalYear] = useState(2026);

  const exportPdf = useCallback(async () => {
    if (!badgeCardRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(badgeCardRef.current, { scale: 3, backgroundColor: null, useCORS: true });
      const link = document.createElement("a");
      link.download = `badge-${badge?.codice_univoco ?? "export"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Badge esportato come immagine");
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Errore durante l'esportazione");
    }
  }, [badge]);

  if (!badge) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Badge non trovato</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link to="/app/badge">Torna ai badge</Link>
        </Button>
      </div>
    );
  }

  const lav = getBadgeLavoratore(badge);
  const timbrature = getTimbratureForBadge(badge.id).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  const verifica = mockVerificheAccesso.find((v) => v.badge_id === badge.id);

  // Stats presenze
  const stats = useMemo(() => {
    const monthTs = timbrature.filter((t) => {
      const d = new Date(t.timestamp);
      return d.getMonth() === calMonth && d.getFullYear() === calYear;
    });
    const giorni = new Set(monthTs.map((t) => t.timestamp.substring(0, 10))).size;
    let oreMin = 0;
    const dayMap = new Map<string, typeof monthTs>();
    for (const t of monthTs) {
      const day = t.timestamp.substring(0, 10);
      if (!dayMap.has(day)) dayMap.set(day, []);
      dayMap.get(day)!.push(t);
    }
    dayMap.forEach((dayTs) => {
      const sorted = dayTs.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
      for (let i = 0; i < sorted.length - 1; i += 2) {
        if (sorted[i].tipo === "entrata" && sorted[i + 1]?.tipo === "uscita") {
          oreMin += (new Date(sorted[i + 1].timestamp).getTime() - new Date(sorted[i].timestamp).getTime()) / 60000;
        }
      }
    });
    const oreTotali = Math.round(oreMin / 60 * 10) / 10;
    const mediaOre = giorni > 0 ? Math.round(oreTotali / giorni * 10) / 10 : 0;
    return { giorni, oreTotali, mediaOre };
  }, [timbrature, calMonth, calYear]);

  // Documenti del lavoratore
  const docLav = mockDocumenti.filter((d) => d.riferimento_tipo === "lavoratore" && d.riferimento_id === badge.lavoratore_id);

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); }
    else setCalMonth(calMonth - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); }
    else setCalMonth(calMonth + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/app/badge"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <h1 className="font-heading font-bold text-2xl text-foreground">
          Badge — {lav ? `${lav.nome} ${lav.cognome}` : badge.codice_univoco}
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div ref={badgeCardRef}><BadgeCard badge={badge} /></div>
          <div className="flex gap-2 flex-wrap">
            {badge.stato === "attivo" && <Button variant="outline" size="sm" onClick={() => {}}>Sospendi</Button>}
            {badge.stato === "sospeso" && <Button variant="outline" size="sm" onClick={() => {}}>Riattiva</Button>}
            <Button variant="outline" size="sm" onClick={exportPdf}>
              <Download className="h-3.5 w-3.5 mr-1" /> Esporta PDF
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to={`/app/timbrature`}>
                <Clock className="h-3.5 w-3.5 mr-1" /> Tutte le timbrature
              </Link>
            </Button>
          </div>

          {/* Stato conformità */}
          {verifica && (
            <div className="border border-border rounded-lg p-4 space-y-3">
              <h3 className="font-heading font-semibold text-sm text-foreground">Stato conformità</h3>
              <div className="space-y-2">
                {[
                  { label: "Documenti", stato: verifica.stato_documenti },
                  { label: "Formazione", stato: verifica.stato_formazione },
                  { label: "Idoneità sanitaria", stato: verifica.stato_idoneita_sanitaria },
                ].map((c) => (
                  <div key={c.label} className="flex items-center justify-between py-1">
                    <span className="text-sm text-foreground">{c.label}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium">
                      {checkIcon(c.stato)} {checkLabel[c.stato]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documenti lavoratore */}
          {docLav.length > 0 && (
            <div className="border border-border rounded-lg p-4 space-y-2">
              <h3 className="font-heading font-semibold text-sm text-foreground">Documenti lavoratore</h3>
              {docLav.map((d) => (
                <div key={d.id} className="flex items-center justify-between text-xs py-1 border-b border-border last:border-0">
                  <span className="text-foreground">{d.nome_file}</span>
                  <span className={d.stato === "scaduto" ? "text-destructive" : d.stato === "in_scadenza" ? "text-amber-600" : "text-emerald-600"}>
                    {d.stato === "scaduto" ? "🔴" : d.stato === "in_scadenza" ? "🟡" : "🟢"} {d.categoria}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Calendar with navigation */}
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
              <span className="text-sm font-medium text-foreground">Calendario presenze</span>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
            </div>
            <TimbratureCalendar badgeId={badge.id} month={calMonth} year={calYear} />
          </div>

          {/* Stats presenze */}
          <div className="grid grid-cols-3 gap-3">
            <div className="border border-border rounded-lg p-3 text-center">
              <p className="font-heading font-bold text-xl text-foreground">{stats.giorni}</p>
              <p className="text-[11px] text-muted-foreground">Giorni lavorati</p>
            </div>
            <div className="border border-border rounded-lg p-3 text-center">
              <p className="font-heading font-bold text-xl text-foreground">{stats.oreTotali}h</p>
              <p className="text-[11px] text-muted-foreground">Ore totali</p>
            </div>
            <div className="border border-border rounded-lg p-3 text-center">
              <p className="font-heading font-bold text-xl text-foreground">{stats.mediaOre}h</p>
              <p className="text-[11px] text-muted-foreground">Media/giorno</p>
            </div>
          </div>

          {badge.note && (
            <div className="border border-border rounded-lg p-4">
              <p className="text-sm font-medium text-foreground mb-1">Note</p>
              <p className="text-sm text-muted-foreground">{badge.note}</p>
            </div>
          )}
        </div>
      </div>

      <section>
        <h2 className="font-heading font-semibold text-lg text-foreground mb-3">Registro timbrature</h2>
        <div className="border border-border rounded-lg divide-y divide-border">
          {timbrature.slice(0, 20).map((t) => (
            <div key={t.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm text-foreground">
                  {t.tipo === "entrata" ? "↗ Entrata" : "↙ Uscita"}
                  <span className="text-muted-foreground ml-2">
                    {new Date(t.timestamp).toLocaleString("it-IT", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </p>
                {t.motivo_blocco && <p className="text-xs text-destructive mt-0.5">{t.motivo_blocco}</p>}
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
