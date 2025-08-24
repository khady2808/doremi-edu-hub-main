-- =====================================================
-- MIGRATION: DONNÉES INITIALES
-- =====================================================

-- Insertion d'utilisateurs de test (après création des profils)
-- Note: Ces utilisateurs doivent être créés via Supabase Auth d'abord

-- Insertion de cours de démonstration
INSERT INTO courses (title, description, instructor_id, category_id, level, education_level, thumbnail_url, duration_minutes, price, is_premium, status, rating, students_count) VALUES
(
    'Découverte de l''assurance vie',
    'Comprendre les bases de l''assurance vie et ses avantages pour votre avenir financier. Ce cours vous guidera à travers les concepts fondamentaux de l''assurance vie, les différents types de contrats, et comment choisir la meilleure option selon vos besoins.',
    (SELECT id FROM auth.users LIMIT 1), -- Remplacer par un vrai UUID d'instructeur
    (SELECT id FROM categories WHERE name = 'Finance'),
    'beginner',
    'etudiant',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    150,
    0.00,
    FALSE,
    'published',
    4.5,
    234
),
(
    'Gérer ses finances à 20 ans',
    'Les bases de la gestion financière pour les jeunes adultes. Apprenez à budgétiser, épargner et investir intelligemment dès le début de votre vie professionnelle.',
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT id FROM categories WHERE name = 'Finance'),
    'beginner',
    'etudiant',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800',
    105,
    49.99,
    TRUE,
    'published',
    4.8,
    189
),
(
    'Introduction à la comptabilité',
    'Maîtrisez les principes fondamentaux de la comptabilité générale. Ce cours couvre les bases de la comptabilité, les principes comptables, et la lecture des états financiers.',
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT id FROM categories WHERE name = 'Finance'),
    'intermediate',
    'etudiant',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
    255,
    79.99,
    TRUE,
    'published',
    4.6,
    156
),
(
    'Mathématiques CM2',
    'Révisions et exercices pour les élèves de CM2 - Fractions, géométrie et calculs. Cours complet avec exercices pratiques et corrigés.',
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT id FROM categories WHERE name = 'Mathématiques'),
    'beginner',
    'ecolier',
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
    200,
    0.00,
    FALSE,
    'published',
    4.3,
    312
),
(
    'SVT - Sciences de la Vie et de la Terre',
    'Comprendre le corps humain, la reproduction et l''environnement pour les collégiens. Cours complet avec animations et expériences virtuelles.',
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT id FROM categories WHERE name = 'Sciences'),
    'intermediate',
    'collegien',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
    330,
    39.99,
    TRUE,
    'published',
    4.9,
    198
),
(
    'Philosophie Terminale',
    'Préparation au BAC - Les grands thèmes philosophiques et méthodologie. Cours complet pour réussir l''épreuve de philosophie du baccalauréat.',
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT id FROM categories WHERE name = 'Histoire'),
    'advanced',
    'lyceen',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800',
    405,
    59.99,
    TRUE,
    'published',
    4.7,
    145
),
(
    'Vocabulaire et Orthographe CE2',
    'Améliorer son français écrit - Dictées, règles d''orthographe et enrichissement du vocabulaire. Méthode progressive et ludique.',
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT id FROM categories WHERE name = 'Français'),
    'beginner',
    'ecolier',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800',
    135,
    0.00,
    FALSE,
    'published',
    4.6,
    267
),
(
    'Physique-Chimie 3ème',
    'Préparation au BFEM - Électricité, chimie et mécanique pour les collégiens. Cours complet avec expériences virtuelles.',
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT id FROM categories WHERE name = 'Sciences'),
    'intermediate',
    'collegien',
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800',
    270,
    45.99,
    TRUE,
    'published',
    4.4,
    189
);

-- Insertion de chapitres pour le premier cours
INSERT INTO chapters (course_id, title, description, order_index, duration_minutes) VALUES
(
    (SELECT id FROM courses WHERE title = 'Découverte de l''assurance vie'),
    'Introduction à l''assurance vie',
    'Comprendre les bases de l''assurance vie et son importance',
    1,
    20
),
(
    (SELECT id FROM courses WHERE title = 'Découverte de l''assurance vie'),
    'Les différents types d''assurance vie',
    'Assurance vie temporaire vs permanente',
    2,
    25
),
(
    (SELECT id FROM courses WHERE title = 'Découverte de l''assurance vie'),
    'Comment choisir son assurance vie',
    'Critères de sélection et comparaison',
    3,
    30
);

