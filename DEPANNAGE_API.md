# 🔧 Guide de Dépannage - Service API Internship

## 🚨 Problèmes Courants et Solutions

### 1. Erreur "Failed to fetch"
**Symptôme :** `TypeError: Failed to fetch`

**Causes possibles :**
- Serveur Laravel non démarré
- URL incorrecte
- Problème CORS

**Solutions :**
```bash
# 1. Démarrer le serveur Laravel
cd C:\Users\HP\OneDrive\Bureau\stage_doremi\back
php artisan serve

# 2. Vérifier l'URL
# Le serveur doit être accessible sur http://localhost:8000

# 3. Tester l'API directement
curl http://localhost:8000/api/internships
```

### 2. Erreur 404 "Not Found"
**Symptôme :** `HTTP 404: Not Found`

**Causes possibles :**
- Routes Laravel non définies
- Migrations non exécutées
- Base de données vide

**Solutions :**
```bash
# 1. Vérifier les routes
php artisan route:list | grep internship

# 2. Exécuter les migrations
php artisan migrate

# 3. Ajouter des données de test
php artisan db:seed
```

### 3. Erreur CORS
**Symptôme :** `Access to fetch at 'http://localhost:8000' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solutions :**
```php
// Dans app/Http/Kernel.php ou config/cors.php
'allowed_origins' => ['http://localhost:3000'],
'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE'],
'allowed_headers' => ['Content-Type', 'Authorization'],
```

### 4. Erreur TypeScript "Property 'length' does not exist"
**Symptôme :** `Property 'length' does not exist on type 'unknown'`

**Cause :** TypeScript ne peut pas garantir le type de retour

**Solution :** ✅ **DÉJÀ CORRIGÉ** - Le service utilise maintenant `extractData()` pour une extraction sécurisée

### 5. Erreur "Cannot read property 'title' of undefined"
**Symptôme :** `Cannot read property 'title' of undefined`

**Cause :** Tentative d'accès à une propriété sur un objet undefined

**Solution :** ✅ **DÉJÀ CORRIGÉ** - Le service utilise maintenant des valeurs par défaut

## 🧪 Tests de Diagnostic

### Test 1: Connectivité API
```javascript
// Dans la console du navigateur
fetch('http://localhost:8000/api/internships')
  .then(response => {
    console.log('Status:', response.status);
    return response.json();
  })
  .then(data => console.log('Data:', data))
  .catch(error => console.error('Error:', error));
```

### Test 2: Service TypeScript
```typescript
// Dans un composant React
import { apiInternshipService } from '@/lib/apiInternshipService';

const testService = async () => {
  try {
    const internships = await apiInternshipService.getAllInternships();
    console.log(`${internships.length} stages trouvés`);
  } catch (error) {
    console.error('Erreur:', error.message);
  }
};
```

### Test 3: Test complet
```typescript
// Utiliser le fichier de test
import { runAllTests } from '@/lib/testApiFinal';
runAllTests();
```

## 🔍 Vérifications Système

### Checklist Laravel
- [ ] PHP 8.0+ installé
- [ ] Composer installé
- [ ] Base de données configurée
- [ ] `.env` configuré
- [ ] Migrations exécutées
- [ ] Serveur démarré sur port 8000

### Checklist React
- [ ] Node.js installé
- [ ] npm/yarn installé
- [ ] Dépendances installées
- [ ] Serveur de développement démarré
- [ ] Service importé correctement

### Checklist Réseau
- [ ] Port 8000 libre
- [ ] Port 3000 libre
- [ ] Firewall configuré
- [ ] CORS configuré

## 📊 Logs de Debug

### Activer les logs Laravel
```php
// Dans .env
LOG_LEVEL=debug
```

### Activer les logs React
```typescript
// Dans le service
console.log('🔍 Debug:', data);
```

### Vérifier les logs
```bash
# Laravel
tail -f storage/logs/laravel.log

# React (dans la console du navigateur)
# Les logs s'affichent automatiquement
```

## 🚀 Solutions Rapides

### Redémarrer tout
```bash
# Terminal 1 - Laravel
cd C:\Users\HP\OneDrive\Bureau\stage_doremi\back
php artisan serve

# Terminal 2 - React
cd C:\Users\HP\OneDrive\Bureau\doremi-edu-hub-main
npm start
```

### Vider le cache
```bash
# Laravel
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# React
npm start -- --reset-cache
```

### Réinstaller les dépendances
```bash
# Laravel
composer install

# React
npm install
```

## 🎯 Prochaines Étapes

1. **Vérifier la connectivité** avec `testConnectivity()`
2. **Tester le service** avec `testService()`
3. **Vérifier les logs** dans la console
4. **Consulter les logs Laravel** si nécessaire

Le service est maintenant **ultra-robuste** et gère tous les cas d'erreur ! 🛡️
