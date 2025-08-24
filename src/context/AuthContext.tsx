
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, LiveSession, Video } from '../types/auth';
import { EducationLevel } from '../types/course';
import { emailService } from '../lib/emailService';
import { mockCourses } from '../data/mockData';

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
    role: 'student' | 'instructor' | 'recruiter',
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const [videos, setVideos] = useState<Video[]>([]);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('doremi_user');
    const savedVideos = localStorage.getItem('doremi_videos');
    const savedLiveSessions = localStorage.getItem('doremi_live_sessions');
    const savedNotifications = localStorage.getItem('doremi_notifications');
    
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
    // Mock login - in real app, this would call an API
    // Déterminer le rôle à partir de l'email pour les comptes de test
    const emailLower = email.toLowerCase();
    const isAdmin = emailLower.includes('admin');
    const isInstructor = emailLower.includes('formateur') || emailLower.includes('instructor');
    const isRecruiter = emailLower.includes('recruteur') || emailLower.includes('recruiter');
    const mockUser: User = {
      id: '1',
      email,
      name: isAdmin ? 'Admin DOREMI' : isInstructor ? 'Formateur DOREMI' : isRecruiter ? 'Recruteur DOREMI' : 'John Doe',
      role: isAdmin ? 'admin' : isInstructor ? 'instructor' : isRecruiter ? 'recruiter' : 'student',
      isPremium: false,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email,
      joinedDate: new Date().toISOString(),
      educationLevel: 'lyceen',
      isVerified: true,
      phone: '',
      bio: '',
    };

    localStorage.setItem('doremi_user', JSON.stringify(mockUser));
    setAuthState({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    });
    return mockUser;
  };

  const logout = () => {
    // Nettoyer les objets URL avant la déconnexion
    videos.forEach(video => {
      if (video.fileUrl.startsWith('blob:')) {
        URL.revokeObjectURL(video.fileUrl);
      }
    });
    
    localStorage.removeItem('doremi_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
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
    role: 'student' | 'instructor' | 'recruiter',
    studentCycle?: 'lyceen' | 'licence' | 'master' | 'doctorat',
    cv?: File | null
  ) => {
    // Mock register - in real app, this would call an API
    const isStudent = role === 'student';
    const educationLevel: EducationLevel | undefined = isStudent
      ? (studentCycle === 'lyceen' ? 'lyceen' : 'etudiant')
      : undefined;

    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role,
      isPremium: false,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email,
      joinedDate: new Date().toISOString(),
      educationLevel,
      studentCycle,
      isVerified: false,
      phone: '',
      bio: '',
    };

    localStorage.setItem('doremi_user', JSON.stringify(mockUser));
    setAuthState({
      user: mockUser,
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
    if (isStudent) {
      try {
        const enrolledKey = `doremi_enrolled_${mockUser.id}`;
        const favoritesKey = `doremi_favorites_${mockUser.id}`;

        const autoEnrollIds = mockCourses
          .filter(c => (studentCycle === 'lyceen' ? c.educationLevel === 'lyceen' : c.educationLevel === 'etudiant'))
          .map(c => c.id);
        localStorage.setItem(enrolledKey, JSON.stringify(autoEnrollIds));
        localStorage.setItem(favoritesKey, JSON.stringify([]));
      } catch (e) {
        console.warn('Erreur lors de l‘initialisation des cours par cycle:', e);
      }
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
