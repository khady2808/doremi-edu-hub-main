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
  User,
  Mail,
  Calendar,
  Clock,
  Eye,
  Heart,
  Video,
  BookOpen,
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
  Crown,
  MessageSquare,
  Share2,
  Settings,
  Plus,
  MapPin,
  Phone,
  GraduationCap,
  Building,
  Globe,
  Activity,
  Zap,
  Target,
  Award,
  Shield,
  Bell,
  CreditCard,
  Play,
  History,
  Bookmark,
  FileText
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'student' | 'instructor' | 'admin';
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  lastLogin: string;
  location: string;
  phone?: string;
  subscription: Subscription;
  courseProgress: CourseProgress[];
  liveSessions: LiveSession[];
  searchHistory: SearchHistory[];
  loginHistory: LoginHistory[];
  activityStats: ActivityStats;
}

interface Subscription {
  type: 'free' | 'premium' | 'enterprise';
  status: 'active' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  price: number;
  features: string[];
}

interface CourseProgress {
  courseId: string;
  courseTitle: string;
  instructor: string;
  progress: number;
  lastWatched: string;
  totalWatchTime: string;
  completionDate?: string;
  certificate?: boolean;
}

interface LiveSession {
  sessionId: string;
  title: string;
  instructor: string;
  date: string;
  duration: string;
  attendance: boolean;
  participation: number;
}

interface SearchHistory {
  id: string;
  query: string;
  category: string;
  timestamp: string;
  results: number;
}

interface LoginHistory {
  id: string;
  timestamp: string;
  device: string;
  location: string;
  ipAddress: string;
}

interface ActivityStats {
  totalCourses: number;
  completedCourses: number;
  totalWatchTime: string;
  totalLiveSessions: number;
  totalSearches: number;
  totalLogins: number;
  averageSessionTime: string;
  favoriteCategories: string[];
}

