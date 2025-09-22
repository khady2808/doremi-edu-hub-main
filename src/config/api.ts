// Configuration de l'API
export const API_CONFIG = {
  // URL de base de l'API Laravel
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  
  // Timeout pour les requêtes (en millisecondes)
  TIMEOUT: 10000,
  
  // Headers par défaut
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Configuration pour les images
  IMAGES: {
    // URL de base pour les images uploadées
    BASE_URL: import.meta.env.VITE_IMAGE_URL || 'http://localhost:8000/storage',
    
    // Images par défaut
    DEFAULT_NEWS_IMAGE: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=400&fit=crop',
    DEFAULT_AVATAR: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  },
  
  // Configuration de pagination
  PAGINATION: {
    DEFAULT_PER_PAGE: 15,
    MAX_PER_PAGE: 50,
  },
  
  // Configuration des endpoints
  ENDPOINTS: {
    NEWS: '/news',
    NEWS_STATS: '/news/stats',
    COURSES: '/courses',
    INTERNSHIPS: '/internships',
    DOCUMENTS: '/documents',
    USERS: '/users',
    AUTH: {
      LOGIN: '/login',
      REGISTER: '/register',
      LOGOUT: '/logout',
      USER: '/user',
    },
  },
};

// Fonction utilitaire pour construire l'URL complète
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Fonction utilitaire pour construire l'URL d'une image
export const buildImageUrl = (imagePath: string): string => {
  if (!imagePath) return API_CONFIG.IMAGES.DEFAULT_NEWS_IMAGE;
  
  // Si c'est déjà une URL complète, la retourner telle quelle
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Sinon, construire l'URL avec la base
  return `${API_CONFIG.IMAGES.BASE_URL}/${imagePath}`;
};

export default API_CONFIG;
