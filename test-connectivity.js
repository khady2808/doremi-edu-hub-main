// Script de test de connectivité Backend/Frontend
console.log('🔍 Test de connectivité Backend/Frontend...\n');

// Test 1: Vérifier que le backend répond
async function testBackend() {
  try {
    console.log('1️⃣ Test du backend Laravel (port 8000)...');
    const response = await fetch('http://localhost:8000/api/internships', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend Laravel: OK');
      console.log(`   Status: ${response.status}`);
      console.log(`   Données reçues: ${Array.isArray(data) ? data.length : 'Object'} éléments`);
    } else {
      console.log(`❌ Backend Laravel: Erreur ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Backend Laravel: Non accessible');
    console.log(`   Erreur: ${error.message}`);
  }
}

// Test 2: Vérifier que le frontend répond
async function testFrontend() {
  try {
    console.log('\n2️⃣ Test du frontend React (port 8080)...');
    const response = await fetch('http://localhost:8080', {
      method: 'GET'
    });
    
    if (response.ok) {
      console.log('✅ Frontend React: OK');
      console.log(`   Status: ${response.status}`);
    } else {
      console.log(`❌ Frontend React: Erreur ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Frontend React: Non accessible');
    console.log(`   Erreur: ${error.message}`);
  }
}

// Test 3: Test de l'API avec notre service
async function testApiService() {
  try {
    console.log('\n3️⃣ Test du service API...');
    
    // Import dynamique du service
    const { cleanApiService } = await import('./src/lib/cleanApiService.js');
    
    console.log('   Service importé avec succès');
    console.log(`   URL de base: ${cleanApiService.baseUrl || 'Non défini'}`);
    console.log(`   Authentifié: ${cleanApiService.isAuthenticated() ? 'Oui' : 'Non'}`);
    
    // Test de récupération des stages
    try {
      const internships = await cleanApiService.getAllInternships();
      console.log('✅ Service API: Fonctionne');
      console.log(`   Stages récupérés: ${internships.length}`);
    } catch (error) {
      console.log('⚠️ Service API: Erreur lors de la récupération');
      console.log(`   Erreur: ${error.message}`);
    }
    
  } catch (error) {
    console.log('❌ Service API: Erreur d\'import');
    console.log(`   Erreur: ${error.message}`);
  }
}

// Exécuter tous les tests
async function runAllTests() {
  await testBackend();
  await testFrontend();
  await testApiService();
  
  console.log('\n🎯 Résumé:');
  console.log('   - Backend Laravel: http://localhost:8000');
  console.log('   - Frontend React: http://localhost:8080');
  console.log('   - Service API: cleanApiService.ts');
  console.log('\n✅ Tests terminés!');
}

// Lancer les tests
runAllTests().catch(console.error);
