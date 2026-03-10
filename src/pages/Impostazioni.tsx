import { Settings } from "lucide-react";
import { mockTenant } from "@/data/mock-data";

export default function Impostazioni() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5 text-primary" />
        <h1 className="font-heading font-bold text-2xl text-foreground">Impostazioni</h1>
      </div>

      <div className="border border-border rounded-lg p-4 space-y-3">
        <h2 className="font-heading font-semibold text-foreground">Profilo Azienda</h2>
        <div className="grid gap-2 text-sm">
          <div className="flex justify-between py-1 border-b border-border">
            <span className="text-muted-foreground">Ragione Sociale</span>
            <span className="font-medium text-foreground">{mockTenant.nome_azienda}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-border">
            <span className="text-muted-foreground">Partita IVA</span>
            <span className="font-medium text-foreground">{mockTenant.p_iva}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-border">
            <span className="text-muted-foreground">Email Admin</span>
            <span className="font-medium text-foreground">{mockTenant.email_admin}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Piano</span>
            <span className="font-medium text-foreground uppercase">{mockTenant.piano}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
