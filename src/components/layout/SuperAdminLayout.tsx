import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SuperAdminSidebar } from "./SuperAdminSidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut } from "lucide-react";
import { roleLabels } from "@/data/mock-security";
import { useSessionTimeout } from "@/hooks/useSessionTimeout";
import {
  AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function SuperAdminLayout() {
  const { user, superadminRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/superadmin/login");
  };

  const { showWarning, extendSession } = useSessionTimeout({
    timeoutMs: 15 * 60 * 1000,
    warningMs: 2 * 60 * 1000,
    onTimeout: handleLogout,
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <SuperAdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border bg-card px-4">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <span className="text-xs font-medium text-superadmin uppercase tracking-wider">Piattaforma Admin</span>
            </div>
            <div className="flex items-center gap-2">
              {superadminRole && (
                <Badge variant="outline" className="text-[10px] border-superadmin/30 text-superadmin">
                  {roleLabels[superadminRole]}
                </Badge>
              )}
              <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>

      <AlertDialog open={showWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sessione in scadenza</AlertDialogTitle>
            <AlertDialogDescription>
              La tua sessione scadrà tra 2 minuti per inattività. Clicca per continuare a lavorare.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={extendSession} className="bg-superadmin hover:bg-superadmin/90">
              Continua sessione
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}
