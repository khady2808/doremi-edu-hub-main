# 🔧 Guide de Dépannage Complet - API Internship

## 🚨 **Problèmes Courants et Solutions**

### 1. **Erreur "Failed to fetch"**
**Symptôme :** `TypeError: Failed to fetch`

**Causes possibles :**
- Serveur Laravel non démarré
- URL incorrecte
- Problème CORS
- Firewall bloquant

**Solutions :**
```bash
# 1. Démarrer le serveur Laravel
cd C:\Users\HP\OneDrive\Bureau\stage_doremi\back
php artisan serve

# 2. Vérifier que le serveur fonctionne
curl http://localhost:8000/api/internships

# 3. Vérifier les routes
php artisan route:list | grep internship
```

### 2. **Erreur 404 "Not Found"**
**Symptôme :** `HTTP 404: Not Found`

**Causes possibles :**
- Routes Laravel non définies
- Migrations non exécutées
- Base de données vide

**Solutions :**
```bash
# 1. Vérifier les routes
php artisan route:list

# 2. Exécuter les migrations
php artisan migrate

# 3. Ajouter des données de test
php artisan db:seed

# 4. Vérifier la base de données
php artisan tinker
>>> App\Models\Internship::count()
```

### 3. **Erreur CORS**
**Symptôme :** `Access to fetch at 'http://localhost:8000' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solutions :**
```php
// Dans config/cors.php
'allowed_origins' => ['http://localhost:3000', 'http://127.0.0.1:3000'],
'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
'allowed_headers' => ['Content-Type', 'Authorization', 'Accept'],
'allowed_credentials' => true,
```

### 4. **Erreur TypeScript "Cannot find module"**
**Symptôme :** `Cannot find module '@/lib/apiInternshipService'`

**Solutions :**
```typescript
// Utiliser un import relatif
import { apiInternshipService } from '../lib/apiInternshipService';

// Ou vérifier le tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### 5. **Erreur "Property does not exist"**
**Symptôme :** `Property 'length' does not exist on type 'unknown'`

**Solutions :**
```typescript
// Le service est déjà corrigé, mais si vous avez encore des erreurs :
const data = await apiInternshipService.getAllInternships();
const length = Array.isArray(data) ? data.length : 0;
```

---

## 🧪 **Tests de Diagnostic**

### **Test 1: Connectivité API**
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

### **Test 2: Service TypeScript**
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

### **Test 3: Composant Simple**
```typescript
// Utiliser le composant de test
import SimpleApiTest from '@/components/SimpleApiTest';

// Dans votre application
<SimpleApiTest />
```

---

## 🔍 **Vérifications Système**

### **Checklist Laravel**
- [ ] PHP 8.0+ installé
- [ ] Composer installé
- [ ] Base de données configurée
- [ ] `.env` configuré
- [ ] Migrations exécutées
- [ ] Serveur démarré sur port 8000
- [ ] Routes définies
- [ ] CORS configuré

### **Checklist React**
- [ ] Node.js installé
- [ ] npm/yarn installé
- [ ] Dépendances installées
- [ ] Serveur de développement démarré
- [ ] Service importé correctement
- [ ] Types TypeScript corrects

### **Checklist Réseau**
- [ ] Port 8000 libre
- [ ] Port 3000 libre
- [ ] Firewall configuré
- [ ] CORS configuré
- [ ] Pas de proxy bloquant

---

## 📊 **Logs de Debug**

### **Activer les logs Laravel**
```php
// Dans .env
LOG_LEVEL=debug
LOG_CHANNEL=daily
```

### **Activer les logs React**
```typescript
// Dans le service
console.log('🔍 Debug:', data);
console.log('🔍 Response:', response);
```

### **Vérifier les logs**
```bash
# Laravel
tail -f storage/logs/laravel.log

# React (dans la console du navigateur)
# Les logs s'affichent automatiquement
```

---

## 🚀 **Solutions Rapides**

### **Redémarrer tout**
```bash
# Terminal 1 - Laravel
cd C:\Users\HP\OneDrive\Bureau\stage_doremi\back
php artisan serve

# Terminal 2 - React
cd C:\Users\HP\OneDrive\Bureau\doremi-edu-hub-main
npm start
```

### **Vider le cache**
```bash
# Laravel
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# React
npm start -- --reset-cache
```

### **Réinstaller les dépendances**
```bash
# Laravel
composer install

# React
npm install
```

---

## 🎯 **Prochaines Étapes**

1. **Utiliser le composant SimpleApiTest** pour identifier le problème
2. **Vérifier la connectivité** avec les tests de base
3. **Consulter les logs** pour plus de détails
4. **Appliquer les solutions** selon le type d'erreur

---

## 📞 **Support**

Si vous avez encore des problèmes :

1. **Exécutez SimpleApiTest** et partagez les résultats
2. **Vérifiez les logs** Laravel et React
3. **Testez la connectivité** API directement
4. **Vérifiez la configuration** CORS et routes

Le service est maintenant robuste et gère tous les cas d'erreur ! 🛡️
