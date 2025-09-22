/**
 * Composant de Test Ultra-Propre pour l'API des Stages
 * Aucune erreur ESLint - Code de qualité production
 */

import React, { useState } from 'react';
import { cleanApiService, type Internship, type StatsData } from '@/lib/cleanApiService';

export const CleanApiTest: React.FC = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Charger tous les stages
  const loadInternships = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await cleanApiService.getAllInternships();
      setInternships(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  // Charger les statistiques
  const loadStats = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await cleanApiService.getInternshipStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des stats');
    } finally {
      setLoading(false);
    }
  };

  // Rechercher des stages
  const searchInternships = async (): Promise<void> => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await cleanApiService.searchInternships({ q: searchQuery });
      setInternships(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  // Test de connectivité
  const testConnectivity = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await cleanApiService.getAllInternships();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connectivité');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🧪 Test API Stages - Version Propre
        </h1>
        <p className="text-gray-600">
          Service API ultra-propre sans erreurs ESLint
        </p>
      </div>

      {/* Contrôles */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">🎮 Contrôles de Test</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={loadInternships}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors"
          >
            {loading ? '⏳' : '📋'} Charger Stages
          </button>
          
          <button
            onClick={loadStats}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors"
          >
            {loading ? '⏳' : '📊'} Statistiques
          </button>
          
          <button
            onClick={testConnectivity}
            disabled={loading}
            className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors"
          >
            {loading ? '⏳' : '🔗'} Test Connexion
          </button>
          
          <button
            onClick={() => {
              setInternships([]);
              setStats(null);
              setError(null);
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            🗑️ Effacer
          </button>
        </div>
      </div>

      {/* Recherche */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">🔍 Recherche</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher des stages..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={searchInternships}
            disabled={loading || !searchQuery.trim()}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors"
          >
            {loading ? '⏳' : '🔍'} Rechercher
          </button>
        </div>
      </div>

      {/* État de l'authentification */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">🔐 État de l'Authentification</h2>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            cleanApiService.isAuthenticated() 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {cleanApiService.isAuthenticated() ? '✅ Authentifié' : '❌ Non authentifié'}
          </span>
          <span className="text-sm text-gray-600">
            {cleanApiService.isAuthenticated() 
              ? 'Token présent - Accès complet' 
              : 'Aucun token - Accès limité'
            }
          </span>
        </div>
      </div>

      {/* Erreurs */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="text-red-500">❌</span>
            <span className="text-red-700 font-medium">Erreur:</span>
          </div>
          <p className="text-red-600 mt-1">{error}</p>
        </div>
      )}

      {/* Statistiques */}
      {stats && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">📊 Statistiques</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-sm text-gray-600">Actifs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.inactive}</div>
              <div className="text-sm text-gray-600">Inactifs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.closed}</div>
              <div className="text-sm text-gray-600">Fermés</div>
            </div>
          </div>
        </div>
      )}

      {/* Liste des stages */}
      {internships.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            📋 Stages ({internships.length})
          </h2>
          <div className="space-y-4">
            {internships.map((internship) => (
              <div key={internship.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    {internship.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    internship.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : internship.status === 'inactive'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {internship.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{internship.description}</p>
                <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                  <span>🏢 {internship.company}</span>
                  <span>📍 {internship.location}</span>
                  <span>⏱️ {internship.duration} mois</span>
                  <span>💰 {internship.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message d'état */}
      {!loading && !error && internships.length === 0 && !stats && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <div className="text-gray-400 text-4xl mb-2">🚀</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Prêt à tester l'API
          </h3>
          <p className="text-gray-600">
            Cliquez sur un bouton ci-dessus pour commencer les tests
          </p>
        </div>
      )}
    </div>
  );
};

export default CleanApiTest;
