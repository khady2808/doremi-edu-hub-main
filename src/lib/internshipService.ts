// Service pour la gestion des candidatures de stages
// Note: Dans un environnement de production, vous utiliseriez une vraie API backend

export interface InternshipApplication {
  id: string;
  internshipId: string;
  internshipTitle: string;
  company: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole?: 'student' | 'teacher';
  userPhone?: string;
  cvFileData: string; // Base64 string instead of File object
  cvFileName: string;
  cvFileSize: number;
  coverLetter?: string;
  appliedAt: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  adminNotes?: string;
}

export interface AdminNotification {
  id: string;
  type: 'application' | 'system' | 'alert';
  title: string;
  message: string;
  applicationData?: InternshipApplication;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

export class InternshipService {
  private static instance: InternshipService;
  private applications: InternshipApplication[] = [];
  private adminNotifications: AdminNotification[] = [];
  private adminEmail = 'admin@doremi-edu.sn';

  private constructor() {
    console.log('🔧 Initialisation du service InternshipService...');
    
    // Charger les candidatures depuis localStorage
    const savedApplications = localStorage.getItem('doremi_internship_applications');
    if (savedApplications) {
      try {
        this.applications = JSON.parse(savedApplications);
        console.log('📋 Candidatures chargées depuis localStorage:', this.applications.length);
      } catch (error) {
        console.error('❌ Erreur lors du chargement des candidatures:', error);
        this.applications = [];
      }
    } else {
      console.log('📋 Aucune candidature trouvée dans localStorage');
      this.applications = [];
    }
    
    // Charger les notifications admin depuis localStorage
    const savedNotifications = localStorage.getItem('doremi_admin_notifications');
    if (savedNotifications) {
      this.adminNotifications = JSON.parse(savedNotifications);
    }
  }

  public static getInstance(): InternshipService {
    if (!InternshipService.instance) {
      InternshipService.instance = new InternshipService();
    }
    return InternshipService.instance;
  }

  // Convertir File en base64
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Extraire la partie base64 (après la virgule)
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }

  // Convertir base64 en Blob
  public base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  // Soumettre une candidature
  public async submitApplication(
    internshipId: string,
    internshipTitle: string,
    company: string,
    userId: string,
    userName: string,
    userEmail: string,
    userRole: 'student' | 'teacher',
    userPhone: string,
    cvFile: File,
    coverLetter?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      console.log('Début de soumission de candidature:', { internshipId, userId, userName });

      // Vérifications préalables
      if (!internshipId || !userId || !userName || !userEmail || !userPhone) {
        throw new Error('Données manquantes pour la candidature');
      }

      if (!cvFile || cvFile.size === 0) {
        throw new Error('Fichier CV invalide');
      }

      // Vérifier la taille du fichier (max 2MB pour éviter les problèmes de stockage)
      if (cvFile.size > 2 * 1024 * 1024) {
        throw new Error('Le fichier CV est trop volumineux (max 2MB). Veuillez compresser votre fichier.');
      }

      // Vérifier le type de fichier
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(cvFile.type)) {
        throw new Error('Format de fichier non supporté. Utilisez PDF, DOC ou DOCX.');
      }

      // Convertir le fichier en base64
      const cvFileData = await this.fileToBase64(cvFile);
      console.log('Fichier CV converti en base64, taille:', cvFileData.length);

      // Nettoyage d'urgence du localStorage AVANT de créer la candidature
      this.emergencyCleanup();
      console.log('🚨 Nettoyage d\'urgence effectué avant création candidature');

      // Créer l'objet candidature
      const application: InternshipApplication = {
        id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        internshipId,
        internshipTitle,
        company,
        userId,
        userName,
        userEmail,
        userRole,
        userPhone,
        cvFileData,
        cvFileName: cvFile.name,
        cvFileSize: cvFile.size,
        coverLetter: coverLetter?.substring(0, 200), // Limiter encore plus la taille
        appliedAt: new Date().toISOString(),
        status: 'pending'
      };

      console.log('Candidature créée:', application.id);

      // Ajouter la candidature à la liste
      this.applications.push(application);
      this.saveApplications();
      console.log('Candidature sauvegardée');

      // Envoyer notification au recruteur seulement (pas de notification admin pour éviter l'erreur)
      await this.sendRecruiterNotification(application);
      console.log('Notification recruteur envoyée');

