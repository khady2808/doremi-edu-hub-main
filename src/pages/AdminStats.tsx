import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  X,
  Maximize2,
  BarChart,
  PieChart as PieChartIcon
} from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart as ReAreaChart, Area, XAxis, YAxis, CartesianGrid, PieChart as RePieChart, Pie, Cell, Legend, Sector } from 'recharts';

interface StatsData {
  period: string;
  users: number;
  courses: number;
  revenue: number;
  applications: number;
  growth: number;
}

interface RegionData {
  name: string;
  users: number;
  percentage: number;
  growth: number;
}

interface DetailedData {
  day: string;
  users: number;
  revenue: number;
  courses: number;
  applications: number;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
  }[];
}

export const AdminStats: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailMetric, setDetailMetric] = useState<'users' | 'revenue' | 'courses' | 'applications'>('users');
  const pieColors = ['#16a34a', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];
  const [activePieIndex, setActivePieIndex] = useState(0);
  const [autoRotatePie, setAutoRotatePie] = useState(true);

  const getRevenueBreakdownForMonth = (month: string) => {
    // Répartition simulée par source de revenus pour le mois sélectionné
    const base = statsData.find((s) => s.period === month)?.revenue || 0;
    // Répartition fixe pour démo dynamique
    const parts = [0.42, 0.28, 0.15, 0.10, 0.05]; // Cours, Premium, Documents, Stages, Autres
    const labels = ['Cours', 'Premium', 'Documents', 'Stages', 'Autres'];
    return parts.map((p, i) => ({ name: labels[i], value: Math.round(base * p) }));
  };

  useEffect(() => {
    if (!isModalOpen || !selectedMonth || !autoRotatePie) return;
    const id = setInterval(() => {
      const data = getRevenueBreakdownForMonth(selectedMonth);
      setActivePieIndex((prev) => (prev + 1) % data.length);
    }, 1200);
    return () => clearInterval(id);
  }, [isModalOpen, selectedMonth, autoRotatePie]);

  // Données simulées pour les statistiques
  const [statsData] = useState<StatsData[]>([
    { period: 'Janvier', users: 12000, courses: 320, revenue: 1800000, applications: 156, growth: 12.5 },
    { period: 'Février', users: 13500, courses: 380, revenue: 2100000, applications: 189, growth: 15.2 },
    { period: 'Mars', users: 14200, courses: 420, revenue: 2345000, applications: 234, growth: 8.7 },
    { period: 'Avril', users: 15420, courses: 456, revenue: 2800000, applications: 289, growth: 18.9 }
  ]);

  // Données détaillées pour chaque mois
  const [detailedData] = useState<Record<string, DetailedData[]>>({
    'Janvier': [
      { day: '1', users: 11500, revenue: 165000, courses: 305, applications: 12 },
      { day: '5', users: 11800, revenue: 172000, courses: 312, applications: 18 },
      { day: '10', users: 12100, revenue: 178000, courses: 318, applications: 25 },
      { day: '15', users: 12400, revenue: 182000, courses: 325, applications: 32 },
      { day: '20', users: 12700, revenue: 188000, courses: 332, applications: 38 },
      { day: '25', users: 13000, revenue: 195000, courses: 338, applications: 45 },
      { day: '31', users: 12000, revenue: 180000, courses: 320, applications: 156 }
    ],
    'Février': [
      { day: '1', users: 13000, revenue: 190000, courses: 365, applications: 15 },
      { day: '5', users: 13200, revenue: 195000, courses: 370, applications: 22 },
      { day: '10', users: 13400, revenue: 200000, courses: 375, applications: 28 },
      { day: '15', users: 13600, revenue: 205000, courses: 380, applications: 35 },
      { day: '20', users: 13800, revenue: 210000, courses: 385, applications: 42 },
      { day: '25', users: 14000, revenue: 215000, courses: 390, applications: 48 },
      { day: '28', users: 13500, revenue: 210000, courses: 380, applications: 189 }
    ],
    'Mars': [
      { day: '1', users: 14000, revenue: 220000, courses: 400, applications: 20 },
      { day: '5', users: 14100, revenue: 225000, courses: 405, applications: 25 },
      { day: '10', users: 14200, revenue: 230000, courses: 410, applications: 30 },
      { day: '15', users: 14300, revenue: 235000, courses: 415, applications: 35 },
      { day: '20', users: 14400, revenue: 240000, courses: 420, applications: 40 },
      { day: '25', users: 14500, revenue: 245000, courses: 425, applications: 45 },
      { day: '31', users: 14200, revenue: 234500, courses: 420, applications: 234 }
    ],
    'Avril': [
      { day: '1', users: 15000, revenue: 250000, courses: 440, applications: 25 },
      { day: '5', users: 15100, revenue: 255000, courses: 445, applications: 30 },
      { day: '10', users: 15200, revenue: 260000, courses: 450, applications: 35 },
      { day: '15', users: 15300, revenue: 265000, courses: 455, applications: 40 },
      { day: '20', users: 15400, revenue: 270000, courses: 460, applications: 45 },
      { day: '25', users: 15500, revenue: 275000, courses: 465, applications: 50 },
      { day: '30', users: 15420, revenue: 280000, courses: 456, applications: 289 }
    ]
  });

  const [regionData] = useState<RegionData[]>([
    { name: 'Dakar', users: 6940, percentage: 45, growth: 15.2 },
    { name: 'Thiès', users: 2774, percentage: 18, growth: 12.8 },
    { name: 'Saint-Louis', users: 1848, percentage: 12, growth: 8.5 },
    { name: 'Kaolack', users: 1542, percentage: 10, growth: 6.3 },
    { name: 'Ziguinchor', users: 1234, percentage: 8, growth: 4.2 },
    { name: 'Autres', users: 1082, percentage: 7, growth: 2.1 }
  ]);

  const [currentStats] = useState({
    totalUsers: 15420,
    activeUsers: 8920,
    newUsersThisMonth: 1247,
    totalCourses: 456,
    activeCourses: 389,
    totalRevenue: 45678900,
    monthlyRevenue: 2800000,
    conversionRate: 23.5,
    averageRating: 4.6,
    platformUptime: 99.8,
    pendingApplications: 234,
    completedApplications: 1567,
    totalRegions: 14,
    premiumUsers: 2340,
    totalMessages: 23456,
    unreadMessages: 1234
  });

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [selectedPeriod]);

  // Navigation intelligente sur changement de métrique
  const handleMetricChange = (value: string) => {
    setSelectedMetric(value);
    if (value === 'courses') {
      navigate('/admin/courses');
    } else if (value === 'users') {
      navigate('/admin/users');
    } else if (value === 'applications') {
      navigate('/admin/internships');
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(amount);
  };

  const getGrowthIcon = (value: number) => {
    if (value > 0) return <ArrowUpRight className="w-4 h-4 text-green-600" />;
    if (value < 0) return <ArrowDownRight className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getGrowthColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const handleMonthClick = (month: string) => {
    setSelectedMonth(month);
    setIsModalOpen(true);
  };

  const handleExportStats = () => {
    const statsReport = {
      period: selectedPeriod,
      timestamp: new Date().toISOString(),
      currentStats,
      regionData,
      statsData
    };
    
    const blob = new Blob([JSON.stringify(statsReport, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `doremi-stats-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSelectedMonthData = () => {
    if (!selectedMonth) return [];
    return detailedData[selectedMonth] || [];
  };

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Statistiques Détailées</h1>
              <p className="text-gray-600 mt-2">Analyse approfondie des performances de la plateforme DOREMI</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <BarChart3 className="w-4 h-4 mr-1" />
                Données en Temps Réel
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.location.reload()}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportStats}>
                <Download className="w-4 h-4 mr-2" />
                Exporter Stats
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filtres */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
                <SelectItem value="quarter">Ce trimestre</SelectItem>
                <SelectItem value="year">Cette année</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedMetric} onValueChange={handleMetricChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Métrique" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les métriques</SelectItem>
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
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="trends">Tendances</TabsTrigger>
              <TabsTrigger value="regions">Régions</TabsTrigger>
              <TabsTrigger value="details">Détails</TabsTrigger>
            </TabsList>

            {/* Vue d'ensemble */}
            <TabsContent value="overview" className="space-y-6">
              {/* Métriques Principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Utilisateurs Totaux</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(currentStats.totalUsers)}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      {getGrowthIcon(12.5)}
                      <span className="ml-1">+12.5% vs mois dernier</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenus Mensuels</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(currentStats.monthlyRevenue)}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      {getGrowthIcon(18.9)}
                      <span className="ml-1">+18.9% vs mois dernier</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cours Actifs</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(currentStats.activeCourses)}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      {getGrowthIcon(8.7)}
                      <span className="ml-1">+8.7% vs mois dernier</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Taux de Conversion</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{currentStats.conversionRate}%</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      {getGrowthIcon(2.1)}
                      <span className="ml-1">+2.1% vs mois dernier</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Graphiques */}
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5" />
                      Répartition des Revenus
                    </CardTitle>
                    <CardDescription>Parts de revenus par mois (structure et contribution)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Différenciation forte: barres proportionnelles et part du total */}
                    <div className="space-y-4">
                      {(() => {
                        const total = statsData.reduce((acc, s) => acc + s.revenue, 0);
                        return statsData.map((stat, index) => {
                          const part = total ? (stat.revenue / total) * 100 : 0;
                          return (
                            <div
                              key={index}
                              className="p-3 rounded-lg border hover:border-green-300 transition-colors cursor-pointer"
                              onClick={() => handleMonthClick(stat.period)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                                  <span className="text-sm font-medium">{stat.period}</span>
                                </div>
                                <div className="text-right">
                                  <div className="font-semibold">{formatCurrency(stat.revenue)}</div>
                                  <div className="text-xs text-gray-600">{part.toFixed(1)}% du total</div>
                                </div>
                              </div>
                              <div className="mt-2 h-1.5 bg-green-100 rounded">
                                <div
                                  className="h-1.5 bg-green-500 rounded"
                                  style={{ width: `${part}%` }}
                                />
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tendances */}
            <TabsContent value="trends" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Tendances des Cours
                    </CardTitle>
                    <CardDescription>Évolution du nombre de cours</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {statsData.map((stat, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                          onClick={() => handleMonthClick(stat.period)}
                        >
                          <div className="flex items-center gap-3">
                            <BookOpen className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium">{stat.period}</span>
                            <Maximize2 className="w-4 h-4 text-gray-400" />
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{formatNumber(stat.courses)}</div>
                            <div className={`text-xs ${getGrowthColor(stat.growth)}`}>
                              {getGrowthIcon(stat.growth)}
                              <span className="ml-1">{stat.growth}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      Tendances des Candidatures
                    </CardTitle>
                    <CardDescription>Évolution des candidatures</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {statsData.map((stat, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-3 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
                          onClick={() => handleMonthClick(stat.period)}
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium">{stat.period}</span>
                            <Maximize2 className="w-4 h-4 text-gray-400" />
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{formatNumber(stat.applications)}</div>
                            <div className={`text-xs ${getGrowthColor(stat.growth)}`}>
                              {getGrowthIcon(stat.growth)}
                              <span className="ml-1">{stat.growth}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Régions */}
            <TabsContent value="regions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Répartition Géographique
                  </CardTitle>
                  <CardDescription>Utilisateurs par région du Sénégal</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {regionData.map((region, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full bg-${index % 4 === 0 ? 'blue' : index % 4 === 1 ? 'green' : index % 4 === 2 ? 'purple' : 'orange'}-500`}></div>
                          <div>
                            <h4 className="font-medium">{region.name}</h4>
                            <p className="text-sm text-gray-600">{region.percentage}% des utilisateurs</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatNumber(region.users)}</div>
                          <div className={`text-xs ${getGrowthColor(region.growth)}`}>
                            {getGrowthIcon(region.growth)}
                            <span className="ml-1">{region.growth}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Détails */}
            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Métriques de Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium">Uptime</span>
                        <span className="font-semibold text-green-600">{currentStats.platformUptime}%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium">Temps de Réponse</span>
                        <span className="font-semibold">245ms</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <span className="text-sm font-medium">Note Moyenne</span>
                        <span className="font-semibold text-orange-600">{currentStats.averageRating}/5</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <span className="text-sm font-medium">Utilisateurs Premium</span>
                        <span className="font-semibold">{formatNumber(currentStats.premiumUsers)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Activité des Messages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium">Messages Totaux</span>
                        <span className="font-semibold">{formatNumber(currentStats.totalMessages)}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <span className="text-sm font-medium">Messages Non Lus</span>
                        <span className="font-semibold text-red-600">{formatNumber(currentStats.unreadMessages)}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <span className="text-sm font-medium">Candidatures en Attente</span>
                        <span className="font-semibold text-yellow-600">{formatNumber(currentStats.pendingApplications)}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium">Candidatures Traitées</span>
                        <span className="font-semibold text-green-600">{formatNumber(currentStats.completedApplications)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Modal pour les détails du mois */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5" />
              Évolution Détaillée - {selectedMonth}
            </DialogTitle>
            <DialogDescription>
              Courbe d'évolution et statistiques détaillées pour {selectedMonth}
            </DialogDescription>
          </DialogHeader>
          
          {selectedMonth && (
            <div className="space-y-6">
              {/* Graphique d'évolution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="w-5 h-5" />
                    Courbe d'Évolution - {selectedMonth}
                  </CardTitle>
                  <CardDescription>Évolution quotidienne des métriques ({detailMetric === 'users' ? 'Utilisateurs' : detailMetric === 'revenue' ? 'Revenus' : detailMetric === 'courses' ? 'Cours' : 'Candidatures'})</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Sélecteur de métrique */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {([
                      { key: 'users', label: 'Utilisateurs' },
                      { key: 'revenue', label: 'Revenus' },
                      { key: 'courses', label: 'Cours' },
                      { key: 'applications', label: 'Candidatures' },
                    ] as const).map((m) => (
                      <Button
                        key={m.key}
                        size="sm"
                        variant={detailMetric === m.key ? 'default' : 'outline'}
                        onClick={() => setDetailMetric(m.key)}
                      >
                        {m.label}
                      </Button>
                    ))}
                  </div>
                  {/* Courbe d'évolution (Recharts) */}
                  <ChartContainer
                    className="h-64"
                    config={{
                      users: { label: 'Utilisateurs', color: '#3b82f6' },
                      revenue: { label: 'Revenus', color: '#16a34a' },
                      courses: { label: 'Cours', color: '#8b5cf6' },
                      applications: { label: 'Candidatures', color: '#f59e0b' },
                    }}
                  >
                    <ReAreaChart data={getSelectedMonthData()} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={`var(--color-${detailMetric})`} stopOpacity={0.4} />
                          <stop offset="95%" stopColor={`var(--color-${detailMetric})`} stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey={detailMetric}
                        stroke={`var(--color-${detailMetric})`}
                        fill="url(#colorMetric)"
                        strokeWidth={2}
                        isAnimationActive
                        animationDuration={700}
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                    </ReAreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Donut de répartition des revenus du mois */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5" />
                    Répartition des Revenus - {selectedMonth}
                  </CardTitle>
                  <CardDescription>Diagramme circulaire interactif par source</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-3">
                    <Button size="sm" variant={autoRotatePie ? 'default' : 'outline'} onClick={() => setAutoRotatePie(!autoRotatePie)}>
                      {autoRotatePie ? 'Auto: ON' : 'Auto: OFF'}
                    </Button>
                  </div>
                  <ChartContainer
                    className="h-72"
                    config={{
                      Cours: { label: 'Cours', color: pieColors[0] },
                      Premium: { label: 'Premium', color: pieColors[1] },
                      Documents: { label: 'Documents', color: pieColors[2] },
                      Stages: { label: 'Stages', color: pieColors[3] },
                      Autres: { label: 'Autres', color: pieColors[4] },
                    }}
                  >
                    <RePieChart>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Pie
                        data={getRevenueBreakdownForMonth(selectedMonth)}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        isAnimationActive
                        animationDuration={700}
                        activeIndex={activePieIndex}
                        activeShape={(props: any) => (
                          <Sector {...props} outerRadius={props.outerRadius + 8} innerRadius={props.innerRadius} />
                        )}
                        onMouseEnter={(_, idx) => {
                          setActivePieIndex(idx as number);
                          setAutoRotatePie(false);
                        }}
                      >
                        {getRevenueBreakdownForMonth(selectedMonth).map((_, index) => (
                          <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                        ))}
                      </Pie>
                    </RePieChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Résumé du mois */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5" />
                    Résumé de {selectedMonth}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatNumber(getSelectedMonthData()[getSelectedMonthData().length - 1]?.users || 0)}
                      </div>
                      <div className="text-sm text-gray-600">Utilisateurs Finaux</div>
                    </div>
                    
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(getSelectedMonthData()[getSelectedMonthData().length - 1]?.revenue || 0)}
                      </div>
                      <div className="text-sm text-gray-600">Revenus Finaux</div>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {formatNumber(getSelectedMonthData()[getSelectedMonthData().length - 1]?.courses || 0)}
                      </div>
                      <div className="text-sm text-gray-600">Cours Finaux</div>
                    </div>
                    
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {formatNumber(getSelectedMonthData()[getSelectedMonthData().length - 1]?.applications || 0)}
                      </div>
                      <div className="text-sm text-gray-600">Candidatures Finales</div>
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

export default AdminStats;
