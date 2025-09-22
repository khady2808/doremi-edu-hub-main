# Guide de Test d'Intégration API

## 🎯 Objectif
Ce guide vous aide à tester l'intégration entre le frontend React et l'API Laravel pour l'authentification.

## 📋 Prérequis

### 1. Backend Laravel
Assurez-vous que le serveur Laravel est démarré :
```bash
cd c:\mes_projets\stage_doremi\back
php artisan serve
```
Le serveur doit être accessible sur `http://localhost:8000`

### 2. Frontend React
Assurez-vous que le serveur React est démarré :
```bash
cd c:\mes_projets\doremi-edu-hub-main
npm start
```
Le serveur doit être accessible sur `http://localhost:3000`

### 3. Variables d'environnement
Vérifiez que le fichier `.env.local` existe avec :
```env
VITE_API_URL=http://localhost:8000/api
VITE_IMAGE_URL=http://localhost:8000/storage
```

## 🧪 Tests à effectuer

### 1. Test de connectivité API
1. Naviguez vers `http://localhost:3000/api-test`
2. Cliquez sur "Lancer les tests"
3. Vérifiez que tous les tests passent :
   - ✅ Configuration API
   - ✅ Connexion API
   - ✅ Authentification
   - ✅ Inscription

### 2. Test de connexion
1. Naviguez vers `http://localhost:3000/login`
2. Utilisez les identifiants de test :
   - **Email** : `test@doremi.fr`
   - **Mot de passe** : `password123`
3. Vérifiez que la connexion fonctionne
4. Vérifiez la redirection selon le rôle

### 3. Test d'inscription
1. Naviguez vers `http://localhost:3000/login`
2. Cliquez sur l'onglet "Inscription"
3. Remplissez le formulaire avec :
   - **Nom** : Votre nom
   - **Email** : Un email unique (ex: `test@example.com`)
   - **Mot de passe** : `password123`
   - **Rôle** : Étudiant
   - **Cycle** : Licence
4. Cliquez sur "S'inscrire"
5. Vérifiez que l'inscription fonctionne

### 4. Test des comptes de test
Testez les comptes de test (maintenant dans la base de données Laravel) :
- **Admin** : `admin@doremi.fr` / `password123`
- **Formateur** : `formateur@doremi.fr` / `password123`
- **Recruteur** : `recruteur@doremi.fr` / `password123`
- **Étudiant** : `etudiant@doremi.fr` / `password123`

**Note** : Ces comptes sont maintenant créés dans la base de données Laravel et utilisent l'API.

## 🔍 Diagnostic des problèmes

### Console du navigateur
Ouvrez la console (F12) et vérifiez les logs :
- 🔐 Tentative de connexion avec l'API
- ✅ Connexion API réussie
- ❌ Erreur API de connexion

### Problèmes courants

#### 1. "API non accessible"
**Cause** : Le serveur Laravel n'est pas démarré
**Solution** : Démarrer le serveur Laravel avec `php artisan serve`

#### 2. "Erreur CORS"
**Cause** : CORS non configuré
**Solution** : Vérifier la configuration CORS dans Laravel

#### 3. "Personal access client not found"
**Cause** : Laravel Passport non configuré
**Solution** : Exécuter `php artisan passport:install`

#### 4. "Variables d'environnement non chargées"
**Cause** : Fichier `.env.local` manquant
**Solution** : Créer le fichier avec les bonnes variables

## 📊 Résultats attendus

### Connexion réussie
- Redirection vers le dashboard
- Utilisateur connecté dans le contexte
- Token stocké dans localStorage

### Inscription réussie
- Message de succès
- Utilisateur automatiquement connecté
- Redirection vers le dashboard

### Comptes de test
- Tous les comptes utilisent maintenant l'API Laravel
- Les comptes de test sont créés dans la base de données
- Plus de fallback mock - tout passe par l'API

## 🚀 Prochaines étapes

Une fois les tests passés :
1. **Développement** : Continuer avec d'autres fonctionnalités
2. **Production** : Configurer les variables d'environnement de production
3. **Sécurité** : Implémenter HTTPS et autres mesures de sécurité
4. **Monitoring** : Ajouter des logs et monitoring

## 📞 Support

En cas de problème :
1. Vérifiez les logs de la console
2. Vérifiez les logs du serveur Laravel
3. Utilisez l'outil de test API (`/api-test`)
4. Consultez la documentation d'intégration
