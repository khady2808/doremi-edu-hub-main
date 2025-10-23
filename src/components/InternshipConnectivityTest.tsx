import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Activity,
  Globe,
  Database
} from 'lucide-react';
import { internshipApiService } from '@/services/internshipApi';

interface TestResult {
  success: boolean;
  message: string;
  data?: any;
  timestamp: string;
}

export const InternshipConnectivityTest: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const testConnectivity = async () => {
    setIsLoading(true);
    try {
      console.log('🧪 Test de connectivité API des stages...');
      const result = await internshipApiService.testConnectivity();
      
      const testResult: TestResult = {
        success: result.success,
        message: result.message,
        data: result.data,
        timestamp: new Date().toLocaleString('fr-FR')
      };
      
      setTestResult(testResult);
      
      if (result.success) {
        toast({
          title: "✅ Connexion réussie",
          description: "L'API des stages est accessible",
        });
      } else {
        toast({
          title: "❌ Erreur de connexion",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Erreur lors du test:', error);
      const testResult: TestResult = {
        success: false,
        message: `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        timestamp: new Date().toLocaleString('fr-FR')
      };
      setTestResult(testResult);
      
      toast({
        title: "❌ Erreur",
        description: "Impossible de tester la connexion",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Test API Stages
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Bouton de test */}
        <Button 
          onClick={testConnectivity}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        >
          {isLoading ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          {isLoading ? 'Test en cours...' : 'Tester la connexion'}
        </Button>

        {/* Résultat du test */}
        {testResult && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {testResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <Badge className={testResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {testResult.success ? 'Connecté' : 'Erreur'}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-600">
              {testResult.message}
            </p>
            
            <div className="text-xs text-gray-500">
              Testé le {testResult.timestamp}
            </div>

            {testResult.data && (
              <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                <div className="flex items-center gap-1 mb-1">
                  <Database className="w-3 h-3" />
                  <span className="font-medium">Données reçues:</span>
                </div>
                <div className="text-gray-600">
                  {Array.isArray(testResult.data) 
                    ? `${testResult.data.length} stage(s) trouvé(s)`
                    : 'Données reçues'
                  }
                </div>
              </div>
            )}
          </div>
        )}

        {/* Informations sur l'API */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Globe className="w-4 h-4" />
            <span>API: http://localhost:8000/api/internships</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InternshipConnectivityTest;
