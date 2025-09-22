import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { newsService, NewsItem } from '@/lib/newsService';
import { 
  ArrowLeft,
  Edit,
  Trash2,
  Star,
  AlertCircle,
  Eye,
  Heart,
  Share2,
  MessageSquare,
  Calendar,
  User,
  Tag,
  Globe,
  Download,
  Print,
  Bookmark,
  MoreHorizontal
} from 'lucide-react';

export const AdminNewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger l'actualité
  useEffect(() => {
    const loadArticle = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        console.log('📰 Chargement de l\'actualité:', id);
        
        const response = await newsService.getNewsById(parseInt(id));
        console.log('✅ Actualité chargée:', response);
        setArticle(response);
      } catch (err) {
        console.error('❌ Erreur lors du chargement:', err);
        setError('Erreur lors du chargement de l\'actualité');
        toast({
          title: "Erreur",
          description: "Impossible de charger l'actualité",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadArticle();
  }, [id, toast]);

  // Fonctions d'action
  const handleDelete = async () => {
    if (!article || !confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) return;
    
    try {
      await newsService.deleteNews(article.id);
      toast({
        title: "Succès",
        description: "Actualité supprimée avec succès"
      });
      navigate('/admin/news');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'actualité",
        variant: "destructive"
      });
    }
  };

  const handleToggleFeatured = async () => {
    if (!article) return;
    
    try {
      await newsService.toggleFeatured(article.id);
      toast({
        title: "Succès",
        description: "Statut 'en vedette' modifié"
      });
      // Recharger l'actualité
      const response = await newsService.getNewsById(article.id);
      setArticle(response);
    } catch (error) {
      console.error('Erreur lors du basculement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut",
        variant: "destructive"
      });
    }
  };

  const handleToggleUrgent = async () => {
    if (!article) return;
    
    try {
      await newsService.toggleUrgent(article.id);
      toast({
        title: "Succès",
        description: "Statut 'urgent' modifié"
      });
      // Recharger l'actualité
      const response = await newsService.getNewsById(article.id);
      setArticle(response);
    } catch (error) {
      console.error('Erreur lors du basculement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut",
        variant: "destructive"
      });
    }
  };

  const handlePublish = async () => {
    if (!article) return;
    
    try {
      await newsService.publishNews(article.id);
      toast({
        title: "Succès",
        description: "Actualité publiée"
      });
      // Recharger l'actualité
      const response = await newsService.getNewsById(article.id);
      setArticle(response);
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
      toast({
        title: "Erreur",
        description: "Impossible de publier l'actualité",
        variant: "destructive"
      });
    }
  };

  const handleArchive = async () => {
    if (!article) return;
    
    try {
      await newsService.archiveNews(article.id);
      toast({
        title: "Succès",
        description: "Actualité archivée"
      });
      // Recharger l'actualité
      const response = await newsService.getNewsById(article.id);
      setArticle(response);
    } catch (error) {
      console.error('Erreur lors de l\'archivage:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'archiver l'actualité",
        variant: "destructive"
      });
    }
  };

  // Fonctions utilitaires
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
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

  // Affichage de l'état de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l'actualité...</p>
        </div>
      </div>
    );
  }

  // Affichage de l'erreur
  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Actualité non trouvée</h2>
          <p className="text-gray-600 mb-4">{error || 'Cette actualité n\'existe pas ou a été supprimée'}</p>
          <Button onClick={() => navigate('/admin/news')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux actualités
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin/news')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{article.title}</h1>
                <p className="text-gray-600 mt-1">Détail de l'actualité</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => navigate(`/admin/news/edit/${article.id}`)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </Button>
              <Button
                variant="outline"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            {(article.image_url || article.image) && (
              <Card>
                <div className="relative">
                  <img
                    src={article.image_url || article.image}
                    alt={article.title}
                    className="w-full h-64 md:h-96 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {article.is_urgent && (
                      <Badge className="bg-red-500 text-white">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Urgent
                      </Badge>
                    )}
                    {article.is_featured && (
                      <Badge className="bg-yellow-500 text-white">
                        <Star className="w-3 h-3 mr-1" />
                        En vedette
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Contenu */}
            <Card>
              <CardHeader>
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
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleToggleFeatured}
                      className={article.is_featured ? "text-yellow-600" : "text-gray-400"}
                    >
                      <Star className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleToggleUrgent}
                      className={article.is_urgent ? "text-red-600" : "text-gray-400"}
                    >
                      <AlertCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {article.content}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Auteur</label>
                  <div className="flex items-center gap-2 mt-1">
                    <img
                      src={typeof article.author === 'object' ? article.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${article.author?.name || 'user'}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${article.author || 'user'}`}
                      alt={typeof article.author === 'object' ? article.author?.name || 'Auteur' : article.author || 'Auteur'}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{typeof article.author === 'object' ? article.author?.name || 'Auteur inconnu' : article.author || 'Auteur inconnu'}</p>
                      <p className="text-sm text-gray-600">{typeof article.author === 'object' ? article.author?.email || 'Email non disponible' : 'Email non disponible'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Catégorie</label>
                  <p className="mt-1">{article.category || 'Non définie'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Type</label>
                  <p className="mt-1 capitalize">{article.type}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Créé le</label>
                  <p className="mt-1">{formatDate(article.created_at)}</p>
                </div>

                {article.published_at && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Publié le</label>
                    <p className="mt-1">{formatDate(article.published_at)}</p>
                  </div>
                )}

                {article.tags && article.tags.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tags</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {article.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Statistiques */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Statistiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">
                      {formatNumber(article.views_count || article.views || 0)}
                    </div>
                    <div className="text-sm text-gray-600">Vues</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {formatNumber(article.likes_count || article.likes || 0)}
                    </div>
                    <div className="text-sm text-gray-600">Likes</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">
                      {formatNumber(article.shares_count || article.shares || 0)}
                    </div>
                    <div className="text-sm text-gray-600">Partages</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-lg font-bold text-orange-600">
                      {formatNumber(article.comments_count || article.comments || 0)}
                    </div>
                    <div className="text-sm text-gray-600">Commentaires</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {article.status === 'draft' && (
                  <Button onClick={handlePublish} className="w-full">
                    <Globe className="w-4 h-4 mr-2" />
                    Publier
                  </Button>
                )}
                
                {article.status === 'published' && (
                  <Button onClick={handleArchive} variant="outline" className="w-full">
                    <Bookmark className="w-4 h-4 mr-2" />
                    Archiver
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={handleToggleFeatured}
                  className={`w-full ${article.is_featured ? 'text-yellow-600' : ''}`}
                >
                  <Star className="w-4 h-4 mr-2" />
                  {article.is_featured ? 'Retirer des vedettes' : 'Mettre en vedette'}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleToggleUrgent}
                  className={`w-full ${article.is_urgent ? 'text-red-600' : ''}`}
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {article.is_urgent ? 'Retirer urgent' : 'Marquer urgent'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
