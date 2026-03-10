import {
  LayoutDashboard, Building2, FileText, HardHat, Building, Truck,
  ShieldCheck, CalendarClock, MessageSquare, Settings, IdCard, ScanLine, Clock
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Cantieri", url: "/cantieri", icon: Building2 },
  { title: "Documenti", url: "/documenti", icon: FileText },
  { title: "Lavoratori", url: "/lavoratori", icon: HardHat },
  { title: "Subappaltatori", url: "/subappaltatori", icon: Building },
  { title: "Mezzi", url: "/mezzi", icon: Truck },
  { title: "Accessi", url: "/accessi", icon: ShieldCheck },
  { title: "Badge Digitali", url: "/badge", icon: IdCard },
  { title: "Timbrature", url: "/timbrature", icon: Clock },
  { title: "Scansiona", url: "/scan", icon: ScanLine },
  { title: "Scadenze", url: "/scadenze", icon: CalendarClock },
  { title: "Comunicazioni", url: "/comunicazioni", icon: MessageSquare },
  { title: "Impostazioni", url: "/impostazioni", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <div className={`flex items-center gap-2 px-4 py-4 border-b border-border ${collapsed ? "justify-center" : ""}`}>
        <HardHat className="h-6 w-6 text-primary shrink-0" />
        {!collapsed && (
          <span className="font-heading font-bold text-sm text-foreground tracking-tight">
            Cantiere in Cloud
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
