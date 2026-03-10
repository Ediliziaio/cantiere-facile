import { Settings } from "lucide-react";
import { mockSuperAdmin } from "@/data/mock-superadmin";

export default function SuperAdminImpostazioni() {
  return (
    <div className="space-y-6 max-w-lg">
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5 text-superadmin" />
        <h1 className="font-heading font-bold text-2xl text-foreground">Impostazioni Piattaforma</h1>
      </div>

      <div className="border border-border rounded-lg p-4 space-y-3">
        <h2 className="font-heading font-semibold text-foreground">SuperAdmin</h2>
        <div className="grid gap-2 text-sm">
          <div className="flex justify-between py-1 border-b border-border">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium text-foreground">{mockSuperAdmin.email}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Nome</span>
            <span className="font-medium text-foreground">{mockSuperAdmin.nome}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