export const AdminUsers: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Données simulées pour les utilisateurs
  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'Marie Diop',
      email: 'marie.diop@email.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marie',
      role: 'student',
      status: 'active',
      joinDate: '2024-01-15',
      lastLogin: '2024-01-20T15:30:00Z',
      location: 'Dakar, Sénégal',
      phone: '+221 77 123 4567',
      subscription: {
        type: 'premium',
        status: 'active',
        startDate: '2024-01-15',
        endDate: '2024-07-15',
        price: 25000,
        features: ['Cours illimités', 'Sessions live', 'Certificats', 'Support prioritaire']
      },
      courseProgress: [
        {
          courseId: '1',
          courseTitle: 'Introduction aux Mathématiques Avancées',
          instructor: 'Dr. Amadou Diallo',
          progress: 95,
          lastWatched: '2024-01-20T15:30:00Z',
          totalWatchTime: '2h 15min',
          completionDate: '2024-01-20',
          certificate: true
        },
        {
          courseId: '2',
          courseTitle: 'Physique Quantique pour Débutants',
          instructor: 'Prof. Fatou Ndiaye',
          progress: 78,
          lastWatched: '2024-01-18T10:15:00Z',
          totalWatchTime: '1h 45min'
        }
      ],
      liveSessions: [
        {
          sessionId: 'ls1',
          title: 'Session Live: Chimie Organique',
          instructor: 'Dr. Mamadou Fall',
          date: '2024-01-05T14:00:00Z',
          duration: '3h 00min',
          attendance: true,
          participation: 85
        }
      ],
      searchHistory: [
        {
          id: 's1',
          query: 'mathématiques avancées',
          category: 'Cours',
          timestamp: '2024-01-20T14:30:00Z',
          results: 12
        },
        {
          id: 's2',
          query: 'physique quantique',
          category: 'Cours',
          timestamp: '2024-01-18T09:15:00Z',
          results: 8
        }
      ],
      loginHistory: [
        {
          id: 'l1',
          timestamp: '2024-01-20T15:30:00Z',
          device: 'Chrome - Windows 11',
          location: 'Dakar, Sénégal',
          ipAddress: '192.168.1.100'
        },
        {
          id: 'l2',
          timestamp: '2024-01-18T10:15:00Z',
          device: 'Safari - iPhone',
          location: 'Dakar, Sénégal',
          ipAddress: '192.168.1.100'
        }
      ],
      activityStats: {
        totalCourses: 2,
        completedCourses: 1,
        totalWatchTime: '4h 00min',
        totalLiveSessions: 1,
        totalSearches: 2,
        totalLogins: 2,
        averageSessionTime: '45min',
        favoriteCategories: ['Mathématiques', 'Physique']
      }
    },
    {
      id: '2',
      name: 'Ousmane Ba',
      email: 'ousmane.ba@email.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ousmane',
      role: 'student',
      status: 'active',
      joinDate: '2024-01-10',
      lastLogin: '2024-01-19T12:20:00Z',
      location: 'Thiès, Sénégal',
      phone: '+221 76 987 6543',
      subscription: {
        type: 'free',
        status: 'active',
        startDate: '2024-01-10',
        endDate: '2024-04-10',
        price: 0,
        features: ['Cours limités', 'Accès de base']
      },
      courseProgress: [
        {
          courseId: '2',
          courseTitle: 'Physique Quantique pour Débutants',
          instructor: 'Prof. Fatou Ndiaye',
          progress: 100,
          lastWatched: '2024-01-12T14:20:00Z',
          totalWatchTime: '1h 30min',
          completionDate: '2024-01-12',
          certificate: true
        }
      ],
      liveSessions: [],
      searchHistory: [
        {
          id: 's3',
          query: 'physique quantique',
          category: 'Cours',
          timestamp: '2024-01-12T13:20:00Z',
          results: 8
        }
      ],
      loginHistory: [
        {
          id: 'l3',
          timestamp: '2024-01-19T12:20:00Z',
          device: 'Firefox - Windows 10',
          location: 'Thiès, Sénégal',
          ipAddress: '192.168.1.200'
        }
      ],
      activityStats: {
        totalCourses: 1,
        completedCourses: 1,
        totalWatchTime: '1h 30min',
        totalLiveSessions: 0,
        totalSearches: 1,
        totalLogins: 1,
        averageSessionTime: '30min',
        favoriteCategories: ['Physique']
      }
    },
    {
      id: '3',
      name: 'Dr. Amadou Diallo',
      email: 'amadou.diallo@doremi.fr',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amadou',
      role: 'instructor',
      status: 'active',
      joinDate: '2023-12-01',
      lastLogin: '2024-01-20T16:45:00Z',
      location: 'Dakar, Sénégal',
      phone: '+221 77 555 1234',
      subscription: {
        type: 'enterprise',
        status: 'active',
        startDate: '2023-12-01',
        endDate: '2024-12-01',
        price: 50000,
        features: ['Tous les cours', 'Création de cours', 'Analytics avancés', 'Support 24/7']
      },
      courseProgress: [],
      liveSessions: [],
      searchHistory: [
        {
          id: 's4',
          query: 'outils création cours',
          category: 'Ressources',
          timestamp: '2024-01-20T16:30:00Z',
          results: 15
        }
      ],
      loginHistory: [
        {
          id: 'l4',
          timestamp: '2024-01-20T16:45:00Z',
          device: 'Chrome - MacOS',
          location: 'Dakar, Sénégal',
          ipAddress: '192.168.1.300'
        }
      ],
      activityStats: {
        totalCourses: 0,
        completedCourses: 0,
        totalWatchTime: '0min',
        totalLiveSessions: 0,
        totalSearches: 1,
        totalLogins: 1,
        averageSessionTime: '60min',
        favoriteCategories: ['Ressources']
      }
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
      case 'active': return 'text-green-600 bg-green-50';
      case 'inactive': return 'text-red-600 bg-red-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-purple-600 bg-purple-50';
      case 'instructor': return 'text-blue-600 bg-blue-50';
      case 'student': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSubscriptionColor = (type: string) => {
    switch (type) {
      case 'enterprise': return 'text-purple-600 bg-purple-50';
      case 'premium': return 'text-orange-600 bg-orange-50';
      case 'free': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || user.status === selectedFilter;
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    
    return matchesSearch && matchesFilter && matchesRole;
  });

  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === 'active').length;
  const premiumUsers = users.filter(user => user.subscription.type === 'premium' || user.subscription.type === 'enterprise').length;
  const instructors = users.filter(user => user.role === 'instructor').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
              <p className="text-gray-600 mt-2">Vue globale de tous les utilisateurs de DOREMI</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Users className="w-4 h-4 mr-1" />
                {totalUsers} Utilisateurs
              </Badge>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un Utilisateur
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
                <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(totalUsers)}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                  +15% ce mois
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(activeUsers)}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                  {((activeUsers / totalUsers) * 100).toFixed(1)}% du total
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Abonnements Premium</CardTitle>
                <Crown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(premiumUsers)}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                  +8.7% ce mois
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Instructeurs</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(instructors)}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Plus className="w-3 h-3 mr-1 text-blue-600" />
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
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actifs</SelectItem>
                <SelectItem value="inactive">Inactifs</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="student">Étudiants</SelectItem>
                <SelectItem value="instructor">Instructeurs</SelectItem>
                <SelectItem value="admin">Administrateurs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Liste des Utilisateurs */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <Card 
                key={user.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleUserClick(user)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <CardDescription>{user.email}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Rôle:</span>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role === 'student' ? 'Étudiant' : 
                         user.role === 'instructor' ? 'Instructeur' : 'Administrateur'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Statut:</span>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status === 'active' ? 'Actif' : 
                         user.status === 'inactive' ? 'Inactif' : 'En attente'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Abonnement:</span>
                      <Badge className={getSubscriptionColor(user.subscription.type)}>
                        {user.subscription.type === 'free' ? 'Gratuit' : 
                         user.subscription.type === 'premium' ? 'Premium' : 'Entreprise'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Dernière connexion:</span>
                      <span>{formatDate(user.lastLogin)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Localisation:</span>
                      <span>{user.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Modal pour les détails de l'utilisateur */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Détails de l'Utilisateur - {selectedUser?.name}
            </DialogTitle>
            <DialogDescription>
              Informations complètes sur l'utilisateur et son activité
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                  <TabsTrigger value="subscription">Abonnement</TabsTrigger>
                  <TabsTrigger value="courses">Cours</TabsTrigger>
                  <TabsTrigger value="activity">Activité</TabsTrigger>
                  <TabsTrigger value="history">Historique</TabsTrigger>
                </TabsList>

                {/* Vue d'ensemble */}
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Informations personnelles */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <User className="w-5 h-5" />
                          Informations Personnelles
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 mb-4">
                          <img
                            src={selectedUser.avatar}
                            alt={selectedUser.name}
                            className="w-20 h-20 rounded-full"
                          />
                          <div>
                            <h4 className="font-semibold text-lg">{selectedUser.name}</h4>
                            <p className="text-gray-600">{selectedUser.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={getRoleColor(selectedUser.role)}>
                                {selectedUser.role === 'student' ? 'Étudiant' : 
                                 selectedUser.role === 'instructor' ? 'Instructeur' : 'Administrateur'}
                              </Badge>
                              <Badge className={getStatusColor(selectedUser.status)}>
                                {selectedUser.status === 'active' ? 'Actif' : 
                                 selectedUser.status === 'inactive' ? 'Inactif' : 'En attente'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Téléphone:</span>
                            <span className="font-medium">{selectedUser.phone || 'Non renseigné'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Localisation:</span>
                            <span className="font-medium">{selectedUser.location}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Date d'inscription:</span>
                            <span className="font-medium">{formatDate(selectedUser.joinDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Dernière connexion:</span>
                            <span className="font-medium">{formatDateTime(selectedUser.lastLogin)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Statistiques d'activité */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="w-5 h-5" />
                          Statistiques d'Activité
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-lg font-bold text-blue-600">
                              {selectedUser.activityStats.totalCourses}
                            </div>
                            <div className="text-sm text-gray-600">Cours Suivis</div>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-lg font-bold text-green-600">
                              {selectedUser.activityStats.completedCourses}
                            </div>
                            <div className="text-sm text-gray-600">Cours Terminés</div>
                          </div>
                          <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <div className="text-lg font-bold text-purple-600">
                              {selectedUser.activityStats.totalLiveSessions}
                            </div>
                            <div className="text-sm text-gray-600">Sessions Live</div>
                          </div>
                          <div className="text-center p-3 bg-orange-50 rounded-lg">
                            <div className="text-lg font-bold text-orange-600">
                              {selectedUser.activityStats.totalLogins}
                            </div>
                            <div className="text-sm text-gray-600">Connexions</div>
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Temps de visionnage total:</span>
                            <span className="font-medium">{selectedUser.activityStats.totalWatchTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Temps de session moyen:</span>
                            <span className="font-medium">{selectedUser.activityStats.averageSessionTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Recherches effectuées:</span>
                            <span className="font-medium">{selectedUser.activityStats.totalSearches}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Abonnement */}
                <TabsContent value="subscription" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Crown className="w-5 h-5" />
                        Détails de l'Abonnement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">Informations de l'Abonnement</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Type:</span>
                              <Badge className={getSubscriptionColor(selectedUser.subscription.type)}>
                                {selectedUser.subscription.type === 'free' ? 'Gratuit' : 
                                 selectedUser.subscription.type === 'premium' ? 'Premium' : 'Entreprise'}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Statut:</span>
                              <Badge className={getStatusColor(selectedUser.subscription.status)}>
                                {selectedUser.subscription.status === 'active' ? 'Actif' : 
                                 selectedUser.subscription.status === 'expired' ? 'Expiré' : 'Annulé'}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Prix:</span>
                              <span className="font-medium">
                                {selectedUser.subscription.price === 0 ? 'Gratuit' : 
                                 `${formatNumber(selectedUser.subscription.price)} FCFA`}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Date de début:</span>
                              <span className="font-medium">{formatDate(selectedUser.subscription.startDate)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Date de fin:</span>
                              <span className="font-medium">{formatDate(selectedUser.subscription.endDate)}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3">Fonctionnalités Incluses</h4>
                          <div className="space-y-2">
                            {selectedUser.subscription.features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Cours */}
                <TabsContent value="courses" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        Progression des Cours ({selectedUser.courseProgress.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedUser.courseProgress.map((course, index) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold">{course.courseTitle}</h4>
                              <Badge variant={course.progress === 100 ? 'default' : 'secondary'}>
                                {course.progress}%
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Instructeur:</span>
                                <p className="font-medium">{course.instructor}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Temps de visionnage:</span>
                                <p className="font-medium">{course.totalWatchTime}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Dernière vue:</span>
                                <p className="font-medium">{formatDateTime(course.lastWatched)}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Statut:</span>
                                <p className="font-medium">
                                  {course.progress === 100 ? 'Terminé' : 'En cours'}
                                  {course.certificate && course.progress === 100 && ' (Certifié)'}
                                </p>
                              </div>
                            </div>
                            {course.completionDate && (
                              <div className="mt-3 pt-3 border-t">
                                <span className="text-sm text-gray-600">
                                  Terminé le: {formatDate(course.completionDate)}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Activité */}
                <TabsContent value="activity" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Sessions Live */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Video className="w-5 h-5" />
                          Sessions Live ({selectedUser.liveSessions.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedUser.liveSessions.map((session, index) => (
                            <div key={index} className="p-3 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium">{session.title}</h5>
                                <Badge variant={session.attendance ? 'default' : 'secondary'}>
                                  {session.attendance ? 'Présent' : 'Absent'}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="text-gray-600">Instructeur:</span>
                                  <p className="font-medium">{session.instructor}</p>
                                </div>
                                <div>
                                  <span className="text-gray-600">Date:</span>
                                  <p className="font-medium">{formatDateTime(session.date)}</p>
                                </div>
                                <div>
                                  <span className="text-gray-600">Durée:</span>
                                  <p className="font-medium">{session.duration}</p>
                                </div>
                                <div>
                                  <span className="text-gray-600">Participation:</span>
                                  <p className="font-medium">{session.participation}%</p>
                                </div>
                              </div>
                            </div>
                          ))}
                          {selectedUser.liveSessions.length === 0 && (
                            <p className="text-gray-500 text-center py-4">
                              Aucune session live suivie
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Catégories préférées */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Heart className="w-5 h-5" />
                          Catégories Préférées
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {selectedUser.activityStats.favoriteCategories.map((category, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-blue-600" />
                              <span className="text-sm">{category}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Historique */}
                <TabsContent value="history" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Historique des recherches */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Search className="w-5 h-5" />
                          Historique des Recherches ({selectedUser.searchHistory.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedUser.searchHistory.map((search, index) => (
                            <div key={index} className="p-3 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium">{search.query}</h5>
                                <Badge variant="outline">{search.results} résultats</Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="text-gray-600">Catégorie:</span>
                                  <p className="font-medium">{search.category}</p>
                                </div>
                                <div>
                                  <span className="text-gray-600">Date:</span>
                                  <p className="font-medium">{formatDateTime(search.timestamp)}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Historique des connexions */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="w-5 h-5" />
                          Historique des Connexions ({selectedUser.loginHistory.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedUser.loginHistory.map((login, index) => (
                            <div key={index} className="p-3 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium">{login.device}</h5>
                                <Badge variant="outline">{login.location}</Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="text-gray-600">Date:</span>
                                  <p className="font-medium">{formatDateTime(login.timestamp)}</p>
                                </div>
                                <div>
                                  <span className="text-gray-600">IP:</span>
                                  <p className="font-medium">{login.ipAddress}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;






