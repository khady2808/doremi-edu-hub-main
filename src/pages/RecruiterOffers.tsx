import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { offersService } from '@/lib/offersService';
import { internshipService } from '@/lib/internshipService';
import { Briefcase, Calendar, MapPin, Eye, Users, Edit, Trash2, Plus, Filter, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export const RecruiterOffers: React.FC = () => {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'applications'>('date');
  
  const offersAll = useMemo(() => (user ? offersService.getByRecruiter(user.id) : []), [user?.id]);
  const applicationStats = internshipService.getApplicationStats();
  
  const offers = useMemo(() => {
    let filtered = offersAll.filter(o => {
      const matchesStatus = statusFilter === 'all' ? true : o.status === statusFilter;
      const matchesSearch = o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           o.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (o.location && o.location.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesStatus && matchesSearch;
    });

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'applications':
          const aCount = applicationStats.byInternship[a.id] || 0;
          const bCount = applicationStats.byInternship[b.id] || 0;
          return bCount - aCount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [offersAll, statusFilter, searchTerm, sortBy, applicationStats.byInternship]);

  const countForOffer = (offerId: string) => applicationStats.byInternship[offerId] || 0;
  const totalApplications = offers.reduce((acc, o) => acc + countForOffer(o.id), 0);
  const publishedOffers = offers.filter(o => o.status === 'published');
  const draftOffers = offers.filter(o => o.status === 'draft');

  const deleteOffer = (offerId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      try {
        // Supprimer l'annonce via le service
        const success = offersService.deleteOffer(offerId);
        
        if (success) {
          // Supprimer aussi les candidatures associées
          const applications = internshipService.getApplicationsForInternship(offerId);
          applications.forEach(app => {
            internshipService.deleteApplication(app.id);
          });
          
          // Recharger la page pour mettre à jour l'affichage
          window.location.reload();
          
          console.log('✅ Annonce supprimée avec succès:', offerId);
        } else {
          alert('Erreur lors de la suppression de l\'annonce. Veuillez réessayer.');
        }
      } catch (error) {
        console.error('❌ Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de l\'annonce. Veuillez réessayer.');
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero Section amélioré */}
      <section className="relative rounded-2xl p-8 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse"></div>
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Mes Annonces</h1>
            <p className="text-blue-100 text-lg">Gérez vos offres d'emploi et suivez les candidatures</p>
            <div className="flex items-center gap-4 mt-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {publishedOffers.length} publiées
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {draftOffers.length} brouillons
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {totalApplications} candidatures
              </Badge>
            </div>
          </div>
          <Button 
            className="bg-white text-blue-700 hover:bg-white/90 transition-all duration-200 hover:scale-105" 
            onClick={() => (window.location.href = '/recruiter')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Créer une annonce
          </Button>
        </div>
      </section>

      {/* Filtres et recherche */}
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Rechercher dans vos annonces..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={(v: 'all'|'published'|'draft') => setStatusFilter(v)}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="published">Publiées</SelectItem>
                  <SelectItem value="draft">Brouillons</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={(v: 'date'|'title'|'applications') => setSortBy(v)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date de publication</SelectItem>
                  <SelectItem value="title">Titre</SelectItem>
                  <SelectItem value="applications">Candidatures</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des annonces */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offers.map(o => {
          const applicationCount = countForOffer(o.id);
          const isPublished = o.status === 'published';
          
          return (
            <Card key={o.id} className="hover:shadow-xl transition-all duration-300 hover:scale-105 group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {o.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={isPublished ? 'default' : 'secondary'} className="text-xs">
                          {isPublished ? 'Publiée' : 'Brouillon'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(o.publishedAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="outline" className="w-8 h-8 p-0">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-8 h-8 p-0 text-red-600 hover:text-red-700"
                      onClick={() => deleteOffer(o.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {o.location || 'Lieu non spécifié'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {o.contractType || 'Type non spécifié'}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {o.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        {applicationCount} candidature{applicationCount > 1 ? 's' : ''}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Eye className="w-4 h-4" />
                        {Math.floor(Math.random() * 100) + 20} vues
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => (window.location.href = '/recruiter/applications?offer=' + o.id)}
                        className="transition-all duration-200 hover:scale-105"
                      >
                        Voir candidatures
                      </Button>
                      {isPublished && (
                        <Button 
                          size="sm"
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-105"
                        >
                          Publier
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {offers.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold mb-2">Aucune annonce trouvée</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Aucune annonce ne correspond à vos critères de recherche.'
                : 'Vous n\'avez pas encore créé d\'annonce.'
              }
            </p>
            <Button 
              onClick={() => (window.location.href = '/recruiter')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer votre première annonce
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RecruiterOffers;


