# Guide d'Upload d'Images pour les Actualités

## 🎯 Vue d'ensemble

Le système d'upload d'images permet aux administrateurs d'ajouter des images aux actualités directement depuis l'interface web, sans avoir à gérer manuellement les URLs d'images.

## 🚀 Fonctionnalités Implémentées

### ✅ Upload d'Images
- **Champ de type `file`** au lieu d'un champ texte pour les URLs
- **Validation côté client** : type de fichier et taille
- **Support des formats** : JPEG, PNG, JPG, GIF, WebP
- **Limite de taille** : 5MB maximum
- **Prévisualisation** : Affichage du nom et de la taille du fichier sélectionné

### ✅ Intégration Backend
- **FormData** : Envoi des fichiers via FormData
- **Validation Laravel** : Vérification du type et de la taille côté serveur
- **Stockage sécurisé** : Images stockées dans le dossier `storage/app/public/news`
- **URLs générées** : URLs publiques générées automatiquement

## 🔧 Configuration Technique

### Frontend (React)
```typescript
// Gestion de l'upload d'image
const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    // Validation du type
    if (!file.type.startsWith('image/')) {
      toast({ title: "Erreur", description: "Veuillez sélectionner un fichier image valide" });
      return;
    }
    
    // Validation de la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Erreur", description: "L'image ne doit pas dépasser 5MB" });
      return;
    }
    
    setNewArticle(prev => ({ ...prev, imageFile: file }));
  }
};
```

### Backend (Laravel)
```php
// Validation dans NewsController
$validator = Validator::make($request->all(), [
    'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
    // ... autres champs
]);

// Traitement de l'upload
if ($request->hasFile('image')) {
    $data['image'] = $this->uploadImage($request->file('image'), 'news');
}
```

## 🧪 Tests et Validation

### 1. Test de l'Upload d'Image

1. **Connectez-vous en tant qu'admin** :
   - Email : `admin@doremi.fr`
   - Mot de passe : `password123`

2. **Accédez à l'admin des actualités** :
   - Tableau de bord admin → "Actualités"
   - Cliquez sur "Ajouter une actualité"

3. **Testez l'upload d'image** :
   - Remplissez le titre et le contenu
   - Cliquez sur "Choisir un fichier" dans la section Image
   - Sélectionnez une image (JPEG, PNG, JPG, GIF, WebP)
   - Vérifiez que le nom et la taille s'affichent
   - Cliquez sur "Créer l'actualité"

### 2. Tests de Validation

#### Test 1 : Fichier Valide
- ✅ Sélectionnez une image JPEG/PNG de moins de 5MB
- ✅ Vérifiez que l'image est acceptée
- ✅ Vérifiez que l'actualité est créée avec succès

#### Test 2 : Fichier Invalide (Type)
- ❌ Sélectionnez un fichier PDF ou texte
- ❌ Vérifiez que l'erreur "Veuillez sélectionner un fichier image valide" s'affiche

#### Test 3 : Fichier Trop Volumineux
- ❌ Sélectionnez une image de plus de 5MB
- ❌ Vérifiez que l'erreur "L'image ne doit pas dépasser 5MB" s'affiche

#### Test 4 : Sans Image
- ✅ Créez une actualité sans sélectionner d'image
- ✅ Vérifiez que l'actualité est créée avec succès

## 📁 Structure des Fichiers

### Stockage des Images
```
storage/
├── app/
│   └── public/
│       └── news/
│           ├── image1.jpg
│           ├── image2.png
│           └── ...
└── logs/
```

### URLs Générées
```
http://localhost:8000/storage/news/image1.jpg
http://localhost:8000/storage/news/image2.png
```

## 🔐 Sécurité

### Validations Côté Client
- **Type de fichier** : Vérification de `file.type.startsWith('image/')`
- **Taille** : Limite de 5MB (5 * 1024 * 1024 bytes)
- **Feedback utilisateur** : Messages d'erreur clairs

### Validations Côté Serveur
- **Type MIME** : Vérification Laravel `image|mimes:jpeg,png,jpg,gif,webp`
- **Taille** : Limite de 2MB (2048 KB) côté serveur
- **Stockage sécurisé** : Dossier protégé avec permissions appropriées

## 🎨 Interface Utilisateur

### Champ de Sélection de Fichier
```html
<input
  type="file"
  accept="image/*"
  onChange={handleImageUpload}
  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
/>
```

### Affichage du Fichier Sélectionné
```html
{newArticle.imageFile && (
  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
    <p className="text-sm text-green-700">
      ✓ Image sélectionnée: {newArticle.imageFile.name}
    </p>
    <p className="text-xs text-green-600">
      Taille: {(newArticle.imageFile.size / 1024 / 1024).toFixed(2)} MB
    </p>
  </div>
)}
```

## 🐛 Dépannage

### Problèmes Courants

1. **Erreur "Fichier non valide"**
   - Vérifiez que le fichier est bien une image
   - Vérifiez l'extension (.jpg, .jpeg, .png, .gif, .webp)

2. **Erreur "Fichier trop volumineux"**
   - Réduisez la taille de l'image
   - Utilisez un outil de compression d'images

3. **Erreur de serveur lors de l'upload**
   - Vérifiez que le dossier `storage/app/public` existe
   - Vérifiez les permissions du dossier
   - Vérifiez les logs Laravel

4. **Image non affichée après upload**
   - Vérifiez que le lien symbolique `storage` est créé
   - Exécutez : `php artisan storage:link`

### Commandes de Dépannage
```bash
# Créer le lien symbolique pour le stockage
php artisan storage:link

# Vérifier les permissions
chmod -R 755 storage/

# Vérifier les logs
tail -f storage/logs/laravel.log
```

## 📈 Optimisations Futures

### Fonctionnalités à Ajouter
- [ ] **Prévisualisation d'image** : Affichage de l'image avant upload
- [ ] **Redimensionnement automatique** : Ajustement de la taille côté client
- [ ] **Compression automatique** : Réduction de la taille des images
- [ ] **Galerie d'images** : Support de plusieurs images par actualité
- [ ] **Drag & Drop** : Interface de glisser-déposer
- [ ] **Crop d'image** : Outil de recadrage intégré
- [ ] **Formats WebP** : Conversion automatique en WebP
- [ ] **CDN** : Intégration avec un CDN pour les images

### Performance
- [ ] **Lazy loading** : Chargement différé des images
- [ ] **Cache** : Mise en cache des images redimensionnées
- [ ] **Optimisation** : Compression automatique des images
- [ ] **Thumbnails** : Génération automatique de miniatures

## 🔄 Intégration avec d'Autres Fonctionnalités

### Modération d'Images
- Filtrage automatique de contenu inapproprié
- Validation par des modérateurs humains
- Système de signalement

### Analytics
- Suivi des images les plus vues
- Statistiques d'utilisation des images
- Métriques de performance

---

## 📞 Support

Pour toute question ou problème :
1. Vérifiez ce guide de dépannage
2. Consultez les logs de la console et du serveur
3. Testez avec différents formats d'images
4. Vérifiez la configuration du stockage Laravel

**Note** : Ce guide est mis à jour régulièrement. Vérifiez la version la plus récente pour les dernières fonctionnalités.
