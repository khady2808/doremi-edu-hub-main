import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { newsService, NewsItem } from '@/lib/newsService';
import { 
  FileText, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Heart,
  Share2,
  Calendar,
  Clock,
  User,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Star,
  MessageSquare,
  Settings,
  Upload,
  Download,
  MoreHorizontal,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  X,
  Maximize2,
  BarChart,
  PieChart as PieChartIcon,
  Activity,
  Zap,
  Target,
  Award,
  Shield,
  Bell,
  CreditCard,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Camera,
  CameraOff,
  Phone,
  PhoneOff,
  MessageCircle,
  Send,
  Paperclip,
  Smile,
  Frown,
  Meh,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Bookmark,
  BookmarkCheck,
  Share,
  Copy,
  Link,
  ExternalLink as ExternalLinkIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  File,
  Image,
  Video as VideoIcon,
  Music,
  Archive,
  Trash,
  Edit3,
  Save,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  HelpCircle,
  Lock,
  Unlock,
  Eye as EyeIcon,
  EyeOff,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  RotateCw,
  RefreshCw,
  RefreshCcw,
  Loader,
  Loader2,
  Zap as ZapIcon,
  Sun,
  Moon,
  Monitor,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Signal,
  SignalLow,
  SignalZero,
  MapPin
} from 'lucide-react';

