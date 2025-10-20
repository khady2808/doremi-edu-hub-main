import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Star, 
  Clock, 
  Users,
  PlayCircle,
  Download,
  BookOpen,
  Crown,
  ArrowLeft,
  Share2,
  Heart,
  CheckCircle,
  Lock
} from 'lucide-react';
import { useCourse, useCourseFavorites, useCourseEnrollment } from '../hooks/useCourses';
import { CourseCard } from '../components/CourseCard';
import { useAuth } from '../context/AuthContext';

export const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'chapters' | 'reviews'>('overview');

  // Hooks pour la gestion du cours
  const { course, loading, error } = useCourse(courseId || null);
  const { isFavorite, toggleFavorite } = useCourseFavorites();
  const { isEnrolled, enrollInCourse } = useCourseEnrollment();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span>Chargement du cours...</span>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Cours non trouvé</h2>
          <p className="text-muted-foreground mb-4">
            Le cours que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <Button onClick={() => navigate('/courses')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux cours
          </Button>
        </div>
      </div>
    );
  }

  const isCourseFavorite = isFavorite(course.id);
  const isCourseEnrolled = isEnrolled(course.id);

  const handleEnroll = async () => {
    if (isCourseEnrolled) return;
    
    const success = await enrollInCourse(course.id);
    if (success) {
      // Optionnel: afficher une notification de succès
      alert('Inscription au cours réussie !');
    } else {
      alert('Erreur lors de l\'inscription au cours');
    }
  };

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

  // Mock chapters data - à remplacer par des données réelles
  const chapters = [
    { id: '1', title: 'Introduction au cours', duration: '15 min', isCompleted: true, isLocked: false },
    { id: '2', title: 'Les bases fondamentales', duration: '25 min', isCompleted: true, isLocked: false },
    { id: '3', title: 'Concepts avancés', duration: '30 min', isCompleted: false, isLocked: false },
    { id: '4', title: 'Pratique et exercices', duration: '20 min', isCompleted: false, isLocked: true },
    { id: '5', title: 'Conclusion et prochaines étapes', duration: '10 min', isCompleted: false, isLocked: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header avec image et infos principales */}
      <div className="relative">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-64 md:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {/* Navigation */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => navigate('/courses')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Partager
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => toggleFavorite(course.id)}
            >
              <Heart className={`w-4 h-4 mr-2 ${isCourseFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              {isCourseFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            </Button>
          </div>
        </div>

        {/* Infos du cours */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={`${getLevelBadgeColor(course.level)} shadow-lg`}>
              {getLevelText(course.level)}
            </Badge>
            {course.isPremium && (
              <Badge className="bg-yellow-500 text-white border-0 shadow-lg">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{course.title}</h1>
          <p className="text-lg opacity-90 line-clamp-2">{course.description}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Onglets */}
            <div className="flex border-b">
              <button
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === 'overview' 
                    ? 'border-b-2 border-primary text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                Aperçu
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === 'chapters' 
                    ? 'border-b-2 border-primary text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('chapters')}
              >
                Chapitres ({chapters.length})
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === 'reviews' 
                    ? 'border-b-2 border-primary text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('reviews')}
              >
                Avis
              </button>
            </div>

            {/* Contenu des onglets */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>À propos de ce cours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {course.description}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ce que vous apprendrez</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Maîtriser les concepts fondamentaux</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Appliquer les techniques pratiques</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Développer vos compétences</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'chapters' && (
              <div className="space-y-4">
                {chapters.map((chapter, index) => (
                  <Card key={chapter.id} className={chapter.isLocked ? 'opacity-60' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            {chapter.isCompleted ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : chapter.isLocked ? (
                              <Lock className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <span className="text-sm font-medium">{index + 1}</span>
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium">{chapter.title}</h4>
                            <p className="text-sm text-muted-foreground">{chapter.duration}</p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={chapter.isLocked}
                        >
                          <PlayCircle className="w-4 h-4 mr-2" />
                          {chapter.isCompleted ? 'Revoir' : 'Commencer'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Avis des étudiants</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Aucun avis pour le moment</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions du cours */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {course.isPremium ? `${course.price}€` : 'Gratuit'}
                    </div>
                    {course.isPremium && (
                      <p className="text-sm text-muted-foreground">Accès à vie</p>
                    )}
                  </div>

                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleEnroll}
                    disabled={isCourseEnrolled}
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    {isCourseEnrolled ? 'Cours suivi' : 'S\'inscrire au cours'}
                  </Button>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Durée</span>
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Chapitres</span>
                      <span>{course.chaptersCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Niveau</span>
                      <span>{getLevelText(course.level)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Étudiants</span>
                      <span>{course.studentsCount}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructeur */}
            <Card>
              <CardHeader>
                <CardTitle>Instructeur</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-medium">
                      {course.instructor.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium">{course.instructor}</h4>
                    <p className="text-sm text-muted-foreground">Formateur certifié</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progression */}
            {isCourseEnrolled && course.progress !== undefined && (
              <Card>
                <CardHeader>
                  <CardTitle>Votre progression</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progression</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
