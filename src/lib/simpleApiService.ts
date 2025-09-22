// Service API Internship - Version Ultra-Simple
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

export class SimpleApiService {
  private baseUrl: string = 'http://localhost:8000/api';
  private token: string | null = null;

  constructor() {
    this.loadToken();
  }

  private loadToken(): void {
    try {
      const user = localStorage.getItem('doremi_user');
      if (user) {
        const userData = JSON.parse(user);
        this.token = userData.token || userData.access_token || null;
      }
    } catch (error) {
      console.warn('Erreur lors du chargement du token:', error);
      this.token = null;
    }
  }

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

  private async handleResponse(response: Response): Promise<unknown> {
    if (!response.ok) {
      let errorMessage = `Erreur HTTP: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Ignorer les erreurs de parsing
      }
      throw new Error(errorMessage);
    }

    try {
      return await response.json();
    } catch (error) {
      throw new Error('Erreur lors du parsing de la réponse JSON');
    }
  }

  private extractData(data: unknown): unknown {
    if (Array.isArray(data)) {
      return data;
    }
    
    if (data && typeof data === 'object' && 'data' in data) {
      return data.data;
    }
    
    return data;
  }

  async getAllInternships(): Promise<Internship[]> {
    try {
      console.log('🔍 Récupération de tous les stages...');
      
      const response = await fetch(`${this.baseUrl}/internships`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await this.handleResponse(response);
      const internships = this.extractData(data);
      const result = Array.isArray(internships) ? internships as Internship[] : [];
      
      console.log(`✅ ${result.length} stages récupérés`);
      return result;
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des stages:', error);
      throw error;
    }
  }

  async getInternshipById(id: number): Promise<Internship> {
    try {
      console.log(`🔍 Récupération du stage ID: ${id}`);
      
      const response = await fetch(`${this.baseUrl}/internships/${id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await this.handleResponse(response);
      const internship = this.extractData(data) as Internship;
      
      console.log(`✅ Stage récupéré: ${internship?.title || 'N/A'}`);
      return internship;
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du stage:', error);
      throw error;
    }
  }

  async searchInternships(filters: SearchFilters): Promise<Internship[]> {
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

      const data = await this.handleResponse(response);
      const internships = this.extractData(data);
      const result = Array.isArray(internships) ? internships as Internship[] : [];
      
      console.log(`✅ ${result.length} résultats de recherche`);
      return result;
      
    } catch (error) {
      console.error('❌ Erreur lors de la recherche:', error);
      throw error;
    }
  }

  async getInternshipStats(): Promise<Record<string, unknown>> {
    try {
      console.log('📊 Récupération des statistiques...');
      
      const response = await fetch(`${this.baseUrl}/internships/stats`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await this.handleResponse(response);
      const stats = this.extractData(data) as Record<string, unknown>;
      
      console.log('✅ Statistiques récupérées');
      return stats || {};
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des statistiques:', error);
      return {
        total: 0,
        active: 0,
        expired: 0,
        closed: 0
      };
    }
  }

  async createInternship(internshipData: CreateInternshipData): Promise<Internship> {
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

      const data = await this.handleResponse(response);
      const internship = this.extractData(data) as Internship;
      
      console.log(`✅ Stage créé avec succès: ${internship?.id || 'N/A'}`);
      return internship;
      
    } catch (error) {
      console.error('❌ Erreur lors de la création du stage:', error);
      throw error;
    }
  }

  async updateInternship(id: number, internshipData: UpdateInternshipData): Promise<Internship> {
    try {
      console.log(`📝 Mise à jour du stage ID: ${id}`);
      
      if (!this.token) {
        throw new Error('Authentification requise pour modifier un stage');
      }

      const response = await fetch(`${this.baseUrl}/internships/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(internshipData),
      });

      const data = await this.handleResponse(response);
      const internship = this.extractData(data) as Internship;
      
      console.log('✅ Stage mis à jour avec succès');
      return internship;
      
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du stage:', error);
      throw error;
    }
  }

  async deleteInternship(id: number): Promise<void> {
    try {
      console.log(`🗑️ Suppression du stage ID: ${id}`);
      
      if (!this.token) {
        throw new Error('Authentification requise pour supprimer un stage');
      }

      const response = await fetch(`${this.baseUrl}/internships/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      console.log('✅ Stage supprimé avec succès');
      
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du stage:', error);
      throw error;
    }
  }

  async getMyOffers(): Promise<Internship[]> {
    try {
      console.log('🔍 Récupération de mes offres...');
      
      if (!this.token) {
        throw new Error('Authentification requise pour voir vos offres');
      }

      const response = await fetch(`${this.baseUrl}/internships/my-offers`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await this.handleResponse(response);
      const internships = this.extractData(data);
      const result = Array.isArray(internships) ? internships as Internship[] : [];
      
      console.log(`✅ ${result.length} offres récupérées`);
      return result;
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de vos offres:', error);
      throw error;
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  updateToken(token: string): void {
    this.token = token;
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('doremi_user');
  }
}

export const simpleApiService = new SimpleApiService();
export const apiInternshipService = simpleApiService;