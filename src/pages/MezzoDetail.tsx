import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Truck, CheckCircle2, AlertTriangle, Wrench, OctagonX, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockMezzi, mockCantieri, mockDocumenti, mockManutenzioni, getScadenzaStatus, type MezzoStatoOperativo } from "@/data/mock-data";

const statoChip: Record<MezzoStatoOperativo, { label: string; className: string }> = {
  operativo: { label: "Operativo", className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30" },
  in_manutenzione: { label: "In manutenzione", className: "bg-amber-500/10 text-amber-700 border-amber-500/30" },
  fermo: { label: "Fermo", className: "bg-destructive/10 text-destructive border-destructive/30" },
};

const scadenzaStatusChip = (status: string) => {
  if (status === "scaduto") return { label: "Scaduto", className: "text-destructive", icon: <OctagonX className="h-3.5 w-3.5" /> };
  if (status === "in_scadenza") return { label: "In scadenza", className: "text-amber-600", icon: <AlertTriangle className="h-3.5 w-3.5" /> };
  return { label: "Valido", className: "text-emerald-600", icon: <CheckCircle2 className="h-3.5 w-3.5" /> };
};

export default function MezzoDetail() {
  const { id } = useParams<{ id: string }>();
  const mezzo = mockMezzi.find((m) => m.id === id);

  if (!mezzo) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Mezzo non trovato</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link to="/app/mezzi">Torna ai mezzi</Link>
        </Button>
      </div>
    );
  }

  const cantiere = mockCantieri.find((c) => c.id === mezzo.cantiere_id);
  const documenti = mockDocumenti.filter((d) => d.riferimento_tipo === "mezzo" && d.riferimento_id === mezzo.id);
  const manutenzioni = mockManutenzioni.filter((m) => m.mezzo_id === mezzo.id).sort((a, b) => b.data.localeCompare(a.data));
  const chip = statoChip[mezzo.stato_operativo];

  const scadenze = [
    { label: "Prossima revisione", date: mezzo.data_prossima_revisione },
    { label: "Prossima manutenzione", date: mezzo.data_prossima_manutenzione },
    { label: "Scadenza assicurazione", date: mezzo.scadenza_assicurazione },
    ...(mezzo.scadenza_collaudo ? [{ label: "Scadenza collaudo", date: mezzo.scadenza_collaudo }] : []),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/app/mezzi"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <Truck className="h-5 w-5 text-primary" />
        <h1 className="font-heading font-bold text-2xl text-foreground">
          {mezzo.tipo} — {mezzo.targa_o_matricola}
        </h1>
        <span className={`inline-flex items-center text-[11px] font-medium border rounded-full px-2 py-0.5 ${chip.className}`}>
          {chip.label}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Info generali */}
        <div className="border border-border rounded-lg p-5 space-y-4">
          <h2 className="font-heading font-semibold text-foreground">Informazioni generali</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-muted-foreground text-xs">Descrizione</span><p className="text-foreground">{mezzo.descrizione}</p></div>
            <div><span className="text-muted-foreground text-xs">Cantiere</span><p className="text-foreground">{cantiere?.nome ?? "—"}</p></div>
            <div><span className="text-muted-foreground text-xs">Responsabile</span><p className="text-foreground">{mezzo.responsabile}</p></div>
            <div><span className="text-muted-foreground text-xs">Immatricolazione</span><p className="text-foreground">{new Date(mezzo.data_immatricolazione).toLocaleDateString("it-IT")}</p></div>
            <div><span className="text-muted-foreground text-xs">Ore lavoro</span><p className="text-foreground">{mezzo.ore_lavoro.toLocaleString("it-IT")} h</p></div>
            {mezzo.km_percorsi && <div><span className="text-muted-foreground text-xs">Km percorsi</span><p className="text-foreground">{mezzo.km_percorsi.toLocaleString("it-IT")} km</p></div>}
          </div>
          {mezzo.note && (
            <div className="border-t border-border pt-3">
              <span className="text-muted-foreground text-xs">Note</span>
              <p className="text-sm text-foreground mt-0.5">{mezzo.note}</p>
            </div>
          )}
        </div>

        {/* Scadenze e revisioni */}
        <div className="border border-border rounded-lg p-5 space-y-4">
          <h2 className="font-heading font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-primary" /> Scadenze e Revisioni
          </h2>
          <div className="space-y-3">
            {scadenze.map((s, i) => {
              const status = getScadenzaStatus(s.date);
              const sc = scadenzaStatusChip(status);
              return (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.label}</p>
                    <p className="text-xs text-muted-foreground">{new Date(s.date).toLocaleDateString("it-IT")}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 text-xs font-medium ${sc.className}`}>
                    {sc.icon} {sc.label}
                  </span>
                </div>
              );
            })}
          </div>
          {mezzo.data_ultima_revisione && (
            <div className="text-xs text-muted-foreground border-t border-border pt-3">
              Ultima revisione: {new Date(mezzo.data_ultima_revisione).toLocaleDateString("it-IT")}
            </div>
          )}
        </div>
      </div>

      {/* Documenti collegati */}
      <div className="border border-border rounded-lg p-5 space-y-3">
        <h2 className="font-heading font-semibold text-foreground flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" /> Documenti collegati
        </h2>
        {documenti.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nessun documento collegato</p>
        ) : (
          <div className="divide-y divide-border">
            {documenti.map((d) => (
              <div key={d.id} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm text-foreground">{d.nome_file}</p>
                  <p className="text-xs text-muted-foreground">{d.categoria} · Caricato il {new Date(d.data_caricamento).toLocaleDateString("it-IT")}</p>
                </div>
                {d.data_scadenza && (
                  <span className={`text-xs font-medium ${getScadenzaStatus(d.data_scadenza) === "scaduto" ? "text-destructive" : getScadenzaStatus(d.data_scadenza) === "in_scadenza" ? "text-amber-600" : "text-emerald-600"}`}>
                    Scade: {new Date(d.data_scadenza).toLocaleDateString("it-IT")}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Storico manutenzioni */}
      <div className="border border-border rounded-lg p-5 space-y-3">
        <h2 className="font-heading font-semibold text-foreground flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" /> Storico manutenzioni
        </h2>
        {manutenzioni.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nessuna manutenzione registrata</p>
        ) : (
          <div className="space-y-3">
            {manutenzioni.map((man) => {
              const tipoColors: Record<string, string> = {
                ordinaria: "border-l-emerald-500",
                straordinaria: "border-l-amber-500",
                revisione: "border-l-primary",
                collaudo: "border-l-blue-500",
              };
              return (
                <div key={man.id} className={`border border-border border-l-4 ${tipoColors[man.tipo]} rounded-lg p-3`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{man.descrizione}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(man.data).toLocaleDateString("it-IT")} · {man.eseguita_da}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground border border-border rounded-sm px-1.5 py-0.5">
                        {man.tipo}
                      </span>
                      {man.costo && (
                        <p className="text-xs text-foreground mt-1">€ {man.costo.toLocaleString("it-IT")}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
