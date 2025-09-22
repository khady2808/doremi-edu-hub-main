// Test simple de connectivité
console.log('🔍 Test de connectivité simple...\n');

// Test 1: Backend Laravel
fetch('http://localhost:8000/api/internships')
  .then(response => {
    if (response.ok) {
      console.log('✅ Backend Laravel: OK');
      console.log(`   Status: ${response.status}`);
      return response.json();
    } else {
      console.log(`❌ Backend Laravel: Erreur ${response.status}`);
      throw new Error(`HTTP ${response.status}`);
    }
  })
  .then(data => {
    console.log(`   Données reçues: ${Array.isArray(data) ? data.length : 'Object'} éléments`);
  })
  .catch(error => {
    console.log('❌ Backend Laravel: Non accessible');
    console.log(`   Erreur: ${error.message}`);
  });

// Test 2: Frontend React
fetch('http://localhost:8080')
  .then(response => {
    if (response.ok) {
      console.log('\n✅ Frontend React: OK');
      console.log(`   Status: ${response.status}`);
    } else {
      console.log(`\n❌ Frontend React: Erreur ${response.status}`);
    }
  })
  .catch(error => {
    console.log('\n❌ Frontend React: Non accessible');
    console.log(`   Erreur: ${error.message}`);
  });

console.log('\n🎯 Résumé des ports:');
console.log('   - Backend Laravel: http://localhost:8000');
console.log('   - Frontend React: http://localhost:8080');
console.log('\n⏳ Tests en cours...');
