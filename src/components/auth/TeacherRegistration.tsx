
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  User, 
  IdCard, 
  Check, 
  AlertCircle,
  GraduationCap,
  Award,
  PenTool,
  AlertTriangle
} from 'lucide-react';

interface TeacherData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bio: string;
  };
  documents: {
    cv: File | null;
    photo: File | null;
    idCard: File | null;
  };
  experience: {
    yearsExperience: string;
    specializations: string[];
    education: string;
  };
}

export const TeacherRegistration: React.FC = () => {
  const [step, setStep] = useState(1);
  const [newSpec, setNewSpec] = useState('');
  const [teacherData, setTeacherData] = useState<TeacherData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      bio: ''
    },
    documents: {
      cv: null,
      photo: null,
      idCard: null
    },
    experience: {
      yearsExperience: '',
      specializations: [],
      education: ''
    }
  });
  const [cvError, setCvError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (fileType: keyof TeacherData['documents'], file: File) => {
    if (fileType === 'cv') {
      if (file.type !== 'application/pdf') {
        setCvError('Le CV doit être un fichier PDF.');
        return;
      } else {
        setCvError(null);
      }
    }
    setTeacherData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [fileType]: file
      }
    }));
  };

  const handlePersonalInfoChange = (field: string, value: string) => {
    setTeacherData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const handleExperienceChange = (field: string, value: string | string[]) => {
    setTeacherData(prev => ({
      ...prev,
      experience: {
        ...prev.experience,
        [field]: value
      }
    }));
  };

  const addSpecialization = (spec: string) => {
    if (spec && !teacherData.experience.specializations.includes(spec)) {
      handleExperienceChange('specializations', [...teacherData.experience.specializations, spec]);
    }
  };

  const removeSpecialization = (spec: string) => {
    handleExperienceChange('specializations', 
      teacherData.experience.specializations.filter(s => s !== spec)
    );
  };

  const FileUploadComponent = ({ 
    title, 
    description, 
    icon: Icon, 
    fileType, 
    acceptedFormats,
    currentFile,
    isRequired = false
  }: {
    title: string;
    description: string;
    icon: React.ElementType;
    fileType: keyof TeacherData['documents'];
    acceptedFormats: string;
    currentFile: File | null;
    isRequired?: boolean;
  }) => (
    <Card className={`hover:shadow-md transition-shadow ${isRequired && !currentFile ? 'border-red-300 bg-red-50' : ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="w-5 h-5 text-primary" />
          {title}
          {isRequired && <span className="text-red-500">*</span>}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors ${
          isRequired && !currentFile ? 'border-red-300' : 'border-gray-300'
        }`}>
          <input
            type="file"
            accept={acceptedFormats}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(fileType, file);
            }}
            className="hidden"
            id={fileType}
          />
          <label htmlFor={fileType} className="cursor-pointer">
            {currentFile ? (
              <div className="space-y-2">
                <Check className="w-8 h-8 text-green-500 mx-auto" />
                <p className="text-sm font-medium text-green-600">
                  {currentFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  Fichier téléchargé avec succès
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                <p className="text-sm text-gray-600">
                  Cliquez pour télécharger
                </p>
                <p className="text-xs text-gray-500">
                  Formats acceptés: {acceptedFormats}
                </p>
                {isRequired && (
                  <p className="text-xs text-red-500 font-medium">
                    Ce document est obligatoire
                  </p>
                )}
              </div>
            )}
          </label>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Informations Personnelles</h2>
        <p className="text-muted-foreground">Renseignez vos informations de base</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom *</Label>
          <Input
            id="firstName"
            value={teacherData.personalInfo.firstName}
            onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
            placeholder="Votre prénom"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom *</Label>
          <Input
            id="lastName"
            value={teacherData.personalInfo.lastName}
            onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
            placeholder="Votre nom"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={teacherData.personalInfo.email}
            onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
            placeholder="votre.email@exemple.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone *</Label>
          <Input
            id="phone"
            type="tel"
            value={teacherData.personalInfo.phone}
            onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
            placeholder="+33 6 12 34 56 78"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Biographie *</Label>
        <Textarea
          id="bio"
          value={teacherData.personalInfo.bio}
          onChange={(e) => handlePersonalInfoChange('bio', e.target.value)}
          placeholder="Présentez-vous en quelques mots... Votre expérience, vos passions, votre approche pédagogique..."
          rows={4}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Documents Requis</h2>
        <p className="text-muted-foreground">Téléchargez les documents obligatoires</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FileUploadComponent
          title="CV Complet"
          description="Votre curriculum vitae détaillé (PDF uniquement, obligatoire)"
          icon={FileText}
          fileType="cv"
          acceptedFormats=".pdf"
          currentFile={teacherData.documents.cv}
          isRequired={true}
        />
        
        <FileUploadComponent
          title="Photo Professionnelle"
          description="Photo de profil claire et professionnelle"
          icon={User}
          fileType="photo"
          acceptedFormats=".jpg,.jpeg,.png"
          currentFile={teacherData.documents.photo}
          isRequired={true}
        />
        
        <FileUploadComponent
          title="Pièce d'Identité"
          description="Carte d'identité ou passeport"
          icon={IdCard}
          fileType="idCard"
          acceptedFormats=".jpg,.jpeg,.png,.pdf"
          currentFile={teacherData.documents.idCard}
          isRequired={true}
        />
      </div>
      {cvError && (
        <div className="text-red-600 text-sm font-medium text-center flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {cvError}
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Informations importantes</h4>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>• Tous les documents sont obligatoires pour valider votre candidature</li>
              <li>• Le CV doit être au format PDF uniquement</li>
              <li>• Les fichiers doivent être clairement lisibles</li>
              <li>• Taille maximum : 5MB par fichier</li>
              <li>• Vos données sont sécurisées et confidentielles</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => {

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Expérience & Spécialités</h2>
          <p className="text-muted-foreground">Détaillez votre expertise pédagogique</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="education">Formation & Diplômes *</Label>
            <Textarea
              id="education"
              value={teacherData.experience.education}
              onChange={(e) => handleExperienceChange('education', e.target.value)}
              placeholder="Décrivez votre formation, vos diplômes, certifications..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearsExperience">Années d'expérience *</Label>
            <Input
              id="yearsExperience"
              value={teacherData.experience.yearsExperience}
              onChange={(e) => handleExperienceChange('yearsExperience', e.target.value)}
              placeholder="Ex: 5 ans"
            />
          </div>

          <div className="space-y-2">
            <Label>Spécialisations</Label>
            <div className="flex gap-2">
              <Input
                value={newSpec}
                onChange={(e) => setNewSpec(e.target.value)}
                placeholder="Ajoutez une spécialisation"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addSpecialization(newSpec);
                    setNewSpec('');
                  }
                }}
              />
              <Button 
                type="button"
                onClick={() => {
                  addSpecialization(newSpec);
                  setNewSpec('');
                }}
              >
                Ajouter
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {teacherData.experience.specializations.map((spec, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="cursor-pointer"
                  onClick={() => removeSpecialization(spec)}
                >
                  {spec} ×
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleSubmit = async () => {
    if (!isStepValid(3)) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulation de l'envoi des données
      console.log('Candidature soumise:', teacherData);
      
      // En production, appeler l'API d'inscription
      // await register(teacherData.personalInfo.email, password, fullName, 'instructor', teacherData.documents.cv);
      
      alert('Candidature soumise avec succès ! Vous recevrez un email de confirmation.');
    } catch (error) {
      alert('Erreur lors de la soumission: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return Object.values(teacherData.personalInfo).every(value => value.trim() !== '');
      case 2:
        // Le CV est obligatoire, les autres documents aussi
        return (
          teacherData.documents.cv !== null &&
          teacherData.documents.photo !== null &&
          teacherData.documents.idCard !== null &&
          !cvError
        );
      case 3:
        return teacherData.experience.education.trim() !== '' && 
               teacherData.experience.yearsExperience.trim() !== '';
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <GraduationCap className="w-8 h-8" />
              Devenir Formateur DOREMI
            </CardTitle>
            <CardDescription className="text-blue-100">
              Rejoignez notre équipe d'experts et partagez vos connaissances
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            {/* Progress Steps */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-4">
                {[1, 2, 3].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                      step >= stepNumber 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {stepNumber}
                    </div>
                    {stepNumber < 3 && (
                      <div className={`w-16 h-1 mx-2 ${
                        step > stepNumber ? 'bg-primary' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button 
                variant="outline" 
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
              >
                Précédent
              </Button>
              
              {step < 3 ? (
                <Button 
                  onClick={() => {
                    if (step === 2 && !teacherData.documents.cv) {
                      setCvError('Veuillez ajouter un CV au format PDF pour continuer.');
                      return;
                    }
                    setStep(step + 1);
                  }}
                  disabled={!isStepValid(step)}
                >
                  Suivant
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={!isStepValid(step) || isSubmitting}
                  className="bg-gradient-to-r from-green-600 to-green-700"
                >
                  <Award className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Soumission...' : 'Soumettre ma candidature'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
