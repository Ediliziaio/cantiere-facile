import { LayoutDashboard, Building2, MapPin, IdCard, Menu } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  HardHat, Building, Truck, CalendarClock, MessageSquare, Settings, FileText, Clock, ScanLine, PenTool, ShieldAlert, BarChart3
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const tabs = [
  { title: "Dashboard", url: "/app/dashboard", icon: LayoutDashboard },
  { title: "Cantieri", url: "/app/cantieri", icon: Building2 },
  { title: "Check-in", url: "/app/checkin", icon: MapPin },
  { title: "Badge", url: "/app/badge", icon: IdCard },
];

const menuGroups = [
  {
    label: "Generale",
    items: [
      { title: "Comunicazioni", url: "/app/comunicazioni", icon: MessageSquare, adminOnly: false },
      { title: "Scadenze", url: "/app/scadenze", icon: CalendarClock, adminOnly: false },
    ],
  },
  {
    label: "Cantiere",
    items: [
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
      { title: "Timbrature", url: "/app/timbrature", icon: Clock, adminOnly: false },
      { title: "Scansiona", url: "/app/scan", icon: ScanLine, adminOnly: false },
    ],
  },
  {
    label: "Sistema",
    items: [
      { title: "Impostazioni", url: "/app/impostazioni", icon: Settings, adminOnly: false },
    ],
  },
];

export function MobileBottomNav() {
  const [open, setOpen] = useState(false);
  const { role } = useAuth();
  const isManager = role === "manager";

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
              {menuGroups.map((group) => {
                const visibleItems = group.items.filter(item => !isManager || !item.adminOnly);
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
