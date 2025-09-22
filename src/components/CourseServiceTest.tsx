import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Database,
  Search,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import { testCourseService, testCreateCourse, testEnrollInCourse, testUpdateProgress } from '../lib/testCourseService';
import { useAuth } from '../context/AuthContext';

export const CourseServiceTest: React.FC = () => {
  const { user } = useAuth();
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<{
    basicTests: boolean | null;
    createCourse: boolean | null;
    enrollCourse: boolean | null;
    updateProgress: boolean | null;
  }>({
    basicTests: null,
    createCourse: null,
    enrollCourse: null,
    updateProgress: null
  });

  const runBasicTests = async () => {
    setIsRunning(true);
    try {
      const success = await testCourseService();
      setResults(prev => ({ ...prev, basicTests: success }));
    } catch (error) {
      console.error('Erreur lors des tests de base:', error);
      setResults(prev => ({ ...prev, basicTests: false }));
    } finally {
      setIsRunning(false);
    }
  };

  const runCreateCourseTest = async () => {
    setIsRunning(true);
    try {
      const course = await testCreateCourse();
      setResults(prev => ({ ...prev, createCourse: !!course }));
    } catch (error) {
      console.error('Erreur lors du test de création:', error);
      setResults(prev => ({ ...prev, createCourse: false }));
    } finally {
      setIsRunning(false);
    }
  };

  const runEnrollTest = async () => {
    if (!user?.id) {
      alert('Vous devez être connecté pour tester l\'inscription aux cours');
      return;
    }

    setIsRunning(true);
    try {
      // Utiliser un ID de cours fictif pour le test
      const success = await testEnrollInCourse(user.id, 'test-course-id');
      setResults(prev => ({ ...prev, enrollCourse: success }));
    } catch (error) {
      console.error('Erreur lors du test d\'inscription:', error);
      setResults(prev => ({ ...prev, enrollCourse: false }));
    } finally {
      setIsRunning(false);
    }
  };

  const runProgressTest = async () => {
    if (!user?.id) {
      alert('Vous devez être connecté pour tester la mise à jour de la progression');
      return;
    }

    setIsRunning(true);
    try {
      // Utiliser un ID de cours fictif pour le test
      const success = await testUpdateProgress(user.id, 'test-course-id', 50);
      setResults(prev => ({ ...prev, updateProgress: success }));
    } catch (error) {
      console.error('Erreur lors du test de progression:', error);
      setResults(prev => ({ ...prev, updateProgress: false }));
    } finally {
      setIsRunning(false);
    }
  };

  const runAllTests = async () => {
    await runBasicTests();
    await runCreateCourseTest();
    await runEnrollTest();
    await runProgressTest();
  };

  const getStatusIcon = (status: boolean | null) => {
    if (status === null) return <div className="w-4 h-4 rounded-full bg-gray-300" />;
    if (status) return <CheckCircle className="w-4 h-4 text-green-500" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getStatusText = (status: boolean | null) => {
    if (status === null) return 'Non testé';
    if (status) return 'Réussi';
    return 'Échoué';
  };

  const getStatusColor = (status: boolean | null) => {
    if (status === null) return 'bg-gray-100 text-gray-800';
    if (status) return 'bg-green-100 text-green-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Test du Service de Cours
          </CardTitle>
          <CardDescription>
            Vérifiez le fonctionnement de l'intégration Supabase pour les cours
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Tests de base</h4>
              <div className="flex items-center gap-2">
                {getStatusIcon(results.basicTests)}
                <Badge className={getStatusColor(results.basicTests)}>
                  {getStatusText(results.basicTests)}
                </Badge>
              </div>
              <Button 
                onClick={runBasicTests} 
                disabled={isRunning}
                size="sm"
                variant="outline"
              >
                {isRunning ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                Tester
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Création de cours</h4>
              <div className="flex items-center gap-2">
                {getStatusIcon(results.createCourse)}
                <Badge className={getStatusColor(results.createCourse)}>
                  {getStatusText(results.createCourse)}
                </Badge>
              </div>
              <Button 
                onClick={runCreateCourseTest} 
                disabled={isRunning}
                size="sm"
                variant="outline"
              >
                {isRunning ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <BookOpen className="w-4 h-4 mr-2" />}
                Tester
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Inscription aux cours</h4>
              <div className="flex items-center gap-2">
                {getStatusIcon(results.enrollCourse)}
                <Badge className={getStatusColor(results.enrollCourse)}>
                  {getStatusText(results.enrollCourse)}
                </Badge>
              </div>
              <Button 
                onClick={runEnrollTest} 
                disabled={isRunning || !user}
                size="sm"
                variant="outline"
              >
                {isRunning ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                Tester
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Mise à jour progression</h4>
              <div className="flex items-center gap-2">
                {getStatusIcon(results.updateProgress)}
                <Badge className={getStatusColor(results.updateProgress)}>
                  {getStatusText(results.updateProgress)}
                </Badge>
              </div>
              <Button 
                onClick={runProgressTest} 
                disabled={isRunning || !user}
                size="sm"
                variant="outline"
              >
                {isRunning ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <TrendingUp className="w-4 h-4 mr-2" />}
                Tester
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button 
              onClick={runAllTests} 
              disabled={isRunning}
              className="w-full"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Exécution des tests...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Exécuter tous les tests
                </>
              )}
            </Button>
          </div>

          {!user && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Certains tests nécessitent une authentification. 
                Connectez-vous pour tester toutes les fonctionnalités.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
