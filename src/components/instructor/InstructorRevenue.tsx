import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign,
  Eye,
  TrendingUp,
  TrendingDown,
  Calendar,
  Video,
  Users,
  Target,
  Award,
  BarChart3,
  Download,
  CreditCard,
  Wallet,
  Clock,
  Star
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { instructorRevenueService, InstructorRevenueStats } from '../../lib/instructorRevenueService';



export const InstructorRevenue: React.FC = () => {
  const { videos, user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [stats, setStats] = useState<InstructorRevenueStats>({
    totalViews: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    topVideo: null,
    videoCount: 0,
    averageViewsPerVideo: 0,
    monthlyGrowth: 0
  });

  // Calculer les statistiques de revenus
  const calculateRevenueStats = useMemo(() => {
    if (!user) return;

    const instructorStats = instructorRevenueService.getInstructorStats(user.id);
    
    // Si pas de données, créer des données de test pour la démonstration
    if (instructorStats.totalViews === 0) {
      const testStats: InstructorRevenueStats = {
        totalViews: 15420,
        totalRevenue: 38.55,
        monthlyRevenue: 12.50,
        videoCount: 8,
        averageViewsPerVideo: 1927.5,
        topVideo: {
          title: "Introduction à React Hooks",
          views: 5200,
          revenue: 13.00
        },
        monthlyGrowth: 15.3
      };
      setStats(testStats);
    } else {
      setStats(instructorStats);
    }
  }, [user]);

  useEffect(() => {
    calculateRevenueStats;
  }, [calculateRevenueStats]);

  const formatCurrency = (amount: number) => {
    return instructorRevenueService.formatCurrency(amount);
  };

  const formatNumber = (num: number) => {
    return instructorRevenueService.formatNumber(num);
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  return (
    <div className="space-y-8">
      {/* En-tête avec statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Revenus totaux</p>
                <p className="text-2xl font-bold text-green-700">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <div className="p-3 bg-green-500 rounded-full">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Vues totales</p>
                <p className="text-2xl font-bold text-blue-700">{formatNumber(stats.totalViews)}</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-full">
                <Eye className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Vidéos publiées</p>
                <p className="text-2xl font-bold text-purple-700">{stats.videoCount}</p>
              </div>
              <div className="p-3 bg-purple-500 rounded-full">
                <Video className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Croissance mensuelle</p>
                <div className="flex items-center gap-1">
                  {getGrowthIcon(stats.monthlyGrowth)}
                  <p className={`text-2xl font-bold ${getGrowthColor(stats.monthlyGrowth)}`}>
                    {stats.monthlyGrowth >= 0 ? '+' : ''}{stats.monthlyGrowth.toFixed(1)}%
                  </p>
                </div>
              </div>
              <div className="p-3 bg-orange-500 rounded-full">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vidéo la plus populaire */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Vidéo la plus populaire
            </CardTitle>
            <CardDescription>
              Votre vidéo qui génère le plus de revenus
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.topVideo ? (
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-lg mb-2">{stats.topVideo.title}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Vues</p>
                      <p className="text-xl font-bold text-blue-600">{formatNumber(stats.topVideo.views)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Revenus</p>
                      <p className="text-xl font-bold text-green-600">{formatCurrency(stats.topVideo.revenue)}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>Cette vidéo représente {(stats.topVideo.revenue / stats.totalRevenue * 100).toFixed(1)}% de vos revenus totaux</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Video className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Aucune vidéo publiée</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistiques moyennes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Statistiques moyennes
            </CardTitle>
            <CardDescription>
              Performance moyenne de vos vidéos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Eye className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Vues moyennes par vidéo</p>
                    <p className="text-sm text-gray-600">Performance globale</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-blue-600">{formatNumber(stats.averageViewsPerVideo)}</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Revenu moyen par vidéo</p>
                    <p className="text-sm text-gray-600">Monétisation par contenu</p>
                  </div>
                </div>
                                 <p className="text-xl font-bold text-green-600">{formatCurrency((stats.averageViewsPerVideo / 1000) * instructorRevenueService.getMonetizationRate())}</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Target className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Taux de monétisation</p>
                    <p className="text-sm text-gray-600">€ par 1000 vues</p>
                  </div>
                </div>
                                 <p className="text-xl font-bold text-purple-600">{instructorRevenueService.getMonetizationRate()}€</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informations sur la monétisation */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Wallet className="w-5 h-5" />
            Comment fonctionne la monétisation ?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Vues = Revenus</h4>
              <p className="text-sm text-gray-600">
                Chaque vue de vos vidéos génère des revenus. Plus vous avez de vues, plus vous gagnez !
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
                             <h4 className="font-semibold mb-2">{instructorRevenueService.getMonetizationRate()}€ / 1000 vues</h4>
               <p className="text-sm text-gray-600">
                 Notre taux de monétisation est de {instructorRevenueService.getMonetizationRate()}€ pour 1000 vues de vos vidéos.
               </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Paiements mensuels</h4>
              <p className="text-sm text-gray-600">
                Vos revenus sont calculés et versés mensuellement sur votre compte bancaire.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conseils pour augmenter les revenus */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Conseils pour augmenter vos revenus
          </CardTitle>
          <CardDescription>
            Stratégies pour maximiser vos vues et vos revenus
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-semibold">Créez du contenu de qualité</h4>
                  <p className="text-sm text-gray-600">Des vidéos bien structurées et informatives attirent plus de vues.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-semibold">Publiez régulièrement</h4>
                  <p className="text-sm text-gray-600">Une publication régulière maintient l'engagement de votre audience.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-semibold">Optimisez vos titres</h4>
                  <p className="text-sm text-gray-600">Des titres accrocheurs et descriptifs augmentent le taux de clic.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 font-bold text-sm">4</span>
                </div>
                <div>
                  <h4 className="font-semibold">Interagissez avec votre audience</h4>
                  <p className="text-sm text-gray-600">Répondez aux commentaires pour fidéliser vos spectateurs.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
