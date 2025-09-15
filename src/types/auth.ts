
export type EducationLevel = 'ecolier' | 'collegien' | 'lyceen' | 'etudiant';

export interface Video {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  thumbnail?: string;
  duration?: string;
  instructorId: string;
  createdAt: string;
  views: number;
}

export interface LiveSession {
  id: string;
  title: string;
  description: string;
  link: string;
  scheduledAt: string;
  instructorId: string;
  status: 'scheduled' | 'live' | 'ended';
  platform: 'youtube' | 'jitsi' | 'external';
  createdAt: string;
}

export interface EmailNotification {
  id: string;
  type: 'welcome' | 'new_course' | 'live_session' | 'message';
  recipientEmail: string;
  subject: string;
  content: string;
  sentAt: string;
  status: 'pending' | 'sent' | 'failed';
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'admin' | 'recruiter';
  isPremium: boolean;
  avatar?: string;
  joinedDate: string;
  educationLevel?: EducationLevel;
  studentCycle?: 'lyceen' | 'licence' | 'master' | 'doctorat';
  isVerified?: boolean;
  cv?: string;
  phone?: string;
  bio?: string;
  videos?: Video[];
  liveSessions?: LiveSession[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
