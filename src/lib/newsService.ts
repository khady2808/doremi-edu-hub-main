// Service pour consommer l'API des actualités
import { API_CONFIG, buildApiUrl, buildImageUrl } from '../config/api';
import { authService } from './authService';

export interface NewsItem {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  image?: string;
  image_url?: string;
  featured_image?: string;
  featured_image_url?: string;
  author: {
    name: string;
    email: string;
    avatar: string;
  } | string;
  author_id?: number;
  location?: string;
  read_time?: string;
  type: 'news' | 'scholarship' | 'announcement';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  is_urgent: boolean;
  category?: string;
  subcategory?: string;
  tags?: string[];
  target_audience?: string[];
  meta_description?: string;
  meta_keywords?: string;
  gallery?: string[];
  published_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
  views_count: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  // Propriétés pour compatibilité avec l'ancienne interface
  views?: number;
  likes?: number;
  shares?: number;
  comments?: number;
  publishDate?: string;
  lastModified?: string;
}

export interface NewsFilters {
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  type?: 'news' | 'scholarship' | 'announcement';
  featured?: boolean;
  urgent?: boolean;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface NewsStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
  featured: number;
  urgent: number;
  total_views: number;
  total_likes: number;
  total_comments: number;
  total_shares: number;
  by_category: Array<{ category: string; count: number }>;
  by_priority: Array<{ priority: string; count: number }>;
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

class NewsService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  /**
   * Construit l'URL complète d'une image
   */
  private buildImageUrl(imagePath: string | null | undefined): string | null {
    if (!imagePath) return null;
    return buildImageUrl(imagePath);
  }

