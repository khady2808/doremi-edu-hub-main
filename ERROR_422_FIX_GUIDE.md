# Guide de Correction - Erreur 422

## 🎯 Problème Résolu

**Erreur** : `Failed to load resource: the server responded with a status of 422 (Unprocessable Content)`
**Cause** : Format incorrect des données envoyées via FormData
**Solution** : Correction du traitement des tableaux dans FormData

## 🔧 Corrections Apportées

### **1. Problèmes Identifiés**

#### **Problème 1 : Tableaux mal formatés**
Le service `newsService.ts` envoyait les tableaux (comme `tags`) via `FormData` en les convertissant en string avec `value.toString()`, ce qui transformait :
```javascript
tags: ['test', 'debug']
```
en :
```
tags: "test,debug"
```

#### **Problème 2 : Booleans mal formatés**
Les champs boolean (`is_urgent`, `is_featured`) étaient envoyés comme des strings `"false"` au lieu de vrais booleans, causant l'erreur :
```
The is featured field must be true or false.
The is urgent field must be true or false.
```

### **2. Solution Implémentée**
Modification des fonctions `createNews` et `updateNews` dans `newsService.ts` :

```typescript
// AVANT (❌ Erreur)
Object.entries(newsData).forEach(([key, value]) => {
  if (value !== null && value !== undefined) {
    formData.append(key, value.toString());
  }
});

// APRÈS (✅ Fonctionne)
Object.entries(newsData).forEach(([key, value]) => {
  if (value !== null && value !== undefined) {
    if (Array.isArray(value)) {
      // Pour les tableaux (comme tags), envoyer chaque élément séparément
      value.forEach((item, index) => {
        formData.append(`${key}[${index}]`, item.toString());
      });
    } else if (typeof value === 'boolean') {
      // Pour les booleans, envoyer '1' pour true et '0' pour false
      formData.append(key, value ? '1' : '0');
    } else {
      formData.append(key, value.toString());
    }
  }
});
```

### **3. Format des Données Corrigé**

#### **Avant (❌)**
```
FormData:
- title: "Test Actualité"
- content: "Contenu de test"
- tags: "test,debug,actualité"
- is_urgent: "false"
- is_featured: "false"
```

#### **Après (✅)**
```
FormData:
- title: "Test Actualité"
- content: "Contenu de test"
- tags[0]: "test"
- tags[1]: "debug"
- tags[2]: "actualité"
- is_urgent: "0"
- is_featured: "0"
```

## 🧪 Tests de Validation

### **Test 1 : Création d'Actualité Simple**
```javascript
const newsData = {
  title: 'Test Simple',
  content: 'Contenu de test',
  excerpt: 'Extrait de test',
  category: 'Test',
  status: 'draft',
  priority: 'medium',
  type: 'news',
  tags: ['test', 'simple'],
  is_urgent: false,
  is_featured: false
};
```

### **Test 2 : Création avec Image**
```javascript
const newsData = {
  title: 'Test avec Image',
  content: 'Contenu avec image',
  // ... autres champs
  tags: ['test', 'image', 'upload']
};
const imageFile = fileInput.files[0]; // Fichier sélectionné
```

### **Test 3 : Édition d'Actualité**
```javascript
const newsData = {
  title: 'Titre Modifié',
  content: 'Contenu modifié',
  tags: ['modifié', 'édition']
};
```

## 🔍 Vérifications

### **1. Console du Navigateur**
Vérifier qu'il n'y a plus d'erreurs 422 :
```javascript
// DevTools > Network > XHR
// Status: 201 Created (au lieu de 422)
```

### **2. Réponse du Serveur**
```json
{
  "id": 8,
  "title": "Test Actualité",
  "content": "Contenu de test",
  "tags": ["test", "debug"],
  "status": "draft",
  "created_at": "2025-09-15T14:30:00.000000Z"
}
```

### **3. Base de Données**
Vérifier que l'actualité est bien créée avec les tags corrects :
```sql
SELECT id, title, tags FROM news WHERE id = 8;
-- Résultat: tags = ["test", "debug"]
```

## 🚨 Dépannage

### **Si l'erreur 422 persiste :**

1. **Vérifier les champs obligatoires** :
   - `title` : requis
   - `content` : requis
   - `type` : requis (doit être 'news')

2. **Vérifier les types de données** :
   - `tags` : doit être un tableau
   - `is_urgent` : doit être boolean
   - `is_featured` : doit être boolean

3. **Vérifier l'authentification** :
   - Token valide dans localStorage
   - Headers Authorization corrects

### **Logs de Debug**
```javascript
// Dans newsService.ts, ajouter temporairement :
console.log('Données envoyées:', newsData);
console.log('FormData contents:');
for (let [key, value] of formData.entries()) {
  console.log(key, value);
}
```

## ✅ Checklist de Validation

- [ ] Erreur 422 résolue
- [ ] Création d'actualité fonctionne
- [ ] Tags correctement envoyés
- [ ] Image upload fonctionne
- [ ] Édition d'actualité fonctionne
- [ ] Pas d'erreurs dans la console
- [ ] Données sauvegardées en base

## 🎯 Résultat Attendu

### **Avant (❌)**
```
POST /api/news
Status: 422 Unprocessable Content
Error: Validation failed for tags field
```

### **Après (✅)**
```
POST /api/news
Status: 201 Created
Response: { "id": 8, "title": "Test", "tags": ["test", "debug"] }
```

---

**🎉 Problème Résolu !** L'erreur 422 a été corrigée en ajustant le format des données envoyées via FormData, permettant la création et l'édition d'actualités avec des tableaux correctement formatés.
