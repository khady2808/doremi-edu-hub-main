
import React, { useState } from 'react';
import { Search, User, BookOpen, FileText, MessageCircle, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { NotificationCenter } from '@/components/ui/notifications';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Suggestions de recherche
  const suggestions = [
    { icon: BookOpen, label: 'Cours de mathématiques', action: () => navigate('/courses?search=mathématiques') },
    { icon: FileText, label: 'Documents de français', action: () => navigate('/library?search=français') },
    { icon: MessageCircle, label: 'Messages récents', action: () => navigate('/messages') },
    { icon: Newspaper, label: 'Actualités DOREMI', action: () => navigate('/news') },
  ];

  const handleSearch = (term: string) => {
    if (term.trim()) {
      // Recherche intelligente basée sur le terme
      if (term.toLowerCase().includes('cours') || term.toLowerCase().includes('formation')) {
        navigate(`/courses?search=${encodeURIComponent(term)}`);
      } else if (term.toLowerCase().includes('document') || term.toLowerCase().includes('livre')) {
        navigate(`/library?search=${encodeURIComponent(term)}`);
      } else if (term.toLowerCase().includes('message') || term.toLowerCase().includes('chat')) {
        navigate('/messages');
      } else if (term.toLowerCase().includes('actualité') || term.toLowerCase().includes('news')) {
        navigate('/news');
      } else {
        // Recherche par défaut dans les cours
        navigate(`/courses?search=${encodeURIComponent(term)}`);
      }
      setSearchTerm('');
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchTerm);
    }
  };

  return (
    <header className="h-16 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 h-full">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          
          <div className="hidden md:flex items-center gap-2 max-w-md">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Rechercher des cours, documents..." 
                className="pl-10 bg-muted/50 dark:bg-gray-800 dark:text-white"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(e.target.value.length > 0);
                }}
                onKeyPress={handleKeyPress}
                onFocus={() => setShowSuggestions(searchTerm.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              
              {/* Suggestions de recherche */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="p-2">
                    <div className="text-xs text-gray-500 mb-2 px-2">Suggestions rapides :</div>
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          suggestion.action();
                          setShowSuggestions(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 rounded-md transition-colors"
                      >
                        <suggestion.icon className="w-4 h-4 text-gray-500" />
                        {suggestion.label}
                      </button>
                    ))}
                  </div>
                  {searchTerm.trim() && (
                    <div className="border-t p-2">
                      <button
                        onClick={() => handleSearch(searchTerm)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                      >
                        <Search className="w-4 h-4" />
                        Rechercher "{searchTerm}"
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NotificationCenter />
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Photo de profil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-white" />
              )}
            </div>
            {user && (
              <div className="hidden md:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
