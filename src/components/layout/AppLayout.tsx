import { Suspense } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";
import { ImpersonationBanner } from "./ImpersonationBanner";
import { MobileBottomNav } from "./MobileBottomNav";
import { OfflineBanner } from "@/components/pwa/OfflineBanner";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

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

export function AppLayout() {
  const { impersonation } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <OfflineBanner />
          {impersonation.isImpersonating && <ImpersonationBanner />}
          <TopBar />
          <main className="flex-1 p-4 md:p-6 overflow-auto pb-20 md:pb-6 safe-area-left safe-area-right">
            <Suspense fallback={<PageFallback />}>
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>
      <MobileBottomNav />
    </SidebarProvider>
  );
}
