import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/dialog';
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
  Gift
} from 'lucide-react';

// Données des publicités et annonces
const publicites = [
  {
    id: 1,
    title: "Offre spéciale : -50% sur tous les cours Premium",
    description: "Profitez de notre offre exceptionnelle ! Tous les cours Premium sont à -50% jusqu'à la fin du mois. Une opportunité unique de développer vos compétences à prix réduit.",
    image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=400&fit=crop",
    category: "Promotion",
    date: "2025-01-15",
    author: "Équipe Marketing",
    location: "Tout le Sénégal",
    readTime: "2 min",
    views: 3247,
    featured: true,
    likes: 189,
    comments: 45,
    priority: "high",
    discount: "50%",
    validUntil: "2025-01-31"
  },
  {
    id: 2,
    title: "Nouveau : Pack Formation Complète Développement Web",
    description: "Découvrez notre nouveau pack formation complète en développement web. HTML, CSS, JavaScript, React, Node.js - tout inclus ! Prix spécial lancement.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9e1?w=800&h=400&fit=crop",
    category: "Nouveau Produit",
    date: "2025-01-10",
    author: "Équipe Formation",
    location: "Dakar",
    readTime: "3 min",
    views: 2156,
    featured: true,
    likes: 156,
    comments: 32,
    priority: "high",
    price: "150,000 FCFA",
    originalPrice: "200,000 FCFA"
  },
  {
    id: 3,
    title: "Cours de français intensif - Inscriptions ouvertes",
    description: "Préparez-vous aux examens avec notre cours de français intensif. 3 mois de formation, 4h par semaine. Garantie de réussite ou remboursé !",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
    category: "Formation",
    date: "2025-01-08",
    author: "Centre Linguistique",
    location: "Dakar",
    readTime: "2 min",
    views: 1893,
    featured: true,
    likes: 134,
    comments: 28,
    priority: "high",
    price: "75,000 FCFA",
    guarantee: "Garantie réussite"
  },
  {
    id: 4,
    title: "Stages en entreprise - Plus de 100 offres disponibles",
    description: "Trouvez votre stage idéal ! Plus de 100 entreprises partenaires proposent des stages dans tous les domaines. CV et lettre de motivation inclus.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop",
    category: "Stage",
    date: "2025-01-05",
    author: "Service Placement",
    location: "Sénégal",
    readTime: "2 min",
    views: 4421,
    featured: false,
    likes: 267,
    comments: 78,
    priority: "medium",
    price: "Gratuit",
    offers: "100+ offres"
  },
  {
    id: 5,
    title: "Pack Bureautique Office - Formation certifiante",
    description: "Maîtrisez Word, Excel, PowerPoint et Access. Formation certifiante Microsoft Office. Certificat reconnu internationalement.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
    category: "Certification",
    date: "2025-01-03",
    author: "Centre de Certification",
    location: "Dakar",
    readTime: "2 min",
    views: 2987,
    featured: false,
    likes: 198,
    comments: 56,
    priority: "medium",
    price: "120,000 FCFA",
    certification: "Microsoft Office"
  },
  {
    id: 6,
    title: "Cours de programmation Python - Débutants",
    description: "Apprenez Python de zéro ! Cours spécialement conçu pour les débutants. Projets pratiques inclus. Support en ligne 24/7.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=400&fit=crop",
    category: "Programmation",
    date: "2025-01-01",
    author: "École de Code",
    location: "Dakar",
    readTime: "2 min",
    views: 1654,
    featured: false,
    likes: 145,
    comments: 29,
    priority: "medium",
    price: "85,000 FCFA",
    level: "Débutant"
  },
  {
    id: 7,
    title: "Formation en Marketing Digital - 100% en ligne",
    description: "Devenez expert en marketing digital ! Formation complète en ligne avec accès illimité. Facebook Ads, Google Ads, SEO, Email Marketing.",
    image: "https://images.unsplash.com/photo-1523240798132-87572f3f5959?w=800&h=400&fit=crop",
    category: "Marketing",
    date: "2024-12-28",
    author: "Digital Academy",
    location: "En ligne",
    readTime: "3 min",
    views: 3123,
    featured: false,
    likes: 212,
    comments: 89,
    priority: "high",
    price: "95,000 FCFA",
    format: "100% en ligne"
  },
  {
    id: 8,
    title: "Cours de Comptabilité - Préparation DCG",
    description: "Préparez le Diplôme de Comptabilité et de Gestion (DCG) avec nos experts. Cours du soir et weekends disponibles.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop",
    category: "Comptabilité",
    date: "2024-12-25",
    author: "Institut Comptable",
    location: "Dakar",
    readTime: "2 min",
    views: 1876,
    featured: false,
    likes: 167,
    comments: 43,
    priority: "medium",
    price: "180,000 FCFA",
    exam: "DCG"
  },
  {
    id: 9,
    title: "Formation en Gestion de Projet - Méthode Agile",
    description: "Maîtrisez les méthodes Agile et Scrum. Formation certifiante avec simulation de projets réels. Certificat PMI reconnu.",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=400&fit=crop",
    category: "Gestion",
    date: "2024-12-20",
    author: "Project Management Institute",
    location: "Dakar",
    readTime: "3 min",
    views: 2341,
    featured: false,
    likes: 189,
    comments: 52,
    priority: "high",
    price: "250,000 FCFA",
    certification: "PMI"
  },
  {
    id: 10,
    title: "Cours de Design Graphique - Adobe Creative Suite",
    description: "Créez des designs professionnels avec Photoshop, Illustrator et InDesign. Formation pratique avec projets réels.",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=400&fit=crop",
    category: "Design",
    date: "2024-12-18",
    author: "Design Studio",
    location: "Dakar",
    readTime: "2 min",
    views: 1987,
    featured: false,
    likes: 234,
    comments: 67,
    priority: "medium",
    price: "140,000 FCFA",
    software: "Adobe Creative Suite"
  },
  {
    id: 11,
    title: "Formation en Langues - Anglais, Espagnol, Allemand",
    description: "Apprenez une nouvelle langue ! Cours d'anglais, espagnol et allemand. Niveaux débutant à avancé. Cours particuliers disponibles.",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=400&fit=crop",
    category: "Langues",
    date: "2024-12-15",
    author: "Centre Multilingue",
    location: "Dakar",
    readTime: "2 min",
    views: 2765,
    featured: false,
    likes: 198,
    comments: 45,
    priority: "medium",
    price: "60,000 FCFA",
    languages: "Anglais, Espagnol, Allemand"
  },
  {
    id: 12,
    title: "Pack Entrepreneuriat - Créez votre entreprise",
    description: "Transformez votre idée en entreprise ! Formation complète en entrepreneuriat. Business plan, financement, marketing, légal.",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop",
    category: "Entrepreneuriat",
    date: "2024-12-12",
    author: "Business School",
    location: "Dakar",
    readTime: "3 min",
    views: 1543,
    featured: false,
    likes: 123,
    comments: 34,
    priority: "high",
    price: "200,000 FCFA",
    includes: "Business Plan inclus"
  }
];

