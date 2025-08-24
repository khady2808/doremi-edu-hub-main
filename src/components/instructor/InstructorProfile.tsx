import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  Calendar,
  Clock,
  Play,
  Users,
  Star,
  ExternalLink,
  Youtube
} from 'lucide-react';
import { User, Video as VideoType, LiveSession } from '../../types/auth';

interface InstructorProfileProps {
  instructor: User;
}

export const InstructorProfile: React.FC<InstructorProfileProps> = ({ instructor }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return <Youtube className="w-4 h-4 text-red-500" />;
      case 'jitsi':
        return <Video className="w-4 h-4 text-blue-500" />;
      case 'external':
        return <ExternalLink className="w-4 h-4 text-green-500" />;
      default:
        return <Video className="w-4 h-4" />;
    }
  };

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return 'YouTube Live';
      case 'jitsi':
        return 'Jitsi Meet';
      case 'external':
        return 'Lien externe';
      default:
        return 'YouTube Live';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="secondary">Programmé</Badge>;
      case 'live':
        return <Badge className="bg-red-500 text-white">En direct</Badge>;
      case 'ended':
        return <Badge variant="outline">Terminé</Badge>;
      default:
        return <Badge variant="secondary">Programmé</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Informations du formateur */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center text-white text-2xl font-bold">
              {instructor.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <CardTitle className="text-2xl">{instructor.name}</CardTitle>
              <CardDescription className="text-lg">
                {instructor.bio || 'Formateur passionné par l\'éducation'}
              </CardDescription>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">4.8/5</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">156 étudiants</span>
                </div>
                {instructor.isVerified && (
                  <Badge className="bg-green-500 text-white">Vérifié</Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Vidéos du formateur */}
      {instructor.videos && instructor.videos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              Vidéos de cours ({instructor.videos.length})
            </CardTitle>
            <CardDescription>
              Découvrez les vidéos de cours de ce formateur
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {instructor.videos.map((video: VideoType) => (
                <Card key={video.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="aspect-video bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                      <Play className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="font-medium text-sm mb-2">{video.title}</h4>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                      {video.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{video.views} vues</span>
                      <span>{formatDate(video.createdAt)}</span>
                    </div>
                    <Button size="sm" className="w-full mt-3">
                      <Play className="w-4 h-4 mr-2" />
                      Regarder
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sessions live du formateur */}
      {instructor.liveSessions && instructor.liveSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Sessions live ({instructor.liveSessions.length})
            </CardTitle>
            <CardDescription>
              Participez aux sessions en direct de ce formateur
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {instructor.liveSessions.map((session: LiveSession) => (
                <Card key={session.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{session.title}</h4>
                          {getStatusBadge(session.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {session.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            {getPlatformIcon(session.platform)}
                            <span>{getPlatformName(session.platform)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(session.scheduledAt)}</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant={session.status === 'live' ? 'default' : 'outline'}
                        onClick={() => window.open(session.link, '_blank')}
                      >
                        {session.status === 'live' ? 'Rejoindre' : 'Voir détails'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Message si aucun contenu */}
      {(!instructor.videos || instructor.videos.length === 0) && 
       (!instructor.liveSessions || instructor.liveSessions.length === 0) && (
        <Card>
          <CardContent className="p-8 text-center">
            <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun contenu disponible</h3>
            <p className="text-gray-600">
              Ce formateur n'a pas encore publié de vidéos ou de sessions live.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 