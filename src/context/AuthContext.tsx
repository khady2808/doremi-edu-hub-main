
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, LiveSession, Video } from '../types/auth';
import { EducationLevel } from '../types/course';
import { emailService } from '../lib/emailService';
import { mockCourses } from '../data/mockData';
import { authService, User as ApiUser } from '../lib/authService';

export interface Notification {
  id: string;
  type: 'video' | 'live' | 'general';
  title: string;
  message: string;
  instructorName: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<User>;
  register: (
    email: string,
    password: string,
    name: string,
    role: 'student' | 'teacher' | 'recruiter',
    studentCycle?: 'lyceen' | 'licence' | 'master' | 'doctorat',
    cv?: File | null
  ) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  updateProfilePicture: (avatar: string) => void;
  updateEducationLevel: (level: EducationLevel) => void;
  addVideo: (video: Omit<Video, 'id' | 'createdAt'>) => Video;
  addLiveSession: (session: Omit<LiveSession, 'id' | 'createdAt'>) => void;
  videos: Video[];
  liveSessions: LiveSession[];
  notifications: Notification[];
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationsCount: number;
  removeVideo: (videoId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fonction pour convertir l'utilisateur de l'API vers le format local
const convertApiUserToLocalUser = (apiUser: ApiUser): User => {
  return {
    id: apiUser.id.toString(),
    email: apiUser.email,
    name: apiUser.name,
    role: apiUser.role,
    isPremium: false, // Par défaut, peut être mis à jour selon les données de l'API
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${apiUser.email}`,
    joinedDate: apiUser.created_at,
    educationLevel: 'lyceen', // Par défaut, peut être mis à jour selon les données de l'API
    isVerified: !!apiUser.email_verified_at,
    phone: '', // Par défaut, peut être mis à jour selon les données de l'API
    bio: '', // Par défaut, peut être mis à jour selon les données de l'API
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const [videos, setVideos] = useState<Video[]>([]);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load user from API or localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Vérifier si l'utilisateur est authentifié via l'API
        if (authService.isAuthenticated()) {
          // Valider le token avec l'API
          const isValid = await authService.validateToken();
          if (isValid) {
            // Récupérer les informations utilisateur depuis l'API
            const apiUser = await authService.getCurrentUser();
            const localUser = convertApiUserToLocalUser(apiUser);
            
            setAuthState({
              user: localUser,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            // Token invalide, nettoyer
            await authService.logout();
            setAuthState(prev => ({ ...prev, isLoading: false }));
          }
        } else {
          // Fallback vers localStorage pour la compatibilité
          const savedUser = localStorage.getItem('doremi_user');
          if (savedUser) {
            const user = JSON.parse(savedUser);
            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            setAuthState(prev => ({ ...prev, isLoading: false }));
          }
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'authentification:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();

    // Charger les données locales (videos, sessions, notifications)
    const savedVideos = localStorage.getItem('doremi_videos');
    const savedLiveSessions = localStorage.getItem('doremi_live_sessions');
    const savedNotifications = localStorage.getItem('doremi_notifications');

    if (savedVideos) {
      const parsedVideos = JSON.parse(savedVideos);
      // Garder toutes les vidéos (les nouvelles en base64 et les anciennes en blob)
      setVideos(parsedVideos);
      console.log('Vidéos chargées:', parsedVideos.length, 'vidéos');
    }

    if (savedLiveSessions) {
      setLiveSessions(JSON.parse(savedLiveSessions));
    }

    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  // Nettoyer les objets URL quand le composant est démonté
  useEffect(() => {
    return () => {
      videos.forEach(video => {
        if (video.fileUrl.startsWith('blob:')) {
          URL.revokeObjectURL(video.fileUrl);
        }
      });
    };
  }, [videos]);

  const login = async (email: string, password: string) => {
    console.log('🔐 Tentative de connexion avec l\'API:', email);
    
    try {
      // Appel à l'API Laravel
      const authResponse = await authService.login(email, password);
      console.log('✅ Connexion API réussie:', authResponse);
      
      const localUser = convertApiUserToLocalUser(authResponse.user);
      
      // Stocker aussi dans localStorage pour la compatibilité
      localStorage.setItem('doremi_user', JSON.stringify(localUser));
      
      setAuthState({
        user: localUser,
        isAuthenticated: true,
        isLoading: false,
      });
      
      return localUser;
    } catch (error) {
      console.error('❌ Erreur API de connexion:', error);
      // Propager l'erreur - plus de fallback mock
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Nettoyer les objets URL avant la déconnexion
      videos.forEach(video => {
        if (video.fileUrl.startsWith('blob:')) {
          URL.revokeObjectURL(video.fileUrl);
        }
      });
      
      // Déconnexion via l'API
      await authService.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Nettoyer le localStorage dans tous les cas
      localStorage.removeItem('doremi_user');
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const updateProfile = (data: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...data };
      // S'assurer que phone et bio sont bien présents même si undefined
      if (!('phone' in updatedUser)) updatedUser.phone = '';
      if (!('bio' in updatedUser)) updatedUser.bio = '';
      localStorage.setItem('doremi_user', JSON.stringify(updatedUser));
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));
    }
  };

  const updateProfilePicture = (avatar: string) => {
    updateProfile({ avatar });
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role: 'student' | 'teacher' | 'recruiter',
    studentCycle?: 'lyceen' | 'licence' | 'master' | 'doctorat',
    cv?: File | null
  ) => {
    console.log('📝 Tentative d\'inscription avec l\'API:', email, role);
    
    try {
      // Appel à l'API Laravel
      const registerData = {
        name,
        surname: name, // Utiliser name comme surname
        email,
        password,
        role,
        student_cycle: studentCycle,
        cv: cv || undefined,
      };

      const authResponse = await authService.register(registerData);
      console.log('✅ Inscription API réussie:', authResponse);
      
      const localUser = convertApiUserToLocalUser(authResponse.user);
      
      // Stocker aussi dans localStorage pour la compatibilité
      localStorage.setItem('doremi_user', JSON.stringify(localUser));
      
      setAuthState({
        user: localUser,
        isAuthenticated: true,
        isLoading: false,
      });

      // Ajouter l'utilisateur aux abonnés email
      emailService.subscribe(email);

      // Envoyer les notifications par email
      try {
        // Email de confirmation d'inscription
        await emailService.sendRegistrationEmail(name, email, role);
        
        // Email de bienvenue
        await emailService.sendWelcomeEmail(name, email, role);
        
        console.log('✅ Emails de bienvenue envoyés avec succès');
      } catch (error) {
        console.error('❌ Erreur lors de l\'envoi des emails:', error);
      }

      // Initialiser les contenus/cours liés au cycle pour les étudiants
      if (role === 'student') {
        try {
          const enrolledKey = `doremi_enrolled_${localUser.id}`;
          const favoritesKey = `doremi_favorites_${localUser.id}`;

          const autoEnrollIds = mockCourses
            .filter(c => (studentCycle === 'lyceen' ? c.educationLevel === 'lyceen' : c.educationLevel === 'etudiant'))
            .map(c => c.id);
          localStorage.setItem(enrolledKey, JSON.stringify(autoEnrollIds));
          localStorage.setItem(favoritesKey, JSON.stringify([]));
        } catch (e) {
          console.warn('Erreur lors de l\'initialisation des cours par cycle:', e);
        }
      }
    } catch (error) {
      console.error('❌ Erreur API d\'inscription:', error);
      // Propager l'erreur - plus de fallback mock
      throw error;
    }
  };

  const updateEducationLevel = (educationLevel: EducationLevel) => {
    updateProfile({ educationLevel });
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    localStorage.setItem('doremi_notifications', JSON.stringify(updatedNotifications));
  };

  const addVideo = (videoData: Omit<Video, 'id' | 'createdAt'>) => {
    const newVideo: Video = {
      ...videoData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };

    const updatedVideos = [...videos, newVideo];
    setVideos(updatedVideos);
    
    // Stocker les vidéos dans localStorage (les données base64 seront incluses)
    try {
      localStorage.setItem('doremi_videos', JSON.stringify(updatedVideos));
    } catch (error) {
      console.error('Erreur lors du stockage de la vidéo:', error);
      // Si localStorage est plein, nettoyer les anciennes vidéos
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        const cleanedVideos = updatedVideos.slice(-10); // Garder seulement les 10 dernières
        localStorage.setItem('doremi_videos', JSON.stringify(cleanedVideos));
        setVideos(cleanedVideos);
      }
    }

    // Envoyer notification par email
    const instructor = authState.user;
    if (instructor) {
      const emailNotification = emailService.createVideoNotification(
        instructor.name,
        newVideo.title
      );
      emailService.sendNotificationToAll(emailNotification);
    }

    // Ajouter notification dans l'app
    addNotification({
      title: 'Nouvelle vidéo disponible',
      message: `${instructor?.name || 'Un instructeur'} a ajouté une nouvelle vidéo : ${newVideo.title}`,
      type: 'video',
      instructorName: instructor?.name || 'Un instructeur',
    });

    return newVideo;
  };

  const removeVideo = (videoId: string) => {
    const videoToRemove = videos.find(video => video.id === videoId);
    
    // Nettoyer les ressources si c'est un blob URL (ancien système)
    if (videoToRemove && videoToRemove.fileUrl.startsWith('blob:')) {
      URL.revokeObjectURL(videoToRemove.fileUrl);
    }
    
    const updatedVideos = videos.filter(video => video.id !== videoId);
    setVideos(updatedVideos);
    
    try {
      localStorage.setItem('doremi_videos', JSON.stringify(updatedVideos));
    } catch (error) {
      console.error('Erreur lors de la suppression de la vidéo:', error);
    }
  };

  const addLiveSession = (sessionData: Omit<LiveSession, 'id' | 'createdAt'>) => {
    const newSession: LiveSession = {
      ...sessionData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };

    const updatedLiveSessions = [...liveSessions, newSession];
    setLiveSessions(updatedLiveSessions);
    localStorage.setItem('doremi_live_sessions', JSON.stringify(updatedLiveSessions));

    // Envoyer notification par email
    const instructor = authState.user;
    if (instructor) {
      const emailNotification = emailService.createLiveNotification(
        instructor.name,
        newSession.title,
        newSession.scheduledAt
      );
      emailService.sendNotificationToAll(emailNotification);
    }

    // Ajouter notification dans l'app
    addNotification({
      title: 'Nouvelle session live',
      message: `${instructor?.name || 'Un instructeur'} va animer une session live : ${newSession.title}`,
      type: 'live',
      instructorName: instructor?.name || 'Un instructeur',
    });
  };

  const markNotificationAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('doremi_notifications', JSON.stringify(updatedNotifications));
  };

  const markAllNotificationsAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true,
    }));
    setNotifications(updatedNotifications);
    localStorage.setItem('doremi_notifications', JSON.stringify(updatedNotifications));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      register,
      logout,
      updateProfile,
      updateProfilePicture,
      updateEducationLevel,
      addVideo,
      addLiveSession,
      removeVideo,
      videos,
      liveSessions,
      notifications,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      unreadNotificationsCount,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
