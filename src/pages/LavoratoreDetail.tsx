import { useParams, Link } from "react-router-dom";
import { mockLavoratori, mockSubappaltatori, mockDocumenti, mockSiteAssignments, mockCantieri } from "@/data/mock-data";
import { mockBadges, mockTimbrature } from "@/data/mock-badges";
import { useWorkerCompliance } from "@/hooks/useWorkerCompliance";
import { WorkerComplianceCard } from "@/components/badge/WorkerComplianceCard";
import { BadgeCard } from "@/components/badge/BadgeCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, HardHat, FileText, Clock, MapPin, CalendarDays,
} from "lucide-react";

export default function LavoratoreDetail() {
  const { id } = useParams<{ id: string }>();
  const worker = mockLavoratori.find((l) => l.id === id);
  const compliance = useWorkerCompliance(worker);

  if (!worker) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Lavoratore non trovato.</p>
        <Link to="/app/lavoratori">
          <Button variant="outline" className="mt-4">Torna alla lista</Button>
        </Link>
      </div>
    );
  }

  const sub = worker.subappaltatore_id
    ? mockSubappaltatori.find((s) => s.id === worker.subappaltatore_id)
    : null;

  const workerBadges = mockBadges.filter((b) => b.lavoratore_id === worker.id);
  const activeBadge = workerBadges.find((b) => b.stato === "attivo");
  const workerDocs = mockDocumenti.filter(
    (d) => d.riferimento_id === worker.id && d.riferimento_tipo === "lavoratore"
  );
  const assignments = mockSiteAssignments.filter((sa) => sa.lavoratore_id === worker.id && sa.attivo);
  const recentTimbrature = mockTimbrature
    .filter((t) => t.lavoratore_id === worker.id)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 6);

  return (
    <div className="space-y-6 pb-24 md:pb-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/app/lavoratori">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            {worker.nome} {worker.cognome}
          </h1>
          <p className="text-sm text-muted-foreground">
            {worker.mansione} · {worker.tipo === "interno" ? "Interno" : sub?.ragione_sociale || "Esterno"}
            {" · "}{worker.codice_fiscale}
          </p>
        </div>
        <Badge variant={worker.health_status === "idoneo" ? "default" : worker.health_status === "idoneo_limitato" ? "secondary" : "destructive"}>
          {worker.health_status.replace("_", " ")}
        </Badge>
      </div>

      {/* Compliance */}
      <WorkerComplianceCard compliance={compliance} />

      {/* Active badge preview */}
      {activeBadge && (
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <HardHat className="h-4 w-4 text-primary" /> Tesserino Attivo
          </h2>
          <Link to={`/app/badge/${activeBadge.id}`}>
            <BadgeCard badge={activeBadge} />
          </Link>
        </div>
      )}

      {/* Cantieri assegnati */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" /> Cantieri Assegnati
          </h2>
          <div className="space-y-2">
            {assignments.map((sa) => {
              const cantiere = mockCantieri.find((c) => c.id === sa.cantiere_id);
              return (
                <Link key={sa.id} to={`/app/cantieri/${sa.cantiere_id}`}
                  className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-accent transition-colors">
                  <span className="text-sm font-medium text-foreground">{cantiere?.nome || sa.cantiere_id}</span>
                  <span className="text-xs text-muted-foreground">dal {sa.data_inizio}</span>
                </Link>
              );
            })}
            {assignments.length === 0 && (
              <p className="text-sm text-muted-foreground">Nessun cantiere assegnato.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Documenti */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" /> Documenti
          </h2>
          <div className="space-y-2">
            {workerDocs.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{doc.categoria}</p>
                  <p className="text-xs text-muted-foreground">{doc.nome_file}</p>
                </div>
                <div className="flex items-center gap-2">
                  {doc.data_scadenza && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {doc.data_scadenza}
                    </span>
                  )}
                  <Badge variant={
                    doc.stato === "valido" ? "default" :
                    doc.stato === "in_scadenza" ? "secondary" :
                    doc.stato === "scaduto" ? "destructive" : "outline"
                  } className="text-[10px]">
                    {doc.stato.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            ))}
            {workerDocs.length === 0 && (
              <p className="text-sm text-muted-foreground">Nessun documento caricato.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Ultime timbrature */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" /> Ultime Timbrature
          </h2>
          <div className="space-y-2">
            {recentTimbrature.map((t) => {
              const cantiere = mockCantieri.find((c) => c.id === t.cantiere_id);
              return (
                <div key={t.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-2">
                    <Badge variant={t.tipo === "entrata" ? "default" : "secondary"} className="text-[10px]">
                      {t.tipo}
                    </Badge>
                    <span className="text-sm text-foreground">{cantiere?.nome}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(t.timestamp).toLocaleString("it-IT", {
                      day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                </div>
              );
            })}
            {recentTimbrature.length === 0 && (
              <p className="text-sm text-muted-foreground">Nessuna timbratura recente.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
