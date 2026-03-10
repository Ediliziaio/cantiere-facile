import { LayoutDashboard, Building2, FileText, ShieldCheck, Menu } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  HardHat, Building, Truck, CalendarClock, MessageSquare, Settings, IdCard, Clock, ScanLine
} from "lucide-react";

const tabs = [
  { title: "Dashboard", url: "/app/dashboard", icon: LayoutDashboard },
  { title: "Cantieri", url: "/app/cantieri", icon: Building2 },
  { title: "Documenti", url: "/app/documenti", icon: FileText },
  { title: "Accessi", url: "/app/accessi", icon: ShieldCheck },
];

const menuItems = [
  { title: "Lavoratori", url: "/app/lavoratori", icon: HardHat },
  { title: "Subappaltatori", url: "/app/subappaltatori", icon: Building },
  { title: "Mezzi", url: "/app/mezzi", icon: Truck },
  { title: "Badge Digitali", url: "/app/badge", icon: IdCard },
  { title: "Timbrature", url: "/app/timbrature", icon: Clock },
  { title: "Scansiona", url: "/app/scan", icon: ScanLine },
  { title: "Scadenze", url: "/app/scadenze", icon: CalendarClock },
  { title: "Comunicazioni", url: "/app/comunicazioni", icon: MessageSquare },
  { title: "Impostazioni", url: "/app/impostazioni", icon: Settings },
];

export function MobileBottomNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-border bg-card">
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => (
          <NavLink
            key={tab.url}
            to={tab.url}
            className="flex flex-col items-center gap-0.5 text-muted-foreground py-1 px-2"
            activeClassName="text-primary"
          >
            <tab.icon className="h-5 w-5" />
            <span className="text-[10px]">{tab.title}</span>
          </NavLink>
        ))}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="flex flex-col items-center gap-0.5 text-muted-foreground py-1 px-2">
            <Menu className="h-5 w-5" />
            <span className="text-[10px]">Menu</span>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[70vh]">
            <div className="grid grid-cols-3 gap-3 py-4">
              {menuItems.map((item) => (
                <Link
                  key={item.url}
                  to={item.url}
                  onClick={() => setOpen(false)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs text-center">{item.title}</span>
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
