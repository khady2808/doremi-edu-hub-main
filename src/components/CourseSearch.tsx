import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter,
  X,
  Loader2
} from 'lucide-react';
import { useCourseSearch } from '../hooks/useCourses';
import { CourseCard } from './CourseCard';
import { useCourseFavorites, useCourseEnrollment } from '../hooks/useCourses';
import { EducationLevel } from '../types/course';

interface CourseSearchProps {
  onClose?: () => void;
  className?: string;
}

export const CourseSearch: React.FC<CourseSearchProps> = ({ onClose, className = '' }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [educationLevel, setEducationLevel] = useState<EducationLevel | ''>('');
  const [showFilters, setShowFilters] = useState(false);

  const { favoriteIds, toggleFavorite, isFavorite } = useCourseFavorites();
  const { enrolledIds, enrollInCourse, isEnrolled } = useCourseEnrollment();

  // Recherche avec debounce
  const { courses, loading, error } = useCourseSearch(query, {
    category: category || undefined,
    level: level as 'beginner' | 'intermediate' | 'advanced' || undefined,
    educationLevel: educationLevel || undefined,
    limit: 20
  });

  const categories = [
    'Mathématiques', 'Français', 'SVT', 'Histoire-Géographie', 
    'Physique-Chimie', 'Anglais', 'Philosophie', 'Informatique',
    'Finance', 'Comptabilité', 'Arts', 'Langues'
  ];

  const levels = [
    { value: 'beginner', label: 'Débutant' },
    { value: 'intermediate', label: 'Intermédiaire' },
    { value: 'advanced', label: 'Avancé' }
  ];

  const educationLevels = [
    { value: 'ecolier', label: 'Écolier' },
    { value: 'collegien', label: 'Collégien' },
    { value: 'lyceen', label: 'Lycéen' },
    { value: 'etudiant', label: 'Étudiant' }
  ];

  const clearFilters = () => {
    setCategory('');
    setLevel('');
    setEducationLevel('');
    setQuery('');
  };

  const hasActiveFilters = category || level || educationLevel || query;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Barre de recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher des cours..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'bg-primary text-primary-foreground' : ''}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Filtres avancés */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes les catégories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les niveaux</SelectItem>
                    {levels.map(lev => (
                      <SelectItem key={lev.value} value={lev.value}>{lev.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={educationLevel} onValueChange={(value) => setEducationLevel(value as EducationLevel | '')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Niveau d'étude" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les niveaux d'étude</SelectItem>
                    {educationLevels.map(edu => (
                      <SelectItem key={edu.value} value={edu.value}>{edu.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {hasActiveFilters && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Filtres actifs:</span>
                  {query && (
                    <Badge variant="secondary" className="gap-1">
                      Recherche: {query}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setQuery('')} />
                    </Badge>
                  )}
                  {category && (
                    <Badge variant="secondary" className="gap-1">
                      {category}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setCategory('')} />
                    </Badge>
                  )}
                  {level && (
                    <Badge variant="secondary" className="gap-1">
                      {levels.find(l => l.value === level)?.label}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setLevel('')} />
                    </Badge>
                  )}
                  {educationLevel && (
                    <Badge variant="secondary" className="gap-1">
                      {educationLevels.find(e => e.value === educationLevel)?.label}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setEducationLevel('')} />
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Effacer tout
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Résultats de recherche */}
      {query && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Résultats de recherche
              {loading && <Loader2 className="w-4 h-4 ml-2 animate-spin inline" />}
            </h3>
            <span className="text-sm text-muted-foreground">
              {courses.length} cours trouvé{courses.length > 1 ? 's' : ''}
            </span>
          </div>

          {error && (
            <Card>
              <CardContent className="p-4">
                <div className="text-center text-red-600">
                  <p>Erreur lors de la recherche: {error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Recherche en cours...</span>
              </div>
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun cours trouvé</h3>
                <p className="text-muted-foreground">
                  Essayez de modifier vos critères de recherche
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
