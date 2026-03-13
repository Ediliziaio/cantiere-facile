import { Suspense } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SettingsSidebar } from "./SettingsSidebar";
import { TopBar } from "./TopBar";
import { ImpersonationBanner } from "./ImpersonationBanner";
import { OfflineBanner } from "@/components/pwa/OfflineBanner";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Building2, UserCog, Activity, Mail, BellRing } from "lucide-react";
import { NavLink } from "@/components/NavLink";

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

const mobileSettingsNav = [
  { title: "Profilo", url: "/app/impostazioni/profilo", icon: Building2 },
  { title: "Utenti", url: "/app/impostazioni/utenti", icon: UserCog, adminOnly: true },
  { title: "Log", url: "/app/impostazioni/log", icon: Activity, adminOnly: true },
  { title: "Notifiche", url: "/app/impostazioni/notifiche", icon: Mail, adminOnly: true },
  { title: "Preferenze", url: "/app/impostazioni/preferenze", icon: BellRing },
];

export function SettingsLayout() {
  const { impersonation, role } = useAuth();
  const navigate = useNavigate();
  const isAdmin = role === "admin" || role === "superadmin" || !role;
  const visibleItems = mobileSettingsNav.filter(item => !item.adminOnly || isAdmin);

  return (
    <SidebarProvider>
      <OfflineBanner />
      {impersonation.isImpersonating && <ImpersonationBanner />}
      <div className={`min-h-screen flex w-full ${impersonation.isImpersonating ? "pt-10" : ""}`}>
        <SettingsSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          {/* Mobile: back button + horizontal nav */}
          <div className="md:hidden border-b border-border">
            <div className="px-4 py-2 flex items-center gap-2">
              <button onClick={() => navigate("/app/dashboard")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span>Torna all'app</span>
              </button>
              <span className="text-muted-foreground/40">·</span>
              <span className="text-sm font-semibold text-foreground">Impostazioni</span>
            </div>
            <div className="flex gap-1 overflow-x-auto px-4 pb-2 scrollbar-hide">
              {visibleItems.map(item => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.url}
                    to={item.url}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                    activeClassName="!bg-primary !text-primary-foreground"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.title}
                  </NavLink>
                );
              })}
            </div>
          </div>
          <main className="flex-1 p-4 md:p-6 overflow-auto pb-20 md:pb-6 safe-area-left safe-area-right">
            <Suspense fallback={<PageFallback />}>
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
