import { LayoutDashboard, Building2, Settings, Shield, ScrollText, Receipt, BarChart3, Headphones } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";

const allNavItems = [
  { title: "Dashboard", url: "/superadmin/dashboard", icon: LayoutDashboard, permission: "tenants.view" },
  { title: "Aziende", url: "/superadmin/aziende", icon: Building2, permission: "tenants.view" },
  { title: "Log Audit", url: "/superadmin/audit-log", icon: ScrollText, permission: "audit.view" },
  { title: "Billing", url: "/superadmin/billing", icon: Receipt, permission: "billing.view" },
  { title: "Analytics", url: "/superadmin/analytics", icon: BarChart3, permission: "analytics.view" },
  { title: "Supporto", url: "/superadmin/supporto", icon: Headphones, permission: "tickets.view" },
  { title: "Impostazioni", url: "/superadmin/impostazioni", icon: Settings, permission: "settings.view" },
];

export function SuperAdminSidebar() {
  const { state } = useSidebar();
  const { hasPermission } = useAuth();
  const collapsed = state === "collapsed";

  const navItems = allNavItems.filter((item) => hasPermission(item.permission));

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <div className={`flex items-center gap-2 px-4 py-4 border-b border-border ${collapsed ? "justify-center" : ""}`}>
        <Shield className="h-6 w-6 text-superadmin shrink-0" />
        {!collapsed && (
          <span className="font-heading font-bold text-sm text-foreground tracking-tight">
            SuperAdmin
          </span>
        )}
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                      activeClassName="bg-superadmin/10 text-superadmin font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
