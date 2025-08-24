import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Phone, 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  PhoneOff, 
  Settings,
  MessageSquare,
  Users,
  Maximize,
  Minimize,
  ArrowLeft
} from 'lucide-react';

export const VideoCall: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Récupérer le nom de l'utilisateur depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get('user');
    setUserName(user || 'Utilisateur');

    // Démarrer le chronomètre
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    if (confirm('Êtes-vous sûr de vouloir terminer l\'appel ?')) {
      // Retourner à la messagerie
      window.location.href = '/messages';
    }
  };

  const handleBackToMessages = () => {
    window.location.href = '/messages';
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex flex-col">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
              {userName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-white font-bold text-lg">{userName}</h1>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm">En appel</span>
              <span className="text-gray-400 text-sm">•</span>
              <span className="text-gray-400 text-sm">{formatDuration(callDuration)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" onClick={handleBackToMessages}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </Button>
          <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
          {/* Video Local */}
          <Card className="bg-black/30 backdrop-blur-sm border-gray-700">
            <CardContent className="p-0">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center relative">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Video className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-white font-medium">Votre caméra</p>
                  <p className="text-gray-400 text-sm">Cliquez pour activer</p>
                </div>
                {isVideoOff && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-xs">
                    Caméra désactivée
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Video Remote */}
          <Card className="bg-black/30 backdrop-blur-sm border-gray-700">
            <CardContent className="p-0">
              <div className="aspect-video bg-gradient-to-br from-purple-800 to-blue-900 rounded-lg flex items-center justify-center relative">
                <div className="text-center">
                  <Avatar className="w-32 h-32 mx-auto mb-4">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random&size=128`} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white font-bold text-3xl">
                      {userName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-white font-medium text-lg">{userName}</p>
                  <p className="text-gray-400 text-sm">En attente de connexion...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-black/50 backdrop-blur-sm p-6">
        <div className="flex items-center justify-center space-x-4">
          <Button 
            size="lg" 
            variant="ghost" 
            className={`rounded-full w-16 h-16 ${isMuted ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white/20 text-white hover:bg-white/30'}`}
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </Button>
          
          <Button 
            size="lg" 
            variant="ghost" 
            className={`rounded-full w-16 h-16 ${isVideoOff ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white/20 text-white hover:bg-white/30'}`}
            onClick={() => setIsVideoOff(!isVideoOff)}
          >
            {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
          </Button>
          
          <Button 
            size="lg" 
            className="rounded-full w-16 h-16 bg-red-500 text-white hover:bg-red-600"
            onClick={handleEndCall}
          >
            <PhoneOff className="w-6 h-6" />
          </Button>
          
          <Button 
            size="lg" 
            variant="ghost" 
            className="rounded-full w-16 h-16 bg-white/20 text-white hover:bg-white/30"
          >
            <MessageSquare className="w-6 h-6" />
          </Button>
          
          <Button 
            size="lg" 
            variant="ghost" 
            className="rounded-full w-16 h-16 bg-white/20 text-white hover:bg-white/30"
          >
            <Users className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
