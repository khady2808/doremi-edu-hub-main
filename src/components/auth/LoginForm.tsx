
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Mail, Lock, User, Upload, FileText, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const LoginForm: React.FC = () => {
  const { login, register } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'student' as 'student' | 'instructor' | 'recruiter',
    studentCycle: '' as '' | 'lyceen' | 'licence' | 'master' | 'doctorat',
    cv: null as File | null
  });
  const [cvError, setCvError] = useState<string | null>(null);
  const [cycleError, setCycleError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const user = await login(loginData.email, loginData.password);
      toast({
        title: "Connexion réussie !",
        description: "Bienvenue sur DOREMI"
      });
      // Redirection par rôle après connexion
      switch (user.role) {
        case 'admin':
          window.location.href = '/admin';
          break;
        case 'instructor':
          window.location.href = '/';
          break;
        case 'recruiter':
          window.location.href = '/recruiter';
          break;
        default:
          window.location.href = '/';
      }
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Vérifiez vos identifiants",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validation pour les formateurs
    if (registerData.role === 'instructor' && !registerData.cv) {
      setCvError('Le CV est obligatoire pour les formateurs');
      setIsLoading(false);
      return;
    }

    // Validation pour les étudiants: cycle obligatoire
    if (registerData.role === 'student' && !registerData.studentCycle) {
      setCycleError('Le cycle est obligatoire pour les étudiants');
      setIsLoading(false);
      return;
    }
    
    try {
      await register(
        registerData.email,
        registerData.password,
        registerData.name,
        registerData.role,
        registerData.role === 'student' ? registerData.studentCycle : undefined,
        registerData.cv
      );
      toast({
        title: "Inscription réussie !",
        description: "Votre compte a été créé avec succès"
      });
    } catch (error) {
      toast({
        title: "Erreur d'inscription",
        description: (error as Error).message || "Une erreur est survenue",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      setCvError('Le CV doit être un fichier PDF');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB max
      setCvError('Le CV ne doit pas dépasser 5MB');
      return;
    }
    
    setCvError(null);
    setRegisterData(prev => ({ ...prev, cv: file }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">DOREMI</h1>
          <p className="text-gray-600 mt-2">Votre plateforme éducative</p>
        </div>

        <Card className="shadow-xl">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="register">Inscription</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardHeader>
                  <CardTitle>Se connecter</CardTitle>
                  <CardDescription>
                    Accédez à votre espace DOREMI
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="etudiant@doremi.fr"
                        value={loginData.email}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Comptes de test :</p>
                    <p>• Étudiant : etudiant@doremi.fr</p>
                    <p>• Formateur : formateur@doremi.fr</p>
                    <p>• Admin : admin@doremi.fr</p>
                    <p>• Recruteur : recruteur@doremi.fr</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Connexion..." : "Se connecter"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister}>
                <CardHeader>
                  <CardTitle>S'inscrire</CardTitle>
                  <CardDescription>
                    Créez votre compte DOREMI
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Jean Dupont"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="jean@example.com"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Rôle</Label>
                    <Select value={registerData.role} onValueChange={(value: 'student' | 'instructor' | 'recruiter') => {
                      setRegisterData({...registerData, role: value, cv: null, studentCycle: ''});
                      setCvError(null);
                      setCycleError(null);
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Étudiant</SelectItem>
                        <SelectItem value="instructor">Formateur</SelectItem>
                        <SelectItem value="recruiter">Recruteur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Select Cycle pour les étudiants */}
                  {registerData.role === 'student' && (
                    <div className="space-y-2">
                      <Label htmlFor="cycle">Cycle / Niveau d’étude *</Label>
                      <Select
                        value={registerData.studentCycle || ''}
                        onValueChange={(value: 'lyceen' | 'licence' | 'master' | 'doctorat') => {
                          setRegisterData({ ...registerData, studentCycle: value });
                          setCycleError(null);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez votre cycle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lyceen">Lycéen</SelectItem>
                          <SelectItem value="licence">Étudiant Licence</SelectItem>
                          <SelectItem value="master">Étudiant Master</SelectItem>
                          <SelectItem value="doctorat">Étudiant Doctorat</SelectItem>
                        </SelectContent>
                      </Select>
                      {cycleError && (
                        <div className="text-red-600 text-sm font-medium flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          {cycleError}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Upload CV pour les formateurs */}
                  {registerData.role === 'instructor' && (
                    <div className="space-y-2">
                      <Label htmlFor="cv" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        CV (PDF obligatoire) *
                      </Label>
                      <div className={`border-2 border-dashed rounded-lg p-4 text-center hover:border-primary transition-colors ${
                        cvError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleCVUpload}
                          className="hidden"
                          id="cv"
                        />
                        <label htmlFor="cv" className="cursor-pointer">
                          {registerData.cv ? (
                            <div className="space-y-2">
                              <FileText className="w-8 h-8 text-green-500 mx-auto" />
                              <p className="text-sm font-medium text-green-600">
                                {registerData.cv.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(registerData.cv.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                              <p className="text-sm text-gray-600">
                                Cliquez pour télécharger votre CV
                              </p>
                              <p className="text-xs text-gray-500">
                                Format PDF uniquement (max 5MB)
                              </p>
                            </div>
                          )}
                        </label>
                      </div>
                      {cvError && (
                        <div className="text-red-600 text-sm font-medium flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          {cvError}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Inscription..." : "S'inscrire"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};
