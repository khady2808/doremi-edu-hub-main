import React, { useState } from 'react';
import { LiveSessionCreator, LiveSessionList } from '../components/instructor/LiveSession';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Plus, List } from 'lucide-react';

export const InstructorLiveSession: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create');

  // Rediriger si l'utilisateur n'est pas un formateur
  if (!user || user.role !== 'teacher') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Sessions live</h1>
          <p className="text-muted-foreground">
            Créez et gérez vos sessions en direct avec vos étudiants
          </p>
        </div>

        {/* Onglets */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'create' ? 'default' : 'outline'}
            onClick={() => setActiveTab('create')}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Créer une session
          </Button>
          <Button
            variant={activeTab === 'list' ? 'default' : 'outline'}
            onClick={() => setActiveTab('list')}
            className="flex items-center gap-2"
          >
            <List className="w-4 h-4" />
            Mes sessions
          </Button>
        </div>
        
        {/* Contenu */}
        {activeTab === 'create' ? (
          <LiveSessionCreator />
        ) : (
          <LiveSessionList />
        )}
      </div>
    </div>
  );
}; 