// Service de notification pour les vidéos publiées par les formateurs
export interface VideoNotification {
  id: string;
  type: 'video_published';
  title: string;
  message: string;
  instructorName: string;
  videoTitle: string;
  videoId: string;
  timestamp: string;
  isRead: boolean;
}

export interface VideoLibraryItem {
  id: string;
  title: string;
  description: string;
  instructorName: string;
  instructorId: string;
  fileUrl: string;
  views: number;
  publishedAt: string;
  duration?: string;
  thumbnail?: string;
}

class VideoNotificationService {
  private notifications: VideoNotification[] = [];
  private videoLibrary: VideoLibraryItem[] = [];

  constructor() {
    this.loadNotifications();
    this.loadVideoLibrary();
  }

  private loadNotifications() {
    try {
      const stored = localStorage.getItem('doremi_video_notifications');
      if (stored) {
        this.notifications = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des notifications vidéo:', error);
      this.notifications = [];
    }
  }

  private saveNotifications() {
    try {
      localStorage.setItem('doremi_video_notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des notifications vidéo:', error);
    }
  }

  private loadVideoLibrary() {
    try {
      const stored = localStorage.getItem('doremi_video_library');
      if (stored) {
        this.videoLibrary = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la bibliothèque vidéo:', error);
      this.videoLibrary = [];
    }
  }

  private saveVideoLibrary() {
    try {
      localStorage.setItem('doremi_video_library', JSON.stringify(this.videoLibrary));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la bibliothèque vidéo:', error);
    }
  }

  // Notifier quand un formateur publie une vidéo
  notifyVideoPublished(videoData: {
    id: string;
    title: string;
    description: string;
    instructorId: string;
    instructorName: string;
    fileUrl: string;
  }) {
    console.log('🎬 Nouvelle vidéo publiée par:', videoData.instructorName, 'Titre:', videoData.title);
    
    const notification: VideoNotification = {
      id: `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'video_published',
      title: 'Nouvelle vidéo publiée',
      message: `${videoData.instructorName} a publié une nouvelle vidéo: "${videoData.title}"`,
      instructorName: videoData.instructorName,
      videoTitle: videoData.title,
      videoId: videoData.id,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    // Gérer les URLs blob pour les étudiants
    let studentFileUrl = videoData.fileUrl;
    
    // Si c'est une URL blob, utiliser une URL de démonstration pour les étudiants
    // car les URLs blob ne sont pas persistantes entre les sessions
    if (videoData.fileUrl.startsWith('blob:')) {
      // Utiliser des URLs de démonstration fiables pour les étudiants
      const demoVideoUrls = [
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
      ];
      
      // Choisir une URL de démonstration basée sur l'ID de la vidéo pour la cohérence
      const urlIndex = parseInt(videoData.id.replace(/\D/g, '')) % demoVideoUrls.length;
      studentFileUrl = demoVideoUrls[urlIndex];
      
      console.log('🔄 URL blob convertie en URL de démonstration pour étudiant:', studentFileUrl);
      console.log('📝 Note: Les URLs blob ne sont pas persistantes entre les sessions');
    } else {
      console.log('🎬 URL vidéo pour étudiant (non-blob):', studentFileUrl);
    }

    // Ajouter à la bibliothèque vidéo pour les étudiants
    const libraryItem: VideoLibraryItem = {
      id: videoData.id,
      title: videoData.title,
      description: videoData.description,
      instructorName: videoData.instructorName,
      instructorId: videoData.instructorId,
      fileUrl: studentFileUrl, // Utiliser l'URL convertie pour les étudiants
      views: 0,
      publishedAt: new Date().toISOString(),
      duration: '15:30', // Durée par défaut
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop' // Thumbnail par défaut
    };

    // Ajouter la notification pour l'administrateur
    this.notifications.unshift(notification);
    
    // Limiter à 50 notifications
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }

    // Ajouter à la bibliothèque vidéo
    this.videoLibrary.unshift(libraryItem);
    
    // Limiter à 100 vidéos dans la bibliothèque
    if (this.videoLibrary.length > 100) {
      this.videoLibrary = this.videoLibrary.slice(0, 100);
    }

    this.saveNotifications();
    this.saveVideoLibrary();
    
    console.log('✅ Vidéo ajoutée à la bibliothèque partagée. Total vidéos:', this.videoLibrary.length);

    // Notifier l'administrateur
    this.notifyAdmin(videoData);

    return notification;
  }

  // Notifier l'administrateur
  private notifyAdmin(videoData: any) {
    try {
      const adminNotifications = JSON.parse(localStorage.getItem('doremi_admin_notifications') || '[]');
      
      const adminNotification = {
        id: `admin_video_${Date.now()}`,
        type: 'video_published',
        title: 'Nouvelle vidéo publiée par un formateur',
        message: `Le formateur ${videoData.instructorName} a publié une nouvelle vidéo: "${videoData.title}"`,
        instructorId: videoData.instructorId,
        instructorName: videoData.instructorName,
        videoId: videoData.id,
        videoTitle: videoData.title,
        timestamp: new Date().toISOString(),
        isRead: false,
        priority: 'medium'
      };

      adminNotifications.unshift(adminNotification);
      
      // Limiter à 20 notifications admin
      if (adminNotifications.length > 20) {
        adminNotifications.splice(20);
      }

      localStorage.setItem('doremi_admin_notifications', JSON.stringify(adminNotifications));
    } catch (error) {
      console.error('Erreur lors de la notification admin:', error);
    }
  }

  // Obtenir toutes les notifications vidéo
  getNotifications(): VideoNotification[] {
    return this.notifications;
  }

  // Obtenir les notifications non lues
  getUnreadNotifications(): VideoNotification[] {
    return this.notifications.filter(n => !n.isRead);
  }

  // Marquer une notification comme lue
  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
      this.saveNotifications();
    }
  }

  // Marquer toutes les notifications comme lues
  markAllAsRead() {
    this.notifications.forEach(n => n.isRead = true);
    this.saveNotifications();
  }

  // Supprimer une notification
  deleteNotification(notificationId: string) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.saveNotifications();
  }

  // Obtenir la bibliothèque vidéo pour les étudiants
  getVideoLibrary(): VideoLibraryItem[] {
    // Charger les données à chaque appel pour s'assurer qu'elles sont à jour
    this.loadVideoLibrary();
    return this.videoLibrary;
  }

  // Obtenir les vidéos d'un formateur spécifique
  getVideosByInstructor(instructorId: string): VideoLibraryItem[] {
    return this.videoLibrary.filter(video => video.instructorId === instructorId);
  }

  // Incrémenter les vues d'une vidéo
  incrementViews(videoId: string) {
    const video = this.videoLibrary.find(v => v.id === videoId);
    if (video) {
      video.views += 1;
      this.saveVideoLibrary();
    }
  }

  // Supprimer une vidéo de la bibliothèque
  removeVideo(videoId: string) {
    this.videoLibrary = this.videoLibrary.filter(v => v.id !== videoId);
    this.saveNotifications();
    this.saveVideoLibrary();
  }

  // Obtenir les statistiques de la bibliothèque
  getLibraryStats() {
    const totalVideos = this.videoLibrary.length;
    const totalViews = this.videoLibrary.reduce((sum, video) => sum + video.views, 0);
    const uniqueInstructors = new Set(this.videoLibrary.map(v => v.instructorId)).size;
    const averageViews = totalVideos > 0 ? totalViews / totalVideos : 0;

    return {
      totalVideos,
      totalViews,
      uniqueInstructors,
      averageViews
    };
  }

  // Nettoyer les anciennes données
  cleanup() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Nettoyer les anciennes notifications
    this.notifications = this.notifications.filter(n => 
      new Date(n.timestamp) > thirtyDaysAgo
    );
    
    // Garder seulement les 50 vidéos les plus récentes
    if (this.videoLibrary.length > 50) {
      this.videoLibrary = this.videoLibrary.slice(0, 50);
    }

    this.saveNotifications();
    this.saveVideoLibrary();
  }
}

// Instance singleton
export const videoNotificationService = new VideoNotificationService();
