import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Users, 
  BookOpen, 
  Video,
  Play,
  Eye,
  Clock,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  MoreHorizontal,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  X,
  Maximize2,
  BarChart,
  PieChart as PieChartIcon,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Star,
  Heart,
  MessageSquare,
  Share2,
  Settings,
  Plus
} from 'lucide-react';

interface Video {
  id: string;
  title: string;
  description: string;
  instructor: {
    name: string;
    email: string;
    avatar: string;
    specialization: string;
  };
  duration: string;
  views: number;
  likes: number;
  uploadDate: string;
  category: string;
  level: string;
  thumbnail: string;
  videoUrl: string;
  viewers: Viewer[];
  liveSession?: LiveSession;
}

interface Viewer {
  id: string;
  name: string;
  email: string;
  avatar: string;
  watchDate: string;
  watchDuration: string;
  completionRate: number;
  lastSeen: string;
}

interface LiveSession {
  id: string;
  title: string;
  scheduledDate: string;
  duration: string;
  attendees: number;
  maxAttendees: number;
  status: 'scheduled' | 'live' | 'ended';
  participants: Participant[];
}

interface Participant {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinTime: string;
  leaveTime?: string;
  attendanceDuration: string;
}

export const AdminCourses: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('videos');

  // Données simulées pour les vidéos
  const [videos] = useState<Video[]>([
    {
      id: '1',
      title: 'Introduction aux Mathématiques Avancées',
      description: 'Cours complet sur les concepts fondamentaux des mathématiques avancées',
      instructor: {
        name: 'Dr. Amadou Diallo',
        email: 'amadou.diallo@doremi.fr',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amadou',
        specialization: 'Mathématiques'
      },
      duration: '2h 30min',
      views: 1247,
      likes: 89,
      uploadDate: '2024-01-15',
      category: 'Mathématiques',
      level: 'Avancé',
      thumbnail: 'https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Math+Avancées',
      videoUrl: 'https://example.com/video1.mp4',
      viewers: [
        {
          id: 'v1',
          name: 'Marie Diop',
          email: 'marie.diop@email.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marie',
          watchDate: '2024-01-20',
          watchDuration: '2h 15min',
          completionRate: 95,
          lastSeen: '2024-01-20T15:30:00Z'
        },
        {
          id: 'v2',
          name: 'Fatou Sall',
          email: 'fatou.sall@email.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fatou',
          watchDate: '2024-01-18',
          watchDuration: '1h 45min',
          completionRate: 78,
          lastSeen: '2024-01-18T10:15:00Z'
        }
      ]
    },
    {
      id: '2',
      title: 'Physique Quantique pour Débutants',
      description: 'Découverte des principes de base de la physique quantique',
      instructor: {
        name: 'Prof. Fatou Ndiaye',
        email: 'fatou.ndiaye@doremi.fr',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fatou',
        specialization: 'Physique'
      },
      duration: '1h 45min',
      views: 892,
      likes: 67,
      uploadDate: '2024-01-10',
      category: 'Physique',
      level: 'Intermédiaire',
      thumbnail: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=Physique+Quantique',
      videoUrl: 'https://example.com/video2.mp4',
      viewers: [
        {
          id: 'v3',
          name: 'Ousmane Ba',
          email: 'ousmane.ba@email.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ousmane',
          watchDate: '2024-01-12',
          watchDuration: '1h 30min',
          completionRate: 100,
          lastSeen: '2024-01-12T14:20:00Z'
        }
      ]
    },
    {
      id: '3',
      title: 'Session Live: Chimie Organique',
      description: 'Session interactive sur la chimie organique',
      instructor: {
        name: 'Dr. Mamadou Fall',
        email: 'mamadou.fall@doremi.fr',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mamadou',
        specialization: 'Chimie'
      },
      duration: '3h 00min',
      views: 567,
      likes: 45,
      uploadDate: '2024-01-05',
      category: 'Chimie',
      level: 'Avancé',
      thumbnail: 'https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Chimie+Organique',
      videoUrl: 'https://example.com/video3.mp4',
      liveSession: {
        id: 'ls1',
        title: 'Session Live: Chimie Organique',
        scheduledDate: '2024-01-05T14:00:00Z',
        duration: '3h 00min',
        attendees: 45,
        maxAttendees: 50,
        status: 'ended',
        participants: [
          {
            id: 'p1',
            name: 'Aissatou Diagne',
            email: 'aissatou.diagne@email.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aissatou',
            joinTime: '2024-01-05T14:05:00Z',
            leaveTime: '2024-01-05T17:00:00Z',
            attendanceDuration: '2h 55min'
          },
          {
            id: 'p2',
            name: 'Modou Gueye',
            email: 'modou.gueye@email.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=modou',
            joinTime: '2024-01-05T14:00:00Z',
            leaveTime: '2024-01-05T16:30:00Z',
            attendanceDuration: '2h 30min'
          }
        ]
      },
      viewers: [
        {
          id: 'v4',
          name: 'Aissatou Diagne',
          email: 'aissatou.diagne@email.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aissatou',
          watchDate: '2024-01-05',
          watchDuration: '2h 55min',
          completionRate: 98,
          lastSeen: '2024-01-05T17:00:00Z'
        }
      ]
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
      case 'scheduled': return 'text-blue-600 bg-blue-50';
      case 'live': return 'text-green-600 bg-green-50';
      case 'ended': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.instructor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'live' && video.liveSession) ||
                         (selectedFilter === 'recorded' && !video.liveSession);
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    
    return matchesSearch && matchesFilter && matchesCategory;
  });

  const totalViews = videos.reduce((sum, video) => sum + video.views, 0);
  const totalLikes = videos.reduce((sum, video) => sum + video.likes, 0);
  const totalVideos = videos.length;
  const liveSessions = videos.filter(video => video.liveSession).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Cours</h1>
              <p className="text-gray-600 mt-2">Vue globale de tous les cours et sessions live</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Video className="w-4 h-4 mr-1" />
                {totalVideos} Cours Disponibles
              </Badge>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un Cours
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
                <CardTitle className="text-sm font-medium">Total Vues</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(totalViews)}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                  +12.5% vs mois dernier
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(totalLikes)}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                  +8.7% vs mois dernier
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cours Disponibles</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalVideos}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Plus className="w-3 h-3 mr-1 text-blue-600" />
                  +3 ce mois
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sessions Live</CardTitle>
                <Video className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{liveSessions}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="w-3 h-3 mr-1 text-orange-600" />
                  +2 cette semaine
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
                placeholder="Rechercher un cours ou formateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les cours</SelectItem>
                <SelectItem value="recorded">Cours enregistrés</SelectItem>
                <SelectItem value="live">Sessions live</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                <SelectItem value="Mathématiques">Mathématiques</SelectItem>
                <SelectItem value="Physique">Physique</SelectItem>
                <SelectItem value="Chimie">Chimie</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Contenu Principal */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="videos">Cours Vidéo</TabsTrigger>
              <TabsTrigger value="live">Sessions Live</TabsTrigger>
            </TabsList>

            {/* Cours Vidéo */}
            <TabsContent value="videos" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVideos.map((video) => (
                  <Card 
                    key={video.id} 
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleVideoClick(video)}
                  >
                    <div className="relative">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      {video.liveSession && (
                        <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                          <Video className="w-3 h-3 mr-1" />
                          Live
                        </Badge>
                      )}
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                        {video.duration}
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{video.title}</CardTitle>
                      <CardDescription>{video.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={video.instructor.avatar}
                          alt={video.instructor.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-sm">{video.instructor.name}</p>
                          <p className="text-xs text-gray-600">{video.instructor.specialization}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {formatNumber(video.views)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {formatNumber(video.likes)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(video.uploadDate)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Sessions Live */}
            <TabsContent value="live" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {videos.filter(video => video.liveSession).map((video) => (
                  <Card key={video.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Video className="w-5 h-5 text-red-500" />
                          {video.liveSession?.title}
                        </CardTitle>
                        <Badge className={getStatusColor(video.liveSession?.status || '')}>
                          {video.liveSession?.status === 'scheduled' ? 'Programmé' :
                           video.liveSession?.status === 'live' ? 'En Direct' : 'Terminé'}
                        </Badge>
                      </div>
                      <CardDescription>{video.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={video.instructor.avatar}
                            alt={video.instructor.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-medium">{video.instructor.name}</p>
                            <p className="text-sm text-gray-600">{video.instructor.email}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-lg font-bold text-blue-600">
                              {video.liveSession?.attendees}/{video.liveSession?.maxAttendees}
                            </div>
                            <div className="text-sm text-gray-600">Participants</div>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-lg font-bold text-green-600">
                              {video.liveSession?.duration}
                            </div>
                            <div className="text-sm text-gray-600">Durée</div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          {formatDateTime(video.liveSession?.scheduledDate || '')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Modal pour les détails de la vidéo */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              Détails du Cours - {selectedVideo?.title}
            </DialogTitle>
            <DialogDescription>
              Informations complètes sur le cours et ses spectateurs
            </DialogDescription>
          </DialogHeader>
          
          {selectedVideo && (
            <div className="space-y-6">
              {/* Informations du cours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Informations du Cours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Détails</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Titre:</span>
                          <span className="font-medium">{selectedVideo.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Catégorie:</span>
                          <span className="font-medium">{selectedVideo.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Niveau:</span>
                          <span className="font-medium">{selectedVideo.level}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Durée:</span>
                          <span className="font-medium">{selectedVideo.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date d'upload:</span>
                          <span className="font-medium">{formatDate(selectedVideo.uploadDate)}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Statistiques</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Vues:</span>
                          <span className="font-medium">{formatNumber(selectedVideo.views)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Likes:</span>
                          <span className="font-medium">{formatNumber(selectedVideo.likes)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Spectateurs uniques:</span>
                          <span className="font-medium">{selectedVideo.viewers.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informations du formateur */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informations du Formateur
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedVideo.instructor.avatar}
                      alt={selectedVideo.instructor.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{selectedVideo.instructor.name}</h4>
                      <p className="text-gray-600">{selectedVideo.instructor.specialization}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{selectedVideo.instructor.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Liste des spectateurs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Liste des Spectateurs ({selectedVideo.viewers.length})
                  </CardTitle>
                  <CardDescription>
                    Utilisateurs qui ont regardé cette vidéo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedVideo.viewers.map((viewer) => (
                      <div key={viewer.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <img
                            src={viewer.avatar}
                            alt={viewer.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <h4 className="font-medium">{viewer.name}</h4>
                            <p className="text-sm text-gray-600">{viewer.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            Durée: {viewer.watchDuration}
                          </div>
                          <div className="text-xs text-gray-600">
                            Complétion: {viewer.completionRate}%
                          </div>
                          <div className="text-xs text-gray-600">
                            Vu le: {formatDate(viewer.watchDate)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Informations de session live si applicable */}
              {selectedVideo.liveSession && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="w-5 h-5" />
                      Informations de Session Live
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">
                            {selectedVideo.liveSession.attendees}/{selectedVideo.liveSession.maxAttendees}
                          </div>
                          <div className="text-sm text-gray-600">Participants</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-600">
                            {selectedVideo.liveSession.duration}
                          </div>
                          <div className="text-sm text-gray-600">Durée</div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3">Participants de la Session Live</h4>
                        <div className="space-y-2">
                          {selectedVideo.liveSession.participants.map((participant) => (
                            <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <img
                                  src={participant.avatar}
                                  alt={participant.name}
                                  className="w-8 h-8 rounded-full"
                                />
                                <div>
                                  <p className="font-medium text-sm">{participant.name}</p>
                                  <p className="text-xs text-gray-600">{participant.email}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium">
                                  {participant.attendanceDuration}
                                </div>
                                <div className="text-xs text-gray-600">
                                  Rejoint: {formatDateTime(participant.joinTime)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCourses;






