import { HelpCircle, User, HardHat } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { mockTenant } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { EmergencyBroadcastModal } from "@/components/notifications/EmergencyBroadcastModal";

export function TopBar() {
  const navigate = useNavigate();
  const { logout, role } = useAuth();
  const isAdmin = role === "admin" || role === "superadmin" || !role;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="h-14 flex items-center justify-between border-b border-border bg-card px-4 safe-area-top">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground hidden md:flex" />
        <div className="flex items-center gap-2 md:hidden">
          <HardHat className="h-5 w-5 text-primary" />
          <span className="text-sm font-bold text-foreground tracking-tight">Cantiere in Cloud</span>
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
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate("/app/impostazioni")}>Impostazioni</DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Esci</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
