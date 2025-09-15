import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '../lib/authService';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export const ApiTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [testEmail, setTestEmail] = useState('test@doremi.fr');
  const [testPassword, setTestPassword] = useState('password123');

  const addResult = (test: string, success: boolean, message: string, data?: any) => {
    setResults(prev => [...prev, {
      id: Date.now(),
      test,
      success,
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testApiConnection = async () => {
    setIsLoading(true);
    setResults([]);
    
    try {
      // Test 1: Vérifier la configuration API
      addResult(
        'Configuration API',
        true,
        `URL API: ${import.meta.env.VITE_API_URL || 'Non définie'}`,
        { apiUrl: import.meta.env.VITE_API_URL }
      );

      // Test 2: Test de connexion
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/news`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          addResult(
            'Connexion API',
            true,
            `API accessible - Code: ${response.status}`,
            data
          );
        } else {
          addResult(
            'Connexion API',
            false,
            `API non accessible - Code: ${response.status}`,
            { status: response.status }
          );
        }
      } catch (error) {
        addResult(
          'Connexion API',
          false,
          `Erreur de connexion: ${error}`,
          { error: error.toString() }
        );
      }

      // Test 3: Test d'authentification
      try {
        const authResponse = await authService.login(testEmail, testPassword);
        addResult(
          'Authentification',
          true,
          'Connexion réussie avec l\'API',
          { user: authResponse.user, hasToken: !!authResponse.token }
        );
      } catch (error) {
        addResult(
          'Authentification',
          false,
          `Erreur d'authentification: ${error}`,
          { error: error.toString() }
        );
      }

      // Test 4: Test d'inscription
      try {
        const registerData = {
          name: 'Test User',
          surname: 'Test',
          email: `test${Date.now()}@doremi.fr`,
          password: 'password123',
          role: 'student' as const,
          student_cycle: 'licence' as const,
        };
        
        const registerResponse = await authService.register(registerData);
        addResult(
          'Inscription',
          true,
          'Inscription réussie avec l\'API',
          { user: registerResponse.user, hasToken: !!registerResponse.token }
        );
      } catch (error) {
        addResult(
          'Inscription',
          false,
          `Erreur d'inscription: ${error}`,
          { error: error.toString() }
        );
      }

      // Test 5: Test des actualités
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/news`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          addResult(
            'Actualités',
            true,
            `Actualités récupérées: ${data.data?.length || 0} articles`,
            data
          );
        } else {
          addResult(
            'Actualités',
            false,
            `Erreur actualités - Code: ${response.status}`,
            { status: response.status }
          );
        }
      } catch (error) {
        addResult(
          'Actualités',
          false,
          `Erreur actualités: ${error}`,
          { error: error.toString() }
        );
      }

      // Test 6: Test des statistiques des actualités
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/news/stats`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          addResult(
            'Statistiques Actualités',
            true,
            'Statistiques des actualités récupérées',
            data
          );
        } else {
          addResult(
            'Statistiques Actualités',
            false,
            `Erreur statistiques - Code: ${response.status}`,
            { status: response.status }
          );
        }
      } catch (error) {
        addResult(
          'Statistiques Actualités',
          false,
          `Erreur statistiques: ${error}`,
          { error: error.toString() }
        );
      }

      // Test 7: Test des fonctionnalités admin (avec authentification)
      if (authService.isAuthenticated()) {
        try {
          // Test de création d'une actualité
          const testNewsData = {
            title: 'Test Admin - ' + new Date().toISOString(),
            content: 'Ceci est un test de création d\'actualité depuis l\'admin.',
            excerpt: 'Test de création d\'actualité',
            category: 'Test',
            status: 'draft',
            priority: 'low',
            is_featured: false,
            is_urgent: false,
            type: 'news'
          };

          const createResponse = await fetch(`${import.meta.env.VITE_API_URL}/news`, {
            method: 'POST',
            headers: authService.getAuthHeaders(),
            body: JSON.stringify(testNewsData),
          });

          if (createResponse.ok) {
            const createdNews = await createResponse.json();
            addResult(
              'Création Actualité Admin',
              true,
              'Actualité créée avec succès',
              { id: createdNews.id, title: createdNews.title }
            );

            // Test de suppression de l'actualité créée
            const deleteResponse = await fetch(`${import.meta.env.VITE_API_URL}/news/${createdNews.id}`, {
              method: 'DELETE',
              headers: authService.getAuthHeaders(),
            });

            if (deleteResponse.ok) {
              addResult(
                'Suppression Actualité Admin',
                true,
                'Actualité supprimée avec succès',
                { id: createdNews.id }
              );
            } else {
              addResult(
                'Suppression Actualité Admin',
                false,
                `Erreur suppression - Code: ${deleteResponse.status}`,
                { status: deleteResponse.status }
              );
            }
          } else {
            addResult(
              'Création Actualité Admin',
              false,
              `Erreur création - Code: ${createResponse.status}`,
              { status: createResponse.status }
            );
          }
        } catch (error) {
          addResult(
            'Fonctionnalités Admin',
            false,
            `Erreur fonctionnalités admin: ${error}`,
            { error: error.toString() }
          );
        }
      } else {
        addResult(
          'Fonctionnalités Admin',
          false,
          'Non testé - Authentification requise',
          { note: 'Connectez-vous en tant qu\'admin pour tester les fonctionnalités CRUD' }
        );
      }

    } catch (error) {
      addResult(
        'Test général',
        false,
        `Erreur générale: ${error}`,
        { error: error.toString() }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test d'intégration API</CardTitle>
          <CardDescription>
            Vérifiez la connectivité et l'authentification avec l'API Laravel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="testEmail">Email de test</Label>
              <Input
                id="testEmail"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="test@doremi.fr"
              />
            </div>
            <div>
              <Label htmlFor="testPassword">Mot de passe</Label>
              <Input
                id="testPassword"
                type="password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                placeholder="password123"
              />
            </div>
          </div>
          
          <Button 
            onClick={testApiConnection} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Test en cours...
              </>
            ) : (
              'Lancer les tests'
            )}
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Résultats des tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((result) => (
                <div
                  key={result.id}
                  className={`p-4 rounded-lg border ${
                    result.success 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {result.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium">{result.test}</h4>
                      <p className="text-sm text-gray-600">{result.message}</p>
                      <p className="text-xs text-gray-500">{result.timestamp}</p>
                      {result.data && (
                        <details className="mt-2">
                          <summary className="text-xs text-gray-500 cursor-pointer">
                            Voir les détails
                          </summary>
                          <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
