// Service pour l'intégration avec votre backend Laravel
import { Course, CourseWithDetails, CourseFilters, CourseStats } from './courseService';

// Configuration de votre API Laravel
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const API_TOKEN = process.env.VITE_API_TOKEN || '';

// Headers par défaut
const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  ...(API_TOKEN && { 'Authorization': `Bearer ${API_TOKEN}` })
};

class CourseLaravelService {
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
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
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
    
    // Mapping des filtres vers les paramètres de l'API Laravel
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.level) params.append('difficulty_level', filters.level);
    if (filters.educationLevel) params.append('education_level', filters.educationLevel);
    if (filters.isPremium !== undefined) params.append('is_premium', filters.isPremium.toString());
    if (filters.teacherId) params.append('teacher_id', filters.teacherId);
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.offset) params.append('offset', filters.offset.toString());

    // Tri par défaut
    params.append('sort_by', 'created_at');
    params.append('sort_order', 'desc');

    const queryString = params.toString();
    const endpoint = `/courses${queryString ? `?${queryString}` : ''}`;
    
    const courses = await this.request<Course[]>(endpoint);
    return courses.map(this.transformCourseData);
  }

  // Récupérer un cours par ID
  async getCourseById(courseId: string): Promise<CourseWithDetails | null> {
    try {
      const course = await this.request<Course>(`/courses/${courseId}`);
      return this.transformCourseData(course);
    } catch (error) {
      console.error('Erreur lors de la récupération du cours:', error);
      return null;
    }
  }

  // Récupérer les cours d'un enseignant
  async getCoursesByTeacher(teacherId: string): Promise<CourseWithDetails[]> {
    const courses = await this.request<Course[]>(`/courses?teacher_id=${teacherId}`);
    return courses.map(this.transformCourseData);
  }

  // Récupérer les cours suivis par un utilisateur
  async getEnrolledCourses(userId: string): Promise<CourseWithDetails[]> {
    // Note: Cette route n'existe pas encore dans votre API, 
    // vous devrez l'implémenter ou utiliser une autre approche
    try {
      const courses = await this.request<Course[]>(`/users/${userId}/courses`);
      return courses.map(this.transformCourseData);
    } catch (error) {
      console.warn('Route des cours suivis non disponible:', error);
      return [];
    }
  }

  // Créer un nouveau cours
  async createCourse(courseData: Omit<Course, 'id' | 'createdAt' | 'rating' | 'studentsCount'>): Promise<CourseWithDetails> {
    const laravelData = {
      title: courseData.title,
      description: courseData.description,
      thumbnail: courseData.thumbnail,
      duration: courseData.duration,
      chapters_count: courseData.chaptersCount,
      price: courseData.price || 0,
      theme: courseData.category, // Mapping vers theme
      level: courseData.educationLevel, // Mapping vers level
      difficulty_level: courseData.level,
      category: courseData.category,
      education_level: courseData.educationLevel,
      is_premium: courseData.isPremium,
      teacher_id: courseData.instructorId,
      school: 'DOREMI' // Valeur par défaut
    };

    const course = await this.request<Course>('/courses', {
      method: 'POST',
      body: JSON.stringify(laravelData),
    });

    return this.transformCourseData(course);
  }

  // Mettre à jour un cours
  async updateCourse(courseId: string, updates: Partial<Course>): Promise<CourseWithDetails> {
    const laravelData: any = {};
    
    if (updates.title) laravelData.title = updates.title;
    if (updates.description) laravelData.description = updates.description;
    if (updates.thumbnail) laravelData.thumbnail = updates.thumbnail;
    if (updates.duration) laravelData.duration = updates.duration;
    if (updates.chaptersCount) laravelData.chapters_count = updates.chaptersCount;
    if (updates.price !== undefined) laravelData.price = updates.price;
    if (updates.category) {
      laravelData.theme = updates.category;
      laravelData.category = updates.category;
    }
    if (updates.level) laravelData.difficulty_level = updates.level;
    if (updates.educationLevel) {
      laravelData.level = updates.educationLevel;
      laravelData.education_level = updates.educationLevel;
    }
    if (updates.isPremium !== undefined) laravelData.is_premium = updates.isPremium;

    const course = await this.request<Course>(`/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(laravelData),
    });

    return this.transformCourseData(course);
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
    // Note: Cette route n'existe pas encore dans votre API
    // Vous devrez l'implémenter ou utiliser une autre approche
    try {
      await this.request(`/courses/${courseId}/enroll`, {
        method: 'POST',
        body: JSON.stringify({ user_id: userId }),
      });
      return true;
    } catch (error) {
      console.warn('Route d\'inscription non disponible:', error);
      return false;
    }
  }

  // Mettre à jour la progression d'un cours
  async updateCourseProgress(userId: string, courseId: string, progress: number): Promise<boolean> {
    try {
      await this.request(`/users/${userId}/courses/${courseId}/progression`, {
        method: 'POST',
        body: JSON.stringify({ 
          progress: Math.min(100, Math.max(0, progress)) 
        }),
      });
      return true;
    } catch (error) {
      console.warn('Route de progression non disponible:', error);
      return false;
    }
  }

  // Récupérer les statistiques des cours
  async getCourseStats(): Promise<CourseStats> {
    try {
      // Note: Cette route n'existe pas encore dans votre API
      // Vous devrez l'implémenter ou calculer côté client
      const courses = await this.request<Course[]>('/courses');
      
      const totalCourses = courses.length;
      const totalStudents = courses.reduce((sum, course) => sum + (course.students_count || 0), 0);
      const averageRating = courses.reduce((sum, course) => sum + (course.rating || 0), 0) / totalCourses || 0;

      const categoriesCount = courses.reduce((acc, course) => {
        const category = course.category || 'Autre';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalCourses,
        totalStudents,
        averageRating: Math.round(averageRating * 10) / 10,
        categoriesCount
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }

  // Rechercher des cours
  async searchCourses(query: string, filters: Omit<CourseFilters, 'search'> = {}): Promise<CourseWithDetails[]> {
    return this.getCourses({ ...filters, search: query });
  }

  // Récupérer les cours populaires
  async getPopularCourses(limit: number = 10): Promise<CourseWithDetails[]> {
    const courses = await this.request<Course[]>(`/courses?sort_by=students_count&sort_order=desc&limit=${limit}`);
    return courses.map(this.transformCourseData);
  }

  // Récupérer les cours récents
  async getRecentCourses(limit: number = 10): Promise<CourseWithDetails[]> {
    const courses = await this.request<Course[]>(`/courses?sort_by=created_at&sort_order=desc&limit=${limit}`);
    return courses.map(this.transformCourseData);
  }

  // Transformer les données de l'API Laravel vers l'interface Course
  private transformCourseData(data: any): CourseWithDetails {
    return {
      id: data.id.toString(),
      title: data.title,
      description: data.description || '',
      instructor: data.teacher?.name || data.teacher?.first_name + ' ' + data.teacher?.last_name || 'Inconnu',
      instructorId: data.teacher_id?.toString() || data.teacher?.id?.toString() || '',
      thumbnail: data.thumbnail || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop&crop=center',
      category: data.category || data.theme || 'Général',
      level: data.difficulty_level || 'beginner',
      educationLevel: data.education_level || data.level || 'etudiant',
      duration: data.duration || '0h 0min',
      chaptersCount: data.chapters_count || 0,
      isPremium: data.is_premium || false,
      price: data.price || 0,
      rating: data.rating || 0,
      studentsCount: data.students_count || 0,
      progress: data.progress || 0,
      createdAt: data.created_at || new Date().toISOString(),
      teacher: data.teacher ? {
        id: data.teacher.id?.toString() || '',
        name: data.teacher.name || `${data.teacher.first_name} ${data.teacher.last_name}`,
        avatar: data.teacher.avatar_url || data.teacher.photo_url
      } : undefined,
      isEnrolled: data.isEnrolled || false,
      isFavorite: data.isFavorite || false
    };
  }
}

export const courseLaravelService = new CourseLaravelService();