  /**
   * Récupère la liste des actualités avec filtres et pagination
   */
  async getNews(filters: NewsFilters = {}): Promise<PaginatedResponse<NewsItem>> {
    try {
      const params = new URLSearchParams();
      
      // Ajouter les filtres aux paramètres
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`${this.baseUrl}/news?${params.toString()}`, {
        method: 'GET',
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      // Traiter les URLs d'images pour chaque actualité
      if (data.data && Array.isArray(data.data)) {
        data.data = data.data.map((item: NewsItem) => ({
          ...item,
          image_url: this.buildImageUrl(item.image_url || item.image),
          featured_image_url: this.buildImageUrl(item.featured_image)
        }));
      }
      
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des actualités:', error);
      throw error;
    }
  }

  /**
   * Récupère une actualité spécifique par son ID
   */
  async getNewsById(id: number): Promise<NewsItem> {
    try {
      const response = await fetch(`${this.baseUrl}/news/${id}`, {
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
        image_url: this.buildImageUrl(data.image_url || data.image),
        featured_image_url: this.buildImageUrl(data.featured_image)
      };
      
      return processedData;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'actualité ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques des actualités
   */
  async getNewsStats(): Promise<NewsStats> {
    try {
      const response = await fetch(`${this.baseUrl}/news/stats`, {
        method: 'GET',
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }

  /**
   * Incrémente le nombre de likes d'une actualité
   */
  async likeNews(id: number): Promise<{ message: string; likes_count: number }> {
    try {
      const response = await fetch(`${this.baseUrl}/news/${id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Erreur lors du like de l'actualité ${id}:`, error);
      throw error;
    }
  }

  /**
   * Incrémente le nombre de partages d'une actualité
   */
  async shareNews(id: number): Promise<{ message: string; shares_count: number }> {
    try {
      const response = await fetch(`${this.baseUrl}/news/${id}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Erreur lors du partage de l'actualité ${id}:`, error);
      throw error;
    }
  }

  /**
   * Incrémente le nombre de commentaires d'une actualité
   */
  async commentNews(id: number): Promise<{ message: string; comments_count: number }> {
    try {
      const response = await fetch(`${this.baseUrl}/news/${id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Erreur lors du commentaire de l'actualité ${id}:`, error);
      throw error;
    }
  }

  /**
   * Recherche dans les actualités
   */
  async searchNews(query: string, filters: Omit<NewsFilters, 'search'> = {}): Promise<PaginatedResponse<NewsItem>> {
    return this.getNews({ ...filters, search: query });
  }

  /**
   * Récupère les actualités en vedette
   */
  async getFeaturedNews(): Promise<PaginatedResponse<NewsItem>> {
    return this.getNews({ featured: true, sort_by: 'created_at', sort_order: 'desc' });
  }

  /**
   * Récupère les actualités urgentes
   */
  async getUrgentNews(): Promise<PaginatedResponse<NewsItem>> {
    return this.getNews({ urgent: true, sort_by: 'created_at', sort_order: 'desc' });
  }

  /**
   * Récupère les actualités par catégorie
   */
  async getNewsByCategory(category: string): Promise<PaginatedResponse<NewsItem>> {
    return this.getNews({ category, sort_by: 'created_at', sort_order: 'desc' });
  }

  /**
   * Récupère les actualités par type
   */
  async getNewsByType(type: 'news' | 'scholarship' | 'announcement'): Promise<PaginatedResponse<NewsItem>> {
    return this.getNews({ type, sort_by: 'created_at', sort_order: 'desc' });
  }

  /**
   * Crée une nouvelle actualité (Admin)
   */
  async createNews(newsData: Partial<NewsItem>, imageFile?: File): Promise<NewsItem> {
    const formData = new FormData();
    
    // Ajouter les données de l'actualité
    Object.entries(newsData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          // Pour les tableaux (comme tags), envoyer chaque élément séparément
          value.forEach((item, index) => {
            formData.append(`${key}[${index}]`, item.toString());
          });
        } else if (typeof value === 'boolean') {
          // Pour les booleans, envoyer '1' pour true et '0' pour false
          formData.append(key, value ? '1' : '0');
        } else {
          formData.append(key, value.toString());
        }
      }
    });
    
    // Ajouter le fichier image si fourni
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const response = await fetch(`${this.baseUrl}/news`, {
      method: 'POST',
      headers: {
        'Authorization': authService.getAuthHeaders().Authorization || '',
        'Accept': 'application/json',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erreur lors de la création: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Met à jour une actualité (Admin)
   */
  async updateNews(id: number, newsData: Partial<NewsItem>, imageFile?: File): Promise<NewsItem> {
    const formData = new FormData();
    
    // Ajouter les données de l'actualité
    Object.entries(newsData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          // Pour les tableaux (comme tags), envoyer chaque élément séparément
          value.forEach((item, index) => {
            formData.append(`${key}[${index}]`, item.toString());
          });
        } else if (typeof value === 'boolean') {
          // Pour les booleans, envoyer '1' pour true et '0' pour false
          formData.append(key, value ? '1' : '0');
        } else {
          formData.append(key, value.toString());
        }
      }
    });
    
    // Ajouter le fichier image si fourni
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const response = await fetch(`${this.baseUrl}/news/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': authService.getAuthHeaders().Authorization || '',
        'Accept': 'application/json',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erreur lors de la mise à jour: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Supprime une actualité (Admin)
   */
  async deleteNews(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/news/${id}`, {
      method: 'DELETE',
      headers: authService.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erreur lors de la suppression: ${response.status}`);
    }
  }

  /**
   * Bascule le statut "en vedette" d'une actualité (Admin)
   */
  async toggleFeatured(id: number): Promise<NewsItem> {
    const response = await fetch(`${this.baseUrl}/news/${id}/toggle-featured`, {
      method: 'PATCH',
      headers: authService.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erreur lors du basculement: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Bascule le statut "urgent" d'une actualité (Admin)
   */
  async toggleUrgent(id: number): Promise<NewsItem> {
    const response = await fetch(`${this.baseUrl}/news/${id}/toggle-urgent`, {
      method: 'PATCH',
      headers: authService.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erreur lors du basculement: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Publie une actualité (Admin)
   */
  async publishNews(id: number): Promise<NewsItem> {
    const response = await fetch(`${this.baseUrl}/news/${id}/publish`, {
      method: 'PATCH',
      headers: authService.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erreur lors de la publication: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Archive une actualité (Admin)
   */
  async archiveNews(id: number): Promise<NewsItem> {
    const response = await fetch(`${this.baseUrl}/news/${id}/archive`, {
      method: 'PATCH',
      headers: authService.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erreur lors de l'archivage: ${response.status}`);
    }

    return response.json();
  }
}

// Instance singleton du service
export const newsService = new NewsService();

// Hook personnalisé pour utiliser le service des actualités
export const useNews = () => {
  return {
    getNews: newsService.getNews.bind(newsService),
    getNewsById: newsService.getNewsById.bind(newsService),
    getNewsStats: newsService.getNewsStats.bind(newsService),
    likeNews: newsService.likeNews.bind(newsService),
    shareNews: newsService.shareNews.bind(newsService),
    commentNews: newsService.commentNews.bind(newsService),
    searchNews: newsService.searchNews.bind(newsService),
    getFeaturedNews: newsService.getFeaturedNews.bind(newsService),
    getUrgentNews: newsService.getUrgentNews.bind(newsService),
    getNewsByCategory: newsService.getNewsByCategory.bind(newsService),
    getNewsByType: newsService.getNewsByType.bind(newsService),
    // Méthodes admin
    createNews: newsService.createNews.bind(newsService),
    updateNews: newsService.updateNews.bind(newsService),
    deleteNews: newsService.deleteNews.bind(newsService),
    toggleFeatured: newsService.toggleFeatured.bind(newsService),
    toggleUrgent: newsService.toggleUrgent.bind(newsService),
    publishNews: newsService.publishNews.bind(newsService),
    archiveNews: newsService.archiveNews.bind(newsService),
  };
};

export default newsService;
