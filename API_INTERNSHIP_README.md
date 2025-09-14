# API Internship Service - Documentation

Ce service permet de consommer l'API Laravel des stages de manière simple et efficace.

## 🚀 Installation et Configuration

### 1. Import du service

```typescript
import { apiInternshipService, Internship, CreateInternshipData } from '@/lib/apiInternshipService';
```

### 2. Configuration de l'URL de base

Par défaut, le service utilise `http://localhost:8000/api`. Pour changer l'URL :

```typescript
import { ApiInternshipService } from '@/lib/apiInternshipService';

const customService = new ApiInternshipService('https://votre-api.com/api');
```

## 📋 Fonctionnalités Disponibles

### 🔍 Consultation Publique (sans authentification)

#### Récupérer tous les stages
```typescript
const internships = await apiInternshipService.getAllInternships();
console.log(`${internships.length} stages trouvés`);
```

#### Récupérer un stage spécifique
```typescript
const internship = await apiInternshipService.getInternshipById(1);
console.log(`Stage: ${internship.title}`);
```

#### Rechercher des stages
```typescript
const results = await apiInternshipService.searchInternships({
  q: 'développement',
  type: 'stage',
  location: 'Dakar',
  remote: false
});
```

### 🔐 Fonctionnalités Authentifiées (recruteurs)

#### Créer un nouveau stage
```typescript
const newStage: CreateInternshipData = {
  title: 'Stage Développeur Full Stack',
  company: 'TechCorp Sénégal',
  description: 'Description du stage...',
  location: 'Dakar, Sénégal',
  duration: '6 mois',
  requirements: ['JavaScript', 'React', 'Laravel'],
  application_deadline: '2024-12-31',
  salary: '150000 FCFA',
  type: 'stage',
  remote: false,
  is_premium: true,
  tags: ['Développement', 'Web', 'Full Stack']
};

const created = await apiInternshipService.createInternship(newStage);
```

#### Mettre à jour un stage
```typescript
const updated = await apiInternshipService.updateInternship(1, {
  status: 'active',
  salary: '200000 FCFA',
  is_premium: true
});
```

#### Supprimer un stage
```typescript
await apiInternshipService.deleteInternship(1);
```

#### Récupérer mes offres
```typescript
const myOffers = await apiInternshipService.getMyOffers();
console.log(`J'ai ${myOffers.length} offres`);
```

### 📝 Gestion des Demandes de Stage

#### Soumettre une demande
```typescript
const cvFile = new File([cvData], 'cv.pdf', { type: 'application/pdf' });
const request = await apiInternshipService.submitInternshipRequest(
  1, // ID du stage
  cvFile,
  'Lettre de motivation...'
);
```

#### Récupérer mes demandes
```typescript
const myRequests = await apiInternshipService.getUserInternshipRequests(userId);
```

#### Mettre à jour le statut d'une demande (admin/recruteur)
```typescript
const updated = await apiInternshipService.updateInternshipRequestStatus(
  requestId,
  'accepted',
  'Candidature retenue'
);
```

## 🔑 Authentification

### Vérifier l'état de connexion
```typescript
if (apiInternshipService.isAuthenticated()) {
  console.log('Utilisateur connecté');
} else {
  console.log('Authentification requise');
}
```

### Mettre à jour le token
```typescript
apiInternshipService.updateToken('votre-token-jwt');
```

### Déconnexion
```typescript
apiInternshipService.logout();
```

## 📊 Statistiques et Utilitaires

### Obtenir les statistiques
```typescript
const stats = await apiInternshipService.getInternshipStats();
console.log(`Total: ${stats.total}, Actifs: ${stats.active}, Premium: ${stats.premium}`);
```

### Formater un stage pour l'affichage
```typescript
const formatted = apiInternshipService.formatInternshipForDisplay(internship);
console.log(formatted.formattedDeadline); // Date formatée
console.log(formatted.formattedSalary);   // Salaire formaté
```

## 🛠️ Gestion des Erreurs

Le service gère automatiquement les erreurs HTTP et les convertit en exceptions JavaScript :

```typescript
try {
  const internship = await apiInternshipService.getInternshipById(999);
} catch (error) {
  if (error.message.includes('404')) {
    console.log('Stage non trouvé');
  } else if (error.message.includes('401')) {
    console.log('Authentification requise');
  } else if (error.message.includes('403')) {
    console.log('Accès refusé');
  } else {
    console.log('Erreur:', error.message);
  }
}
```

## 📱 Utilisation avec React

### Hook personnalisé
```typescript
import { useState, useEffect } from 'react';
import { apiInternshipService, Internship } from '@/lib/apiInternshipService';

