import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Search, 
  Database, 
  Activity,
  Globe,
  Clock,
  Users,
  MapPin,
  Building,
  Briefcase,
  TrendingUp,
  Star,
  Calendar,
  DollarSign,
  ExternalLink
} from 'lucide-react';
import { internshipApiService, type Internship } from '@/services/internshipApi';

export const InternshipDemo: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [connectivityStatus, setConnectivityStatus] = useState<'unknown' | 'success' | 'error'>('unknown');

  // Test de connectivité et chargement des données
  const loadData = async () => {
    setIsLoading(true);
    try {
      console.log('🚀 Démonstration - Test de connectivité API...');
      
      // Test de connectivité
      const connectivityTest = await internshipApiService.testConnectivity();
      setConnectivityStatus(connectivityTest.success ? 'success' : 'error');
      
      if (connectivityTest.success) {
        // Charger les stages
        const internshipsData = await internshipApiService.getAllInternships();
        setInternships(internshipsData);
        
        // Charger les statistiques
        const statsData = await internshipApiService.getInternshipStats();
        setStats(statsData);
        
        toast({
          title: "🎉 Intégration réussie !",
          description: `${internshipsData.length} stage(s) chargé(s) depuis l'API Laravel`,
        });
      } else {
        toast({
          title: "⚠️ Problème de connexion",
          description: connectivityTest.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement:', error);
      setConnectivityStatus('error');
      toast({
        title: "❌ Erreur",
        description: "Impossible de charger les données depuis l'API",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    loadData();
  }, []);

  // Formater la date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'Date invalide';
    }
  };

  // Obtenir la couleur du badge de statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  // Obtenir la couleur du badge de type
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'stage': return 'bg-blue-100 text-blue-800';
      case 'alternance': return 'bg-purple-100 text-purple-800';
      case 'emploi': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header avec statut de connectivité */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                🎯 Démonstration API Stages
              </h1>
              <p className="text-lg text-gray-600">
                Intégration complète avec l'API Laravel des stages
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Statut de connectivité */}
              <div className="flex items-center gap-2">
                {connectivityStatus === 'success' && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-700 font-medium">API Connectée</span>
                  </div>
                )}
                {connectivityStatus === 'error' && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-red-100 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-700 font-medium">Erreur API</span>
                  </div>
                )}
                {connectivityStatus === 'unknown' && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                    <Activity className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700 font-medium">Test en cours...</span>
                  </div>
                )}
              </div>
              
              <Button 
                onClick={loadData}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                {isLoading ? 'Chargement...' : 'Actualiser'}
              </Button>
            </div>
          </div>
        </div>

        {/* Informations sur l'API */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Informations API
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">API Stages:</span>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">http://localhost:8000/api/internships</code>
              </div>
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">Documentation:</span>
                <a 
                  href="http://localhost:8000/api/documentation" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Swagger UI
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques */}
        {stats && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Statistiques des Stages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                  <div className="text-sm text-gray-600">Total Stages</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                  <div className="text-sm text-gray-600">Actifs</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
                  <div className="text-sm text-gray-600">Expirés</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">{stats.closed}</div>
                  <div className="text-sm text-gray-600">Fermés</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Liste des stages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Stages Chargés depuis l'API ({internships.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {internships.length === 0 ? (
              <div className="text-center py-8">
                <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {isLoading ? 'Chargement des stages...' : 'Aucun stage trouvé'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {internships.map((internship) => (
                  <Card key={internship.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <img
                          src={internship.logo}
                          alt={internship.company}
                          className="w-12 h-12 rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg leading-tight mb-1 text-gray-900">
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
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{internship.location}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{internship.duration}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Expire le {formatDate(internship.applicationDeadline)}
                          </span>
                        </div>

                        {internship.salary && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-green-600 font-medium">{internship.salary}</span>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                          <Badge className={getStatusColor(internship.status)}>
                            {internship.status}
                          </Badge>
                          <Badge className={getTypeColor(internship.type)}>
                            {internship.type}
                          </Badge>
                          {internship.remote && (
                            <Badge variant="outline">Télétravail</Badge>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-3">
                          {internship.description}
                        </p>

                        {internship.requirements.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Exigences:</p>
                            <div className="flex flex-wrap gap-1">
                              {internship.requirements.slice(0, 3).map((req, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {req}
                                </Badge>
                              ))}
                              {internship.requirements.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{internship.requirements.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {internship.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm text-gray-600">{internship.rating}/5</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Message de succès */}
        {connectivityStatus === 'success' && internships.length > 0 && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-700 font-medium">
                🎉 Intégration API réussie ! Les stages sont chargés depuis votre API Laravel.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipDemo;
