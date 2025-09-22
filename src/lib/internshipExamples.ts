// Exemple d'utilisation de l'API Internship Service
// Ce fichier montre comment utiliser le service dans votre application

import { apiInternshipService, Internship, CreateInternshipData } from '@/lib/apiInternshipService';

// ========================================
// EXEMPLES D'UTILISATION
// ========================================

/**
 * Exemple 1: Récupérer tous les stages
 */
export async function getAllInternshipsExample() {
  try {
    console.log('🔍 Récupération de tous les stages...');
    
    const internships = await apiInternshipService.getAllInternships();
    
    console.log('✅ Stages récupérés:', internships.length);
    console.log('📋 Premiers stages:', internships.slice(0, 3));
    
    return internships;
  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  }
}

/**
 * Exemple 2: Rechercher des stages
 */
export async function searchInternshipsExample() {
  try {
    console.log('🔍 Recherche de stages...');
    
    const internships = await apiInternshipService.searchInternships({
      q: 'développement',
      type: 'stage',
      location: 'Dakar',
      remote: false
    });
    
    console.log('✅ Résultats de recherche:', internships.length);
    console.log('📋 Stages trouvés:', internships);
    
    return internships;
  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  }
}

/**
 * Exemple 3: Récupérer un stage spécifique
 */
export async function getInternshipByIdExample(id: number) {
  try {
    console.log(`🔍 Récupération du stage ID: ${id}...`);
    
    const internship = await apiInternshipService.getInternshipById(id);
    
    console.log('✅ Stage récupéré:', internship.title);
    console.log('📋 Détails:', {
      entreprise: internship.company,
      localisation: internship.location,
      type: internship.type,
      statut: internship.status
    });
    
    return internship;
  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  }
}

/**
 * Exemple 4: Créer un nouveau stage (nécessite une authentification)
 */
export async function createInternshipExample() {
  try {
    // Vérifier l'authentification
    if (!apiInternshipService.isAuthenticated()) {
      console.warn('⚠️ Authentification requise pour créer un stage');
      return null;
    }

    console.log('📝 Création d\'un nouveau stage...');
    
    const newInternshipData: CreateInternshipData = {
      title: 'Stage Développeur Frontend',
      company: 'Digital Solutions Sénégal',
      description: 'Rejoignez notre équipe pour développer des interfaces utilisateur modernes avec React et TypeScript. Vous travaillerez sur des projets innovants dans le domaine de la fintech.',
      location: 'Dakar, Sénégal',
      duration: '6 mois',
      requirements: [
        'Maîtrise de JavaScript/TypeScript',
        'Expérience avec React ou Vue.js',
        'Connaissance des outils de build (Webpack, Vite)',
        'Sens du design et de l\'UX',
        'Esprit d\'équipe et autonomie'
      ],
      application_deadline: '2024-12-15',
      salary: '200000 FCFA',
      type: 'stage',
      remote: true,
      is_premium: true,
      tags: ['Frontend', 'React', 'TypeScript', 'Fintech', 'Remote']
    };
    
    const createdInternship = await apiInternshipService.createInternship(newInternshipData);
    
    console.log('✅ Stage créé avec succès:', createdInternship.id);
    console.log('📋 Nouveau stage:', createdInternship.title);
    
    return createdInternship;
  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  }
}

/**
 * Exemple 5: Mettre à jour un stage
 */
export async function updateInternshipExample(id: number) {
  try {
    if (!apiInternshipService.isAuthenticated()) {
      console.warn('⚠️ Authentification requise pour modifier un stage');
      return null;
    }

    console.log(`📝 Mise à jour du stage ID: ${id}...`);
    
    const updateData = {
      status: 'active' as const,
      salary: '250000 FCFA',
      is_premium: true
    };
    
    const updatedInternship = await apiInternshipService.updateInternship(id, updateData);
    
    console.log('✅ Stage mis à jour:', updatedInternship.title);
    console.log('📋 Nouveau salaire:', updatedInternship.salary);
    
    return updatedInternship;
  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  }
}

/**
 * Exemple 6: Récupérer les offres du recruteur connecté
 */
export async function getMyOffersExample() {
  try {
    if (!apiInternshipService.isAuthenticated()) {
      console.warn('⚠️ Authentification requise pour voir vos offres');
      return [];
    }

    console.log('🔍 Récupération de mes offres...');
    
    const myOffers = await apiInternshipService.getMyOffers();
    
    console.log('✅ Mes offres:', myOffers.length);
    console.log('📋 Offres:', myOffers.map(offer => ({
      id: offer.id,
      titre: offer.title,
      entreprise: offer.company,
      statut: offer.status
    })));
    
    return myOffers;
  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  }
}

/**
 * Exemple 7: Soumettre une demande de stage
 */
