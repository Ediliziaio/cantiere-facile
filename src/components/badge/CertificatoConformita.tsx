import { QRCodeSVG } from "qrcode.react";
import { Shield, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import logoLight from "@/assets/logo-light.png";
import type { Badge } from "@/data/mock-badges";
import { getBadgeLavoratore, getBadgeCantiere, calcolaStatoConformita } from "@/data/mock-badges";
import { mockTenant, mockSubappaltatori } from "@/data/mock-data";
import { forwardRef } from "react";

const checkIcon = (stato: string) => {
  if (stato === "ok") return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
  if (stato === "warning") return <AlertTriangle className="h-4 w-4 text-amber-600" />;
  return <XCircle className="h-4 w-4 text-red-600" />;
};

const checkLabel: Record<string, string> = {
  ok: "Conforme",
  warning: "In scadenza",
  bloccato: "Non conforme",
};

interface Props {
  badge: Badge;
}

export const CertificatoConformita = forwardRef<HTMLDivElement, Props>(({ badge }, ref) => {
  const lav = getBadgeLavoratore(badge);
  const cant = getBadgeCantiere(badge);
  const sub = lav?.subappaltatore_id
    ? mockSubappaltatori.find((s) => s.id === lav.subappaltatore_id)
    : null;
  const impresa = sub ? sub.ragione_sociale : mockTenant.nome_azienda;
  const piva = sub ? sub.p_iva : mockTenant.p_iva;
  const conformita = calcolaStatoConformita(badge);
  const verifyUrl = `https://app.cantiereincloud.it/verifica/${badge.codice_univoco}`;

  return (
    <div
      ref={ref}
      className="bg-white text-gray-900 p-8 w-[600px] font-sans"
      style={{ position: "absolute", left: "-9999px", top: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-gray-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <img src={logoLight} alt="Cantiere in Cloud" className="h-10" />
          <div>
            <p className="text-xs text-gray-500">Sistema Badge Digitale</p>
          </div>
        </div>
        <QRCodeSVG value={verifyUrl} size={80} bgColor="white" fgColor="black" level="M" />
      </div>

      <h2 className="text-center font-bold text-xl mb-1 text-gray-900">
        CERTIFICATO DI CONFORMITÀ LEGALE
      </h2>
      <p className="text-center text-sm text-gray-500 mb-6">
        ai sensi del D.L. 159/2025 — Art. 4
      </p>

      {/* Worker info */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm mb-6">
        <div><span className="text-gray-500">Lavoratore:</span> <strong>{lav ? `${lav.nome} ${lav.cognome}` : "—"}</strong></div>
        <div><span className="text-gray-500">Codice Fiscale:</span> <span className="font-mono text-xs">{badge.codice_fiscale_lavoratore}</span></div>
        <div><span className="text-gray-500">Mansione:</span> {lav?.mansione ?? "—"}</div>
        <div><span className="text-gray-500">Impresa:</span> {impresa}</div>
        <div><span className="text-gray-500">P.IVA:</span> {piva}</div>
        <div><span className="text-gray-500">Cantiere:</span> {cant ? `${cant.nome}, ${cant.comune}` : "—"}</div>
      </div>

      {/* Badge info */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm mb-6 border-t border-gray-200 pt-4">
        <div><span className="text-gray-500">N° Progressivo:</span> <strong>{badge.numero_progressivo}</strong></div>
        <div><span className="text-gray-500">Codice Badge:</span> {badge.codice_univoco}</div>
        <div><span className="text-gray-500">Data Emissione:</span> {new Date(badge.data_emissione).toLocaleDateString("it-IT")}</div>
        <div><span className="text-gray-500">Scadenza:</span> {new Date(badge.data_scadenza).toLocaleDateString("it-IT")}</div>
        <div><span className="text-gray-500">Ente Emittente:</span> <span className="text-xs">{badge.ente_emittente}</span></div>
        <div><span className="text-gray-500">Ultima Verifica:</span> {new Date(badge.data_verifica_documenti).toLocaleDateString("it-IT")}</div>
      </div>

      {/* Compliance checks */}
      <div className="border border-gray-200 rounded-lg p-4 mb-6">
        <p className="font-bold text-sm mb-3">Stato Conformità</p>
        {conformita.checks.map((c) => (
          <div key={c.label} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
            <span className="text-sm">{c.label}</span>
            <div className="flex items-center gap-2 text-xs">
              {checkIcon(c.stato)}
              <span>{checkLabel[c.stato] ?? c.stato}</span>
              {c.scadenza && <span className="text-gray-400">scad. {new Date(c.scadenza).toLocaleDateString("it-IT")}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Signature hash */}
      <div className="mb-6">
        <p className="text-xs text-gray-500 mb-1">Firma digitale (SHA-256)</p>
        <p className="text-[10px] font-mono bg-gray-100 rounded p-2 break-all">{badge.firma_digitale_hash}</p>
      </div>

      {/* Disclaimer */}
      <div className="border-t-2 border-gray-800 pt-4 text-center">
        <div className="flex items-center justify-center gap-1.5 mb-2">
          <Shield className="h-4 w-4 text-orange-600" />
          <span className="text-xs font-bold">Conforme D.L. 159/2025</span>
        </div>
        <p className="text-[10px] text-gray-500 leading-relaxed max-w-md mx-auto">
          Documento conforme al D.L. 159/2025 — Art. 4. Certificato generato automaticamente dal sistema
          Cantiere in Cloud. Il presente documento ha validità legale ai sensi della normativa vigente in
          materia di sicurezza nei cantieri.
        </p>
        <p className="text-[9px] text-gray-400 mt-2">
          Generato il {new Date().toLocaleString("it-IT")}
        </p>
      </div>
    </div>
  );
});

CertificatoConformita.displayName = "CertificatoConformita";
