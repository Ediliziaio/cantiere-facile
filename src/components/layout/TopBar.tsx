import { HelpCircle, User, Check, ArrowLeft } from "lucide-react";
import logoLight from "@/assets/logo-light.png";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { mockTenant } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAuth, type UserRole } from "@/contexts/AuthContext";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { EmergencyBroadcastModal } from "@/components/notifications/EmergencyBroadcastModal";

const impersonationRoles: { role: UserRole; label: string }[] = [
  { role: "admin", label: "Come Admin" },
  { role: "manager", label: "Come Manager" },
  { role: "utente", label: "Come Utente" },
];

export function TopBar() {
  const navigate = useNavigate();
  const { logout, effectiveRole, impersonation, startImpersonation, stopImpersonation } = useAuth();
  const isAdmin = effectiveRole === "admin" || effectiveRole === "superadmin" || !effectiveRole;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleExitImpersonation = () => {
    stopImpersonation();
    navigate("/superadmin/aziende");
  };

  const handleSwitchRole = (role: UserRole) => {
    if (impersonation.tenantId && impersonation.tenantName) {
      startImpersonation(impersonation.tenantId, impersonation.tenantName, role);
    }
  };

  return (
    <header className="h-14 flex items-center justify-between border-b border-border bg-card px-4 safe-area-top">
      <div className="flex items-center gap-3">
        <div className="flex items-center md:hidden">
          <img src={logoLight} alt="Cantiere in Cloud" className="h-8" />
        </div>
        <span className="text-sm font-medium text-foreground hidden md:inline">
          {mockTenant.nome_azienda}
        </span>
      </div>

      <div className="flex items-center gap-1">
        {isAdmin && <EmergencyBroadcastModal />}
        
        <NotificationCenter />

        <Button variant="ghost" size="icon">
          <HelpCircle className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {impersonation.isImpersonating ? (
              <>
                <DropdownMenuLabel className="font-normal">
                  <div className="text-xs text-muted-foreground">Impersonando</div>
                  <div className="font-semibold text-sm truncate">{impersonation.tenantName}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {impersonationRoles.map(({ role, label }) => (
                  <DropdownMenuItem
                    key={role}
                    onClick={() => handleSwitchRole(role)}
                    className="flex items-center justify-between"
                  >
                    {label}
                    {impersonation.impersonatedRole === role && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleExitImpersonation}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Torna al SuperAdmin
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem onClick={() => navigate("/app/impostazioni")}>Impostazioni</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>Esci</DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
