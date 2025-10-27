// Service pour consommer l'API des écoles
import { API_CONFIG } from '../config/api';
import { authService } from './authService';

export interface School {
  id: number;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
  logo_url?: string;
  type?: string; // 'public' | 'private' | 'charter'
  level?: string; // 'elementary' | 'middle' | 'high' | 'university'
  accreditation?: string;
  founded?: string;
  student_count?: number;
  faculty_count?: number;
  programs?: string[];
  facilities?: string[];
  images?: string[];
  latitude?: number;
  longitude?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
  // Propriétés supplémentaires pour compatibilité
  [key: string]: unknown;
}

export interface SchoolFilters {
  city?: string;
  country?: string;
  type?: string;
  level?: string;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

class SchoolsService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  /**
   * Construit l'URL complète d'une image
   */
  private buildImageUrl(imagePath: string | null | undefined): string | null {
    if (!imagePath) return null;
    
    // Si c'est déjà une URL complète, la retourner telle quelle
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Sinon, construire l'URL avec la base
    return `${API_CONFIG.IMAGES.BASE_URL}/${imagePath}`;
  }

  /**
   * Récupère la liste des écoles avec filtres et pagination
   */
  async getSchools(filters: SchoolFilters = {}): Promise<PaginatedResponse<School> | School[]> {
    try {
      const params = new URLSearchParams();
      
      // Ajouter les filtres aux paramètres
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const url = `${this.baseUrl}/schools${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      // Traiter les URLs d'images pour chaque école
      if (data.data && Array.isArray(data.data)) {
        // Pagination
        return {
          ...data,
          data: data.data.map((item: School) => ({
            ...item,
            logo_url: this.buildImageUrl(item.logo_url || item.logo),
          }))
        };
      } else if (Array.isArray(data)) {
        // Pas de pagination
        return data.map((item: School) => ({
          ...item,
          logo_url: this.buildImageUrl(item.logo_url || item.logo),
        }));
      }
      
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des écoles:', error);
      throw error;
    }
  }

  /**
   * Récupère une école spécifique par son ID
   */
  async getSchoolById(id: number): Promise<School> {
    try {
      const response = await fetch(`${this.baseUrl}/schools/${id}`, {
        method: 'GET',
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      // Traiter les URLs d'images
      const processedData = {
        ...data,
        logo_url: this.buildImageUrl(data.logo_url || data.logo),
      };
      
      return processedData;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'école ${id}:`, error);
      throw error;
    }
  }

  /**
   * Recherche dans les écoles
   */
  async searchSchools(query: string, filters: Omit<SchoolFilters, 'search'> = {}): Promise<PaginatedResponse<School> | School[]> {
    return this.getSchools({ ...filters, search: query });
  }

  /**
   * Récupère les écoles par ville
   */
  async getSchoolsByCity(city: string): Promise<PaginatedResponse<School> | School[]> {
    return this.getSchools({ city, sort_by: 'name', sort_order: 'asc' });
  }

  /**
   * Récupère les écoles par pays
   */
  async getSchoolsByCountry(country: string): Promise<PaginatedResponse<School> | School[]> {
    return this.getSchools({ country, sort_by: 'name', sort_order: 'asc' });
  }

  /**
   * Récupère les écoles par type
   */
  async getSchoolsByType(type: string): Promise<PaginatedResponse<School> | School[]> {
    return this.getSchools({ type, sort_by: 'name', sort_order: 'asc' });
  }

  /**
   * Récupère les écoles par niveau
   */
  async getSchoolsByLevel(level: string): Promise<PaginatedResponse<School> | School[]> {
    return this.getSchools({ level, sort_by: 'name', sort_order: 'asc' });
  }
}

// Instance singleton du service
export const schoolsService = new SchoolsService();

// Hook personnalisé pour utiliser le service des écoles
export const useSchools = () => {
  return {
    getSchools: schoolsService.getSchools.bind(schoolsService),
    getSchoolById: schoolsService.getSchoolById.bind(schoolsService),
    searchSchools: schoolsService.searchSchools.bind(schoolsService),
    getSchoolsByCity: schoolsService.getSchoolsByCity.bind(schoolsService),
    getSchoolsByCountry: schoolsService.getSchoolsByCountry.bind(schoolsService),
    getSchoolsByType: schoolsService.getSchoolsByType.bind(schoolsService),
    getSchoolsByLevel: schoolsService.getSchoolsByLevel.bind(schoolsService),
  };
};

export default schoolsService;

