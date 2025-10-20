// Script de test pour vérifier l'intégration avec votre backend
// Exécuter avec: node test-backend-integration.js

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000/api';

// Configuration des headers
const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  // Ajoutez votre token d'authentification si nécessaire
  // 'Authorization': 'Bearer YOUR_TOKEN_HERE'
};

// Fonction utilitaire pour les requêtes
async function makeRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    console.log(`🔍 Test: ${options.method || 'GET'} ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    console.log(`📊 Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ Erreur: ${errorText}`);
      return null;
    }

    const data = await response.json();
    console.log(`✅ Succès: ${JSON.stringify(data, null, 2)}`);
    return data;
  } catch (error) {
    console.error(`💥 Erreur réseau:`, error.message);
    return null;
  }
}

// Tests à exécuter
async function runTests() {
  console.log('🚀 Début des tests d\'intégration backend...\n');

  // Test 1: Vérifier que l'API est accessible
  console.log('1️⃣ Test de connectivité API');
  const healthCheck = await makeRequest('/health');
  if (!healthCheck) {
    console.log('⚠️  Endpoint /health non disponible, test des cours directement\n');
  }

  // Test 2: Récupérer tous les cours
  console.log('\n2️⃣ Test: Récupération de tous les cours');
  const courses = await makeRequest('/courses');
  if (courses) {
    console.log(`📚 ${courses.length} cours trouvés`);
  }

  // Test 3: Récupérer un cours spécifique (si des cours existent)
  if (courses && courses.length > 0) {
    console.log('\n3️⃣ Test: Récupération d\'un cours spécifique');
    const firstCourse = courses[0];
    const courseDetail = await makeRequest(`/courses/${firstCourse.id}`);
  }

  // Test 4: Recherche de cours
  console.log('\n4️⃣ Test: Recherche de cours');
  const searchResults = await makeRequest('/courses?search=math');
  if (searchResults) {
    console.log(`🔍 ${searchResults.length} résultats de recherche trouvés`);
  }

  // Test 5: Filtres par catégorie
  console.log('\n5️⃣ Test: Filtres par catégorie');
  const mathCourses = await makeRequest('/courses?category=Mathématiques');
  if (mathCourses) {
    console.log(`📐 ${mathCourses.length} cours de mathématiques trouvés`);
  }

  // Test 6: Cours populaires
  console.log('\n6️⃣ Test: Cours populaires');
  const popularCourses = await makeRequest('/courses/popular?limit=5');
  if (popularCourses) {
    console.log(`🔥 ${popularCourses.length} cours populaires trouvés`);
  }

  // Test 7: Cours récents
  console.log('\n7️⃣ Test: Cours récents');
  const recentCourses = await makeRequest('/courses/recent?limit=5');
  if (recentCourses) {
    console.log(`🆕 ${recentCourses.length} cours récents trouvés`);
  }

  // Test 8: Statistiques
  console.log('\n8️⃣ Test: Statistiques des cours');
  const stats = await makeRequest('/courses/stats');
  if (stats) {
    console.log('📊 Statistiques récupérées');
  }

  // Test 9: Test de création de cours (si authentifié)
  console.log('\n9️⃣ Test: Création de cours (nécessite authentification)');
  const testCourse = {
    title: 'Test Course - Mathématiques',
    description: 'Un cours de test',
    teacher_id: '1',
    category: 'Mathématiques',
    level: 'beginner',
    education_level: 'etudiant',
    duration: '2h',
    chapters_count: 5,
    is_premium: false,
    price: 0
  };

  const createdCourse = await makeRequest('/courses', {
    method: 'POST',
    body: JSON.stringify(testCourse)
  });

  if (createdCourse) {
    console.log('✅ Cours de test créé avec succès');
    
    // Test 10: Suppression du cours de test
    console.log('\n🔟 Test: Suppression du cours de test');
    await makeRequest(`/courses/${createdCourse.id}`, {
      method: 'DELETE'
    });
    console.log('🗑️  Cours de test supprimé');
  }

  console.log('\n🎉 Tests terminés !');
}

// Exécuter les tests
runTests().catch(console.error);
