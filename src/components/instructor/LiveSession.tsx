import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Video, 
  Calendar,
  Clock,
  Link,
  AlertCircle,
  Youtube,
  ExternalLink,
  Users,
  Check,
  Play,
  Eye,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  MessageSquare,
  Send,
  User,
  Radio
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LiveSession } from '../../types/auth';

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case 'youtube':
      return <Youtube className="w-4 h-4" />;
    case 'jitsi':
      return <Video className="w-4 h-4" />;
    case 'external':
      return <ExternalLink className="w-4 h-4" />;
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

export const LiveSessionCreator: React.FC = () => {
  const { addLiveSession, user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [sessionData, setSessionData] = useState({
    title: '',
    description: '',
    link: '',
    scheduledAt: '',
    platform: 'youtube' as 'youtube' | 'jitsi' | 'external',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const createTestSession = () => {
    if (!user) {
      setError('Vous devez être connecté pour créer une session live.');
      return;
    }

    const testSession = {
      title: 'Test Session Live - Mathématiques',
      description: 'Session de test pour vérifier le fonctionnement du live',
      link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      scheduledAt: new Date().toISOString(),
      instructorId: user.id,
      status: 'live' as const,
      platform: 'youtube' as const,
    };

    addLiveSession(testSession);
    setSuccess('Session live de test créée avec succès !');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sessionData.title.trim() || !sessionData.description.trim() || !sessionData.link.trim() || !sessionData.scheduledAt) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (!user) {
      setError('Vous devez être connecté pour créer une session live.');
      return;
    }

    // Validation de l'URL
    try {
      new URL(sessionData.link);
    } catch {
      setError('Veuillez entrer une URL valide.');
      return;
    }

    setIsCreating(true);
    setError(null);
    setSuccess(null);

    try {
      // Ajouter la session live au contexte
      addLiveSession({
        title: sessionData.title,
        description: sessionData.description,
        link: sessionData.link,
        scheduledAt: sessionData.scheduledAt,
        instructorId: user.id,
        status: 'scheduled',
        platform: sessionData.platform,
      });

      // Réinitialiser le formulaire
      setSessionData({
        title: '',
        description: '',
        link: '',
        scheduledAt: '',
        platform: 'youtube',
      });

      setSuccess('Session live créée avec succès !');
      
      // Réinitialiser le message de succès après 3 secondes
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Erreur lors de la création de la session: ' + (error as Error).message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="w-5 h-5" />
          Créer une session live
        </CardTitle>
        <CardDescription>
          Planifiez une session en direct avec vos étudiants
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre de la session *</Label>
            <Input
              id="title"
              value={sessionData.title}
              onChange={(e) => setSessionData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Cours de mathématiques - Chapitre 3"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={sessionData.description}
              onChange={(e) => setSessionData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Décrivez le contenu de cette session live..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Plateforme *</Label>
              <Select
                value={sessionData.platform}
                onValueChange={(value) => setSessionData(prev => ({ ...prev, platform: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube">
                    <div className="flex items-center gap-2">
                      <Youtube className="w-4 h-4" />
                      YouTube Live
                    </div>
                  </SelectItem>
                  <SelectItem value="jitsi">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Jitsi Meet
                    </div>
                  </SelectItem>
                  <SelectItem value="external">
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Lien externe
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduledAt">Date et heure *</Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                value={sessionData.scheduledAt}
                onChange={(e) => setSessionData(prev => ({ ...prev, scheduledAt: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">Lien de la session *</Label>
            <Input
              id="link"
              type="url"
              value={sessionData.link}
              onChange={(e) => setSessionData(prev => ({ ...prev, link: e.target.value }))}
              placeholder={
                sessionData.platform === 'youtube' 
                  ? 'https://youtube.com/live/...' 
                  : sessionData.platform === 'jitsi'
                  ? 'https://meet.jit.si/...'
                  : 'https://...'
              }
              required
            />
            <p className="text-xs text-gray-500">
              {sessionData.platform === 'youtube' && 'Lien YouTube Live'}
              {sessionData.platform === 'jitsi' && 'Lien Jitsi Meet'}
              {sessionData.platform === 'external' && 'Lien vers votre plateforme'}
            </p>
          </div>

          {error && (
            <div className="text-red-600 text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {success && (
            <div className="text-green-600 text-sm font-medium flex items-center gap-2">
              <Check className="w-4 h-4" />
              {success}
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Conseils pour une session live réussie</h4>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• Testez votre équipement avant la session</li>
                  <li>• Préparez votre contenu à l'avance</li>
                  <li>• Annoncez la session à vos étudiants</li>
                  <li>• Gardez un lien de secours prêt</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Création en cours...
                </>
              ) : (
                <>
                  <Video className="w-4 h-4 mr-2" />
                  Créer la session live
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={createTestSession}
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Test
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export const LiveSessionList: React.FC = () => {
  const { liveSessions, user } = useAuth();
  const [selectedSession, setSelectedSession] = useState<LiveSession | null>(null);

  const userSessions = liveSessions.filter(session => session.instructorId === user?.id);

  const handleJoinSession = (session: LiveSession) => {
    // Si la session est en live, ouvrir directement le lien
    if (session.status === 'live') {
      window.open(session.link, '_blank');
    } else {
      // Si la session est planifiée, ouvrir la modale pour plus d'infos
      setSelectedSession(session);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'text-blue-600 bg-blue-100';
      case 'live':
        return 'text-green-600 bg-green-100';
      case 'ended':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Planifiée';
      case 'live':
        return 'En direct';
      case 'ended':
        return 'Terminée';
      default:
        return 'Inconnu';
    }
  };

  if (userSessions.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune session live</h3>
          <p className="text-gray-500">Vous n'avez pas encore créé de session live.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Mes sessions live</h3>
      <div className="grid gap-4">
        {userSessions.map((session) => (
          <Card key={session.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getPlatformIcon(session.platform)}
                    <h4 className="font-medium">{session.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                      {getStatusText(session.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{session.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(session.scheduledAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Link className="w-3 h-3" />
                      {getPlatformName(session.platform)}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={session.status === 'live' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleJoinSession(session)}
                    className="flex items-center gap-1"
                    disabled={session.status === 'ended'}
                  >
                    <Play className="w-3 h-3" />
                    {session.status === 'live' ? 'Rejoindre le live' : 
                     session.status === 'scheduled' ? 'Détails' : 'Terminée'}
                  </Button>
                  {session.status === 'scheduled' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Mettre à jour le statut de la session en "live"
                        const updatedSessions = liveSessions.map(s => 
                          s.id === session.id ? { ...s, status: 'live' as const } : s
                        );
                        localStorage.setItem('doremi_live_sessions', JSON.stringify(updatedSessions));
                        window.location.reload(); // Recharger pour voir les changements
                      }}
                      className="flex items-center gap-1"
                      title="Marquer comme en direct"
                    >
                      <Radio className="w-3 h-3" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(session.link, '_blank')}
                    className="flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    Voir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal pour le live intégré */}
      {selectedSession && (
        <LiveSessionModal session={selectedSession} onClose={() => setSelectedSession(null)} />
      )}
    </div>
  );
};

interface LiveSessionModalProps {
  session: LiveSession;
  onClose: () => void;
}

export const LiveSessionModal: React.FC<LiveSessionModalProps> = ({ session, onClose }) => {
  const [isLive, setIsLive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    user: string;
    message: string;
    timestamp: string;
  }>>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Fonctions utilitaires pour le statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'text-blue-600 bg-blue-100';
      case 'live':
        return 'text-green-600 bg-green-100';
      case 'ended':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Planifiée';
      case 'live':
        return 'En direct';
      case 'ended':
        return 'Terminée';
      default:
        return 'Inconnu';
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startLive = async () => {
    console.log('🟢 Bouton Rejoindre le live cliqué !');
    console.log('📍 URL actuelle:', window.location.href);
    console.log('🌐 Hostname:', window.location.hostname);
    
    try {
      // Vérifier si l'API mediaDevices est disponible
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.log('❌ API mediaDevices non disponible');
        // Rediriger automatiquement vers localhost si nécessaire
        if (window.location.hostname !== 'localhost') {
          console.log('🔄 Redirection vers localhost...');
          const localhostUrl = window.location.href.replace(window.location.hostname, 'localhost');
          window.location.href = localhostUrl;
          return;
        }
        throw new Error('L\'API mediaDevices n\'est pas disponible.');
      }
      
      console.log('✅ API mediaDevices disponible');

      console.log('🎥 Demande d\'accès à la caméra/microphone...');
      // Demander l'autorisation pour la caméra et le microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoOn,
        audio: !isMuted
      });
      
      console.log('✅ Stream obtenu:', stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        console.log('📹 Vidéo configurée');
      }
      
      setIsLive(true);
      console.log('🎉 Live démarré avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'accès à la caméra/microphone:', error);
      
      // Messages d'erreur simplifiés
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          alert('Veuillez autoriser l\'accès à votre caméra et microphone.');
        } else if (error.name === 'NotFoundError') {
          alert('Aucune caméra ou microphone trouvé. Vérifiez votre équipement.');
        } else if (error.name === 'NotReadableError') {
          alert('Votre caméra ou microphone est déjà utilisé par une autre application.');
        } else {
          alert('Erreur lors du démarrage du live. Assurez-vous d\'utiliser localhost.');
        }
      } else {
        alert('Erreur lors du démarrage du live.');
      }
    }
  };

  const stopLive = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsLive(false);
  };

  const toggleMute = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const sendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: Math.random().toString(36).substr(2, 9),
        user: 'Vous',
        message: chatMessage.trim(),
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, newMessage]);
      setChatMessage('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">{session.title}</h3>
            <p className="text-sm text-gray-500">{session.description}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                {getStatusText(session.status)}
              </span>
              {session.status === 'live' && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => window.open(session.link, '_blank')}
                  className="flex items-center gap-1"
                >
                  <Play className="w-3 h-3" />
                  Rejoindre le live
                </Button>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </Button>
        </div>
        
        <div className="flex h-[70vh]">
          {/* Zone vidéo principale */}
          <div className="flex-1 p-4">
            <div className="bg-black rounded-lg h-full flex items-center justify-center relative">
              {!isLive ? (
                <div className="text-center text-white">
                  <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-4">
                    {session.status === 'live' ? 'Session en cours' : 'Session live prête'}
                  </p>
                  
                  <div className="mb-6 text-sm opacity-75">
                    <p>🎥 Cette session est configurée pour rejoindre un live externe</p>
                    <p>📺 Cliquez ci-dessous pour rejoindre le live</p>
                    <p>💬 Vous pourrez interagir avec l'instructeur</p>
                  </div>
                  
                  <Button 
                    onClick={() => {
                      console.log('🔘 Bouton cliqué !');
                      // Ouvrir directement le lien externe
                      window.open(session.link, '_blank');
                    }} 
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold"
                    size="lg"
                  >
                    <Play className="w-6 h-6 mr-3" />
                    Rejoindre le live
                  </Button>
                  
                  <p className="text-xs mt-3 opacity-60">
                    Ouvre le live dans un nouvel onglet
                  </p>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover rounded-lg"
                />
              )}
              
              {/* Contrôles du live */}
              {isLive && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleMute}
                    className={`${isMuted ? 'bg-red-500 text-white' : ''}`}
                  >
                    {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleVideo}
                    className={`${!isVideoOn ? 'bg-red-500 text-white' : ''}`}
                  >
                    {isVideoOn ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={stopLive}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    Arrêter
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Chat */}
          <div className="w-80 border-l flex flex-col">
            <div className="p-4 border-b">
              <h4 className="font-medium flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Chat en direct
              </h4>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                    <User className="w-3 h-3" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{msg.user}</span>
                      <span className="text-xs text-gray-500">{msg.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-700">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Tapez votre message..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button size="sm" onClick={sendMessage}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 