// Types pour les notifications
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'course' | 'message' | 'system';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'course' | 'message' | 'system' | 'promotion' | 'reminder';
  isRead: boolean;
  isArchived: boolean;
  createdAt: string;
  expiresAt?: string;
  actionUrl?: string;
  actionText?: string;
  icon?: string;
  userId: string;
  metadata?: {
    courseId?: string;
    messageId?: string;
    senderId?: string;
    [key: string]: any;
  };
}

// Service de notifications
class NotificationService {
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];

  constructor() {
    this.loadNotifications();
  }

  // Charger les notifications depuis localStorage
  private loadNotifications() {
    try {
      const stored = localStorage.getItem('doremi_notifications');
      if (stored) {
        this.notifications = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
      this.notifications = [];
    }
  }

  // Sauvegarder les notifications dans localStorage
  private saveNotifications() {
    try {
      localStorage.setItem('doremi_notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des notifications:', error);
    }
  }

  // Notifier les listeners
  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  // S'abonner aux changements
  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener);
    listener([...this.notifications]);
    
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Créer une nouvelle notification
  createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'isRead' | 'isArchived'>): Notification {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      isRead: false,
      isArchived: false
    };

    this.notifications.unshift(newNotification);
    this.saveNotifications();
    this.notifyListeners();

    // Notification toast pour les notifications urgentes
    if (newNotification.priority === 'urgent' || newNotification.priority === 'high') {
      this.showToast(newNotification);
    }

    return newNotification;
  }

  // Marquer comme lu
  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  // Marquer toutes comme lues
  markAllAsRead() {
    this.notifications.forEach(n => n.isRead = true);
    this.saveNotifications();
    this.notifyListeners();
  }

  // Archiver une notification
  archiveNotification(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isArchived = true;
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  // Supprimer une notification
  deleteNotification(notificationId: string) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.saveNotifications();
    this.notifyListeners();
  }

  // Obtenir toutes les notifications
  getNotifications(userId: string, includeArchived = false): Notification[] {
    let filtered = this.notifications.filter(n => n.userId === userId);
    
    if (!includeArchived) {
      filtered = filtered.filter(n => !n.isArchived);
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Obtenir les notifications non lues
  getUnreadCount(userId: string): number {
    return this.notifications.filter(n => n.userId === userId && !n.isRead && !n.isArchived).length;
  }

  // Obtenir les notifications par type
  getNotificationsByType(userId: string, type: Notification['type']): Notification[] {
    return this.getNotifications(userId).filter(n => n.type === type);
  }

  // Obtenir les notifications par priorité
  getNotificationsByPriority(userId: string, priority: Notification['priority']): Notification[] {
    return this.getNotifications(userId).filter(n => n.priority === priority);
  }

  // Nettoyer les notifications expirées
  cleanExpiredNotifications() {
    const now = new Date();
    this.notifications = this.notifications.filter(n => {
      if (!n.expiresAt) return true;
      return new Date(n.expiresAt) > now;
    });
    this.saveNotifications();
    this.notifyListeners();
  }

  // Créer des notifications de test
  createTestNotifications(userId: string) {
    const testNotifications: Omit<Notification, 'id' | 'createdAt' | 'isRead' | 'isArchived'>[] = [
      {
        title: 'Nouveau cours disponible',
        message: 'Le cours "Introduction à la comptabilité" est maintenant disponible.',
        type: 'course',
        priority: 'medium',
        category: 'course',
        userId,
        actionUrl: '/courses',
        actionText: 'Voir le cours',
        icon: '📚',
        metadata: { courseId: '3' }
      },
      {
        title: 'Message de Marie Dubois',
        message: 'Marie Dubois vous a envoyé un message concernant votre cours.',
        type: 'message',
        priority: 'high',
        category: 'message',
        userId,
        actionUrl: '/messages',
        actionText: 'Voir le message',
        icon: '💬',
        metadata: { senderId: '2', messageId: '1' }
      },
      {
        title: 'Rappel de cours',
        message: 'Votre cours "Gérer ses finances à 20 ans" commence dans 30 minutes.',
        type: 'reminder',
        priority: 'urgent',
        category: 'reminder',
        userId,
        actionUrl: '/courses',
        actionText: 'Rejoindre le cours',
        icon: '⏰',
        metadata: { courseId: '2' }
      },
      {
        title: 'Promotion Premium',
        message: 'Profitez de 20% de réduction sur l\'abonnement Premium !',
        type: 'promotion',
        priority: 'medium',
        category: 'promotion',
        userId,
        actionUrl: '/premium',
        actionText: 'En savoir plus',
        icon: '🎉'
      },
      {
        title: 'Maintenance système',
        message: 'Une maintenance est prévue ce soir de 22h à 23h.',
        type: 'system',
        priority: 'low',
        category: 'system',
        userId,
        actionUrl: '/status',
        actionText: 'Voir le statut',
        icon: '🔧'
      }
    ];

    testNotifications.forEach(notification => {
      this.createNotification(notification);
    });
  }

  // Afficher une notification toast
  private showToast(notification: Notification) {
    // Créer un élément toast
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 max-w-sm w-full bg-white border-l-4 border-${this.getPriorityColor(notification.priority)}-500 shadow-lg rounded-lg p-4 transform transition-all duration-300 translate-x-full`;
    
    toast.innerHTML = `
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <span class="text-2xl">${notification.icon || '🔔'}</span>
        </div>
        <div class="ml-3 flex-1">
          <p class="text-sm font-medium text-gray-900">${notification.title}</p>
          <p class="text-sm text-gray-500 mt-1">${notification.message}</p>
          ${notification.actionText ? `
            <button class="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
              ${notification.actionText}
            </button>
          ` : ''}
        </div>
        <button class="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600">
          <span class="sr-only">Fermer</span>
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    `;

    // Ajouter au DOM
    document.body.appendChild(toast);

    // Animation d'entrée
    setTimeout(() => {
      toast.classList.remove('translate-x-full');
    }, 100);

    // Gestion du clic sur fermer
    const closeButton = toast.querySelector('button');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      });
    }

    // Auto-fermeture après 5 secondes
    setTimeout(() => {
      if (document.body.contains(toast)) {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
          if (document.body.contains(toast)) {
            document.body.removeChild(toast);
          }
        }, 300);
      }
    }, 5000);
  }

  // Obtenir la couleur de priorité
  private getPriorityColor(priority: Notification['priority']): string {
    switch (priority) {
      case 'urgent': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      case 'low': return 'blue';
      default: return 'gray';
    }
  }

  // Méthodes utilitaires pour créer des notifications spécifiques
  createCourseNotification(userId: string, courseTitle: string, actionUrl?: string) {
    return this.createNotification({
      title: 'Nouveau cours disponible',
      message: `Le cours "${courseTitle}" est maintenant disponible.`,
      type: 'course',
      priority: 'medium',
      category: 'course',
      userId,
      actionUrl: actionUrl || '/courses',
      actionText: 'Voir le cours',
      icon: '📚'
    });
  }

  createMessageNotification(userId: string, senderName: string, messagePreview: string, actionUrl?: string) {
    return this.createNotification({
      title: `Message de ${senderName}`,
      message: messagePreview,
      type: 'message',
      priority: 'high',
      category: 'message',
      userId,
      actionUrl: actionUrl || '/messages',
      actionText: 'Voir le message',
      icon: '💬'
    });
  }

  createSystemNotification(userId: string, title: string, message: string, priority: Notification['priority'] = 'medium') {
    return this.createNotification({
      title,
      message,
      type: 'system',
      priority,
      category: 'system',
      userId,
      icon: '🔧'
    });
  }

  createPromotionNotification(userId: string, title: string, message: string, actionUrl?: string) {
    return this.createNotification({
      title,
      message,
      type: 'promotion',
      priority: 'medium',
      category: 'promotion',
      userId,
      actionUrl: actionUrl || '/premium',
      actionText: 'En savoir plus',
      icon: '🎉'
    });
  }
}

// Instance singleton
export const notificationService = new NotificationService();

// Nettoyer les notifications expirées toutes les heures
setInterval(() => {
  notificationService.cleanExpiredNotifications();
}, 60 * 60 * 1000);






