// Service pour l'intégration avec votre backend API
import { Course, CourseWithDetails, CourseFilters, CourseStats } from './courseService';

// Configuration de votre API
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const API_TOKEN = process.env.VITE_API_TOKEN || '';

// Headers par défaut
const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  ...(API_TOKEN && { 'Authorization': `Bearer ${API_TOKEN}` })
};

class CourseApiService {
  // Méthode utilitaire pour les requêtes
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erreur API ${endpoint}:`, error);
      throw error;
    }
  }

  // Récupérer tous les cours avec filtres
  async getCourses(filters: CourseFilters = {}): Promise<CourseWithDetails[]> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.level) params.append('level', filters.level);
    if (filters.educationLevel) params.append('education_level', filters.educationLevel);
    if (filters.isPremium !== undefined) params.append('is_premium', filters.isPremium.toString());
    if (filters.teacherId) params.append('teacher_id', filters.teacherId);
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.offset) params.append('offset', filters.offset.toString());

    const queryString = params.toString();
    const endpoint = `/courses${queryString ? `?${queryString}` : ''}`;
    
    return this.request<CourseWithDetails[]>(endpoint);
  }

  // Récupérer un cours par ID
  async getCourseById(courseId: string): Promise<CourseWithDetails | null> {
    try {
      return await this.request<CourseWithDetails>(`/courses/${courseId}`);
    } catch (error) {
      console.error('Erreur lors de la récupération du cours:', error);
      return null;
    }
  }

  // Récupérer les cours d'un enseignant
  async getCoursesByTeacher(teacherId: string): Promise<CourseWithDetails[]> {
    return this.request<CourseWithDetails[]>(`/teachers/${teacherId}/courses`);
  }

  // Récupérer les cours suivis par un utilisateur
  async getEnrolledCourses(userId: string): Promise<CourseWithDetails[]> {
    return this.request<CourseWithDetails[]>(`/users/${userId}/enrolled-courses`);
  }

  // Créer un nouveau cours
  async createCourse(courseData: Omit<Course, 'id' | 'createdAt' | 'rating' | 'studentsCount'>): Promise<CourseWithDetails> {
    return this.request<CourseWithDetails>('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  }

  // Mettre à jour un cours
  async updateCourse(courseId: string, updates: Partial<Course>): Promise<CourseWithDetails> {
    return this.request<CourseWithDetails>(`/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Supprimer un cours
  async deleteCourse(courseId: string): Promise<boolean> {
    await this.request(`/courses/${courseId}`, {
      method: 'DELETE',
    });
    return true;
  }

  // S'inscrire à un cours
  async enrollInCourse(userId: string, courseId: string): Promise<boolean> {
    await this.request(`/courses/${courseId}/enroll`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    });
    return true;
  }

  // Mettre à jour la progression d'un cours
  async updateCourseProgress(userId: string, courseId: string, progress: number): Promise<boolean> {
    await this.request(`/courses/${courseId}/progress`, {
      method: 'POST',
      body: JSON.stringify({ 
        user_id: userId, 
        progress: Math.min(100, Math.max(0, progress)) 
      }),
    });
    return true;
  }

  // Récupérer les statistiques des cours
  async getCourseStats(): Promise<CourseStats> {
    return this.request<CourseStats>('/courses/stats');
  }

  // Rechercher des cours
  async searchCourses(query: string, filters: Omit<CourseFilters, 'search'> = {}): Promise<CourseWithDetails[]> {
    return this.getCourses({ ...filters, search: query });
  }

  // Récupérer les cours populaires
  async getPopularCourses(limit: number = 10): Promise<CourseWithDetails[]> {
    return this.request<CourseWithDetails[]>(`/courses/popular?limit=${limit}`);
  }

  // Récupérer les cours récents
  async getRecentCourses(limit: number = 10): Promise<CourseWithDetails[]> {
    return this.request<CourseWithDetails[]>(`/courses/recent?limit=${limit}`);
  }
}

export const courseApiService = new CourseApiService();
