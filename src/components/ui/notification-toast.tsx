import React, { useEffect, useState } from 'react';
import { X, Check, AlertCircle, Info, Bell } from 'lucide-react';
import { Button } from './button';
import { notificationService, Notification } from '../../lib/notificationService';

interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animation d'entrée
    setTimeout(() => setIsVisible(true), 100);

    // Auto-fermeture après 5 secondes
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (notification.type) {
      case 'course':
        return <Bell className="w-5 h-5 text-blue-600" />;
      case 'message':
        return <Bell className="w-5 h-5 text-green-600" />;
      case 'system':
        return <Bell className="w-5 h-5 text-gray-600" />;
      case 'success':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = () => {
    switch (notification.priority) {
      case 'urgent':
        return 'border-red-500 bg-red-50';
      case 'high':
        return 'border-orange-500 bg-orange-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-blue-500 bg-blue-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const handleAction = () => {
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
    onClose();
  };

  const handleMarkAsRead = () => {
    notificationService.markAsRead(notification.id);
    onClose();
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`border-l-4 shadow-lg rounded-lg p-4 ${getPriorityColor()}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">
                  {notification.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {notification.message}
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Actions */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2">
                {notification.actionText && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAction}
                    className="text-xs h-6 px-2 text-blue-600 hover:text-blue-800"
                  >
                    {notification.actionText}
                  </Button>
                )}
                
                {!notification.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAsRead}
                    className="text-xs h-6 px-2"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Marquer comme lu
                  </Button>
                )}
              </div>
              
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-400">
                  {new Date(notification.createdAt).toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant pour gérer les notifications toast globalement
export const NotificationToastManager: React.FC = () => {
  const [toasts, setToasts] = useState<Notification[]>([]);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe((allNotifications) => {
      // Filtrer les nouvelles notifications urgentes ou élevées
      const newToasts = allNotifications.filter(n => 
        (n.priority === 'urgent' || n.priority === 'high') && 
        !toasts.find(t => t.id === n.id)
      );
      
      if (newToasts.length > 0) {
        setToasts(prev => [...prev, ...newToasts]);
      }
    });

    return unsubscribe;
  }, [toasts]);

  const removeToast = (notificationId: string) => {
    setToasts(prev => prev.filter(t => t.id !== notificationId));
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((notification) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onClose={() => removeToast(notification.id)}
        />
      ))}
    </div>
  );
};






