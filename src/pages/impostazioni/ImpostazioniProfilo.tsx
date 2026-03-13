import { Building2 } from "lucide-react";
import { mockTenant } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const profileFields = [
  ["Ragione Sociale", mockTenant.nome_azienda],
  ["Partita IVA", mockTenant.p_iva],
  ["Responsabile Legale", mockTenant.responsabile_legale],
  ["Indirizzo Sede Legale", mockTenant.indirizzo_sede_legale],
  ["Telefono", mockTenant.telefono],
  ["Email Admin", mockTenant.email_admin],
  ["PEC", mockTenant.pec],
  ["Codice SDI", mockTenant.codice_sdi],
  ["Codice ATECO", mockTenant.codice_ateco],
  ["CCNL Applicato", mockTenant.ccnl],
  ["Piano", mockTenant.piano.toUpperCase()],
  ["Data Iscrizione", new Date(mockTenant.data_iscrizione).toLocaleDateString("it-IT")],
];

export default function ImpostazioniProfilo() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Building2 className="h-5 w-5 text-primary" />
        <h1 className="font-heading font-bold text-xl text-foreground">Profilo Azienda</h1>
      </div>

      <div className="border border-border rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-semibold text-lg text-foreground">Dati Azienda</h2>
          <Button variant="outline" size="sm" onClick={() => toast.info("Modifica profilo (mock)")}>Modifica</Button>
        </div>
        <div className="grid gap-0.5">
          {profileFields.map(([label, value]) => (
            <div key={label} className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-border last:border-0 gap-0.5">
              <span className="text-sm text-muted-foreground">{label}</span>
              <span className="text-sm font-medium text-foreground sm:text-right">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="border border-border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-primary">{mockTenant.cantieri_attivi}</p>
          <p className="text-xs text-muted-foreground mt-1">Cantieri Attivi</p>
        </div>
        <div className="border border-border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-primary">{mockTenant.lavoratori_totali}</p>
          <p className="text-xs text-muted-foreground mt-1">Lavoratori Totali</p>
        </div>
      </div>
    </div>
  );
}
