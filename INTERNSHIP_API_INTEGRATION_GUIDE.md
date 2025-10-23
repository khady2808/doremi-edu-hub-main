# 🚀 Guide d'Intégration API Stages

Ce guide explique comment utiliser l'API des stages dans votre application React.

## 📋 Vue d'ensemble

L'intégration de l'API des stages permet de :
- ✅ Récupérer les offres de stage depuis l'API Laravel
- ✅ Combiner les données API avec les offres locales
- ✅ Gérer les erreurs et le mode hors ligne
- ✅ Afficher les stages avec une interface moderne

## 🔧 Configuration

### URL de l'API
- **API Stages** : `http://localhost:8000/api/internships`
- **Documentation Swagger** : `http://localhost:8000/api/documentation`

### Configuration dans `src/config/api.ts`
```typescript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  ENDPOINTS: {
    INTERNSHIPS: '/internships',
  },
};
```

## 📦 Services Disponibles

### 1. Service API Principal (`src/services/internshipApi.ts`)

```typescript
import { internshipApiService } from '@/services/internshipApi';

// Récupérer tous les stages
const internships = await internshipApiService.getAllInternships();

// Rechercher des stages
const results = await internshipApiService.searchInternships('développeur', {
  type: 'stage',
  location: 'dakar'
});

// Récupérer un stage par ID
const internship = await internshipApiService.getInternshipById('1');

// Obtenir les statistiques
const stats = await internshipApiService.getInternshipStats();

// Tester la connectivité
const test = await internshipApiService.testConnectivity();
```

### 2. Interface des Données

```typescript
interface Internship {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  type: 'stage' | 'alternance' | 'emploi';
  duration: string;
  requirements: string[];
  benefits: string[];
  applicationDeadline: string;
  salary?: string;
  remote: boolean;
  status: 'active' | 'expired' | 'closed';
  createdAt: string;
  updatedAt: string;
  // Champs supplémentaires pour l'interface
  views?: number;
  applications?: number;
  rating?: number;
  logo?: string;
  image?: string;
  tags?: string[];
}
```

## 🎯 Composants Disponibles

### 1. Test de Connectivité (`InternshipConnectivityTest`)
Composant simple pour tester la connexion à l'API.

```typescript
import { InternshipConnectivityTest } from '@/components/InternshipConnectivityTest';

<InternshipConnectivityTest />
```

### 2. Test API Complet (`InternshipApiTest`)
Interface complète pour tester et visualiser l'API.

```typescript
import { InternshipApiTest } from '@/components/InternshipApiTest';

<InternshipApiTest />
```

### 3. Page de Test (`InternshipTestPage`)
Page dédiée pour tester l'API des stages.

**URL** : `/internship-api-test`

## 🔄 Intégration dans les Pages Existantes

### Page des Stages (`src/pages/Stages.tsx`)

La page des stages a été mise à jour pour :
- ✅ Charger les données depuis l'API Laravel
- ✅ Combiner avec les offres locales des recruteurs
- ✅ Gérer le mode hors ligne en cas d'erreur API
- ✅ Afficher un message de fallback approprié

```typescript
// Chargement hybride (API + Local)
const loadOffers = async () => {
  try {
    // 1. Charger depuis l'API
    const apiOffers = await internshipApiService.getAllInternships();
    
    // 2. Charger depuis le service local
    const localOffers = offersService.getAll();
    
    // 3. Combiner les deux sources
    const allOffers = [...apiOffers, ...localOffers];
    setOffers(allOffers);
  } catch (error) {
    // Fallback: utiliser seulement les données locales
    const localOffers = offersService.getAll();
    setOffers(localOffers);
  }
};
```

## 🧪 Tests et Débogage

### 1. Test de Connectivité
```bash
# Via PowerShell
Invoke-WebRequest -Uri "http://localhost:8000/api/internships" -Method GET -Headers @{"Accept"="application/json"; "Content-Type"="application/json"}
```

### 2. Test via l'Interface
- Accédez à `/internship-api-test` dans votre application
- Cliquez sur "Tester la connexion"
- Vérifiez les logs dans la console du navigateur

### 3. Logs de Débogage
Les services incluent des logs détaillés :
```typescript
console.log('📦 Chargement des stages depuis l\'API...');
console.log('📋 Stages chargés depuis l\'API:', apiOffers);
console.log('🔄 Toutes les offres combinées:', allOffers);
```

## 🚨 Gestion des Erreurs

### Erreurs API
- **404** : Stage non trouvé
- **500** : Erreur serveur
- **Network** : Problème de connectivité

### Mode Hors Ligne
En cas d'erreur API, l'application bascule automatiquement vers les données locales.

```typescript
try {
  const apiOffers = await internshipApiService.getAllInternships();
  setOffers(apiOffers);
} catch (error) {
  // Fallback vers les données locales
  const localOffers = offersService.getAll();
  setOffers(localOffers);
  toast({
    title: "Mode hors ligne",
    description: "Chargement depuis les données locales uniquement",
  });
}
```

## 📊 Fonctionnalités Disponibles

### 1. Récupération des Données
- ✅ Tous les stages
- ✅ Recherche par terme
- ✅ Filtrage par type (stage/alternance/emploi)
- ✅ Filtrage par localisation
- ✅ Filtrage par télétravail

### 2. Statistiques
- ✅ Nombre total de stages
- ✅ Stages actifs/expirés/fermés
- ✅ Répartition par type
- ✅ Répartition par localisation

### 3. Interface Utilisateur
- ✅ Affichage en cartes
- ✅ Recherche en temps réel
- ✅ Filtres multiples
- ✅ Statuts visuels
- ✅ Responsive design

## 🔧 Personnalisation

### Modifier l'URL de l'API
```typescript
// Dans src/config/api.ts
export const API_CONFIG = {
  BASE_URL: 'http://votre-api.com/api',
  // ...
};
```

### Ajouter des Filtres
```typescript
// Dans src/services/internshipApi.ts
interface SearchParams {
  search?: string;
  type?: string;
  location?: string;
  remote?: boolean;
  salary_min?: number;  // Nouveau filtre
  salary_max?: number;  // Nouveau filtre
  // ...
}
```

### Personnaliser l'Affichage
```typescript
// Dans src/services/internshipApi.ts
private generateTags(type: string, location: string): string[] {
  // Ajouter vos propres règles de génération de tags
}
```

## 📱 Utilisation

### 1. Accès aux Stages
- **Page principale** : `/internships`
- **Test API** : `/internship-api-test`

### 2. Navigation
- Utilisez la barre de navigation principale
- Les stages sont accessibles depuis le menu "Stages"

### 3. Recherche
- Utilisez la barre de recherche en haut
- Filtrez par type et localisation
- Les résultats se mettent à jour en temps réel

## 🚀 Prochaines Étapes

1. **Tester l'intégration** avec votre API Laravel
2. **Personnaliser l'interface** selon vos besoins
3. **Ajouter des fonctionnalités** supplémentaires
4. **Optimiser les performances** si nécessaire

## 📞 Support

En cas de problème :
1. Vérifiez que l'API Laravel est accessible
2. Consultez les logs dans la console du navigateur
3. Testez la connectivité via `/internship-api-test`
4. Vérifiez la configuration dans `src/config/api.ts`

---

**🎉 Félicitations !** Votre application est maintenant intégrée avec l'API des stages Laravel !
