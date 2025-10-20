import { supabase } from '@/integrations/supabase/client';
import { Course, Chapter, EducationLevel } from '@/types/course';
import { Tables } from '@/integrations/supabase/types';

// Types pour les données Supabase
type CourseRow = Tables<'courses'>;
type ProgressRow = Tables<'progress'>;

// Interface pour les cours avec les données jointes
export interface CourseWithDetails extends Course {
  teacher?: {
    id: string;
    name: string;
    avatar?: string;
  };
  progress?: number;
  isEnrolled?: boolean;
  isFavorite?: boolean;
}

// Interface pour les filtres de cours
export interface CourseFilters {
  search?: string;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  educationLevel?: EducationLevel;
  isPremium?: boolean;
  teacherId?: string;
  limit?: number;
  offset?: number;
}

// Interface pour les statistiques de cours
export interface CourseStats {
  totalCourses: number;
  totalStudents: number;
  averageRating: number;
  categoriesCount: Record<string, number>;
}

class CourseService {
  // Récupérer tous les cours avec filtres
  async getCourses(filters: CourseFilters = {}): Promise<CourseWithDetails[]> {
    try {
      let query = supabase
        .from('courses')
        .select(`
          *,
          profiles!courses_teacher_id_fkey (
            id,
            first_name,
            last_name,
            avatar_url
          )
        `);

      // Appliquer les filtres
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.level) {
        query = query.eq('level', filters.level);
      }

      if (filters.educationLevel) {
        query = query.eq('education_level', filters.educationLevel);
      }

      if (filters.isPremium !== undefined) {
        query = query.eq('is_premium', filters.isPremium);
      }

      if (filters.teacherId) {
        query = query.eq('teacher_id', filters.teacherId);
      }

      // Pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      // Tri par date de création (plus récents en premier)
      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Erreur lors de la récupération des cours:', error);
        throw new Error('Erreur lors de la récupération des cours');
      }

