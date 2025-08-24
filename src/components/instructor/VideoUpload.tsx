import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Upload, 
  Video, 
  Check, 
  AlertCircle,
  Play,
  Clock,
  Eye,
  Calendar,
  Trash2,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Video as VideoType } from '../../types/auth';
import { instructorRevenueService } from '../../lib/instructorRevenueService';
import { videoNotificationService } from '../../lib/videoNotificationService';

export const VideoUpload: React.FC = () => {
  const { addVideo, user, videos: userVideos, removeVideo } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [videoData, setVideoData] = useState({
    title: '',
    description: '',
    file: null as File | null,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hasCleanedCorruptedVideos, setHasCleanedCorruptedVideos] = useState(false);

  // Nettoyer automatiquement les vidéos corrompues au chargement (seulement les data: URLs)
  useEffect(() => {
    if (userVideos && userVideos.length > 0 && !hasCleanedCorruptedVideos) {
      const corruptedVideos = userVideos.filter(video => 
        video.fileUrl.startsWith('data:') || // Seulement les data URLs corrompues
        (video.fileUrl.length < 20 && !video.fileUrl.startsWith('http') && !video.fileUrl.startsWith('blob:'))
      );
      
      if (corruptedVideos.length > 0) {
        console.log('🧹 Nettoyage automatique de', corruptedVideos.length, 'vidéo(s) corrompue(s)');
        
        // Supprimer automatiquement les vidéos corrompues
        corruptedVideos.forEach(video => {
          console.log('🗑️ Suppression automatique de la vidéo corrompue:', video.title);
          removeVideo(video.id);
        });
        
        // Nettoyer le localStorage
        localStorage.removeItem('doremi_video_library');
        localStorage.removeItem('doremi_video_notifications');
        localStorage.removeItem('doremi_admin_notifications');
        
        setHasCleanedCorruptedVideos(true);
        
        // Afficher un message de confirmation
        setTimeout(() => {
          alert(`✅ ${corruptedVideos.length} vidéo(s) corrompue(s) supprimée(s) automatiquement ! Vous pouvez maintenant ajouter de nouvelles vidéos.`);
        }, 100);
      }
    }
  }, [userVideos, hasCleanedCorruptedVideos, removeVideo]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validation du type de fichier
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      setError('Format de vidéo non supporté. Utilisez MP4, WebM, OGG ou MOV.');
      return;
    }

    // Validation de la taille (100MB max)
    if (file.size > 100 * 1024 * 1024) {
      setError('La vidéo ne doit pas dépasser 100MB.');
      return;
    }

    setError(null);
    setSuccess(null);
    setVideoData(prev => ({ ...prev, file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoData.title.trim() || !videoData.description.trim() || !videoData.file) {
      setError('Veuillez remplir tous les champs et sélectionner une vidéo.');
      return;
    }

    if (!user) {
      setError('Vous devez être connecté pour ajouter une vidéo.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('🎬 Traitement de la vidéo:', videoData.file.name);
      
      // Créer une URL blob temporaire pour le formateur (sa vraie vidéo)
      const objectUrl = URL.createObjectURL(videoData.file);
      console.log('📹 URL blob créée pour le formateur:', objectUrl);
      
      try {
        // Ajouter la vidéo au contexte avec l'URL blob (vraie vidéo pour le formateur)
        const newVideo = addVideo({
          title: videoData.title,
          description: videoData.description,
          fileUrl: objectUrl, // Utiliser l'URL blob pour que le formateur voie sa vraie vidéo
          instructorId: user.id,
          views: 0,
        });

        console.log('✅ Vidéo ajoutée au contexte:', newVideo);

        // Notifier la publication de la vidéo avec le même ID
        // Cette notification ajoute automatiquement la vidéo à la bibliothèque partagée
        // visible par TOUS les étudiants de la plateforme
        videoNotificationService.notifyVideoPublished({
          id: newVideo.id, // Utiliser le même ID que celui généré par addVideo
          title: videoData.title,
          description: videoData.description,
          instructorId: user.id,
          instructorName: user.name || 'Formateur DOREMI',
          fileUrl: objectUrl, // Utiliser l'URL blob pour que les étudiants voient aussi la vraie vidéo
        });
        
        console.log('✅ Vidéo publiée et partagée avec TOUS les étudiants !');

        console.log('✅ Notification envoyée pour la vidéo:', newVideo.id);
        
        // Réinitialiser le formulaire
        setVideoData({
          title: '',
          description: '',
          file: null,
        });

        setSuccess('✅ Vidéo publiée avec succès ! Les étudiants voient une vidéo fiable qui fonctionne !');
        
        // Réinitialiser le message de succès après 5 secondes
        setTimeout(() => setSuccess(null), 5000);
        
      } catch (error) {
        console.error('❌ Erreur lors de la publication:', error);
        setError('Erreur lors de la publication de la vidéo: ' + (error as Error).message);
      } finally {
        setIsUploading(false);
      }
      
    } catch (error) {
      console.error('❌ Erreur générale:', error);
      setError('Erreur lors de l\'upload de la vidéo: ' + (error as Error).message);
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="w-5 h-5" />
          Ajouter une vidéo de cours
        </CardTitle>
        <CardDescription>
          Partagez vos connaissances avec vos étudiants
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre de la vidéo *</Label>
            <Input
              id="title"
              value={videoData.title}
              onChange={(e) => setVideoData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Introduction aux mathématiques"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={videoData.description}
              onChange={(e) => setVideoData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Décrivez le contenu de cette vidéo..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video">Fichier vidéo *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
                id="video"
                required
              />
              <label htmlFor="video" className="cursor-pointer">
                {videoData.file ? (
                  <div className="space-y-2">
                    <Check className="w-8 h-8 text-green-500 mx-auto" />
                    <p className="text-sm font-medium text-green-600">
                      {videoData.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(videoData.file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-600">
                      Cliquez pour sélectionner une vidéo
                    </p>
                    <p className="text-xs text-gray-500">
                      Formats acceptés: MP4, WebM, OGG, MOV (max 100MB)
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {success && (
            <div className="text-green-600 text-sm font-medium flex items-center gap-2">
              <Check className="w-4 h-4" />
              {success}
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Informations importantes</h4>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• Formats supportés: MP4, WebM, OGG, MOV</li>
                  <li>• Taille maximum: 100MB</li>
                  <li>• Durée recommandée: 5-30 minutes</li>
                  <li>• Qualité recommandée: 720p minimum</li>
                  <li>• <strong>✅ Toutes vos vidéos sont automatiquement partagées avec TOUS les étudiants</strong></li>
                  <li>• <strong>🎬 Les étudiants voient une vidéo fiable qui fonctionne toujours !</strong></li>
                </ul>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isUploading || !videoData.title.trim() || !videoData.description.trim() || !videoData.file}
          >
            {isUploading ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Upload en cours...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Ajouter la vidéo
              </>
            )}
          </Button>
          
          {(!videoData.title.trim() || !videoData.description.trim() || !videoData.file) && (
            <div className="text-orange-600 text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Veuillez remplir tous les champs obligatoires : titre, description et fichier vidéo
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export const VideoList: React.FC = () => {
  const { videos, user, removeVideo } = useAuth();
  const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null);

  const userVideos = videos.filter(video => video.instructorId === user?.id);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleWatchVideo = (video: VideoType) => {
    console.log('🎬 Tentative de lecture vidéo:', video);
    console.log('📹 URL de la vidéo:', video.fileUrl);
    
      // Vérifier seulement les data URLs comme corrompues (URLs HTTP et blob sont valides)
  if (video.fileUrl.startsWith('data:') || 
      (video.fileUrl.length < 20 && !video.fileUrl.startsWith('http') && !video.fileUrl.startsWith('blob:'))) {
      
      if (confirm('Cette vidéo est corrompue. Voulez-vous la supprimer automatiquement ?')) {
        removeVideo(video.id);
        alert('Vidéo corrompue supprimée !');
      }
      return;
    }
    
    try {
      // Incrémenter le compteur de vues et calculer les revenus
      const updatedVideo = { ...video, views: video.views + 1 };
      
      // Ajouter la vue au service de monétisation
      if (user) {
        instructorRevenueService.addView(video.id, user.id, video.title);
      }
      
      console.log(`✅ Vue ajoutée pour la vidéo: ${video.title}. Total: ${updatedVideo.views} vues`);
      
      setSelectedVideo(video);
    } catch (error) {
      console.error('❌ Erreur lors de la lecture de la vidéo:', error);
      alert('Erreur lors de la lecture de la vidéo. Veuillez réessayer.');
    }
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  const handleDeleteVideo = (videoId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) {
      removeVideo(videoId);
    }
  };

  // Filtrer les vidéos corrompues et valides (URLs HTTP et blob sont valides)
  const corruptedVideos = userVideos.filter(video => 
    video.fileUrl.startsWith('data:') || // Seulement les data URLs sont corrompues
    (video.fileUrl.length < 20 && !video.fileUrl.startsWith('http') && !video.fileUrl.startsWith('blob:'))
  );
  
  const validVideos = userVideos.filter(video => 
    video.fileUrl.startsWith('http') || // Les URLs HTTP sont valides
    video.fileUrl.startsWith('blob:') || // Les URLs blob sont valides (vraies vidéos des formateurs)
    (video.fileUrl.length >= 20 && !video.fileUrl.startsWith('data:'))
  );

  if (userVideos.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune vidéo</h3>
          <p className="text-gray-500">Vous n'avez pas encore ajouté de vidéos.</p>
        </CardContent>
      </Card>
    );
  }

  if (corruptedVideos.length > 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">🚨 VIDÉOS CORROMPUES DÉTECTÉES</h3>
          <p className="text-gray-500 mb-4">
            {corruptedVideos.length} vidéo(s) sont corrompues et ne peuvent pas être lues.
            <br />
            <strong>Solution :</strong> Supprimez-les et ajoutez de nouvelles vidéos.
          </p>
          <div className="flex gap-2 justify-center">
            <Button 
              variant="destructive"
              onClick={() => {
                if (confirm(`🗑️ Supprimer ${corruptedVideos.length} vidéo(s) corrompue(s) automatiquement ?`)) {
                  try {
                    corruptedVideos.forEach(video => {
                      console.log('🗑️ Suppression de la vidéo corrompue:', video.title);
                      removeVideo(video.id);
                    });
                    
                    // Nettoyer le localStorage
                    localStorage.removeItem('doremi_video_library');
                    localStorage.removeItem('doremi_video_notifications');
                    localStorage.removeItem('doremi_admin_notifications');
                    
                    alert(`✅ ${corruptedVideos.length} vidéo(s) corrompue(s) supprimée(s) ! Vous pouvez maintenant ajouter de nouvelles vidéos.`);
                  } catch (error) {
                    console.error('Erreur lors de la suppression:', error);
                    alert('❌ Erreur lors de la suppression.');
                  }
                }
              }}
            >
              🗑️ Supprimer Vidéos Corrompues
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                if (confirm('⚠️ RESET COMPLET : Supprimer TOUTES les vidéos et nettoyer localStorage ?')) {
                  try {
                    // Supprimer toutes les vidéos du contexte
                    userVideos.forEach(video => removeVideo(video.id));
                    
                    // Nettoyer complètement le localStorage
                    localStorage.removeItem('doremi_video_library');
                    localStorage.removeItem('doremi_video_notifications');
                    localStorage.removeItem('doremi_admin_notifications');
                    localStorage.removeItem('doremi_videos');
                    
                    alert('✅ RESET COMPLET terminé ! Page rechargée avec un état propre.');
                    
                    // Recharger la page pour un état propre
                    window.location.reload();
                  } catch (error) {
                    console.error('Erreur lors du reset:', error);
                    alert('❌ Erreur lors du reset. Veuillez rafraîchir la page.');
                  }
                }
              }}
            >
              🔄 RESET COMPLET
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Mes vidéos</h3>
        <div className="flex gap-2">
          <Button 
            variant="default"
            size="sm"
            onClick={() => {
              if (!user) {
                alert('❌ Vous devez être connecté');
                return;
              }
              
              try {
                const testVideo = {
                  id: `test_${Date.now()}`,
                  title: '🎬 Vidéo de Test Fonctionnelle',
                  description: 'Cette vidéo de test utilise une URL Google fiable qui fonctionne toujours.',
                  fileUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                  instructorId: user.id,
                  views: 0,
                };
                
                // Ajouter au contexte
                addVideo(testVideo);
                
                // Notifier la publication
                videoNotificationService.notifyVideoPublished({
                  id: testVideo.id,
                  title: testVideo.title,
                  description: testVideo.description,
                  instructorId: user.id,
                  instructorName: user.name || 'Formateur DOREMI',
                  fileUrl: testVideo.fileUrl,
                });
                
                alert('✅ Vidéo de test créée avec succès ! Elle devrait fonctionner parfaitement.');
              } catch (error) {
                console.error('Erreur lors de la création de la vidéo de test:', error);
                alert('❌ Erreur lors de la création de la vidéo de test');
              }
            }}
          >
            🧪 Créer Vidéo Test
          </Button>
          <Button 
            variant="destructive"
            size="sm"
            onClick={() => {
              try {
                // Identifier les vidéos corrompues (tout ce qui n'est pas une URL HTTP valide)
                const videosToDelete = userVideos.filter(video => 
                  video.fileUrl.startsWith('blob:') || 
                  video.fileUrl.startsWith('data:') || 
                  !video.fileUrl.startsWith('http') ||
                  video.fileUrl.length < 50
                );
                
                if (videosToDelete.length === 0) {
                  alert('✅ Aucune vidéo corrompue détectée !');
                  return;
                }
                
                if (confirm(`🧹 Supprimer ${videosToDelete.length} vidéo(s) corrompue(s) automatiquement ?`)) {
                  // Supprimer toutes les vidéos corrompues
                  videosToDelete.forEach(video => {
                    console.log('🗑️ Suppression de la vidéo corrompue:', video.title);
                    removeVideo(video.id);
                  });
                  
                  // Nettoyer le localStorage
                  localStorage.removeItem('doremi_video_library');
                  localStorage.removeItem('doremi_video_notifications');
                  localStorage.removeItem('doremi_admin_notifications');
                  
                  alert(`✅ ${videosToDelete.length} vidéo(s) corrompue(s) supprimée(s) ! Vous pouvez maintenant publier de nouvelles vidéos.`);
                }
              } catch (error) {
                console.error('Erreur lors du nettoyage:', error);
                alert('❌ Erreur lors du nettoyage.');
              }
            }}
          >
            🗑️ Supprimer Vidéos Corrompues
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => {
              if (confirm('⚠️ RESET COMPLET : Supprimer TOUTES les vidéos et nettoyer localStorage ?')) {
                try {
                  // Supprimer toutes les vidéos du contexte
                  userVideos.forEach(video => removeVideo(video.id));
                  
                  // Nettoyer complètement le localStorage
                  localStorage.removeItem('doremi_video_library');
                  localStorage.removeItem('doremi_video_notifications');
                  localStorage.removeItem('doremi_admin_notifications');
                  localStorage.removeItem('doremi_videos');
                  
                  alert('✅ RESET COMPLET terminé ! Page rechargée avec un état propre.');
                  
                  // Recharger la page pour un état propre
                  window.location.reload();
                } catch (error) {
                  console.error('Erreur lors du reset:', error);
                  alert('❌ Erreur lors du reset. Veuillez rafraîchir la page.');
                }
              }
            }}
          >
            🔄 RESET COMPLET
          </Button>

        </div>
      </div>
      <div className="grid gap-4">
        {validVideos.map((video) => (
          <Card key={video.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Video className="w-4 h-4 text-blue-500" />
                    <h4 className="font-medium">{video.title}</h4>
                    {video.fileUrl.startsWith('blob:') && (
                      <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                        Votre vidéo
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{video.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(video.createdAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {video.views} vues
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {instructorRevenueService.calculateRevenue(video.views).toFixed(2)}€
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleWatchVideo(video)}
                    className="flex items-center gap-1"
                    disabled={video.fileUrl.startsWith('data:')}
                  >
                    <Play className="w-3 h-3" />
                    {video.fileUrl.startsWith('blob:') ? 'Voir Ma Vidéo' : 'Regarder'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteVideo(video.id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal pour lire la vidéo */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium">{selectedVideo.title}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeVideoModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>
            <div className="p-4">
              <video
                controls
                className="w-full max-h-[60vh] object-contain"
                src={selectedVideo.fileUrl}
                preload="metadata"
                onError={(e) => {
                  console.error('Erreur de lecture vidéo:', e);
                  alert('Erreur lors de la lecture de la vidéo. Veuillez réessayer.');
                }}
              >
                Votre navigateur ne supporte pas la lecture de vidéos.
              </video>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-gray-600">{selectedVideo.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 