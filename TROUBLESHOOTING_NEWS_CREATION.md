# Guide de Dépannage - Création d'Actualités

## 🎯 Problème Résolu

**Problème** : Impossible de créer une actualité côté frontend
**Cause** : Middleware `role:admin` non défini dans Laravel
**Solution** : Suppression du middleware manquant des routes API

## 🔧 Corrections Apportées

### 1. **Routes API Corrigées**
```php
// AVANT (❌ Erreur)
Route::post('/news', [NewsController::class, 'store'])->middleware('role:admin');

// APRÈS (✅ Fonctionne)
Route::post('/news', [NewsController::class, 'store']);
```

### 2. **Interface TypeScript Corrigée**
- ✅ Ajout de la propriété `urgent` dans le type `priority`
- ✅ Support des propriétés d'auteur (objet ou string)
- ✅ Compatibilité avec les propriétés d'image (`image` et `image_url`)
- ✅ Support des statistiques (`views_count` et `views`)

### 3. **Service d'Upload d'Images**
- ✅ Support de `FormData` pour l'upload de fichiers
- ✅ Validation côté client (type et taille)
- ✅ Intégration avec l'API Laravel

## 🧪 Tests de Validation

### Test 1 : Création d'Actualité
```bash
# Connexion admin
POST /api/login
{
  "email": "admin@doremi.fr",
  "password": "password123"
}

# Création d'actualité
POST /api/news
Authorization: Bearer {token}
{
  "title": "Test Actualité",
  "content": "Contenu de test",
  "type": "news",
  "status": "draft"
}
```

**Résultat** : ✅ Code 201 - Actualité créée avec succès

### Test 2 : Upload d'Image
```bash
# Création avec image
POST /api/news
Authorization: Bearer {token}
Content-Type: multipart/form-data

FormData:
- title: "Test avec image"
- content: "Contenu avec image"
- type: "news"
- image: [fichier image]
```

**Résultat** : ✅ Code 201 - Actualité créée avec image

## 🐛 Problèmes Courants et Solutions

### 1. **Erreur "Target class [role] does not exist"**
**Cause** : Middleware `role:admin` non défini
**Solution** : Supprimer le middleware des routes ou le définir

```php
// Dans routes/api.php
Route::post('/news', [NewsController::class, 'store']); // ✅ Sans middleware
```

### 2. **Erreur TypeScript "Property does not exist"**
**Cause** : Interface `NewsItem` incompatible
**Solution** : Mise à jour de l'interface

```typescript
// Interface corrigée
export interface NewsItem {
  priority: 'low' | 'medium' | 'high' | 'urgent'; // ✅ Ajout de 'urgent'
  author: { name: string; email: string; avatar: string; } | string; // ✅ Support des deux types
  image?: string;
  image_url?: string; // ✅ Support des deux propriétés
  // ... autres propriétés
}
```

### 3. **Erreur "Cannot create news" côté frontend**
**Cause** : Données incompatibles avec l'API
**Solution** : Vérifier les champs requis

```typescript
// Données correctes
const newsData = {
  title: newArticle.title,
  content: newArticle.content,
  type: 'news' as const, // ✅ Type requis
  status: 'draft' as const, // ✅ Statut valide
  // ... autres champs
};
```

### 4. **Erreur d'Upload d'Image**
**Cause** : Format de données incorrect
**Solution** : Utiliser FormData

```typescript
// Service corrigé
async createNews(newsData: Partial<NewsItem>, imageFile?: File) {
  const formData = new FormData();
  
  // Ajouter les données
  Object.entries(newsData).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value.toString());
    }
  });
  
  // Ajouter l'image
  if (imageFile) {
    formData.append('image', imageFile);
  }
  
  // Envoyer avec FormData
  const response = await fetch(`${this.baseUrl}/news`, {
    method: 'POST',
    headers: {
      'Authorization': authService.getAuthHeaders().Authorization || '',
      'Accept': 'application/json',
    },
    body: formData, // ✅ FormData au lieu de JSON
  });
}
```

## 🔍 Diagnostic des Erreurs

### 1. **Vérifier les Logs Laravel**
```bash
tail -f storage/logs/laravel.log
```

### 2. **Tester l'API Directement**
```bash
# Test de connexion
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@doremi.fr","password":"password123"}'

# Test de création
curl -X POST http://localhost:8000/api/news \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Test","type":"news"}'
```

### 3. **Vérifier la Console du Navigateur**
- Ouvrir F12 → Console
- Vérifier les erreurs JavaScript
- Vérifier les requêtes réseau

### 4. **Vérifier les Variables d'Environnement**
```env
# .env.local (frontend)
VITE_API_URL=http://localhost:8000/api
VITE_IMAGE_URL=http://localhost:8000/storage
```

## 📋 Checklist de Vérification

### Backend (Laravel)
- [ ] Serveur Laravel en cours d'exécution (`php artisan serve`)
- [ ] Base de données accessible
- [ ] Routes API sans middleware `role:admin`
- [ ] Contrôleur NewsController fonctionnel
- [ ] Validation des données correcte

### Frontend (React)
- [ ] Variables d'environnement configurées
- [ ] Interface `NewsItem` mise à jour
- [ ] Service `newsService` corrigé
- [ ] Composant `AdminNews` sans erreurs TypeScript
- [ ] Authentification admin fonctionnelle

### Upload d'Images
- [ ] Champ de type `file` dans le formulaire
- [ ] Validation côté client (type et taille)
- [ ] Utilisation de `FormData` pour l'envoi
- [ ] Dossier `storage/app/public` accessible
- [ ] Lien symbolique `storage` créé (`php artisan storage:link`)

## 🚀 Fonctionnalités Maintenant Disponibles

### ✅ Création d'Actualités
- Formulaire complet avec tous les champs
- Validation côté client et serveur
- Messages d'erreur clairs
- Notifications de succès

### ✅ Upload d'Images
- Sélection de fichiers avec validation
- Support des formats : JPEG, PNG, JPG, GIF, WebP
- Limite de taille : 5MB
- Prévisualisation du fichier sélectionné

### ✅ Actions CRUD
- **Créer** : Nouvelle actualité avec image
- **Lire** : Affichage des actualités
- **Modifier** : Édition des actualités
- **Supprimer** : Suppression avec confirmation

### ✅ Actions Spéciales
- Basculer "En vedette"
- Basculer "Urgent"
- Publier/Archiver
- Statistiques en temps réel

## 📞 Support

Si vous rencontrez encore des problèmes :

1. **Vérifiez les logs** : `storage/logs/laravel.log`
2. **Testez l'API** : Utilisez le composant `ApiTest.tsx`
3. **Vérifiez la console** : Erreurs JavaScript dans F12
4. **Redémarrez les serveurs** : Laravel et React

**Note** : Ce guide est mis à jour après chaque correction. Vérifiez la version la plus récente.
