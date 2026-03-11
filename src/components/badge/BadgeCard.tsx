import { QRCodeSVG } from "qrcode.react";
import { HardHat, User, Shield } from "lucide-react";
import type { Badge } from "@/data/mock-badges";
import { getBadgeLavoratore, getBadgeCantiere, calcolaStatoConformita } from "@/data/mock-badges";
import { mockTenant, mockSubappaltatori } from "@/data/mock-data";
import { BadgeStatusChip } from "./BadgeStatusChip";
interface BadgeCardProps {
  badge: Badge;
  compact?: boolean;
}

export function BadgeCard({ badge, compact }: BadgeCardProps) {
  const lavoratore = getBadgeLavoratore(badge);
  const cantiere = getBadgeCantiere(badge);
  const sub = lavoratore?.subappaltatore_id
    ? mockSubappaltatori.find((s) => s.id === lavoratore.subappaltatore_id)
    : null;
  const impresa = sub ? sub.ragione_sociale : mockTenant.nome_azienda;
  const piva = sub ? sub.p_iva : mockTenant.p_iva;
  const conformita = calcolaStatoConformita(badge);
  const conformitaColor = conformita.esito_finale === "verde" ? "bg-emerald-500" : conformita.esito_finale === "giallo" ? "bg-amber-500" : "bg-red-500";
  const verifyUrl = `https://app.cantiereincloud.it/verifica/${badge.codice_univoco}`;

  return (
    <div
      className={`bg-[hsl(var(--badge-bg,20_14%_11%))] text-white rounded-xl overflow-hidden relative ${
        compact ? "max-w-sm" : "max-w-lg"
      }`}
    >
      {/* Conformità indicator */}
      <div className={`absolute top-3 right-3 h-2.5 w-2.5 rounded-full ${conformitaColor} ring-2 ring-white/20`} title={`Conformità: ${conformita.esito_finale}`} />
    >
      <div className="p-4 h-full flex flex-col justify-between gap-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardHat className="h-5 w-5 text-primary" />
            <span className="font-heading font-bold text-xs tracking-tight text-primary">
              CANTIERE IN CLOUD
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-white/50 font-mono">N° {badge.numero_progressivo}</span>
            <QRCodeSVG
              value={verifyUrl}
              size={compact ? 56 : 72}
              bgColor="transparent"
              fgColor="white"
              level="M"
            />
          </div>
        </div>

        {/* Body */}
        <div className="flex gap-3 flex-1 items-center">
          <div className="w-14 h-[72px] bg-white/10 rounded flex items-center justify-center shrink-0">
            <User className="h-8 w-8 text-white/40" />
          </div>
          <div className="min-w-0 space-y-0.5">
            <p className="font-heading font-bold text-base leading-tight truncate">
              {lavoratore ? `${lavoratore.nome} ${lavoratore.cognome}` : "—"}
            </p>
            <p className="text-[10px] text-white/50 font-mono tracking-wide">
              CF: {badge.codice_fiscale_lavoratore}
            </p>
            <p className="text-[11px] text-white/70">
              Mansione: {lavoratore?.mansione ?? "—"}
            </p>
            <p className="text-[11px] text-white/70 truncate">
              Impresa: {impresa}
            </p>
            <p className="text-[11px] text-white/50">P.IVA: {piva}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-end justify-between text-[10px]">
          <div className="space-y-0.5 text-white/60">
            <p>Cantiere: {cantiere ? `${cantiere.indirizzo}, ${cantiere.comune}` : "—"}</p>
            <p>Badge ID: {badge.codice_univoco}</p>
            <p>Emesso: {new Date(badge.data_emissione).toLocaleDateString("it-IT")}</p>
            <p>
              Valido fino:{" "}
              {new Date(badge.data_scadenza).toLocaleDateString("it-IT")}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <BadgeStatusChip stato={badge.stato} />
            <div className="flex items-center gap-1 text-emerald-400">
              <Shield className="h-3 w-3" />
              <span className="text-[8px] font-medium">D.L. 159/2025</span>
            </div>
            <span className="text-[7px] text-white/40 font-mono">{badge.firma_digitale_hash.slice(0, 12)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
