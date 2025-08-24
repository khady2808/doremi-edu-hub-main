import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Bell, 
  Mail, 
  Check, 
  AlertCircle,
  Settings,
  Video,
  Calendar
} from 'lucide-react';
import { emailService } from '../../lib/emailService';
import { useAuth } from '../../context/AuthContext';

export const NotificationSubscription: React.FC = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [preferences, setPreferences] = useState({
    videoNotifications: true,
    liveNotifications: true,
    generalNotifications: true,
  });

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà abonné
    const subscribers = emailService.getSubscribers();
    if (user?.email && subscribers.includes(user.email)) {
      setIsSubscribed(true);
      setEmail(user.email);
      
      // Charger les préférences existantes
      const userPreferences = emailService.getPreferences(user.email);
      if (userPreferences) {
        setPreferences({
          videoNotifications: userPreferences.videoNotifications,
          liveNotifications: userPreferences.liveNotifications,
          generalNotifications: userPreferences.generalNotifications,
        });
      }
    }
  }, [user?.email]);

  const handleSubscribe = async () => {
    if (!email.trim()) {
      setMessage({ type: 'error', text: 'Veuillez entrer une adresse email valide.' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      emailService.subscribe(email);
      setIsSubscribed(true);
      setMessage({ type: 'success', text: 'Vous êtes maintenant abonné aux notifications !' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'abonnement. Veuillez réessayer.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      emailService.unsubscribe(email);
      setIsSubscribed(false);
      setMessage({ type: 'success', text: 'Vous êtes maintenant désabonné des notifications.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors du désabonnement. Veuillez réessayer.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferenceChange = (key: keyof typeof preferences) => {
    const newPreferences = {
      ...preferences,
      [key]: !preferences[key]
    };
    setPreferences(newPreferences);
    
    // Sauvegarder les préférences
    if (email) {
      emailService.updatePreferences(email, newPreferences);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications par Email
        </CardTitle>
        <CardDescription>
          Restez informé des nouvelles vidéos et sessions live
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isSubscribed ? (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                disabled={isLoading}
              />
            </div>
            
            <Button 
              onClick={handleSubscribe} 
              className="w-full" 
              disabled={isLoading || !email.trim()}
            >
              {isLoading ? (
                <>
                  <Settings className="w-4 h-4 mr-2 animate-spin" />
                  Abonnement en cours...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  S'abonner aux notifications
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-medium">
                Abonné aux notifications
              </span>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Préférences de notification
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Nouvelles vidéos</span>
                  </div>
                  <Switch
                    checked={preferences.videoNotifications}
                    onCheckedChange={() => handlePreferenceChange('videoNotifications')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Sessions live</span>
                  </div>
                  <Switch
                    checked={preferences.liveNotifications}
                    onCheckedChange={() => handlePreferenceChange('liveNotifications')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-purple-500" />
                    <span className="text-sm">Notifications générales</span>
                  </div>
                  <Switch
                    checked={preferences.generalNotifications}
                    onCheckedChange={() => handlePreferenceChange('generalNotifications')}
                  />
                </div>
              </div>
            </div>

            <Button 
              variant="outline" 
              onClick={handleUnsubscribe} 
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Settings className="w-4 h-4 mr-2 animate-spin" />
                  Désabonnement en cours...
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Se désabonner
                </>
              )}
            </Button>
          </div>
        )}

        {message && (
          <div className={`p-3 rounded-lg text-sm ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <Check className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              {message.text}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Recevez des notifications pour les nouvelles vidéos</p>
          <p>• Soyez informé des sessions live à venir</p>
          <p>• Vous pouvez vous désabonner à tout moment</p>
        </div>
      </CardContent>
    </Card>
  );
}; 