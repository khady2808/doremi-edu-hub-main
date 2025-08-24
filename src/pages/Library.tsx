
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  FileText, 
  Download,
  Eye,
  Crown,
  Filter,
  Calendar,
  User,
  Tag,
  Book,
  Star,
  Plus,
  Video,
  Play,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { videoNotificationService, VideoLibraryItem } from '../lib/videoNotificationService';

interface Document {
  id: string;
  title: string;
  author: string;
  description: string;
  type: 'pdf' | 'doc' | 'ppt' | 'video' | 'audio' | 'book';
  category: string;
  genre: string;
  uploadDate: string;
  size: string;
  isPremium: boolean;
  downloadCount: number;
  tags: string[];
  imageUrl?: string;
  rating?: number;
  country?: string;
}

const senegalBooks: Document[] = [
  {
    id: 'book1',
    title: 'Une si longue lettre',
    author: 'Mariama Bâ',
    description: 'Roman épistolaire qui dénonce la condition féminine au Sénégal et plus largement en Afrique. Un chef-d\'œuvre de la littérature africaine.',
    type: 'book',
    category: 'Littérature Sénégalaise',
    genre: 'Roman',
    uploadDate: '2024-01-15',
    size: '2.1 MB',
    isPremium: false,
    downloadCount: 1250,
    tags: ['féminisme', 'société', 'afrique', 'classique'],
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop',
    rating: 4.8,
    country: 'Sénégal'
  },
  {
    id: 'book2',
    title: 'Sous l\'orage',
    author: 'Seydou Badian',
    description: 'Premier roman malien qui explore les conflits entre tradition et modernité à travers l\'histoire de Kany et Samou.',
    type: 'book',
    category: 'Littérature Africaine',
    genre: 'Roman',
    uploadDate: '2024-01-20',
    size: '1.8 MB',
    isPremium: false,
    downloadCount: 980,
    tags: ['tradition', 'modernité', 'amour', 'mali'],
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
    rating: 4.6,
    country: 'Mali'
  },
  {
    id: 'book3',
    title: 'L\'appel des arènes',
    author: 'Aminata Sow Fall',
    description: 'Roman qui met en scène les valeurs traditionnelles sénégalaises face à la modernité, centré sur la lutte traditionnelle.',
    type: 'book',
    category: 'Littérature Sénégalaise',
    genre: 'Roman',
    uploadDate: '2024-02-01',
    size: '2.3 MB',
    isPremium: true,
    downloadCount: 756,
    tags: ['tradition', 'sport', 'identité', 'culture'],
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
    rating: 4.7,
    country: 'Sénégal'
  },
  {
    id: 'book4',
    title: 'L\'aventure ambiguë',
    author: 'Cheikh Hamidou Kane',
    description: 'Roman philosophique sur le dilemme entre éducation occidentale et valeurs africaines traditionnelles.',
    type: 'book',
    category: 'Littérature Sénégalaise',
    genre: 'Roman philosophique',
    uploadDate: '2024-02-10',
    size: '1.9 MB',
    isPremium: false,
    downloadCount: 890,
    tags: ['philosophie', 'éducation', 'tradition', 'modernité'],
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
    rating: 4.9,
    country: 'Sénégal'
  },
  {
    id: 'book5',
    title: 'Les contes d\'Amadou Koumba',
    author: 'Birago Diop',
    description: 'Recueil de contes traditionnels sénégalais qui perpétuent la sagesse ancestrale et les valeurs culturelles.',
    type: 'book',
    category: 'Littérature Sénégalaise',
    genre: 'Contes',
    uploadDate: '2024-02-15',
    size: '1.5 MB',
    isPremium: false,
    downloadCount: 1200,
    tags: ['contes', 'tradition', 'sagesse', 'culture'],
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
    rating: 4.5,
    country: 'Sénégal'
  }
];

