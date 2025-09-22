# Test du Service API Internship

## 🚀 Démarrage Rapide

### 1. Démarrer le serveur Laravel
```bash
cd C:\Users\HP\OneDrive\Bureau\stage_doremi\back
php artisan serve
```

### 2. Tester l'API directement
Ouvrez la console du navigateur et exécutez :
```javascript
// Test rapide de connectivité
fetch('http://localhost:8000/api/internships')
  .then(response => response.json())
  .then(data => console.log('API OK:', data))
  .catch(error => console.error('Erreur:', error));
```

### 3. Tester le service TypeScript
```typescript
// Dans un composant React ou la console
import { apiInternshipService } from '@/lib/apiInternshipService';

// Test simple
const test = async () => {
  try {
    const internships = await apiInternshipService.getAllInternships();
    console.log(`${internships.length} stages trouvés`);
  } catch (error) {
    console.error('Erreur:', error.message);
  }
};

test();
```

## 🔧 Vérifications

### ✅ Checklist de Base
- [ ] Serveur Laravel démarré sur http://localhost:8000
- [ ] Route `/api/internships` accessible
- [ ] Base de données configurée
- [ ] Migrations exécutées
- [ ] Données de test disponibles

### ✅ Tests Fonctionnels
- [ ] `getAllInternships()` retourne un tableau
- [ ] `searchInternships()` fonctionne avec des filtres
- [ ] `getInternshipStats()` retourne des statistiques
- [ ] Gestion d'erreurs fonctionne
- [ ] Logs s'affichent dans la console

## 🐛 Dépannage

### Erreur "Failed to fetch"
- Vérifiez que le serveur Laravel est démarré
- Vérifiez l'URL dans le service (http://localhost:8000/api)

### Erreur 404
- Vérifiez les routes Laravel : `php artisan route:list`
- Exécutez les migrations : `php artisan migrate`

### Erreur CORS
- Configurez CORS dans Laravel
- Vérifiez les headers de la requête

### Erreur TypeScript
- Vérifiez les types dans les interfaces
- Assurez-vous que les imports sont corrects

## 📊 Exemple d'Utilisation

```typescript
// Composant React
import React, { useState, useEffect } from 'react';
import { apiInternshipService, Internship } from '@/lib/apiInternshipService';

export const InternshipList: React.FC = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInternships = async () => {
      try {
        const data = await apiInternshipService.getAllInternships();
        setInternships(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur');
      } finally {
        setLoading(false);
      }
    };

    loadInternships();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      <h2>Stages disponibles ({internships.length})</h2>
      {internships.map(internship => (
        <div key={internship.id}>
          <h3>{internship.title}</h3>
          <p>{internship.company} - {internship.location}</p>
        </div>
      ))}
    </div>
  );
};
```

## 🎯 Prochaines Étapes

1. **Tester avec des données réelles**
2. **Implémenter l'authentification**
3. **Ajouter la gestion des candidatures**
4. **Intégrer dans l'application principale**

Le service est maintenant corrigé et prêt à être utilisé ! 🎉
