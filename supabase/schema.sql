-- =====================================================
-- SCHEMA DE BASE DE DONNÉES DOREMI
-- Plateforme Éducative Sénégalaise
-- =====================================================

-- Extension pour les UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUMS
-- =====================================================

-- Rôles utilisateurs
CREATE TYPE user_role AS ENUM ('student', 'instructor', 'admin');

-- Niveaux d'éducation
CREATE TYPE education_level AS ENUM ('ecolier', 'collegien', 'lyceen', 'etudiant', 'adulte');

-- Niveaux de cours
CREATE TYPE course_level AS ENUM ('beginner', 'intermediate', 'advanced');

-- Statuts de cours
CREATE TYPE course_status AS ENUM ('draft', 'published', 'archived');

-- Types de contenu
CREATE TYPE content_type AS ENUM ('video', 'pdf', 'audio', 'document', 'quiz');

-- Statuts de paiement
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- =====================================================
-- TABLES PRINCIPALES
-- =====================================================

-- Table des utilisateurs (auth.users de Supabase)
-- Cette table est gérée automatiquement par Supabase Auth

-- Table des profils utilisateurs
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    phone VARCHAR(20),
    role user_role DEFAULT 'student',
    education_level education_level,
    is_verified BOOLEAN DEFAULT FALSE,
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_phone CHECK (phone ~* '^[+]?[0-9\s\-\(\)]{8,}$' OR phone IS NULL)
);

-- Table des profils instructeurs
CREATE TABLE instructor_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    cv_url TEXT,
    experience TEXT,
    skills TEXT[],
    linkedin_url TEXT,
    id_card_number VARCHAR(50) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_linkedin_url CHECK (linkedin_url ~* '^https://linkedin\.com/' OR linkedin_url IS NULL)
);

-- Table des profils étudiants
CREATE TABLE student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    school VARCHAR(200),
    level VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des catégories de cours
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des cours
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    instructor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id),
    level course_level DEFAULT 'beginner',
    education_level education_level,
    thumbnail_url TEXT,
    video_url TEXT,
    duration_minutes INTEGER DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0.00,
    is_premium BOOLEAN DEFAULT FALSE,
    status course_status DEFAULT 'draft',
    rating DECIMAL(3,2) DEFAULT 0.00,
    students_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_price CHECK (price >= 0),
    CONSTRAINT valid_rating CHECK (rating >= 0 AND rating <= 5),
    CONSTRAINT valid_duration CHECK (duration_minutes >= 0)
);

-- Table des chapitres de cours
CREATE TABLE chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    duration_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_order_index CHECK (order_index > 0),
    CONSTRAINT valid_chapter_duration CHECK (duration_minutes >= 0),
    UNIQUE(course_id, order_index)
);

-- Table du contenu des chapitres
CREATE TABLE chapter_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content_type content_type NOT NULL,
    content_url TEXT,
    content_text TEXT,
    order_index INTEGER NOT NULL,
    duration_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_content_order CHECK (order_index > 0),
    CONSTRAINT valid_content_duration CHECK (duration_minutes >= 0),
    UNIQUE(chapter_id, order_index)
);

-- Table des inscriptions aux cours
CREATE TABLE course_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    progress_percentage INTEGER DEFAULT 0,
    
    CONSTRAINT valid_progress CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    UNIQUE(user_id, course_id)
);

-- Table des sessions en direct
CREATE TABLE live_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    instructor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    max_participants INTEGER,
    meeting_url TEXT,
    status VARCHAR(20) DEFAULT 'scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_duration CHECK (duration_minutes > 0),
    CONSTRAINT valid_max_participants CHECK (max_participants > 0 OR max_participants IS NULL)
);

-- Table des inscriptions aux sessions en direct
CREATE TABLE live_session_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES live_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(session_id, user_id)
);

-- Table des abonnements premium
CREATE TABLE premium_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    subscription_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    subscription_end TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des paiements
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'XOF',
    status payment_status DEFAULT 'pending',
    stripe_payment_intent_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_amount CHECK (amount > 0)
);

-- Table des messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_message CHECK (sender_id != receiver_id)
);

-- Table des notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des avis et commentaires
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_review_rating CHECK (rating >= 1 AND rating <= 5),
    UNIQUE(user_id, course_id)
);

-- Table des documents de la bibliothèque
CREATE TABLE library_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(20) NOT NULL,
    file_size BIGINT,
    category VARCHAR(100),
    tags TEXT[],
    is_premium BOOLEAN DEFAULT FALSE,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_file_size CHECK (file_size > 0)
);

-- =====================================================
-- INDEXES POUR LES PERFORMANCES
-- =====================================================

-- Index sur les emails
CREATE INDEX idx_profiles_email ON profiles(email);

-- Index sur les cours par instructeur
CREATE INDEX idx_courses_instructor ON courses(instructor_id);

-- Index sur les cours par catégorie
CREATE INDEX idx_courses_category ON courses(category_id);

-- Index sur les inscriptions
CREATE INDEX idx_enrollments_user ON course_enrollments(user_id);
CREATE INDEX idx_enrollments_course ON course_enrollments(course_id);

