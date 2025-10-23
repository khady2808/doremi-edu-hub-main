import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { internshipService } from '@/lib/internshipService';
import { internshipApiService, type Internship as ApiInternship } from '@/services/internshipApi';
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
  Clock as ClockIcon
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { offersService } from '@/lib/offersService';

interface InternshipOffer {
  id: string;
  title: string;
  company: string;
  location: string;
  duration: string;
  description: string;
  requirements: string[];
  applicationDeadline: string;
  salary?: string;
  type: 'stage' | 'alternance' | 'emploi';
  remote: boolean;
  isPremium: boolean;
  views: number;
  applications: number;
  rating?: number;
  logo?: string;
  image?: string;
  tags: string[];
  recruiterId: string;
  recruiterName: string;
  createdAt: string;
  status: 'active' | 'expired' | 'closed';
}

export const Stages: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedRemote, setSelectedRemote] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [offers, setOffers] = useState<InternshipOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [userApplications, setUserApplications] = useState<any[]>([]);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<InternshipOffer | null>(null);
  const [applicationForm, setApplicationForm] = useState({
    name: '',
    email: '',
    phone: '',
    coverLetter: '',
    cvFile: null as File | null
  });

  // Mettre à jour l'URL quand la recherche change
  useEffect(() => {
    if (searchTerm) {
      setSearchParams({ search: searchTerm });
    } else {
      setSearchParams({});
    }
  }, [searchTerm, setSearchParams]);

  // Charger les offres depuis l'API et le service local
  useEffect(() => {
    const loadOffers = async () => {
      setLoading(true);
      try {
        // Charger depuis l'API des stages
        console.log('📦 Chargement des stages depuis l\'API...');
        const apiOffers = await internshipApiService.getAllInternships();
        console.log('📋 Stages chargés depuis l\'API:', apiOffers);
        
        // Transformer les offres de l'API pour correspondre à l'interface InternshipOffer
        const apiTransformedOffers: InternshipOffer[] = apiOffers.map((offer: ApiInternship) => ({
          id: offer.id,
          title: offer.title,
          company: offer.company,
          location: offer.location,
          duration: offer.duration,
          description: offer.description,
          requirements: offer.requirements,
          applicationDeadline: offer.applicationDeadline,
          salary: offer.salary,
          type: offer.type,
          remote: offer.remote,
          isPremium: false,
          views: offer.views || 0,
          applications: offer.applications || 0,
          rating: offer.rating || 4.0,
          logo: offer.logo,
          image: offer.image,
          tags: offer.tags || [],
          recruiterId: 'api',
          recruiterName: offer.company,
          createdAt: offer.createdAt,
          status: offer.status
        }));

        // Charger depuis le service local (offres des recruteurs)
        console.log('📦 Chargement des offres depuis le service local...');
        const allLocalOffers = offersService.getAll();
        const publishedLocalOffers = allLocalOffers.filter(offer => offer.status === 'published');
        
        // Transformer les offres locales
        const localTransformedOffers: InternshipOffer[] = publishedLocalOffers.map((offer: any) => ({
          id: `local_${offer.id}`,
          title: offer.title,
          company: offer.recruiterName || 'Entreprise non spécifiée',
          location: offer.location || 'Localisation non spécifiée',
          duration: offer.contractType || 'Non spécifié',
          description: offer.description,
          requirements: [],
          applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          salary: undefined,
          type: 'stage',
          remote: false,
          isPremium: false,
          views: 0,
          applications: 0,
          rating: 4.0,
          logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
          tags: [],
          recruiterId: offer.recruiterId,
          recruiterName: offer.recruiterName,
          createdAt: offer.publishedAt,
          status: 'active'
        }));

        // Combiner les offres de l'API et du service local
        const allOffers = [...apiTransformedOffers, ...localTransformedOffers];
        console.log('🔄 Toutes les offres combinées:', allOffers);
        
        setOffers(allOffers);
        setLoading(false);
      } catch (error) {
        console.error('❌ Erreur lors du chargement des offres:', error);
        
        // Fallback: charger seulement depuis le service local
        try {
          console.log('🔄 Fallback: chargement depuis le service local uniquement...');
          const allLocalOffers = offersService.getAll();
          const publishedLocalOffers = allLocalOffers.filter(offer => offer.status === 'published');
          
          const localTransformedOffers: InternshipOffer[] = publishedLocalOffers.map((offer: any) => ({
            id: `local_${offer.id}`,
            title: offer.title,
            company: offer.recruiterName || 'Entreprise non spécifiée',
            location: offer.location || 'Localisation non spécifiée',
            duration: offer.contractType || 'Non spécifié',
            description: offer.description,
            requirements: [],
            applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            salary: undefined,
            type: 'stage',
            remote: false,
            isPremium: false,
            views: 0,
            applications: 0,
            rating: 4.0,
            logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
            tags: [],
            recruiterId: offer.recruiterId,
            recruiterName: offer.recruiterName,
            createdAt: offer.publishedAt,
            status: 'active'
          }));
          
          setOffers(localTransformedOffers);
          toast({
            title: "Mode hors ligne",
            description: "Chargement depuis les données locales uniquement",
            variant: "default",
          });
        } catch (fallbackError) {
          console.error('❌ Erreur lors du fallback:', fallbackError);
          setOffers([]);
          toast({
            title: "Erreur de chargement",
            description: "Impossible de charger les offres",
            variant: "destructive",
          });
        }
        
        setLoading(false);
      }
    };

    loadOffers();
  }, [toast]);

  // Charger les candidatures de l'utilisateur
  useEffect(() => {
    if (user) {
      try {
        const allApplications = JSON.parse(localStorage.getItem('doremi_internship_applications') || '[]');
        const userApps = allApplications.filter((app: any) => app.userId === user.id);
        setUserApplications(userApps);
        console.log('📋 Candidatures utilisateur chargées:', userApps);
      } catch (error) {
        console.error('❌ Erreur lors du chargement des candidatures:', error);
        setUserApplications([]);
      }
    }
  }, [user]);

  // Filtrer et trier les offres
  const filteredOffers = offers
    .filter(offer => {
      // Vérifier que l'offre a les données minimales requises
      if (!offer.id || !offer.title || !offer.company) {
        console.warn('⚠️ Offre ignorée - données manquantes:', offer);
        return false;
      }
      
      const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           offer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           offer.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType === 'all' || offer.type === selectedType;
      const matchesLocation = selectedLocation === 'all' || offer.location.toLowerCase().includes(selectedLocation.toLowerCase());
      const matchesRemote = selectedRemote === 'all' || 
                           (selectedRemote === 'remote' && offer.remote) ||
                           (selectedRemote === 'onsite' && !offer.remote);
      
      return matchesSearch && matchesType && matchesLocation && matchesRemote;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'deadline':
          return new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime();
        case 'salary':
          return (parseInt(b.salary?.replace(/\D/g, '') || '0') - parseInt(a.salary?.replace(/\D/g, '') || '0'));
        case 'popular':
          return b.views - a.views;
        default:
          return 0;
      }
    });

  // Vérifier si l'utilisateur a déjà postulé
  const hasApplied = (offerId: string) => {
    return userApplications.some(app => app.offerId === offerId);
  };

  // Obtenir le statut de la candidature
  const getApplicationStatus = (offerId: string) => {
    const application = userApplications.find(app => app.offerId === offerId);
    return application?.status || null;
  };

  // Fonction de rechargement des offres
  const reloadOffers = () => {
    try {
      const allOffers = offersService.getAll();
      
      // Filtrer seulement les offres publiées
      const publishedOffers = allOffers.filter(offer => offer.status === 'published');
      
      const transformedOffers: InternshipOffer[] = publishedOffers.map((offer: any) => ({
        id: offer.id,
        title: offer.title,
        company: offer.recruiterName || 'Entreprise non spécifiée',
        location: offer.location || 'Localisation non spécifiée',
        duration: offer.contractType || 'Non spécifié',
        description: offer.description,
        requirements: [],
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Expire dans 30 jours
        salary: undefined,
        type: 'stage',
        remote: false,
        isPremium: false,
        views: 0,
        applications: 0,
        rating: 4.0,
        logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
        tags: [],
        recruiterId: offer.recruiterId,
        recruiterName: offer.recruiterName,
        createdAt: offer.publishedAt,
        status: 'active'
      }));
      
      setOffers(transformedOffers);
    } catch (error) {
      console.error('❌ Erreur lors du rechargement:', error);
    }
  };

  // Ouvrir le modal de candidature
  const handleApply = (offer: InternshipOffer) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour postuler",
        variant: "destructive",
      });
      return;
    }

    // Pré-remplir le formulaire avec les informations de l'utilisateur
    const formData = {
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      coverLetter: `Candidature spontanée pour le poste de ${offer.title} chez ${offer.company}`,
      cvFile: null
    };
    
    setApplicationForm(formData);
    setSelectedOffer(offer);
    setShowApplicationModal(true);
  };

  // Soumettre la candidature
  const handleSubmitApplication = async () => {
    if (!selectedOffer || !user) {
      toast({
        title: "Erreur",
        description: "Données manquantes pour la candidature",
        variant: "destructive",
      });
      return;
    }

    // Validation du formulaire
    if (!applicationForm.name || !applicationForm.email || !applicationForm.phone) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    if (!applicationForm.cvFile) {
      toast({
        title: "CV requis",
        description: "Veuillez sélectionner votre CV",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('📝 Soumission de candidature pour:', selectedOffer.title);
      
      // Créer une candidature complète
      const application = {
        id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        offerId: selectedOffer.id,
        internshipId: selectedOffer.id,
        internshipTitle: selectedOffer.title,
        company: selectedOffer.company,
        userId: user.id,
        userName: applicationForm.name,
        userEmail: applicationForm.email,
        userRole: user.role === 'student' ? 'student' : 'teacher',
        userPhone: applicationForm.phone,
        userLocation: 'Non spécifié',
        educationLevel: user.educationLevel || 'Non spécifié',
        cvFileData: null, // Sera géré par le service
        cvFileName: applicationForm.cvFile.name,
        cvFileSize: applicationForm.cvFile.size,
        coverLetter: applicationForm.coverLetter,
        appliedAt: new Date().toISOString(),
        status: 'pending'
      };

      // Utiliser le service pour soumettre la candidature avec le CV
      const result = await internshipService.submitApplication(
        selectedOffer.id,
        selectedOffer.title,
        selectedOffer.company,
        user.id,
        applicationForm.name,
        applicationForm.email,
        user.role === 'student' ? 'student' : 'teacher',
        applicationForm.phone,
        applicationForm.cvFile,
        applicationForm.coverLetter
      );

      if (result.success) {
        toast({
          title: "Candidature envoyée !",
          description: "Votre candidature a été envoyée avec succès. Le recruteur vous contactera bientôt.",
        });
        
        // Fermer le modal
        setShowApplicationModal(false);
        setSelectedOffer(null);
        setApplicationForm({
          name: '',
          email: '',
          phone: '',
          coverLetter: '',
          cvFile: null
        });
        
        // Mettre à jour la liste des candidatures
        const userApps = internshipService.getApplications().filter(app => app.userId === user.id);
        setUserApplications(userApps);
        console.log('📋 Candidatures mises à jour:', userApps);
      } else {
        toast({
          title: "Erreur",
          description: result.message || "Erreur lors de l'envoi de la candidature",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Erreur lors de la candidature:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'envoi de la candidature. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    if (!dateString || dateString === 'Invalid Date') {
      return 'Date non spécifiée';
    }
    
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
  const isExpired = (deadline: string) => {
    if (!deadline || deadline === 'Invalid Date') {
      return false; // Si pas de date, considérer comme non expirée
    }
    
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
  const getStatusBadge = (offer: InternshipOffer) => {
    if (isExpired(offer.applicationDeadline)) {
      return <Badge className="bg-red-100 text-red-800">Expirée</Badge>;
    }
    if (offer.status === 'closed') {
      return <Badge className="bg-gray-100 text-gray-800">Fermée</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800">Active</Badge>;
  };

  // Obtenir le badge de candidature
  const getApplicationBadge = (offerId: string) => {
    const status = getApplicationStatus(offerId);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
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
              <p className="text-lg text-gray-600">Découvrez les opportunités postées par nos recruteurs partenaires</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{offers.length}</div>
                <div className="text-sm text-gray-600">Offres disponibles</div>
              </div>
              <Button 
                size="sm"
                onClick={reloadOffers}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                🔄 Recharger
              </Button>
              <Button 
                size="sm"
                onClick={() => {
                  try {
                    internshipService.cleanupLocalStorage();
                    toast({
                      title: "Nettoyage effectué",
                      description: "Le localStorage a été nettoyé avec succès.",
                    });
                  } catch (error) {
                    toast({
                      title: "Erreur",
                      description: "Erreur lors du nettoyage.",
                      variant: "destructive",
                    });
                  }
                }}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                🧹 Nettoyer
              </Button>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Filtres simplifiés */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Rechercher une offre..."
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
            </div>
          </div>
        </div>

        {/* Liste des offres */}
        {filteredOffers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune offre trouvée</h3>
            <p className="text-gray-600 mb-6">
              {offers.length === 0 
                ? "Aucune offre n'est actuellement disponible. Les recruteurs ajoutent régulièrement de nouvelles opportunités."
                : "Essayez de modifier vos critères de recherche"
              }
            </p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setSelectedType('all');
                setSelectedLocation('all');
                setSelectedRemote('all');
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              Réinitialiser les filtres
            </Button>
          </div>
        ) : (
          <>
            {offers.length > filteredOffers.length && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Info :</strong> {offers.length - filteredOffers.length} offre(s) masquée(s) car les données sont incomplètes.
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredOffers.map((offer) => (
                <Card key={offer.id} className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border border-gray-200/50 overflow-hidden">
                  {/* Image de l'offre */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                    {offer.image && (
                      <img 
                        src={offer.image} 
                        alt={offer.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      {getStatusBadge(offer)}
                      {offer.isPremium && (
                        <Badge className="bg-yellow-100 text-yellow-800">Premium</Badge>
                      )}
                      {offer.remote && (
                        <Badge className="bg-blue-100 text-blue-800">Télétravail</Badge>
                      )}
                      {getApplicationBadge(offer.id)}
                    </div>

                    {/* Logo de l'entreprise */}
                    <div className="absolute bottom-4 right-4">
                      <div className="w-12 h-12 bg-white rounded-lg shadow-lg flex items-center justify-center">
                        <img 
                          src={offer.logo} 
                          alt={offer.company}
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    {/* Titre et entreprise */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                        {offer.title}
                      </h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Building className="w-4 h-4 mr-2" />
                        <span className="font-medium">{offer.company}</span>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{offer.location}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {offer.description}
                    </p>

                    {/* Détails */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center text-gray-500">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{offer.duration}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Expire le {formatDate(offer.applicationDeadline)}</span>
                      </div>
                      {offer.salary && (
                        <div className="flex items-center text-green-600 font-medium">
                          <DollarSign className="w-4 h-4 mr-2" />
                          <span>{offer.salary}</span>
                        </div>
                      )}
                      <div className="flex items-center text-gray-500">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{offer.applications} candidatures</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {offer.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {offer.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {offer.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{offer.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {hasApplied(offer.id) ? (
                          <Button variant="outline" className="text-green-600 border-green-200" disabled>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Postulée
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => handleApply(offer)}
                            disabled={isExpired(offer.applicationDeadline)}
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
          </>
        )}

        {/* Statistiques */}
        {filteredOffers.length > 0 && (
          <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Statistiques</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{filteredOffers.length}</div>
                <div className="text-sm text-gray-600">Offres trouvées</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredOffers.filter(offer => !isExpired(offer.applicationDeadline)).length}
                </div>
                <div className="text-sm text-gray-600">Offres actives</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {filteredOffers.filter(offer => offer.remote).length}
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
        )}
      </div>

      {/* Modal de candidature */}
      {showApplicationModal && selectedOffer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header du modal */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Candidature</h2>
                  <p className="text-gray-600 mt-1">
                    Poste : <span className="font-semibold">{selectedOffer.title}</span>
                  </p>
                  <p className="text-gray-600">
                    Entreprise : <span className="font-semibold">{selectedOffer.company}</span>
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowApplicationModal(false);
                    setSelectedOffer(null);
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
                      setSelectedOffer(null);
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
