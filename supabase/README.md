# Base de Données DOREMI

## 📋 Vue d'ensemble

Cette base de données PostgreSQL est conçue pour la plateforme éducative DOREMI, spécialement adaptée au contexte sénégalais. Elle gère les utilisateurs, cours, sessions en direct, paiements et tous les aspects de la plateforme.

## 🏗️ Structure de la Base de Données

### Tables Principales

| Table | Description | Relations |
|-------|-------------|-----------|
| `profiles` | Profils utilisateurs de base | `auth.users` |
| `instructor_profiles` | Profils détaillés des instructeurs | `profiles` |
| `student_profiles` | Profils détaillés des étudiants | `profiles` |
| `categories` | Catégories de cours | - |
| `courses` | Cours disponibles | `profiles`, `categories` |
| `chapters` | Chapitres des cours | `courses` |
| `chapter_content` | Contenu des chapitres | `chapters` |
| `course_enrollments` | Inscriptions aux cours | `profiles`, `courses` |
| `live_sessions` | Sessions en direct | `profiles` |
| `premium_subscriptions` | Abonnements premium | `profiles` |
| `payments` | Historique des paiements | `profiles`, `courses` |
| `messages` | Messages entre utilisateurs | `profiles` |
| `notifications` | Notifications système | `profiles` |
| `reviews` | Avis sur les cours | `profiles`, `courses` |
| `library_documents` | Documents de la bibliothèque | `profiles` |

### Types d'Énumération

```sql
-- Rôles utilisateurs
user_role: 'student' | 'instructor' | 'admin'

-- Niveaux d'éducation
education_level: 'ecolier' | 'collegien' | 'lyceen' | 'etudiant' | 'adulte'

-- Niveaux de cours
course_level: 'beginner' | 'intermediate' | 'advanced'

-- Statuts de cours
course_status: 'draft' | 'published' | 'archived'

-- Types de contenu
content_type: 'video' | 'pdf' | 'audio' | 'document' | 'quiz'

-- Statuts de paiement
payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
```

## 🚀 Installation

### Prérequis

1. **Supabase CLI** installé
2. **Node.js** (version 16+)
3. **Git**

### Étapes d'Installation

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd doremi-edu-hub-main
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer Supabase**
   ```bash
   # Se connecter à Supabase
   npx supabase login
   
   # Lier le projet
   npx supabase link --project-ref <your-project-ref>
   ```

4. **Appliquer le schéma**
   ```bash
   # Appliquer le schéma principal
   npx supabase db push
   
   # Ou exécuter manuellement dans l'interface Supabase
   # Copier le contenu de schema.sql dans l'éditeur SQL
   ```

5. **Insérer les données de base**
   ```bash
   # Appliquer les migrations
   npx supabase db push
   ```

## 🔧 Configuration

### Variables d'Environnement

Créer un fichier `.env.local` :

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe (pour les paiements)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key

# Email (pour les notifications)
VITE_EMAIL_SERVICE_KEY=your_email_service_key
```

### Configuration Supabase

1. **Activer l'authentification**
   - Aller dans Authentication > Settings
   - Configurer les providers (Email, Google, etc.)

2. **Configurer le stockage**
   - Aller dans Storage
   - Créer les buckets : `avatars`, `course-content`, `documents`

3. **Configurer les politiques RLS**
   - Les politiques sont déjà définies dans le schéma
   - Vérifier qu'elles sont actives dans l'interface

## 📊 Utilisation

### Requêtes Courantes

#### Récupérer tous les cours publiés
```sql
SELECT 
    c.*,
    p.first_name || ' ' || p.last_name as instructor_name,
    cat.name as category_name
FROM courses c
JOIN profiles p ON c.instructor_id = p.user_id
JOIN categories cat ON c.category_id = cat.id
WHERE c.status = 'published'
ORDER BY c.created_at DESC;
```

#### Récupérer les cours d'un étudiant
```sql
SELECT 
    c.*,
    ce.progress_percentage,
    ce.enrolled_at
FROM courses c
JOIN course_enrollments ce ON c.id = ce.course_id
WHERE ce.user_id = 'user-uuid'
ORDER BY ce.enrolled_at DESC;
```

#### Récupérer les sessions en direct à venir
```sql
SELECT 
    ls.*,
    p.first_name || ' ' || p.last_name as instructor_name
