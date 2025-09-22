import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiInternshipService, Internship } from '@/lib/apiInternshipService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  MapPin, 
  Calendar,
  Clock,
  Building,
  Users,
  Star,
  Bookmark,
  Share2,
  Briefcase,
  GraduationCap,
  DollarSign,
  Globe,
  Mail,
  ExternalLink,
  Eye,
  Heart,
  MessageCircle,
  Plus,
  TrendingUp,
  Award,
  Target,
  Zap,
  Upload,
  FileText,
  X,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock as ClockIcon,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export const Stages: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedRemote, setSelectedRemote] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userApplications, setUserApplications] = useState<any[]>([]);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [applicationForm, setApplicationForm] = useState({
    name: '',
    email: '',
    phone: '',
    coverLetter: '',
    cvFile: null as File | null
  });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    closed: 0,
    premium: 0,
  });

  // Mettre à jour l'URL quand la recherche change
  useEffect(() => {
    if (searchTerm) {
      setSearchParams({ search: searchTerm });
    } else {
      setSearchParams({});
    }
  }, [searchTerm, setSearchParams]);

  // Charger les stages depuis l'API
  useEffect(() => {
    loadInternships();
  }, []);

  // Charger les candidatures de l'utilisateur
  useEffect(() => {
    if (user && apiInternshipService.isAuthenticated()) {
      loadUserApplications();
    }
  }, [user]);

  const loadInternships = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔍 Chargement des stages depuis l\'API...');
      const data = await apiInternshipService.getAllInternships();
      setInternships(data);
      console.log('✅ Stages chargés:', data.length);
      
      // Charger les statistiques
      const statsData = await apiInternshipService.getInternshipStats();
      setStats(statsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des stages';
      setError(errorMessage);
      console.error('❌ Erreur lors du chargement:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUserApplications = async () => {
    if (!user) return;
    
    try {
      console.log('🔍 Chargement des candidatures utilisateur...');
      const applications = await apiInternshipService.getUserInternshipRequests(parseInt(user.id));
      setUserApplications(applications);
      console.log('✅ Candidatures chargées:', applications.length);
    } catch (err) {
      console.error('❌ Erreur lors du chargement des candidatures:', err);
      setUserApplications([]);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: any = {};
      if (searchTerm) filters.q = searchTerm;
      if (selectedType !== 'all') filters.type = selectedType;
      if (selectedLocation !== 'all') filters.location = selectedLocation;
      if (selectedRemote !== 'all') filters.remote = selectedRemote === 'remote';

      const results = await apiInternshipService.searchInternships(filters);
      setInternships(results);
      console.log('✅ Recherche effectuée:', results.length, 'résultats');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la recherche';
      setError(errorMessage);
      console.error('❌ Erreur lors de la recherche:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer et trier les stages
  const filteredInternships = internships
    .filter(internship => {
      const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           internship.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType === 'all' || internship.type === selectedType;
      const matchesLocation = selectedLocation === 'all' || internship.location.toLowerCase().includes(selectedLocation.toLowerCase());
      const matchesRemote = selectedRemote === 'all' || 
                           (selectedRemote === 'remote' && internship.remote) ||
                           (selectedRemote === 'onsite' && !internship.remote);
      
      return matchesSearch && matchesType && matchesLocation && matchesRemote;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'deadline':
          return new Date(a.application_deadline || '').getTime() - new Date(b.application_deadline || '').getTime();
        case 'salary':
          const salaryA = parseInt(a.salary?.replace(/\D/g, '') || '0');
          const salaryB = parseInt(b.salary?.replace(/\D/g, '') || '0');
          return salaryB - salaryA;
        case 'popular':
          return b.views - a.views;
        default:
          return 0;
      }
    });

  // Vérifier si l'utilisateur a déjà postulé
  const hasApplied = (internshipId: number) => {
    return userApplications.some(app => app.internship_id === internshipId);
  };

  // Obtenir le statut de la candidature
  const getApplicationStatus = (internshipId: number) => {
    const application = userApplications.find(app => app.internship_id === internshipId);
    return application?.status || null;
  };

  // Ouvrir le modal de candidature
  const handleApply = (internship: Internship) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour postuler",
        variant: "destructive",
      });
      return;
    }

    if (!apiInternshipService.isAuthenticated()) {
      toast({
        title: "Authentification requise",
        description: "Votre session a expiré. Veuillez vous reconnecter.",
        variant: "destructive",
      });
      return;
    }

    // Pré-remplir le formulaire avec les informations de l'utilisateur
    const formData = {
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      coverLetter: `Candidature spontanée pour le poste de ${internship.title} chez ${internship.company}`,
      cvFile: null
    };
    
    setApplicationForm(formData);
    setSelectedInternship(internship);
    setShowApplicationModal(true);
  };

  // Soumettre la candidature
  const handleSubmitApplication = async () => {
    if (!selectedInternship || !user || !applicationForm.cvFile) {
      toast({
        title: "Erreur",
        description: "Données manquantes pour la candidature",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('📝 Soumission de candidature pour:', selectedInternship.title);
      
      const request = await apiInternshipService.submitInternshipRequest(
        selectedInternship.id,
        applicationForm.cvFile,
        applicationForm.coverLetter
      );

      toast({
        title: "Candidature envoyée !",
        description: "Votre candidature a été envoyée avec succès. Le recruteur vous contactera bientôt.",
      });
      
      // Fermer le modal
      setShowApplicationModal(false);
      setSelectedInternship(null);
      setApplicationForm({
        name: '',
        email: '',
        phone: '',
        coverLetter: '',
        cvFile: null
      });
      
      // Recharger les candidatures
      await loadUserApplications();
      
    } catch (err) {
      console.error('❌ Erreur lors de la candidature:', err);
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Erreur lors de l'envoi de la candidature. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  // Formater la date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date non spécifiée';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Date non spécifiée';
      }
      return date.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
    } catch (error) {
      console.error('Erreur de formatage de date:', error);
      return 'Date non spécifiée';
    }
  };

  // Vérifier si l'offre est expirée
  const isExpired = (deadline?: string) => {
    if (!deadline) return false;
    
    try {
      const date = new Date(deadline);
      if (isNaN(date.getTime())) {
        return false;
      }
      return date < new Date();
    } catch (error) {
      console.error('Erreur de vérification d\'expiration:', error);
      return false;
    }
  };

  // Obtenir le badge de statut
  const getStatusBadge = (internship: Internship) => {
    if (isExpired(internship.application_deadline)) {
      return <Badge className="bg-red-100 text-red-800">Expirée</Badge>;
    }
    if (internship.status === 'closed') {
      return <Badge className="bg-gray-100 text-gray-800">Fermée</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800">Active</Badge>;
  };

  // Obtenir le badge de candidature
  const getApplicationBadge = (internshipId: number) => {
    const status = getApplicationStatus(internshipId);
    if (!status) return null;
    
    switch (status) {
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle className="w-3 h-3" />Acceptée</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 flex items-center gap-1"><X className="w-3 h-3" />Refusée</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1"><ClockIcon className="w-3 h-3" />En cours</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800">Postulée</Badge>;
    }
  };

  if (loading && internships.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Chargement des stages...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Offres de Stage</h1>
              <p className="text-lg text-gray-600">Découvrez les opportunités disponibles via l'API Laravel</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-600">Stages disponibles</div>
              </div>
              <Button 
                size="sm"
                onClick={loadInternships}
                disabled={loading}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Actualiser
              </Button>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Message d'erreur */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Filtres */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Rechercher un stage..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 bg-white/70 backdrop-blur-sm border-gray-200/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>

              {/* Type d'offre */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              >
                <option value="all">Tous les types</option>
                <option value="stage">Stage</option>
                <option value="alternance">Alternance</option>
                <option value="emploi">Emploi</option>
              </select>

              {/* Localisation */}
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              >
                <option value="all">Toutes les localisations</option>
                <option value="dakar">Dakar</option>
                <option value="thiès">Thiès</option>
                <option value="saint-louis">Saint-Louis</option>
                <option value="remote">Télétravail</option>
              </select>

              {/* Bouton de recherche */}
              <Button 
                onClick={handleSearch}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Rechercher
              </Button>
            </div>
          </div>
        </div>

        {/* Liste des stages */}
        {filteredInternships.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun stage trouvé</h3>
            <p className="text-gray-600 mb-6">
              {internships.length === 0 
                ? "Aucun stage n'est actuellement disponible. Vérifiez que l'API Laravel est démarrée."
                : "Essayez de modifier vos critères de recherche"
              }
            </p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setSelectedType('all');
                setSelectedLocation('all');
                setSelectedRemote('all');
                loadInternships();
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              Réinitialiser les filtres
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredInternships.map((internship) => (
                <Card key={internship.id} className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border border-gray-200/50 overflow-hidden">
                  {/* Image du stage */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                    {internship.image && (
                      <img 
                        src={internship.image} 
                        alt={internship.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      {getStatusBadge(internship)}
                      {internship.is_premium && (
                        <Badge className="bg-yellow-100 text-yellow-800">Premium</Badge>
                      )}
                      {internship.remote && (
                        <Badge className="bg-blue-100 text-blue-800">Télétravail</Badge>
                      )}
                      {getApplicationBadge(internship.id)}
                    </div>

                    {/* Logo de l'entreprise */}
                    <div className="absolute bottom-4 right-4">
                      <div className="w-12 h-12 bg-white rounded-lg shadow-lg flex items-center justify-center">
                        {internship.logo ? (
                          <img 
                            src={internship.logo} 
                            alt={internship.company}
                            className="w-8 h-8 object-contain"
                          />
                        ) : (
                          <Building className="w-6 h-6 text-gray-600" />
                        )}
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    {/* Titre et entreprise */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                        {internship.title}
                      </h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Building className="w-4 h-4 mr-2" />
                        <span className="font-medium">{internship.company}</span>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{internship.location}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {internship.description}
                    </p>

                    {/* Détails */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center text-gray-500">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{internship.duration || 'Non spécifié'}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Expire le {formatDate(internship.application_deadline)}</span>
                      </div>
                      {internship.salary && (
                        <div className="flex items-center text-green-600 font-medium">
                          <DollarSign className="w-4 h-4 mr-2" />
                          <span>{internship.salary}</span>
                        </div>
                      )}
                      <div className="flex items-center text-gray-500">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{internship.applications} candidatures</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {internship.tags && internship.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {internship.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {internship.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{internship.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {hasApplied(internship.id) ? (
                          <Button variant="outline" className="text-green-600 border-green-200" disabled>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Postulée
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => handleApply(internship)}
                            disabled={isExpired(internship.application_deadline) || !apiInternshipService.isAuthenticated()}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Postuler
                          </Button>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                          <Bookmark className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Statistiques */}
            <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Statistiques API</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                  <div className="text-sm text-gray-600">Actifs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
                  <div className="text-sm text-gray-600">Expirés</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {filteredInternships.filter(internship => internship.remote).length}
                  </div>
                  <div className="text-sm text-gray-600">Télétravail</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {userApplications.length}
                  </div>
                  <div className="text-sm text-gray-600">Mes candidatures</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal de candidature */}
      {showApplicationModal && selectedInternship && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header du modal */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Candidature</h2>
                  <p className="text-gray-600 mt-1">
                    Poste : <span className="font-semibold">{selectedInternship.title}</span>
                  </p>
                  <p className="text-gray-600">
                    Entreprise : <span className="font-semibold">{selectedInternship.company}</span>
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowApplicationModal(false);
                    setSelectedInternship(null);
                    setApplicationForm({
                      name: '',
                      email: '',
                      phone: '',
                      coverLetter: '',
                      cvFile: null
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Contenu du modal */}
            <div className="p-6">
              <form onSubmit={(e) => { e.preventDefault(); handleSubmitApplication(); }}>
                <div className="space-y-6">
                  {/* Informations personnelles */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom complet *
                        </label>
                        <Input
                          type="text"
                          value={applicationForm.name}
                          onChange={(e) => setApplicationForm({...applicationForm, name: e.target.value})}
                          placeholder="Votre nom complet"
                          required
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <Input
                          type="email"
                          value={applicationForm.email}
                          onChange={(e) => setApplicationForm({...applicationForm, email: e.target.value})}
                          placeholder="votre.email@exemple.com"
                          required
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone *
                        </label>
                        <Input
                          type="tel"
                          value={applicationForm.phone}
                          onChange={(e) => setApplicationForm({...applicationForm, phone: e.target.value})}
                          placeholder="+221 77 123 45 67"
                          required
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* CV */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">CV</h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setApplicationForm({...applicationForm, cvFile: file});
                          }
                        }}
                        className="hidden"
                        id="cv-upload"
                        required
                      />
                      <label htmlFor="cv-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          {applicationForm.cvFile ? (
                            <span className="text-green-600 font-medium">
                              ✓ {applicationForm.cvFile.name}
                            </span>
                          ) : (
                            <>
                              Cliquez pour sélectionner votre CV
                              <br />
                              <span className="text-xs text-gray-500">
                                Formats acceptés : PDF, DOC, DOCX (max 2MB)
                              </span>
                            </>
                          )}
                        </p>
                      </label>
                    </div>
                  </div>

                  {/* Lettre de motivation */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Lettre de motivation</h3>
                    <textarea
                      value={applicationForm.coverLetter}
                      onChange={(e) => setApplicationForm({...applicationForm, coverLetter: e.target.value})}
                      placeholder="Expliquez pourquoi vous êtes intéressé par ce poste et pourquoi vous seriez un bon candidat..."
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowApplicationModal(false);
                      setSelectedInternship(null);
                      setApplicationForm({
                        name: '',
                        email: '',
                        phone: '',
                        coverLetter: '',
                        cvFile: null
                      });
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Envoyer ma candidature
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stages;
