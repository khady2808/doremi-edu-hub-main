import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';
import { newsService, NewsItem } from '../lib/newsService';
import { CommentSection } from '../components/CommentSection';
import { 
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  User,
  Eye,
  Heart,
  Share2,
  MessageCircle,
  ThumbsUp,
  Bookmark,
  ExternalLink,
  Tag,
  Star,
  AlertCircle,
  Loader2
} from 'lucide-react';

export const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Charger l'actualité
  useEffect(() => {
    const loadNewsItem = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        console.log('📰 Chargement de l\'actualité:', id);
        
        const response = await newsService.getNewsById(parseInt(id));
        console.log('✅ Actualité chargée:', response);
        setNewsItem(response);
      } catch (err) {
        console.error('❌ Erreur lors du chargement:', err);
        setError('Impossible de charger l\'actualité');
        toast({
          title: "Erreur",
          description: "Impossible de charger l'actualité",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadNewsItem();
  }, [id, toast]);

  // Fonction utilitaire pour obtenir le nom de l'auteur
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

  // Gestion des actions
  const handleLike = async () => {
    if (!newsItem) return;
    
    try {
      await newsService.likeNews(newsItem.id);
      setIsLiked(!isLiked);
      toast({
        title: "Succès",
        description: isLiked ? "Like retiré" : "Article liké"
      });
    } catch (error) {
      console.error('Erreur lors du like:', error);
      toast({
        title: "Erreur",
        description: "Impossible de liker l'article",
        variant: "destructive"
      });
    }
  };

  const handleShare = async () => {
    if (!newsItem) return;
    
    try {
      await newsService.shareNews(newsItem.id);
      
      // Partager via l'API Web Share si disponible
      if (navigator.share) {
        await navigator.share({
          title: newsItem.title,
          text: newsItem.excerpt || newsItem.content?.substring(0, 200),
          url: window.location.href
        });
      } else {
        // Fallback : copier l'URL dans le presse-papiers
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Succès",
          description: "Lien copié dans le presse-papiers"
        });
      }
    } catch (error) {
      console.error('Erreur lors du partage:', error);
      toast({
        title: "Erreur",
        description: "Impossible de partager l'article",
        variant: "destructive"
      });
    }
  };

  const handleComment = async () => {
    if (!newsItem) return;
    
    try {
      await newsService.commentNews(newsItem.id);
      toast({
        title: "Succès",
        description: "Commentaire ajouté"
      });
    } catch (error) {
      console.error('Erreur lors du commentaire:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter un commentaire",
        variant: "destructive"
      });
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: "Succès",
      description: isBookmarked ? "Signet retiré" : "Article ajouté aux signets"
    });
  };

  // Formatage des dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'À l\'instant';
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} h`;
    if (diffInSeconds < 2592000) return `Il y a ${Math.floor(diffInSeconds / 86400)} j`;
    return formatDate(dateString);
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
  if (error || !newsItem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Actualité non trouvée</h2>
          <p className="text-gray-600 mb-4">{error || 'Cette actualité n\'existe pas ou a été supprimée'}</p>
          <Button onClick={() => navigate('/actualites')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux actualités
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header avec navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/actualites')}
              className="hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`${isLiked ? 'text-red-600' : 'text-gray-400'} hover:text-red-600 hover:bg-red-50`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={`${isBookmarked ? 'text-blue-600' : 'text-gray-400'} hover:text-blue-600 hover:bg-blue-50`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleComment}
                className="hover:bg-green-50 hover:border-green-300 hover:text-green-600"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Commenter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Partager
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Image principale */}
          <div className="relative">
            <img
              src={newsItem.image_url || newsItem.featured_image_url || 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=400&fit=crop'}
              alt={newsItem.title}
              className="w-full h-96 object-cover"
            />
            <div className="absolute top-6 left-6 flex gap-2">
              {newsItem.is_urgent && (
                <Badge className="bg-red-500 text-white text-sm">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Urgent
                </Badge>
              )}
              {newsItem.is_featured && (
                <Badge className="bg-yellow-500 text-white text-sm">
                  <Star className="w-3 h-3 mr-1" />
                  En vedette
                </Badge>
              )}
              <Badge className={`text-sm ${
                newsItem.priority === 'high' ? 'bg-red-500 text-white' :
                newsItem.priority === 'medium' ? 'bg-yellow-500 text-white' :
                'bg-green-500 text-white'
              }`}>
                {newsItem.category || 'Actualité'}
              </Badge>
            </div>
          </div>

          {/* Contenu de l'article */}
          <div className="p-8">
            {/* Métadonnées */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(newsItem.created_at)}
              </div>
              {newsItem.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {newsItem.location}
                </div>
              )}
              {newsItem.read_time && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {newsItem.read_time}
                </div>
              )}
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {newsItem.views_count.toLocaleString()} vues
              </div>
            </div>

            {/* Titre */}
            <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {newsItem.title}
            </h1>

            {/* Extrait */}
            {newsItem.excerpt && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {newsItem.excerpt}
                </p>
              </div>
            )}

            {/* Contenu principal */}
            <div className="prose prose-lg max-w-none mb-8">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {newsItem.content}
              </div>
            </div>

            {/* Tags */}
            {newsItem.tags && newsItem.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {newsItem.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Informations sur l'auteur */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {getAuthorInitials(newsItem.author)}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {getAuthorName(newsItem.author)}
                  </h3>
                  <p className="text-gray-600">Auteur DOREMI</p>
                </div>
              </div>
            </div>

            {/* Statistiques d'engagement */}
            <div className="border-t border-gray-200 pt-8 mt-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <ThumbsUp className="w-5 h-5" />
                    <span className="font-medium">{newsItem.likes_count.toLocaleString()}</span>
                    <span className="text-sm">likes</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-medium">{newsItem.comments_count.toLocaleString()}</span>
                    <span className="text-sm">commentaires</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Share2 className="w-5 h-5" />
                    <span className="font-medium">{newsItem.shares_count.toLocaleString()}</span>
                    <span className="text-sm">partages</span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  Mis à jour le {formatDate(newsItem.updated_at)}
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Section des commentaires */}
        <div className="mt-12">
          <CommentSection 
            newsId={newsItem.id} 
            initialCommentsCount={newsItem.comments_count}
          />
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
