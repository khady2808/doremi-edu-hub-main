import { useState, useEffect, useCallback } from 'react';
import { courseService, CourseWithDetails, CourseFilters, CourseStats } from '@/lib/courseService';
import { useAuth } from '@/context/AuthContext';

// Hook pour récupérer tous les cours avec filtres
export const useCourses = (filters: CourseFilters = {}) => {
  const [courses, setCourses] = useState<CourseWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await courseService.getCourses(filters);
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des cours');
      console.error('Erreur dans useCourses:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    loading,
    error,
    refetch: fetchCourses
  };
};

// Hook pour récupérer un cours par ID
export const useCourse = (courseId: string | null) => {
  const [course, setCourse] = useState<CourseWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourse = useCallback(async () => {
    if (!courseId) {
      setCourse(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await courseService.getCourseById(courseId);
      setCourse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération du cours');
      console.error('Erreur dans useCourse:', err);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  return {
    course,
    loading,
    error,
    refetch: fetchCourse
  };
};

// Hook pour les cours d'un enseignant
export const useTeacherCourses = (teacherId: string | null) => {
  const [courses, setCourses] = useState<CourseWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    if (!teacherId) {
      setCourses([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await courseService.getCoursesByTeacher(teacherId);
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des cours de l\'enseignant');
      console.error('Erreur dans useTeacherCourses:', err);
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    loading,
    error,
    refetch: fetchCourses
  };
};

// Hook pour les cours suivis par l'utilisateur
export const useEnrolledCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    if (!user?.id) {
      setCourses([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await courseService.getEnrolledCourses(user.id);
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des cours suivis');
      console.error('Erreur dans useEnrolledCourses:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    loading,
    error,
    refetch: fetchCourses
  };
};

// Hook pour les cours populaires
export const usePopularCourses = (limit: number = 10) => {
  const [courses, setCourses] = useState<CourseWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await courseService.getPopularCourses(limit);
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des cours populaires');
      console.error('Erreur dans usePopularCourses:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    loading,
    error,
    refetch: fetchCourses
  };
};

// Hook pour les cours récents
export const useRecentCourses = (limit: number = 10) => {
  const [courses, setCourses] = useState<CourseWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await courseService.getRecentCourses(limit);
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des cours récents');
      console.error('Erreur dans useRecentCourses:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    loading,
    error,
    refetch: fetchCourses
  };
};

// Hook pour les statistiques des cours
export const useCourseStats = () => {
  const [stats, setStats] = useState<CourseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await courseService.getCourseStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des statistiques');
      console.error('Erreur dans useCourseStats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};

// Hook pour la recherche de cours
export const useCourseSearch = (query: string, filters: Omit<CourseFilters, 'search'> = {}) => {
  const [courses, setCourses] = useState<CourseWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCourses = useCallback(async () => {
    if (!query.trim()) {
      setCourses([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await courseService.searchCourses(query, filters);
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la recherche');
      console.error('Erreur dans useCourseSearch:', err);
    } finally {
      setLoading(false);
    }
  }, [query, filters]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchCourses();
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [searchCourses]);

  return {
    courses,
    loading,
    error,
    search: searchCourses
  };
};

// Hook pour la gestion des favoris
export const useCourseFavorites = () => {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Charger les favoris depuis localStorage
  useEffect(() => {
    if (!user?.id) return;

    const favoritesKey = `doremi_favorites_${user.id}`;
    try {
      const saved = localStorage.getItem(favoritesKey);
      if (saved) {
        setFavoriteIds(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
    }
  }, [user?.id]);

  // Ajouter/retirer des favoris
  const toggleFavorite = useCallback((courseId: string) => {
    if (!user?.id) return;

    const favoritesKey = `doremi_favorites_${user.id}`;
    const newFavorites = favoriteIds.includes(courseId)
      ? favoriteIds.filter(id => id !== courseId)
      : [...favoriteIds, courseId];

    setFavoriteIds(newFavorites);
    localStorage.setItem(favoritesKey, JSON.stringify(newFavorites));
  }, [user?.id, favoriteIds]);

  // Vérifier si un cours est en favori
  const isFavorite = useCallback((courseId: string) => {
    return favoriteIds.includes(courseId);
  }, [favoriteIds]);

  return {
    favoriteIds,
    toggleFavorite,
    isFavorite
  };
};

// Hook pour la gestion de l'inscription aux cours
export const useCourseEnrollment = () => {
  const { user } = useAuth();
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);

  // Charger les inscriptions depuis localStorage
  useEffect(() => {
    if (!user?.id) return;

    const enrolledKey = `doremi_enrolled_${user.id}`;
    try {
      const saved = localStorage.getItem(enrolledKey);
      if (saved) {
        setEnrolledIds(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des inscriptions:', error);
    }
  }, [user?.id]);

  // S'inscrire à un cours
  const enrollInCourse = useCallback(async (courseId: string) => {
    if (!user?.id) return false;

    try {
      await courseService.enrollInCourse(user.id, courseId);
      const newEnrolled = [...enrolledIds, courseId];
      setEnrolledIds(newEnrolled);
      
      const enrolledKey = `doremi_enrolled_${user.id}`;
      localStorage.setItem(enrolledKey, JSON.stringify(newEnrolled));
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'inscription au cours:', error);
      return false;
    }
  }, [user?.id, enrolledIds]);

  // Vérifier si un cours est suivi
  const isEnrolled = useCallback((courseId: string) => {
    return enrolledIds.includes(courseId);
  }, [enrolledIds]);

  return {
    enrolledIds,
    enrollInCourse,
    isEnrolled
  };
};
