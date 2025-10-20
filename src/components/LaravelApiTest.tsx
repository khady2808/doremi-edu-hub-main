import React, { useState, useEffect } from 'react';
import { courseLaravelService } from '../lib/courseLaravelService';
import { Course } from '../types/course';

const LaravelApiTest: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testApi = async () => {
    setLoading(true);
    setError(null);
    setTestResults([]);
    
    try {
      // Test 1: Récupérer tous les cours
      addResult('🔄 Test 1: Récupération de tous les cours...');
      const allCourses = await courseLaravelService.getCourses();
      setCourses(allCourses);
      addResult(`✅ Succès: ${allCourses.length} cours récupérés`);

      // Test 2: Filtrage par catégorie
      addResult('🔄 Test 2: Filtrage par catégorie (Mathématiques)...');
      const mathCourses = await courseLaravelService.searchCourses({ category: 'Mathématiques' });
      addResult(`✅ Succès: ${mathCourses.length} cours de mathématiques trouvés`);

      // Test 3: Filtrage par niveau de difficulté
      addResult('🔄 Test 3: Filtrage par niveau débutant...');
      const beginnerCourses = await courseLaravelService.searchCourses({ difficultyLevel: 'beginner' });
      addResult(`✅ Succès: ${beginnerCourses.length} cours débutants trouvés`);

      // Test 4: Filtrage par niveau d'éducation
      addResult('🔄 Test 4: Filtrage par niveau collégien...');
      const collegeCourses = await courseLaravelService.searchCourses({ educationLevel: 'collegien' });
      addResult(`✅ Succès: ${collegeCourses.length} cours pour collégiens trouvés`);

      // Test 5: Cours populaires
      addResult('🔄 Test 5: Récupération des cours populaires...');
      const popularCourses = await courseLaravelService.getPopularCourses();
      addResult(`✅ Succès: ${popularCourses.length} cours populaires trouvés`);

      // Test 6: Cours récents
      addResult('🔄 Test 6: Récupération des cours récents...');
      const recentCourses = await courseLaravelService.getRecentCourses();
      addResult(`✅ Succès: ${recentCourses.length} cours récents trouvés`);

      // Test 7: Statistiques
      addResult('🔄 Test 7: Récupération des statistiques...');
      const stats = await courseLaravelService.getCourseStats();
      addResult(`✅ Succès: ${stats.totalCourses} cours au total, ${stats.averageRating} note moyenne`);

      addResult('🎉 Tous les tests sont passés avec succès !');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      addResult(`❌ Erreur: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const testCourseDetail = async (courseId: string) => {
    try {
      addResult(`🔄 Test détail du cours ${courseId}...`);
      const course = await courseLaravelService.getCourseById(courseId);
      addResult(`✅ Succès: Cours "${course.title}" récupéré`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      addResult(`❌ Erreur détail cours: ${errorMessage}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        🧪 Test d'Intégration API Laravel
      </h2>

      <div className="mb-6">
        <button
          onClick={testApi}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          {loading ? '🔄 Test en cours...' : '🚀 Lancer les Tests API'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <h3 className="font-bold">❌ Erreur:</h3>
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Résultats des tests */}
        <div>
          <h3 className="text-lg font-semibold mb-4">📋 Résultats des Tests</h3>
          <div className="bg-gray-100 p-4 rounded-lg h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-gray-500">Cliquez sur "Lancer les Tests" pour commencer</p>
            ) : (
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Liste des cours */}
        <div>
          <h3 className="text-lg font-semibold mb-4">📚 Cours Récupérés ({courses.length})</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {courses.map((course) => (
              <div key={course.id} className="border rounded-lg p-3 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{course.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{course.category} • {course.educationLevel}</p>
                    <p className="text-xs text-gray-500">
                      ⭐ {course.rating} • 👥 {course.studentsCount} • {course.duration}
                    </p>
                  </div>
                  <button
                    onClick={() => testCourseDetail(course.id)}
                    className="ml-2 bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded"
                  >
                    Test
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Informations de configuration */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">⚙️ Configuration</h3>
        <div className="text-sm text-gray-600">
          <p><strong>URL API:</strong> http://localhost:8001/api</p>
          <p><strong>Endpoint testé:</strong> /courses</p>
          <p><strong>Status serveur:</strong> {loading ? 'Test en cours...' : 'Prêt'}</p>
        </div>
      </div>
    </div>
  );
};

export default LaravelApiTest;
