import { useState, useCallback, useMemo } from "react";
import { AppNotification, NotificationPriority, NotificationType, mockAppNotifications } from "@/data/mock-notifications";

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>(mockAppNotifications);

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);
  
  const criticalUnread = useMemo(
    () => notifications.filter(n => !n.read && (n.priority === "critical" || n.priority === "high")),
    [notifications]
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const filterByPriority = useCallback((priority: NotificationPriority | "all") => {
    if (priority === "all") return notifications;
    return notifications.filter(n => n.priority === priority);
  }, [notifications]);

  const filterByType = useCallback((type: NotificationType | "all") => {
    if (type === "all") return notifications;
    return notifications.filter(n => n.type === type);
  }, [notifications]);

  return {
    notifications,
    unreadCount,
    criticalUnread,
    markAsRead,
    markAllRead,
    dismissNotification,
    filterByPriority,
    filterByType,
  };
}
