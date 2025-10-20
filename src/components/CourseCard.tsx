import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Star, 
  Clock, 
  Users,
  PlayCircle,
  Download,
  BookOpen,
  Crown
} from 'lucide-react';
import { CourseWithDetails } from '@/lib/courseService';

interface CourseCardProps {
  course: CourseWithDetails;
  isFavorite: boolean;
  isEnrolled: boolean;
  onToggleFavorite: () => void;
  onEnroll: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isFavorite,
  isEnrolled,
  onToggleFavorite,
  onEnroll
}) => {
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

  const handleStartCourse = () => {
    // Simulation de démarrage du cours
    alert(`Démarrage du cours : ${course.title}`);
    // Ici on pourrait naviguer vers la page du cours ou ouvrir un modal
  };

  const handleDownload = () => {
    // Simulation de téléchargement
    alert(`Téléchargement du cours : ${course.title}`);
  };

  return (
    <Card className="card-hover group overflow-hidden">
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
          <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
            {course.title}
          </CardTitle>
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
                onClick={handleStartCourse}
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                {course.progress && course.progress > 0 ? 'Continuer' : 'Commencer'}
              </Button>
              <Button
                variant={isFavorite ? 'default' : 'outline'}
                size="sm"
                onClick={onToggleFavorite}
              >
                <Star className="w-4 h-4 mr-1" />
                {isFavorite ? 'Retirer Favori' : 'Favori'}
              </Button>
              {course.isPremium && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