      // Transformer les données pour correspondre à l'interface Course
      return data?.map(this.transformCourseData) || [];
    } catch (error) {
      console.error('Erreur dans getCourses:', error);
      throw error;
    }
  }

  // Récupérer un cours par ID
  async getCourseById(courseId: string): Promise<CourseWithDetails | null> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          profiles!courses_teacher_id_fkey (
            id,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('id', courseId)
        .single();

      if (error) {
        console.error('Erreur lors de la récupération du cours:', error);
        return null;
      }

      return this.transformCourseData(data);
    } catch (error) {
      console.error('Erreur dans getCourseById:', error);
      return null;
    }
  }

  // Récupérer les cours d'un enseignant
  async getCoursesByTeacher(teacherId: string): Promise<CourseWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          profiles!courses_teacher_id_fkey (
            id,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des cours de l\'enseignant:', error);
        throw new Error('Erreur lors de la récupération des cours de l\'enseignant');
      }

      return data?.map(this.transformCourseData) || [];
    } catch (error) {
      console.error('Erreur dans getCoursesByTeacher:', error);
      throw error;
    }
  }

  // Récupérer les cours suivis par un utilisateur
  async getEnrolledCourses(userId: string): Promise<CourseWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from('progress')
        .select(`
          course_id,
          progress,
          courses (
            *,
            profiles!courses_teacher_id_fkey (
              id,
              first_name,
              last_name,
              avatar_url
            )
          )
        `)
        .eq('user_id', userId)
        .not('course_id', 'is', null);

      if (error) {
        console.error('Erreur lors de la récupération des cours suivis:', error);
        throw new Error('Erreur lors de la récupération des cours suivis');
      }

      return data?.map(item => ({
        ...this.transformCourseData(item.courses),
        progress: item.progress || 0,
        isEnrolled: true
      })) || [];
    } catch (error) {
      console.error('Erreur dans getEnrolledCourses:', error);
      throw error;
    }
  }

  // Créer un nouveau cours
  async createCourse(courseData: Omit<Course, 'id' | 'createdAt' | 'rating' | 'studentsCount'>): Promise<CourseWithDetails> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert({
          title: courseData.title,
          description: courseData.description,
          teacher_id: courseData.instructorId,
          image_url: courseData.thumbnail,
          category: courseData.category,
          level: courseData.level,
          education_level: courseData.educationLevel,
          duration: courseData.duration,
          chapters_count: courseData.chaptersCount,
          is_premium: courseData.isPremium,
          price: courseData.price || 0,
        })
        .select(`
          *,
          profiles!courses_teacher_id_fkey (
            id,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .single();

      if (error) {
        console.error('Erreur lors de la création du cours:', error);
        throw new Error('Erreur lors de la création du cours');
      }

      return this.transformCourseData(data);
    } catch (error) {
      console.error('Erreur dans createCourse:', error);
      throw error;
    }
  }

  // Mettre à jour un cours
  async updateCourse(courseId: string, updates: Partial<Course>): Promise<CourseWithDetails> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .update({
          title: updates.title,
          description: updates.description,
          image_url: updates.thumbnail,
          category: updates.category,
          level: updates.level,
          education_level: updates.educationLevel,
          duration: updates.duration,
          chapters_count: updates.chaptersCount,
          is_premium: updates.isPremium,
          price: updates.price,
        })
        .eq('id', courseId)
        .select(`
          *,
          profiles!courses_teacher_id_fkey (
            id,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .single();

      if (error) {
        console.error('Erreur lors de la mise à jour du cours:', error);
        throw new Error('Erreur lors de la mise à jour du cours');
      }

      return this.transformCourseData(data);
    } catch (error) {
      console.error('Erreur dans updateCourse:', error);
      throw error;
    }
  }

  // Supprimer un cours
  async deleteCourse(courseId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) {
        console.error('Erreur lors de la suppression du cours:', error);
        throw new Error('Erreur lors de la suppression du cours');
      }

      return true;
    } catch (error) {
      console.error('Erreur dans deleteCourse:', error);
      throw error;
    }
  }

  // S'inscrire à un cours
  async enrollInCourse(userId: string, courseId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('progress')
        .insert({
          user_id: userId,
          course_id: courseId,
          progress: 0
        });

      if (error) {
        console.error('Erreur lors de l\'inscription au cours:', error);
        throw new Error('Erreur lors de l\'inscription au cours');
      }

      return true;
    } catch (error) {
      console.error('Erreur dans enrollInCourse:', error);
      throw error;
    }
  }

  // Mettre à jour la progression d'un cours
  async updateCourseProgress(userId: string, courseId: string, progress: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('progress')
        .upsert({
          user_id: userId,
          course_id: courseId,
          progress: Math.min(100, Math.max(0, progress))
        });

      if (error) {
        console.error('Erreur lors de la mise à jour de la progression:', error);
        throw new Error('Erreur lors de la mise à jour de la progression');
      }

      return true;
    } catch (error) {
      console.error('Erreur dans updateCourseProgress:', error);
      throw error;
    }
  }

  // Récupérer les statistiques des cours
  async getCourseStats(): Promise<CourseStats> {
    try {
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('category, rating, students_count');

      if (coursesError) {
        console.error('Erreur lors de la récupération des statistiques:', coursesError);
        throw new Error('Erreur lors de la récupération des statistiques');
      }

      const totalCourses = courses?.length || 0;
      const totalStudents = courses?.reduce((sum, course) => sum + (course.students_count || 0), 0) || 0;
      const averageRating = courses?.reduce((sum, course) => sum + (course.rating || 0), 0) / totalCourses || 0;

      const categoriesCount = courses?.reduce((acc, course) => {
        const category = course.category || 'Autre';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      return {
        totalCourses,
        totalStudents,
        averageRating: Math.round(averageRating * 10) / 10,
        categoriesCount
      };
    } catch (error) {
      console.error('Erreur dans getCourseStats:', error);
      throw error;
    }
  }

  // Rechercher des cours
  async searchCourses(query: string, filters: Omit<CourseFilters, 'search'> = {}): Promise<CourseWithDetails[]> {
    return this.getCourses({ ...filters, search: query });
  }

  // Récupérer les cours populaires
  async getPopularCourses(limit: number = 10): Promise<CourseWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          profiles!courses_teacher_id_fkey (
            id,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .order('students_count', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Erreur lors de la récupération des cours populaires:', error);
        throw new Error('Erreur lors de la récupération des cours populaires');
      }

      return data?.map(this.transformCourseData) || [];
    } catch (error) {
      console.error('Erreur dans getPopularCourses:', error);
      throw error;
    }
  }

  // Récupérer les cours récents
  async getRecentCourses(limit: number = 10): Promise<CourseWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          profiles!courses_teacher_id_fkey (
            id,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Erreur lors de la récupération des cours récents:', error);
        throw new Error('Erreur lors de la récupération des cours récents');
      }

      return data?.map(this.transformCourseData) || [];
    } catch (error) {
      console.error('Erreur dans getRecentCourses:', error);
      throw error;
    }
  }

  // Transformer les données de la base vers l'interface Course
  private transformCourseData(data: any): CourseWithDetails {
    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      instructor: data.profiles ? `${data.profiles.first_name} ${data.profiles.last_name}` : 'Inconnu',
      instructorId: data.teacher_id,
      thumbnail: data.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop&crop=center',
      category: data.category || 'Général',
      level: data.level || 'beginner',
      educationLevel: data.education_level || 'etudiant',
      duration: data.duration || '0h 0min',
      chaptersCount: data.chapters_count || 0,
      isPremium: data.is_premium || false,
      price: data.price || 0,
      rating: data.rating || 0,
      studentsCount: data.students_count || 0,
      progress: data.progress || 0,
      createdAt: data.created_at || new Date().toISOString(),
      teacher: data.profiles ? {
        id: data.profiles.id,
        name: `${data.profiles.first_name} ${data.profiles.last_name}`,
        avatar: data.profiles.avatar_url
      } : undefined,
      isEnrolled: data.isEnrolled || false,
      isFavorite: data.isFavorite || false
    };
  }
}

export const courseService = new CourseService();