export async function submitInternshipRequestExample(internshipId: number, cvFile: File) {
  try {
    if (!apiInternshipService.isAuthenticated()) {
      console.warn('⚠️ Authentification requise pour soumettre une demande');
      return null;
    }

    console.log(`📝 Soumission d'une demande pour le stage ID: ${internshipId}...`);
    
    const coverLetter = `
      Madame, Monsieur,
      
      Je souhaite postuler pour le stage de développeur frontend dans votre entreprise.
      Étudiant en informatique avec une passion pour le développement web, je suis
      motivé à rejoindre votre équipe et à contribuer à vos projets innovants.
      
      Cordialement,
      [Votre nom]
    `;
    
    const request = await apiInternshipService.submitInternshipRequest(
      internshipId,
      cvFile,
      coverLetter
    );
    
    console.log('✅ Demande soumise:', request.id);
    console.log('📋 Statut:', request.status);
    
    return request;
  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  }
}

/**
 * Exemple 8: Obtenir les statistiques
 */
export async function getStatsExample() {
  try {
    console.log('📊 Récupération des statistiques...');
    
    const stats = await apiInternshipService.getInternshipStats();
    
    console.log('✅ Statistiques:', stats);
    console.log('📋 Résumé:', {
      total: `${stats.total} stages au total`,
      actifs: `${stats.active} stages actifs`,
      premium: `${stats.premium} stages premium`
    });
    
    return stats;
  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  }
}

/**
 * Exemple 9: Gestion des erreurs
 */
export async function errorHandlingExample() {
  try {
    // Tentative de récupération d'un stage inexistant
    await apiInternshipService.getInternshipById(99999);
  } catch (error) {
    console.log('✅ Erreur gérée correctement:', error.message);
    
    // Gestion spécifique des erreurs
    if (error.message.includes('404')) {
      console.log('📋 Stage non trouvé');
    } else if (error.message.includes('401')) {
      console.log('📋 Authentification requise');
    } else if (error.message.includes('403')) {
      console.log('📋 Accès refusé');
    } else {
      console.log('📋 Erreur inconnue');
    }
  }
}

/**
 * Exemple 10: Utilisation complète avec gestion d'état
 */
export class InternshipManager {
  private internships: Internship[] = [];
  private loading = false;
  private error: string | null = null;

  async loadInternships(): Promise<void> {
    this.loading = true;
    this.error = null;
    
    try {
      this.internships = await apiInternshipService.getAllInternships();
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Erreur inconnue';
    } finally {
      this.loading = false;
    }
  }

  async searchInternships(query: string): Promise<void> {
    this.loading = true;
    this.error = null;
    
    try {
      this.internships = await apiInternshipService.searchInternships({ q: query });
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Erreur de recherche';
    } finally {
      this.loading = false;
    }
  }

  async createInternship(data: CreateInternshipData): Promise<Internship | null> {
    if (!apiInternshipService.isAuthenticated()) {
      this.error = 'Authentification requise';
      return null;
    }

    try {
      const newInternship = await apiInternshipService.createInternship(data);
      this.internships.unshift(newInternship);
      return newInternship;
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Erreur de création';
      return null;
    }
  }

  getInternships(): Internship[] {
    return this.internships;
  }

  isLoading(): boolean {
    return this.loading;
  }

  getError(): string | null {
    return this.error;
  }

  clearError(): void {
    this.error = null;
  }
}

// ========================================
// FONCTIONS UTILITAIRES
// ========================================

/**
 * Formater un stage pour l'affichage
 */
export function formatInternshipForDisplay(internship: Internship): string {
  return `
    ${internship.title}
    ${internship.company} - ${internship.location}
    ${internship.type?.toUpperCase()} - ${internship.status?.toUpperCase()}
    ${internship.salary || 'Salaire non spécifié'}
    ${internship.description.substring(0, 100)}...
  `;
}

/**
 * Filtrer les stages par critères
 */
export function filterInternships(
  internships: Internship[],
  filters: {
    type?: string;
    location?: string;
    remote?: boolean;
    premium?: boolean;
  }
): Internship[] {
  return internships.filter(internship => {
    if (filters.type && internship.type !== filters.type) return false;
    if (filters.location && !internship.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.remote !== undefined && internship.remote !== filters.remote) return false;
    if (filters.premium !== undefined && internship.is_premium !== filters.premium) return false;
    return true;
  });
}

/**
 * Trier les stages
 */
export function sortInternships(
  internships: Internship[],
  sortBy: 'date' | 'title' | 'company' | 'views' = 'date',
  order: 'asc' | 'desc' = 'desc'
): Internship[] {
  return [...internships].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'company':
        comparison = a.company.localeCompare(b.company);
        break;
      case 'views':
        comparison = a.views - b.views;
        break;
    }
    
    return order === 'asc' ? comparison : -comparison;
  });
}

// Export des exemples pour utilisation dans les composants
export const internshipExamples = {
  getAllInternships: getAllInternshipsExample,
  searchInternships: searchInternshipsExample,
  getInternshipById: getInternshipByIdExample,
  createInternship: createInternshipExample,
  updateInternship: updateInternshipExample,
  getMyOffers: getMyOffersExample,
  submitInternshipRequest: submitInternshipRequestExample,
  getStats: getStatsExample,
  errorHandling: errorHandlingExample,
};
