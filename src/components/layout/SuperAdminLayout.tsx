import { Suspense, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SuperAdminSidebar } from "./SuperAdminSidebar";
import { SuperAdminMobileBottomNav } from "./SuperAdminMobileBottomNav";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, LogOut } from "lucide-react";
import logoLight from "@/assets/logo-light.png";
import { roleLabels } from "@/data/mock-security";
import { useSessionTimeout } from "@/hooks/useSessionTimeout";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function PageFallback() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
    </div>
  );
}

export function SuperAdminLayout() {
  const { user, superadminRole, logout, login, role } = useAuth();
  const navigate = useNavigate();

  // Auto-login con utente mock superadmin se non autenticato
  useEffect(() => {
    if (!user || role !== "superadmin") {
      login(
        { id: "sa1", email: "admin@cantiereincloud.it", nome: "Marco", cognome: "Ferretti" },
        "superadmin",
        null,
        null,
        "superadmin"
      );
    }
  }, [user, role, login]);

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
          <header className="h-14 flex items-center justify-between border-b border-border bg-card px-4 safe-area-top">
            <div className="flex items-center gap-3">
              
              <div className="flex items-center gap-2 md:hidden">
                <HardHat className="h-5 w-5 text-primary" />
                <span className="text-sm font-bold text-foreground tracking-tight">Cantiere in Cloud</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">Piattaforma Admin</span>
                {superadminRole && (
                  <Badge variant="outline" className="text-[10px]">
                    {roleLabels[superadminRole]}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-xs text-muted-foreground border-b border-border mb-1">
                    {user?.email}
                    {superadminRole && (
                      <span className="block text-[10px] mt-0.5">{roleLabels[superadminRole]}</span>
                    )}
                  </div>
                  <DropdownMenuItem onClick={() => navigate("/superadmin/impostazioni")}>Impostazioni</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-3.5 w-3.5 mr-1.5" /> Esci
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto pb-20 md:pb-6 safe-area-left safe-area-right">
            <Suspense fallback={<PageFallback />}>
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>
      <SuperAdminMobileBottomNav />

      <AlertDialog open={showWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sessione in scadenza</AlertDialogTitle>
            <AlertDialogDescription>
              La tua sessione scadrà tra 2 minuti per inattività. Clicca per continuare a lavorare.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={extendSession}>
              Continua sessione
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}
