import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, XCircle, Clock, MessageSquare } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';
import { internshipService } from '../../lib/internshipService';
import { useAuth } from '../../context/AuthContext';

interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  applicationId?: string;
  status?: string;
}

export const NotificationCenter: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = () => {
    if (!user) return;
    
    const userNotifications = internshipService.getUserNotifications(user.id);
    setNotifications(userNotifications);
    setUnreadCount(userNotifications.filter(n => !n.read).length);
  };

  const markAsRead = (notificationId: string) => {
    internshipService.markNotificationAsRead(notificationId);
    loadNotifications();
  };

  const markAllAsRead = () => {
    notifications.forEach(notification => {
      if (!notification.read) {
        internshipService.markNotificationAsRead(notification.id);
      }
    });
    loadNotifications();
  };

  const getNotificationIcon = (type: string, status?: string) => {
    if (status === 'accepted') return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (status === 'rejected') return <XCircle className="w-5 h-5 text-red-600" />;
    if (status === 'reviewed') return <Clock className="w-5 h-5 text-blue-600" />;
    return <MessageSquare className="w-5 h-5 text-gray-600" />;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'À l\'instant';
    if (diffInHours < 24) return `Il y a ${Math.floor(diffInHours)}h`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="relative">
      {/* Bouton de notification */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Panneau de notifications */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border z-50 max-h-96 overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Tout marquer comme lu
                </Button>
              )}
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>Aucune notification</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type, notification.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 h-auto text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">
                          {formatTime(notification.timestamp)}
                        </span>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t bg-gray-50">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="w-full text-sm"
              >
                Fermer
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Overlay pour fermer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}; 