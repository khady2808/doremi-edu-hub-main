export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          email: string
          first_name: string
          last_name: string
          avatar_url: string | null
          bio: string | null
          phone: string | null
          role: 'student' | 'instructor' | 'admin'
          education_level: 'ecolier' | 'collegien' | 'lyceen' | 'etudiant' | 'adulte' | null
          is_verified: boolean
          is_premium: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          first_name: string
          last_name: string
          avatar_url?: string | null
          bio?: string | null
          phone?: string | null
          role?: 'student' | 'instructor' | 'admin'
          education_level?: 'ecolier' | 'collegien' | 'lyceen' | 'etudiant' | 'adulte' | null
          is_verified?: boolean
          is_premium?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          first_name?: string
          last_name?: string
          avatar_url?: string | null
          bio?: string | null
          phone?: string | null
          role?: 'student' | 'instructor' | 'admin'
          education_level?: 'ecolier' | 'collegien' | 'lyceen' | 'etudiant' | 'adulte' | null
          is_verified?: boolean
          is_premium?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      instructor_profiles: {
        Row: {
          id: string
          user_id: string
          cv_url: string
          experience: string | null
          skills: string[] | null
          linkedin_url: string | null
          id_card_number: string
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          cv_url: string
          experience?: string | null
          skills?: string[] | null
          linkedin_url?: string | null
          id_card_number: string
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          cv_url?: string
          experience?: string | null
          skills?: string[] | null
          linkedin_url?: string | null
          id_card_number?: string
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "instructor_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      student_profiles: {
        Row: {
          id: string
          user_id: string
          school: string | null
          level: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          school?: string | null
          level?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          school?: string | null
          level?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          color?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          color?: string | null
          created_at?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string | null
          instructor_id: string
          category_id: string | null
          level: 'beginner' | 'intermediate' | 'advanced'
          education_level: 'ecolier' | 'collegien' | 'lyceen' | 'etudiant' | 'adulte' | null
          thumbnail_url: string | null
          video_url: string | null
          duration_minutes: number
          price: number
          is_premium: boolean
          status: 'draft' | 'published' | 'archived'
          rating: number
          students_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          instructor_id: string
          category_id?: string | null
          level?: 'beginner' | 'intermediate' | 'advanced'
          education_level?: 'ecolier' | 'collegien' | 'lyceen' | 'etudiant' | 'adulte' | null
          thumbnail_url?: string | null
          video_url?: string | null
          duration_minutes?: number
          price?: number
          is_premium?: boolean
          status?: 'draft' | 'published' | 'archived'
          rating?: number
          students_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          instructor_id?: string
          category_id?: string | null
          level?: 'beginner' | 'intermediate' | 'advanced'
          education_level?: 'ecolier' | 'collegien' | 'lyceen' | 'etudiant' | 'adulte' | null
          thumbnail_url?: string | null
          video_url?: string | null
          duration_minutes?: number
          price?: number
          is_premium?: boolean
          status?: 'draft' | 'published' | 'archived'
          rating?: number
          students_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      chapters: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          order_index: number
          duration_minutes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string | null
          order_index: number
          duration_minutes?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string | null
          order_index?: number
          duration_minutes?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapters_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          }
        ]
      }
      chapter_content: {
        Row: {
          id: string
          chapter_id: string
          title: string
          content_type: 'video' | 'pdf' | 'audio' | 'document' | 'quiz'
          content_url: string | null
          content_text: string | null
          order_index: number
          duration_minutes: number
          created_at: string
        }
        Insert: {
          id?: string
          chapter_id: string
          title: string
          content_type: 'video' | 'pdf' | 'audio' | 'document' | 'quiz'
          content_url?: string | null
          content_text?: string | null
          order_index: number
          duration_minutes?: number
          created_at?: string
        }
        Update: {
          id?: string
          chapter_id?: string
          title?: string
          content_type?: 'video' | 'pdf' | 'audio' | 'document' | 'quiz'
          content_url?: string | null
          content_text?: string | null
          order_index?: number
          duration_minutes?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapter_content_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          }
        ]
      }
      course_enrollments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          enrolled_at: string
          completed_at: string | null
          progress_percentage: number
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          enrolled_at?: string
          completed_at?: string | null
          progress_percentage?: number
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          enrolled_at?: string
          completed_at?: string | null
          progress_percentage?: number
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          }
        ]
      }
      live_sessions: {
        Row: {
          id: string
          instructor_id: string
          title: string
          description: string | null
          scheduled_at: string
          duration_minutes: number
          max_participants: number | null
          meeting_url: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          instructor_id: string
          title: string
          description?: string | null
          scheduled_at: string
          duration_minutes?: number
          max_participants?: number | null
          meeting_url?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          instructor_id?: string
          title?: string
          description?: string | null
          scheduled_at?: string
          duration_minutes?: number
          max_participants?: number | null
          meeting_url?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_sessions_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      live_session_participants: {
        Row: {
          id: string
          session_id: string
          user_id: string
          joined_at: string
        }
        Insert: {
          id?: string
          session_id: string
          user_id: string
          joined_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          user_id?: string
          joined_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_session_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "live_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "live_session_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      premium_subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_start: string
          subscription_end: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_start?: string
          subscription_end?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_start?: string
          subscription_end?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "premium_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      payments: {
        Row: {
          id: string
          user_id: string
          course_id: string | null
          amount: number
          currency: string
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          stripe_payment_intent_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id?: string | null
          amount: number
          currency?: string
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          stripe_payment_intent_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string | null
          amount?: number
          currency?: string
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          stripe_payment_intent_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          content: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          content: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string
          content?: string
          is_read?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string
          is_read?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          course_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          }
        ]
      }
      library_documents: {
        Row: {
          id: string
          title: string
          description: string | null
          author_id: string | null
          file_url: string
          file_type: string
          file_size: number | null
          category: string | null
          tags: string[] | null
          is_premium: boolean
          download_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          author_id?: string | null
          file_url: string
          file_type: string
          file_size?: number | null
          category?: string | null
          tags?: string[] | null
          is_premium?: boolean
          download_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          author_id?: string | null
          file_url?: string
          file_type?: string
          file_size?: number | null
          category?: string | null
          tags?: string[] | null
          is_premium?: boolean
          download_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "library_documents_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'student' | 'instructor' | 'admin'
      education_level: 'ecolier' | 'collegien' | 'lyceen' | 'etudiant' | 'adulte'
      course_level: 'beginner' | 'intermediate' | 'advanced'
      course_status: 'draft' | 'published' | 'archived'
      content_type: 'video' | 'pdf' | 'audio' | 'document' | 'quiz'
      payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Types utilitaires pour faciliter l'utilisation
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Types spécifiques pour les entités principales
export type Profile = Tables<'profiles'>
export type InstructorProfile = Tables<'instructor_profiles'>
export type StudentProfile = Tables<'student_profiles'>
export type Category = Tables<'categories'>
export type Course = Tables<'courses'>
export type Chapter = Tables<'chapters'>
export type ChapterContent = Tables<'chapter_content'>
export type CourseEnrollment = Tables<'course_enrollments'>
export type LiveSession = Tables<'live_sessions'>
export type LiveSessionParticipant = Tables<'live_session_participants'>
export type PremiumSubscription = Tables<'premium_subscriptions'>
export type Payment = Tables<'payments'>
export type Message = Tables<'messages'>
export type Notification = Tables<'notifications'>
export type Review = Tables<'reviews'>
export type LibraryDocument = Tables<'library_documents'>

// Types pour les insertions
export type ProfileInsert = TablesInsert<'profiles'>
export type CourseInsert = TablesInsert<'courses'>
export type ChapterInsert = TablesInsert<'chapters'>
export type ReviewInsert = TablesInsert<'reviews'>

// Types pour les mises à jour
export type ProfileUpdate = TablesUpdate<'profiles'>
export type CourseUpdate = TablesUpdate<'courses'>

// Types pour les relations
export type CourseWithInstructor = Course & {
  instructor: Profile
  category: Category
}

export type CourseWithProgress = Course & {
  enrollment: CourseEnrollment | null
}

export type ChapterWithContent = Chapter & {
  content: ChapterContent[]
}

export type LiveSessionWithInstructor = LiveSession & {
  instructor: Profile
  participants: LiveSessionParticipant[]
} 