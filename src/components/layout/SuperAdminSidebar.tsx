import { LayoutDashboard, Building2, Settings, Shield } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/superadmin/dashboard", icon: LayoutDashboard },
  { title: "Aziende", url: "/superadmin/aziende", icon: Building2 },
  { title: "Impostazioni", url: "/superadmin/impostazioni", icon: Settings },
];

export function SuperAdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

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
