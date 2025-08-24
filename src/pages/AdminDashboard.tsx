import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { internshipService } from '@/lib/internshipService';
import { videoNotificationService } from '@/lib/videoNotificationService';
import { 
  Users, 
  BookOpen, 
  MessageSquare, 
  FileText, 
  Briefcase, 
  Newspaper, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Download,
  Upload,
  Activity,
  Calendar,
  DollarSign,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  UserPlus,
  GraduationCap,
  Building,
  Globe,
  BarChart3,
  PieChart,
  LineChart,
  MapPin,
  Search,
  Filter,
  RefreshCw,
  Settings,
  Bell,
  Mail,
  Phone,
  Shield,
  Zap,
  Target,
  Award,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  ExternalLink,
  Video
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  totalCourses: number;
  activeCourses: number;
  totalMessages: number;
  unreadMessages: number;
  totalDocuments: number;
  totalInternships: number;
  activeInternships: number;
  totalNews: number;
  totalRevenue: number;
  monthlyRevenue: number;
  conversionRate: number;
  averageRating: number;
  platformUptime: number;
  pendingApplications: number;
  completedApplications: number;
  totalRegions: number;
  premiumUsers: number;
}

interface RecentActivity {
  id: string;
  type: 'user' | 'course' | 'application' | 'revenue';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
  amount?: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  lastLogin: string;
  avatar: string;
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 15420,
    activeUsers: 8920,
    newUsersThisMonth: 1247,
    totalCourses: 456,
    activeCourses: 389,
    totalMessages: 23456,
    unreadMessages: 1234,
    totalDocuments: 1234,
    totalInternships: 15,
    activeInternships: 12,
    totalNews: 89,
    totalRevenue: 45678900,
    monthlyRevenue: 2345000,
    conversionRate: 23.5,
    averageRating: 4.6,
    platformUptime: 99.8,
    pendingApplications: 234,
    completedApplications: 1567,
    totalRegions: 14,
    premiumUsers: 2340
  });

  // Charger les statistiques des candidatures depuis le service
  useEffect(() => {
    const loadApplicationStats = () => {
      const applicationStats = internshipService.getApplicationStats();
      setStats(prev => ({
        ...prev,
        pendingApplications: applicationStats.pending,
        completedApplications: applicationStats.accepted + applicationStats.rejected
      }));
    };

    loadApplicationStats();
    
    // Recharger toutes les 10 secondes pour les nouvelles candidatures
    const interval = setInterval(loadApplicationStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [clickedAction, setClickedAction] = useState<string | null>(null);

  // Données simulées pour les activités récentes
  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'user',
      title: 'Nouvel utilisateur inscrit',
      description: 'Marie Diop s\'est inscrite sur la plateforme',
      timestamp: '2024-01-15T10:30:00Z',
      status: 'success'
    },
    {
      id: '2',
      type: 'course',
      title: 'Nouveau cours publié',
      description: 'Cours de Mathématiques avancées ajouté',
      timestamp: '2024-01-15T09:15:00Z',
      status: 'info'
    },
    {
      id: '3',
      type: 'application',
      title: 'Candidature reçue',
      description: 'Candidature pour le stage en Pédagogie',
      timestamp: '2024-01-15T08:45:00Z',
      status: 'warning'
    },
    {
      id: '4',
      type: 'revenue',
      title: 'Paiement reçu',
      description: 'Abonnement Premium - 25,000 FCFA',
      timestamp: '2024-01-15T08:30:00Z',
      status: 'success',
      amount: 25000
    }
  ]);

  // Données simulées pour les utilisateurs récents
  const [recentUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Marie Diop',
      email: 'marie.diop@email.com',
      role: 'student',
      status: 'active',
      joinDate: '2024-01-15',
      lastLogin: '2024-01-15T10:30:00Z',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marie'
    },
    {
      id: '2',
      name: 'Amadou Diallo',
      email: 'amadou.diallo@email.com',
      role: 'instructor',
      status: 'active',
      joinDate: '2024-01-14',
      lastLogin: '2024-01-15T09:15:00Z',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amadou'
    },
    {
      id: '3',
      name: 'Fatou Sall',
      email: 'fatou.sall@email.com',
      role: 'student',
      status: 'pending',
      joinDate: '2024-01-14',
      lastLogin: '2024-01-15T08:45:00Z',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fatou'
    }
  ]);

  // Simuler le chargement des données
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [selectedPeriod]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
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
      case 'success': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'error': return 'text-red-600 bg-red-50';
      case 'info': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertCircle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      case 'info': return <Activity className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleExportReport = () => {
    const reportData = {
      stats,
      timestamp: new Date().toISOString(),
      period: selectedPeriod
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `doremi-admin-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Recherche intelligente dans le dashboard admin
  const handleAdminSearch = (term: string) => {
    const t = term.trim().toLowerCase();
    if (!t) return;

    if (/(utilisateur|users?)/.test(t)) {
      navigate('/admin/users');
      return;
    }
    if (/(cours|course|vidéo|video)/.test(t)) {
      navigate('/admin/courses');
      return;
    }
    if (/(stage|internship|candidature|candidatures)/.test(t)) {
      navigate('/admin/internships');
      return;
    }
    if (/(stat|rapport|analytics)/.test(t)) {
      navigate('/admin/stats');
      return;
    }
    if (/(actualité|news|annonce)/.test(t)) {
      navigate('/admin/news');
      return;
    }
    if (/(document|doc|médiathèque|library)/.test(t)) {
      navigate('/admin/documents');
      return;
    }

    // Par défaut: rester ici, basculer sur Activité, filtrer localement
    setActiveTab('activity');
    toast({
      title: 'Recherche appliquée',
      description: `Filtrage pour: "${term}"`,
      duration: 1800,
    });
  };

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAdminSearch(searchTerm);
    }
  };

  // Collections filtrées par texte et type
  const filteredActivities = useMemo(() => {
    const t = searchTerm.trim().toLowerCase();
    return recentActivities.filter((a) => {
      const matchesType =
        selectedFilter === 'all' ||
        (selectedFilter === 'users' && a.type === 'user') ||
        (selectedFilter === 'courses' && a.type === 'course') ||
        (selectedFilter === 'revenue' && a.type === 'revenue') ||
        (selectedFilter === 'applications' && a.type === 'application');
      const matchesText = !t || a.title.toLowerCase().includes(t) || a.description.toLowerCase().includes(t);
      return matchesType && matchesText;
    });
  }, [recentActivities, searchTerm, selectedFilter]);

  const filteredUsers = useMemo(() => {
    const t = searchTerm.trim().toLowerCase();
    return recentUsers.filter((u) => !t || u.name.toLowerCase().includes(t) || u.email.toLowerCase().includes(t));
  }, [recentUsers, searchTerm]);

  const handleQuickAction = (action: string) => {
    setClickedAction(action);
    
    // Effet visuel de clic
    setTimeout(() => {
      setClickedAction(null);
    }, 200);

    // Messages de notification selon l'action
    const actionMessages = {
      users: {
        title: 'Gestion des Utilisateurs',
        description: 'Redirection vers la page de gestion des utilisateurs...'
      },
      courses: {
        title: 'Gestion des Cours',
        description: 'Redirection vers la page de gestion des cours...'
      },
      stages: {
        title: 'Gestion des Stages',
        description: 'Redirection vers la page de gestion des stages...'
      },
      reports: {
        title: 'Statistiques et Rapports',
        description: 'Redirection vers la page des statistiques...'
      }
    };

    const message = actionMessages[action as keyof typeof actionMessages];
    
    if (message) {
      toast({
        title: message.title,
        description: message.description,
        duration: 2000,
      });
    }

    switch (action) {
      case 'users':
        navigate('/admin/users');
        break;
      case 'courses':
        navigate('/admin/courses');
        break;
      case 'stages':
        navigate('/admin/internships');
        break;
      case 'reports':
        navigate('/admin/stats');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Administrateur</h1>
              <p className="text-gray-600 mt-2">Vue d'ensemble de la plateforme DOREMI</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="w-4 h-4 mr-1" />
                Système Opérationnel
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportReport}>
                <Download className="w-4 h-4 mr-2" />
                Exporter Rapport
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filtres et Recherche */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher dans le dashboard..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={onSearchKeyDown}
                className="pl-10"
              />
            </div>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Aujourd'hui</SelectItem>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
                <SelectItem value="quarter">Ce trimestre</SelectItem>
                <SelectItem value="year">Cette année</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filtre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tout</SelectItem>
                <SelectItem value="users">Utilisateurs</SelectItem>
                <SelectItem value="courses">Cours</SelectItem>
                <SelectItem value="revenue">Revenus</SelectItem>
                <SelectItem value="applications">Candidatures</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Contenu Principal */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="users">Utilisateurs</TabsTrigger>
              <TabsTrigger value="activity">Activité</TabsTrigger>
            </TabsList>

            {/* Vue d'ensemble */}
            <TabsContent value="overview" className="space-y-6">
              {/* Statistiques Principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Utilisateurs Totaux</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(stats.totalUsers)}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <TrendingUpIcon className="w-3 h-3 mr-1 text-green-600" />
                      +{formatNumber(stats.newUsersThisMonth)} ce mois
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenus Mensuels</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(stats.monthlyRevenue)}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <TrendingUpIcon className="w-3 h-3 mr-1 text-green-600" />
                      +12.5% vs mois dernier
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cours Actifs</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(stats.activeCourses)}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <TrendingUpIcon className="w-3 h-3 mr-1 text-green-600" />
                      sur {formatNumber(stats.totalCourses)} cours
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Taux de Conversion</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.conversionRate}%</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <TrendingUpIcon className="w-3 h-3 mr-1 text-green-600" />
                      +2.1% vs mois dernier
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Graphiques et Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Activité Utilisateurs
                    </CardTitle>
                    <CardDescription>Statistiques d'engagement des utilisateurs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{formatNumber(stats.activeUsers)}</div>
                        <p className="text-sm text-gray-600">Utilisateurs Actifs</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{formatNumber(stats.premiumUsers)}</div>
                        <p className="text-sm text-gray-600">Utilisateurs Premium</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{formatNumber(stats.newUsersThisMonth)}</div>
                        <p className="text-sm text-gray-600">Nouveaux Utilisateurs</p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{stats.averageRating}/5</div>
                        <p className="text-sm text-gray-600">Note Moyenne</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Performance
                    </CardTitle>
                    <CardDescription>Métriques de performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Uptime</span>
                        <span className="font-semibold text-green-600">{stats.platformUptime}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Temps de Réponse</span>
                        <span className="font-semibold">245ms</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Erreurs 24h</span>
                        <span className="font-semibold text-red-600">12</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Sessions Actives</span>
                        <span className="font-semibold">{formatNumber(stats.activeUsers)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Actions Rapides */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions Rapides</CardTitle>
                  <CardDescription>Gestion rapide de la plateforme</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button 
                      variant="outline" 
                      className={`h-20 flex flex-col items-center justify-center transition-all duration-200 ${
                        clickedAction === 'users' ? 'bg-blue-50 border-blue-300 scale-95' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleQuickAction('users')}
                    >
                      <UserPlus className={`w-6 h-6 mb-2 ${clickedAction === 'users' ? 'text-blue-600' : ''}`} />
                      <span className="text-sm">Gérer Utilisateurs</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className={`h-20 flex flex-col items-center justify-center transition-all duration-200 ${
                        clickedAction === 'courses' ? 'bg-green-50 border-green-300 scale-95' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleQuickAction('courses')}
                    >
                      <BookOpen className={`w-6 h-6 mb-2 ${clickedAction === 'courses' ? 'text-green-600' : ''}`} />
                      <span className="text-sm">Gérer Cours</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className={`h-20 flex flex-col items-center justify-center transition-all duration-200 ${
                        clickedAction === 'stages' ? 'bg-purple-50 border-purple-300 scale-95' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleQuickAction('stages')}
                    >
                      <Briefcase className={`w-6 h-6 mb-2 ${clickedAction === 'stages' ? 'text-purple-600' : ''}`} />
                      <span className="text-sm">Gérer Stages</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className={`h-20 flex flex-col items-center justify-center transition-all duration-200 ${
                        clickedAction === 'reports' ? 'bg-orange-50 border-orange-300 scale-95' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleQuickAction('reports')}
                    >
                      <BarChart3 className={`w-6 h-6 mb-2 ${clickedAction === 'reports' ? 'text-orange-600' : ''}`} />
                      <span className="text-sm">Voir Rapports</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5" />
                      Répartition des Utilisateurs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">Étudiants</span>
                        </div>
                        <span className="font-semibold">78%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium">Instructeurs</span>
                        </div>
                        <span className="font-semibold">15%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium">Administrateurs</span>
                        </div>
                        <span className="font-semibold">7%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="w-5 h-5" />
                      Évolution des Revenus
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Janvier</span>
                        <span className="font-semibold">{formatCurrency(1800000)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Février</span>
                        <span className="font-semibold">{formatCurrency(2100000)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Mars</span>
                        <span className="font-semibold">{formatCurrency(2345000)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Avril</span>
                        <span className="font-semibold text-green-600">{formatCurrency(2800000)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Utilisateurs */}
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Utilisateurs Récents</CardTitle>
                  <CardDescription>Derniers utilisateurs inscrits sur la plateforme</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <img 
                            src={user.avatar} 
                            alt={user.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <h4 className="font-medium">{user.name}</h4>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                            {user.status}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activité */}
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activité Récente</CardTitle>
                  <CardDescription>Dernières activités sur la plateforme</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-4 border rounded-lg">
                        <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                          {getStatusIcon(activity.status)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{activity.title}</h4>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(activity.timestamp)}
                          </p>
                        </div>
                        {activity.amount && (
                          <div className="text-right">
                            <span className="font-semibold text-green-600">
                              {formatCurrency(activity.amount)}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Notifications Vidéos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-blue-600" />
                    Vidéos Publiées par les Formateurs
                  </CardTitle>
                  <CardDescription>Suivi des nouvelles vidéos publiées</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(() => {
                      const videoNotifications = videoNotificationService.getNotifications();
                      const recentVideos = videoNotificationService.getVideoLibrary().slice(0, 5);
                      
                      if (recentVideos.length === 0) {
                        return (
                          <div className="text-center py-8">
                            <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">Aucune vidéo publiée récemment</p>
                          </div>
                        );
                      }

                      return recentVideos.map((video) => (
                        <div key={video.id} className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="p-2 rounded-full bg-blue-100">
                            <Video className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{video.title}</h4>
                            <p className="text-sm text-gray-600">
                              Par {video.instructorName} • {video.views} vue{video.views > 1 ? 's' : ''}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Publiée le {new Date(video.publishedAt).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {video.views} vue{video.views > 1 ? 's' : ''}
                            </Badge>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => window.open(video.fileUrl, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
