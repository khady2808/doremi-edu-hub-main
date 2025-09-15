// Service d'authentification pour consommer l'API Laravel
import { API_CONFIG } from '../config/api';

export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  role: 'admin' | 'teacher' | 'student' | 'recruiter';
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  surname: string;
  email: string;
  password: string;
  role: 'admin' | 'teacher' | 'student' | 'recruiter';
  student_cycle?: 'lyceen' | 'licence' | 'master' | 'doctorat';
  cv?: File;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

class AuthService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  /**
   * Se connecter avec email et mot de passe
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: API_CONFIG.DEFAULT_HEADERS,
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur de connexion');
      }

      const data = await response.json();
      
      // Stocker le token dans localStorage
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  }

  /**
   * S'inscrire avec les données utilisateur
   */
  async register(registerData: RegisterRequest): Promise<AuthResponse> {
    try {
      // Créer FormData pour gérer les fichiers
      const formData = new FormData();
      formData.append('name', registerData.name);
      formData.append('surname', registerData.surname || registerData.name); // Utiliser name comme surname si non fourni
      formData.append('email', registerData.email);
      formData.append('password', registerData.password);
      formData.append('role', registerData.role);
      
      if (registerData.student_cycle) {
        formData.append('student_cycle', registerData.student_cycle);
      }
      
      if (registerData.cv) {
        formData.append('cv', registerData.cv);
      }

      const response = await fetch(`${this.baseUrl}/register`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          // Ne pas définir Content-Type pour FormData, le navigateur le fait automatiquement
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'inscription');
      }

      const data = await response.json();
      
      // Stocker le token dans localStorage
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  }

  /**
   * Récupérer les informations de l'utilisateur connecté
   */
  async getCurrentUser(): Promise<User> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('Aucun token d\'authentification trouvé');
      }

      const response = await fetch(`${this.baseUrl}/user`, {
        method: 'GET',
        headers: {
          ...API_CONFIG.DEFAULT_HEADERS,
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token invalide, nettoyer le localStorage
          this.logout();
          throw new Error('Session expirée');
        }
        throw new Error('Erreur lors de la récupération des informations utilisateur');
      }

      const user = await response.json();
      
      // Mettre à jour les informations utilisateur dans localStorage
      localStorage.setItem('auth_user', JSON.stringify(user));
      
      return user;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      throw error;
    }
  }

  /**
   * Se déconnecter
   */
  async logout(): Promise<void> {
    try {
      const token = this.getToken();
      if (token) {
        await fetch(`${this.baseUrl}/logout`, {
          method: 'POST',
          headers: {
            ...API_CONFIG.DEFAULT_HEADERS,
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Nettoyer le localStorage dans tous les cas
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  }

  /**
   * Vérifier si l'utilisateur est connecté
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getStoredUser();
    return !!(token && user);
  }

  /**
   * Récupérer le token d'authentification
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Récupérer l'utilisateur stocké
   */
  getStoredUser(): User | null {
    const userStr = localStorage.getItem('auth_user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Erreur lors du parsing de l\'utilisateur stocké:', error);
      return null;
    }
  }

  /**
   * Vérifier si le token est valide
   */
  async validateToken(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) return false;

      const response = await fetch(`${this.baseUrl}/user`, {
        method: 'GET',
        headers: {
          ...API_CONFIG.DEFAULT_HEADERS,
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Erreur lors de la validation du token:', error);
      return false;
    }
  }

  /**
   * Rafraîchir le token (si l'API le supporte)
   */
  async refreshToken(): Promise<string | null> {
    try {
      const token = this.getToken();
      if (!token) return null;

      const response = await fetch(`${this.baseUrl}/refresh`, {
        method: 'POST',
        headers: {
          ...API_CONFIG.DEFAULT_HEADERS,
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) return null;

      const data = await response.json();
      const newToken = data.token || data.access_token;
      
      if (newToken) {
        localStorage.setItem('auth_token', newToken);
        return newToken;
      }

      return null;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      return null;
    }
  }

  /**
   * Obtenir les headers d'authentification
   */
  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }
}

// Instance singleton du service
export const authService = new AuthService();

// Hook personnalisé pour utiliser le service d'authentification
export const useAuthService = () => {
  return {
    login: authService.login.bind(authService),
    register: authService.register.bind(authService),
    logout: authService.logout.bind(authService),
    getCurrentUser: authService.getCurrentUser.bind(authService),
    isAuthenticated: authService.isAuthenticated.bind(authService),
    getToken: authService.getToken.bind(authService),
    getStoredUser: authService.getStoredUser.bind(authService),
    validateToken: authService.validateToken.bind(authService),
    refreshToken: authService.refreshToken.bind(authService),
    getAuthHeaders: authService.getAuthHeaders.bind(authService),
  };
};

export default authService;
