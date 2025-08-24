
import React, { useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Camera, Upload, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ProfilePictureUpload: React.FC = () => {
  const { user, updateProfilePicture } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Le fichier est trop volumineux. Taille maximale : 5MB');
        return;
      }

      setIsUploading(true);
      setUploadSuccess(false);

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateProfilePicture(result);
        setIsUploading(false);
        setUploadSuccess(true);
        
        // Réinitialiser le succès après 3 secondes
        setTimeout(() => setUploadSuccess(false), 3000);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Veuillez sélectionner un fichier image valide (JPG, PNG)');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Photo de profil
        </CardTitle>
        <CardDescription>
          Changez votre photo de profil visible par les autres utilisateurs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="relative cursor-pointer" onClick={handleUploadClick}>
            <div className="w-24 h-24 rounded-full overflow-hidden bg-primary flex items-center justify-center">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Photo de profil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-white" />
              )}
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
            {uploadSuccess && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center">
                <Check className="w-4 h-4" />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              onClick={handleUploadClick}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                  Téléchargement...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Télécharger une photo
                </>
              )}
            </Button>
            <p className="text-sm text-muted-foreground">
              Formats acceptés : JPG, PNG (max. 5MB)
            </p>
            {uploadSuccess && (
              <p className="text-sm text-green-600 font-medium">
                ✓ Photo mise à jour avec succès !
              </p>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </CardContent>
    </Card>
  );
};