const allDocuments: Document[] = [
  ...senegalBooks,
  {
    id: 'doc1',
    title: 'Manuel de Mathématiques - Terminale',
    author: 'Ministère de l\'Éducation',
    description: 'Manuel officiel de mathématiques pour les élèves de terminale au Sénégal.',
    type: 'pdf',
    category: 'Éducation',
    genre: 'Manuel',
    uploadDate: '2024-01-10',
    size: '15.2 MB',
    isPremium: false,
    downloadCount: 2340,
    tags: ['mathématiques', 'éducation', 'lycée', 'officiel'],
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=600&fit=crop',
    rating: 4.3
  },
  {
    id: 'doc2',
    title: 'Histoire du Sénégal - De l\'Antiquité à nos jours',
    author: 'Dr. Mamadou Diouf',
    description: 'Ouvrage de référence sur l\'histoire complète du Sénégal, de ses origines à l\'époque contemporaine.',
    type: 'pdf',
    category: 'Histoire',
    genre: 'Essai',
    uploadDate: '2024-01-25',
    size: '8.7 MB',
    isPremium: true,
    downloadCount: 567,
    tags: ['histoire', 'sénégal', 'référence', 'académique'],
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
    rating: 4.7
  }
];

const CYCLE_TO_TAGS: Record<string, string[]> = {
  lyceen: ['Littérature Sénégalaise', 'Éducation'],
  licence: ['Éducation', 'Littérature Africaine'],
  master: ['Éducation', 'Essai'],
  doctorat: ['Éducation', 'Manuel']
};

