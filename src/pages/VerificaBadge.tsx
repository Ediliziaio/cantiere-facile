import { useParams } from "react-router-dom";
import { HardHat, CheckCircle2, XCircle, AlertTriangle, Shield, FileCheck } from "lucide-react";
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

  const lavDocs = mockDocumenti.filter((d) => d.riferimento_id === badge.lavoratore_id);
  const hasScaduto = lavDocs.some((d) => d.stato === "scaduto");
  const docsWarning = lavDocs.some((d) => d.stato === "in_scadenza");

  const lastAccess = mockTimbrature
    .filter((t) => t.badge_id === badge.id)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0];

  // Banner status
  const isValid = badge.stato === "attivo" && !hasScaduto;
  const isWarning = badge.stato === "attivo" && docsWarning && !hasScaduto;
  const isInvalid = badge.stato !== "attivo" || hasScaduto;

  const bannerConfig = isInvalid
    ? { bg: "bg-red-50 border-red-200", text: "text-red-800", icon: <XCircle className="h-5 w-5 text-red-600" />, label: "Badge non valido" }
    : isWarning
    ? { bg: "bg-amber-50 border-amber-200", text: "text-amber-800", icon: <AlertTriangle className="h-5 w-5 text-amber-600" />, label: "Attenzione: documenti in scadenza" }
    : { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-800", icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />, label: "Badge valido e conforme" };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-5">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <HardHat className="h-6 w-6 text-primary" />
              <span className="font-heading font-bold text-primary">CANTIERE IN CLOUD</span>
            </div>
            <h1 className="font-heading font-bold text-2xl text-foreground">Verifica Badge</h1>
          </div>

          {/* Status banner */}
          <div className={`flex items-center gap-3 p-4 rounded-lg border ${bannerConfig.bg}`}>
            {bannerConfig.icon}
            <span className={`font-semibold text-sm ${bannerConfig.text}`}>{bannerConfig.label}</span>
          </div>

          {/* Worker info */}
          <div className="border border-border rounded-lg p-5 space-y-3">
            <div className="text-center">
              <p className="font-heading font-bold text-xl text-foreground">
                {lav ? `${lav.nome} ${lav.cognome}` : "—"}
              </p>
              <p className="text-sm text-muted-foreground">{lav?.mansione}</p>
              <p className="text-xs text-muted-foreground font-mono mt-1">CF: {badge.codice_fiscale_lavoratore}</p>
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

          {/* Legal validity */}
          <div className="border border-border rounded-lg p-5 space-y-3">
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-primary" />
              <p className="font-heading font-semibold text-sm text-foreground">Validità Legale</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">N° Progressivo</span>
                <span className="text-foreground font-medium">{badge.numero_progressivo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ente emittente</span>
                <span className="text-foreground font-medium text-right text-xs max-w-[200px]">{badge.ente_emittente}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rif. normativo</span>
                <span className="text-foreground font-medium">{badge.riferimento_normativo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Emissione</span>
                <span className="text-foreground">{new Date(badge.data_emissione).toLocaleDateString("it-IT")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ultima verifica doc.</span>
                <span className="text-foreground">{new Date(badge.data_verifica_documenti).toLocaleString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Firma digitale (SHA-256)</p>
                <p className="text-[10px] font-mono text-foreground bg-muted rounded p-2 break-all">{badge.firma_digitale_hash}</p>
              </div>
            </div>
          </div>

          {/* Verification timestamp */}
          <p className="text-xs text-muted-foreground text-center">
            Verifica effettuata il {new Date().toLocaleString("it-IT")}
          </p>

          {/* Legal disclaimer */}
          <div className="bg-muted rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">Conforme D.L. 159/2025</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Documento conforme al D.L. 159/2025 — Art. 4. La verifica è stata effettuata in tempo reale
              sul sistema Cantiere in Cloud. Il presente badge digitale ha validità legale ai sensi della
              normativa vigente in materia di sicurezza nei cantieri.
            </p>
          </div>
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
