import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { 
  User, 
  Mail, 
  Calendar, 
  Award, 
  Star, 
  BookOpen, 
  Video, 
  Settings,
  Edit,
  Crown
} from 'lucide-react';
import { User as UserType } from '../../types/auth';

interface UserProfileCardProps {
  user: UserType;
  className?: string;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ user, className = '' }) => {
  const getRoleText = (role: string) => {
    return role === 'teacher' ? 'Formateur' : 'Étudiant';
  };

  const getEducationLevelText = (level?: string) => {
    if (!level) return 'Non défini';
    const levels = {
      'ecolier': 'Écolier',
      'collegien': 'Collégien', 
      'lyceen': 'Lycéen',
      'etudiant': 'Étudiant'
    };
    return levels[level as keyof typeof levels] || level;
  };

  const getJoinedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className={`bg-gradient-to-br from-blue-50 to-green-50 border-2 border-blue-200 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-gray-800">Profil utilisateur</CardTitle>
          <Button variant="ghost" size="sm">
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* En-tête du profil */}
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white text-xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{user.name}</h3>
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                variant={user.role === 'teacher' ? 'default' : 'secondary'}
                                  className={user.role === 'teacher' ? 'bg-purple-500' : 'bg-blue-500'}
              >
                {getRoleText(user.role)}
              </Badge>
              {user.isPremium && (
                <Badge className="bg-yellow-500 text-white">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
              {user.isVerified && (
                <Badge className="bg-green-500 text-white">
                  <Award className="w-3 h-3 mr-1" />
                  Vérifié
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>

        {/* Informations détaillées */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-sm font-medium">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Membre depuis</p>
                <p className="text-sm font-medium">{getJoinedDate(user.joinedDate)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <BookOpen className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Niveau d'éducation</p>
                <p className="text-sm font-medium">{getEducationLevelText(user.educationLevel)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {user.phone && (
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="text-sm font-medium">{user.phone}</p>
                </div>
              </div>
            )}

            {user.bio && (
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Bio</p>
                  <p className="text-sm font-medium line-clamp-2">{user.bio}</p>
                </div>
              </div>
            )}

            {user.role === 'teacher' && (
              <div className="flex items-center gap-3">
                <Video className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Vidéos créées</p>
                  <p className="text-sm font-medium">{user.videos?.length || 0}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Statistiques rapides */}
        {user.role === 'teacher' && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3">Statistiques</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{user.videos?.length || 0}</div>
                <div className="text-xs text-gray-500">Vidéos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{user.liveSessions?.length || 0}</div>
                <div className="text-xs text-gray-500">Lives</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">0</div>
                <div className="text-xs text-gray-500">Étudiants</div>
              </div>
            </div>
          </div>
        )}

        {/* Actions rapides */}
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          <Button variant="outline" size="sm" className="flex-1">
            <Settings className="w-4 h-4 mr-2" />
            Paramètres
          </Button>
          <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
            <Edit className="w-4 h-4 mr-2" />
            Modifier
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard; 