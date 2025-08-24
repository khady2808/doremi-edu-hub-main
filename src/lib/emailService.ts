// Service d'email pour les notifications
// Note: Dans un environnement de production, vous utiliseriez un service comme SendGrid, Mailgun, ou AWS SES

export interface EmailNotification {
  to: string;
  subject: string;
  body: string;
  type: 'video' | 'live' | 'general' | 'welcome' | 'registration';
}

export interface UserPreferences {
  email: string;
  videoNotifications: boolean;
  liveNotifications: boolean;
  generalNotifications: boolean;
}

export class EmailService {
  private static instance: EmailService;
  private subscribers: string[] = [];
  private userPreferences: Map<string, UserPreferences> = new Map();

  private constructor() {
    // Charger les abonnés depuis localStorage
    const savedSubscribers = localStorage.getItem('doremi_email_subscribers');
    if (savedSubscribers) {
      this.subscribers = JSON.parse(savedSubscribers);
    }
    
    // Charger les préférences depuis localStorage
    const savedPreferences = localStorage.getItem('doremi_email_preferences');
    if (savedPreferences) {
      const preferences = JSON.parse(savedPreferences);
      this.userPreferences = new Map(Object.entries(preferences));
    }
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  // Ajouter un nouvel abonné
  public subscribe(email: string): void {
    if (!this.subscribers.includes(email)) {
      this.subscribers.push(email);
      this.saveSubscribers();
    }
  }

  // Supprimer un abonné
  public unsubscribe(email: string): void {
    this.subscribers = this.subscribers.filter(sub => sub !== email);
    this.saveSubscribers();
  }

  // Obtenir tous les abonnés
  public getSubscribers(): string[] {
    return [...this.subscribers];
  }

  // Envoyer une notification à tous les abonnés
  public async sendNotificationToAll(notification: Omit<EmailNotification, 'to'>): Promise<void> {
    const promises = this.subscribers
      .filter(email => {
        const preferences = this.userPreferences.get(email);
        if (!preferences) return true; // Par défaut, envoyer si pas de préférences
        
        switch (notification.type) {
          case 'video':
            return preferences.videoNotifications;
          case 'live':
            return preferences.liveNotifications;
          case 'general':
            return preferences.generalNotifications;
          default:
            return true;
        }
      })
      .map(email => 
        this.sendEmail({
          ...notification,
          to: email
        })
      );

    try {
      await Promise.all(promises);
      console.log(`Notification envoyée à ${promises.length} abonnés`);
    } catch (error) {
      console.error('Erreur lors de l\'envoi des notifications:', error);
    }
  }

  // Envoyer un email (simulation)
  private async sendEmail(notification: EmailNotification): Promise<void> {
    // Simulation d'envoi d'email
    // Dans un environnement de production, vous utiliseriez un vrai service d'email
    
    console.log('📧 Email envoyé:', {
      to: notification.to,
      subject: notification.subject,
      body: notification.body,
      type: notification.type
    });

    // Simuler un délai d'envoi
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Sauvegarder les abonnés dans localStorage
  private saveSubscribers(): void {
    localStorage.setItem('doremi_email_subscribers', JSON.stringify(this.subscribers));
  }

  // Sauvegarder les préférences dans localStorage
  private savePreferences(): void {
    const preferencesObj = Object.fromEntries(this.userPreferences);
    localStorage.setItem('doremi_email_preferences', JSON.stringify(preferencesObj));
  }

  // Mettre à jour les préférences d'un utilisateur
  public updatePreferences(email: string, preferences: Partial<UserPreferences>): void {
    const currentPreferences = this.userPreferences.get(email) || {
      email,
      videoNotifications: true,
      liveNotifications: true,
      generalNotifications: true,
    };
    
    this.userPreferences.set(email, { ...currentPreferences, ...preferences });
    this.savePreferences();
  }

  // Obtenir les préférences d'un utilisateur
  public getPreferences(email: string): UserPreferences | null {
    return this.userPreferences.get(email) || null;
  }

  // Créer le contenu d'une notification de bienvenue
  public createWelcomeNotification(userName: string, userEmail: string, role: string): EmailNotification {
    const roleText = role === 'instructor' ? 'formateur' : 'étudiant';
    
    return {
      to: userEmail,
      subject: `🎉 Bienvenue sur DOREMI, ${userName} !`,
      body: `
        Bonjour ${userName} !

        🎉 Félicitations ! Votre compte ${roleText} a été créé avec succès sur la plateforme DOREMI.

        🌟 Que pouvez-vous faire maintenant ?

        ${role === 'instructor' ? `
        📚 Créer des cours et des vidéos
        🔴 Animer des sessions live
        👥 Gérer votre profil de formateur
        📊 Suivre vos statistiques
        ` : `
        📚 Parcourir notre bibliothèque de cours
        🎥 Regarder des vidéos éducatives
        🔴 Rejoindre des sessions live
        📝 Suivre votre progression
        `}

        🚀 Commencez votre parcours d'apprentissage dès maintenant !

        📧 Besoin d'aide ? Contactez-nous à contact@doremi-edu.sn

        Cordialement,
        L'équipe DOREMI
        Dakar, Sénégal
      `,
      type: 'welcome'
    };
  }

  // Créer le contenu d'une notification d'inscription
  public createRegistrationNotification(userName: string, userEmail: string, role: string): EmailNotification {
    const roleText = role === 'instructor' ? 'formateur' : 'étudiant';
    
    return {
      to: userEmail,
      subject: `✅ Inscription confirmée - DOREMI`,
      body: `
        Bonjour ${userName} !

        ✅ Votre inscription en tant que ${roleText} a été confirmée avec succès.

        📋 Détails de votre compte :
        • Nom : ${userName}
        • Email : ${userEmail}
        • Rôle : ${roleText}
        • Date d'inscription : ${new Date().toLocaleDateString('fr-FR')}

        🔐 Votre compte est maintenant actif et sécurisé.

        🎯 Prochaines étapes :
        1. Complétez votre profil
        2. Explorez la plateforme
        3. Commencez votre apprentissage

        📞 Support : +221 33 123 45 67
        📧 Email : contact@doremi-edu.sn

        Merci de nous faire confiance !

        Cordialement,
        L'équipe DOREMI
      `,
      type: 'registration'
    };
  }

  // Créer le contenu d'une notification de vidéo
  public createVideoNotification(instructorName: string, videoTitle: string): Omit<EmailNotification, 'to'> {
    return {
      subject: `🎥 Nouvelle vidéo disponible - ${videoTitle}`,
      body: `
        Bonjour !

        ${instructorName} vient d'ajouter une nouvelle vidéo de cours : "${videoTitle}"

        Connectez-vous à la plateforme DOREMI pour la regarder dès maintenant !

        Cordialement,
        L'équipe DOREMI
      `,
      type: 'video'
    };
  }

  // Créer le contenu d'une notification de live
  public createLiveNotification(instructorName: string, sessionTitle: string, scheduledAt: string): Omit<EmailNotification, 'to'> {
    const date = new Date(scheduledAt).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return {
      subject: `🔴 Session live - ${sessionTitle}`,
      body: `
        Bonjour !

        ${instructorName} va animer une session live : "${sessionTitle}"
        
        Date et heure : ${date}

        Rejoignez la session en direct sur la plateforme DOREMI !

        Cordialement,
        L'équipe DOREMI
      `,
      type: 'live'
    };
  }

  // Envoyer une notification de bienvenue
  public async sendWelcomeEmail(userName: string, userEmail: string, role: string): Promise<void> {
    const welcomeNotification = this.createWelcomeNotification(userName, userEmail, role);
    await this.sendEmail(welcomeNotification);
  }

  // Envoyer une notification d'inscription
  public async sendRegistrationEmail(userName: string, userEmail: string, role: string): Promise<void> {
    const registrationNotification = this.createRegistrationNotification(userName, userEmail, role);
    await this.sendEmail(registrationNotification);
  }
}

// Export de l'instance singleton
export const emailService = EmailService.getInstance(); 