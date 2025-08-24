import { useState, useEffect } from 'react';
import { notificationService, Notification } from '../lib/notificationService';
import { useAuth } from '../context/AuthContext';

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user?.id) return;

    const unsubscribe = notificationService.subscribe((allNotifications) => {
      const userNotifications = notificationService.getNotifications(user.id);
      setNotifications(userNotifications);
      setUnreadCount(notificationService.getUnreadCount(user.id));
    });

    // Charger les notifications initiales
    const userNotifications = notificationService.getNotifications(user.id);
    setNotifications(userNotifications);
    setUnreadCount(notificationService.getUnreadCount(user.id));

    return unsubscribe;
  }, [user?.id]);

  const markAsRead = (notificationId: string) => {
    notificationService.markAsRead(notificationId);
  };

  const markAllAsRead = () => {
    notificationService.markAllAsRead();
  };

  const archiveNotification = (notificationId: string) => {
    notificationService.archiveNotification(notificationId);
  };

  const deleteNotification = (notificationId: string) => {
    notificationService.deleteNotification(notificationId);
  };

  const createNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead' | 'isArchived'>) => {
    return notificationService.createNotification(notification);
  };

  const getNotificationsByType = (type: Notification['type']) => {
    return notificationService.getNotificationsByType(user?.id || '', type);
  };

  const getNotificationsByPriority = (priority: Notification['priority']) => {
    return notificationService.getNotificationsByPriority(user?.id || '', priority);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    deleteNotification,
    createNotification,
    getNotificationsByType,
    getNotificationsByPriority
  };
};






