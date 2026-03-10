import { Bell, HelpCircle, User } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { mockTenant, mockNotifiche } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function TopBar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const unread = mockNotifiche.filter((n) => !n.letto).length;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="h-14 flex items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground hidden md:flex" />
        <span className="text-sm font-medium text-foreground hidden sm:inline">
          {mockTenant.nome_azienda}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                  {unread}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            {mockNotifiche.map((n) => (
              <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-1 py-2">
                <span className={`text-sm ${n.letto ? "text-muted-foreground" : "text-foreground font-medium"}`}>
                  {n.testo}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {new Date(n.created_at).toLocaleDateString("it-IT")}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

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
