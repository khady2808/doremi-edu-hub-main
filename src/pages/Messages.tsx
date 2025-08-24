
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { 
  Search, 
  Send, 
  Plus, 
  MoreVertical, 
  Phone, 
  Video, 
  Image, 
  Paperclip,
  Smile,
  Mic,
  Bot,
  Crown,
  Star,
  Clock,
  Check,
  CheckCheck,
  PhoneOff
} from 'lucide-react';

// Types pour la messagerie
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'other';
  timestamp: string;
  isRead: boolean;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  role: 'formateur' | 'admin' | 'etudiant' | 'support' | 'candidat' | 'recruteur';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  messages: Message[];
  isImportant?: boolean; // Ajout de l'attribut isImportant
  isArchived?: boolean; // Ajout de l'attribut isArchived
}

// Données mockées pour les conversations
const mockConversations: Conversation[] = [
  // Conversations vides - les vraies conversations seront créées dynamiquement
];

export const Messages: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showNewConversationModal, setShowNewConversationModal] = useState(false);
  const [newConversationData, setNewConversationData] = useState({
    name: '',
    email: '',
    role: 'etudiant' as 'formateur' | 'admin' | 'etudiant' | 'support'
  });
  const [showPhoneCall, setShowPhoneCall] = useState(false);
  const [currentCall, setCurrentCall] = useState<{name: string, number: string} | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callStatus, setCallStatus] = useState<'calling' | 'connecting' | 'connected' | 'ended'>('calling');
  const [callStartTime, setCallStartTime] = useState<number | null>(null);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Fonction pour nettoyer complètement les conversations
  const clearAndRecreateConversations = () => {
    const currentUser = JSON.parse(localStorage.getItem('doremi_user') || '{}');
    console.log('🧹 Nettoyage complet des conversations pour:', currentUser);
    
    const isStudent = currentUser.role === 'student' || currentUser.email === 'etudiant@doremi.fr' || currentUser.name === 'John Doe';
    const isRecruiter = currentUser.role === 'recruiter' || currentUser.email === 'recruteur@doremi.fr' || currentUser.name === 'Recruteur DOREMI';
    
    // Créer une conversation de test correcte selon le rôle
    let testConversation: Conversation;
    
    if (isStudent) {
      testConversation = {
        id: 'test_recruteur',
        name: 'Recruteur DOREMI',
        avatar: `https://ui-avatars.com/api/?name=Recruteur%20DOREMI&background=random`,
        role: 'recruteur',
        lastMessage: 'Message de test du recruteur',
        lastMessageTime: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        unreadCount: 1,
        isOnline: true,
        messages: [
          {
            id: '1',
            content: 'Bonjour ! Je suis le recruteur DOREMI. Comment puis-je vous aider ?',
            sender: 'other',
            timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            isRead: false,
            type: 'text'
          }
        ]
      };
    } else if (isRecruiter) {
      testConversation = {
        id: 'test_etudiant',
        name: 'John Doe',
        avatar: `https://ui-avatars.com/api/?name=John%20Doe&background=random`,
        role: 'candidat',
        lastMessage: 'Message de test de l\'étudiant',
        lastMessageTime: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        unreadCount: 1,
        isOnline: true,
        messages: [
          {
            id: '1',
            content: 'Bonjour ! Je suis John Doe, étudiant. Merci pour l\'opportunité !',
            sender: 'other',
            timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            isRead: false,
            type: 'text'
          }
        ]
      };
    } else {
      // Par défaut, créer une conversation pour l'étudiant
      testConversation = {
        id: 'test_recruteur',
        name: 'Recruteur DOREMI',
        avatar: `https://ui-avatars.com/api/?name=Recruteur%20DOREMI&background=random`,
        role: 'recruteur',
        lastMessage: 'Message de test du recruteur',
        lastMessageTime: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        unreadCount: 1,
        isOnline: true,
        messages: [
          {
            id: '1',
            content: 'Bonjour ! Je suis le recruteur DOREMI. Comment puis-je vous aider ?',
            sender: 'other',
            timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            isRead: false,
            type: 'text'
          }
        ]
      };
    }
    
    const newConversations = [testConversation];
    setConversations(newConversations);
    localStorage.setItem('doremi_shared_conversations', JSON.stringify(newConversations));
    console.log('🔄 Conversations recréées:', newConversations);
  };

  // Fonction pour corriger les conversations selon le rôle de l'utilisateur
  const correctConversationsForUser = (conversations: Conversation[]) => {
    const currentUser = JSON.parse(localStorage.getItem('doremi_user') || '{}');
    console.log('🔧 Correction des conversations pour:', currentUser);
    
    const isStudent = currentUser.role === 'student' || currentUser.email === 'etudiant@doremi.fr' || currentUser.name === 'John Doe';
    const isRecruiter = currentUser.role === 'recruiter' || currentUser.email === 'recruteur@doremi.fr' || currentUser.name === 'Recruteur DOREMI';
    
    return conversations.map(conv => {
      if (isStudent) {
        // Pour l'étudiant, s'assurer que les conversations montrent le recruteur
        if (conv.name === 'John Doe' && (conv.role === 'candidat' || conv.role === 'etudiant')) {
          console.log('🔄 Correction conversation étudiant:', conv.name, '→ Recruteur DOREMI');
          return {
            ...conv,
            name: 'Recruteur DOREMI',
            avatar: `https://ui-avatars.com/api/?name=Recruteur%20DOREMI&background=random`,
            role: 'recruteur' as const
          };
        }
      } else if (isRecruiter) {
        // Pour le recruteur, s'assurer que les conversations montrent l'étudiant
        if (conv.name === 'Recruteur DOREMI' && (conv.role === 'admin' || conv.role === 'recruteur')) {
          console.log('🔄 Correction conversation recruteur:', conv.name, '→ John Doe');
          return {
            ...conv,
            name: 'John Doe',
            avatar: `https://ui-avatars.com/api/?name=John%20Doe&background=random`,
            role: 'candidat' as const
          };
        }
      }
      return conv;
    });
  };

  // Charger les conversations partagées au démarrage
  useEffect(() => {
    const sharedConversations = localStorage.getItem('doremi_shared_conversations');
    if (sharedConversations) {
      try {
        const conversations = JSON.parse(sharedConversations);
        console.log('📦 Conversations partagées chargées:', conversations);
        
        // Corriger les conversations selon le rôle de l'utilisateur
        const correctedConversations = correctConversationsForUser(conversations);
        setConversations(correctedConversations);
        console.log('🧹 Conversations corrigées:', correctedConversations);
        
        // Sauvegarder les conversations corrigées
        localStorage.setItem('doremi_shared_conversations', JSON.stringify(correctedConversations));
      } catch (error) {
        console.error('❌ Erreur lors du chargement des conversations partagées:', error);
      }
    }
    
    // Vérifier s'il y a des données de message temporaires
    const messageData = localStorage.getItem('doremi_message_data');
    console.log('📦 Données trouvées:', messageData);
    
    if (messageData) {
      try {
        const data = JSON.parse(messageData);
        console.log('✅ Données parsées:', data);
        
        // Adapter la création de conversation selon le rôle
        const currentUser = JSON.parse(localStorage.getItem('doremi_user') || '{}');
        console.log('👤 Utilisateur connecté pour création:', currentUser);
        
        // Détecter si c'est un étudiant ou un recruteur
        const isStudent = currentUser.role === 'student' || currentUser.email === 'etudiant@doremi.fr' || currentUser.name === 'John Doe';
        const isRecruiter = currentUser.role === 'recruiter' || currentUser.email === 'recruteur@doremi.fr' || currentUser.name === 'Recruteur DOREMI';
        
        console.log('🎯 Rôle détecté pour création - Étudiant:', isStudent, 'Recruteur:', isRecruiter);
        
        let conversationName, conversationRole;
        if (isStudent) {
          // L'étudiant voit le recruteur
          conversationName = 'Recruteur DOREMI';
          conversationRole = 'recruteur';
        } else if (isRecruiter) {
          // Le recruteur voit l'étudiant
          conversationName = 'John Doe';
          conversationRole = 'candidat';
        } else {
          // Par défaut, supposer que c'est un étudiant
          conversationName = 'Recruteur DOREMI';
          conversationRole = 'recruteur';
        }
        
        // Créer une nouvelle conversation pour la candidature
        const newConversation: Conversation = {
          id: `candidature_${data.applicationId}`,
          name: conversationName,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(conversationName)}&background=random`,
          role: conversationRole as any,
          lastMessage: `Candidature acceptée pour "${data.subject}"`,
          lastMessageTime: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          unreadCount: 1,
          isOnline: true,
          messages: [
            {
              id: '1',
              content: `Félicitations ! Votre candidature pour "${data.subject}" a été acceptée. Nous sommes ravis de vous accueillir dans notre équipe.`,
              sender: 'other',
              timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
              isRead: false,
              type: 'text'
            }
          ]
        };
        
        console.log('💬 Nouvelle conversation créée:', newConversation);
        setConversations(prev => {
          const updated = [newConversation, ...prev];
          console.log('📋 Conversations mises à jour:', updated);
          return updated;
        });
        setSelectedConversation(newConversation);
        console.log('✅ Conversation sélectionnée:', newConversation);
        
        // Nettoyer les données temporaires
        localStorage.removeItem('doremi_message_data');
        console.log('🧹 Données temporaires nettoyées');
      } catch (error) {
        console.error('❌ Erreur lors du traitement des données de message:', error);
        localStorage.removeItem('doremi_message_data');
      }
    } else {
      console.log('❌ Aucune donnée de message trouvée dans localStorage');
    }
  }, []);

  // Auto-scroll vers le bas quand de nouveaux messages arrivent
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  // Log pour déboguer la conversation sélectionnée
  useEffect(() => {
    if (selectedConversation) {
      console.log('🔍 Conversation sélectionnée:', selectedConversation);
      console.log('📝 Messages dans la conversation:', selectedConversation.messages);
    }
  }, [selectedConversation]);

  // Filtrer les conversations selon la recherche
  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Envoyer un nouveau message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
      type: 'text'
    };

    // Mettre à jour la conversation sélectionnée
    const updatedConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, newMsg],
      lastMessage: newMessage,
      lastMessageTime: newMsg.timestamp
    };

    // Mettre à jour la liste des conversations
    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation.id ? updatedConversation : conv
      )
    );

    setSelectedConversation(updatedConversation);
    setNewMessage('');

    // Sauvegarder dans localStorage pour partager entre utilisateurs
    const allConversations = conversations.map(conv => 
      conv.id === selectedConversation.id ? updatedConversation : conv
    );
    localStorage.setItem('doremi_shared_conversations', JSON.stringify(allConversations));

    console.log('💬 Message envoyé et sauvegardé:', newMsg);
  };

  // Marquer tous les messages comme lus
  const markAsRead = (conversationId: string) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, unreadCount: 0, messages: conv.messages.map(msg => ({ ...msg, isRead: true })) }
          : conv
      )
    );
  };

  // Sélectionner une conversation
  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    markAsRead(conversation.id);
  };

  // Obtenir le badge de rôle
  const getRoleBadge = (role: string) => {
    const badges = {
      formateur: { text: 'Formateur', color: 'bg-blue-100 text-blue-800' },
      admin: { text: 'Admin', color: 'bg-red-100 text-red-800' },
      etudiant: { text: 'Étudiant', color: 'bg-green-100 text-green-800' },
      support: { text: 'Support', color: 'bg-purple-100 text-purple-800' },
      candidat: { text: 'Candidat', color: 'bg-orange-100 text-orange-800' },
      recruteur: { text: 'Recruteur', color: 'bg-indigo-100 text-indigo-800' }
    };
    return badges[role as keyof typeof badges] || { text: role, color: 'bg-gray-100 text-gray-800' };
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Hier';
    if (diffDays === 2) return 'Avant-hier';
    if (diffDays <= 7) return date.toLocaleDateString('fr-FR', { weekday: 'short' });
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  };

  // Fonctions pour les appels
  const handlePhoneCall = () => {
    if (selectedConversation) {
      // Démarrer l'appel simulé avec phases réalistes
      setCurrentCall({ name: selectedConversation.name, number: '' });
      setShowPhoneCall(true);
      setCallStatus('calling');
      setCallDuration(0);
      setCallStartTime(null);
      
      console.log('📞 Appel téléphonique vers:', selectedConversation.name);
      
      // Phase 1: Appel en cours (2 secondes)
      setTimeout(() => {
        setCallStatus('connecting');
        console.log('📞 Connexion en cours...');
        
        // Phase 2: Connexion établie (1 seconde)
        setTimeout(() => {
          setCallStatus('connected');
          setIsCallActive(true);
          setCallStartTime(Date.now());
          console.log('📞 Appel connecté !');
        }, 1000);
      }, 2000);
    }
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    setIsCallActive(false);
    
    // Fermer l'interface après un court délai
    setTimeout(() => {
      setShowPhoneCall(false);
      setCurrentCall(null);
      setCallDuration(0);
      setCallStartTime(null);
    }, 1000);
    
    console.log('📞 Appel terminé');
  };

  // Chronomètre pour l'appel
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCallActive && callStatus === 'connected') {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isCallActive, callStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVideoCall = () => {
    if (selectedConversation) {
      // Naviguer vers la page d'appel vidéo
      console.log('📹 Appel vidéo initié avec:', selectedConversation.name);
      
      // Test de navigation
      try {
        const videoUrl = `/video-call?user=${encodeURIComponent(selectedConversation.name)}`;
        console.log('🔗 URL de navigation:', videoUrl);
        
        // Ouvrir dans une nouvelle fenêtre/onglet
        const newWindow = window.open(videoUrl, '_blank', 'width=1200,height=800,scrollbars=no,resizable=yes');
        
        if (newWindow) {
          console.log('✅ Fenêtre d\'appel vidéo ouverte avec succès');
        } else {
          console.log('❌ Impossible d\'ouvrir une nouvelle fenêtre, navigation directe...');
          window.location.href = videoUrl;
        }
      } catch (error) {
        console.error('❌ Erreur lors de la navigation:', error);
        alert('Erreur lors de l\'ouverture de l\'appel vidéo. Veuillez réessayer.');
      }
    }
  };

  const handleMoreOptions = () => {
    setShowMoreOptions(true);
  };

  const handleOptionSelect = (option: string) => {
    setShowMoreOptions(false);
    
    switch (option) {
      case 'Voir le profil':
        setShowProfile(true);
        break;
      case 'Marquer comme important':
        handleMarkAsImportant();
        break;
      case 'Archiver la conversation':
        setShowArchiveModal(true);
        break;
      case 'Supprimer la conversation':
        setShowDeleteModal(true);
        break;
      case 'Signaler un problème':
        setShowReportModal(true);
        break;
    }
  };

  const handleMarkAsImportant = () => {
    if (selectedConversation) {
      setConversations(prev => 
        prev.map(conv => 
          conv.id === selectedConversation.id 
            ? { ...conv, isImportant: !conv.isImportant }
            : conv
        )
      );
      
      const status = selectedConversation.isImportant ? 'retiré de' : 'ajouté aux';
      alert(`✅ Conversation ${status} favoris !`);
      console.log('⭐ Conversation marquée comme importante:', selectedConversation.name);
    }
  };

  const handleArchiveConversation = () => {
    if (selectedConversation) {
      setConversations(prev => 
        prev.map(conv => 
          conv.id === selectedConversation.id 
            ? { ...conv, isArchived: true }
            : conv
        )
      );
      setSelectedConversation(null);
      setShowArchiveModal(false);
      alert('✅ Conversation archivée avec succès !');
      console.log('📁 Conversation archivée:', selectedConversation.name);
    }
  };

  const handleDeleteConversation = () => {
    if (selectedConversation) {
      setConversations(prev => prev.filter(conv => conv.id !== selectedConversation.id));
      setSelectedConversation(null);
      setShowDeleteModal(false);
      alert('✅ Conversation supprimée avec succès !');
      console.log('🗑️ Conversation supprimée:', selectedConversation.name);
    }
  };

  const handleReportProblem = (reason: string) => {
    if (selectedConversation) {
      console.log('🚨 Problème signalé pour:', selectedConversation.name, 'Raison:', reason);
      setShowReportModal(false);
      alert('✅ Problème signalé avec succès ! Notre équipe va examiner le cas.');
    }
  };

  // Fonction pour ajouter un emoji
  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Fonction pour gérer l'upload de fichiers
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('📎 Fichier sélectionné:', file.name);
      alert(`📎 Fichier "${file.name}" sélectionné !\n\nCette fonctionnalité sera implémentée dans une version future.`);
      setShowFileUpload(false);
    }
  };

  // Fonction pour ouvrir le modal premium
  const handlePremiumDiscover = () => {
    setShowPremiumModal(true);
  };

  // Fonction pour récupérer les informations complètes de l'utilisateur
  const getUserInfo = (userName: string) => {
    try {
      // Déterminer le rôle selon le nom
      const getRole = (name: string) => {
        if (name === 'Recruteur DOREMI') return 'Recruteur';
        if (name === 'John Doe') return 'Candidat';
        return 'Utilisateur';
      };

      // Informations spécifiques pour le recruteur DOREMI
      if (userName === 'Recruteur DOREMI') {
        // Essayer de récupérer les vraies informations depuis les données stockées
        try {
          const users = JSON.parse(localStorage.getItem('doremi_users') || '[]');
          const recruiterInfo = users.find((u: any) => u.name === 'Recruteur DOREMI' || u.email === 'recruteur@doremi.fr');
          
          if (recruiterInfo) {
            return {
              email: 'recruteur@doremi.fr',
              phone: recruiterInfo.phone || 'Non renseigné',
              location: recruiterInfo.location || recruiterInfo.city || 'Non renseigné',
              memberSince: recruiterInfo.createdAt || recruiterInfo.memberSince || 'Date non disponible',
              role: 'Recruteur',
              educationLevel: recruiterInfo.educationLevel || 'Non renseigné'
            };
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des infos recruteur:', error);
        }
        
        // Valeurs par défaut si aucune donnée trouvée
        return {
          email: 'recruteur@doremi.fr',
          phone: 'Non renseigné',
          location: 'Non renseigné',
          memberSince: 'Date non disponible',
          role: 'Recruteur',
          educationLevel: 'Non renseigné'
        };
      }

      // Informations spécifiques pour John Doe (étudiant)
      if (userName === 'John Doe') {
        return {
          email: 'etudiant@doremi.fr',
          phone: 'Non renseigné',
          location: 'Non renseigné',
          memberSince: 'Date non disponible',
          role: 'Étudiant',
          educationLevel: 'Bac+2'
        };
      }

      // 1. Essayer de récupérer depuis les utilisateurs enregistrés
      const users = JSON.parse(localStorage.getItem('doremi_users') || '[]');
      let userInfo = users.find((u: any) => u.name === userName);
      
      if (userInfo) {
        return {
          email: userInfo.email || 'Non renseigné',
          phone: userInfo.phone || 'Non renseigné',
          location: userInfo.location || userInfo.city || 'Non renseigné',
          memberSince: userInfo.createdAt || userInfo.memberSince || 'Date non disponible',
          role: getRole(userName),
          educationLevel: userInfo.educationLevel || 'Non renseigné'
        };
      }
      
      // 2. Si pas trouvé, essayer depuis les candidatures
      const applications = JSON.parse(localStorage.getItem('doremi_applications') || '[]');
      const application = applications.find((app: any) => app.userName === userName);
      
      if (application) {
        return {
          email: application.userEmail || 'Non renseigné',
          phone: application.userPhone || 'Non renseigné',
          location: application.userLocation || 'Non renseigné',
          memberSince: application.applicationDate || 'Date de candidature non disponible',
          role: getRole(userName),
          educationLevel: application.educationLevel || 'Non renseigné'
        };
      }
      
      // 3. Si toujours pas trouvé, retourner des valeurs par défaut
      return {
        email: 'Non renseigné',
        phone: 'Non renseigné',
        location: 'Non renseigné',
        memberSince: 'Date non disponible',
        role: getRole(userName),
        educationLevel: 'Non renseigné'
      };
      
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur:', error);
      return {
        email: 'Erreur de récupération',
        phone: 'Erreur de récupération',
        location: 'Erreur de récupération',
        memberSince: 'Erreur de récupération',
        role: 'Utilisateur',
        educationLevel: 'Erreur de récupération'
      };
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sidebar des conversations */}
      <div className="w-96 bg-white/80 backdrop-blur-sm border-r border-gray-200/50 flex flex-col shadow-lg">
        {/* Header */}
        <div className="p-6 border-b border-gray-200/50 bg-white/60 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Messages</h2>
              <p className="text-sm text-gray-600">Communiquez avec votre réseau</p>
            </div>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                onClick={() => {
                  const corrected = correctConversationsForUser(conversations);
                  setConversations(corrected);
                  localStorage.setItem('doremi_shared_conversations', JSON.stringify(corrected));
                  console.log('🔧 Conversations forcées corrigées:', corrected);
                }}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                🔧 Corriger
              </Button>
              <Button 
                size="sm" 
                onClick={clearAndRecreateConversations}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                🧹 Nettoyer
              </Button>
              <Button 
                size="sm" 
                onClick={() => setShowNewConversationModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouveau
              </Button>
            </div>
          </div>
          
          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Rechercher une conversation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white/70 backdrop-blur-sm border-gray-200/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            />
          </div>
        </div>

        {/* Liste des conversations */}
        <div className="flex-1 overflow-y-auto bg-white/40 backdrop-blur-sm">
          {filteredConversations
            .filter(conversation => !conversation.isArchived) // Filtrer les conversations archivées
            .map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => handleSelectConversation(conversation)}
              className={`p-6 border-b border-gray-100/50 cursor-pointer transition-all duration-300 hover:bg-white/60 hover:shadow-sm ${
                selectedConversation?.id === conversation.id ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-l-blue-500 shadow-md' : ''
              } ${conversation.isImportant ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-l-yellow-500' : ''}`}
            >
              <div className="flex items-start space-x-4">
                <div className="relative">
                  <Avatar className="w-14 h-14 ring-3 ring-white/80 shadow-lg">
                    <AvatarImage src={conversation.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-lg">
                      {conversation.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-3 border-white rounded-full shadow-lg animate-pulse"></div>
                  )}
                  {conversation.isImportant && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 border-2 border-white rounded-full shadow-lg flex items-center justify-center">
                      <span className="text-white text-xs">⭐</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900 truncate text-lg">{conversation.name}</h3>
                    <span className="text-sm text-gray-500 font-medium bg-white/60 px-2 py-1 rounded-full">
                      {conversation.lastMessageTime}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3 mb-3">
                    {conversation.unreadCount > 0 && (
                      <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                    {conversation.isImportant && (
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        Important
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-700 truncate leading-relaxed font-medium">
                    {conversation.lastMessage}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {filteredConversations.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-xl font-bold mb-2">Aucune conversation trouvée</p>
              <p className="text-sm text-center">Commencez une nouvelle conversation pour échanger avec votre réseau</p>
            </div>
          )}
        </div>
      </div>

      {/* Zone de chat principale */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-white/80 to-blue-50/50 backdrop-blur-sm">
        {selectedConversation ? (
          <>
            {/* Header du chat */}
            <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12 ring-3 ring-white/80 shadow-lg">
                    <AvatarImage src={selectedConversation.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white font-bold">
                      {selectedConversation.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="font-bold text-gray-900 text-xl">{selectedConversation.name}</h3>
                    <div className="flex items-center space-x-3">
                      {selectedConversation.isOnline && (
                    <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
                          <span className="text-sm text-green-600 font-bold">En ligne</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Button size="sm" variant="ghost" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200 p-3 rounded-full" onClick={handlePhoneCall}>
                    <Phone className="w-5 h-5" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-gray-600 hover:text-green-600 hover:bg-green-50/50 transition-all duration-200 p-3 rounded-full" onClick={handleVideoCall}>
                    <Video className="w-5 h-5" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-50/50 transition-all duration-200 p-3 rounded-full" onClick={handleMoreOptions}>
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-transparent to-blue-50/30">
              {(() => {
                console.log('🎨 Rendu des messages:', selectedConversation.messages);
                return null;
              })()}
              {selectedConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-6 py-4 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-200 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-blue-500/25'
                      : 'bg-white/90 border border-gray-200/50 text-gray-900 shadow-gray-500/10'
                  }`}>
                    {/* Afficher le nom de l'expéditeur pour les messages reçus */}
                    {message.sender === 'other' && (
                      <div className="text-xs font-bold text-gray-600 mb-2">
                        {selectedConversation.name}
                      </div>
                    )}
                    {/* Afficher "Vous" pour les messages envoyés */}
                    {message.sender === 'user' && (
                      <div className="text-xs font-bold text-blue-100 mb-2">
                        Vous
                      </div>
                    )}
                    <p className="text-sm leading-relaxed font-medium">{message.content}</p>
                    <div className={`flex items-center justify-end mt-3 space-x-2 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                    }`}>
                      <span className="text-xs font-medium">{message.timestamp}</span>
                      {message.sender === 'user' && (
                        message.isRead ? (
                          <CheckCheck className="w-4 h-4 text-blue-200" />
                        ) : (
                          <Check className="w-4 h-4 text-blue-200" />
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Zone de saisie */}
            <div className="bg-white/90 backdrop-blur-sm border-t border-gray-200/50 p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Tapez votre message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="pl-4 pr-12 py-4 bg-white/70 backdrop-blur-sm border-gray-200/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-2xl transition-all duration-200 text-lg"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <Button
                    size="sm"
                      variant="ghost" 
                      className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100/50 transition-all duration-200"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <Smile className="w-5 h-5" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100/50 transition-all duration-200"
                      onClick={() => setShowFileUpload(true)}
                    >
                      <Paperclip className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                  <Send className="w-5 h-5" />
                  </Button>
                </div>
                
              {/* Bannière Premium */}
              <div className="mt-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Crown className="w-6 h-6 text-white" />
                    <div>
                      <p className="text-white font-bold">Passez au Premium</p>
                      <p className="text-yellow-100 text-sm">Conversations illimitées et fonctionnalités avancées</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-white text-orange-600 hover:bg-gray-100 font-bold px-4 py-2 rounded-full shadow-lg"
                    onClick={handlePremiumDiscover}
                  >
                    Découvrir
                </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-white/80 to-blue-50/50 backdrop-blur-sm">
            <div className="text-center p-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-8 shadow-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Search className="w-6 h-6 text-white" />
              </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Aucune conversation sélectionnée</h3>
              <p className="text-gray-600 mb-8 max-w-md">
                Sélectionnez une conversation pour commencer à discuter ou créez une nouvelle conversation
              </p>
              <div className="flex space-x-4">
                <Button 
                  onClick={() => setShowNewConversationModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Nouvelle conversation
                </Button>
                <Button 
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-xl transition-all duration-200"
                >
                  Voir les contacts
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bouton flottant pour l'assistant IA */}
      <div className="fixed bottom-6 right-6">
        <Button
          size="lg"
          className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg"
          title="Assistant IA"
        >
          <Bot className="w-6 h-6" />
        </Button>
      </div>

      {/* Interface d'appel téléphonique simulée */}
      {showPhoneCall && currentCall && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              {/* Avatar et nom */}
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg transition-all duration-500 ${
                callStatus === 'calling' ? 'bg-yellow-500 animate-pulse' :
                callStatus === 'connecting' ? 'bg-orange-500 animate-bounce' :
                callStatus === 'connected' ? 'bg-green-500' :
                'bg-red-500'
              }`}>
                <Phone className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{currentCall.name}</h3>
              
              {/* Statut de l'appel */}
              <div className="flex items-center justify-center space-x-2 mb-8">
                <div className={`w-3 h-3 rounded-full ${
                  callStatus === 'calling' ? 'bg-yellow-500 animate-pulse' :
                  callStatus === 'connecting' ? 'bg-orange-500 animate-bounce' :
                  callStatus === 'connected' ? 'bg-green-500 animate-pulse' :
                  'bg-red-500'
                }`}></div>
                <span className={`font-medium ${
                  callStatus === 'calling' ? 'text-yellow-600' :
                  callStatus === 'connecting' ? 'text-orange-600' :
                  callStatus === 'connected' ? 'text-green-600' :
                  'text-red-600'
                }`}>
                  {callStatus === 'calling' && 'Appel en cours...'}
                  {callStatus === 'connecting' && 'Connexion...'}
                  {callStatus === 'connected' && `En appel • ${formatDuration(callDuration)}`}
                  {callStatus === 'ended' && 'Appel terminé'}
                </span>
              </div>
              
              {/* Boutons de contrôle */}
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={handleEndCall}
                  className={`w-16 h-16 rounded-full shadow-lg transition-all duration-300 ${
                    callStatus === 'ended' ? 'bg-gray-500' : 'bg-red-500 hover:bg-red-600'
                  } text-white`}
                  disabled={callStatus === 'ended'}
                >
                  <PhoneOff className="w-8 h-8" />
                </Button>
              </div>
              
              {/* Message d'information */}
              <p className="text-sm text-gray-500 mt-6">
                {callStatus === 'calling' && 'Composition du numéro...'}
                {callStatus === 'connecting' && 'Décrochage en cours...'}
                {callStatus === 'connected' && 'Appel en cours - Cliquez sur "Terminer" pour raccrocher'}
                {callStatus === 'ended' && 'Appel terminé'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Interface des options modernes */}
      {showMoreOptions && selectedConversation && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Options</h3>
              <p className="text-gray-600">Actions pour {selectedConversation.name}</p>
            </div>
            
            <div className="space-y-2">
              {[
                { icon: '👤', label: 'Voir le profil', color: 'hover:bg-blue-50' },
                { icon: selectedConversation.isImportant ? '⭐' : '☆', label: 'Marquer comme important', color: 'hover:bg-yellow-50' },
                { icon: '📁', label: 'Archiver la conversation', color: 'hover:bg-gray-50' },
                { icon: '🗑️', label: 'Supprimer la conversation', color: 'hover:bg-red-50' },
                { icon: '🚨', label: 'Signaler un problème', color: 'hover:bg-orange-50' }
              ].map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(option.label)}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${option.color} hover:shadow-md`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{option.icon}</span>
                    <span className="font-medium text-gray-900">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Button
                onClick={() => setShowMoreOptions(false)}
                variant="outline"
                className="w-full"
              >
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Profil */}
      {showProfile && selectedConversation && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-6">
                <AvatarImage src={selectedConversation.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-2xl">
                  {selectedConversation.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedConversation.name}</h3>
              <p className="text-gray-600 mb-6">
                {selectedConversation.name === 'Recruteur DOREMI' ? 'Recruteur' : 
                 selectedConversation.name === 'John Doe' ? 'Candidat' : 
                 selectedConversation.role}
              </p>
              
              <div className="space-y-4 text-left">
                {(() => {
                  const userInfo = getUserInfo(selectedConversation.name);
                  
                  return (
                    <>
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-500">📧 Email:</span>
                        <span className="font-medium">{userInfo.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-500">📱 Téléphone:</span>
                        <span className="font-medium">{userInfo.phone}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-500">📍 Localisation:</span>
                        <span className="font-medium">{userInfo.location}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-500">📅 Membre depuis:</span>
                        <span className="font-medium">{userInfo.memberSince}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-500">🎓 Niveau d'éducation:</span>
                        <span className="font-medium">{userInfo.educationLevel}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <Button
                  onClick={() => setShowProfile(false)}
                  className="w-full"
                >
                  Fermer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Archive */}
      {showArchiveModal && selectedConversation && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📁</span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">Archiver la conversation</h3>
              <p className="text-gray-600 mb-8">
                Êtes-vous sûr de vouloir archiver la conversation avec <strong>{selectedConversation.name}</strong> ?
                <br /><br />
                La conversation sera masquée mais pourra être restaurée plus tard.
              </p>
              
              <div className="flex space-x-4">
                <Button
                  onClick={() => setShowArchiveModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleArchiveConversation}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600"
                >
                  Archiver
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Suppression */}
      {showDeleteModal && selectedConversation && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🗑️</span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">Supprimer la conversation</h3>
              <p className="text-gray-600 mb-8">
                Êtes-vous sûr de vouloir supprimer définitivement la conversation avec <strong>{selectedConversation.name}</strong> ?
                <br /><br />
                <span className="text-red-600 font-medium">Cette action est irréversible.</span>
              </p>
              
              <div className="flex space-x-4">
                <Button
                  onClick={() => setShowDeleteModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleDeleteConversation}
                  className="flex-1 bg-red-500 hover:bg-red-600"
                >
                  Supprimer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Signalement */}
      {showReportModal && selectedConversation && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🚨</span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">Signaler un problème</h3>
              <p className="text-gray-600 mb-6">
                Signalez un problème avec la conversation de <strong>{selectedConversation.name}</strong>
              </p>
              
              <div className="space-y-3 mb-6">
                {[
                  'Contenu inapproprié',
                  'Spam ou publicité',
                  'Harcèlement',
                  'Fausses informations',
                  'Autre problème'
                ].map((reason, index) => (
                  <button
                    key={index}
                    onClick={() => handleReportProblem(reason)}
                    className="w-full p-3 text-left rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    {reason}
                  </button>
                ))}
              </div>
              
              <Button
                onClick={() => setShowReportModal(false)}
                variant="outline"
                className="w-full"
              >
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Sélecteur d'emojis */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 left-6 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 z-50">
          <div className="grid grid-cols-8 gap-2 max-w-64">
            {['😊', '😂', '❤️', '👍', '🎉', '🔥', '💯', '✨', '😍', '🤔', '😭', '😡', '🤗', '👋', '💪', '🎯', '🚀', '💡', '📚', '🎓', '💼', '💰', '🏆', '⭐'].map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiSelect(emoji)}
                className="w-8 h-8 text-xl hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center"
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowEmojiPicker(false)}
              className="w-full"
            >
              Fermer
            </Button>
          </div>
        </div>
      )}

      {/* Upload de fichiers */}
      {showFileUpload && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Paperclip className="w-8 h-8 text-blue-600" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">Joindre un fichier</h3>
              <p className="text-gray-600 mb-8">
                Sélectionnez un fichier à joindre à votre message
              </p>
              
              <div className="space-y-4">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />
                <label
                  htmlFor="file-upload"
                  className="block w-full p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 transition-colors cursor-pointer"
                >
                  <div className="text-center">
                    <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Cliquez pour sélectionner un fichier</p>
                    <p className="text-sm text-gray-400 mt-1">Images, PDF, Documents</p>
                  </div>
                </label>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Button
                  onClick={() => setShowFileUpload(false)}
                  variant="outline"
                  className="w-full"
                >
                  Annuler
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Premium */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Crown className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Passez au Premium</h3>
              <p className="text-gray-600 mb-8">
                Débloquez toutes les fonctionnalités avancées de DOREMI
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">Conversations illimitées</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">Appels vidéo HD</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">Support prioritaire</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">Analytics avancés</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4 mb-6">
                <p className="text-white font-bold text-xl">29,99€ / mois</p>
                <p className="text-yellow-100 text-sm">ou 299,99€ / an (-17%)</p>
              </div>
              
              <div className="flex space-x-4">
                <Button
                  onClick={() => setShowPremiumModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Plus tard
                </Button>
                <Button
                  onClick={() => {
                    alert('🎉 Merci pour votre intérêt ! Cette fonctionnalité sera bientôt disponible.');
                    setShowPremiumModal(false);
                  }}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                >
                  S'abonner
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