// Publicités en vedette
const featuredAds = [
  {
    id: 13,
    title: "MEGA PROMO : Tous les cours à -70%",
    description: "Offre exceptionnelle ! Tous nos cours sont à -70% pour les 100 premiers inscrits. Une opportunité unique de se former à prix cassé !",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
    category: "MEGA PROMO",
    date: "2024-12-18",
    author: "DOREMI Éducation",
    location: "Tout le Sénégal",
    readTime: "1 min",
    views: 8678,
    featured: true,
    likes: 756,
    comments: 223,
    priority: "high",
    discount: "70%",
    limited: "100 places"
  },
  {
    id: 14,
    title: "Formation Complète Full-Stack - Garantie Emploi",
    description: "Devenez développeur full-stack en 6 mois ! Formation intensive avec garantie d'emploi. Plus de 95% de nos étudiants trouvent un emploi.",
    image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=400&fit=crop",
    category: "Garantie Emploi",
    date: "2024-12-15",
    author: "Tech Academy",
    location: "Dakar",
    readTime: "3 min",
    views: 5321,
    featured: true,
    likes: 445,
    comments: 189,
    priority: "high",
    price: "350,000 FCFA",
    guarantee: "Garantie emploi"
  }
];

// Catégories de publicités
const categories = ['Tous', 'Promotion', 'Nouveau Produit', 'Formation', 'Stage', 'Certification', 'Programmation', 'Marketing', 'Comptabilité', 'Gestion', 'Design', 'Langues', 'Entrepreneuriat'];

