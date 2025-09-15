# Intégration API des Actualités - DOREMI

## Vue d'ensemble

Cette intégration permet de consommer l'API des actualités du backend Laravel dans le frontend React. La page des actualités utilise maintenant des données réelles provenant de l'API au lieu de données mockées.

## Fichiers modifiés/créés

### 1. Service API (`src/lib/newsService.ts`)
- Service complet pour interagir avec l'API des actualités
- Gestion des erreurs et types TypeScript
- Méthodes pour récupérer, liker, partager les actualités
- Support de la pagination et des filtres

### 2. Configuration API (`src/config/api.ts`)
- Configuration centralisée de l'API
- URLs de base, timeouts, headers par défaut
- Gestion des images et endpoints
- Variables d'environnement supportées

### 3. Page Actualités (`src/pages/Actualites.tsx`)
- Intégration complète avec l'API
- États de chargement et gestion d'erreurs
- Carrousel dynamique avec actualités en vedette
- Statistiques en temps réel
- Interactions (like, partage) fonctionnelles

## Configuration requise

### Variables d'environnement
Créez un fichier `.env` dans le répertoire racine du frontend :

```env
# URL de l'API Laravel
VITE_API_URL=http://localhost:8000/api

# URL des images (optionnel)
VITE_IMAGE_URL=http://localhost:8000/storage

# Mode de développement (optionnel)
VITE_APP_ENV=development
```

**Note :** Ce projet utilise Vite, donc les variables d'environnement doivent commencer par `VITE_` au lieu de `REACT_APP_`.

### Backend Laravel
Assurez-vous que votre backend Laravel est configuré avec :
- CORS activé pour le frontend
- Routes API des actualités disponibles
- Base de données avec des actualités de test

## Fonctionnalités implémentées

### ✅ Récupération des actualités
- Liste paginée des actualités
- Filtres par catégorie, priorité, type
- Recherche textuelle
- Tri par date, vues, likes, priorité

### ✅ Actualités en vedette
- Carrousel automatique
- Navigation manuelle
- Indicateurs visuels

### ✅ Interactions utilisateur
- Système de likes
- Partage d'actualités
- Ouverture en modal détaillée

### ✅ Statistiques
- Compteurs en temps réel
- Répartition par catégorie
- Métriques d'engagement

### ✅ Gestion d'erreurs
- États de chargement
- Messages d'erreur
- Bouton de retry

## Endpoints API utilisés

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/news` | Liste des actualités avec filtres |
| GET | `/api/news/{id}` | Détails d'une actualité |
| GET | `/api/news/stats` | Statistiques des actualités |
| POST | `/api/news/{id}/like` | Liker une actualité |
| POST | `/api/news/{id}/share` | Partager une actualité |

## Utilisation

### 1. Démarrer le backend Laravel
```bash
cd back
php artisan serve
```

### 2. Démarrer le frontend React
```bash
cd doremi-edu-hub-main
npm start
```

### 3. Accéder à la page des actualités
Naviguez vers `/actualites` dans votre application React.

## Structure des données

### NewsItem
```typescript
interface NewsItem {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  image?: string;
  featured_image?: string;
  author: string;
  author_id?: number;
  location?: string;
  read_time?: string;
  type: 'news' | 'scholarship' | 'announcement';
  priority: 'low' | 'medium' | 'high';
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  is_urgent: boolean;
  category?: string;
  subcategory?: string;
  tags?: string[];
  target_audience?: string[];
  meta_description?: string;
  meta_keywords?: string;
  gallery?: string[];
  published_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
  views_count: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
}
```

## Personnalisation

### Modifier l'URL de l'API
Éditez `src/config/api.ts` ou utilisez les variables d'environnement.

### Ajouter de nouveaux filtres
Modifiez l'interface `NewsFilters` dans `newsService.ts` et ajoutez les paramètres correspondants.

### Personnaliser l'interface
Modifiez `src/pages/Actualites.tsx` pour adapter l'affichage selon vos besoins.

## Dépannage

### Erreur "process is not defined"
Cette erreur indique que le projet utilise Vite au lieu de Create React App. Assurez-vous d'utiliser les variables d'environnement avec le préfixe `VITE_` :
```env
VITE_API_URL=http://localhost:8000/api
VITE_IMAGE_URL=http://localhost:8000/storage
```

### Avertissements React Router
Si vous voyez des avertissements de dépréciation de React Router, ils ont été résolus en ajoutant les flags de future dans `App.tsx`. Ces avertissements n'affectent pas le fonctionnement de l'application.

## Intégration d'Authentification

L'application utilise maintenant l'API d'authentification Laravel pour la connexion et l'inscription. Consultez le fichier `AUTH_INTEGRATION_README.md` pour plus de détails sur l'intégration complète.

### Fonctionnalités d'authentification
- ✅ Connexion via API Laravel
- ✅ Inscription avec validation
- ✅ Gestion des tokens JWT
- ✅ Persistance des sessions
- ✅ Fallback vers système mock
- ✅ Gestion des erreurs

### Erreur CORS
Vérifiez que le backend Laravel a CORS configuré pour accepter les requêtes du frontend.

### Erreur 404
Vérifiez que les routes API sont bien définies dans `routes/api.php`.

### Images non affichées
Vérifiez que les images sont accessibles via l'URL configurée et que les permissions sont correctes.

### Données vides
Vérifiez que la base de données contient des actualités avec le statut "published".

### Variables d'environnement non chargées
Redémarrez le serveur de développement après avoir modifié le fichier `.env` :
```bash
npm run dev
```

### Avertissements React Router
Si vous voyez des avertissements de dépréciation de React Router, ils ont été résolus en ajoutant les flags de future dans `App.tsx`. Ces avertissements n'affectent pas le fonctionnement de l'application.

## Prochaines étapes

1. **Authentification** : Intégrer le système d'authentification pour les actions protégées
2. **Cache** : Implémenter un système de cache pour améliorer les performances
3. **Notifications** : Ajouter des notifications en temps réel
4. **Tests** : Créer des tests unitaires et d'intégration
5. **Optimisation** : Implémenter la pagination infinie et la lazy loading

## Support

Pour toute question ou problème, consultez :
- La documentation de l'API Laravel
- Les logs du navigateur (F12)
- Les logs du serveur Laravel
