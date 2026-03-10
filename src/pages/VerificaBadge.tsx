import { useParams } from "react-router-dom";
import { HardHat, CheckCircle2, XCircle, AlertTriangle, Shield } from "lucide-react";
import { mockBadges, getBadgeLavoratore, getBadgeCantiere, mockTimbrature } from "@/data/mock-badges";
import { mockTenant, mockSubappaltatori, mockDocumenti } from "@/data/mock-data";
import { BadgeStatusChip } from "@/components/badge/BadgeStatusChip";

function CheckRow({ label, ok }: { label: string; ok: boolean | "warning" }) {
  return (
    <div className="flex items-center gap-3 py-2">
      {ok === true && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
      {ok === "warning" && <AlertTriangle className="h-5 w-5 text-amber-500" />}
      {ok === false && <XCircle className="h-5 w-5 text-red-500" />}
      <span className="text-sm text-foreground">{label}</span>
    </div>
  );
}

export default function VerificaBadge() {
  const { codice } = useParams<{ codice: string }>();
  const badge = mockBadges.find((b) => b.codice_univoco === codice);

  if (!badge) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center space-y-3 max-w-sm">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto" />
          <h1 className="font-heading font-bold text-xl text-foreground">Badge non trovato</h1>
          <p className="text-sm text-muted-foreground">
            Il codice badge inserito non corrisponde a nessun badge registrato nel sistema.
          </p>
        </div>
      </div>
    );
  }

  const lav = getBadgeLavoratore(badge);
  const cant = getBadgeCantiere(badge);
  const sub = lav?.subappaltatore_id
    ? mockSubappaltatori.find((s) => s.id === lav.subappaltatore_id)
    : null;
  const impresa = sub ? sub.ragione_sociale : mockTenant.nome_azienda;

  // Simulate document checks
  const lavDocs = mockDocumenti.filter((d) => d.riferimento_id === badge.lavoratore_id);
  const docsOk = lavDocs.every((d) => d.stato === "valido" || d.stato === "in_scadenza");
  const docsWarning = lavDocs.some((d) => d.stato === "in_scadenza");
  const hasScaduto = lavDocs.some((d) => d.stato === "scaduto");

  const lastAccess = mockTimbrature
    .filter((t) => t.badge_id === badge.id)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <HardHat className="h-6 w-6 text-primary" />
              <span className="font-heading font-bold text-primary">CANTIERE IN CLOUD</span>
            </div>
            <h1 className="font-heading font-bold text-2xl text-foreground">Verifica Badge</h1>
          </div>

          {/* Worker info */}
          <div className="border border-border rounded-lg p-5 space-y-3">
            <div className="text-center">
              <p className="font-heading font-bold text-xl text-foreground">
                {lav ? `${lav.nome} ${lav.cognome}` : "—"}
              </p>
              <p className="text-sm text-muted-foreground">{lav?.mansione}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Impresa</p>
                <p className="text-foreground font-medium">{impresa}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Cantiere</p>
                <p className="text-foreground font-medium">{cant?.nome ?? "—"}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-xs text-muted-foreground">Stato badge</span>
              <BadgeStatusChip stato={badge.stato} />
            </div>

            {lastAccess && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Ultimo accesso</span>
                <span className="text-xs text-foreground">
                  {new Date(lastAccess.timestamp).toLocaleString("it-IT", {
                    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Checks */}
          <div className="border border-border rounded-lg p-5">
            <p className="font-heading font-semibold text-sm text-foreground mb-2">Stato conformità</p>
            <CheckRow label="Documenti in regola" ok={hasScaduto ? false : docsWarning ? "warning" : true} />
            <CheckRow label="Formazione in regola" ok={true} />
            <CheckRow label="Idoneità sanitaria" ok={badge.lavoratore_id === "l3" ? "warning" : true} />
          </div>

          {/* Verification timestamp */}
          <p className="text-xs text-muted-foreground text-center">
            Verifica effettuata il {new Date().toLocaleString("it-IT")}
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-4 text-center">
        <p className="text-xs text-muted-foreground">
          Verificato da <span className="font-medium text-foreground">Cantiere in Cloud</span>
        </p>
      </footer>
    </div>
  );
}
