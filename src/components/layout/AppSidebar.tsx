import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard, Building2, FileText, HardHat, Building, Truck,
  ShieldCheck, CalendarClock, MessageSquare, Settings, IdCard, Clock, PenTool, MapPin, ShieldAlert, BarChart3, Receipt, LifeBuoy, ChevronDown, CalendarDays
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { mockThreads } from "@/data/mock-comunicazioni";
import { useAuth } from "@/contexts/AuthContext";

const unreadCount = mockThreads.reduce((s, t) => s + t.non_letti, 0);

const navGroups = [
  {
    label: "Generale",
    items: [
      { title: "Dashboard", url: "/app/dashboard", icon: LayoutDashboard, adminOnly: false },
      { title: "Calendario", url: "/app/calendario", icon: CalendarDays, adminOnly: false },
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
      { title: "Supporto", url: "/app/supporto", icon: LifeBuoy, adminOnly: false },
      { title: "Abbonamento", url: "/app/billing", icon: Receipt, adminOnly: false },
      { title: "Impostazioni", url: "/app/impostazioni", icon: Settings, adminOnly: false },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { effectiveRole } = useAuth();
  const isManager = effectiveRole === "manager";
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
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
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
          const visibleItems = group.items.filter(item => !isManager || !item.adminOnly);
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
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}
