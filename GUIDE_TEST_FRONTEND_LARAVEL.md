# 🧪 Guide de Test Frontend avec API Laravel

## 📋 **Vue d'ensemble**

Ce guide vous explique comment tester l'intégration entre votre frontend React et l'API Laravel pour la consommation des cours.

## 🚀 **Étapes de Test**

### **1. Vérifier que les serveurs sont démarrés**

#### **Serveur Laravel (Backend)**
```bash
cd /Library/back
php artisan serve
# Le serveur doit tourner sur http://localhost:8001
```

#### **Serveur Frontend (React)**
```bash
cd /Library/doremi-edu-hub-main-developp
npm run dev
# Le serveur doit tourner sur http://localhost:5173
```

### **2. Accéder à la page de test**

1. Ouvrez votre navigateur
2. Allez sur `http://localhost:5173`
3. Naviguez vers la page **"Cours"**
4. Vous verrez deux composants de test en bas de page :
   - **CourseServiceTest** (test Supabase)
   - **LaravelApiTest** (test Laravel) ← **NOUVEAU**

### **3. Utiliser le composant de test Laravel**

Le composant `LaravelApiTest` vous permet de :

#### **Tests Automatiques**
- ✅ Récupération de tous les cours
- ✅ Filtrage par catégorie (Mathématiques)
- ✅ Filtrage par niveau de difficulté (débutant)
- ✅ Filtrage par niveau d'éducation (collégien)
- ✅ Récupération des cours populaires
- ✅ Récupération des cours récents
- ✅ Récupération des statistiques

#### **Tests Manuels**
- 🔍 Test du détail d'un cours spécifique
- 📊 Affichage des cours récupérés
- ⚙️ Vérification de la configuration

### **4. Interpréter les résultats**

#### **✅ Succès**
```
🔄 Test 1: Récupération de tous les cours...
✅ Succès: 6 cours récupérés
```

#### **❌ Erreur**
```
❌ Erreur: Failed to fetch
```

### **5. Tests de l'interface utilisateur**

#### **Page des Cours**
1. Vérifiez que les cours s'affichent correctement
2. Testez les filtres (catégorie, niveau, etc.)
3. Testez la recherche
4. Vérifiez la pagination

#### **Détail d'un Cours**
1. Cliquez sur un cours
2. Vérifiez que les informations s'affichent
3. Testez les boutons d'action

## 🔧 **Configuration**

### **Variables d'environnement**

Créez un fichier `.env` dans le projet frontend :

```env
VITE_API_BASE_URL=http://localhost:8001/api
VITE_API_TOKEN=your_token_here
```

### **URLs de test**

- **Frontend:** http://localhost:5173
- **API Laravel:** http://localhost:8001/api
- **Test direct API:** http://localhost:8001/api/courses

## 🐛 **Dépannage**

### **Problème: "Failed to fetch"**
- Vérifiez que le serveur Laravel tourne sur le port 8001
- Vérifiez l'URL dans `courseLaravelService.ts`

### **Problème: "CORS error"**
- Vérifiez la configuration CORS dans Laravel
- Ajoutez `http://localhost:5173` aux origines autorisées

### **Problème: "No courses found"**
- Vérifiez que les cours de test sont créés
- Exécutez `php create-test-courses.php` dans le dossier Laravel

### **Problème: "500 Internal Server Error"**
- Vérifiez les logs Laravel : `tail -f storage/logs/laravel.log`
- Vérifiez la configuration de la base de données

## 📊 **Données de Test**

L'API Laravel contient 6 cours de test :

1. **Mathématiques CM2** (Gratuit, Débutant, Écolier)
2. **SVT 4ème** (39.99€, Intermédiaire, Collégien)
3. **Philosophie Terminale** (59.99€, Avancé, Lycéen)
4. **Comptabilité Licence** (79.99€, Intermédiaire, Étudiant)
5. **Physique-Chimie 3ème** (45.99€, Intermédiaire, Collégien)
6. **Anglais Business** (69.99€, Avancé, Étudiant)

## 🎯 **Prochaines Étapes**

Une fois les tests réussis :

1. **Remplacer Supabase par Laravel** dans les hooks
2. **Supprimer les composants de test** en production
3. **Configurer l'authentification** pour les routes protégées
4. **Implémenter la gestion d'erreurs** avancée
5. **Ajouter la mise en cache** pour les performances

## 📝 **Notes Importantes**

- Les composants de test ne s'affichent qu'en mode développement
- L'API Laravel doit être accessible depuis le frontend
- Les données de test sont créées automatiquement
- Tous les tests doivent passer avant de passer en production

---

**🎉 Félicitations ! Votre intégration frontend-backend est maintenant prête à être testée !**