// Sujets tendance
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [likedAds, setLikedAds] = useState<Set<number>>(new Set());
  const [bookmarkedAds, setBookmarkedAds] = useState<Set<number>>(new Set());
  const [showNotification, setShowNotification] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<string>('Tous');
  const [selectedLocation, setSelectedLocation] = useState<string>('Tous');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAd, setModalAd] = useState<any | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(9);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-play du carrousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % publicites.filter(a => a.featured).length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    const featuredAds = publicites.filter(a => a.featured);
    setCurrentSlide((prev) => (prev + 1) % featuredAds.length);
  };

  const prevSlide = () => {
    const featuredAds = publicites.filter(a => a.featured);
    setCurrentSlide((prev) => (prev - 1 + featuredAds.length) % featuredAds.length);
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

  const authorsList = ['Tous', ...Array.from(new Set(publicites.map(a => a.author)))];
  const locationsList = ['Tous', ...Array.from(new Set(publicites.map(a => a.location)))];
  

  
  // Filtrage et tri des publicités
  let filteredAds = publicites.filter(ad => {
    const matchesCategory = selectedCategory === 'Tous' || ad.category === selectedCategory;
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAuthor = selectedAuthor === 'Tous' || ad.author === selectedAuthor;
    const matchesLocation = selectedLocation === 'Tous' || ad.location === selectedLocation;
    return matchesCategory && matchesSearch && matchesAuthor && matchesLocation;
  });

  // Tri des publicités
  filteredAds.sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'views':
        return b.views - a.views;
      case 'likes':
        return b.likes - a.likes;
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
      default:
        return 0;
    }
  });

  const featuredAdsForCarousel = publicites.filter(a => a.featured);

  // Fonctions de gestion des interactions
  const handleLike = (adId: number) => {
    setLikedAds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(adId)) {
        newSet.delete(adId);
      } else {
        newSet.add(adId);
      }
      return newSet;
    });
  };

  const handleBookmark = (adId: number) => {
    setBookmarkedAds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(adId)) {
        newSet.delete(adId);
      } else {
        newSet.add(adId);
      }
      return newSet;
    });
  };

  const handleShare = (ad: any) => {
    const shareData = {
      title: ad.title || 'Publicités DOREMI',
      text: ad.description || 'Découvrez les dernières publicités de DOREMI',
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

  const handleReadMore = (ad: any) => {
    setModalAd(ad);
    setIsModalOpen(true);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSearchTerm('');
    setSelectedAuthor('Tous');
    setSelectedLocation('Tous');
  };

  const handleTrendingTopicClick = (topic: any) => {
    setSearchTerm(topic.name);
    setSelectedCategory('Tous');
  };

  const getSearchSuggestions = (term: string) => {
    if (!term.trim()) return [];
    
    const suggestions = [];
    const lowerTerm = term.toLowerCase();
    
    const authors = [...new Set(publicites.map(a => a.author))];
    const matchingAuthors = authors.filter(author => 
      author.toLowerCase().includes(lowerTerm)
    );
    
    const categories = [...new Set(publicites.map(a => a.category))];
    const matchingCategories = categories.filter(category => 
      category.toLowerCase().includes(lowerTerm)
    );
    
    const locations = [...new Set(publicites.map(a => a.location))];
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

  const loadMoreAds = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((v) => v + 6);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-right">
          Notifications activées ! Vous recevrez les dernières publicités.
        </div>
      )}
      
      {/* Header moderne avec animations */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white py-20 relative overflow-hidden">
        {/* Effets de fond animés */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-2000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Megaphone className="w-8 h-8 text-yellow-400 animate-pulse" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Publicités & Annonces
            </h1>
            <Tag className="w-8 h-8 text-yellow-400 animate-pulse" />
          </div>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Découvrez nos dernières offres, promotions et formations disponibles sur la plateforme DOREMI
          </p>
          
          {/* Barre de recherche moderne */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
              <Input
                type="text"
                placeholder="Rechercher des publicités, promotions, formations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-4 bg-white/10 border-white/20 text-white placeholder-gray-300 focus:bg-white/20 focus:border-white/40 transition-all duration-300 rounded-xl"
                onFocus={() => setShowNotification(false)}
              />
              
              {/* Suggestions de recherche améliorées */}
              {searchTerm.length > 1 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border border-white/20 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto">
                  <div className="p-3">
                    {getSearchSuggestions(searchTerm).map((suggestion, index) => (
                      <div
                        key={index}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 rounded-lg text-left"
                      >
                        <Search className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{suggestion.label}</span>
                      </div>
                    ))}
                    {getSearchSuggestions(searchTerm).length === 0 && searchTerm.length > 2 && (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        Aucune suggestion trouvée pour "{searchTerm}"
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

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
              {featuredAdsForCarousel.map((ad, index) => (
                <div
                  key={ad.id}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                    index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                  }`}
                >
                  <div className="relative h-full">
                    <img
                      src={ad.image}
                      alt={ad.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
                      <div className="flex items-center gap-6 mb-6">
                        <Badge variant="secondary" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 text-sm font-semibold">
                          {ad.category}
                        </Badge>
                        <div className="flex items-center gap-2 text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                          <Calendar className="w-4 h-4" />
                          {formatDate(ad.date)}
                        </div>
                        <div className="flex items-center gap-2 text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                          <MapPin className="w-4 h-4" />
                          {ad.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                          <Clock className="w-4 h-4" />
                          {ad.readTime}
                        </div>
                      </div>
                      <h3 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{ad.title}</h3>
                      <p className="text-xl mb-8 text-gray-200 max-w-4xl leading-relaxed">{ad.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {ad.author.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <span className="font-semibold text-lg">{ad.author}</span>
                            <div className="text-sm text-gray-300">Auteur DOREMI</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-6 text-sm bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                            <div className="flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              {ad.views.toLocaleString()}
                            </div>
                            <div className="flex items-center gap-2">
                              <ThumbsUp className="w-4 h-4" />
                              {ad.likes}
                            </div>
                            <div className="flex items-center gap-2">
                              <MessageCircle className="w-4 h-4" />
                              {ad.comments}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Indicateurs modernes */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
                {featuredAdsForCarousel.map((_, index) => (
                  <div
                    key={index}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-yellow-400 scale-125' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
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
            {trendingTopics.map((topic, index) => (
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
          
          {/* État vide moderne */}
          {filteredAds.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Aucun résultat</h3>
              <p className="text-gray-600 mb-8 text-lg">Aucune publicité ne correspond à vos filtres.</p>
            </div>
          ) : (
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAds.slice(0, visibleCount).map((ad) => (
              <Card key={ad.id} className="group hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white border-0 shadow-lg hover:scale-105">
                <div className="relative overflow-hidden">
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={`px-3 py-1 text-sm font-semibold ${
                      ad.priority === 'high' ? 'bg-red-500 text-white' :
                      ad.priority === 'medium' ? 'bg-yellow-500 text-white' :
                      'bg-green-500 text-white'
                    }`}>
                      {ad.category}
                    </Badge>
                  </div>
                  {ad.featured && (
                    <div className="absolute top-4 right-4">
                      <Star className="w-6 h-6 text-yellow-500 fill-current" />
                    </div>
                  )}
                </div>
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                      <Calendar className="w-3 h-3" />
                      {getTimeAgo(ad.date)}
                    </div>
                    <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                      <MapPin className="w-3 h-3" />
                      {ad.location}
                    </div>
                    <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                      <Clock className="w-3 h-3" />
                      {ad.readTime}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                    {ad.title}
                  </h3>
                  <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">{ad.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {ad.author.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{ad.author}</p>
                        <p className="text-xs text-gray-500">{ad.views.toLocaleString()} vues</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        {ad.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {ad.comments}
                      </div>
                    </div>
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
            {featuredAds.map((ad) => (
              <Card key={ad.id} className="group hover:shadow-2xl transition-all duration-500 overflow-hidden border-0 shadow-lg hover:scale-105">
                <div className="relative overflow-hidden">
                  <img
                    src={ad.image}
                    alt={ad.title}
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
                      {formatDate(ad.date)}
                    </div>
                    <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                      <MapPin className="w-3 h-3" />
                      {ad.location}
                    </div>
                    <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                      <Clock className="w-3 h-3" />
                      {ad.readTime}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                    {ad.title}
                  </h3>
                  <p className="text-gray-600 mb-6 line-clamp-4 leading-relaxed">{ad.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {ad.author.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{ad.author}</p>
                        <p className="text-xs text-gray-500">{ad.views.toLocaleString()} vues</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistiques modernes */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white relative overflow-hidden">
        {/* Effets de fond animés */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-40 w-24 h-24 bg-white/5 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-white/5 rounded-full animate-pulse delay-2000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Award className="w-10 h-10 text-yellow-400" />
              <h2 className="text-4xl font-bold mb-4">DOREMI en chiffres</h2>
              <Award className="w-10 h-10 text-yellow-400" />
            </div>
            <p className="text-xl text-blue-100">L'impact de notre plateforme éducative</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="text-5xl font-bold mb-3 group-hover:scale-110 transition-transform duration-300">50,000+</div>
              <p className="text-blue-100 text-lg">Étudiants formés</p>
            </div>
            <div className="text-center group">
              <div className="text-5xl font-bold mb-3 group-hover:scale-110 transition-transform duration-300">200+</div>
              <p className="text-blue-100 text-lg">Cours disponibles</p>
            </div>
            <div className="text-center group">
              <div className="text-5xl font-bold mb-3 group-hover:scale-110 transition-transform duration-300">95%</div>
              <p className="text-blue-100 text-lg">Taux de réussite</p>
            </div>
            <div className="text-center group">
              <div className="text-5xl font-bold mb-3 group-hover:scale-110 transition-transform duration-300">15</div>
              <p className="text-blue-100 text-lg">Villes couvertes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter moderne */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
        {/* Effets de fond */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold">Restez informé</h2>
          </div>
          <p className="text-xl mb-10 text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Recevez nos dernières actualités et offres spéciales directement dans votre boîte mail
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-6 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
            />
          </div>
          <p className="text-sm text-gray-400 mt-6">
            Nous respectons votre vie privée. Désabonnement à tout moment.
          </p>
        </div>
      </section>

      {/* Modal détails article moderne */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {modalAd && (
            <>
              <DialogHeader className="pb-6">
                <DialogTitle className="text-2xl font-bold">{modalAd.title}</DialogTitle>
                <DialogDescription className="text-lg">
                  <div className="flex items-center gap-4 mt-2">
                    <span>{formatDate(modalAd.date)}</span>
                    <span>•</span>
                    <span>{modalAd.location}</span>
                    <span>•</span>
                    <span>{modalAd.readTime}</span>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="relative">
                  <img 
                    src={modalAd.image} 
                    alt={modalAd.title} 
                    className="w-full h-80 object-cover rounded-xl shadow-lg" 
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={`px-3 py-1 text-sm font-semibold ${
                      modalAd.priority === 'high' ? 'bg-red-500 text-white' :
                      modalAd.priority === 'medium' ? 'bg-yellow-500 text-white' :
                      'bg-green-500 text-white'
                    }`}>
                      {modalAd.category}
                    </Badge>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">{modalAd.description}</p>
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {modalAd.author.split(' ').map((n: string) => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{modalAd.author}</p>
                      <p className="text-xs text-gray-500">{modalAd.views.toLocaleString()} vues</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleLike(modalAd.id)} 
                      className={`${likedAds.has(modalAd.id) ? 'text-red-600' : 'text-gray-400'} hover:text-red-600 hover:bg-red-50`}
                    >
                      <Heart className={`w-5 h-5 ${likedAds.has(modalAd.id) ? 'fill-current' : ''}`} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleShare(modalAd)}
                      className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Partager
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Actualites; 