// Script de test pour votre API Laravel
// Exécuter avec: node test-laravel-api.js

const API_BASE_URL = 'http://localhost:8000/api';

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
  console.log('🚀 Début des tests d\'intégration API Laravel...\n');

  // Test 1: Vérifier que l'API est accessible
  console.log('1️⃣ Test de connectivité API');
  const healthCheck = await makeRequest('/courses');
  if (!healthCheck) {
    console.log('⚠️  API non accessible, vérifiez que votre serveur Laravel est démarré');
    console.log('💡 Commandes à exécuter:');
    console.log('   cd /Library/back');
    console.log('   php artisan serve');
    return;
  }

  // Test 2: Récupérer tous les cours
  console.log('\n2️⃣ Test: Récupération de tous les cours');
  const courses = await makeRequest('/courses');
  if (courses) {
    console.log(`📚 ${courses.length} cours trouvés`);
    if (courses.length > 0) {
      const firstCourse = courses[0];
      console.log('📋 Structure du premier cours:');
      console.log('   - ID:', firstCourse.id);
      console.log('   - Titre:', firstCourse.title);
      console.log('   - Description:', firstCourse.description?.substring(0, 50) + '...');
      console.log('   - Thumbnail:', firstCourse.thumbnail);
      console.log('   - Durée:', firstCourse.duration);
      console.log('   - Chapitres:', firstCourse.chapters_count);
      console.log('   - Note:', firstCourse.rating);
      console.log('   - Étudiants:', firstCourse.students_count);
      console.log('   - Prix:', firstCourse.price);
      console.log('   - Niveau de difficulté:', firstCourse.difficulty_level);
      console.log('   - Catégorie:', firstCourse.category);
      console.log('   - Niveau d\'éducation:', firstCourse.education_level);
      console.log('   - Premium:', firstCourse.is_premium);
      console.log('   - Thème:', firstCourse.theme);
      console.log('   - Niveau:', firstCourse.level);
      console.log('   - École:', firstCourse.school);
    }
  }

  // Test 3: Filtrage par catégorie
  console.log('\n3️⃣ Test: Filtrage par catégorie (Mathématiques)');
  const mathCourses = await makeRequest('/courses?category=Mathématiques');
  if (mathCourses) {
    console.log(`📐 ${mathCourses.length} cours de mathématiques trouvés`);
  }

  // Test 4: Filtrage par niveau de difficulté
  console.log('\n4️⃣ Test: Filtrage par niveau de difficulté (beginner)');
  const beginnerCourses = await makeRequest('/courses?difficulty_level=beginner');
  if (beginnerCourses) {
    console.log(`🎯 ${beginnerCourses.length} cours débutant trouvés`);
  }

  // Test 5: Filtrage par niveau d'éducation
  console.log('\n5️⃣ Test: Filtrage par niveau d\'éducation (collegien)');
  const collegienCourses = await makeRequest('/courses?education_level=collegien');
  if (collegienCourses) {
    console.log(`🎓 ${collegienCourses.length} cours pour collégiens trouvés`);
  }

  // Test 6: Filtrage par cours premium
  console.log('\n6️⃣ Test: Filtrage par cours premium');
  const premiumCourses = await makeRequest('/courses?is_premium=true');
  if (premiumCourses) {
    console.log(`💎 ${premiumCourses.length} cours premium trouvés`);
  }

  // Test 7: Tri par note
  console.log('\n7️⃣ Test: Tri par note (décroissant)');
  const sortedCourses = await makeRequest('/courses?sort_by=rating&sort_order=desc');
  if (sortedCourses) {
    console.log(`⭐ ${sortedCourses.length} cours triés par note`);
    if (sortedCourses.length > 0) {
      console.log(`   Meilleure note: ${sortedCourses[0].rating}`);
      console.log(`   Cours: ${sortedCourses[0].title}`);
    }
  }

  // Test 8: Tri par nombre d'étudiants
  console.log('\n8️⃣ Test: Tri par nombre d\'étudiants (décroissant)');
  const popularCourses = await makeRequest('/courses?sort_by=students_count&sort_order=desc');
  if (popularCourses) {
    console.log(`🔥 ${popularCourses.length} cours triés par popularité`);
    if (popularCourses.length > 0) {
      console.log(`   Plus populaire: ${popularCourses[0].students_count} étudiants`);
      console.log(`   Cours: ${popularCourses[0].title}`);
    }
  }

  // Test 9: Tri par date de création
  console.log('\n9️⃣ Test: Tri par date de création (décroissant)');
  const recentCourses = await makeRequest('/courses?sort_by=created_at&sort_order=desc');
  if (recentCourses) {
    console.log(`🆕 ${recentCourses.length} cours triés par date`);
    if (recentCourses.length > 0) {
      console.log(`   Plus récent: ${recentCourses[0].created_at}`);
      console.log(`   Cours: ${recentCourses[0].title}`);
    }
  }

  // Test 10: Test de pagination
  console.log('\n🔟 Test: Pagination (limite 2)');
  const limitedCourses = await makeRequest('/courses?limit=2');
  if (limitedCourses) {
    console.log(`📄 ${limitedCourses.length} cours récupérés (limite 2)`);
  }

  // Test 11: Récupération d'un cours spécifique
  if (courses && courses.length > 0) {
    console.log('\n1️⃣1️⃣ Test: Récupération d\'un cours spécifique');
    const firstCourseId = courses[0].id;
    const courseDetail = await makeRequest(`/courses/${firstCourseId}`);
    if (courseDetail) {
      console.log(`📖 Détails du cours ${firstCourseId} récupérés`);
    }
  }

  console.log('\n🎉 Tests terminés !');
  console.log('\n📝 Résumé:');
  console.log('   - Vérifiez que tous les tests sont passés');
  console.log('   - Notez les erreurs éventuelles');
  console.log('   - Vérifiez que la structure des données correspond à vos attentes');
  
  console.log('\n🔧 Prochaines étapes:');
  console.log('   1. Démarrer votre serveur Laravel: cd /Library/back && php artisan serve');
  console.log('   2. Exécuter les migrations: php artisan migrate');
  console.log('   3. Exécuter les seeders: php artisan db:seed');
  console.log('   4. Tester l\'intégration frontend avec ce service');
}

// Exécuter les tests
runTests().catch(console.error);
