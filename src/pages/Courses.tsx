
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Star, 
  Clock, 
  Users,
  PlayCircle,
  Download,
  BookOpen,
  Crown,
  GraduationCap,
  Video,
  Calendar,
  Plus,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Progress } from '@/components/ui/progress';
import { EDUCATION_CATEGORIES, EDUCATION_LEVEL_LABELS, EducationLevel } from '../types/course';
import { Video as VideoType } from '../types/auth';
import { useCourses, useCourseFavorites, useCourseEnrollment, usePopularCourses, useRecentCourses } from '../hooks/useCourses';
import { CourseFilters } from '../lib/courseService';
import { CourseCard } from '../components/CourseCard';
import { CourseServiceTest } from '../components/CourseServiceTest';
import LaravelApiTest from '../components/LaravelApiTest';
import SimpleTest from '../components/SimpleTest';
import DebugTest from '../components/DebugTest';

export const Courses: React.FC = () => {
  const { user, videos } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [showPopular, setShowPopular] = useState(false);
  const [showRecent, setShowRecent] = useState(false);

  // Hooks pour la gestion des cours
  const { favoriteIds, toggleFavorite, isFavorite } = useCourseFavorites();
  const { enrolledIds, enrollInCourse, isEnrolled } = useCourseEnrollment();
  const { courses: popularCourses, loading: popularLoading } = usePopularCourses(6);
  const { courses: recentCourses, loading: recentLoading } = useRecentCourses(6);

  // Mettre à jour l'URL quand la recherche change
  useEffect(() => {
    if (searchTerm) {
      setSearchParams({ search: searchTerm });
    } else {
      setSearchParams({});
    }
  }, [searchTerm, setSearchParams]);

  // Get available categories based on user's education level
  const availableCategories = useMemo(() => {
    if (!user?.educationLevel) return [];
    return EDUCATION_CATEGORIES[user.educationLevel];
  }, [user?.educationLevel]);

  const levels = ['all', 'beginner', 'intermediate', 'advanced'];

  // Préparer les filtres pour la requête
  const courseFilters: CourseFilters = useMemo(() => {
    const filters: CourseFilters = {
      search: searchTerm || undefined,
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      level: selectedLevel !== 'all' ? selectedLevel as 'beginner' | 'intermediate' | 'advanced' : undefined,
      educationLevel: user?.educationLevel,
      limit: 50
    };
    return filters;
  }, [searchTerm, selectedCategory, selectedLevel, user?.educationLevel]);

  // Récupérer les cours avec les filtres
  const { courses, loading, error, refetch } = useCourses(courseFilters);

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner': return 'Débutant';
      case 'intermediate': return 'Intermédiaire';
      case 'advanced': return 'Avancé';
      default: return level;
    }
  };

  // Fonction de gestion d'erreur d'image
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = event.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop&crop=center';
    target.onerror = null; // Éviter les boucles infinies
  };

  return (
    <div className="space-y-6">
      <DebugTest />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Catalogue de Cours</h1>
        <p className="text-muted-foreground">
          Découvrez nos cours de qualité professionnelle pour développer vos compétences
        </p>
        
        {/* Education Level Indicator */}
        {user?.educationLevel && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700 dark:text-blue-300">
              Cours pour le niveau : <strong>{EDUCATION_LEVEL_LABELS[user.educationLevel]}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher des cours..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes catégories</SelectItem>
                  {availableCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous niveaux</SelectItem>
                  <SelectItem value="beginner">Débutant</SelectItem>
                  <SelectItem value="intermediate">Intermédiaire</SelectItem>
                  <SelectItem value="advanced">Avancé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructor Actions */}
      {user?.role === 'teacher' && (
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Actions Formateur
                </h3>
                <p className="text-blue-700 text-sm">
                  Créez du contenu pour vos étudiants
                </p>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={() => window.location.href = '/instructor/video-upload'}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Ajouter une vidéo
                </Button>
                <Button 
                  onClick={() => window.location.href = '/instructor/live-session'}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Créer un live
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cours populaires et récents */}
      {!searchTerm && selectedCategory === 'all' && selectedLevel === 'all' && (
        <div className="space-y-6">
          {/* Cours populaires */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Cours Populaires</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowPopular(!showPopular)}
              >
                {showPopular ? 'Masquer' : 'Voir tout'}
              </Button>
            </div>
            {popularLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularCourses.slice(0, showPopular ? popularCourses.length : 3).map((course) => (
                  <CourseCard 
                    key={course.id} 
                    course={course} 
                    isFavorite={isFavorite(course.id)}
                    isEnrolled={isEnrolled(course.id)}
                    onToggleFavorite={() => toggleFavorite(course.id)}
                    onEnroll={() => enrollInCourse(course.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Cours récents */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Cours Récents</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowRecent(!showRecent)}
              >
                {showRecent ? 'Masquer' : 'Voir tout'}
              </Button>
            </div>
            {recentLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentCourses.slice(0, showRecent ? recentCourses.length : 3).map((course) => (
                  <CourseCard 
                    key={course.id} 
                    course={course} 
                    isFavorite={isFavorite(course.id)}
                    isEnrolled={isEnrolled(course.id)}
                    onToggleFavorite={() => toggleFavorite(course.id)}
                    onEnroll={() => enrollInCourse(course.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results count and error handling */}
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          {loading ? 'Chargement...' : `${courses.length} cours trouvé${courses.length > 1 ? 's' : ''}`}
        </p>
        {error && (
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Erreur de chargement</span>
            <Button variant="outline" size="sm" onClick={refetch}>
              Réessayer
            </Button>
          </div>
        )}
      </div>

      {/* Instructor Content */}
      {user?.role === 'teacher' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Toutes les Vidéos des Instructeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <Card key={video.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-video bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                    <PlayCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="font-medium text-sm mb-2">{video.title}</h4>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {video.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{video.views} vues</span>
                    <span>{new Date(video.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <Button size="sm" className="w-full mt-3">
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Voir la vidéo
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {user?.role === 'teacher' && user.liveSessions && user.liveSessions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Mes Sessions Live</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.liveSessions.map((session) => (
              <Card key={session.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium">{session.title}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {session.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>{session.platform}</span>
                    <span>{new Date(session.scheduledAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <Button size="sm" className="w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    {session.status === 'live' ? 'Rejoindre' : 'Voir détails'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Courses Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Chargement des cours...</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              isFavorite={isFavorite(course.id)}
              isEnrolled={isEnrolled(course.id)}
              onToggleFavorite={() => toggleFavorite(course.id)}
              onEnroll={() => enrollInCourse(course.id)}
            />
          ))}
        </div>
      )}

      {!loading && courses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucun cours trouvé</h3>
          <p className="text-muted-foreground">
            Essayez de modifier vos critères de recherche ou votre niveau d'étude dans les paramètres
          </p>
        </div>
      )}

      {/* Composant de Test - À retirer en production */}
      <div className="mt-8 space-y-6">
        <SimpleTest />
        <CourseServiceTest />
        <LaravelApiTest />
      </div>

      {/* Floating Action Button for Instructors */}
      {user?.role === 'teacher' && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => {
                alert('Navigation vers la page d\'ajout de vidéo');
                // window.location.href = '/instructor/video-upload';
              }}
              className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
              title="Ajouter une vidéo"
            >
              <Video className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => {
                alert('Navigation vers la page de création de live');
                // window.location.href = '/instructor/live-session';
              }}
              className="w-12 h-12 rounded-full bg-green-600 hover:bg-green-700 shadow-lg"
              title="Créer un live"
            >
              <Calendar className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
