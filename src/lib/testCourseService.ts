// Fichier de test pour vérifier le fonctionnement du service de cours
import { courseService } from './courseService';

// Fonction de test pour vérifier la connexion à Supabase
export const testCourseService = async () => {
  console.log('🧪 Test du service de cours...');

  try {
    // Test 1: Récupérer tous les cours
    console.log('📚 Test 1: Récupération de tous les cours');
    const courses = await courseService.getCourses({ limit: 5 });
    console.log(`✅ ${courses.length} cours récupérés`);
    console.log('Premier cours:', courses[0]);

    // Test 2: Récupérer les cours populaires
    console.log('🔥 Test 2: Récupération des cours populaires');
    const popularCourses = await courseService.getPopularCourses(3);
    console.log(`✅ ${popularCourses.length} cours populaires récupérés`);

    // Test 3: Récupérer les cours récents
    console.log('🆕 Test 3: Récupération des cours récents');
    const recentCourses = await courseService.getRecentCourses(3);
    console.log(`✅ ${recentCourses.length} cours récents récupérés`);

    // Test 4: Recherche de cours
    console.log('🔍 Test 4: Recherche de cours');
    const searchResults = await courseService.searchCourses('math', { limit: 3 });
    console.log(`✅ ${searchResults.length} résultats de recherche trouvés`);

    // Test 5: Statistiques des cours
    console.log('📊 Test 5: Récupération des statistiques');
    const stats = await courseService.getCourseStats();
    console.log('✅ Statistiques récupérées:', stats);

    console.log('🎉 Tous les tests sont passés avec succès !');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
    return false;
  }
};

// Fonction pour tester la création d'un cours (nécessite une authentification)
export const testCreateCourse = async () => {
  console.log('🧪 Test de création de cours...');

  try {
    const testCourse = {
      title: 'Test Course - Mathématiques Avancées',
      description: 'Un cours de test pour les mathématiques avancées',
      instructorId: 'test-teacher-id',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop&crop=center',
      category: 'Mathématiques',
      level: 'advanced' as const,
      educationLevel: 'etudiant' as const,
      duration: '2h 30min',
      chaptersCount: 8,
      isPremium: false,
      price: 0
    };

    const createdCourse = await courseService.createCourse(testCourse);
    console.log('✅ Cours créé avec succès:', createdCourse);
    return createdCourse;
  } catch (error) {
    console.error('❌ Erreur lors de la création du cours:', error);
    return null;
  }
};

// Fonction pour tester l'inscription à un cours
export const testEnrollInCourse = async (userId: string, courseId: string) => {
  console.log('🧪 Test d\'inscription au cours...');

  try {
    const success = await courseService.enrollInCourse(userId, courseId);
    console.log('✅ Inscription au cours:', success ? 'Réussie' : 'Échouée');
    return success;
  } catch (error) {
    console.error('❌ Erreur lors de l\'inscription au cours:', error);
    return false;
  }
};

// Fonction pour tester la mise à jour de la progression
export const testUpdateProgress = async (userId: string, courseId: string, progress: number) => {
  console.log('🧪 Test de mise à jour de la progression...');

  try {
    const success = await courseService.updateCourseProgress(userId, courseId, progress);
    console.log('✅ Mise à jour de la progression:', success ? 'Réussie' : 'Échouée');
    return success;
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour de la progression:', error);
    return false;
  }
};

// Exporter les fonctions de test
export default {
  testCourseService,
  testCreateCourse,
  testEnrollInCourse,
  testUpdateProgress
};