      // Simuler l'envoi d'email à l'administrateur
      await this.sendApplicationEmailToAdmin(application);
      console.log('Email admin envoyé');

      // Sauvegarder les données utilisateur pour les statistiques
      this.saveUserApplicationStats(userId, internshipId);
      console.log('Statistiques mises à jour');

      return {
        success: true,
        message: 'Candidature soumise avec succès ! L\'administrateur a été notifié.'
      };
    } catch (error) {
      console.error('Erreur lors de la soumission de candidature:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors de la soumission de candidature. Veuillez réessayer.'
      };
    }
  }

  // Envoyer notification à l'administrateur (DÉSACTIVÉE pour éviter l'erreur de quota)
  /*
  private async sendAdminNotification(application: InternshipApplication): Promise<void> {
    const notification: AdminNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type: 'application',
      title: '🆕 Nouvelle candidature',
      message: `${application.userName} - ${application.internshipTitle}`,
      applicationData: null, // Ne pas inclure les données complètes pour économiser l'espace
      timestamp: new Date().toISOString(),
      read: false,
      priority: 'high'
    };

    this.adminNotifications.unshift(notification);
    
    // Limiter à 5 notifications maximum
    if (this.adminNotifications.length > 5) {
      this.adminNotifications = this.adminNotifications.slice(0, 5);
    }
    
    this.saveAdminNotifications();
    console.log('🔔 Notification admin envoyée:', notification.id);
  }
  */

  // Envoyer notification au recruteur
  private async sendRecruiterNotification(application: InternshipApplication): Promise<void> {
    try {
      // Créer une notification pour le recruteur (version simplifiée)
      const recruiterNotification = {
        id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 3)}`,
        type: 'application',
        title: '🆕 Nouvelle candidature',
        message: `${application.userName} - ${application.internshipTitle}`,
        timestamp: new Date().toISOString(),
        read: false
      };

      // Sauvegarder dans localStorage avec gestion d'erreur
      try {
        const existingNotifications = JSON.parse(localStorage.getItem('doremi_recruiter_notifications') || '[]');
        
        // Limiter à 5 notifications maximum pour éviter le quota
        if (existingNotifications.length >= 5) {
          existingNotifications.splice(0, 2); // Supprimer les 2 plus anciennes
        }
        
        existingNotifications.unshift(recruiterNotification);
        localStorage.setItem('doremi_recruiter_notifications', JSON.stringify(existingNotifications));
        
        console.log('🔔 Notification recruteur envoyée:', recruiterNotification.id);
      } catch (storageError) {
        console.warn('⚠️ Erreur de stockage localStorage, notification non sauvegardée:', storageError);
        // Continuer sans sauvegarder la notification
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de notification recruteur:', error);
    }
  }

  // Envoyer email à l'administrateur
  private async sendApplicationEmailToAdmin(application: InternshipApplication): Promise<void> {
    const emailContent = {
      to: this.adminEmail,
      subject: `🆕 Nouvelle candidature - ${application.internshipTitle}`,
      body: `
        Bonjour Administrateur,

        Une nouvelle candidature a été soumise pour un stage :

        📋 Détails de la candidature :
        • Poste : ${application.internshipTitle}
        • Entreprise : ${application.company}
        • Candidat : ${application.userName}
        • Email : ${application.userEmail}
        • Téléphone : ${application.userPhone || 'Non renseigné'}
        • Date de candidature : ${new Date(application.appliedAt).toLocaleString('fr-FR')}

        📄 CV : ${application.cvFileName} (${(application.cvFileSize / 1024 / 1024).toFixed(2)} MB)
        ${application.coverLetter ? `📝 Lettre de motivation : Incluse` : '📝 Lettre de motivation : Non incluse'}

        🔗 Accédez au tableau de bord admin pour traiter cette candidature :
        http://localhost:5173/admin/internships

        Cordialement,
        Système DOREMI
      `,
      type: 'application'
    };

    // Simulation d'envoi d'email
    console.log('📧 Email admin envoyé:', emailContent);
    
    // Dans un environnement de production, vous utiliseriez un vrai service d'email
    await new Promise(resolve => setTimeout(resolve, 100));
  }



  // Obtenir toutes les candidatures
  public getApplications(): InternshipApplication[] {
    console.log('📋 Récupération de toutes les candidatures...');
    console.log('📊 Nombre de candidatures actuellement en mémoire:', this.applications.length);
    return [...this.applications];
  }

  // Forcer le rechargement des candidatures depuis localStorage
  public reloadApplications(): void {
    console.log('🔄 Rechargement forcé des candidatures...');
    
    const savedApplications = localStorage.getItem('doremi_internship_applications');
    if (savedApplications) {
      try {
        this.applications = JSON.parse(savedApplications);
        console.log('✅ Candidatures rechargées depuis localStorage:', this.applications.length);
      } catch (error) {
        console.error('❌ Erreur lors du rechargement des candidatures:', error);
        this.applications = [];
      }
    } else {
      console.log('📋 Aucune candidature trouvée dans localStorage');
      this.applications = [];
    }
  }

  // Obtenir les candidatures pour un stage spécifique
  public getApplicationsForInternship(internshipId: string): InternshipApplication[] {
    return this.applications.filter(app => app.internshipId === internshipId);
  }

  // Obtenir les notifications admin
  public getAdminNotifications(): AdminNotification[] {
    return [...this.adminNotifications];
  }

  // Marquer une notification comme lue
  public markNotificationAsRead(notificationId: string): void {
    const notification = this.adminNotifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      // this.saveAdminNotifications(); // Décommenter si vous voulez sauvegarder
    }
  }

  // Marquer toutes les notifications comme lues
  public markAllNotificationsAsRead(): void {
    this.adminNotifications.forEach(n => n.read = true);
    // this.saveAdminNotifications(); // Décommenter si vous voulez sauvegarder
  }

  // Obtenir le nombre de notifications non lues
  public getUnreadNotificationsCount(): number {
    return this.adminNotifications.filter(n => !n.read).length;
  }

  // Créer une conversation automatique quand une candidature est acceptée
  public createConversationForAcceptedApplication(application: InternshipApplication): void {
    try {
      console.log('💬 Création de conversation pour candidature acceptée:', application.id);
      
      // Créer la conversation
      const conversation = {
        id: `conv_${application.id}`,
        name: application.userName,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(application.userName)}&background=random`,
        role: 'candidat' as const,
        lastMessage: `Candidature acceptée pour "${application.internshipTitle}"`,
        lastMessageTime: new Date().toISOString(),
        unreadCount: 0,
        isOnline: false,
        messages: [
          {
            id: `msg_${Date.now()}`,
            content: `Félicitations ! Votre candidature pour "${application.internshipTitle}" a été acceptée. Nous sommes ravis de vous accueillir dans notre équipe.`,
            sender: 'other' as const,
            timestamp: new Date().toISOString(),
            isRead: false,
            type: 'text' as const
          }
        ],
        isImportant: false,
        isArchived: false
      };

      // Sauvegarder dans localStorage
      const existingConversations = JSON.parse(localStorage.getItem('doremi_shared_conversations') || '[]');
      existingConversations.push(conversation);
      localStorage.setItem('doremi_shared_conversations', JSON.stringify(existingConversations));
      
      console.log('✅ Conversation créée:', conversation.id);
    } catch (error) {
      console.error('❌ Erreur lors de la création de conversation:', error);
    }
  }

  // Mettre à jour le statut d'une candidature
  public updateApplicationStatus(
    applicationId: string, 
    status: 'accepted' | 'rejected' | 'reviewed'
  ): { success: boolean; message: string } {
    try {
      const application = this.applications.find(app => app.id === applicationId);
      if (!application) {
        return { success: false, message: 'Candidature non trouvée' };
      }

      application.status = status;
      this.saveApplications();

      // Créer une notification pour le candidat
      this.createCandidateNotification(application, status);

      // Si la candidature est acceptée, créer une conversation
      if (status === 'accepted') {
        this.createConversationForAcceptedApplication(application);
      }

      return { 
        success: true, 
        message: `Statut mis à jour: ${this.getStatusText(status)}` 
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      return { success: false, message: 'Erreur lors de la mise à jour' };
    }
  }

  // Créer une notification pour le candidat
  private createCandidateNotification(application: InternshipApplication, status: string): void {
    const notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: application.userId,
      type: 'application_status',
      title: this.getNotificationTitle(status),
      message: this.getNotificationMessage(application, status),
      timestamp: new Date().toISOString(),
      read: false,
      applicationId: application.id,
      status: status
    };

    // Sauvegarder la notification dans localStorage
    const existingNotifications = JSON.parse(localStorage.getItem('doremi_user_notifications') || '[]');
    existingNotifications.unshift(notification);
    localStorage.setItem('doremi_user_notifications', JSON.stringify(existingNotifications));

    console.log('🔔 Notification candidat créée:', notification);
  }

  private getStatusText(status: string): string {
    switch (status) {
      case 'accepted': return 'Acceptée';
      case 'rejected': return 'Refusée';
      case 'reviewed': return 'En cours';
      default: return 'En attente';
    }
  }

  private getNotificationTitle(status: string): string {
    switch (status) {
      case 'accepted': return '🎉 Candidature acceptée !';
      case 'rejected': return '❌ Candidature refusée';
      case 'reviewed': return '👀 Candidature en cours d\'examen';
      default: return '📋 Mise à jour de candidature';
    }
  }

  private getNotificationMessage(application: InternshipApplication, status: string): string {
    switch (status) {
      case 'accepted': 
        return `Félicitations ! Votre candidature pour "${application.internshipTitle}" a été acceptée. Vous pouvez maintenant échanger avec le recruteur.`;
      case 'rejected': 
        return `Votre candidature pour "${application.internshipTitle}" n'a pas été retenue. Ne vous découragez pas et continuez vos recherches !`;
      case 'reviewed': 
        return `Votre candidature pour "${application.internshipTitle}" est en cours d'examen. Nous vous tiendrons informé.`;
      default: 
        return `Mise à jour concernant votre candidature pour "${application.internshipTitle}".`;
    }
  }

  // Obtenir les notifications d'un utilisateur
  public getUserNotifications(userId: string): any[] {
    try {
      const notifications = JSON.parse(localStorage.getItem('doremi_user_notifications') || '[]');
      return notifications.filter((notif: any) => notif.userId === userId);
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      return [];
    }
  }



  // Obtenir les statistiques des candidatures
  public getApplicationStats() {
    const totalApplications = this.applications.length;
    const pendingApplications = this.applications.filter(app => app.status === 'pending').length;
    const acceptedApplications = this.applications.filter(app => app.status === 'accepted').length;
    const rejectedApplications = this.applications.filter(app => app.status === 'rejected').length;

    // Statistiques par stage
    const applicationsByInternship = this.applications.reduce((acc, app) => {
      acc[app.internshipId] = (acc[app.internshipId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: totalApplications,
      pending: pendingApplications,
      accepted: acceptedApplications,
      rejected: rejectedApplications,
      byInternship: applicationsByInternship
    };
  }

  // Sauvegarder les candidatures
  private saveApplications(): void {
    try {
      console.log('💾 Sauvegarde des candidatures...');
      console.log('📊 Nombre de candidatures à sauvegarder:', this.applications.length);
      
      // Nettoyer les anciennes candidatures (garder seulement les 5 plus récentes)
      if (this.applications.length > 5) {
        this.applications = this.applications
          .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
          .slice(0, 5);
        console.log('🧹 Candidatures nettoyées, gardé:', this.applications.length);
      }

      // Créer une version ultra-optimisée pour le stockage
      const optimizedApplications = this.applications.map(app => {
        const optimized = {
          id: app.id,
          internshipId: app.internshipId,
          internshipTitle: app.internshipTitle?.substring(0, 50), // Limiter le titre
          company: app.company?.substring(0, 30), // Limiter le nom de l'entreprise
          userId: app.userId,
          userName: app.userName?.substring(0, 30), // Limiter le nom
          userEmail: app.userEmail,
          userRole: app.userRole,
          userPhone: app.userPhone,
          cvFileData: app.cvFileData, // Garder les données du CV
          cvFileName: app.cvFileName,
          cvFileSize: app.cvFileSize,
          coverLetter: app.coverLetter?.substring(0, 150), // Limiter encore plus
          appliedAt: app.appliedAt,
          status: app.status
        };
        
        // Vérifier que les données du CV sont présentes
        if (optimized.cvFileData) {
          console.log(`✅ CV préservé pour ${app.userName}:`, optimized.cvFileData.length, 'caractères');
        } else {
          console.warn(`⚠️ CV manquant pour ${app.userName}`);
        }
        
        return optimized;
      });

      const data = JSON.stringify(optimizedApplications);
      console.log('📦 Taille des données à sauvegarder:', data.length, 'caractères');
      
      // Vérifier la taille avant de sauvegarder (limite très stricte)
      if (data.length > 2000000) { // 2MB max
        console.warn('⚠️ Données trop volumineuses, suppression des anciennes candidatures');
        this.applications = this.applications.slice(0, 3); // Garder seulement 3
        localStorage.setItem('doremi_internship_applications', JSON.stringify(this.applications.slice(0, 3)));
      } else {
        localStorage.setItem('doremi_internship_applications', data);
        console.log('✅ Candidatures sauvegardées avec succès');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde des candidatures:', error);
      // En cas d'erreur de stockage, vider et recommencer
      try {
        this.applications = [];
        localStorage.removeItem('doremi_internship_applications');
      } catch (cleanupError) {
        console.error('❌ Erreur lors du nettoyage:', cleanupError);
      }
    }
  }

  // Sauvegarder les notifications admin (DÉSACTIVÉE)
  /*
  private saveAdminNotifications(): void {
    localStorage.setItem('doremi_admin_notifications', JSON.stringify(this.adminNotifications));
  }
  */

  // Sauvegarder les statistiques utilisateur
  private saveUserApplicationStats(userId: string, internshipId: string): void {
    const userStats = JSON.parse(localStorage.getItem('doremi_user_application_stats') || '{}');
    
    if (!userStats[userId]) {
      userStats[userId] = {
        totalApplications: 0,
        applications: [],
        lastApplicationDate: null
      };
    }

    userStats[userId].totalApplications += 1;
    userStats[userId].applications.push({
      internshipId,
      appliedAt: new Date().toISOString()
    });
    userStats[userId].lastApplicationDate = new Date().toISOString();

    localStorage.setItem('doremi_user_application_stats', JSON.stringify(userStats));
  }

  // Obtenir les statistiques d'un utilisateur
  public getUserApplicationStats(userId: string) {
    const userStats = JSON.parse(localStorage.getItem('doremi_user_application_stats') || '{}');
    return userStats[userId] || {
      totalApplications: 0,
      applications: [],
      lastApplicationDate: null
    };
  }

  // Supprimer une candidature (pour l'admin)
  public deleteApplication(applicationId: string): void {
    this.applications = this.applications.filter(app => app.id !== applicationId);
    this.saveApplications();
  }

  // Supprimer une notification admin
  public deleteNotification(notificationId: string): void {
    this.adminNotifications = this.adminNotifications.filter(n => n.id !== notificationId);
    // this.saveAdminNotifications(); // Décommenter si vous voulez sauvegarder
  }

  // Nettoyage d'urgence du localStorage
  public emergencyCleanup(): void {
    try {
      console.log('🚨 NETTOYAGE D\'URGENCE DU LOCALSTORAGE...');
      
      // Sauvegarder seulement les données essentielles
      const essentialData: any = {};
      
      // Garder seulement l'utilisateur connecté
      const currentUser = localStorage.getItem('doremi_user');
      if (currentUser) {
        essentialData.user = currentUser;
      }
      
      // Garder seulement les 3 candidatures les plus récentes
      const applications = JSON.parse(localStorage.getItem('doremi_internship_applications') || '[]');
      if (applications.length > 0) {
        const recentApplications = applications
          .sort((a: any, b: any) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
          .slice(0, 3);
        essentialData.applications = recentApplications;
      }
      
      // Garder seulement les 5 offres les plus récentes
      const offers = JSON.parse(localStorage.getItem('doremi_offers') || '[]');
      if (offers.length > 0) {
        const recentOffers = offers
          .sort((a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
          .slice(0, 5);
        essentialData.offers = recentOffers;
      }
      
      // Vider complètement le localStorage
      localStorage.clear();
      console.log('🗑️ localStorage vidé complètement');
      
      // Restaurer seulement les données essentielles (PAS de notifications admin)
      if (essentialData.user) {
        localStorage.setItem('doremi_user', essentialData.user);
      }
      if (essentialData.applications) {
        localStorage.setItem('doremi_internship_applications', JSON.stringify(essentialData.applications));
      }
      if (essentialData.offers) {
        localStorage.setItem('doremi_offers', JSON.stringify(essentialData.offers));
      }
      
      console.log('✅ Nettoyage d\'urgence terminé - données essentielles restaurées (sans notifications admin)');
    } catch (error) {
      console.error('❌ Erreur lors du nettoyage d\'urgence:', error);
      // En dernier recours, vider tout
      try {
        localStorage.clear();
        console.log('🔄 localStorage vidé en dernier recours');
      } catch (finalError) {
        console.error('❌ Impossible de vider le localStorage:', finalError);
      }
    }
  }

  // Nettoyer le localStorage pour éviter les erreurs de quota
  public cleanupLocalStorage(): void {
    try {
      console.log('🧹 Nettoyage agressif du localStorage...');
      
      // 1. Supprimer complètement les notifications admin (cause de l'erreur)
      localStorage.removeItem('doremi_admin_notifications');
      console.log('✅ Notifications admin supprimées complètement');
      
      // 2. Nettoyer les notifications recruteur (garder seulement 3)
      const recruiterNotifications = JSON.parse(localStorage.getItem('doremi_recruiter_notifications') || '[]');
      if (recruiterNotifications.length > 3) {
        const cleanedNotifications = recruiterNotifications.slice(0, 3);
        localStorage.setItem('doremi_recruiter_notifications', JSON.stringify(cleanedNotifications));
        console.log('✅ Notifications recruteur réduites de', recruiterNotifications.length, 'à', cleanedNotifications.length);
      }
      
      // 3. Nettoyer les candidatures (garder seulement 8)
      const applications = JSON.parse(localStorage.getItem('doremi_internship_applications') || '[]');
      if (applications.length > 8) {
        const cleanedApplications = applications.slice(0, 8);
        localStorage.setItem('doremi_internship_applications', JSON.stringify(cleanedApplications));
        console.log('✅ Candidatures réduites de', applications.length, 'à', cleanedApplications.length);
      }
      
      // 4. Nettoyer les conversations (garder seulement 5)
      const conversations = JSON.parse(localStorage.getItem('doremi_shared_conversations') || '[]');
      if (conversations.length > 5) {
        const cleanedConversations = conversations.slice(0, 5);
        localStorage.setItem('doremi_shared_conversations', JSON.stringify(cleanedConversations));
        console.log('✅ Conversations réduites de', conversations.length, 'à', cleanedConversations.length);
      }
      
      // 5. Nettoyer les messages (garder seulement 3 par conversation)
      const messageData = JSON.parse(localStorage.getItem('doremi_message_data') || '[]');
      if (messageData.length > 3) {
        const cleanedMessageData = messageData.slice(0, 3);
        localStorage.setItem('doremi_message_data', JSON.stringify(cleanedMessageData));
        console.log('✅ Messages réduits de', messageData.length, 'à', cleanedMessageData.length);
      }
      
      // 6. Nettoyer les offres (garder seulement 15)
      const offers = JSON.parse(localStorage.getItem('doremi_offers') || '[]');
      if (offers.length > 15) {
        const cleanedOffers = offers.slice(0, 15);
        localStorage.setItem('doremi_offers', JSON.stringify(cleanedOffers));
        console.log('✅ Offres réduites de', offers.length, 'à', cleanedOffers.length);
      }
      
      // 7. Vérifier l'espace total utilisé
      let totalSize = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          totalSize += localStorage.getItem(key)?.length || 0;
        }
      }
      console.log('📊 Taille totale localStorage après nettoyage:', totalSize, 'caractères');
      
      console.log('✅ Nettoyage localStorage terminé avec succès');
    } catch (error) {
      console.error('❌ Erreur lors du nettoyage localStorage:', error);
      // En cas d'erreur, vider complètement les données non essentielles
      try {
        localStorage.removeItem('doremi_admin_notifications');
        localStorage.removeItem('doremi_recruiter_notifications');
        localStorage.removeItem('doremi_message_data');
        console.log('🔄 Nettoyage d\'urgence effectué');
      } catch (emergencyError) {
        console.error('❌ Erreur lors du nettoyage d\'urgence:', emergencyError);
      }
    }
  }
}

// Export de l'instance singleton
export const internshipService = InternshipService.getInstance();
