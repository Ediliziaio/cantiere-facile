import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import type { EsitoFinale } from "@/data/mock-badges";

interface AccessoResultCardProps {
  esito: EsitoFinale;
  lavoratoreNome: string;
  cantiere: string;
  dettaglio?: string;
}

const esitoConfig: Record<EsitoFinale, {
  icon: typeof CheckCircle2;
  label: string;
  bg: string;
  border: string;
  text: string;
}> = {
  verde: {
    icon: CheckCircle2,
    label: "Accesso Autorizzato",
    bg: "bg-emerald-50",
    border: "border-emerald-300",
    text: "text-emerald-800",
  },
  giallo: {
    icon: AlertTriangle,
    label: "Accesso con Avviso",
    bg: "bg-amber-50",
    border: "border-amber-300",
    text: "text-amber-800",
  },
  rosso: {
    icon: XCircle,
    label: "Accesso Bloccato",
    bg: "bg-red-50",
    border: "border-red-300",
    text: "text-red-800",
  },
};

export function AccessoResultCard({ esito, lavoratoreNome, cantiere, dettaglio }: AccessoResultCardProps) {
  const c = esitoConfig[esito];
  const Icon = c.icon;

  return (
    <div className={`${c.bg} ${c.border} border-2 rounded-xl p-6 text-center animate-in fade-in zoom-in-95 duration-300`}>
      <Icon className={`h-16 w-16 mx-auto mb-3 ${c.text}`} />
      <p className={`font-heading font-bold text-xl ${c.text}`}>{c.label}</p>
      <p className="font-medium text-foreground mt-2 text-lg">{lavoratoreNome}</p>
      <p className="text-sm text-muted-foreground">{cantiere}</p>
      {dettaglio && (
        <p className={`text-sm mt-3 ${c.text} font-medium`}>{dettaglio}</p>
      )}
      <p className="text-xs text-muted-foreground mt-4">
        {new Date().toLocaleString("it-IT")}
      </p>
    </div>
  );
}
