import {
  LayoutDashboard, Building2, FileText, HardHat, Building, Truck,
  ShieldCheck, CalendarClock, MessageSquare, Settings, IdCard, Clock
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { mockThreads } from "@/data/mock-comunicazioni";

const unreadCount = mockThreads.reduce((s, t) => s + t.non_letti, 0);

const navGroups = [
  {
    label: "Generale",
    items: [
      { title: "Dashboard", url: "/app/dashboard", icon: LayoutDashboard },
      { title: "Comunicazioni", url: "/app/comunicazioni", icon: MessageSquare, badge: unreadCount },
      { title: "Scadenze", url: "/app/scadenze", icon: CalendarClock },
    ],
  },
  {
    label: "Cantiere",
    items: [
      { title: "Cantieri", url: "/app/cantieri", icon: Building2 },
      { title: "Documenti", url: "/app/documenti", icon: FileText },
      { title: "Lavoratori", url: "/app/lavoratori", icon: HardHat },
      { title: "Subappaltatori", url: "/app/subappaltatori", icon: Building },
      { title: "Mezzi", url: "/app/mezzi", icon: Truck },
    ],
  },
  {
    label: "Presenze",
    items: [
      { title: "Accessi", url: "/app/accessi", icon: ShieldCheck },
      { title: "Badge Digitali", url: "/app/badge", icon: IdCard },
      { title: "Timbrature", url: "/app/timbrature", icon: Clock },
    ],
  },
  {
    label: "Sistema",
    items: [
      { title: "Impostazioni", url: "/app/impostazioni", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border hidden md:flex">
      <div className={`flex items-center gap-2 px-4 py-4 border-b border-border ${collapsed ? "justify-center" : ""}`}>
        <HardHat className="h-6 w-6 text-primary shrink-0" />
        {!collapsed && (
          <span className="font-heading font-bold text-sm text-foreground tracking-tight">
            Cantiere in Cloud
          </span>
        )}
      </div>
      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            {!collapsed && (
              <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-3 pt-3 pb-1">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                        activeClassName="bg-primary/10 text-primary font-medium"
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && (
                          <span className="flex-1 flex items-center justify-between">
                            <span>{item.title}</span>
                            {"badge" in item && item.badge > 0 && (
                              <Badge variant="destructive" className="text-[10px] h-4 min-w-4 flex items-center justify-center px-1 ml-auto">
                                {item.badge}
                              </Badge>
                            )}
                          </span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
