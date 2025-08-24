// Service de monétisation pour les formateurs
export interface VideoRevenue {
  videoId: string;
  title: string;
  views: number;
  revenue: number;
  instructorId: string;
  createdAt: string;
}

export interface InstructorRevenueStats {
  totalViews: number;
  totalRevenue: number;
  monthlyRevenue: number;
  videoCount: number;
  averageViewsPerVideo: number;
  topVideo: {
    title: string;
    views: number;
    revenue: number;
  } | null;
  monthlyGrowth: number;
}

// Taux de monétisation (€ par 1000 vues)
const MONETIZATION_RATE = 2.5;

class InstructorRevenueService {
  private revenueData: VideoRevenue[] = [];

  constructor() {
    this.loadRevenueData();
  }

  private loadRevenueData() {
    try {
      const stored = localStorage.getItem('doremi_instructor_revenue');
      if (stored) {
        this.revenueData = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données de revenus:', error);
      this.revenueData = [];
    }
  }

  private saveRevenueData() {
    try {
      localStorage.setItem('doremi_instructor_revenue', JSON.stringify(this.revenueData));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données de revenus:', error);
    }
  }

  // Ajouter une vue à une vidéo
  addView(videoId: string, instructorId: string, videoTitle: string) {
    const existingRevenue = this.revenueData.find(r => r.videoId === videoId);
    
    if (existingRevenue) {
      existingRevenue.views += 1;
      existingRevenue.revenue = (existingRevenue.views / 1000) * MONETIZATION_RATE;
    } else {
      const newRevenue: VideoRevenue = {
        videoId,
        title: videoTitle,
        views: 1,
        revenue: (1 / 1000) * MONETIZATION_RATE,
        instructorId,
        createdAt: new Date().toISOString()
      };
      this.revenueData.push(newRevenue);
    }

    this.saveRevenueData();
    return this.getVideoRevenue(videoId);
  }

  // Obtenir les revenus d'une vidéo spécifique
  getVideoRevenue(videoId: string): VideoRevenue | null {
    return this.revenueData.find(r => r.videoId === videoId) || null;
  }

  // Obtenir toutes les statistiques de revenus d'un formateur
  getInstructorStats(instructorId: string): InstructorRevenueStats {
    const instructorVideos = this.revenueData.filter(r => r.instructorId === instructorId);
    
    if (instructorVideos.length === 0) {
      return {
        totalViews: 0,
        totalRevenue: 0,
        monthlyRevenue: 0,
        videoCount: 0,
        averageViewsPerVideo: 0,
        topVideo: null,
        monthlyGrowth: 0
      };
    }

    const totalViews = instructorVideos.reduce((sum, video) => sum + video.views, 0);
    const totalRevenue = instructorVideos.reduce((sum, video) => sum + video.revenue, 0);
    const videoCount = instructorVideos.length;
    const averageViewsPerVideo = totalViews / videoCount;

    // Trouver la vidéo la plus populaire
    const topVideo = instructorVideos.reduce((max, video) => 
      video.views > max.views ? video : max
    );

    // Calculer le revenu mensuel (simulation basée sur les 30 derniers jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentVideos = instructorVideos.filter(video => 
      new Date(video.createdAt) > thirtyDaysAgo
    );
    
    const monthlyRevenue = recentVideos.reduce((sum, video) => sum + video.revenue, 0);

    // Calculer la croissance mensuelle (simulation)
    const monthlyGrowth = Math.random() * 40 - 10; // Entre -10% et +30%

    return {
      totalViews,
      totalRevenue,
      monthlyRevenue,
      videoCount,
      averageViewsPerVideo,
      topVideo: {
        title: topVideo.title,
        views: topVideo.views,
        revenue: topVideo.revenue
      },
      monthlyGrowth
    };
  }

  // Obtenir toutes les vidéos d'un formateur avec leurs revenus
  getInstructorVideos(instructorId: string): VideoRevenue[] {
    return this.revenueData.filter(r => r.instructorId === instructorId);
  }

  // Supprimer les données de revenus d'une vidéo
  removeVideoRevenue(videoId: string) {
    this.revenueData = this.revenueData.filter(r => r.videoId !== videoId);
    this.saveRevenueData();
  }

  // Obtenir le taux de monétisation
  getMonetizationRate(): number {
    return MONETIZATION_RATE;
  }

  // Calculer les revenus pour un nombre de vues donné
  calculateRevenue(views: number): number {
    return (views / 1000) * MONETIZATION_RATE;
  }

  // Formater une somme en euros
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  // Formater un nombre avec séparateurs
  formatNumber(num: number): string {
    return new Intl.NumberFormat('fr-FR').format(num);
  }

  // Obtenir les statistiques globales de la plateforme
  getPlatformStats() {
    const totalViews = this.revenueData.reduce((sum, video) => sum + video.views, 0);
    const totalRevenue = this.revenueData.reduce((sum, video) => sum + video.revenue, 0);
    const totalVideos = this.revenueData.length;
    const uniqueInstructors = new Set(this.revenueData.map(v => v.instructorId)).size;

    return {
      totalViews,
      totalRevenue,
      totalVideos,
      uniqueInstructors,
      averageViewsPerVideo: totalVideos > 0 ? totalViews / totalVideos : 0
    };
  }

  // Nettoyer les anciennes données (plus de 1 an)
  cleanupOldData() {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    this.revenueData = this.revenueData.filter(video => 
      new Date(video.createdAt) > oneYearAgo
    );
    
    this.saveRevenueData();
  }
}

// Instance singleton
export const instructorRevenueService = new InstructorRevenueService();
