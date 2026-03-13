import { ArrowLeft, Building2, UserCog, Activity, Mail, BellRing } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const settingsNav = [
  { title: "Profilo Azienda", url: "/app/impostazioni/profilo", icon: Building2 },
  { title: "Utenti & Accessi", url: "/app/impostazioni/utenti", icon: UserCog, adminOnly: true },
  { title: "Log Attività", url: "/app/impostazioni/log", icon: Activity, adminOnly: true },
  { title: "Notifiche Email", url: "/app/impostazioni/notifiche", icon: Mail, adminOnly: true },
  { title: "Preferenze", url: "/app/impostazioni/preferenze", icon: BellRing },
];

export function SettingsSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const { role } = useAuth();
  const isAdmin = role === "admin" || role === "superadmin" || !role;

  const visibleItems = settingsNav.filter(item => !item.adminOnly || isAdmin);

  return (
    <Sidebar collapsible="icon" className="border-r border-border hidden md:flex">
      <div className={`px-3 py-3 border-b border-border ${collapsed ? "flex justify-center" : ""}`}>
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "sm"}
          onClick={() => navigate("/app/dashboard")}
          className="text-muted-foreground hover:text-foreground w-full justify-start gap-2"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="text-sm">Torna all'app</span>}
        </Button>
      </div>

      {!collapsed && (
        <div className="px-4 py-3 border-b border-border">
          <h2 className="font-heading font-bold text-sm text-foreground tracking-tight">Impostazioni</h2>
        </div>
      )}

      <SidebarContent>
        <SidebarGroup>
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
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
