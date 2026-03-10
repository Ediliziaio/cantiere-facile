import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockTenantsAll } from "@/data/mock-superadmin";
import { TenantStatusBadge } from "@/components/layout/TenantStatusBadge";
import { useAuth } from "@/contexts/AuthContext";

export default function SuperAdminAziendaDetail() {
  const { id } = useParams<{ id: string }>();
  const tenant = mockTenantsAll.find((t) => t.id === id);
  const { startImpersonation } = useAuth();
  const navigate = useNavigate();

  if (!tenant) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Azienda non trovata.</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link to="/superadmin/aziende">Torna alla lista</Link>
        </Button>
      </div>
    );
  }

  const handleImpersonate = () => {
    startImpersonation(tenant.id, tenant.nome_azienda);
    navigate("/app/dashboard");
  };

  const rows = [
    { label: "Ragione Sociale", value: tenant.nome_azienda },
    { label: "P.IVA", value: tenant.p_iva },
    { label: "Email Admin", value: tenant.email_admin },
    { label: "Piano", value: tenant.piano.toUpperCase() },
    { label: "Cantieri", value: tenant.cantieri_count },
    { label: "Utenti", value: tenant.utenti_count },
    { label: "Data creazione", value: new Date(tenant.created_at).toLocaleDateString("it-IT") },
    { label: "Ultima attività", value: new Date(tenant.last_active).toLocaleString("it-IT") },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/superadmin/aziende"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <h1 className="font-heading font-bold text-2xl text-foreground">{tenant.nome_azienda}</h1>
        <TenantStatusBadge stato={tenant.stato} />
      </div>

      <div className="border border-border rounded-lg p-4 space-y-2">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between py-1.5 border-b border-border last:border-0 text-sm">
            <span className="text-muted-foreground">{r.label}</span>
            <span className="font-medium text-foreground">{r.value}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button className="bg-superadmin hover:bg-superadmin/90" onClick={handleImpersonate}>
          <LogIn className="h-4 w-4 mr-2" /> Entra come Admin →
        </Button>
        {tenant.stato === "attivo" && (
          <Button variant="outline">Sospendi azienda</Button>
        )}
        {tenant.stato === "sospeso" && (
          <Button variant="outline">Riattiva azienda</Button>
        )}
      </div>
    </div>
  );
}
