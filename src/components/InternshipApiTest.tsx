import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  TrendingUp
} from 'lucide-react';
import { internshipApiService, type Internship, type SearchParams } from '@/services/internshipApi';

interface ConnectivityTest {
  success: boolean;
  message: string;
  data?: any;
}

interface ApiStats {
  total: number;
  active: number;
  expired: number;
  closed: number;
  byType: Record<string, number>;
  byLocation: Record<string, number>;
}

export const InternshipApiTest: React.FC = () => {
  const { toast } = useToast();
  const [connectivityTest, setConnectivityTest] = useState<ConnectivityTest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [stats, setStats] = useState<ApiStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  // Test de connectivité au chargement
  useEffect(() => {
    testConnectivity();
  }, []);

  // Test de connectivité
  const testConnectivity = async () => {
    setIsLoading(true);
    try {
      console.log('🧪 Test de connectivité API des stages...');
      const result = await internshipApiService.testConnectivity();
      setConnectivityTest(result);
      
      if (result.success) {
        toast({
          title: "Connexion réussie",
          description: "L'API des stages est accessible",
        });
        // Charger les données si la connexion est réussie
        await loadInternships();
        await loadStats();
      } else {
        toast({
          title: "Erreur de connexion",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Erreur lors du test de connectivité:', error);
      setConnectivityTest({
        success: false,
        message: `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      });
      toast({
        title: "Erreur",
        description: "Impossible de se connecter à l'API",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les stages
  const loadInternships = async () => {
    try {
      const searchParams: SearchParams = {};
      
      if (searchTerm) searchParams.search = searchTerm;
      if (selectedType) searchParams.type = selectedType;
      if (selectedLocation) searchParams.location = selectedLocation;

      console.log('📦 Chargement des stages avec paramètres:', searchParams);
      const data = await internshipApiService.getAllInternships(searchParams);
      setInternships(data);
      
      toast({
        title: "Stages chargés",
        description: `${data.length} stage(s) trouvé(s)`,
      });
    } catch (error) {
      console.error('❌ Erreur lors du chargement des stages:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les stages",
        variant: "destructive",
      });
    }
  };

  // Charger les statistiques
  const loadStats = async () => {
    try {
      const data = await internshipApiService.getInternshipStats();
      setStats(data);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des statistiques:', error);
    }
  };

  // Rechercher des stages
  const handleSearch = () => {
    loadInternships();
  };

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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Test API Stages</h1>
              <p className="text-lg text-gray-600">Test de connectivité et intégration avec l'API Laravel</p>
            </div>
            <Button 
              onClick={testConnectivity}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Tester la connexion
            </Button>
          </div>
        </div>

        {/* Test de connectivité */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Test de Connectivité
            </CardTitle>
            <CardDescription>
              Vérification de la connexion avec l'API des stages
            </CardDescription>
          </CardHeader>
          <CardContent>
            {connectivityTest ? (
              <div className="flex items-center gap-4">
                {connectivityTest.success ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
                <div>
                  <p className={`font-medium ${connectivityTest.success ? 'text-green-700' : 'text-red-700'}`}>
                    {connectivityTest.message}
                  </p>
                  {connectivityTest.data && (
                    <p className="text-sm text-gray-600 mt-1">
                      Données reçues: {Array.isArray(connectivityTest.data) 
                        ? `${connectivityTest.data.length} éléments`
                        : 'Objet reçu'
                      }
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Clock className="w-6 h-6 text-gray-400" />
                <p className="text-gray-600">Test non effectué</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistiques */}
        {stats && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Statistiques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                  <div className="text-sm text-gray-600">Actifs</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
                  <div className="text-sm text-gray-600">Expirés</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">{stats.closed}</div>
                  <div className="text-sm text-gray-600">Fermés</div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Par type</h4>
                  <div className="space-y-2">
                    {Object.entries(stats.byType).map(([type, count]) => (
                      <div key={type} className="flex justify-between items-center">
                        <span className="capitalize">{type}</span>
                        <Badge className={getTypeColor(type)}>{count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Par localisation</h4>
                  <div className="space-y-2">
                    {Object.entries(stats.byLocation).map(([location, count]) => (
                      <div key={location} className="flex justify-between items-center">
                        <span>{location}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recherche */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Recherche et Filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recherche
                </label>
                <Input
                  placeholder="Rechercher un stage..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">Tous les types</option>
                  <option value="stage">Stage</option>
                  <option value="alternance">Alternance</option>
                  <option value="emploi">Emploi</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localisation
                </label>
                <Input
                  placeholder="Localisation..."
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                />
              </div>
            </div>
            <Button 
              onClick={handleSearch}
              className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Search className="w-4 h-4 mr-2" />
              Rechercher
            </Button>
          </CardContent>
        </Card>

        {/* Liste des stages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Stages ({internships.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {internships.length === 0 ? (
              <div className="text-center py-8">
                <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun stage trouvé</p>
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
                          <Globe className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Expire le {formatDate(internship.applicationDeadline)}
                          </span>
                        </div>

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
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InternshipApiTest;