FROM live_sessions ls
JOIN profiles p ON ls.instructor_id = p.user_id
WHERE ls.scheduled_at > NOW()
AND ls.status = 'scheduled'
ORDER BY ls.scheduled_at ASC;
```

### Fonctions Utiles

#### Calculer le progrès d'un cours
```sql
CREATE OR REPLACE FUNCTION calculate_course_progress(course_uuid UUID, user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    total_chapters INTEGER;
    completed_chapters INTEGER;
BEGIN
    -- Compter les chapitres totaux
    SELECT COUNT(*) INTO total_chapters
    FROM chapters
    WHERE course_id = course_uuid;
    
    -- Compter les chapitres complétés (à implémenter selon votre logique)
    SELECT COUNT(*) INTO completed_chapters
    FROM user_chapter_progress
    WHERE course_id = course_uuid AND user_id = user_uuid AND completed = true;
    
    RETURN CASE 
        WHEN total_chapters = 0 THEN 0
        ELSE (completed_chapters * 100) / total_chapters
    END;
END;
$$ LANGUAGE plpgsql;
```

## 🔒 Sécurité

### Row Level Security (RLS)

Toutes les tables ont des politiques RLS activées :

- **Profils** : Les utilisateurs ne peuvent voir/modifier que leur propre profil
- **Cours** : Lecture publique pour les cours publiés, gestion par l'instructeur
- **Messages** : Seuls les participants peuvent voir les messages
- **Paiements** : Les utilisateurs ne voient que leurs propres paiements

### Validation des Données

- **Emails** : Format email valide
- **Téléphones** : Format international
- **Prix** : Valeurs positives uniquement
- **Notes** : Entre 1 et 5
- **Progrès** : Entre 0 et 100%

## 📈 Performance

### Index Créés

- `idx_profiles_email` : Recherche par email
- `idx_courses_instructor` : Cours par instructeur
- `idx_courses_category` : Cours par catégorie
- `idx_enrollments_user` : Inscriptions par utilisateur
- `idx_messages_created` : Messages par date
- `idx_notifications_user` : Notifications par utilisateur

### Optimisations Recommandées

1. **Partitionnement** : Pour les tables de messages et notifications
2. **Archivage** : Supprimer les anciennes données
3. **Cache** : Mettre en cache les requêtes fréquentes

## 🧪 Tests

### Données de Test

Le fichier `migrations/001_initial_data.sql` contient des données de test :

- 8 cours de démonstration
- 3 chapitres avec contenu
- 2 sessions en direct
- 3 documents de bibliothèque
- Notifications et avis de test

### Tests de Performance

```sql
-- Vérifier les performances des requêtes
EXPLAIN ANALYZE SELECT * FROM courses WHERE status = 'published';

-- Vérifier l'utilisation des index
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

## 🔄 Migrations

### Créer une Nouvelle Migration

```bash
# Créer un fichier de migration
touch supabase/migrations/002_new_feature.sql

# Appliquer les migrations
npx supabase db push
```

### Exemple de Migration

```sql
-- Migration: Ajouter un champ pour les sous-titres
ALTER TABLE chapter_content 
ADD COLUMN subtitles_url TEXT;

-- Migration: Ajouter une table pour les quiz
CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    questions JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🐛 Dépannage

### Problèmes Courants

1. **Erreur de politique RLS**
   ```sql
   -- Vérifier les politiques
   SELECT * FROM pg_policies WHERE tablename = 'courses';
   ```

2. **Erreur de contrainte**
   ```sql
   -- Vérifier les contraintes
   SELECT conname, contype, pg_get_constraintdef(oid) 
   FROM pg_constraint 
   WHERE conrelid = 'courses'::regclass;
   ```

3. **Performance lente**
   ```sql
   -- Analyser les requêtes lentes
   SELECT query, calls, total_time, mean_time
   FROM pg_stat_statements
   ORDER BY total_time DESC
   LIMIT 10;
   ```

### Logs et Monitoring

```sql
-- Vérifier les connexions actives
SELECT * FROM pg_stat_activity;

-- Vérifier l'espace disque
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## 📚 Documentation API

### Endpoints Principaux

#### Cours
- `GET /courses` - Liste des cours
- `GET /courses/:id` - Détails d'un cours
- `POST /courses` - Créer un cours
- `PUT /courses/:id` - Modifier un cours

#### Utilisateurs
- `GET /profile` - Profil utilisateur
- `PUT /profile` - Modifier le profil
- `GET /enrollments` - Cours inscrits

#### Sessions en Direct
- `GET /live-sessions` - Sessions à venir
- `POST /live-sessions/:id/join` - Rejoindre une session

## 🤝 Contribution

### Standards de Code

1. **Nommage** : snake_case pour les tables et colonnes
2. **Commentaires** : Documenter toutes les tables et fonctions
3. **Migrations** : Toujours réversibles
4. **Tests** : Inclure des tests pour les nouvelles fonctionnalités

### Processus de Développement

1. Créer une branche pour la fonctionnalité
2. Développer et tester localement
3. Créer une migration si nécessaire
4. Tester en production
5. Merger dans la branche principale

## 📞 Support

Pour toute question ou problème :

1. Vérifier la documentation
2. Consulter les logs Supabase
3. Contacter l'équipe technique

---

**Dernière mise à jour** : Mars 2024  
**Version** : 1.0.0  
**Auteur** : Équipe DOREMI 