-- Insertion de contenu pour les chapitres
INSERT INTO chapter_content (chapter_id, title, content_type, content_text, order_index, duration_minutes) VALUES
(
    (SELECT id FROM chapters WHERE title = 'Introduction à l''assurance vie'),
    'Qu''est-ce que l''assurance vie ?',
    'video',
    'Vidéo explicative sur les bases de l''assurance vie',
    1,
    15
),
(
    (SELECT id FROM chapters WHERE title = 'Introduction à l''assurance vie'),
    'Quiz de compréhension',
    'quiz',
    'Questions pour vérifier la compréhension',
    2,
    5
),
(
    (SELECT id FROM chapters WHERE title = 'Les différents types d''assurance vie'),
    'Assurance vie temporaire',
    'video',
    'Explication détaillée de l''assurance vie temporaire',
    1,
    20
),
(
    (SELECT id FROM chapters WHERE title = 'Les différents types d''assurance vie'),
    'Assurance vie permanente',
    'video',
    'Explication détaillée de l''assurance vie permanente',
    2,
    25
);

-- Insertion de sessions en direct de démonstration
INSERT INTO live_sessions (instructor_id, title, description, scheduled_at, duration_minutes, max_participants, status) VALUES
(
    (SELECT id FROM auth.users LIMIT 1),
    'Q&A sur l''assurance vie',
    'Session de questions-réponses sur l''assurance vie avec Marie Dubois',
    NOW() + INTERVAL '2 days',
    60,
    50,
    'scheduled'
),
(
    (SELECT id FROM auth.users LIMIT 1),
    'Révision mathématiques CM2',
    'Session de révision interactive pour les élèves de CM2',
    NOW() + INTERVAL '3 days',
    90,
    30,
    'scheduled'
);

-- Insertion de documents de bibliothèque
INSERT INTO library_documents (title, description, author_id, file_url, file_type, file_size, category, tags, is_premium, download_count) VALUES
(
    'Guide de mathématiques avancées',
    'Manuel complet pour les étudiants en sciences',
    (SELECT id FROM auth.users LIMIT 1),
    'https://example.com/files/math-guide.pdf',
    'pdf',
    5500000,
    'Éducation',
    ARRAY['mathématiques', 'sciences', 'manuel'],
    TRUE,
    456
),
(
    'Histoire du Sénégal moderne',
    'Chronologie détaillée de l''histoire contemporaine sénégalaise',
    (SELECT id FROM auth.users LIMIT 1),
    'https://example.com/files/senegal-history.pdf',
    'pdf',
    3800000,
    'Histoire',
    ARRAY['histoire', 'sénégal', 'politique'],
    FALSE,
    678
),
(
    'Vocabulaire français CE2',
    'Liste de vocabulaire enrichi pour les élèves de CE2',
    (SELECT id FROM auth.users LIMIT 1),
    'https://example.com/files/vocabulaire-ce2.pdf',
    'pdf',
    1200000,
    'Français',
    ARRAY['français', 'vocabulaire', 'primaire'],
    FALSE,
    234
);

-- Insertion de notifications de démonstration
INSERT INTO notifications (user_id, title, message, type, is_read) VALUES
(
    (SELECT id FROM auth.users LIMIT 1),
    'Bienvenue sur DOREMI !',
    'Nous sommes ravis de vous accueillir sur notre plateforme éducative.',
    'welcome',
    FALSE
),
(
    (SELECT id FROM auth.users LIMIT 1),
    'Nouveau cours disponible',
    'Le cours "Mathématiques CM2" est maintenant disponible.',
    'course',
    FALSE
);

-- Insertion d'avis de démonstration
INSERT INTO reviews (user_id, course_id, rating, comment) VALUES
(
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT id FROM courses WHERE title = 'Découverte de l''assurance vie'),
    5,
    'Excellent cours ! Très clair et bien structuré. Je recommande vivement.'
),
(
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT id FROM courses WHERE title = 'Mathématiques CM2'),
    4,
    'Cours très utile pour les révisions. Les exercices sont bien adaptés.'
); 