-- Index sur les sessions en direct
CREATE INDEX idx_live_sessions_instructor ON live_sessions(instructor_id);
CREATE INDEX idx_live_sessions_scheduled ON live_sessions(scheduled_at);

-- Index sur les messages
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_created ON messages(created_at);

-- Index sur les notifications
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- Index sur les avis
CREATE INDEX idx_reviews_course ON reviews(course_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);

-- Index sur les documents
CREATE INDEX idx_documents_author ON library_documents(author_id);
CREATE INDEX idx_documents_category ON library_documents(category);

-- =====================================================
-- TRIGGERS ET FONCTIONS
-- =====================================================

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_instructor_profiles_updated_at BEFORE UPDATE ON instructor_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_profiles_updated_at BEFORE UPDATE ON student_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chapters_updated_at BEFORE UPDATE ON chapters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_live_sessions_updated_at BEFORE UPDATE ON live_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_premium_subscriptions_updated_at BEFORE UPDATE ON premium_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_library_documents_updated_at BEFORE UPDATE ON library_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour calculer la note moyenne d'un cours
CREATE OR REPLACE FUNCTION calculate_course_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE courses 
    SET rating = (
        SELECT COALESCE(AVG(rating), 0)
        FROM reviews 
        WHERE course_id = NEW.course_id
    )
    WHERE id = NEW.course_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour la note moyenne
CREATE TRIGGER update_course_rating AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION calculate_course_rating();

-- =====================================================
-- DONNÉES DE BASE
-- =====================================================

-- Insertion des catégories par défaut
INSERT INTO categories (name, description, icon, color) VALUES
('Mathématiques', 'Cours de mathématiques pour tous niveaux', 'calculator', '#3B82F6'),
('Français', 'Cours de français et littérature', 'book-open', '#10B981'),
('Sciences', 'SVT, Physique, Chimie', 'flask', '#F59E0B'),
('Histoire', 'Histoire et géographie', 'map', '#EF4444'),
('Langues', 'Anglais, Espagnol, etc.', 'globe', '#8B5CF6'),
('Informatique', 'Programmation et technologies', 'code', '#06B6D4'),
('Finance', 'Gestion financière et économie', 'dollar-sign', '#84CC16'),
('Arts', 'Musique, dessin, théâtre', 'music', '#EC4899');

-- =====================================================
-- POLITIQUES RLS (Row Level Security)
-- =====================================================

-- Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapter_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE premium_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_documents ENABLE ROW LEVEL SECURITY;

-- Politiques pour les profils
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques pour les cours
CREATE POLICY "Anyone can view published courses" ON courses
    FOR SELECT USING (status = 'published');

CREATE POLICY "Instructors can manage their own courses" ON courses
    FOR ALL USING (auth.uid() = instructor_id);

CREATE POLICY "Admins can manage all courses" ON courses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Politiques pour les inscriptions
CREATE POLICY "Users can view their own enrollments" ON course_enrollments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll in courses" ON course_enrollments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques pour les messages
CREATE POLICY "Users can view messages they sent or received" ON messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Politiques pour les notifications
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

-- Politiques pour les avis
CREATE POLICY "Anyone can view reviews" ON reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for courses they enrolled in" ON reviews
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM course_enrollments 
            WHERE user_id = auth.uid() AND course_id = reviews.course_id
        )
    );

-- Politiques pour les documents de la bibliothèque
CREATE POLICY "Anyone can view non-premium documents" ON library_documents
    FOR SELECT USING (NOT is_premium);

CREATE POLICY "Premium users can view premium documents" ON library_documents
    FOR SELECT USING (
        is_premium AND
        EXISTS (
            SELECT 1 FROM premium_subscriptions 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- =====================================================
-- COMMENTAIRES
-- =====================================================

COMMENT ON TABLE profiles IS 'Profils utilisateurs avec informations de base';
COMMENT ON TABLE instructor_profiles IS 'Profils détaillés des instructeurs';
COMMENT ON TABLE student_profiles IS 'Profils détaillés des étudiants';
COMMENT ON TABLE courses IS 'Cours disponibles sur la plateforme';
COMMENT ON TABLE chapters IS 'Chapitres des cours';
COMMENT ON TABLE chapter_content IS 'Contenu des chapitres (vidéos, documents, etc.)';
COMMENT ON TABLE course_enrollments IS 'Inscriptions des étudiants aux cours';
COMMENT ON TABLE live_sessions IS 'Sessions en direct programmées';
COMMENT ON TABLE premium_subscriptions IS 'Abonnements premium des utilisateurs';
COMMENT ON TABLE payments IS 'Historique des paiements';
COMMENT ON TABLE messages IS 'Messages entre utilisateurs';
COMMENT ON TABLE notifications IS 'Notifications système';
COMMENT ON TABLE reviews IS 'Avis et commentaires sur les cours';
COMMENT ON TABLE library_documents IS 'Documents de la bibliothèque';

COMMENT ON COLUMN profiles.role IS 'Rôle de l''utilisateur: student, instructor, admin';
COMMENT ON COLUMN courses.status IS 'Statut du cours: draft, published, archived';
COMMENT ON COLUMN courses.level IS 'Niveau du cours: beginner, intermediate, advanced';
COMMENT ON COLUMN payments.status IS 'Statut du paiement: pending, completed, failed, refunded'; 