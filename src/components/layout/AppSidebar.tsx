import {
  LayoutDashboard, Building2, FileText, HardHat, Building, Truck,
  ShieldCheck, CalendarClock, MessageSquare, Settings, IdCard, Clock, PenTool, MapPin, ShieldAlert, BarChart3, Receipt
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { mockThreads } from "@/data/mock-comunicazioni";
import { useAuth } from "@/contexts/AuthContext";

const unreadCount = mockThreads.reduce((s, t) => s + t.non_letti, 0);

const navGroups = [
  {
    label: "Generale",
    items: [
      { title: "Dashboard", url: "/app/dashboard", icon: LayoutDashboard, adminOnly: false },
      { title: "Comunicazioni", url: "/app/comunicazioni", icon: MessageSquare, badge: unreadCount, adminOnly: false },
      { title: "Scadenze", url: "/app/scadenze", icon: CalendarClock, adminOnly: false },
      { title: "Analytics", url: "/app/analytics", icon: BarChart3, adminOnly: false },
    ],
  },
  {
    label: "Cantiere",
    items: [
      { title: "Cantieri", url: "/app/cantieri", icon: Building2, adminOnly: false },
      { title: "Documenti", url: "/app/documenti", icon: FileText, adminOnly: false },
      { title: "Firma Digitale", url: "/app/firma", icon: PenTool, adminOnly: false },
      { title: "Lavoratori", url: "/app/lavoratori", icon: HardHat, adminOnly: false },
      { title: "Subappaltatori", url: "/app/subappaltatori", icon: Building, adminOnly: true },
      { title: "Mezzi", url: "/app/mezzi", icon: Truck, adminOnly: false },
    ],
  },
  {
    label: "Sicurezza",
    items: [
      { title: "Sicurezza 81/08", url: "/app/sicurezza", icon: ShieldAlert, adminOnly: false },
    ],
  },
  {
    label: "Presenze",
    items: [
      { title: "Check-in GPS", url: "/app/checkin", icon: MapPin, adminOnly: false },
      { title: "Accessi", url: "/app/accessi", icon: ShieldCheck, adminOnly: false },
      { title: "Badge Digitali", url: "/app/badge", icon: IdCard, adminOnly: false },
      { title: "Timbrature", url: "/app/timbrature", icon: Clock, adminOnly: false },
    ],
  },
  {
    label: "Sistema",
    items: [
      { title: "Impostazioni", url: "/app/impostazioni", icon: Settings, adminOnly: false },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { role } = useAuth();
  const isManager = role === "manager";

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
        {navGroups.map((group) => {
          const visibleItems = group.items.filter(item => !isManager || !item.adminOnly);
          if (visibleItems.length === 0) return null;
          return (
            <SidebarGroup key={group.label}>
              {!collapsed && (
                <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-3 pt-3 pb-1">
                  {group.label}
                </SidebarGroupLabel>
              )}
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
                          {!collapsed && (
                            <span className="flex-1 flex items-center justify-between">
                              <span>{item.title}</span>
                              {"badge" in item && item.badge && item.badge > 0 && (
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
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}