export function useInternships() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadInternships = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiInternshipService.getAllInternships();
      setInternships(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInternships();
  }, []);

  return { internships, loading, error, reload: loadInternships };
}
```

### Composant d'exemple
```typescript
import React from 'react';
import { useInternships } from './hooks/useInternships';

export function InternshipList() {
  const { internships, loading, error } = useInternships();

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      {internships.map(internship => (
        <div key={internship.id}>
          <h3>{internship.title}</h3>
          <p>{internship.company} - {internship.location}</p>
        </div>
      ))}
    </div>
  );
}
```

## 🔧 Configuration Avancée

### Headers personnalisés
Le service utilise automatiquement les headers appropriés :
- `Content-Type: application/json`
- `Accept: application/json`
- `Authorization: Bearer {token}` (si authentifié)

### Gestion des tokens
Le service charge automatiquement le token depuis `localStorage` avec la clé `doremi_user`.

## 📚 Types TypeScript

### Interface Internship
```typescript
interface Internship {
  id: number;
  title: string;
  description: string;
  location: string;
  company: string;
  duration?: string;
  requirements?: string[];
  application_deadline?: string;
  salary?: string;
  type?: 'stage' | 'alternance' | 'emploi';
  remote?: boolean;
  is_premium?: boolean;
  views: number;
  applications: number;
  rating?: number;
  logo?: string;
  image?: string;
  tags?: string[];
  recruiter_id: number;
  status?: 'active' | 'expired' | 'closed';
  created_at: string;
  updated_at: string;
  recruiter?: {
    id: number;
    name: string;
    email: string;
    company?: string;
  };
}
```

### Interface CreateInternshipData
```typescript
interface CreateInternshipData {
  title: string;
  company: string;
  description: string;
  location: string;
  duration?: string;
  requirements?: string[];
  application_deadline?: string;
  salary?: string;
  type?: 'stage' | 'alternance' | 'emploi';
  remote?: boolean;
  is_premium?: boolean;
  tags?: string[];
}
```

## 🚨 Codes d'Erreur Courants

- **401 Unauthorized**: Token manquant ou invalide
- **403 Forbidden**: Accès refusé (rôle insuffisant)
- **404 Not Found**: Ressource non trouvée
- **422 Unprocessable Entity**: Données de validation invalides
- **500 Internal Server Error**: Erreur serveur

## 📞 Support

Pour toute question ou problème :
1. Vérifiez que l'API Laravel est démarrée
2. Vérifiez l'URL de base du service
3. Vérifiez l'authentification si nécessaire
4. Consultez les logs de la console pour plus de détails

## 🔄 Migration depuis l'ancien service

Si vous utilisez l'ancien `internshipService` basé sur localStorage :

1. Remplacez les imports :
   ```typescript
   // Ancien
   import { internshipService } from '@/lib/internshipService';
   
   // Nouveau
   import { apiInternshipService } from '@/lib/apiInternshipService';
   ```

2. Adaptez les appels de méthodes :
   ```typescript
   // Ancien
   const applications = internshipService.getApplications();
   
   // Nouveau
   const requests = await apiInternshipService.getAllInternshipRequests();
   ```

3. Gérez les promesses :
   ```typescript
   // Ancien (synchrone)
   const internships = internshipService.getInternships();
   
   // Nouveau (asynchrone)
   const internships = await apiInternshipService.getAllInternships();
   ```
