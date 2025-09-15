
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Save, 
  HardDrive,
  FileText,
  Video,
  Download,
  Upload
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ProfilePictureUpload } from '../components/settings/ProfilePictureUpload';
import { ThemeToggle } from '../components/settings/ThemeToggle';
import { NotificationSubscription } from '../components/ui/NotificationSubscription';
import { EducationLevel } from '../types/course';
import { supabase } from '../integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export const Settings: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    bio: '',
  });

  const [storageStats] = useState({
    videosDownloaded: 15,
    pdfsDownloaded: 32,
    totalStorage: '2.4 GB',
    maxStorage: '10 GB'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateProfile(formData);
    console.log('Saving settings:', formData);
    alert('Paramètres sauvegardés avec succès !');
  };

  // La sélection du niveau d'étude est maintenant gérée à l'inscription

  const handleCVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Veuillez sélectionner un fichier PDF uniquement.');
      return;
    }
    try {
      // Utiliser l'ID utilisateur pour le nom du fichier
      const filePath = `cv_${user.id}_${Date.now()}.pdf`;
      const { error: uploadError } = await supabase.storage.from('cvs').upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'application/pdf',
      });
      if (uploadError) throw uploadError;
      // Récupérer l'URL publique
      const { data } = supabase.storage.from('cvs').getPublicUrl(filePath);
      if (!data.publicUrl) throw new Error('Erreur lors de la récupération de l’URL du fichier.');
      updateProfile({ cv: data.publicUrl, isVerified: true });
      alert('CV PDF téléchargé avec succès ! Votre compte sera vérifié sous 24h.');
    } catch (err: any) {
      alert('Erreur lors de l’upload du CV : ' + (err.message || err));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground">Gérez vos préférences et informations personnelles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Picture */}
          <ProfilePictureUpload />

          {/* Sélection du niveau d'étude déplacée vers le formulaire d'inscription */}

          {/* CV Upload for Instructors */}
          {/* SUPPRIMÉ : L'ajout de CV se fait désormais à l'inscription formateur */}

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Modifiez vos informations de base
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+221 77 123 45 67"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Biographie</Label>
                <textarea
                  id="bio"
                  className="w-full px-3 py-2 border border-input rounded-md resize-none h-24"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Parlez-nous de vous..."
                />
              </div>

              <Button onClick={handleSave} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder les modifications
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          {/* Theme Settings */}
          <ThemeToggle />

          {/* Email Notifications */}
          <NotificationSubscription />

          {/* Storage Stats for Students */}
          {user?.role === 'student' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="w-5 h-5" />
                  Espace de stockage
                </CardTitle>
                <CardDescription>
                  Utilisation de votre espace de téléchargement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Utilisé</span>
                  <span className="font-medium">{storageStats.totalStorage} / {storageStats.maxStorage}</span>
                </div>
                
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '24%' }}></div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Vidéos</span>
                    </div>
                    <span className="text-sm font-medium">{storageStats.videosDownloaded}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Documents PDF</span>
                    </div>
                    <span className="text-sm font-medium">{storageStats.pdfsDownloaded}</span>
                  </div>
                </div>

                {user.isPremium ? (
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                      Stockage illimité avec Premium
                    </p>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full" onClick={() => navigate('/premium')}>
                    <Download className="w-4 h-4 mr-2" />
                    Passer à Premium
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Account Type */}
          <Card>
            <CardHeader>
              <CardTitle>Type de compte</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="font-medium capitalize">{user?.role === 'teacher' ? 'Formateur' : user?.role}</p>
                {user?.isPremium && (
                  <span className="premium-badge mt-2 inline-block">Premium</span>
                )}
                {user?.role === 'teacher' && (
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.isVerified ? 'Vérifié' : 'En attente de vérification'}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
