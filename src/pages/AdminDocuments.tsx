import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText,
  Upload,
  Download,
  Eye,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Star,
  Users,
  Calendar,
  File,
  Folder,
  BookOpen,
  Video,
  Image,
  Music,
  Archive,
  Share2,
  Lock,
  Unlock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Settings,
  MoreHorizontal
} from 'lucide-react';

interface Document {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'image' | 'audio' | 'presentation' | 'spreadsheet' | 'archive';
  category: string;
  subject: string;
  level: string;
  author: string;
  uploadDate: string;
  fileSize: number;
  downloads: number;
  views: number;
  rating: number;
  isPublic: boolean;
  isPremium: boolean;
  tags: string[];
  thumbnail?: string;
  fileUrl: string;
  status: 'active' | 'pending' | 'archived' | 'rejected';
}

interface DocumentStats {
  totalDocuments: number;
  totalDownloads: number;
  totalViews: number;
  totalSize: number;
  popularCategories: { category: string; count: number }[];
  recentUploads: Document[];
}

export const AdminDocuments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Données simulées pour les documents
  const [documents] = useState<Document[]>([
    {
      id: '1',
      title: 'Guide Complet React.js',
      description: 'Documentation complète pour apprendre React.js de A à Z',
      type: 'pdf',
      category: 'Développement Web',
      subject: 'Programmation',
      level: 'Intermédiaire',
      author: 'Prof. Mamadou Diallo',
      uploadDate: '2024-01-15T10:00:00Z',
      fileSize: 2.5,
      downloads: 1247,
      views: 3456,
      rating: 4.8,
      isPublic: true,
      isPremium: false,
      tags: ['react', 'javascript', 'frontend'],
      thumbnail: 'https://via.placeholder.com/150x200/3B82F6/FFFFFF?text=React',
      fileUrl: '/documents/react-guide.pdf',
      status: 'active'
    },
    {
      id: '2',
      title: 'Cours Vidéo Python Avancé',
      description: 'Série de vidéos sur les concepts avancés de Python',
      type: 'video',
      category: 'Programmation',
      subject: 'Informatique',
      level: 'Avancé',
      author: 'Dr. Fatou Sall',
      uploadDate: '2024-01-12T14:30:00Z',
      fileSize: 156.8,
      downloads: 892,
      views: 2156,
      rating: 4.6,
      isPublic: true,
      isPremium: true,
      tags: ['python', 'programmation', 'avancé'],
      thumbnail: 'https://via.placeholder.com/150x200/10B981/FFFFFF?text=Python',
      fileUrl: '/videos/python-advanced.mp4',
      status: 'active'
    },
    {
      id: '3',
      title: 'Exercices Mathématiques Terminale',
      description: 'Série d\'exercices corrigés pour la terminale',
      type: 'pdf',
      category: 'Mathématiques',
      subject: 'Mathématiques',
      level: 'Terminale',
      author: 'Prof. Aissatou Ba',
      uploadDate: '2024-01-10T09:15:00Z',
      fileSize: 1.2,
      downloads: 567,
      views: 1234,
      rating: 4.4,
      isPublic: true,
      isPremium: false,
      tags: ['mathématiques', 'exercices', 'terminale'],
      thumbnail: 'https://via.placeholder.com/150x200/8B5CF6/FFFFFF?text=Math',
      fileUrl: '/documents/math-exercises.pdf',
      status: 'active'
    },
    {
      id: '4',
      title: 'Présentation Histoire Sénégal',
      description: 'Présentation PowerPoint sur l\'histoire du Sénégal',
      type: 'presentation',
      category: 'Histoire',
      subject: 'Histoire-Géographie',
      level: 'Seconde',
      author: 'Prof. Ousmane Diop',
      uploadDate: '2024-01-08T16:45:00Z',
      fileSize: 8.5,
      downloads: 234,
      views: 678,
      rating: 4.2,
      isPublic: false,
      isPremium: false,
      tags: ['histoire', 'sénégal', 'présentation'],
      thumbnail: 'https://via.placeholder.com/150x200/F59E0B/FFFFFF?text=Hist',
      fileUrl: '/presentations/histoire-senegal.pptx',
      status: 'pending'
    },
    {
      id: '5',
      title: 'Audio Cours Anglais Business',
      description: 'Podcast sur l\'anglais des affaires',
      type: 'audio',
      category: 'Langues',
      subject: 'Anglais',
      level: 'Professionnel',
      author: 'Prof. Sarah Johnson',
      uploadDate: '2024-01-05T11:20:00Z',
      fileSize: 45.3,
      downloads: 189,
      views: 456,
      rating: 4.7,
      isPublic: true,
      isPremium: true,
      tags: ['anglais', 'business', 'audio'],
      thumbnail: 'https://via.placeholder.com/150x200/EF4444/FFFFFF?text=Audio',
      fileUrl: '/audio/business-english.mp3',
      status: 'active'
    }
  ]);

  const [stats] = useState<DocumentStats>({
    totalDocuments: 156,
    totalDownloads: 15420,
    totalViews: 45678,
    totalSize: 2.4, // GB
    popularCategories: [
      { category: 'Développement Web', count: 45 },
      { category: 'Mathématiques', count: 32 },
      { category: 'Langues', count: 28 },
      { category: 'Histoire', count: 25 },
      { category: 'Sciences', count: 26 }
    ],
    recentUploads: documents.slice(0, 3)
  });

  const categories = ['Tous', 'Développement Web', 'Programmation', 'Mathématiques', 'Histoire', 'Langues', 'Sciences'];
  const types = ['Tous', 'pdf', 'video', 'audio', 'presentation', 'image', 'spreadsheet', 'archive'];
  const statuses = ['Tous', 'active', 'pending', 'archived', 'rejected'];

  const formatFileSize = (size: number) => {
    if (size < 1) return `${(size * 1024).toFixed(0)} KB`;
    if (size < 1024) return `${size.toFixed(1)} MB`;
    return `${(size / 1024).toFixed(1)} GB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'audio': return <Music className="w-4 h-4" />;
      case 'presentation': return <File className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
      case 'spreadsheet': return <FileText className="w-4 h-4" />;
      case 'archive': return <Archive className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'archived': return 'text-gray-600 bg-gray-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleDocumentClick = (document: Document) => {
    setSelectedDocument(document);
    setIsModalOpen(true);
  };

  const filteredDocuments = documents.filter(document => {
    const matchesSearch = document.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         document.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         document.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'Tous' || document.category === selectedCategory;
    const matchesType = !selectedType || selectedType === 'Tous' || document.type === selectedType;
    const matchesStatus = !selectedStatus || selectedStatus === 'Tous' || document.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Documents</h1>
              <p className="text-gray-600 mt-2">Gérez les ressources pédagogiques et les documents de la plateforme</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <FileText className="w-4 h-4 mr-1" />
                {stats.totalDocuments} Documents
              </Badge>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Ajouter un Document
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
                <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalDocuments}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                  +12 ce mois
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Téléchargements</CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalDownloads.toLocaleString()}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                  +8.5% ce mois
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vues</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                  +15.2% ce mois
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Espace Utilisé</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSize} GB</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                  +2.1 GB ce mois
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Filtres et Recherche */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher un document..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {types.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu Principal */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Tous les Documents</TabsTrigger>
              <TabsTrigger value="pending">En Attente</TabsTrigger>
              <TabsTrigger value="premium">Documents Premium</TabsTrigger>
              <TabsTrigger value="archived">Archivés</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredDocuments.map((document) => (
                  <Card 
                    key={document.id} 
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleDocumentClick(document)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            {getTypeIcon(document.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg leading-tight mb-1 text-gray-900">
                              {document.title}
                            </h3>
                            <p className="text-sm text-gray-600 font-medium">
                              {document.author}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {document.isPremium && (
                            <Badge variant="secondary" className="bg-yellow-50 text-yellow-700">
                              <Star className="w-3 h-3 mr-1" />
                              Premium
                            </Badge>
                          )}
                          {!document.isPublic && (
                            <Badge variant="outline">
                              <Lock className="w-3 h-3 mr-1" />
                              Privé
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {document.description}
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Catégorie:</span>
                          <span className="text-sm font-medium">{document.category}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Niveau:</span>
                          <span className="text-sm font-medium">{document.level}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Taille:</span>
                          <span className="text-sm font-medium">{formatFileSize(document.fileSize)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Téléchargements:</span>
                          <span className="text-sm font-medium">{document.downloads.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Vues:</span>
                          <span className="text-sm font-medium">{document.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Note:</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{document.rating}/5</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Statut:</span>
                          <Badge className={getStatusColor(document.status)}>
                            {document.status === 'active' ? 'Actif' : 
                             document.status === 'pending' ? 'En attente' : 
                             document.status === 'archived' ? 'Archivé' : 'Rejeté'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Ajouté le:</span>
                          <span className="text-sm font-medium">{formatDate(document.uploadDate)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pending" className="space-y-6">
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun document en attente</h3>
                <p className="text-gray-600">Tous les documents ont été traités</p>
              </div>
            </TabsContent>

            <TabsContent value="premium" className="space-y-6">
              <div className="text-center py-12">
                <Star className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Documents Premium</h3>
                <p className="text-gray-600">Gérez les documents premium de la plateforme</p>
              </div>
            </TabsContent>

            <TabsContent value="archived" className="space-y-6">
              <div className="text-center py-12">
                <Archive className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Documents Archivés</h3>
                <p className="text-gray-600">Consultez les documents archivés</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Modal pour les détails du document */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Détails du Document - {selectedDocument?.title}
            </DialogTitle>
            <DialogDescription>
              Informations détaillées et statistiques du document
            </DialogDescription>
          </DialogHeader>
          
          {selectedDocument && (
            <div className="space-y-6">
              {/* Informations du document */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Informations du Document
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Titre</label>
                      <p className="text-sm font-medium">{selectedDocument.title}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Auteur</label>
                      <p className="text-sm font-medium">{selectedDocument.author}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Catégorie</label>
                      <p className="text-sm font-medium">{selectedDocument.category}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Niveau</label>
                      <p className="text-sm font-medium">{selectedDocument.level}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Type</label>
                      <p className="text-sm font-medium">{selectedDocument.type.toUpperCase()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Taille</label>
                      <p className="text-sm font-medium">{formatFileSize(selectedDocument.fileSize)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Date d'upload</label>
                      <p className="text-sm font-medium">{formatDate(selectedDocument.uploadDate)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Statut</label>
                      <Badge className={getStatusColor(selectedDocument.status)}>
                        {selectedDocument.status === 'active' ? 'Actif' : 
                         selectedDocument.status === 'pending' ? 'En attente' : 
                         selectedDocument.status === 'archived' ? 'Archivé' : 'Rejeté'}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-600">Description</label>
                    <p className="text-sm text-gray-700 mt-1">{selectedDocument.description}</p>
                  </div>
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-600">Tags</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedDocument.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Statistiques */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Statistiques
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">
                        {selectedDocument.downloads.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Téléchargements</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">
                        {selectedDocument.views.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Vues</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">
                        {selectedDocument.rating}
                      </div>
                      <div className="text-sm text-gray-600">Note /5</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-lg font-bold text-orange-600">
                        {selectedDocument.views > 0 ? 
                         ((selectedDocument.downloads / selectedDocument.views) * 100).toFixed(1) : 0}%
                      </div>
                      <div className="text-sm text-gray-600">Taux de Conversion</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Voir le Document
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      Partager
                    </Button>
                    <Button variant="outline" size="sm">
                      {selectedDocument.isPublic ? <Lock className="w-4 h-4 mr-2" /> : <Unlock className="w-4 h-4 mr-2" />}
                      {selectedDocument.isPublic ? 'Rendre Privé' : 'Rendre Public'}
                    </Button>
                    <Button variant="outline" size="sm">
                      {selectedDocument.isPremium ? <Star className="w-4 h-4 mr-2" /> : <Star className="w-4 h-4 mr-2" />}
                      {selectedDocument.isPremium ? 'Retirer Premium' : 'Rendre Premium'}
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDocuments;






