# Utilisation de l'API Schools

Ce guide montre comment consommer l'API des écoles dans votre application.

## Configuration

Le service est déjà configuré dans `src/lib/schoolsService.ts` et `src/config/api.ts`.

## Interface School

```typescript
interface School {
  id: number;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
  // ... autres propriétés
}
```

## Utilisation du service

### 1. Récupérer toutes les écoles

```typescript
import { schoolsService } from '@/lib/schoolsService';

// Liste simple
const schools = await schoolsService.getSchools();

// Avec pagination
const result = await schoolsService.getSchools({ 
  per_page: 10, 
  page: 1 
});

// Avec filtres
const publicSchools = await schoolsService.getSchools({
  type: 'public',
  city: 'Paris',
  sort_by: 'name',
  sort_order: 'asc'
});
```

### 2. Récupérer une école spécifique

```typescript
import { schoolsService } from '@/lib/schoolsService';

const school = await schoolsService.getSchoolById(1);
console.log(school.name);
console.log(school.logo_url);
```

### 3. Rechercher des écoles

```typescript
import { schoolsService } from '@/lib/schoolsService';

const results = await schoolsService.searchSchools('université paris');
```

### 4. Filtrer par ville

```typescript
import { schoolsService } from '@/lib/schoolsService';

const parisSchools = await schoolsService.getSchoolsByCity('Paris');
```

### 5. Filtrer par pays

```typescript
import { schoolsService } from '@/lib/schoolsService';

const moroccoSchools = await schoolsService.getSchoolsByCountry('Morocco');
```

### 6. Filtrer par type

```typescript
import { schoolsService } from '@/lib/schoolsService';

const publicSchools = await schoolsService.getSchoolsByType('public');
const privateSchools = await schoolsService.getSchoolsByType('private');
```

### 7. Filtrer par niveau

```typescript
import { schoolsService } from '@/lib/schoolsService';

const highSchools = await schoolsService.getSchoolsByLevel('high');
const universities = await schoolsService.getSchoolsByLevel('university');
```

## Exemple dans un composant React

```tsx
import { useState, useEffect } from 'react';
import { schoolsService, School } from '@/lib/schoolsService';

function SchoolsList() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSchools() {
      try {
        setLoading(true);
        const data = await schoolsService.getSchools();
        setSchools(Array.isArray(data) ? data : data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    }

    fetchSchools();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      <h1>Liste des écoles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schools.map((school) => (
          <div key={school.id} className="border p-4 rounded">
            {school.logo_url && (
              <img src={school.logo_url} alt={school.name} className="w-full h-32 object-cover" />
            )}
            <h2>{school.name}</h2>
            <p>{school.description}</p>
            <p>{school.city}, {school.country}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SchoolsList;
```

## Utilisation avec le hook personnalisé

```tsx
import { useSchools } from '@/lib/schoolsService';
import { useState, useEffect } from 'react';

function SchoolsComponent() {
  const { getSchools, getSchoolById } = useSchools();
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    getSchools().then(setSchools);
  }, []);

  return (
    <div>
      {/* Votre contenu */}
    </div>
  );
}
```

## Gestion des erreurs

```typescript
import { schoolsService } from '@/lib/schoolsService';

try {
  const school = await schoolsService.getSchoolById(1);
  console.log(school);
} catch (error) {
  if (error instanceof Error) {
    console.error('Erreur:', error.message);
  }
}
```

## Endpoints API Laravel

Les routes suivantes sont consommées :

- `GET /schools` - Liste des écoles (avec pagination et filtres)
- `GET /schools/{id}` - Détails d'une école

### Paramètres de filtrage pour GET /schools

- `city` - Filtrer par ville
- `country` - Filtrer par pays
- `type` - Filtrer par type (public/private/charter)
- `level` - Filtrer par niveau (elementary/middle/high/university)
- `search` - Recherche textuelle
- `sort_by` - Champ de tri
- `sort_order` - Ordre de tri (asc/desc)
- `per_page` - Nombre d'éléments par page
- `page` - Numéro de page

### Exemple de requête complète

```typescript
const schools = await schoolsService.getSchools({
  city: 'Casablanca',
  type: 'public',
  sort_by: 'name',
  sort_order: 'asc',
  per_page: 20,
  page: 1
});
```

Cette requête correspond à : 
`GET /schools?city=Casablanca&type=public&sort_by=name&sort_order=asc&per_page=20&page=1`

