import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import { offersService } from '@/lib/offersService';
import { internshipService } from '@/lib/internshipService';
import { Briefcase, FileText, MapPin, PlusCircle, Users, TrendingUp, Eye, Calendar, Target } from 'lucide-react';

export const RecruiterDashboard: React.FC = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contractType, setContractType] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState({ views: 0, applications: 0, conversion: 0 });

  const offers = useMemo(() => (user ? offersService.getByRecruiter(user.id) : []), [user?.id]);
  const applicationStats = internshipService.getApplicationStats();
  
  const applicationsCount = useMemo(() => {
    return offers.reduce((acc, o) => acc + (applicationStats.byInternship[o.id] || 0), 0);
  }, [offers, applicationStats.byInternship]);

  // Simuler des statistiques en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        views: prev.views + Math.floor(Math.random() * 5),
        applications: applicationsCount,
        conversion: applicationsCount > 0 ? Math.round((applicationsCount / (prev.views || 1)) * 100) : 0
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [applicationsCount]);

  const submitOffer = async (status: 'published' | 'draft' = 'published') => {
    if (!title.trim() || !description.trim()) return;
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulation d'un délai pour l'UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      offersService.add({
        title,
        description,
        contractType: contractType || undefined,
        location: location || undefined,
        recruiterId: user.id,
        recruiterName: user.name,
        status,
      });
      
      setTitle('');
      setDescription('');
      setContractType('');
      setLocation('');
      
      // Notification de succès
      if (status === 'published') {
        alert('Annonce publiée avec succès !');
      } else {
        alert('Brouillon enregistré !');
      }
    } catch (error) {
      alert('Erreur lors de la publication');
    } finally {
      setIsSubmitting(false);
    }
  };

  const recentOffers = offers.slice(0, 3);
  const publishedOffers = offers.filter(o => o.status === 'published');
  const draftOffers = offers.filter(o => o.status === 'draft');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero Section avec gradient animé */}
      <section className="relative rounded-2xl p-8 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse"></div>
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Espace Recruteur</h1>
            <p className="text-blue-100 text-lg">Publiez vos offres et suivez les candidatures en temps réel</p>
            <div className="flex items-center gap-4 mt-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {publishedOffers.length} annonces actives
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {applicationsCount} candidatures
              </Badge>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="secondary" 
              className="bg-white text-blue-700 hover:bg-white/90 transition-all duration-200 hover:scale-105" 
              onClick={() => (window.location.href = '/recruiter/offers')}
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Mes annonces
            </Button>
            <Button 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 transition-all duration-200 hover:scale-105"
              onClick={() => (window.location.href = '/recruiter/applications')}
            >
              <Users className="w-4 h-4 mr-2" />
              Candidatures
            </Button>
          </div>
        </div>
      </section>

      {/* Statistiques améliorées */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vues totales</p>
                <p className="text-3xl font-bold text-blue-600">{stats.views.toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12% ce mois
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Candidatures</p>
                <p className="text-3xl font-bold text-green-600">{applicationsCount}</p>
                <p className="text-xs text-blue-600 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {publishedOffers.length} annonces
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 text-green-700 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taux de conversion</p>
                <p className="text-3xl font-bold text-purple-600">{stats.conversion}%</p>
                <div className="mt-2">
                  <Progress value={stats.conversion} className="h-2" />
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Annonces actives</p>
                <p className="text-3xl font-bold text-orange-600">{publishedOffers.length}</p>
                <p className="text-xs text-muted-foreground">
                  {draftOffers.length} brouillons
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire amélioré */}
        <Card className="lg:col-span-2 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-blue-600" />
              Créer une nouvelle annonce
            </CardTitle>
            <CardDescription>Remplissez les informations ci-dessous pour publier votre offre</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2" htmlFor="offer-title">
                <Briefcase className="w-4 h-4" />
                Titre de l'offre *
              </label>
              <Input 
                id="offer-title" 
                placeholder="Ex: Développeur Frontend React - Stage/Alternance" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Description détaillée *
              </label>
              <Textarea 
                placeholder="Décrivez le poste, les missions, le profil recherché, les compétences requises..." 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type de contrat</label>
                <div className="relative">
                  <Input 
                    placeholder="CDI, CDD, Stage, Alternance..." 
                    value={contractType} 
                    onChange={(e) => setContractType(e.target.value)}
                    className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                  <FileText className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Lieu de travail</label>
                <div className="relative">
                  <Input 
                    placeholder="Dakar, Thiès, Saint-Louis..." 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-105" 
                onClick={() => submitOffer('published')}
                disabled={isSubmitting || !title.trim() || !description.trim()}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Publication...
                  </div>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Publier l'annonce
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => submitOffer('draft')}
                disabled={isSubmitting}
                className="transition-all duration-200 hover:scale-105"
              >
                Enregistrer en brouillon
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dernières annonces avec design amélioré */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              Dernières annonces
            </CardTitle>
            <CardDescription>{recentOffers.length} plus récentes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentOffers.map(o => (
              <div key={o.id} className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div className="font-semibold text-sm line-clamp-2">{o.title}</div>
                  <Badge variant={o.status === 'published' ? 'default' : 'secondary'} className="text-xs">
                    {o.status === 'published' ? 'Publiée' : 'Brouillon'}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-2 mb-2">
                  <Calendar className="w-3 h-3" />
                  {new Date(o.publishedAt).toLocaleDateString('fr-FR')}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  {o.location || '—'} • {o.contractType || '—'}
                </div>
                <div className="mt-3">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full text-xs"
                    onClick={() => (window.location.href = '/recruiter/offers')}
                  >
                    Voir détails
                  </Button>
                </div>
              </div>
            ))}
            
            {recentOffers.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Aucune annonce pour le moment.</p>
                <p className="text-sm">Créez votre première annonce !</p>
              </div>
            )}
            
            <Button 
              variant="outline" 
              className="w-full mt-4 transition-all duration-200 hover:scale-105" 
              onClick={() => (window.location.href = '/recruiter/offers')}
            >
              Voir toutes les annonces
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecruiterDashboard;


