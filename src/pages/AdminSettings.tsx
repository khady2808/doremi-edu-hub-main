import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User,
  Shield,
  Bell,
  Lock,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Settings,
  Eye,
  EyeOff,
  Key,
  Activity,
  Globe,
  Palette,
  Database,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';

interface AdminProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar: string;
  location: string;
  bio: string;
  permissions: string[];
  lastLogin: string;
  isActive: boolean;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  passwordLastChanged: string;
  failedLoginAttempts: number;
  ipWhitelist: string[];
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  systemAlerts: boolean;
  userReports: boolean;
  securityAlerts: boolean;
  maintenanceAlerts: boolean;
}

interface SystemSettings {
  language: string;
  theme: string;
  timezone: string;
  dateFormat: string;
  autoLogout: boolean;
  debugMode: boolean;
}

export const AdminSettings: React.FC = () => {
  const { toast } = useToast();
  const { user, updateProfilePicture } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Données simulées pour le profil administrateur
  const [profile, setProfile] = useState<AdminProfile>({
    id: 'admin-001',
    name: user?.name || 'Admin DOREMI',
    email: user?.email || 'admin@doremi.fr',
    phone: '+221 77 123 45 67',
    role: 'Super Administrateur',
    avatar: user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    location: 'Dakar, Sénégal',
    bio: 'Administrateur principal de la plateforme DOREMI avec 5 ans d\'expérience dans la gestion de plateformes éducatives.',
    permissions: ['users_manage', 'content_moderate', 'analytics_view', 'system_config', 'security_manage'],
    lastLogin: '2024-01-15T14:30:00Z',
    isActive: true
  });

  const [securitySettings] = useState<SecuritySettings>({
    twoFactorEnabled: true,
    sessionTimeout: 30,
    passwordLastChanged: '2024-01-01T10:00:00Z',
    failedLoginAttempts: 0,
    ipWhitelist: ['192.168.1.100', '10.0.0.50']
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    systemAlerts: true,
    userReports: true,
    securityAlerts: true,
    maintenanceAlerts: false
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    language: 'fr',
    theme: 'light',
    timezone: 'Africa/Dakar',
    dateFormat: 'DD/MM/YYYY',
    autoLogout: true,
    debugMode: false
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSaveProfile = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Simulation de sauvegarde
    }, 1000);
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      // Simulation de changement de mot de passe
    }, 1000);
  };

  const handleNotificationToggle = (key: keyof NotificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSystemSettingChange = (key: keyof SystemSettings, value: any) => {
    setSystemSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Erreur",
          description: "Veuillez sélectionner un fichier image valide.",
          variant: "destructive",
        });
        return;
      }

      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erreur",
          description: "La taille du fichier ne doit pas dépasser 5MB.",
          variant: "destructive",
        });
        return;
      }

      setSelectedImage(file);
      
      // Créer l'URL de prévisualisation
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      toast({
        title: "Image sélectionnée",
        description: "Image prête à être uploadée. Cliquez sur 'Confirmer' pour l'appliquer.",
      });
    }
  };

  const handleUploadImage = () => {
    if (selectedImage) {
      // Simuler l'upload de l'image
      setIsLoading(true);
      
      setTimeout(() => {
        // Ici, vous pouvez ajouter la logique pour uploader l'image vers votre serveur
        console.log('Image sélectionnée:', selectedImage);
        
        // Mettre à jour l'avatar dans le contexte d'authentification
        updateProfilePicture(previewUrl);
        
        // Mettre à jour l'avatar local
        setProfile(prev => ({
          ...prev,
          avatar: previewUrl
        }));
        
        setIsLoading(false);
        setSelectedImage(null);
        
        // Nettoyer l'URL de prévisualisation
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl('');
        }
        
        toast({
          title: "Succès",
          description: "Photo de profil mise à jour avec succès !",
        });
      }, 1000);
    }
  };

  const triggerFileInput = () => {
    const fileInput = document.getElementById('profile-image-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  // Nettoyer les URLs de prévisualisation lors du démontage du composant
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Synchroniser le profil avec les données utilisateur du contexte
  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }));
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Paramètres Administrateur</h1>
              <p className="text-gray-600 mt-2">Gérez votre profil, sécurité et préférences système</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Shield className="w-4 h-4 mr-1" />
                Super Admin
              </Badge>
              <Button onClick={handleSaveProfile} disabled={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu Principal */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profil
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Sécurité
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Système
              </TabsTrigger>
            </TabsList>

            {/* Onglet Profil */}
            <TabsContent value="profile" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Informations Personnelles */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Informations Personnelles
                    </CardTitle>
                    <CardDescription>
                      Gérez vos informations de base et votre profil public
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Nom complet</label>
                        <Input value={profile.name} className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <Input value={profile.email} type="email" className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Téléphone</label>
                        <Input value={profile.phone} className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Localisation</label>
                        <Input value={profile.location} className="mt-1" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Bio</label>
                      <Textarea value={profile.bio} rows={3} className="mt-1" />
                    </div>
                  </CardContent>
                </Card>

                {/* Photo de Profil */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="w-5 h-5" />
                      Photo de Profil
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col items-center space-y-4">
                      <img
                        src={previewUrl || profile.avatar}
                        alt={profile.name}
                        className="w-24 h-24 rounded-full border-4 border-gray-200 object-cover"
                      />
                      
                      {/* Input file caché */}
                      <input
                        id="profile-image-input"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      
                      <div className="flex flex-col gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={triggerFileInput}
                          disabled={isLoading}
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          {isLoading ? 'Chargement...' : 'Changer la photo'}
                        </Button>
                        
                        {selectedImage && (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={handleUploadImage}
                            disabled={isLoading}
                          >
                            {isLoading ? 'Upload en cours...' : 'Confirmer'}
                          </Button>
                        )}
                      </div>
                      
                      {selectedImage && (
                        <div className="text-xs text-gray-500 text-center">
                          Fichier sélectionné: {selectedImage.name}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Informations Système */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Informations Système
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Rôle</span>
                      <Badge variant="secondary">{profile.role}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Statut</span>
                      <Badge variant={profile.isActive ? "default" : "destructive"}>
                        {profile.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Dernière connexion</span>
                      <span className="text-sm text-gray-600">{formatDate(profile.lastLogin)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Sécurité */}
            <TabsContent value="security" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Changement de Mot de Passe */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="w-5 h-5" />
                      Changer le Mot de Passe
                    </CardTitle>
                    <CardDescription>
                      Mettez à jour votre mot de passe pour maintenir la sécurité
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Mot de passe actuel</label>
                      <div className="relative mt-1">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Nouveau mot de passe</label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Confirmer le nouveau mot de passe</label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <Button onClick={handleChangePassword} disabled={isLoading} className="w-full">
                      {isLoading ? 'Changement...' : 'Changer le mot de passe'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Paramètres de Sécurité */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Paramètres de Sécurité
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Authentification à deux facteurs</p>
                        <p className="text-xs text-gray-600">Ajoutez une couche de sécurité supplémentaire</p>
                      </div>
                      <Switch checked={securitySettings.twoFactorEnabled} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Déconnexion automatique</p>
                        <p className="text-xs text-gray-600">Après {securitySettings.sessionTimeout} minutes d'inactivité</p>
                      </div>
                      <Select value={securitySettings.sessionTimeout.toString()}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 min</SelectItem>
                          <SelectItem value="30">30 min</SelectItem>
                          <SelectItem value="60">1 heure</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">
                          Mot de passe changé le {formatDate(securitySettings.passwordLastChanged)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Onglet Notifications */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Paramètres de Notifications
                  </CardTitle>
                  <CardDescription>
                    Configurez les types de notifications que vous souhaitez recevoir
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Notifications par email</p>
                        <p className="text-xs text-gray-600">Recevez les alertes importantes par email</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Notifications push</p>
                        <p className="text-xs text-gray-600">Alertes en temps réel dans le navigateur</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.pushNotifications}
                        onCheckedChange={() => handleNotificationToggle('pushNotifications')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Alertes système</p>
                        <p className="text-xs text-gray-600">Notifications sur l'état du système</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.systemAlerts}
                        onCheckedChange={() => handleNotificationToggle('systemAlerts')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Rapports utilisateurs</p>
                        <p className="text-xs text-gray-600">Signalements et rapports d'utilisateurs</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.userReports}
                        onCheckedChange={() => handleNotificationToggle('userReports')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Alertes de sécurité</p>
                        <p className="text-xs text-gray-600">Tentatives de connexion suspectes</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.securityAlerts}
                        onCheckedChange={() => handleNotificationToggle('securityAlerts')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Maintenance</p>
                        <p className="text-xs text-gray-600">Notifications de maintenance planifiée</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.maintenanceAlerts}
                        onCheckedChange={() => handleNotificationToggle('maintenanceAlerts')}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Système */}
            <TabsContent value="system" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Préférences Générales */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Préférences Générales
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Langue</label>
                      <Select value={systemSettings.language} onValueChange={(value) => handleSystemSettingChange('language', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Thème</label>
                      <Select value={systemSettings.theme} onValueChange={(value) => handleSystemSettingChange('theme', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Clair</SelectItem>
                          <SelectItem value="dark">Sombre</SelectItem>
                          <SelectItem value="auto">Automatique</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Fuseau horaire</label>
                      <Select value={systemSettings.timezone} onValueChange={(value) => handleSystemSettingChange('timezone', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Africa/Dakar">Dakar (UTC+0)</SelectItem>
                          <SelectItem value="Europe/Paris">Paris (UTC+1)</SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Format de date</label>
                      <Select value={systemSettings.dateFormat} onValueChange={(value) => handleSystemSettingChange('dateFormat', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Paramètres Avancés */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      Paramètres Avancés
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Déconnexion automatique</p>
                        <p className="text-xs text-gray-600">Se déconnecter après inactivité</p>
                      </div>
                      <Switch 
                        checked={systemSettings.autoLogout}
                        onCheckedChange={(checked) => handleSystemSettingChange('autoLogout', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Mode debug</p>
                        <p className="text-xs text-gray-600">Afficher les informations de débogage</p>
                      </div>
                      <Switch 
                        checked={systemSettings.debugMode}
                        onCheckedChange={(checked) => handleSystemSettingChange('debugMode', checked)}
                      />
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">
                          Version: 2.1.0 | Environnement: Production
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default AdminSettings;
