import { Bell, HelpCircle, User, HardHat, Mail, AlertTriangle } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { mockTenant, mockNotifiche, mockNotificheEmail } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";

export function TopBar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const unreadSystem = mockNotifiche.filter((n) => !n.letto).length;
  const unreadEmail = mockNotificheEmail.filter((n) => !n.letto).length;
  const totalUnread = unreadSystem + unreadEmail;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="h-14 flex items-center justify-between border-b border-border bg-card px-4 safe-area-top">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground hidden md:flex" />
        {/* Mobile: logo + app name */}
        <div className="flex items-center gap-2 md:hidden">
          <HardHat className="h-5 w-5 text-primary" />
          <span className="text-sm font-bold text-foreground tracking-tight">Cantiere in Cloud</span>
        </div>
        {/* Desktop: tenant name */}
        <span className="text-sm font-medium text-foreground hidden md:inline">
          {mockTenant.nome_azienda}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {totalUnread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                  {totalUnread}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
            {/* System notifications */}
            {mockNotifiche.map((n) => (
              <DropdownMenuItem key={n.id} className="flex items-start gap-2 py-2">
                <Bell className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground" />
                <div className="flex flex-col gap-0.5">
                  <span className={`text-sm ${n.letto ? "text-muted-foreground" : "text-foreground font-medium"}`}>
                    {n.testo}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {new Date(n.created_at).toLocaleDateString("it-IT")}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}

            {/* Separator if both exist */}
            {mockNotificheEmail.filter(n => n.stato_invio === "inviata" && !n.letto).length > 0 && (
              <>
                <Separator className="my-1" />
                <div className="px-2 py-1.5">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Notifiche Email Scadenze</span>
                </div>
              </>
            )}

            {/* Email notifications (only sent & unread) */}
            {mockNotificheEmail
              .filter(n => n.stato_invio === "inviata" && !n.letto)
              .map((n) => (
                <DropdownMenuItem key={n.id} className="flex items-start gap-2 py-2">
                  <div className="h-5 w-5 rounded flex items-center justify-center shrink-0 mt-0.5 bg-orange-500/10">
                    {n.giorni_rimanenti <= 0 ? (
                      <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                    ) : (
                      <Mail className="h-3.5 w-3.5 text-orange-600" />
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-foreground">
                      {n.categoria}: {n.documento_nome.replace(/_/g, " ").replace(".pdf", "")}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {n.giorni_rimanenti <= 0
                        ? `Scaduto da ${Math.abs(n.giorni_rimanenti)} giorni`
                        : `Scade tra ${n.giorni_rimanenti} giorni`
                      } · {new Date(n.data_invio).toLocaleDateString("it-IT")}
                    </span>
                  </div>
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