export const AdminNews: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // États pour les filtres
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // États pour les données API
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les actualités depuis l'API
  const loadArticles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('📰 Chargement des actualités pour l\'admin...');
      
      const response = await newsService.getNews({
        per_page: 50, // Plus d'articles pour l'admin
        sort_by: 'created_at',
        sort_order: 'desc'
      });
      
      console.log('✅ Actualités chargées pour l\'admin:', response);
      setArticles(response.data);
    } catch (err) {
      console.error('❌ Erreur lors du chargement des actualités:', err);
      setError('Erreur lors du chargement des actualités');
      toast({
        title: "Erreur",
        description: "Impossible de charger les actualités",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  // Fonctions d'action
  const handleDeleteArticle = async (id: number) => {
    try {
      await newsService.deleteNews(id);
      toast({
        title: "Succès",
        description: "Actualité supprimée avec succès"
      });
      loadArticles(); // Recharger la liste
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'actualité",
        variant: "destructive"
      });
    }
  };

  const handleToggleFeatured = async (id: number) => {
    try {
      await newsService.toggleFeatured(id);
      toast({
        title: "Succès",
        description: "Statut 'en vedette' modifié"
      });
      loadArticles(); // Recharger la liste
    } catch (error) {
      console.error('Erreur lors du basculement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut",
        variant: "destructive"
      });
    }
  };

  const handleToggleUrgent = async (id: number) => {
    try {
      await newsService.toggleUrgent(id);
      toast({
        title: "Succès",
        description: "Statut 'urgent' modifié"
      });
      loadArticles(); // Recharger la liste
    } catch (error) {
      console.error('Erreur lors du basculement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut",
        variant: "destructive"
      });
    }
  };

  const handlePublishArticle = async (id: number) => {
    try {
      await newsService.publishNews(id);
      toast({
        title: "Succès",
        description: "Actualité publiée"
      });
      loadArticles(); // Recharger la liste
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
      toast({
        title: "Erreur",
        description: "Impossible de publier l'actualité",
        variant: "destructive"
      });
    }
  };

  const handleArchiveArticle = async (id: number) => {
    try {
      await newsService.archiveNews(id);
      toast({
        title: "Succès",
        description: "Actualité archivée"
      });
      loadArticles(); // Recharger la liste
    } catch (error) {
      console.error('Erreur lors de l\'archivage:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'archiver l'actualité",
        variant: "destructive"
      });
    }
  };

  // Navigation vers les pages
  const handleViewArticle = (article: NewsItem) => {
    navigate(`/admin/news/detail/${article.id}`);
  };

  const handleEditArticle = (article: NewsItem) => {
    navigate(`/admin/news/edit/${article.id}`);
  };

  const handleAddArticle = () => {
    navigate('/admin/news/add');
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (typeof article.author === 'object' && article.author?.name && article.author.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'featured' && article.is_featured) ||
                         (selectedFilter === 'urgent' && article.is_urgent) ||
                         (selectedFilter === 'published' && article.status === 'published') ||
                         (selectedFilter === 'draft' && article.status === 'draft');

    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || article.status === selectedStatus;

    return matchesSearch && matchesFilter && matchesCategory && matchesStatus;
  });

  // Statistiques
  const totalArticles = articles.length;
  const publishedArticles = articles.filter(article => article.status === 'published').length;
  const totalViews = articles.reduce((sum, article) => sum + (article.views_count || article.views || 0), 0);
  const totalLikes = articles.reduce((sum, article) => sum + (article.likes_count || article.likes || 0), 0);
  const totalShares = articles.reduce((sum, article) => sum + (article.shares_count || article.shares || 0), 0);

  // Fonctions utilitaires
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-50';
      case 'draft': return 'text-yellow-600 bg-yellow-50';
      case 'archived': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-blue-600 bg-blue-50';
      case 'low': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Cours': return 'text-blue-600 bg-blue-50';
      case 'Maintenance': return 'text-red-600 bg-red-50';
      case 'Équipe': return 'text-green-600 bg-green-50';
      case 'Plateforme': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des actualités...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadArticles} variant="outline">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Actualités</h1>
              <p className="text-gray-600 mt-2">Vue globale et gestion des annonces de DOREMI</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <FileText className="w-4 h-4 mr-1" />
                {totalArticles} Articles
              </Badge>
              <Button onClick={handleAddArticle}>
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter une Annonce
                  </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(totalArticles)}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                  +3 ce mois
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Articles Publiés</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(publishedArticles)}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                  {((publishedArticles / totalArticles) * 100).toFixed(1)}% du total
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Vues</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(totalViews)}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                  +12.5% ce mois
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(totalLikes + totalShares)}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                  +8.2% ce mois
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Filtres et recherche */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                  placeholder="Rechercher dans les actualités..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">Tous</option>
                <option value="featured">En vedette</option>
                <option value="urgent">Urgent</option>
                <option value="published">Publiés</option>
                <option value="draft">Brouillons</option>
              </select>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">Toutes catégories</option>
                <option value="Cours">Cours</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Équipe">Équipe</option>
                <option value="Plateforme">Plateforme</option>
              </select>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">Tous statuts</option>
                <option value="published">Publié</option>
                <option value="draft">Brouillon</option>
                <option value="archived">Archivé</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Liste des actualités */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Card 
                key={article.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleViewArticle(article)}
              >
                {(article.image_url || article.image) && (
                  <div className="relative">
                    <img
                      src={article.image_url || article.image}
                      alt={article.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 left-2 flex gap-1">
                      {article.is_urgent && (
                        <Badge className="bg-red-500 text-white text-xs">
                          <AlertCircle className="w-3 h-3 mr-1" />
                        Urgent
                      </Badge>
                    )}
                      {article.is_featured && (
                        <Badge className="bg-yellow-500 text-white text-xs">
                        <Star className="w-3 h-3 mr-1" />
                          Vedette
                      </Badge>
                    )}
                  </div>
                  </div>
                )}
                
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-2">{article.title}</h3>
                      {article.excerpt && (
                        <p className="text-gray-600 text-sm line-clamp-2 mt-1">{article.excerpt}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <img
                          src={typeof article.author === 'object' ? article.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${article.author?.name || 'user'}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${article.author || 'user'}`}
                          alt={typeof article.author === 'object' ? article.author?.name || 'Auteur' : article.author || 'Auteur'}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="font-medium">{typeof article.author === 'object' ? article.author?.name || 'Auteur inconnu' : article.author || 'Auteur inconnu'}</span>
                      </div>
                      <span>{formatDate(article.created_at)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(article.status)}>
                        {article.status === 'published' ? 'Publié' : 
                         article.status === 'draft' ? 'Brouillon' : 'Archivé'}
                      </Badge>
                      <Badge className={getPriorityColor(article.priority)}>
                        {article.priority === 'urgent' ? 'Urgente' : 
                         article.priority === 'high' ? 'Élevée' : 
                         article.priority === 'medium' ? 'Moyenne' : 'Faible'}
                      </Badge>
                    </div>
                      {article.category && (
                        <Badge className={getCategoryColor(article.category)}>
                          {article.category}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {formatNumber(article.views_count || article.views || 0)}
                    </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                          {formatNumber(article.likes_count || article.likes || 0)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="w-4 h-4" />
                          {formatNumber(article.shares_count || article.shares || 0)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Boutons d'action */}
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditArticle(article);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Modifier
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
                              handleDeleteArticle(article.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFeatured(article.id);
                          }}
                          className={article.is_featured ? "text-yellow-600" : "text-gray-400"}
                        >
                          <Star className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleUrgent(article.id);
                          }}
                          className={article.is_urgent ? "text-red-600" : "text-gray-400"}
                        >
                          <AlertCircle className="w-4 h-4" />
                        </Button>
                        {article.status === 'draft' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePublishArticle(article.id);
                            }}
                            className="text-green-600"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        {article.status === 'published' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleArchiveArticle(article.id);
                            }}
                            className="text-gray-600"
                          >
                            <Archive className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune actualité trouvée</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedFilter !== 'all' || selectedCategory !== 'all' || selectedStatus !== 'all'
                  ? 'Aucune actualité ne correspond à vos critères de recherche.'
                  : 'Commencez par créer votre première actualité.'}
              </p>
              <Button onClick={handleAddArticle}>
                <Plus className="w-4 h-4 mr-2" />
                Créer une actualité
              </Button>
                          </div>
                        )}
                      </div>
      </section>
    </div>
  );
};

export default AdminNews;
