
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
  Plus
} from 'lucide-react';
import { mockCourses } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { Progress } from '@/components/ui/progress';
import { EDUCATION_CATEGORIES, EDUCATION_LEVEL_LABELS, EducationLevel } from '../types/course';
import { Video as VideoType } from '../types/auth';

export const Courses: React.FC = () => {
  const { user, videos } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

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

  // Charger favoris/suivis
  useEffect(() => {
    if (!user) return;
    const enrolledKey = `doremi_enrolled_${user.id}`;
    const favoritesKey = `doremi_favorites_${user.id}`;
    try {
      const enrolled = JSON.parse(localStorage.getItem(enrolledKey) || '[]');
      const favorites = JSON.parse(localStorage.getItem(favoritesKey) || '[]');
      setEnrolledIds(enrolled);
      setFavoriteIds(favorites);
    } catch {}
  }, [user?.id]);

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    
    // Filter by education level if user has one set
    const matchesEducationLevel = !user?.educationLevel || 
                                 availableCategories.includes(course.category);

    // Pour les étudiants: n'afficher que favoris/suivis
    const matchesEnrollment = user?.role !== 'student' || enrolledIds.includes(course.id) || favoriteIds.includes(course.id);

    return matchesSearch && matchesCategory && matchesLevel && matchesEducationLevel && matchesEnrollment;
  });

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

      {/* Results count */}
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          {filteredCourses.length} cours trouvé{filteredCourses.length > 1 ? 's' : ''}
        </p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="card-hover group overflow-hidden">
            <div className="relative">
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {course.isPremium && (
                <div className="absolute top-3 right-3">
                  <Badge className="premium-badge bg-yellow-500 text-white border-0 shadow-lg">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                </div>
              )}
              {course.progress !== undefined && course.progress > 0 && (
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg p-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white text-xs font-medium">Progression</span>
                      <span className="text-white text-xs font-medium">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-1" />
                  </div>
                </div>
              )}
              {/* Badge de niveau */}
              <div className="absolute top-3 left-3">
                <Badge className={`${getLevelBadgeColor(course.level)} shadow-lg`}>
                  {getLevelText(course.level)}
                </Badge>
              </div>
            </div>
            
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">{course.title}</CardTitle>
                <div className="flex items-center gap-1 shrink-0">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{course.rating}</span>
                </div>
              </div>
              <CardDescription className="line-clamp-2">
                {course.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground font-medium">{course.category}</span>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-muted-foreground">{course.studentsCount}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {course.chaptersCount} chapitres
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {course.studentsCount}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Par {course.instructor}</span>
                    {course.isPremium && course.price && (
                      <span className="font-semibold text-primary">{course.price}€</span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1" 
                      size="sm"
                      onClick={() => {
                        // Simulation de démarrage du cours
                        alert(`Démarrage du cours : ${course.title}`);
                        // Ici on pourrait naviguer vers la page du cours ou ouvrir un modal
                      }}
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      {course.progress && course.progress > 0 ? 'Continuer' : 'Commencer'}
                    </Button>
                    {user?.role === 'student' && (
                      <Button
                        variant={favoriteIds.includes(course.id) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          const key = `doremi_favorites_${user.id}`;
                          let next = favoriteIds.includes(course.id)
                            ? favoriteIds.filter(id => id !== course.id)
                            : [...favoriteIds, course.id];
                          setFavoriteIds(next);
                          localStorage.setItem(key, JSON.stringify(next));
                        }}
                      >
                        <Star className="w-4 h-4 mr-1" />
                        {favoriteIds.includes(course.id) ? 'Retirer Favori' : 'Favori'}
                      </Button>
                    )}
                    {user?.isPremium && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // Simulation de téléchargement
                          alert(`Téléchargement du cours : ${course.title}`);
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucun cours trouvé</h3>
          <p className="text-muted-foreground">
            Essayez de modifier vos critères de recherche ou votre niveau d'étude dans les paramètres
          </p>
        </div>
      )}

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
