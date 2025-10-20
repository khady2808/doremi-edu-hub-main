# 🧪 Guide de Test - Intégration API Laravel

## 🚀 Démarrage Rapide

### 1. **Démarrer votre Backend Laravel**

```bash
cd /Library/back
php artisan serve
```

Votre API sera accessible sur `http://localhost:8000/api`

### 2. **Exécuter les Migrations et Seeders**

```bash
cd /Library/back
php artisan migrate
php artisan db:seed
```

### 3. **Tester l'API**

```bash
# Depuis le dossier frontend
node test-laravel-api.js
```

## 📋 Tests Disponibles

### **Test 1: Connectivité API**
- ✅ Vérifie que l'API est accessible
- ✅ Récupère la liste des cours

### **Test 2: Structure des Données**
- ✅ Vérifie la structure des cours
- ✅ Affiche tous les champs disponibles

### **Test 3: Filtrage**
- ✅ Par catégorie (`category`)
- ✅ Par niveau de difficulté (`difficulty_level`)
- ✅ Par niveau d'éducation (`education_level`)
- ✅ Par cours premium (`is_premium`)

### **Test 4: Tri**
- ✅ Par note (`rating`)
- ✅ Par popularité (`students_count`)
- ✅ Par date de création (`created_at`)

### **Test 5: Pagination**
- ✅ Limite de résultats (`limit`)

### **Test 6: Détail d'un Cours**
- ✅ Récupération d'un cours spécifique

## 🔧 Configuration Frontend

### **Variables d'Environnement**

Créez un fichier `.env` dans votre projet frontend :

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_TOKEN=your_token_here
```

### **Utilisation du Service Laravel**

```typescript
// Remplacer l'import dans vos composants
import { courseLaravelService } from '../lib/courseLaravelService';

// Au lieu de
import { courseService } from '../lib/courseService';
```

### **Mise à Jour des Hooks**

```typescript
// Dans src/hooks/useCourses.ts
import { courseLaravelService } from '../lib/courseLaravelService';

// Remplacer toutes les références à courseService par courseLaravelService
```

## 📊 Endpoints API Disponibles

### **Cours (Public)**
- `GET /api/courses` - Liste des cours
- `GET /api/courses/{id}` - Détail d'un cours

### **Cours (Authentifié)**
- `POST /api/courses` - Créer un cours (teacher)
- `PUT /api/courses/{id}` - Modifier un cours (teacher)
- `DELETE /api/courses/{id}` - Supprimer un cours (teacher)

### **Chapitres (Authentifié)**
- `GET /api/courses/{courseId}/chapters` - Liste des chapitres
- `POST /api/courses/{courseId}/chapters` - Créer un chapitre (teacher)

### **Progression (Authentifié)**
- `GET /api/users/{userId}/courses/{courseId}/progression` - Progression
- `POST /api/users/{userId}/courses/{courseId}/progression` - Mettre à jour

## 🗂️ Structure des Données

### **Cours (Course)**
```json
{
  "id": 1,
  "title": "Mathématiques CM2",
  "description": "Cours de mathématiques pour CM2",
  "thumbnail": "https://example.com/image.jpg",
  "duration": "2h 30min",
  "chapters_count": 8,
  "rating": 4.50,
  "students_count": 156,
  "price": 29.99,
  "theme": "Mathématiques",
  "level": "CM2",
  "difficulty_level": "beginner",
  "category": "Mathématiques",
  "education_level": "ecolier",
  "is_premium": true,
  "teacher_id": 1,
  "school": "École DoReMi",
  "created_at": "2024-01-15T10:30:00.000000Z",
  "updated_at": "2024-01-15T10:30:00.000000Z"
}
```

## 🔍 Filtres Disponibles

### **Paramètres de Filtrage**
- `category` - Catégorie du cours
- `difficulty_level` - Niveau de difficulté (beginner, intermediate, advanced)
- `education_level` - Niveau d'éducation (ecolier, collegien, lyceen, etudiant)
- `is_premium` - Cours premium (true/false)
- `price_min` - Prix minimum
- `price_max` - Prix maximum
- `rating_min` - Note minimum

### **Paramètres de Tri**
- `sort_by` - Champ de tri (title, rating, students_count, chapters_count, price, created_at)
- `sort_order` - Ordre de tri (asc, desc)

### **Pagination**
- `limit` - Nombre de résultats
- `offset` - Décalage

## 🧪 Exemples de Tests

### **Test 1: Cours de Mathématiques**
```bash
curl "http://localhost:8000/api/courses?category=Mathématiques"
```

### **Test 2: Cours Débutant Gratuits**
```bash
curl "http://localhost:8000/api/courses?difficulty_level=beginner&is_premium=false"
```

### **Test 3: Cours Premium Triés par Note**
```bash
curl "http://localhost:8000/api/courses?is_premium=true&sort_by=rating&sort_order=desc"
```

### **Test 4: Cours pour Collégiens**
```bash
curl "http://localhost:8000/api/courses?education_level=collegien"
```

## 🚨 Dépannage

### **Erreur: API non accessible**
```bash
# Vérifier que le serveur Laravel est démarré
cd /Library/back
php artisan serve

# Vérifier que l'API répond
curl http://localhost:8000/api/courses
```

### **Erreur: Aucun cours trouvé**
```bash
# Exécuter les seeders
cd /Library/back
php artisan db:seed

# Vérifier la base de données
php artisan tinker
>>> App\Models\Course::count()
```

### **Erreur: CORS**
Vérifiez la configuration CORS dans `config/cors.php`

### **Erreur: Authentification**
Vérifiez que vous avez un token valide pour les routes protégées

## 📈 Prochaines Étapes

1. **Tester l'API** avec le script fourni
2. **Configurer les variables d'environnement**
3. **Remplacer le service Supabase** par le service Laravel
4. **Tester l'intégration frontend**
5. **Implémenter les routes manquantes** (inscription, progression)

## 🔗 Liens Utiles

- [Documentation Laravel](https://laravel.com/docs)
- [API Routes](http://localhost:8000/api/courses)
- [Swagger Documentation](http://localhost:8000/api/documentation) (si configuré)
