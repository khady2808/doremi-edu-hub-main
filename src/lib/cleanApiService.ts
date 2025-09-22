/**
 * Service API Ultra-Propre pour les Stages
 * Aucune erreur ESLint - Code de qualité production
 */

// Types stricts
export interface Internship {
  id: number;
  title: string;
  description: string;
  company: string;
  location: string;
  type: 'stage' | 'alternance' | 'emploi';
  duration: number;
  salary?: number;
  requirements: string[];
  benefits: string[];
  applicationDeadline: string;
  startDate: string;
  status: 'active' | 'inactive' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface CreateInternshipData {
  title: string;
  description: string;
  company: string;
  location: string;
  type: 'stage' | 'alternance' | 'emploi';
  duration: number;
  salary?: number;
  requirements: string[];
  benefits: string[];
  applicationDeadline: string;
  startDate: string;
}

export interface UpdateInternshipData extends Partial<CreateInternshipData> {
  status?: 'active' | 'inactive' | 'closed';
}

export interface SearchFilters {
  q?: string;
  type?: 'stage' | 'alternance' | 'emploi';
  location?: string;
  company?: string;
  minSalary?: number;
  maxSalary?: number;
  status?: 'active' | 'inactive' | 'closed';
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface StatsData {
  total: number;
  active: number;
  inactive: number;
  closed: number;
  byType: Record<string, number>;
  byLocation: Record<string, number>;
}

/**
 * Service API Ultra-Propre
 */
class CleanApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = 'http://localhost:8000/api') {
    this.baseUrl = baseUrl;
    this.loadToken();
  }

  // Gestion du token
  private loadToken(): void {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  public setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  public clearToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  public isAuthenticated(): boolean {
    return this.token !== null;
  }

  // Headers
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

  // Gestion des réponses
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `Erreur HTTP: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Ignore JSON parsing errors
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  }

  // Extraction des données
  private extractData<T>(data: unknown): T {
    if (Array.isArray(data)) {
      return data as T;
    }
    if (data && typeof data === 'object' && 'data' in data) {
      return (data as { data: T }).data;
    }
    return data as T;
  }

  // Méthodes CRUD
  public async getAllInternships(): Promise<Internship[]> {
    try {
      console.log('🔍 Récupération de tous les stages...');
      const response = await fetch(`${this.baseUrl}/internships`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      const data = await this.handleResponse<unknown>(response);
      const internships = this.extractData<Internship[]>(data);
      const result = Array.isArray(internships) ? internships : [];
      console.log(`✅ ${result.length} stages récupérés`);
      return result;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des stages:', error);
      throw error;
    }
  }

  public async getInternshipById(id: number): Promise<Internship> {
    try {
      console.log(`🔍 Récupération du stage ${id}...`);
      const response = await fetch(`${this.baseUrl}/internships/${id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      const data = await this.handleResponse<unknown>(response);
      const internship = this.extractData<Internship>(data);
      console.log(`✅ Stage ${id} récupéré`);
      return internship;
    } catch (error) {
      console.error(`❌ Erreur lors de la récupération du stage ${id}:`, error);
      throw error;
    }
  }

  public async searchInternships(filters: SearchFilters): Promise<Internship[]> {
    try {
      console.log('🔍 Recherche de stages...', filters);
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`${this.baseUrl}/internships/search?${params}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      const data = await this.handleResponse<unknown>(response);
      const internships = this.extractData<Internship[]>(data);
      const result = Array.isArray(internships) ? internships : [];
      console.log(`✅ ${result.length} stages trouvés`);
      return result;
    } catch (error) {
      console.error('❌ Erreur lors de la recherche:', error);
      throw error;
    }
  }

  public async createInternship(data: CreateInternshipData): Promise<Internship> {
    try {
      console.log('➕ Création d\'un nouveau stage...');
      const response = await fetch(`${this.baseUrl}/internships`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });
      const result = await this.handleResponse<unknown>(response);
      const internship = this.extractData<Internship>(result);
      console.log('✅ Stage créé avec succès');
      return internship;
    } catch (error) {
      console.error('❌ Erreur lors de la création du stage:', error);
      throw error;
    }
  }

  public async updateInternship(id: number, data: UpdateInternshipData): Promise<Internship> {
    try {
      console.log(`✏️ Mise à jour du stage ${id}...`);
      const response = await fetch(`${this.baseUrl}/internships/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });
      const result = await this.handleResponse<unknown>(response);
      const internship = this.extractData<Internship>(result);
      console.log(`✅ Stage ${id} mis à jour`);
      return internship;
    } catch (error) {
      console.error(`❌ Erreur lors de la mise à jour du stage ${id}:`, error);
      throw error;
    }
  }

  public async deleteInternship(id: number): Promise<void> {
    try {
      console.log(`🗑️ Suppression du stage ${id}...`);
      const response = await fetch(`${this.baseUrl}/internships/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      await this.handleResponse<unknown>(response);
      console.log(`✅ Stage ${id} supprimé`);
    } catch (error) {
      console.error(`❌ Erreur lors de la suppression du stage ${id}:`, error);
      throw error;
    }
  }

  public async getInternshipStats(): Promise<StatsData> {
    try {
      console.log('📊 Récupération des statistiques...');
      const response = await fetch(`${this.baseUrl}/internships/stats`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      const data = await this.handleResponse<unknown>(response);
      const stats = this.extractData<StatsData>(data);
      console.log('✅ Statistiques récupérées');
      return stats;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }
}

// Instance singleton
export const cleanApiService = new CleanApiService();

// Export par défaut
export default cleanApiService;