export const Library: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [videos, setVideos] = useState<VideoLibraryItem[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoLibraryItem | null>(null);

  // Charger les vidéos depuis le service
  useEffect(() => {
    const loadVideos = () => {
      try {
        const videoLibrary = videoNotificationService.getVideoLibrary();
        console.log('📚 Vidéos chargées depuis la bibliothèque:', videoLibrary.length);
        
        // Trier par date de publication (plus récentes en premier)
        const sortedVideos = videoLibrary.sort((a, b) => 
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
        
        setVideos(sortedVideos);
      } catch (error) {
        console.error('Erreur lors du chargement des vidéos:', error);
        setVideos([]);
      }
    };

    // Charger immédiatement
    loadVideos();

    // Recharger toutes les 3 secondes pour les nouvelles vidéos des formateurs
    const interval = setInterval(loadVideos, 3000);

    return () => clearInterval(interval);
  }, []);

  // Mettre à jour l'URL quand la recherche change
  useEffect(() => {
    if (searchTerm) {
      setSearchParams({ search: searchTerm });
    } else {
      setSearchParams({});
    }
  }, [searchTerm, setSearchParams]);

  const categories = ['all', 'Littérature Sénégalaise', 'Littérature Africaine', 'Éducation', 'Histoire'];
  const genres = ['all', 'Roman', 'Roman philosophique', 'Roman social', 'Contes', 'Essai', 'Manuel'];

  const filteredDocuments = allDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesGenre = selectedGenre === 'all' || doc.genre === selectedGenre;

    // Si l'utilisateur est étudiant et a un cycle, filtrer par catégories/genres tags liés
    let matchesCycle = true;
    if (user?.role === 'student' && user.studentCycle) {
      const allowed = CYCLE_TO_TAGS[user.studentCycle] || [];
      matchesCycle =
        allowed.length === 0 ||
        allowed.includes(doc.category) ||
        allowed.some(tag => doc.tags.includes(tag));
    }
    return matchesSearch && matchesCategory && matchesGenre && matchesCycle;
  });

  const getFileIcon = (type: string) => {
    const iconClass = "w-8 h-8";
    switch (type) {
      case 'book': return <Book className={`${iconClass} text-amber-600`} />;
      case 'pdf': return <FileText className={`${iconClass} text-red-500`} />;
      case 'doc': return <FileText className={`${iconClass} text-blue-500`} />;
      case 'ppt': return <FileText className={`${iconClass} text-orange-500`} />;
      case 'video': return <FileText className={`${iconClass} text-purple-500`} />;
      case 'audio': return <FileText className={`${iconClass} text-green-500`} />;
      default: return <FileText className={`${iconClass} text-gray-500`} />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'book': return 'Livre';
      case 'pdf': return 'PDF';
      case 'doc': return 'Document';
      case 'ppt': return 'Présentation';
      case 'video': return 'Vidéo';
      case 'audio': return 'Audio';
      default: return type.toUpperCase();
    }
  };

  const canAccess = (document: Document) => {
    return !document.isPremium || user?.isPremium;
  };

  const handleDownload = (document: Document) => {
    if (!canAccess(document)) {
      alert('Ce document nécessite un abonnement Premium');
      return;
    }
    alert(`Téléchargement de "${document.title}" en cours...`);
  };

  const handlePreview = (document: Document) => {
    if (!canAccess(document)) {
      alert('Ce document nécessite un abonnement Premium');
      return;
    }
    alert(`Ouverture de la prévisualisation de "${document.title}"`);
  };

  const handleWatchVideo = (video: VideoLibraryItem) => {
    console.log('🎬 Tentative de lecture vidéo:', video);
    console.log('📹 URL de la vidéo:', video.fileUrl);
    
    // Vérifier si la vidéo a une URL valide
    if (!video.fileUrl || video.fileUrl.length < 10) {
      alert('Cette vidéo n\'a pas d\'URL valide. Veuillez contacter l\'administrateur.');
      return;
    }
    
    try {
      // Incrémenter les vues
      videoNotificationService.incrementViews(video.id);
      
      console.log(`✅ Vue ajoutée pour la vidéo: ${video.title}`);
      
      // Ouvrir la vidéo dans le modal
      setSelectedVideo(video);
    } catch (error) {
      console.error('❌ Erreur lors de la lecture de la vidéo:', error);
      alert('Erreur lors de la lecture de la vidéo. Veuillez réessayer.');
    }
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Médiathèque</h1>
        <p className="text-muted-foreground">
          Découvrez notre collection d'ouvrages sénégalais et africains, ainsi que nos ressources pédagogiques
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un livre, auteur ou thème..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes catégories</SelectItem>
                  {categories.slice(1).map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous genres</SelectItem>
                  {genres.slice(1).map(genre => (
                    <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Vidéos des Formateurs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Video className="w-6 h-6 text-blue-600" />
              Vidéos des Formateurs
            </h2>
            <p className="text-muted-foreground">
              🎬 Vidéos fiables publiées par les formateurs - toujours fonctionnelles !
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              {videos.length} vidéo{videos.length > 1 ? 's' : ''}
            </Badge>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => {
                // Créer une vidéo de test avec une URL de démonstration fiable
                const testVideo = {
                  id: `test_${Date.now()}`,
                  title: '🎬 Vidéo de démonstration',
                  description: 'Big Buck Bunny - Vidéo de test fonctionnelle',
                  instructorName: 'Formateur Test',
                  instructorId: 'test_instructor',
                  fileUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                  views: 0,
                  publishedAt: new Date().toISOString(),
                  duration: '10:34',
                  thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop'
                };
                
                // Ajouter à la bibliothèque
                const currentVideos = videoNotificationService.getVideoLibrary();
                const updatedVideos = [testVideo, ...currentVideos];
                localStorage.setItem('doremi_video_library', JSON.stringify(updatedVideos));
                setVideos(updatedVideos);
                
                alert('✅ Vidéo de démonstration ajoutée ! Cliquez maintenant sur "Regarder" pour tester.');
              }}
            >
              🧪 Ajouter Vidéo Test
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => {
                if (confirm('⚠️ Nettoyer toutes les anciennes données vidéo corrompues ?')) {
                  try {
                    // Nettoyer toutes les données vidéo
                    localStorage.removeItem('doremi_video_library');
                    localStorage.removeItem('doremi_video_notifications');
                    localStorage.removeItem('doremi_videos');
                    localStorage.removeItem('doremi_admin_notifications');
                    
                    // Recharger les vidéos (vide)
                    setVideos([]);
                    
                    console.log('🧹 Toutes les données vidéo nettoyées');
                    alert('✅ Données vidéo nettoyées ! Les nouvelles vidéos publiées par les formateurs fonctionneront parfaitement.');
                    
                  } catch (error) {
                    console.error('❌ Erreur lors du nettoyage:', error);
                    alert('❌ Erreur lors du nettoyage.');
                  }
                }
              }}
            >
              🧹 Réinitialiser
            </Button>
                      <Button 
            variant="default" 
            size="sm"
            onClick={() => {
              try {
                // Créer une vidéo de test avec une URL fiable
                const testVideo = {
                  id: `test_${Date.now()}`,
                  title: '✅ Test - Vidéo des Étudiants',
                  description: 'Cette vidéo montre ce que voient les étudiants quand un formateur publie.',
                  instructorName: 'Formateur DOREMI',
                  instructorId: 'test_instructor',
                  fileUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                  views: 0,
                  publishedAt: new Date().toISOString(),
                  duration: '10:53',
                  thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop'
                };
                
                // Ajouter à la bibliothèque
                const currentVideos = videoNotificationService.getVideoLibrary();
                const updatedVideos = [testVideo, ...currentVideos];
                localStorage.setItem('doremi_video_library', JSON.stringify(updatedVideos));
                setVideos(updatedVideos);
                
                alert('✅ Vidéo de test créée ! Ceci montre ce que voient les étudiants.');
              } catch (error) {
                console.error('Erreur lors de l\'ajout de la vidéo de test:', error);
                alert('❌ Erreur lors de l\'ajout de la vidéo de test');
              }
            }}
          >
            🎬 Test Étudiant
          </Button>
          </div>
        </div>
        
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <Card key={video.id} className="group hover:shadow-xl transition-all duration-300 hover:scale-105">
                {/* Thumbnail Section */}
                <div className="relative overflow-hidden">
                  <img 
                    src={video.thumbnail || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=200&fit=crop'} 
                    alt={video.title}
                    className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/90 rounded-full p-2">
                      <Play className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  
                  {/* Video Badge */}
                  <Badge className="absolute top-3 left-3 bg-blue-600 text-white shadow-lg">
                    <Video className="w-3 h-3 mr-1" />
                    Vidéo
                  </Badge>
                </div>
                
                {/* Content Section */}
                <div className="p-4 space-y-3">
                  {/* Title and Instructor */}
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Par {video.instructorName}
                    </p>
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>
                  
                  {/* Metadata */}
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(video.publishedAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{video.views} vue{video.views > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    {video.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{video.duration}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 h-8 text-xs group-hover:border-blue-300 group-hover:text-blue-600 transition-colors"
                      onClick={() => handleWatchVideo(video)}
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Regarder
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 h-8 text-xs bg-blue-600 hover:bg-blue-700 transition-colors"
                      onClick={() => {
                        videoNotificationService.incrementViews(video.id);
                        // Pour le téléchargement, on peut essayer de télécharger le fichier
                        if (video.fileUrl.startsWith('blob:')) {
                          alert('Téléchargement des vidéos blob en cours de développement');
                        } else {
                          window.open(video.fileUrl, '_blank');
                        }
                      }}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Télécharger
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucune vidéo disponible pour le moment</p>
            <p className="text-sm text-gray-500 mt-2">Les formateurs n'ont pas encore publié de vidéos</p>
          </div>
        )}
      </div>

      {/* Section Documents */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Book className="w-6 h-6 text-amber-600" />
              Documents et Livres
            </h2>
            <p className="text-muted-foreground">
              Collection d'ouvrages sénégalais et africains
            </p>
          </div>
        </div>

        {/* Results count */}
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            {filteredDocuments.length} document{filteredDocuments.length > 1 ? 's' : ''} trouvé{filteredDocuments.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDocuments.map((document) => (
            <Card key={document.id} className={`group hover:shadow-xl transition-all duration-300 hover:scale-105 ${!canAccess(document) ? 'opacity-75' : ''}`}>
              {/* Image Section */}
              <div className="relative overflow-hidden">
                <img 
                  src={document.imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop'} 
                  alt={document.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                
                {/* Badges Overlay */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  <Badge variant={document.type === 'book' ? 'default' : 'secondary'} className="shadow-lg">
                    {getTypeLabel(document.type)}
                  </Badge>
                  {document.country && (
                    <Badge variant="outline" className="bg-white/95 shadow-lg">
                      {document.country}
                    </Badge>
                  )}
                </div>
                
                {/* Premium Badge */}
                {document.isPremium && (
                  <Badge className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
              
              {/* Content Section */}
              <div className="p-4 space-y-3">
                {/* Title and Author */}
                <div className="space-y-1">
                  <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {document.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium">
                    Par {document.author}
                  </p>
                  {document.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-semibold">{document.rating}</span>
                    </div>
                  )}
                </div>
                
                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {document.description}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {document.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs px-2 py-1">
                      {tag}
                    </Badge>
                  ))}
                  {document.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs px-2 py-1">
                      +{document.tags.length - 2}
                    </Badge>
                  )}
                </div>
                
                {/* Metadata */}
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(document.uploadDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <span className="font-medium">{document.size}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{document.downloadCount} téléchargements</span>
                    <div className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      <span className="font-medium">Populaire</span>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 pt-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 h-8 text-xs group-hover:border-blue-300 group-hover:text-blue-600 transition-colors"
                    onClick={() => handlePreview(document)}
                    disabled={!canAccess(document)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Lire
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 h-8 text-xs bg-blue-600 hover:bg-blue-700 transition-colors"
                    onClick={() => handleDownload(document)}
                    disabled={!canAccess(document)}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Télécharger
                  </Button>
                </div>
                
                {/* Premium Notice */}
                {!canAccess(document) && (
                  <div className="mt-2 p-2 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 text-xs text-yellow-800">
                      <Crown className="w-3 h-3" />
                      <span className="font-medium">Accès Premium requis</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <Book className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun document trouvé</h3>
            <p className="text-muted-foreground">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          size="lg" 
          className="rounded-full w-14 h-14 shadow-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-110"
          onClick={() => alert('Fonctionnalité d\'ajout de document à venir')}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      {/* Modal Vidéo */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">{selectedVideo.title}</h3>
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
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                {/* Utiliser la vraie vidéo du formateur */}
                <video 
                  src={selectedVideo.fileUrl}
                  controls 
                  className="w-full h-full"
                  autoPlay
                  onError={(e) => {
                    console.error('❌ Erreur de chargement vidéo:', e);
                    const videoElement = e.target as HTMLVideoElement;
                    videoElement.style.display = 'none';
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'flex items-center justify-center h-full text-white';
                    errorDiv.innerHTML = `
                      <div class="text-center">
                        <div class="text-2xl mb-2">🎬</div>
                        <div class="text-lg font-semibold mb-2">Vidéo: ${selectedVideo.title}</div>
                        <div class="text-sm opacity-75">Par ${selectedVideo.instructorName}</div>
                        <div class="text-xs opacity-50 mt-2">URL: ${selectedVideo.fileUrl.substring(0, 50)}...</div>
                      </div>
                    `;
                    videoElement.parentElement?.appendChild(errorDiv);
                  }}
                  onLoadStart={() => {
                    console.log('🎬 Début du chargement de la vidéo:', selectedVideo.title, selectedVideo.fileUrl);
                  }}
                  onCanPlay={() => {
                    console.log('✅ Vidéo prête à être lue:', selectedVideo.title);
                  }}
                >
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
              </div>
              
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Formateur :</strong> {selectedVideo.instructorName}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Description :</strong> {selectedVideo.description}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Publié le :</strong> {new Date(selectedVideo.publishedAt).toLocaleDateString('fr-FR')}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Vues :</strong> {selectedVideo.views}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
