import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from '../hooks/use-toast';
import { 
  MessageCircle, 
  Send, 
  ThumbsUp, 
  User, 
  Calendar,
  Heart,
  Loader2
} from 'lucide-react';

interface Comment {
  id: number;
  author_name: string;
  author_email?: string;
  content: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
}

interface CommentSectionProps {
  newsId: number;
  initialCommentsCount?: number;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ 
  newsId, 
  initialCommentsCount = 0 
}) => {
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());
  
  // État du formulaire
  const [formData, setFormData] = useState({
    author_name: '',
    author_email: '',
    content: ''
  });

  // Charger les commentaires
  useEffect(() => {
    loadComments();
  }, [newsId]);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/news/${newsId}/comments`);
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des commentaires');
      }
      
      const data = await response.json();
      setComments(data.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les commentaires",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.author_name.trim() || !formData.content.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/news/${newsId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'ajout du commentaire');
      }

      const data = await response.json();
      
      // Ajouter le nouveau commentaire à la liste
      setComments(prev => [data.data, ...prev]);
      
      // Réinitialiser le formulaire
      setFormData({
        author_name: '',
        author_email: '',
        content: ''
      });
      
      setShowCommentForm(false);
      
      toast({
        title: "Succès",
        description: "Commentaire ajouté avec succès"
      });
      
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible d'ajouter le commentaire",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (commentId: number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/comments/${commentId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors du like');
      }

      const data = await response.json();
      
      // Mettre à jour le commentaire dans la liste
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes_count: data.likes_count }
          : comment
      ));
      
      // Ajouter/retirer du set des commentaires likés
      setLikedComments(prev => {
        const newSet = new Set(prev);
        if (newSet.has(commentId)) {
          newSet.delete(commentId);
        } else {
          newSet.add(commentId);
        }
        return newSet;
      });
      
    } catch (error) {
      console.error('Erreur lors du like:', error);
      toast({
        title: "Erreur",
        description: "Impossible de liker le commentaire",
        variant: "destructive"
      });
    }
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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">
            Commentaires ({comments.length})
          </h3>
        </div>
        <Button
          onClick={() => setShowCommentForm(!showCommentForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          {showCommentForm ? 'Annuler' : 'Ajouter un commentaire'}
        </Button>
      </div>

      {/* Formulaire d'ajout de commentaire */}
      {showCommentForm && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg text-blue-900">Ajouter un commentaire</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom * <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={formData.author_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, author_name: e.target.value }))}
                    placeholder="Votre nom"
                    required
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email (optionnel)
                  </label>
                  <Input
                    type="email"
                    value={formData.author_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, author_email: e.target.value }))}
                    placeholder="votre@email.com"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commentaire * <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Partagez votre avis..."
                  required
                  rows={4}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCommentForm(false)}
                  disabled={isSubmitting}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Publication...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Publier
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Liste des commentaires */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Chargement des commentaires...</span>
          </div>
        ) : comments.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent>
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Aucun commentaire</h4>
              <p className="text-gray-600">Soyez le premier à commenter cette actualité !</p>
            </CardContent>
          </Card>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">
                      {getInitials(comment.author_name)}
                    </span>
                  </div>
                  
                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{comment.author_name}</h4>
                      <span className="text-gray-400">•</span>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {formatDate(comment.created_at)}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 leading-relaxed mb-3">
                      {comment.content}
                    </p>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(comment.id)}
                        className={`flex items-center gap-1 text-sm transition-colors ${
                          likedComments.has(comment.id) 
                            ? 'text-red-600' 
                            : 'text-gray-500 hover:text-red-600'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${likedComments.has(comment.id) ? 'fill-current' : ''}`} />
                        {comment.likes_count} {comment.likes_count === 1 ? 'like' : 'likes'}
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
