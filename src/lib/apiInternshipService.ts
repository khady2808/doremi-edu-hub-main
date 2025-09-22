// Service pour consommer l'API Laravel des stages
// Version entièrement corrigée et robuste

export interface Internship {
  id: number;
  title: string;
  description: string;
  location: string;
  company: string;
  duration?: string;
  requirements?: string[];
  application_deadline?: string;
  salary?: string;
  type?: 'stage' | 'alternance' | 'emploi';
  remote?: boolean;
  is_premium?: boolean;
  views: number;
  applications: number;
  rating?: number;
  logo?: string;
  image?: string;
  tags?: string[];
  recruiter_id: number;
  status?: 'active' | 'expired' | 'closed';
  created_at: string;
  updated_at: string;
  recruiter?: {
    id: number;
    name: string;
    email: string;
    company?: string;
  };
}

export interface InternshipRequest {
  id: number;
  internship_id: number;
  user_id: number;
  cv_file?: string;
  cover_letter?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  applied_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
  internship?: Internship;
}

export interface CreateInternshipData {
  title: string;
  company: string;
  description: string;
  location: string;
  duration?: string;
  requirements?: string[];
  application_deadline?: string;
  salary?: string;
  type?: 'stage' | 'alternance' | 'emploi';
  remote?: boolean;
  is_premium?: boolean;
  tags?: string[];
}

export interface UpdateInternshipData extends Partial<CreateInternshipData> {
  status?: 'active' | 'expired' | 'closed';
}

