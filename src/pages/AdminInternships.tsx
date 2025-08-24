import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Briefcase, 
  Users,
  Eye,
  Search,
  TrendingUp,
  Star,
  MapPin,
  Plus,
  Mail,
  Phone,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Building
} from 'lucide-react';
import { internshipService } from '@/lib/internshipService';
import { useToast } from '@/hooks/use-toast';

interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  views: number;
  applications: number;
  uniqueVisitors: number;
  rating?: number;
  logo?: string;
  image?: string;
  postedDate: string;
}

interface Application {
  id: string;
  internshipId: string;
  internshipTitle: string;
  company: string;
  applicant: {
    name: string;
    email: string;
    phone?: string;
    avatar: string;
  };
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  appliedDate: string;
  cvFileData?: string;
  cvFileName?: string;
  cvFileSize?: number;
  coverLetter?: string;
  adminNotes?: string;
}

export const AdminInternships: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  // Données simulées pour les stages
  const [internships] = useState<Internship[]>([
    {
      id: '1',
      title: 'Stage Développeur Full-Stack',
      company: 'TechSen Solutions',
      location: 'Dakar, Sénégal',
      views: 1247,
      applications: 23,
      uniqueVisitors: 156,
      rating: 4.5,
      logo: 'https://via.placeholder.com/100x100/3B82F6/FFFFFF?text=TS',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop&crop=center',
      postedDate: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'Alternance Marketing Digital',
      company: 'Digital Africa',
      location: 'Thiès, Sénégal',
      views: 892,
      applications: 15,
      uniqueVisitors: 98,
      rating: 4.2,
      logo: 'https://via.placeholder.com/100x100/10B981/FFFFFF?text=DA',
      image: 'https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&h=400&fit=crop&crop=center',
      postedDate: '2024-01-10T09:15:00Z'
    },
    {
      id: '3',
      title: 'Stage Data Science',
      company: 'DataSen Analytics',
      location: 'Saint-Louis, Sénégal',
      views: 2156,
      applications: 34,
      uniqueVisitors: 234,
      rating: 4.8,
      logo: 'https://via.placeholder.com/100x100/8B5CF6/FFFFFF?text=DS',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop&crop=center',
      postedDate: '2024-01-05T08:30:00Z'
    },
    {
      id: '4',
      title: 'Alternance Finance',
      company: 'Banque Régionale',
      location: 'Kaolack, Sénégal',
      views: 567,
      applications: 8,
      uniqueVisitors: 67,
      rating: 4.0,
      logo: 'https://via.placeholder.com/100x100/F59E0B/FFFFFF?text=BR',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop&crop=center',
      postedDate: '2024-01-12T12:00:00Z'
    }
  ]);

  // Charger les candidatures depuis le service
  useEffect(() => {
    const loadApplications = () => {
      const serviceApplications = internshipService.getApplications();
      const formattedApplications: Application[] = serviceApplications.map(app => ({
        id: app.id,
        internshipId: app.internshipId,
        internshipTitle: app.internshipTitle,
        company: app.company,
        applicant: {
          name: app.userName,
          email: app.userEmail,
          phone: app.userPhone,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.userName}`
        },
        status: app.status,
        appliedDate: app.appliedAt,
        cvFileData: app.cvFileData,
        cvFileName: app.cvFileName,
        cvFileSize: app.cvFileSize,
        coverLetter: app.coverLetter,
        adminNotes: app.adminNotes
      }));
      setApplications(formattedApplications);
    };

    loadApplications();
    
    // Recharger toutes les 5 secondes pour les nouvelles candidatures
    const interval = setInterval(loadApplications, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fonction de debug pour nettoyer localStorage (à supprimer en production)
  const clearLocalStorage = () => {
    localStorage.removeItem('doremi_internship_applications');
    localStorage.removeItem('doremi_admin_notifications');
    localStorage.removeItem('doremi_user_application_stats');
    setApplications([]);
    toast({
      title: "LocalStorage nettoyé",
      description: "Toutes les données de test ont été supprimées",
      variant: "default"
    });
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'text-green-600 bg-green-50';
      case 'reviewed': return 'text-blue-600 bg-blue-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleInternshipClick = (internship: Internship) => {
    setSelectedInternship(internship);
    setIsModalOpen(true);
  };

  const filteredInternships = internships.filter(internship => {
    return internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
           internship.location.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalInternships = internships.length;
  const totalViews = internships.reduce((sum, internship) => sum + internship.views, 0);
  const totalApplications = internships.reduce((sum, internship) => sum + internship.applications, 0);
  const totalUniqueVisitors = internships.reduce((sum, internship) => sum + internship.uniqueVisitors, 0);

  // Obtenir les candidatures pour un stage spécifique
  const getApplicationsForInternship = (internshipId: string) => {
    return applications.filter(app => app.internshipId === internshipId);
  };

  // Gérer le clic sur une candidature
  const handleApplicationClick = (application: Application) => {
    setSelectedApplication(application);
    setAdminNotes(application.adminNotes || '');
    setIsApplicationModalOpen(true);
  };

  // Mettre à jour le statut d'une candidature
  const handleUpdateApplicationStatus = (applicationId: string, status: 'pending' | 'reviewed' | 'accepted' | 'rejected') => {
    internshipService.updateApplicationStatus(applicationId, status, adminNotes);
    
    // Mettre à jour l'état local
    setApplications(prev => prev.map(app => 
      app.id === applicationId 
        ? { ...app, status, adminNotes } 
        : app
    ));

    toast({
      title: "Statut mis à jour",
      description: `La candidature a été marquée comme ${status}`,
      variant: "default"
    });

    setIsApplicationModalOpen(false);
    setSelectedApplication(null);
    setAdminNotes('');
  };

  // Télécharger le CV
  const handleDownloadCV = (application: Application) => {
    if (application.cvFileData && application.cvFileName) {
      try {
        // Convertir base64 en blob
        const blob = internshipService.base64ToBlob(application.cvFileData, 'application/pdf');
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = application.cvFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: "CV téléchargé",
          description: "Le CV a été téléchargé avec succès",
          variant: "default"
        });
      } catch (error) {
        console.error('Erreur lors du téléchargement du CV:', error);
        toast({
          title: "Erreur",
          description: "Impossible de télécharger le CV",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Stages</h1>
              <p className="text-gray-600 mt-2">Vue des utilisateurs qui se connectent et les candidatures par poste</p>
            </div>
            <Button
              variant="outline"
              onClick={clearLocalStorage}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              🗑️ Nettoyer les données de test
            </Button>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Briefcase className="w-4 h-4 mr-1" />
                {totalInternships} Stages
              </Badge>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un Stage
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
                <CardTitle className="text-sm font-medium">Total Stages</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(totalInternships)}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                  +2 ce mois
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
                  +15.3% ce mois
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Candidatures</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(totalApplications)}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                  +8.7% ce mois
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Visiteurs Uniques</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(totalUniqueVisitors)}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                  +12.1% ce mois
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recherche */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher un stage..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </section>

      {/* Liste des Stages */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredInternships.map((internship) => (
              <Card 
                key={internship.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group"
                onClick={() => handleInternshipClick(internship)}
              >
                {/* Image du stage */}
                {internship.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={internship.image}
                      alt={internship.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    {/* Badge de popularité */}
                    {internship.rating && internship.rating >= 4.5 && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-yellow-500 text-white border-0">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Populaire
                        </Badge>
                      </div>
                    )}
                  </div>
                )}
                
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    {internship.logo && (
                      <img
                        src={internship.logo}
                        alt={internship.company}
                        className="w-12 h-12 rounded-lg flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg leading-tight mb-1 text-gray-900 group-hover:text-blue-600 transition-colors">
                        {internship.title}
                      </h3>
                      <p className="text-sm text-gray-600 font-medium">
                        {internship.company}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Localisation:</span>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm font-medium">{internship.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Publié le:</span>
                      <span className="text-sm font-medium">{formatDate(internship.postedDate)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Vues:</span>
                      <span className="text-sm font-medium">{formatNumber(internship.views)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Candidatures:</span>
                      <span className="text-sm font-medium">{formatNumber(internship.applications)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Visiteurs uniques:</span>
                      <span className="text-sm font-medium">{formatNumber(internship.uniqueVisitors)}</span>
                    </div>
                    {internship.rating && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Note:</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
                          <span className="text-sm font-medium">{internship.rating}/5</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Modal pour les détails du stage */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Détails du Stage - {selectedInternship?.title}
            </DialogTitle>
            <DialogDescription>
              Informations sur les utilisateurs qui se connectent et les candidatures
            </DialogDescription>
          </DialogHeader>
          
          {selectedInternship && (
            <div className="space-y-6">
              {/* Statistiques du stage */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Statistiques du Stage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">
                        {formatNumber(selectedInternship.views)}
                      </div>
                      <div className="text-sm text-gray-600">Vues Totales</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">
                        {formatNumber(selectedInternship.uniqueVisitors)}
                      </div>
                      <div className="text-sm text-gray-600">Visiteurs Uniques</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">
                        {formatNumber(selectedInternship.applications)}
                      </div>
                      <div className="text-sm text-gray-600">Candidatures</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-lg font-bold text-orange-600">
                        {selectedInternship.views > 0 ? 
                         ((selectedInternship.applications / selectedInternship.views) * 100).toFixed(1) : 0}%
                      </div>
                      <div className="text-sm text-gray-600">Taux de Conversion</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Candidatures */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Candidatures ({getApplicationsForInternship(selectedInternship.id).length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getApplicationsForInternship(selectedInternship.id).map((application) => (
                      <div key={application.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={application.applicant.avatar}
                              alt={application.applicant.name}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <h4 className="font-semibold">{application.applicant.name}</h4>
                              <p className="text-sm text-gray-600">{application.applicant.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(application.status)}>
                              {application.status === 'accepted' ? 'Acceptée' : 
                               application.status === 'reviewed' ? 'Examinée' : 
                               application.status === 'pending' ? 'En attente' : 'Rejetée'}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApplicationClick(application)}
                            >
                              Voir détails
                            </Button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          Candidature soumise le {formatDate(application.appliedDate)}
                        </div>
                      </div>
                    ))}
                    {getApplicationsForInternship(selectedInternship.id).length === 0 && (
                      <p className="text-gray-500 text-center py-8">
                        Aucune candidature pour ce stage
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de détails de candidature */}
      <Dialog open={isApplicationModalOpen} onOpenChange={setIsApplicationModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Détails de la Candidature
            </DialogTitle>
            <DialogDescription>
              Informations complètes sur la candidature et le candidat
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-6">
              {/* Informations du stage */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Stage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">{selectedApplication.internshipTitle}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-green-500" />
                      <span>{selectedApplication.company}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informations du candidat */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Candidat</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={selectedApplication.applicant.avatar}
                      alt={selectedApplication.applicant.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <h3 className="text-xl font-semibold">{selectedApplication.applicant.name}</h3>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{selectedApplication.applicant.email}</span>
                      </div>
                      {selectedApplication.applicant.phone && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{selectedApplication.applicant.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Candidature soumise le {formatDate(selectedApplication.appliedDate)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* CV et lettre de motivation */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* CV */}
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="font-medium">CV</p>
                          <p className="text-sm text-gray-600">
                            {selectedApplication.cvFileName || 'CV non disponible'}
                          </p>
                        </div>
                      </div>
                      {selectedApplication.cvFileData && selectedApplication.cvFileName && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadCV(selectedApplication)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Télécharger
                        </Button>
                      )}
                    </div>

                    {/* Lettre de motivation */}
                    {selectedApplication.coverLetter && (
                      <div className="p-3 border rounded-lg">
                        <p className="font-medium mb-2">Lettre de motivation</p>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">
                          {selectedApplication.coverLetter}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Actions admin */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions Administrateur</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Notes admin */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes administratives
                      </label>
                      <Textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Ajoutez vos notes sur cette candidature..."
                        rows={3}
                      />
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleUpdateApplicationStatus(selectedApplication.id, 'pending')}
                        className="flex items-center gap-2"
                      >
                        <Clock className="w-4 h-4" />
                        En attente
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleUpdateApplicationStatus(selectedApplication.id, 'reviewed')}
                        className="flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Examinée
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleUpdateApplicationStatus(selectedApplication.id, 'accepted')}
                        className="flex items-center gap-2 bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Accepter
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleUpdateApplicationStatus(selectedApplication.id, 'rejected')}
                        className="flex items-center gap-2 bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                      >
                        <XCircle className="w-4 h-4" />
                        Rejeter
                      </Button>
                    </div>
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

export default AdminInternships;
