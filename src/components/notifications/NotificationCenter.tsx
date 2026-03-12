import { useState } from "react";
import { Bell, Check, CheckCheck, Clock, FileText, ShieldAlert, CloudRain, Settings, Siren, UserCheck, X, Filter } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/hooks/useNotifications";
import { priorityConfig, typeConfig, type NotificationType, type NotificationPriority } from "@/data/mock-notifications";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";

const typeIconMap: Record<NotificationType, typeof Bell> = {
  scadenza: Clock,
  incidente: ShieldAlert,
  check_in: UserCheck,
  documento: FileText,
  emergenza: Siren,
  sistema: Settings,
  meteo: CloudRain,
};

export function NotificationCenter() {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllRead, dismissNotification } = useNotifications();
  const [filterPriority, setFilterPriority] = useState<NotificationPriority | "all">("all");
  const [filterType, setFilterType] = useState<NotificationType | "all">("all");
  const [open, setOpen] = useState(false);

  const filtered = notifications
    .filter(n => filterPriority === "all" || n.priority === filterPriority)
    .filter(n => filterType === "all" || n.type === filterType)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const handleClick = (id: string, url?: string) => {
    markAsRead(id);
    if (url) {
      setOpen(false);
      navigate(url);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg">Notifiche</SheetTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllRead} className="text-xs gap-1">
                <CheckCheck className="h-3.5 w-3.5" /> Segna tutte lette
              </Button>
            )}
          </div>
          {/* Filters */}
          <div className="flex gap-2 mt-2">
            <Select value={filterPriority} onValueChange={v => setFilterPriority(v as any)}>
              <SelectTrigger className="h-8 text-xs flex-1">
                <Filter className="h-3 w-3 mr-1" />
                <SelectValue placeholder="Priorità" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutte le priorità</SelectItem>
                <SelectItem value="critical">🔴 Critica</SelectItem>
                <SelectItem value="high">🟠 Alta</SelectItem>
                <SelectItem value="normal">Normale</SelectItem>
                <SelectItem value="low">Bassa</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={v => setFilterType(v as any)}>
              <SelectTrigger className="h-8 text-xs flex-1">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti i tipi</SelectItem>
                {Object.entries(typeConfig).map(([key, cfg]) => (
                  <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </SheetHeader>

        <Separator />

        <ScrollArea className="flex-1">
          <div className="divide-y divide-border">
            {filtered.length === 0 && (
              <div className="p-8 text-center text-muted-foreground text-sm">
                Nessuna notifica trovata
              </div>
            )}
            {filtered.map(n => {
              const Icon = typeIconMap[n.type] || Bell;
              const pConfig = priorityConfig[n.priority];

              return (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-accent/50 ${!n.read ? "bg-accent/20" : ""}`}
                  onClick={() => handleClick(n.id, n.action_url)}
                >
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${pConfig.bgColor}`}>
                    <Icon className={`h-4 w-4 ${pConfig.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm leading-tight ${!n.read ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                        {n.title}
                      </p>
                      <Button
                        variant="ghost" size="icon"
                        className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100"
                        onClick={e => { e.stopPropagation(); dismissNotification(n.id); }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[11px] text-muted-foreground">
                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: it })}
                      </span>
                      {n.site_name && (
                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4">
                          {n.site_name}
                        </Badge>
                      )}
                      {n.priority === "critical" && (
                        <Badge variant="destructive" className="text-[10px] py-0 px-1.5 h-4">Critica</Badge>
                      )}
                      {!n.read && (
                        <Button
                          variant="ghost" size="sm"
                          className="h-5 text-[10px] px-1.5 gap-0.5 ml-auto"
                          onClick={e => { e.stopPropagation(); markAsRead(n.id); }}
                        >
                          <Check className="h-3 w-3" /> Letto
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
