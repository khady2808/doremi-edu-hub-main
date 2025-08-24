import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  BookOpen, 
  Users, 
  Star, 
  TrendingUp, 
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Play,
  Award,
  Target,
  Heart
} from 'lucide-react';
import { mockCourses } from '../data/mockData';

// Données des actualités avec des images sénégalaises
const actualites = [
  {
    id: 1,
    title: "Nouveau programme de formation en informatique",
    description: "Découvrez notre nouveau cursus spécialisé en développement web et mobile, conçu avec les meilleurs experts du Sénégal.",
    image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=400&fit=crop",
    category: "Formation",
    date: "2025-01-15",
    author: "Dr. Amadou Diallo",
    location: "Dakar"
  },
  {
    id: 2,
    title: "Cérémonie de remise des diplômes 2024",
    description: "Plus de 500 étudiants ont reçu leur diplôme lors de notre cérémonie annuelle au Centre International de Conférences Abdou Diouf.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9e1?w=800&h=400&fit=crop",
    category: "Événement",
    date: "2025-01-10",
    author: "Fatou Sall",
    location: "Dakar"
  },
  {
    id: 3,
    title: "Partenariat avec l'Université Cheikh Anta Diop",
    description: "Signature d'un accord de partenariat pour renforcer l'excellence académique et l'innovation technologique au Sénégal.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
    category: "Partenariat",
    date: "2025-01-08",
    author: "Prof. Mariama Ba",
    location: "Dakar"
  },
  {
    id: 4,
    title: "Lancement du programme d'entrepreneuriat",
    description: "Formation intensive de 6 mois pour développer les compétences entrepreneuriales des jeunes sénégalais.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop",
    category: "Innovation",
    date: "2025-01-05",
    author: "Ousmane Ndiaye",
    location: "Thiès"
  },
  {
    id: 5,
    title: "Excellence académique : Nos lauréats 2024",
    description: "Découvrez les parcours exceptionnels de nos meilleurs étudiants qui brillent dans leurs domaines respectifs.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
    category: "Réussite",
    date: "2025-01-03",
    author: "Aminata Diop",
    location: "Saint-Louis"
  }
];

export const Index: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageLoadingStates, setImageLoadingStates] = useState<Record<string, boolean>>({});



  // Auto-play du carrousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % actualites.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);



  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % actualites.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + actualites.length) % actualites.length);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Fonction de gestion d'erreur d'image
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = event.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop';
    target.onerror = null; // Éviter les boucles infinies
  };

  // Fonction de gestion du chargement d'image
  const handleImageLoad = (courseId: string) => {
    setImageLoadingStates(prev => ({ ...prev, [courseId]: false }));
  };

  const handleImageLoadStart = (courseId: string) => {
    setImageLoadingStates(prev => ({ ...prev, [courseId]: true }));
  };

  // Fonction pour gérer le clic sur un cours
  const handleCourseClick = useCallback((course: any) => {
    console.log('Clic sur le cours:', course);
    // Simulation de navigation vers le cours
    alert(`Ouverture du cours : ${course.title}`);
    // Ici on pourrait naviguer vers la page du cours
    // window.location.href = `/courses?course=${course.id}`;
  }, []);

  // Fonction pour gérer le clic sur "Commencer maintenant"
  const handleStartLearning = useCallback(() => {
    console.log('Clic sur "Commencer maintenant"');
    alert('Navigation vers la page des cours pour commencer l\'apprentissage');
    // window.location.href = '/courses';
  }, []);

  // Fonction pour gérer le clic sur "Découvrir nos cours"
  const handleDiscoverCourses = useCallback(() => {
    console.log('Clic sur "Découvrir nos cours"');
    alert('Navigation vers la page des cours pour découvrir tous les cours');
    // window.location.href = '/courses';
  }, []);

  // Fonction pour gérer le clic sur "Lire plus"
  const handleReadMore = useCallback((actualite: any) => {
    alert(`Ouverture de l'article : ${actualite.title}`);
    // Ici on pourrait naviguer vers la page des actualités
    // window.location.href = `/news?article=${actualite.id}`;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Carrousel d'actualités */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative">
            {/* Carrousel */}
            <div className="relative h-96 md:h-[500px] overflow-hidden rounded-2xl shadow-2xl">
              {actualites.map((actualite, index) => (
                <div
                  key={actualite.id}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                  }`}
                >
                  <div className="relative h-full">
                    <img
                      src={actualite.image}
                      alt={actualite.title}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <div className="flex items-center gap-4 mb-4">
                        <Badge variant="secondary" className="bg-yellow-500 text-white">
                          {actualite.category}
                        </Badge>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4" />
                          {formatDate(actualite.date)}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4" />
                          {actualite.location}
                        </div>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-3">{actualite.title}</h3>
                      <p className="text-lg mb-4 text-gray-200">{actualite.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {actualite.author.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="font-medium">{actualite.author}</span>
                        </div>
                        <button 
                          className="px-4 py-2 border border-white text-white hover:bg-white hover:text-gray-900 rounded"
                          onClick={() => {
                            console.log('Clic sur "Lire plus" pour:', actualite.title);
                            alert(`Ouverture de l'article : ${actualite.title}`);
                          }}
                        >
                          Lire plus <ArrowRight className="w-4 h-4 ml-2 inline" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Contrôles du carrousel */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Indicateurs */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {actualites.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentSlide ? 'bg-yellow-500' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section des cours populaires */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Cours populaires</h2>
            <p className="text-gray-600">Découvrez nos formations les plus appréciées</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockCourses && mockCourses.length > 0 ? mockCourses.slice(0, 3).map((course) => (
              <Card 
                key={course.id} 
                className="group hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative overflow-hidden">
                  {imageLoadingStates[course.id] && (
                    <div className="w-full h-48 bg-gray-200 animate-pulse flex items-center justify-center">
                      <div className="text-gray-400">Chargement...</div>
                    </div>
                  )}
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className={`w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 ${
                      imageLoadingStates[course.id] ? 'hidden' : ''
                    }`}
                    onError={handleImageError}
                    onLoad={() => handleImageLoad(course.id)}
                    onLoadStart={() => handleImageLoadStart(course.id)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-yellow-500 text-white shadow-lg">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Populaire
                    </Badge>
                  </div>
                  {course.isPremium && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-purple-500 text-white shadow-lg">
                        Premium
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600">{course.rating} ({course.studentsCount} étudiants)</span>
                    </div>
                    <button 
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Clic sur le bouton "Voir le cours" pour:', course.title);
                        alert(`Ouverture du cours : ${course.title}`);
                      }}
                    >
                      Voir le cours
                    </button>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">Chargement des cours...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à commencer votre apprentissage ?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Rejoignez des milliers d'étudiants qui ont déjà transformé leur avenir avec DOREMI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium"
              onClick={() => {
                console.log('Clic sur "Commencer maintenant"');
                alert('Navigation vers la page des cours pour commencer l\'apprentissage');
              }}
            >
              Commencer maintenant
            </button>
            <button 
              className="px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-blue-600 rounded-lg font-medium"
              onClick={() => {
                console.log('Clic sur "Découvrir nos cours"');
                alert('Navigation vers la page des cours pour découvrir tous les cours');
              }}
            >
              Découvrir nos cours
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
