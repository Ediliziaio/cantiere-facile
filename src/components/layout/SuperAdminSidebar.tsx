import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard, Building2, Settings, ScrollText, Receipt, BarChart3, Headphones, ChevronDown
} from "lucide-react";
import logoLight from "@/assets/logo-light.png";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { useAuth } from "@/contexts/AuthContext";

const navGroups = [
  {
    label: "Generale",
    items: [
      { title: "Dashboard", url: "/superadmin/dashboard", icon: LayoutDashboard, permission: "tenants.view" },
      { title: "Aziende", url: "/superadmin/aziende", icon: Building2, permission: "tenants.view" },
    ],
  },
  {
    label: "Monitoraggio",
    items: [
      { title: "Log Audit", url: "/superadmin/audit-log", icon: ScrollText, permission: "audit.view" },
      { title: "Analytics", url: "/superadmin/analytics", icon: BarChart3, permission: "analytics.view" },
    ],
  },
  {
    label: "Gestione",
    items: [
      { title: "Billing", url: "/superadmin/billing", icon: Receipt, permission: "billing.view" },
      { title: "Supporto", url: "/superadmin/supporto", icon: Headphones, permission: "tickets.view" },
      { title: "Impostazioni", url: "/superadmin/impostazioni", icon: Settings, permission: "settings.view" },
    ],
  },
];

export function SuperAdminSidebar() {
  const { state } = useSidebar();
  const { hasPermission } = useAuth();
  const collapsed = state === "collapsed";
  const location = useLocation();

  const activeGroupLabel = useMemo(() => {
    for (const group of navGroups) {
      if (group.items.some(item => location.pathname.startsWith(item.url))) {
        return group.label;
      }
    }
    return navGroups[0].label;
  }, [location.pathname]);

  const [openGroups, setOpenGroups] = useState<Set<string>>(() => new Set([activeGroupLabel]));

  const toggleGroup = (label: string) => {
    setOpenGroups(prev => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  return (
    <Sidebar collapsible="none" className="border-r border-border hidden md:flex">
      <div className={`flex items-center gap-2 px-4 py-4 border-b border-border ${collapsed ? "justify-center" : ""}`}>
        <HardHat className="h-6 w-6 text-primary shrink-0" />
        {!collapsed && (
          <span className="font-heading font-bold text-sm text-foreground tracking-tight">
            Cantiere in Cloud
          </span>
        )}
      </div>
      <SidebarContent>
        {navGroups.map((group) => {
          const visibleItems = group.items.filter((item) => hasPermission(item.permission));
          if (visibleItems.length === 0) return null;
          const isOpen = openGroups.has(group.label);

          return (
            <Collapsible key={group.label} open={isOpen} onOpenChange={() => toggleGroup(group.label)}>
              <SidebarGroup>
                {!collapsed && (
                  <CollapsibleTrigger asChild>
                    <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-3 pt-3 pb-1 cursor-pointer hover:text-foreground transition-colors flex items-center justify-between w-full">
                      <span>{group.label}</span>
                      <ChevronDown className={`h-3 w-3 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-0" : "-rotate-90"}`} />
                    </SidebarGroupLabel>
                  </CollapsibleTrigger>
                )}
                <CollapsibleContent className="sidebar-collapsible-content">
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {visibleItems.map((item) => (
                        <SidebarMenuItem key={item.url}>
                          <SidebarMenuButton asChild>
                            <NavLink
                              to={item.url}
                              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                              activeClassName="bg-primary/10 text-primary font-medium"
                            >
                              <item.icon className="h-4 w-4 shrink-0" />
                              {!collapsed && <span>{item.title}</span>}
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}
