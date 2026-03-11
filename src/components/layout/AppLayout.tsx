import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";
import { ImpersonationBanner } from "./ImpersonationBanner";
import { MobileBottomNav } from "./MobileBottomNav";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function AppLayout() {
  const { impersonation } = useAuth();

  return (
    <SidebarProvider>
      {impersonation.isImpersonating && <ImpersonationBanner />}
      <div className={`min-h-screen flex w-full ${impersonation.isImpersonating ? "pt-10" : ""}`}>
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <main className="flex-1 p-4 md:p-6 overflow-auto pb-20 md:pb-6 safe-area-left safe-area-right">
            <Outlet />
          </main>
        </div>
      </div>
      <MobileBottomNav />
    </SidebarProvider>
  );
}
