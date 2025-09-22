import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../components/ui/select';
import { 
  Calendar,
  MapPin,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  TrendingUp,
  Star,
  BookOpen,
  Users,
  Award,
  Lightbulb,
  Globe,
  Heart,
  Share2,
  MessageCircle,
  Search,
  Filter,
  Bell,
  Eye,
  ThumbsUp,
  Bookmark,
  ExternalLink,
  Sparkles,
  Zap,
  Target,
  Rocket,
  Megaphone,
  Tag,
  ShoppingCart,
  Gift,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { newsService, NewsItem, NewsFilters, NewsStats } from '../lib/newsService';

// Sujets tendance par défaut (utilisés si l'API ne retourne pas de statistiques)
const trendingTopics = [
  { name: "Promotions", count: 2247, trend: "up" },
  { name: "Formations en ligne", count: 1987, trend: "up" },
  { name: "Certifications", count: 1856, trend: "up" },
  { name: "Stages", count: 1743, trend: "up" },
  { name: "Programmation", count: 1654, trend: "up" },
  { name: "Marketing Digital", count: 1543, trend: "up" },
  { name: "Langues", count: 1432, trend: "up" },
  { name: "Design", count: 1398, trend: "up" },
  { name: "Comptabilité", count: 1365, trend: "up" },
  { name: "Entrepreneuriat", count: 1298, trend: "up" },
  { name: "Gestion de projet", count: 1234, trend: "up" },
  { name: "Bureautique", count: 1187, trend: "up" }
];

export const Actualites: React.FC = () => {
  const navigate = useNavigate();
  
  // États pour l'API
  const [news, setNews] = useState<NewsItem[]>([]);
  const [featuredNews, setFeaturedNews] = useState<NewsItem[]>([]);
  const [newsStats, setNewsStats] = useState<NewsStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNews, setTotalNews] = useState(0);

  // États pour l'interface
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [likedNews, setLikedNews] = useState<Set<number>>(new Set());
  const [bookmarkedNews, setBookmarkedNews] = useState<Set<number>>(new Set());
  const [showNotification, setShowNotification] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<string>('Tous');
  const [selectedLocation, setSelectedLocation] = useState<string>('Tous');
  const [visibleCount, setVisibleCount] = useState<number>(9);

  // Fonction utilitaire pour obtenir le nom de l'auteur de manière sécurisée
  const getAuthorName = (author: any): string => {
    if (!author) return 'Auteur inconnu';
    if (typeof author === 'string') return author;
    if (typeof author === 'object' && author.name) return author.name;
    return 'Auteur inconnu';
  };

  // Fonction utilitaire pour obtenir les initiales de l'auteur
  const getAuthorInitials = (author: any): string => {
    const name = getAuthorName(author);
    if (name === 'Auteur inconnu') return 'AI';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
  };

  // Charger les données depuis l'API
  const loadNews = async (filters: NewsFilters = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('📰 Chargement des actualités depuis l\'API...', filters);
      
      const response = await newsService.getNews({
        ...filters,
        per_page: 15,
        page: currentPage,
        sort_by: sortBy,
        sort_order: 'desc'
      });
      
      console.log('✅ Actualités chargées depuis l\'API:', response);
      setNews(response.data);
      setTotalPages(response.last_page);
      setTotalNews(response.total);
    } catch (err) {
      console.error('❌ Erreur lors du chargement des actualités:', err);
      setError('Erreur lors du chargement des actualités');
    } finally {
      setIsLoading(false);
    }
  };

  const loadFeaturedNews = async () => {
    try {
      console.log('⭐ Chargement des actualités en vedette depuis l\'API...');
      const response = await newsService.getFeaturedNews();
      console.log('✅ Actualités en vedette chargées depuis l\'API:', response);
      setFeaturedNews(response.data);
    } catch (err) {
      console.error('❌ Erreur lors du chargement des actualités en vedette:', err);
    }
  };

  const loadNewsStats = async () => {
    try {
      console.log('📊 Chargement des statistiques depuis l\'API...');
      const stats = await newsService.getNewsStats();
      console.log('✅ Statistiques chargées depuis l\'API:', stats);
      setNewsStats(stats);
    } catch (err) {
      console.error('❌ Erreur lors du chargement des statistiques:', err);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    loadNews();
    loadFeaturedNews();
    loadNewsStats();
  }, [currentPage, sortBy]);

  // Auto-play du carrousel
  useEffect(() => {
    if (featuredNews.length > 0) {
    const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredNews.length);
    }, 5000);
    return () => clearInterval(interval);
    }
  }, [featuredNews]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredNews.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredNews.length) % featuredNews.length);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
    }
  };

  const authorsList = ['Tous', ...Array.from(new Set(news.map(n => n.author)))];
  const locationsList = ['Tous', ...Array.from(new Set(news.map(n => n.location).filter(Boolean)))];
  

  // Fonctions de gestion des interactions
  const handleLike = async (newsId: number) => {
    try {
      await newsService.likeNews(newsId);
      setLikedNews(prev => {
      const newSet = new Set(prev);
        if (newSet.has(newsId)) {
          newSet.delete(newsId);
      } else {
          newSet.add(newsId);
      }
      return newSet;
    });
      // Recharger les actualités pour mettre à jour les compteurs
      loadNews();
    } catch (err) {
      console.error('Erreur lors du like:', err);
    }
  };

  const handleBookmark = (newsId: number) => {
    setBookmarkedNews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(newsId)) {
        newSet.delete(newsId);
      } else {
        newSet.add(newsId);
      }
      return newSet;
    });
  };

  const handleShare = async (newsItem: NewsItem) => {
    try {
      // Incrémenter le compteur de partages via l'API
      await newsService.shareNews(newsItem.id);
      
    const shareData = {
        title: newsItem.title || 'Actualités DOREMI',
        text: newsItem.excerpt || newsItem.content?.substring(0, 100) || 'Découvrez les dernières actualités de DOREMI',
      url: window.location.href
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      navigator.share(shareData)
        .then(() => {
          console.log('Partage réussi');
        })
        .catch((error) => {
          console.log('Erreur de partage:', error);
          fallbackShare(shareData);
        });
    } else {
      fallbackShare(shareData);
      }
    } catch (err) {
      console.error('Erreur lors du partage:', err);
    }
  };


  const fallbackShare = (shareData: any) => {
    const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText)
        .then(() => {
          alert('✅ Lien copié dans le presse-papiers !\n\nVous pouvez maintenant le coller où vous voulez.');
        })
        .catch(() => {
          prompt('Copiez ce lien pour partager :', shareText);
        });
    } else {
      prompt('Copiez ce lien pour partager :', shareText);
    }
  };

  const handleReadMore = (newsItem: NewsItem) => {
    navigate(`/actualites/${newsItem.id}`);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSearchTerm('');
    setSelectedAuthor('Tous');
    setSelectedLocation('Tous');
    // Recharger avec le nouveau filtre
    loadNews({ category: category === 'Tous' ? undefined : category });
  };

  const handleTrendingTopicClick = (topic: any) => {
    setSearchTerm(topic.name);
    setSelectedCategory('Tous');
    // Recharger avec la recherche
    loadNews({ search: topic.name });
  };

  const getSearchSuggestions = (term: string) => {
    if (!term.trim()) return [];
    
    const suggestions = [];
    const lowerTerm = term.toLowerCase();
    
    const authors = [...new Set(news.map(n => getAuthorName(n.author)))];
    const matchingAuthors = authors.filter(author => 
      author.toLowerCase().includes(lowerTerm)
    );
    
    const categories = [...new Set(news.map(n => n.category).filter(Boolean))];
    const matchingCategories = categories.filter(category => 
      category.toLowerCase().includes(lowerTerm)
    );
    
    const locations = [...new Set(news.map(n => n.location).filter(Boolean))];
    const matchingLocations = locations.filter(location => 
      location.toLowerCase().includes(lowerTerm)
    );
    
    return [
      ...matchingAuthors.map(author => ({ type: 'author', value: author, label: `Auteur: ${author}` })),
      ...matchingCategories.map(category => ({ type: 'category', value: category, label: `Catégorie: ${category}` })),
      ...matchingLocations.map(location => ({ type: 'location', value: location, label: `Lieu: ${location}` }))
    ].slice(0, 5);
  };

  const handleNotificationClick = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleNewsletterSubscribe = () => {
    const email = (document.querySelector('input[type="email"]') as HTMLInputElement)?.value;
    if (email) {
      alert(`Merci ! Vous êtes maintenant abonné à nos publicités avec l'adresse: ${email}`);
    } else {
      alert('Veuillez entrer une adresse email valide.');
    }
  };

  // Fonction pour gérer la recherche
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      loadNews({ search: term });
    } else {
      loadNews();
    }
  };

  const loadMoreNews = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-right">
          Notifications activées ! Vous recevrez les dernières publicités.
        </div>
      )}
      
    

      {/* Carrousel d'actualités en vedette moderne */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="w-8 h-8 text-yellow-500" />
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Publicités en vedette</h2>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
            <p className="text-gray-600 text-xl">Les dernières nouvelles importantes de notre communauté éducative</p>
          </div>

          <div className="relative">
            {/* Carrousel moderne */}
            <div className="relative h-[600px] overflow-hidden rounded-3xl shadow-2xl">
              {featuredNews.length > 0 ? (
                featuredNews.map((newsItem, index) => (
                <div
                    key={newsItem.id}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                    index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                  }`}
                >
                  <div className="relative h-full">
                    <img
                        src={newsItem.image_url || newsItem.featured_image_url || 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=400&fit=crop'}
                        alt={newsItem.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
                      <div className="flex items-center gap-6 mb-6">
                        <Badge variant="secondary" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 text-sm font-semibold">
                            {newsItem.category || 'Actualité'}
                        </Badge>
                        <div className="flex items-center gap-2 text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                          <Calendar className="w-4 h-4" />
                            {formatDate(newsItem.created_at)}
                        </div>
                          {newsItem.location && (
                        <div className="flex items-center gap-2 text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                          <MapPin className="w-4 h-4" />
                              {newsItem.location}
                        </div>
                          )}
                          {newsItem.read_time && (
                        <div className="flex items-center gap-2 text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                          <Clock className="w-4 h-4" />
                              {newsItem.read_time}
                        </div>
                          )}
                      </div>
                        <h3 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{newsItem.title}</h3>
                        <p className="text-xl mb-8 text-gray-200 max-w-4xl leading-relaxed">{newsItem.excerpt || newsItem.content?.substring(0, 200) + '...'}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                                {getAuthorInitials(newsItem.author)}
                            </span>
                          </div>
                          <div>
                              <span className="font-semibold text-lg">{getAuthorName(newsItem.author)}</span>
                            <div className="text-sm text-gray-300">Auteur DOREMI</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-6 text-sm bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                            <div className="flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                                {newsItem.views_count.toLocaleString()}
                            </div>
                            <div className="flex items-center gap-2">
                              <ThumbsUp className="w-4 h-4" />
                                {newsItem.likes_count}
                            </div>
                            <div className="flex items-center gap-2">
                              <MessageCircle className="w-4 h-4" />
                                {newsItem.comments_count}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-white">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
                    <p>Chargement des actualités en vedette...</p>
                  </div>
                </div>
              )}

              {/* Indicateurs modernes */}
              {featuredNews.length > 0 && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
                  {featuredNews.map((_, index) => (
                  <div
                    key={index}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-yellow-400 scale-125' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sujets tendance modernes */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Sujets tendance</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {newsStats?.by_category?.map((category, index) => (
              <div 
                key={index} 
                className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {category.category || 'Non catégorisé'}
                  </span>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-blue-600">{category.count}</div>
                <div className="text-xs text-gray-500">actualités</div>
              </div>
            )) || trendingTopics.map((topic, index) => (
              <div 
                key={index} 
                className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {topic.name}
                  </span>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-blue-600">{topic.count}</div>
                <div className="text-xs text-gray-500">mentions</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Liste des publicités moderne */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-16">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Toutes nos publicités
              </h2>
              <p className="text-gray-600 text-lg">
                Découvrez les dernières offres, promotions et formations disponibles
              </p>
            </div>
          </div>
          
          {/* État de chargement */}
          {isLoading ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Chargement des actualités...</h3>
              <p className="text-gray-600 mb-8 text-lg">Veuillez patienter pendant que nous récupérons les dernières actualités.</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-12 h-12 text-red-500" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Erreur de chargement</h3>
              <p className="text-gray-600 mb-8 text-lg">{error}</p>
              <Button onClick={() => loadNews()} className="bg-blue-600 hover:bg-blue-700">
                Réessayer
              </Button>
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Aucune actualité trouvée</h3>
              <p className="text-gray-600 mb-8 text-lg">Aucune actualité ne correspond à vos critères de recherche.</p>
            </div>
          ) : (
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((newsItem) => (
              <Card key={newsItem.id} className="group hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white border-0 shadow-lg hover:scale-105">
                <div className="relative overflow-hidden">
                  <img
                    src={newsItem.image_url || newsItem.featured_image_url || 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=400&fit=crop'}
                    alt={newsItem.title}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={`px-3 py-1 text-sm font-semibold ${
                      newsItem.priority === 'high' ? 'bg-red-500 text-white' :
                      newsItem.priority === 'medium' ? 'bg-yellow-500 text-white' :
                      'bg-green-500 text-white'
                    }`}>
                      {newsItem.category || 'Actualité'}
                    </Badge>
                  </div>
                  {newsItem.is_featured && (
                    <div className="absolute top-4 right-4">
                      <Star className="w-6 h-6 text-yellow-500 fill-current" />
                    </div>
                  )}
                </div>
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                      <Calendar className="w-3 h-3" />
                      {getTimeAgo(newsItem.created_at)}
                    </div>
                    {newsItem.location && (
                    <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                      <MapPin className="w-3 h-3" />
                        {newsItem.location}
                    </div>
                    )}
                    {newsItem.read_time && (
                    <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                      <Clock className="w-3 h-3" />
                        {newsItem.read_time}
                    </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                    {newsItem.title}
                  </h3>
                  <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">{newsItem.excerpt || newsItem.content?.substring(0, 150) + '...'}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {getAuthorInitials(newsItem.author)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{getAuthorName(newsItem.author)}</p>
                        <p className="text-xs text-gray-500">{newsItem.views_count.toLocaleString()} vues</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <button
                        onClick={() => handleLike(newsItem.id)}
                        className={`flex items-center gap-1 hover:text-red-600 transition-colors ${
                          likedNews.has(newsItem.id) ? 'text-red-600' : 'text-gray-500'
                        }`}
                      >
                        <ThumbsUp className={`w-4 h-4 ${likedNews.has(newsItem.id) ? 'fill-current' : ''}`} />
                        {newsItem.likes_count}
                      </button>
                      <button
                        onClick={() => handleReadMore(newsItem)}
                        className="flex items-center gap-1 hover:text-green-600 transition-colors text-gray-500"
                        title="Voir les commentaires"
                      >
                        <MessageCircle className="w-4 h-4" />
                        {newsItem.comments_count}
                      </button>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleReadMore(newsItem)}
                      className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all"
                    >
                      Lire plus
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          </>
          )}
        </div>
      </section>

      {/* Publicités spéciales modernes */}
      <section className="py-20 bg-gradient-to-br from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Target className="w-8 h-8 text-red-500" />
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Publicités spéciales</h2>
              <Target className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-gray-600 text-xl">Des offres exceptionnelles pour votre formation</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {featuredNews.slice(0, 2).map((newsItem) => (
              <Card key={newsItem.id} className="group hover:shadow-2xl transition-all duration-500 overflow-hidden border-0 shadow-lg hover:scale-105">
                <div className="relative overflow-hidden">
                  <img
                    src={newsItem.image_url || newsItem.featured_image_url || 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=400&fit=crop'}
                    alt={newsItem.title}
                    className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-6 left-6">
                    <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 text-sm font-semibold">
                      Spéciale
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                      <Calendar className="w-3 h-3" />
                      {formatDate(newsItem.created_at)}
                    </div>
                    {newsItem.location && (
                    <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                      <MapPin className="w-3 h-3" />
                        {newsItem.location}
                    </div>
                    )}
                    {newsItem.read_time && (
                    <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                      <Clock className="w-3 h-3" />
                        {newsItem.read_time}
                    </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                    {newsItem.title}
                  </h3>
                  <p className="text-gray-600 mb-6 line-clamp-4 leading-relaxed">{newsItem.excerpt || newsItem.content?.substring(0, 200) + '...'}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {getAuthorInitials(newsItem.author)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{getAuthorName(newsItem.author)}</p>
                        <p className="text-xs text-gray-500">{newsItem.views_count.toLocaleString()} vues</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

  
    </div>
  );
};

export default Actualites; 