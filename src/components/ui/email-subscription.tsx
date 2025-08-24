import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Mail, 
  Check, 
  AlertCircle,
  Bell,
  Video,
  Play
} from 'lucide-react';
import { emailService } from '../../lib/emailService';

export const EmailSubscription: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [preferences, setPreferences] = useState({
    videos: true,
    lives: true,
    general: true
  });

  useEffect(() => {
    // Vérifier si l'email actuel est déjà abonné
    const subscribers = emailService.getSubscribers();
    if (email && subscribers.includes(email)) {
      setIsSubscribed(true);
    } else {
      setIsSubscribed(false);
    }
  }, [email]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubscribe = async () => {
    if (!email.trim()) {
      setError('Veuillez saisir votre adresse email.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Veuillez saisir une adresse email valide.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      emailService.subscribe(email);
      setIsSubscribed(true);
      setSuccess('Vous êtes maintenant abonné aux notifications par email !');
      
      // Réinitialiser le message de succès après 3 secondes
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Erreur lors de l\'abonnement. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!email.trim()) {
      setError('Veuillez saisir votre adresse email.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      emailService.unsubscribe(email);
      setIsSubscribed(false);
      setSuccess('Vous êtes maintenant désabonné des notifications par email.');
      
      // Réinitialiser le message de succès après 3 secondes
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Erreur lors du désabonnement. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Notifications par email
        </CardTitle>
        <CardDescription>
          Recevez des notifications par email quand de nouveaux contenus sont disponibles
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Adresse email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            className="w-full"
          />
        </div>

        {!isSubscribed && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Types de notifications :</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="videos"
                  checked={preferences.videos}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, videos: checked as boolean }))
                  }
                />
                <Label htmlFor="videos" className="flex items-center gap-2 text-sm">
                  <Video className="w-4 h-4" />
                  Nouvelles vidéos
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="lives"
                  checked={preferences.lives}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, lives: checked as boolean }))
                  }
                />
                <Label htmlFor="lives" className="flex items-center gap-2 text-sm">
                  <Play className="w-4 h-4" />
                  Sessions live
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="general"
                  checked={preferences.general}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, general: checked as boolean }))
                  }
                />
                <Label htmlFor="general" className="flex items-center gap-2 text-sm">
                  <Bell className="w-4 h-4" />
                  Notifications générales
                </Label>
              </div>
            </div>
          </div>
        )}

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

        <Button 
          onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
          className="w-full"
          disabled={isLoading}
          variant={isSubscribed ? "outline" : "default"}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
              {isSubscribed ? 'Désabonnement...' : 'Abonnement...'}
            </>
          ) : (
            <>
              {isSubscribed ? (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Se désabonner
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  S'abonner
                </>
              )}
            </>
          )}
        </Button>

        {isSubscribed && (
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-700">
                Vous recevrez les notifications par email
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 