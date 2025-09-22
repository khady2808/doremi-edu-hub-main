import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { newsService } from '@/lib/newsService';
import { 
  ArrowLeft,
  Save,
  Eye,
  Upload,
  X,
  AlertCircle,
  Star,
  Tag,
  FileText,
  Image as ImageIcon
} from 'lucide-react';

export const AdminNewsAdd: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Formulaire
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    priority: 'medium' as const,
    tags: '',
    imageFile: null as File | null,
    isUrgent: false,
    isFeatured: false
  });

  // Gestion de l'upload d'image
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Erreur",
          description: "Veuillez sélectionner un fichier image valide",
          variant: "destructive"
        });
        return;
      }
      
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erreur",
          description: "L'image ne doit pas dépasser 5MB",
          variant: "destructive"
        });
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        imageFile: file
      }));
      
      toast({
        title: "Succès",
        description: "Image sélectionnée avec succès"
      });
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      imageFile: null
    }));
  };

  // Gestion du formulaire
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre et le contenu sont obligatoires",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const newsData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        category: formData.category,
        status: 'draft' as const,
        priority: formData.priority,
        type: 'news' as const,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        is_urgent: formData.isUrgent,
        is_featured: formData.isFeatured
      };

      const createdNews = await newsService.createNews(newsData, formData.imageFile || undefined);
      
      toast({
        title: "Succès",
        description: "Actualité créée avec succès"
      });
      
      // Rediriger vers la page de détail
      navigate(`/admin/news/detail/${createdNews.id}`);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'actualité",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Prévisualisation
  const handlePreview = () => {
    // Pour l'instant, on peut rediriger vers une page de prévisualisation
    // ou ouvrir une modale de prévisualisation
    toast({
      title: "Prévisualisation",
      description: "Fonctionnalité de prévisualisation à implémenter"
    });
  };

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
                <h1 className="text-3xl font-bold text-gray-900">Nouvelle Actualité</h1>
                <p className="text-gray-600 mt-1">Créer une nouvelle actualité</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handlePreview}
                disabled={!formData.title || !formData.content}
              >
                <Eye className="w-4 h-4 mr-2" />
                Prévisualiser
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Informations de base
              </CardTitle>
              <CardDescription>
                Renseignez les informations principales de l'actualité
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Titre *</label>
                <Input
                  placeholder="Titre de l'actualité"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Extrait</label>
                <Textarea
                  placeholder="Résumé court de l'actualité"
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Contenu *</label>
                <Textarea
                  placeholder="Contenu complet de l'actualité"
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  className="mt-1"
                  rows={8}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Catégorisation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Catégorisation
              </CardTitle>
              <CardDescription>
                Définissez la catégorie et les tags de l'actualité
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Catégorie</label>
                <Input
                  placeholder="Ex: Éducation, Technologie, Actualités"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Tags</label>
                <Input
                  placeholder="tags, séparés, par, des, virgules"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Séparez les tags par des virgules
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Priorité</label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: any) => handleInputChange('priority', value)}
                >
                  <SelectTrigger className="mt-1">
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
            </CardContent>
          </Card>

          {/* Image */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Image
              </CardTitle>
              <CardDescription>
                Ajoutez une image à votre actualité (optionnel)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <label className="text-sm font-medium">Image</label>
                <div className="mt-1">
                  {!formData.imageFile ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Cliquez pour sélectionner une image
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Choisir un fichier
                      </label>
                      <p className="text-xs text-gray-500 mt-2">
                        Formats acceptés: JPEG, PNG, JPG, GIF, WebP (max 5MB)
                      </p>
                    </div>
                  ) : (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{formData.imageFile.name}</p>
                            <p className="text-xs text-gray-500">
                              {(formData.imageFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeImage}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Options
              </CardTitle>
              <CardDescription>
                Configurez les options spéciales de l'actualité
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="isFeatured" className="text-sm font-medium">
                    Mettre en vedette
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isUrgent"
                    checked={formData.isUrgent}
                    onChange={(e) => handleInputChange('isUrgent', e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="isUrgent" className="text-sm font-medium">
                    Marquer comme urgent
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/news')}
            >
              Annuler
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                type="submit"
                disabled={isLoading || !formData.title || !formData.content}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Création...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Créer l'actualité
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
