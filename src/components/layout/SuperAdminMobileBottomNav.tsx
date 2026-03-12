import { LayoutDashboard, Building2, Headphones, Menu } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ScrollText, BarChart3, Receipt, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const tabs = [
  { title: "Dashboard", url: "/superadmin/dashboard", icon: LayoutDashboard },
  { title: "Aziende", url: "/superadmin/aziende", icon: Building2 },
  { title: "Supporto", url: "/superadmin/supporto", icon: Headphones },
];

const menuItems = [
  { label: "Monitoraggio", items: [
    { title: "Log Audit", url: "/superadmin/audit-log", icon: ScrollText, permission: "audit.view" },
    { title: "Analytics", url: "/superadmin/analytics", icon: BarChart3, permission: "analytics.view" },
  ]},
  { label: "Gestione", items: [
    { title: "Billing", url: "/superadmin/billing", icon: Receipt, permission: "billing.view" },
    { title: "Impostazioni", url: "/superadmin/impostazioni", icon: Settings, permission: "settings.view" },
  ]},
];

export function SuperAdminMobileBottomNav() {
  const [open, setOpen] = useState(false);
  const { hasPermission } = useAuth();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-border bg-card safe-area-bottom touch-manipulation">
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => (
          <NavLink
            key={tab.url}
            to={tab.url}
            className="flex flex-col items-center gap-0.5 text-muted-foreground py-1 px-2 min-w-0"
            activeClassName="text-primary"
          >
            <tab.icon className="h-5 w-5" />
            <span className="text-[10px] truncate">{tab.title}</span>
          </NavLink>
        ))}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="flex flex-col items-center gap-0.5 text-muted-foreground py-1 px-2">
            <Menu className="h-5 w-5" />
            <span className="text-[10px]">Menu</span>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[75vh] overflow-y-auto rounded-t-2xl">
            <SheetTitle className="sr-only">Menu di navigazione</SheetTitle>
            <div className="space-y-5 py-4">
              {menuItems.map((group) => {
                const visibleItems = group.items.filter(item => hasPermission(item.permission));
                if (visibleItems.length === 0) return null;
                return (
                  <div key={group.label}>
                    <h3 className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-1 mb-2">
                      {group.label}
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {visibleItems.map((item) => (
                        <Link
                          key={item.url}
                          to={item.url}
                          onClick={() => setOpen(false)}
                          className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground transition-colors active:scale-95"
                        >
                          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                            <item.icon className="h-5 w-5" />
                          </div>
                          <span className="text-xs text-center leading-tight">{item.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