export interface SearchFilters {
  q?: string;
  type?: 'stage' | 'alternance' | 'emploi';
  location?: string;
  remote?: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export class ApiInternshipService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = 'http://localhost:8000/api') {
    this.baseUrl = baseUrl;
    this.loadToken();
  }

  // Charger le token d'authentification depuis localStorage
  private loadToken(): void {
    const user = localStorage.getItem('doremi_user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        this.token = userData.token || userData.access_token;
      } catch (error) {
        console.error('Erreur lors du parsing du token:', error);
        this.token = null;
      }
    }
  }

  // Obtenir les headers pour les requêtes
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Gérer les erreurs de l'API
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    
    // Gestion robuste des différents formats de réponse Laravel
    if (Array.isArray(data)) {
      return data as T;
    } else if (data && typeof data === 'object') {
      if ('data' in data) {
        return data.data as T;
      } else {
        return data as T;
      }
    } else {
      return data as T;
    }
  }

  // Méthode utilitaire pour extraire les données de manière sécurisée
  private extractData<T>(data: any, fallback: T): T {
    if (Array.isArray(data)) {
      return data as T;
    } else if (data && typeof data === 'object') {
      if ('data' in data) {
        return data.data as T;
      } else {
        return data as T;
      }
    } else {
      return fallback;
    }
  }

  // ========================================
  // MÉTHODES PUBLIQUES (sans authentification)
  // ========================================

  /**
   * Récupérer tous les stages disponibles
   */
  public async getAllInternships(): Promise<Internship[]> {
    try {
      console.log('🔍 Récupération de tous les stages...');
      
      const response = await fetch(`${this.baseUrl}/internships`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const result = await this.handleResponse<Internship[]>(response);
      const safeInternships = this.extractData(result, []);
      console.log('✅ Stages récupérés:', safeInternships.length);
      
      return safeInternships;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des stages:', error);
      throw error;
    }
  }

  /**
   * Récupérer un stage spécifique par son ID
   */
  public async getInternshipById(id: number): Promise<Internship> {
    try {
      console.log('🔍 Récupération du stage ID:', id);
      
      const response = await fetch(`${this.baseUrl}/internships/${id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const result = await this.handleResponse<Internship>(response);
      const safeInternship = this.extractData(result, {} as Internship);
      console.log('✅ Stage récupéré:', safeInternship.title || 'N/A');
      
      return safeInternship;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du stage:', error);
      throw error;
    }
  }

  /**
   * Rechercher des stages avec des filtres
   */
  public async searchInternships(filters: SearchFilters): Promise<Internship[]> {
    try {
      console.log('🔍 Recherche de stages avec filtres:', filters);
      
      const searchParams = new URLSearchParams();
      
      if (filters.q) searchParams.append('q', filters.q);
      if (filters.type) searchParams.append('type', filters.type);
      if (filters.location) searchParams.append('location', filters.location);
      if (filters.remote !== undefined) searchParams.append('remote', filters.remote.toString());

      const response = await fetch(`${this.baseUrl}/internships/search?${searchParams}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const result = await this.handleResponse<Internship[]>(response);
      const safeInternships = this.extractData(result, []);
      console.log('✅ Résultats de recherche:', safeInternships.length);
      
      return safeInternships;
    } catch (error) {
      console.error('❌ Erreur lors de la recherche:', error);
      throw error;
    }
  }

  // ========================================
  // MÉTHODES AUTHENTIFIÉES (recruteurs uniquement)
  // ========================================

  /**
   * Créer un nouveau stage (recruteurs uniquement)
   */
  public async createInternship(internshipData: CreateInternshipData): Promise<Internship> {
    try {
      console.log('📝 Création d\'un nouveau stage:', internshipData.title);
      
      if (!this.token) {
        throw new Error('Authentification requise pour créer un stage');
      }

      const response = await fetch(`${this.baseUrl}/internships`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(internshipData),
      });

      const result = await this.handleResponse<Internship>(response);
      const safeInternship = this.extractData(result, {} as Internship);
      console.log('✅ Stage créé avec succès:', safeInternship.id);
      
      return safeInternship;
    } catch (error) {
      console.error('❌ Erreur lors de la création du stage:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour un stage existant (recruteurs uniquement)
   */
  public async updateInternship(id: number, internshipData: UpdateInternshipData): Promise<Internship> {
    try {
      console.log('📝 Mise à jour du stage ID:', id);
      
      if (!this.token) {
        throw new Error('Authentification requise pour modifier un stage');
      }

      const response = await fetch(`${this.baseUrl}/internships/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(internshipData),
      });

      const result = await this.handleResponse<Internship>(response);
      const safeInternship = this.extractData(result, {} as Internship);
      console.log('✅ Stage mis à jour avec succès');
      
      return safeInternship;
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du stage:', error);
      throw error;
    }
  }

  /**
   * Supprimer un stage (recruteurs uniquement)
   */
  public async deleteInternship(id: number): Promise<void> {
    try {
      console.log('🗑️ Suppression du stage ID:', id);
      
      if (!this.token) {
        throw new Error('Authentification requise pour supprimer un stage');
      }

      const response = await fetch(`${this.baseUrl}/internships/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
      }

      console.log('✅ Stage supprimé avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du stage:', error);
      throw error;
    }
  }

  /**
   * Récupérer les offres du recruteur connecté
   */
  public async getMyOffers(): Promise<Internship[]> {
    try {
      console.log('🔍 Récupération de mes offres...');
      
      if (!this.token) {
        throw new Error('Authentification requise pour voir vos offres');
      }

      const response = await fetch(`${this.baseUrl}/internships/my-offers`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const result = await this.handleResponse<Internship[]>(response);
      const safeInternships = this.extractData(result, []);
      console.log('✅ Mes offres récupérées:', safeInternships.length);
      
      return safeInternships;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de vos offres:', error);
      throw error;
    }
  }

  // ========================================
  // GESTION DES DEMANDES DE STAGE
  // ========================================

  /**
   * Récupérer toutes les demandes de stage d'un utilisateur
   */
  public async getUserInternshipRequests(userId: number): Promise<InternshipRequest[]> {
    try {
      console.log('🔍 Récupération des demandes de stage pour l\'utilisateur:', userId);
      
      if (!this.token) {
        throw new Error('Authentification requise');
      }

      const response = await fetch(`${this.baseUrl}/users/${userId}/internship-requests`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const result = await this.handleResponse<InternshipRequest[]>(response);
      const safeRequests = this.extractData(result, []);
      console.log('✅ Demandes récupérées:', safeRequests.length);
      
      return safeRequests;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des demandes:', error);
      throw error;
    }
  }

  /**
   * Soumettre une demande de stage
   */
  public async submitInternshipRequest(
    internshipId: number,
    cvFile: File,
    coverLetter?: string
  ): Promise<InternshipRequest> {
    try {
      console.log('📝 Soumission d\'une demande de stage pour:', internshipId);
      
      if (!this.token) {
        throw new Error('Authentification requise pour soumettre une demande');
      }

      const formData = new FormData();
      formData.append('internship_id', internshipId.toString());
      formData.append('cv_file', cvFile);
      if (coverLetter) {
        formData.append('cover_letter', coverLetter);
      }

      const response = await fetch(`${this.baseUrl}/internship-requests`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.token}`,
        },
        body: formData,
      });

      const result = await this.handleResponse<InternshipRequest>(response);
      const safeRequest = this.extractData(result, {} as InternshipRequest);
      console.log('✅ Demande soumise avec succès');
      
      return safeRequest;
    } catch (error) {
      console.error('❌ Erreur lors de la soumission de la demande:', error);
      throw error;
    }
  }

  /**
   * Récupérer toutes les demandes (admin/recruteurs)
   */
  public async getAllInternshipRequests(): Promise<InternshipRequest[]> {
    try {
      console.log('🔍 Récupération de toutes les demandes...');
      
      if (!this.token) {
        throw new Error('Authentification requise');
      }

      const response = await fetch(`${this.baseUrl}/internship-requests`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const result = await this.handleResponse<InternshipRequest[]>(response);
      const safeRequests = this.extractData(result, []);
      console.log('✅ Toutes les demandes récupérées:', safeRequests.length);
      
      return safeRequests;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des demandes:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour le statut d'une demande
   */
  public async updateInternshipRequestStatus(
    requestId: number,
    status: 'pending' | 'reviewed' | 'accepted' | 'rejected',
    adminNotes?: string
  ): Promise<InternshipRequest> {
    try {
      console.log('📝 Mise à jour du statut de la demande:', requestId, '->', status);
      
      if (!this.token) {
        throw new Error('Authentification requise');
      }

      const updateData: { status: "pending" | "reviewed" | "accepted" | "rejected" } = { status };
      if (adminNotes) {
        updateData.admin_notes = adminNotes;
      }

      const response = await fetch(`${this.baseUrl}/internship-requests/${requestId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(updateData),
      });

      const result = await this.handleResponse<InternshipRequest>(response);
      const safeRequest = this.extractData(result, {} as InternshipRequest);
      console.log('✅ Statut mis à jour avec succès');
      
      return safeRequest;
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du statut:', error);
      throw error;
    }
  }

  /**
   * Supprimer une demande de stage
   */
  public async deleteInternshipRequest(requestId: number): Promise<void> {
    try {
      console.log('🗑️ Suppression de la demande:', requestId);
      
      if (!this.token) {
        throw new Error('Authentification requise');
      }

      const response = await fetch(`${this.baseUrl}/internship-requests/${requestId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
      }

      console.log('✅ Demande supprimée avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de la demande:', error);
      throw error;
    }
  }

  // ========================================
  // MÉTHODES UTILITAIRES
  // ========================================

  /**
   * Vérifier si l'utilisateur est authentifié
   */
  public isAuthenticated(): boolean {
    return !!this.token;
  }

  /**
   * Mettre à jour le token d'authentification
   */
  public updateToken(token: string): void {
    this.token = token;
  }

  /**
   * Déconnexion
   */
  public logout(): void {
    this.token = null;
    localStorage.removeItem('doremi_user');
  }

  /**
   * Obtenir des statistiques sur les stages
   */
  public async getInternshipStats(): Promise<object> {
    try {
      console.log('📊 Récupération des statistiques...');
      
      const response = await fetch(`${this.baseUrl}/internships/stats`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const result = await this.handleResponse<never>(response);
      const safeStats = this.extractData(result, {});
      console.log('✅ Statistiques récupérées');
      
      return safeStats;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des statistiques:', error);
      // Retourner des statistiques par défaut en cas d'erreur
      return {
        total: 0,
        active: 0,
        expired: 0,
        closed: 0
      };
    }
  }

  /**
   * Formater un stage pour l'affichage
   */
  public formatInternshipForDisplay(internship: Internship): {
    id: number;
    title: string;
    description: string;
    location: string;
    company: string;
    duration?: string;
    requirements?: string[];
    application_deadline?: string;
    salary?: string;
    type?: "stage" | "alternance" | "emploi";
    remote?: boolean;
    is_premium?: boolean;
    views: number;
    applications: number;
    rating?: number;
    logo?: string;
    image?: string;
    tags?: string[];
    recruiter_id: number;
    status?: "active" | "expired" | "closed";
    created_at: string;
    updated_at: string;
    recruiter?: { id: number; name: string; email: string; company?: string };
    formattedDate: string;
    isExpired: boolean
  } {
    return {
      ...internship,
      formattedDate: new Date(internship.created_at).toLocaleDateString('fr-FR'),
      isExpired: internship.application_deadline ? 
        new Date(internship.application_deadline) < new Date() : false
    };
  }
}

// Instance singleton du service
export const apiInternshipService = new ApiInternshipService();