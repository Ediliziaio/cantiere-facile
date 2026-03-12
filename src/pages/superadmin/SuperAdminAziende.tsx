import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, LogIn, Eye, Ban, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockTenantsAll } from "@/data/mock-superadmin";
import { TenantStatusBadge } from "@/components/layout/TenantStatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function SuperAdminAziende() {
  const [search, setSearch] = useState("");
  const { startImpersonation } = useAuth();
  const navigate = useNavigate();

  const filtered = mockTenantsAll.filter((t) =>
    t.nome_azienda.toLowerCase().includes(search.toLowerCase()) ||
    t.p_iva.includes(search)
  );

  const handleImpersonate = (t: typeof mockTenantsAll[0]) => {
    startImpersonation(t.id, t.nome_azienda);
    navigate("/app/dashboard");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading font-bold text-2xl text-foreground">Aziende</h1>
        <Button className="bg-superadmin hover:bg-superadmin/90" asChild>
          <Link to="/superadmin/aziende/nuova"><Plus className="h-4 w-4 mr-1.5" /> Nuova Azienda</Link>
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Cerca azienda..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Nome Azienda</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">P.IVA</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Piano</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Stato</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Cantieri</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Utenti</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Ultima attività</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((t) => (
              <tr key={t.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{t.nome_azienda}</td>
                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground font-mono text-xs">{t.p_iva}</td>
                <td className="px-4 py-3 uppercase text-xs text-muted-foreground">{t.piano}</td>
                <td className="px-4 py-3"><TenantStatusBadge stato={t.stato} /></td>
                <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{t.cantieri_count}</td>
                <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{t.utenti_count}</td>
                <td className="px-4 py-3 hidden md:table-cell text-xs text-muted-foreground">
                  {new Date(t.last_active).toLocaleDateString("it-IT")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/superadmin/aziende/${t.id}`}>
                        <Eye className="h-3.5 w-3.5 mr-1" /> Dettaglio
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-superadmin"
                      onClick={() => handleImpersonate(t)}
                    >
                      <LogIn className="h-3.5 w-3.5 mr-1" /> Entra come Admin →
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
