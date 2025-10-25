import { API_CONFIG, buildApiUrl } from '@/config/api';

// Interface pour les données de stage de l'API (format Laravel)
export interface ApiInternship {
  id: number;
  title: string;
  description: string;
  company: string;
  location: string;
  start_date: string | null;
  end_date: string | null;
  duration: string | null;
  requirements: string | null;
  benefits: string | null;
  salary: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  status: string;
  created_by: number | null;
  created_at: string;
  updated_at: string;
}

// Interface pour les données de stage transformées
export interface Internship {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  type: 'stage' | 'alternance' | 'emploi';
  duration: string;
  requirements: string[];
  benefits: string[];
  applicationDeadline: string;
  salary?: string;
  remote: boolean;
  status: 'active' | 'expired' | 'closed';
  createdAt: string;
  updatedAt: string;
  // Champs supplémentaires pour l'interface
  views?: number;
  applications?: number;
  rating?: number;
  logo?: string;
  image?: string;
  tags?: string[];
}

// Interface pour la réponse de l'API
interface ApiResponse<T> {
  data: T;
  message?: string;
  status: string;
}

// Interface pour les paramètres de recherche
export interface SearchParams {
  search?: string;
  type?: string;
  location?: string;
  remote?: boolean;
  page?: number;
  per_page?: number;
}

class InternshipApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = buildApiUrl(API_CONFIG.ENDPOINTS.INTERNSHIPS);
  }

  // Transformer les données de l'API vers le format interne
  private transformApiData(apiData: ApiInternship): Internship {
    // Utiliser end_date comme deadline, ou générer une date si absente
    const deadline = apiData.end_date 
      ? new Date(apiData.end_date).toISOString()
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 jours par défaut
    
    return {
      id: apiData.id.toString(),
      title: apiData.title,
      description: apiData.description,
      company: apiData.company,
      location: apiData.location,
      type: 'stage', // Par défaut, toutes les offres sont des stages
      duration: apiData.duration || 'Non spécifié',
      requirements: apiData.requirements ? this.parseArrayField(apiData.requirements) : [],
      benefits: apiData.benefits ? this.parseArrayField(apiData.benefits) : [],
      applicationDeadline: deadline,
      salary: apiData.salary || undefined,
      remote: false, // Par défaut non-remote
      status: this.mapStatus(apiData.status),
      createdAt: apiData.created_at,
      updatedAt: apiData.updated_at,
      // Valeurs par défaut pour l'interface
      views: Math.floor(Math.random() * 1000) + 100,
      applications: Math.floor(Math.random() * 50) + 1,
      rating: 4.0 + Math.random() * 1.0,
      logo: `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&seed=${apiData.company}`,
      image: `https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop&seed=${apiData.title}`,
      tags: this.generateTags('stage', apiData.location)
    };
  }

  // Mapper le type d'API vers le type interne
  private mapType(apiType: string): 'stage' | 'alternance' | 'emploi' {
    const typeMap: Record<string, 'stage' | 'alternance' | 'emploi'> = {
      'stage': 'stage',
      'internship': 'stage',
      'alternance': 'alternance',
      'apprenticeship': 'alternance',
      'emploi': 'emploi',
      'job': 'emploi',
      'cdi': 'emploi',
      'cdd': 'emploi'
    };
    return typeMap[apiType.toLowerCase()] || 'stage';
  }

  // Mapper le statut d'API vers le statut interne
  private mapStatus(apiStatus: string): 'active' | 'expired' | 'closed' {
    const statusMap: Record<string, 'active' | 'expired' | 'closed'> = {
      'active': 'active',
      'published': 'active',
      'expired': 'expired',
      'closed': 'closed',
      'inactive': 'closed'
    };
    return statusMap[apiStatus.toLowerCase()] || 'active';
  }

  // Parser un champ qui peut contenir des données séparées par des virgules ou des points-virgules
  private parseArrayField(field: string): string[] {
    if (!field) return [];
    return field.split(/[,;]/).map(item => item.trim()).filter(item => item.length > 0);
  }

  // Générer des tags basés sur le type et la localisation
  private generateTags(type: string, location: string): string[] {
    const tags: string[] = ['Stage', 'Formation'];
    
    // Tags basés sur la localisation
    if (location && location.toLowerCase().includes('dakar')) {
      tags.push('Dakar');
    } else if (location && location.toLowerCase().includes('thiès')) {
      tags.push('Thiès');
    } else if (location && location.toLowerCase().includes('saint-louis')) {
      tags.push('Saint-Louis');
    }

    return tags;
  }

  // Récupérer toutes les offres de stage
  async getAllInternships(params: SearchParams = {}): Promise<Internship[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.search) queryParams.append('search', params.search);
      if (params.type) queryParams.append('type', params.type);
      if (params.location) queryParams.append('location', params.location);
      if (params.remote !== undefined) queryParams.append('remote', params.remote.toString());
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.per_page) queryParams.append('per_page', params.per_page.toString());

      const url = `${this.baseUrl}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      console.log('🔗 Appel API vers:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: API_CONFIG.DEFAULT_HEADERS,
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📦 Données reçues de l\'API:', data);

      // L'API retourne directement un tableau ou un objet avec une propriété data
      const internships = Array.isArray(data) ? data : data.data || [];
      
      // Transformer les données
      const transformedInternships = internships.map((internship: ApiInternship) => 
        this.transformApiData(internship)
      );

      console.log('🔄 Données transformées:', transformedInternships);
      return transformedInternships;

    } catch (error) {
      console.error('❌ Erreur lors de la récupération des stages:', error);
      throw error;
    }
  }

  // Récupérer un stage par ID
  async getInternshipById(id: string): Promise<Internship | null> {
    try {
      const url = `${this.baseUrl}/${id}`;
      
      console.log('🔗 Appel API vers:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: API_CONFIG.DEFAULT_HEADERS,
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📦 Données reçues de l\'API:', data);

      // L'API retourne directement l'objet ou un objet avec une propriété data
      const internship = data.data || data;
      
      return this.transformApiData(internship);

    } catch (error) {
      console.error(`❌ Erreur lors de la récupération du stage ${id}:`, error);
      throw error;
    }
  }

  // Rechercher des stages
  async searchInternships(searchTerm: string, filters: Omit<SearchParams, 'search'> = {}): Promise<Internship[]> {
    return this.getAllInternships({
      search: searchTerm,
      ...filters
    });
  }

  // Récupérer les statistiques des stages
  async getInternshipStats(): Promise<{
    total: number;
    active: number;
    expired: number;
    closed: number;
    byType: Record<string, number>;
    byLocation: Record<string, number>;
  }> {
    try {
      const internships = await this.getAllInternships();
      
      const stats = {
        total: internships.length,
        active: internships.filter(i => i.status === 'active').length,
        expired: internships.filter(i => i.status === 'expired').length,
        closed: internships.filter(i => i.status === 'closed').length,
        byType: {} as Record<string, number>,
        byLocation: {} as Record<string, number>
      };

      // Compter par type
      internships.forEach(internship => {
        stats.byType[internship.type] = (stats.byType[internship.type] || 0) + 1;
      });

      // Compter par localisation
      internships.forEach(internship => {
        const location = internship.location.split(',')[0].trim();
        stats.byLocation[location] = (stats.byLocation[location] || 0) + 1;
      });

      return stats;

    } catch (error) {
      console.error('❌ Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }

  // Tester la connectivité avec l'API
  async testConnectivity(): Promise<{
    success: boolean;
    message: string;
    data?: any;
  }> {
    try {
      console.log('🧪 Test de connectivité vers l\'API des stages...');
      
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: API_CONFIG.DEFAULT_HEADERS,
      });

      if (!response.ok) {
        return {
          success: false,
          message: `Erreur HTTP: ${response.status} ${response.statusText}`
        };
      }

      const data = await response.json();
      
      return {
        success: true,
        message: 'Connexion à l\'API réussie',
        data: data
      };

    } catch (error) {
      console.error('❌ Erreur de connectivité:', error);
      return {
        success: false,
        message: `Erreur de connexion: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      };
    }
  }
}

// Instance singleton du service
export const internshipApiService = new InternshipApiService();
export default internshipApiService;
