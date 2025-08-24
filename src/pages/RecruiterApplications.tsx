import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSearchParams } from 'react-router-dom';
import { internshipService } from '@/lib/internshipService';
import { useAuth } from '@/context/AuthContext';
import { 
  Mail, 
  User, 
  Phone, 
  FileText, 
  Download, 
  Eye, 
  Calendar,
  MapPin,
  Building,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  MessageSquare
} from 'lucide-react';

export const RecruiterApplications: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const offerId = searchParams.get('offer');
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);

  // Mémoriser le service pour éviter les re-créations
  const internshipServiceInstance = useMemo(() => internshipService, []);

  // Mémoriser les candidatures filtrées pour éviter les re-calculs
  const filteredApplications = useMemo(() => {
    const allApplications = internshipServiceInstance.getApplications();
    console.log('📋 Candidatures récupérées du service:', allApplications.length);
    return offerId 
      ? allApplications.filter(a => a.internshipId === offerId) 
      : allApplications;
  }, [offerId, internshipServiceInstance]);

  // Utiliser directement les candidatures mémorisées
  useEffect(() => {
    console.log('🔄 Mise à jour des candidatures affichées:', filteredApplications.length);
    setApplications(filteredApplications);
  }, [filteredApplications]);

  // Recharger les candidatures manuellement
  const reloadApplications = () => {
    console.log('🔄 Rechargement manuel des candidatures...');
    
    // Forcer le rechargement du service
    internshipServiceInstance.reloadApplications();
    
    // Forcer la mise à jour des candidatures mémorisées
    const allApplications = internshipServiceInstance.getApplications();
    console.log('📋 Candidatures rechargées du service:', allApplications.length);
    
    const filtered = offerId 
      ? allApplications.filter(a => a.internshipId === offerId) 
      : allApplications;
    
    setApplications(filtered);
    console.log('✅ Candidatures mises à jour:', filtered.length);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted': return 'Acceptée';
      case 'rejected': return 'Refusée';
      case 'reviewed': return 'En cours';
      default: return 'En attente';
    }
  };

  // Nettoyer les CV compressés
  const cleanCompressedCVs = () => {
    const updatedApplications = applications.filter(app => app.cvFileData !== 'COMPRESSED');
    localStorage.setItem('doremi_internship_applications', JSON.stringify(updatedApplications));
    window.location.reload();
  };

  // Vérifier le localStorage directement
  const checkLocalStorage = () => {
    console.log('🔍 Vérification du localStorage...');
    
    const rawData = localStorage.getItem('doremi_internship_applications');
    console.log('📦 Données brutes localStorage:', rawData ? 'présentes' : 'absentes');
    
    if (rawData) {
      try {
        const parsedData = JSON.parse(rawData);
        console.log('📋 Données parsées:', parsedData.length, 'candidatures');
        console.log('📄 Détails des candidatures:', parsedData.map((app: any) => ({
          id: app.id,
          userName: app.userName,
          internshipTitle: app.internshipTitle,
          status: app.status,
          appliedAt: app.appliedAt
        })));
        
        alert(`LocalStorage contient ${parsedData.length} candidature(s)`);
      } catch (error) {
        console.error('❌ Erreur parsing localStorage:', error);
        alert('Erreur lors du parsing du localStorage');
      }
    } else {
      console.log('📋 Aucune donnée dans localStorage');
      alert('Aucune candidature dans le localStorage');
    }
  };

  // Créer une candidature de test
  const createTestApplication = () => {
    try {
      console.log('🧪 Création d\'une candidature de test...');
      
      const testApplication = {
        id: `test_${Date.now()}`,
        internshipId: 'test_internship',
        internshipTitle: 'Poste de test',
        company: 'Entreprise de test',
        userId: 'test_user',
        userName: 'Candidat Test',
        userEmail: 'test@example.com',
        userRole: 'student',
        userPhone: '123456789',
        cvFileData: 'test_cv_data',
        cvFileName: 'test_cv.pdf',
        cvFileSize: 1024,
        coverLetter: 'Lettre de motivation de test',
        appliedAt: new Date().toISOString(),
        status: 'pending'
      };
      
      // Ajouter directement au localStorage
      const existingApplications = JSON.parse(localStorage.getItem('doremi_internship_applications') || '[]');
      existingApplications.push(testApplication);
      localStorage.setItem('doremi_internship_applications', JSON.stringify(existingApplications));
      
      console.log('✅ Candidature de test créée:', testApplication.id);
      alert('Candidature de test créée ! Rechargez la page pour la voir.');
      
    } catch (error) {
      console.error('❌ Erreur lors de la création de la candidature de test:', error);
      alert('Erreur lors de la création de la candidature de test.');
    }
  };

  const downloadCV = (application: any) => {
    try {
      console.log('📄 Tentative de téléchargement CV:', {
        fileName: application.cvFileName,
        fileSize: application.cvFileSize,
        hasData: !!application.cvFileData,
        dataLength: application.cvFileData ? application.cvFileData.length : 0
      });

      if (!application.cvFileData || 
          application.cvFileData === 'COMPRESSED' || 
          application.cvFileData === 'null' || 
          application.cvFileData === null ||
          application.cvFileData.length === 0) {
        
        let message = 'CV non disponible.';
        if (application.cvFileData === 'COMPRESSED') {
          message = 'CV non disponible. Le fichier a été compressé.';
        } else if (!application.cvFileData || application.cvFileData === 'null' || application.cvFileData === null) {
          message = 'CV non fourni par le candidat.';
        } else if (application.cvFileData.length === 0) {
          message = 'Données du CV manquantes.';
        }
        message += '\n\nVeuillez demander au candidat de renvoyer son CV.';
        alert(message);
        return;
      }

      // Déterminer le type MIME basé sur l'extension du fichier
      const fileName = application.cvFileName || 'cv.pdf';
      const fileExtension = fileName.split('.').pop()?.toLowerCase();
      let mimeType = 'application/pdf'; // Par défaut
      
      if (fileExtension === 'doc') {
        mimeType = 'application/msword';
      } else if (fileExtension === 'docx') {
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      }

      try {
        const blob = internshipServiceInstance.base64ToBlob(application.cvFileData, mimeType);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log('✅ CV téléchargé avec succès:', fileName);
      } catch (blobError) {
        console.error('❌ Erreur lors de la conversion blob:', blobError);
        alert('Erreur lors de la conversion du fichier CV. Le fichier pourrait être corrompu.');
      }
    } catch (error) {
      console.error('❌ Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement du CV. Veuillez réessayer ou contacter le candidat.');
    }
  };

  const updateApplicationStatus = (applicationId: string, status: 'accepted' | 'rejected' | 'reviewed') => {
    try {
      const result = internshipServiceInstance.updateApplicationStatus(applicationId, status);
      if (result.success) {
        let message = result.message;
        if (status === 'accepted') {
          message = '✅ Candidature acceptée ! Une conversation a été créée automatiquement.';
        } else if (status === 'rejected') {
          message = '❌ Candidature refusée. Le candidat a été notifié.';
        } else if (status === 'reviewed') {
          message = '👀 Candidature marquée comme en cours d\'examen.';
        }
        alert(message);
        window.location.reload();
      } else {
        alert(`❌ ${result.message}`);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      alert('Erreur lors de la mise à jour du statut. Veuillez réessayer.');
    }
  };

  // Vérifier et nettoyer les CV compressés au chargement
  // useEffect(() => {
  //   // Nettoyage automatique sans confirmation
  //   cleanCompressedCVs();
  // }, [applications]); // Dépendance à applications pour que le nettoyage se déclenche lorsque les candidatures changent

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="relative rounded-2xl p-8 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse"></div>
        <div className="relative">
          <h1 className="text-4xl font-bold mb-2">Candidatures reçues</h1>
          <p className="text-blue-100 text-lg">Gérez les candidatures pour vos offres d'emploi</p>
          <div className="flex gap-2 mb-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={createTestApplication}
              className="bg-purple-500/20 text-purple-300 border-purple-300/30 hover:bg-purple-500/30"
            >
              🧪 Candidature de Test
            </Button>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 text-yellow-700 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">En attente</div>
                <div className="text-2xl font-bold text-yellow-600">
                  {applications.filter(a => a.status === 'pending').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">En cours</div>
                <div className="text-2xl font-bold text-blue-600">
                  {applications.filter(a => a.status === 'reviewed').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 text-green-700 flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Acceptées</div>
                <div className="text-2xl font-bold text-green-600">
                  {applications.filter(a => a.status === 'accepted').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Refusées</div>
                <div className="text-2xl font-bold text-red-600">
                  {applications.filter(a => a.status === 'rejected').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des candidatures */}
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Candidatures
          </CardTitle>
          <CardDescription>{applications.length} candidature{applications.length > 1 ? 's' : ''} reçue{applications.length > 1 ? 's' : ''}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {applications.map(app => (
            <div key={app.id} className="p-6 border rounded-lg hover:shadow-md transition-all duration-200 group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                      {app.internshipTitle}
                    </h3>
                    <Badge className={getStatusColor(app.status)}>
                      {getStatusText(app.status)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(app.appliedAt).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      {app.company}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">{app.userName}</span>
                        <Badge variant="outline" className="text-xs">
                          {app.userRole === 'student' ? 'Étudiant' : 'Instructeur'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        {app.userEmail}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        {app.userPhone || 'Non renseigné'}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="w-4 h-4" />
                        CV: {app.cvFileName || 'Non spécifié'}
                        <span className="text-xs">({Math.round(app.cvFileSize / 1024)} KB)</span>
                      </div>
                      
                      {app.coverLetter && (
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Lettre de motivation:</span> 
                          <p className="mt-1 text-xs line-clamp-2">{app.coverLetter}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => downloadCV(app)}
                    className="transition-all duration-200 hover:scale-105"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    CV
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setSelectedApplication(app);
                      setShowDetailsModal(true);
                    }}
                    className="transition-all duration-200 hover:scale-105"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Détails
                  </Button>
                </div>
              </div>

              {/* Actions rapides */}
              <div className="flex gap-2 pt-4 border-t">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => updateApplicationStatus(app.id, 'reviewed')}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  En cours
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => updateApplicationStatus(app.id, 'accepted')}
                  className="text-green-600 hover:text-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Accepter
                </Button>
                
                {app.status === 'accepted' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      // Rediriger vers la messagerie avec le candidat
                      const messageData = {
                        recipientId: app.userId,
                        recipientName: app.userName,
                        recipientEmail: app.userEmail,
                        subject: `Candidature acceptée - ${app.internshipTitle}`,
                        applicationId: app.id
                      };
                      localStorage.setItem('doremi_message_data', JSON.stringify(messageData));
                      window.location.href = '/messages';
                    }}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Message
                  </Button>
                )}
                
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => updateApplicationStatus(app.id, 'rejected')}
                  className="text-red-600 hover:text-red-700"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Refuser
                </Button>
              </div>
            </div>
          ))}
          
          {applications.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold mb-2">Aucune candidature</h3>
              <p className="text-sm">Vous n'avez pas encore reçu de candidatures pour vos offres.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de détails */}
      {showDetailsModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Détails de la candidature</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowDetailsModal(false)}
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Informations du candidat</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Nom:</strong> {selectedApplication.userName}</div>
                  <div><strong>Email:</strong> {selectedApplication.userEmail}</div>
                  <div><strong>Téléphone:</strong> {selectedApplication.userPhone || 'Non renseigné'}</div>
                  <div><strong>Rôle:</strong> {selectedApplication.userRole === 'student' ? 'Étudiant' : 'Instructeur'}</div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Offre</h3>
                <div className="text-sm">
                  <div><strong>Titre:</strong> {selectedApplication.internshipTitle}</div>
                  <div><strong>Entreprise:</strong> {selectedApplication.company}</div>
                  <div><strong>Date de candidature:</strong> {new Date(selectedApplication.appliedAt).toLocaleDateString('fr-FR')}</div>
                </div>
              </div>
              
              {selectedApplication.coverLetter && (
                <div>
                  <h3 className="font-semibold mb-2">Lettre de motivation</h3>
                  <div className="text-sm bg-gray-50 p-3 rounded">
                    {selectedApplication.coverLetter}
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="font-semibold mb-2">CV</h3>
                <div className="text-sm">
                  <div><strong>Fichier:</strong> {selectedApplication.cvFileName}</div>
                  <div><strong>Taille:</strong> {Math.round(selectedApplication.cvFileSize / 1024)} KB</div>
                  <Button 
                    size="sm" 
                    onClick={() => downloadCV(selectedApplication)}
                    className="mt-2"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Télécharger le CV
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterApplications;


