import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  History,
  Bookmark,
  Tag,
  Image,
  Link,
  Globe,
  MapPin
} from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: {
    name: string;
    email: string;
    avatar: string;
  };
  category: string;
  status: 'published' | 'draft' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  publishDate: string;
  lastModified: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  tags: string[];
  imageUrl?: string;
  isUrgent: boolean;
  isFeatured: boolean;
}

export const AdminNews: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Formulaire pour ajouter une annonce
  const [newArticle, setNewArticle] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    priority: 'medium' as const,
    tags: '',
    imageUrl: '',
    isUrgent: false,
    isFeatured: false
  });

  // Données simulées pour les articles
  const [articles] = useState<NewsArticle[]>([
    {
      id: '1',
      title: 'Nouveau Cours de Mathématiques Avancées Disponible',
      content: 'Nous sommes ravis d\'annoncer la disponibilité de notre nouveau cours de mathématiques avancées. Ce cours couvre les concepts fondamentaux des mathématiques modernes et est conçu pour les étudiants de niveau supérieur.',
      excerpt: 'Découvrez notre nouveau cours de mathématiques avancées avec des concepts modernes et innovants.',
      author: {
        name: 'Dr. Amadou Diallo',
        email: 'amadou.diallo@doremi.fr',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amadou'
      },
      category: 'Cours',
      status: 'published',
      priority: 'high',
      publishDate: '2024-01-20T10:00:00Z',
      lastModified: '2024-01-20T10:00:00Z',
      views: 1247,
      likes: 89,
      shares: 23,
      comments: 12,
      tags: ['mathématiques', 'cours', 'avancé'],
      imageUrl: 'https://via.placeholder.com/400x200/3B82F6/FFFFFF?text=Math+Avancées',
      isUrgent: false,
      isFeatured: true
    },
    {
      id: '2',
      title: 'Maintenance Planifiée - 25 Janvier 2024',
      content: 'Une maintenance planifiée aura lieu le 25 janvier 2024 de 02h00 à 06h00 GMT. Pendant cette période, la plateforme sera temporairement indisponible. Nous nous excusons pour la gêne occasionnée.',
      excerpt: 'Maintenance planifiée le 25 janvier 2024. La plateforme sera temporairement indisponible.',
      author: {
        name: 'Admin DOREMI',
        email: 'admin@doremi.fr',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
      },
      category: 'Maintenance',
      status: 'published',
      priority: 'urgent',
      publishDate: '2024-01-19T14:30:00Z',
      lastModified: '2024-01-19T14:30:00Z',
      views: 2156,
      likes: 45,
      shares: 67,
      comments: 8,
      tags: ['maintenance', 'plateforme', 'indisponibilité'],
      isUrgent: true,
      isFeatured: false
    },
    {
      id: '3',
      title: 'Nouveaux Instructeurs Rejoignent DOREMI',
      content: 'Nous accueillons chaleureusement nos nouveaux instructeurs qui enrichiront notre plateforme avec leur expertise dans divers domaines. Découvrez leurs profils et les cours qu\'ils proposeront.',
      excerpt: 'Découvrez nos nouveaux instructeurs et leurs cours spécialisés.',
      author: {
        name: 'Fatou Ndiaye',
        email: 'fatou.ndiaye@doremi.fr',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fatou'
      },
      category: 'Équipe',
      status: 'published',
      priority: 'medium',
      publishDate: '2024-01-18T09:15:00Z',
      lastModified: '2024-01-18T09:15:00Z',
      views: 892,
      likes: 67,
      shares: 15,
      comments: 5,
      tags: ['instructeurs', 'équipe', 'nouveaux'],
      imageUrl: 'https://via.placeholder.com/400x200/10B981/FFFFFF?text=Nouveaux+Instructeurs',
      isUrgent: false,
      isFeatured: false
    },
    {
      id: '4',
      title: 'Améliorations de l\'Interface Utilisateur',
      content: 'Nous avons apporté plusieurs améliorations à l\'interface utilisateur pour une meilleure expérience de navigation. Découvrez les nouvelles fonctionnalités disponibles.',
      excerpt: 'Découvrez les nouvelles améliorations de l\'interface utilisateur.',
      author: {
        name: 'Admin DOREMI',
        email: 'admin@doremi.fr',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
      },
      category: 'Plateforme',
      status: 'draft',
      priority: 'low',
      publishDate: '2024-01-17T16:45:00Z',
      lastModified: '2024-01-20T11:30:00Z',
      views: 0,
      likes: 0,
      shares: 0,
      comments: 0,
      tags: ['interface', 'améliorations', 'fonctionnalités'],
      isUrgent: false,
      isFeatured: false
    }
  ]);

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

  const handleArticleClick = (article: NewsArticle) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const handleAddArticle = () => {
    // Simuler l'ajout d'un article
    const newArticleData: NewsArticle = {
      id: Date.now().toString(),
      title: newArticle.title,
      content: newArticle.content,
      excerpt: newArticle.excerpt,
      author: {
        name: 'Admin DOREMI',
        email: 'admin@doremi.fr',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
      },
      category: newArticle.category,
      status: 'draft',
      priority: newArticle.priority,
      publishDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      views: 0,
      likes: 0,
      shares: 0,
      comments: 0,
      tags: newArticle.tags.split(',').map(tag => tag.trim()),
      imageUrl: newArticle.imageUrl || undefined,
      isUrgent: newArticle.isUrgent,
      isFeatured: newArticle.isFeatured
    };

    // Ici, vous ajouteriez normalement l'article à votre base de données
    console.log('Nouvel article ajouté:', newArticleData);
    
    // Réinitialiser le formulaire
    setNewArticle({
      title: '',
      content: '',
      excerpt: '',
      category: '',
      priority: 'medium',
      tags: '',
      imageUrl: '',
      isUrgent: false,
      isFeatured: false
    });
    
    setIsAddModalOpen(false);
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.author.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'urgent' && article.isUrgent) ||
                         (selectedFilter === 'featured' && article.isFeatured);
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || article.status === selectedStatus;
    
    return matchesSearch && matchesFilter && matchesCategory && matchesStatus;
  });

  const totalArticles = articles.length;
  const publishedArticles = articles.filter(article => article.status === 'published').length;
  const urgentArticles = articles.filter(article => article.isUrgent).length;
  const featuredArticles = articles.filter(article => article.isFeatured).length;
  const totalViews = articles.reduce((sum, article) => sum + article.views, 0);
  const totalLikes = articles.reduce((sum, article) => sum + article.likes, 0);
  const totalShares = articles.reduce((sum, article) => sum + article.shares, 0);

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
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter une Annonce
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Ajouter une Nouvelle Annonce</DialogTitle>
                    <DialogDescription>
                      Créez une nouvelle annonce pour informer les utilisateurs
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Titre *</label>
                      <Input
                        placeholder="Titre de l'annonce"
                        value={newArticle.title}
                        onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Extrait</label>
                      <Textarea
                        placeholder="Résumé court de l'annonce"
                        value={newArticle.excerpt}
                        onChange={(e) => setNewArticle({...newArticle, excerpt: e.target.value})}
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Contenu *</label>
                      <Textarea
                        placeholder="Contenu complet de l'annonce"
                        value={newArticle.content}
                        onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
                        rows={6}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Catégorie</label>
                        <Select value={newArticle.category} onValueChange={(value) => setNewArticle({...newArticle, category: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Cours">Cours</SelectItem>
                            <SelectItem value="Maintenance">Maintenance</SelectItem>
                            <SelectItem value="Équipe">Équipe</SelectItem>
                            <SelectItem value="Plateforme">Plateforme</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Priorité</label>
                        <Select value={newArticle.priority} onValueChange={(value: any) => setNewArticle({...newArticle, priority: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Faible</SelectItem>
                            <SelectItem value="medium">Moyenne</SelectItem>
                            <SelectItem value="high">Élevée</SelectItem>
                            <SelectItem value="urgent">Urgente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Tags</label>
                      <Input
                        placeholder="tags, séparés, par, des, virgules"
                        value={newArticle.tags}
                        onChange={(e) => setNewArticle({...newArticle, tags: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">URL de l'image (optionnel)</label>
                      <Input
                        placeholder="https://example.com/image.jpg"
                        value={newArticle.imageUrl}
                        onChange={(e) => setNewArticle({...newArticle, imageUrl: e.target.value})}
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isUrgent"
                          checked={newArticle.isUrgent}
                          onChange={(e) => setNewArticle({...newArticle, isUrgent: e.target.checked})}
                          className="rounded"
                        />
                        <label htmlFor="isUrgent" className="text-sm">Urgent</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isFeatured"
                          checked={newArticle.isFeatured}
                          onChange={(e) => setNewArticle({...newArticle, isFeatured: e.target.checked})}
                          className="rounded"
                        />
                        <label htmlFor="isFeatured" className="text-sm">Mis en avant</label>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                        Annuler
                      </Button>
                      <Button onClick={handleAddArticle} disabled={!newArticle.title || !newArticle.content}>
                        Publier l'Annonce
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
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
                  Likes + Partages
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Filtres */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filtre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les articles</SelectItem>
                <SelectItem value="urgent">Urgents</SelectItem>
                <SelectItem value="featured">Mis en avant</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                <SelectItem value="Cours">Cours</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Équipe">Équipe</SelectItem>
                <SelectItem value="Plateforme">Plateforme</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="published">Publiés</SelectItem>
                <SelectItem value="draft">Brouillons</SelectItem>
                <SelectItem value="archived">Archivés</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Liste des Articles */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Card 
                key={article.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleArticleClick(article)}
              >
                {article.imageUrl && (
                  <div className="relative">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {article.isUrgent && (
                      <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                        Urgent
                      </Badge>
                    )}
                    {article.isFeatured && (
                      <Badge className="absolute top-2 right-2 bg-yellow-500 text-white">
                        <Star className="w-3 h-3 mr-1" />
                        En avant
                      </Badge>
                    )}
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                      <CardDescription className="line-clamp-2 mt-2">{article.excerpt}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Auteur:</span>
                      <div className="flex items-center gap-2">
                        <img
                          src={article.author.avatar}
                          alt={article.author.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-sm font-medium">{article.author.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Catégorie:</span>
                      <Badge className={getCategoryColor(article.category)}>
                        {article.category}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Statut:</span>
                      <Badge className={getStatusColor(article.status)}>
                        {article.status === 'published' ? 'Publié' : 
                         article.status === 'draft' ? 'Brouillon' : 'Archivé'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Priorité:</span>
                      <Badge className={getPriorityColor(article.priority)}>
                        {article.priority === 'urgent' ? 'Urgente' : 
                         article.priority === 'high' ? 'Élevée' : 
                         article.priority === 'medium' ? 'Moyenne' : 'Faible'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Publié le:</span>
                      <span>{formatDate(article.publishDate)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Vues:</span>
                      <span>{formatNumber(article.views)}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {formatNumber(article.likes)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="w-4 h-4" />
                        {formatNumber(article.shares)}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {formatNumber(article.comments)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Modal pour les détails de l'article */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Détails de l'Article - {selectedArticle?.title}
            </DialogTitle>
            <DialogDescription>
              Informations complètes sur l'article et ses statistiques
            </DialogDescription>
          </DialogHeader>
          
          {selectedArticle && (
            <div className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                  <TabsTrigger value="content">Contenu</TabsTrigger>
                  <TabsTrigger value="stats">Statistiques</TabsTrigger>
                </TabsList>

                {/* Vue d'ensemble */}
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Informations de base */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          Informations de Base
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Titre:</span>
                            <span className="font-medium">{selectedArticle.title}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Catégorie:</span>
                            <Badge className={getCategoryColor(selectedArticle.category)}>
                              {selectedArticle.category}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Statut:</span>
                            <Badge className={getStatusColor(selectedArticle.status)}>
                              {selectedArticle.status === 'published' ? 'Publié' : 
                               selectedArticle.status === 'draft' ? 'Brouillon' : 'Archivé'}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Priorité:</span>
                            <Badge className={getPriorityColor(selectedArticle.priority)}>
                              {selectedArticle.priority === 'urgent' ? 'Urgente' : 
                               selectedArticle.priority === 'high' ? 'Élevée' : 
                               selectedArticle.priority === 'medium' ? 'Moyenne' : 'Faible'}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Date de publication:</span>
                            <span className="font-medium">{formatDateTime(selectedArticle.publishDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Dernière modification:</span>
                            <span className="font-medium">{formatDateTime(selectedArticle.lastModified)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Auteur et engagement */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <User className="w-5 h-5" />
                          Auteur et Engagement
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={selectedArticle.author.avatar}
                              alt={selectedArticle.author.name}
                              className="w-12 h-12 rounded-full"
                            />
                            <div>
                              <h4 className="font-semibold">{selectedArticle.author.name}</h4>
                              <p className="text-sm text-gray-600">{selectedArticle.author.email}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <div className="text-lg font-bold text-blue-600">
                                {formatNumber(selectedArticle.views)}
                              </div>
                              <div className="text-sm text-gray-600">Vues</div>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                              <div className="text-lg font-bold text-green-600">
                                {formatNumber(selectedArticle.likes)}
                              </div>
                              <div className="text-sm text-gray-600">Likes</div>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                              <div className="text-lg font-bold text-purple-600">
                                {formatNumber(selectedArticle.shares)}
                              </div>
                              <div className="text-sm text-gray-600">Partages</div>
                            </div>
                            <div className="text-center p-3 bg-orange-50 rounded-lg">
                              <div className="text-lg font-bold text-orange-600">
                                {formatNumber(selectedArticle.comments)}
                              </div>
                              <div className="text-sm text-gray-600">Commentaires</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Contenu */}
                <TabsContent value="content" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Contenu de l'Article
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Extrait</h4>
                          <p className="text-gray-700">{selectedArticle.excerpt}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Contenu Complet</h4>
                          <p className="text-gray-700 whitespace-pre-wrap">{selectedArticle.content}</p>
                        </div>
                        {selectedArticle.tags.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">Tags</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedArticle.tags.map((tag, index) => (
                                <Badge key={index} variant="outline">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Statistiques */}
                <TabsContent value="stats" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart className="w-5 h-5" />
                        Statistiques Détaillées
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                              {formatNumber(selectedArticle.views)}
                            </div>
                            <div className="text-sm text-gray-600">Vues Totales</div>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                              {formatNumber(selectedArticle.likes)}
                            </div>
                            <div className="text-sm text-gray-600">Likes</div>
                          </div>
                          <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">
                              {formatNumber(selectedArticle.shares)}
                            </div>
                            <div className="text-sm text-gray-600">Partages</div>
                          </div>
                          <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">
                              {formatNumber(selectedArticle.comments)}
                            </div>
                            <div className="text-sm text-gray-600">Commentaires</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Taux d'engagement:</span>
                            <span className="font-medium">
                              {selectedArticle.views > 0 ? 
                               (((selectedArticle.likes + selectedArticle.shares + selectedArticle.comments) / selectedArticle.views) * 100).toFixed(1) : 0}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Taux de partage:</span>
                            <span className="font-medium">
                              {selectedArticle.views > 0 ? 
                               ((selectedArticle.shares / selectedArticle.views) * 100).toFixed(1) : 0}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Taux de like:</span>
                            <span className="font-medium">
                              {selectedArticle.views > 0 ? 
                               ((selectedArticle.likes / selectedArticle.views) * 100).toFixed(1) : 0}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminNews;






