import React, { useState } from 'react';
import { VideoUpload, VideoList } from '../components/instructor/VideoUpload';
import { InstructorRevenue } from '../components/instructor/InstructorRevenue';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Plus, List, DollarSign, User } from 'lucide-react';

export const InstructorVideoUpload: React.FC = () => {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState<'upload' | 'list' | 'revenue'>('revenue');

  // Fonction pour créer un utilisateur formateur de test
  const createTestInstructor = async () => {
    try {
      await login('formateur@doremi.fr', 'password123');
      alert('Utilisateur formateur créé ! Vous pouvez maintenant voir le système de monétisation.');
    } catch (error) {
      // Si l'utilisateur n'existe pas, on le crée manuellement
      const testInstructor = {
        id: 'instructor_1',
        email: 'formateur@doremi.fr',
        name: 'Professeur Martin',
        role: 'instructor' as const,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        phone: '+33 6 12 34 56 78',
        location: 'Paris, France',
        memberSince: '2024-01-15',
        educationLevel: 'master' as const,
        bio: 'Formateur expérimenté en développement web et technologies modernes.'
      };
      
      localStorage.setItem('doremi_user', JSON.stringify(testInstructor));
      window.location.reload();
    }
  };

  // Si pas d'utilisateur, afficher un message avec bouton de test
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
            <User className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Accès au système de monétisation
            </h2>
            <p className="text-gray-600 mb-6">
              Pour voir le système de monétisation des formateurs, vous devez être connecté en tant que formateur.
            </p>
            <Button 
              onClick={createTestInstructor}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
            >
              <User className="w-4 h-4 mr-2" />
              Créer un formateur de test
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Rediriger si l'utilisateur n'est pas un formateur
  if (user.role !== 'instructor') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-8">
            <User className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Accès réservé aux formateurs
            </h2>
            <p className="text-gray-600 mb-6">
              Vous êtes connecté en tant que {user.role}. Seuls les formateurs peuvent accéder au système de monétisation.
            </p>
            <Button 
              onClick={createTestInstructor}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3"
            >
              <User className="w-4 h-4 mr-2" />
              Se connecter en tant que formateur
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Gestion des vidéos</h1>
          <p className="text-muted-foreground">
            Ajoutez, gérez vos vidéos et suivez vos revenus basés sur les vues
          </p>
        </div>

        {/* Onglets */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'upload' ? 'default' : 'outline'}
            onClick={() => setActiveTab('upload')}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter une vidéo
          </Button>
          <Button
            variant={activeTab === 'list' ? 'default' : 'outline'}
            onClick={() => setActiveTab('list')}
            className="flex items-center gap-2"
          >
            <List className="w-4 h-4" />
            Mes vidéos
          </Button>
          <Button
            variant={activeTab === 'revenue' ? 'default' : 'outline'}
            onClick={() => setActiveTab('revenue')}
            className="flex items-center gap-2"
          >
            <DollarSign className="w-4 h-4" />
            Mes revenus
          </Button>
        </div>
        
        {/* Contenu */}
        {activeTab === 'upload' ? (
          <VideoUpload />
        ) : activeTab === 'list' ? (
          <VideoList />
        ) : (
          <InstructorRevenue />
        )}
      </div>
    </div>
  );
}; 