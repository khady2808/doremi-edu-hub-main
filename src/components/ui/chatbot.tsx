import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Card } from './card';
import { Button } from './button';
import { Input } from './input';
import { MessageCircle, X, Send, Mic, MicOff, Sparkles, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { askLLM, ChatMessage } from '@/lib/llm';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { mockCourses } from '@/data/mockData';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  results?: {
    type: 'course';
    items: Array<{ id: string; title: string; category?: string; level?: string; }>
  };
}

const intelligentAnswers: Record<string, string[]> = {
  'inscription': [
    'Pour vous inscrire à un cours, rendez-vous dans la section "Cours", sélectionnez le cours qui vous intéresse et cliquez sur "S\'inscrire".',
    'L\'inscription est simple : choisissez votre niveau (Écolier, Collégien, Lycéen, Étudiant) puis explorez les cours adaptés.',
    'Vous pouvez vous inscrire directement depuis la page d\'accueil en cliquant sur "Découvrir nos cours".'
  ],
  'certificat': [
    'Pour obtenir votre certificat, vous devez compléter 100% du cours. Le certificat sera disponible dans votre section "Bibliothèque".',
    'Les certificats sont délivrés automatiquement après validation de tous les modules du cours.',
    'Seuls les abonnés Premium peuvent télécharger leurs certificats au format PDF.'
  ],
  'premium': [
    'Pour passer en Premium, allez dans "Premium" dans le menu et choisissez l\'abonnement qui vous convient.',
    'Premium vous donne accès aux téléchargements, certificats, sessions live et contenus exclusifs.',
    'L\'abonnement Premium coûte 15 000 FCFA/mois et inclut tous les avantages de la plateforme.'
  ],
  
  // Questions pédagogiques
  'svt': [
    'La SVT (Sciences de la Vie et de la Terre) étudie les êtres vivants et notre planète. Elle comprend la biologie, la géologie et l\'écologie.',
    'En SVT, vous apprendrez le fonctionnement du corps humain, l\'évolution des espèces, et les phénomènes géologiques.',
    'Nos cours de SVT couvrent la génétique, l\'écologie, la géologie et la physiologie humaine.'
  ],
  'équation': [
    'Pour résoudre une équation du 2nd degré ax² + bx + c = 0, utilisez la formule : x = (-b ± √(b²-4ac)) / 2a',
    'Les équations du second degré peuvent avoir 0, 1 ou 2 solutions selon le discriminant Δ = b²-4ac.',
    'Je peux vous aider avec des exercices pratiques d\'équations du second degré si vous le souhaitez.'
  ],
  'mathématiques': [
    'Les mathématiques sur DOREMI couvrent l\'algèbre, la géométrie, les statistiques et l\'analyse.',
    'Nous proposons des cours adaptés à tous les niveaux : du primaire aux études supérieures.',
    'Nos professeurs utilisent des méthodes pédagogiques modernes avec de nombreux exercices pratiques.'
  ],
  
  // Questions pour formateurs
  'ajouter cours': [
    'Pour ajouter un cours, allez dans votre tableau de bord formateur et cliquez sur "Créer un cours".',
    'Vous pouvez créer des cours avec vidéos, documents PDF, quiz et sessions live.',
    'Assurez-vous d\'avoir téléchargé votre CV et votre pièce d\'identité pour valider votre profil formateur.'
  ],
  'live': [
    'Pour démarrer une session live, cliquez sur "Nouveau Live" dans votre dashboard formateur.',
    'Les sessions live sont automatiquement notifiées aux étudiants inscrits par email.',
    'Les sessions live sont réservées aux formateurs vérifiés avec un profil complet.'
  ],
  
  // Questions d'orientation
  'orientation': [
    'Pour choisir votre parcours, commencez par définir votre niveau actuel et vos objectifs.',
    'Nous proposons des tests d\'orientation gratuits pour vous aider à trouver votre voie.',
    'Nos conseillers pédagogiques peuvent vous accompagner dans votre choix d\'orientation.'
  ],
  'niveau': [
    'Choisissez votre niveau lors de l\'inscription : Écolier, Collégien, Lycéen ou Étudiant.',
    'Chaque niveau propose des cours adaptés au programme scolaire sénégalais.',
    'Vous pouvez modifier votre niveau à tout moment dans les paramètres de votre profil.'
  ],

  // Littérature sénégalaise
  'littérature': [
    'Découvrez notre collection de classiques sénégalais : "Une si longue lettre", "Sous l\'orage", "L\'aventure ambiguë".',
    'La littérature sénégalaise est riche et variée, explorant les thèmes de l\'identité, de la tradition et de la modernité.',
    'Nos ouvrages incluent des analyses détaillées pour mieux comprendre les œuvres des grands auteurs africains.'
  ]
};

const getRandomResponse = (responses: string[]): string => {
  return responses[Math.floor(Math.random() * responses.length)];
};

export const Chatbot: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const storageKey = useMemo(() => `doremi_chat_history_${user?.id || 'anon'}`, [user?.id]);
  const initialGreeting = useMemo(() => ({
    id: 'greet-1',
    text: `Bonjour ${user?.name || 'cher étudiant'} ! Je suis votre assistant DOREMI. Comment puis-je vous aider aujourd'hui ?`,
    isBot: true,
    timestamp: new Date()
  } as Message), [user?.name]);
  const [messages, setMessages] = useState<Message[]>([initialGreeting]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isStreamingRef = useRef(false);
  const lastResultsRef = useRef<Message['results'] | null>(null);
  const lastIntentRef = useRef<ReturnType<typeof analyzeIntent> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Charger l'historique
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed: Message[] = JSON.parse(raw).map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
        if (parsed.length > 0) setMessages(parsed);
      } else {
        setMessages([initialGreeting]);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // Sauvegarde de l'historique (seulement les 50 derniers pour performance)
  useEffect(() => {
    try {
      const trimmed = messages.slice(-50);
      localStorage.setItem(storageKey, JSON.stringify(trimmed));
    } catch {}
  }, [messages, storageKey]);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      if (!window.isSecureContext) {
        // Informer l'utilisateur que le micro requiert HTTPS/localhost
        // On ne bloque pas l'UI, on avertit seulement lors de l'utilisation du micro
      }
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'fr-FR';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const findIntelligentAnswer = (text: string): string => {
    const lowerText = text.toLowerCase();
    // Salutations → menu de démarrage clair
    if (/\b(bonjour|salut|slt|bonsoir|hello|hi)\b/.test(lowerText)) {
      return [
        'Bonjour ! Je peux vous aider tout de suite. Choisissez une action et je m\'en charge :',
        '- Rechercher un cours (ex: "cours math 4ème")',
        '- Voir le prix Premium',
        '- Trouver un document dans la médiathèque',
        '- Chercher un stage',
        '- Ouvrir la messagerie',
        '- Modifier mes paramètres',
        '- Obtenir un certificat',
      ].join('\n');
    }
    // Réponses courtes pour confirmations
    if (["oui", "ok", "d'accord", "daccord", "yes"].includes(lowerText.trim())) {
      const li = lastIntentRef.current?.intent;
      if (li === 'premium') {
        return [
          "Très bien. Voici comment procéder:",
          "1) Choisissez un plan (Mensuel ou Annuel)",
          "2) Cliquez sur S'abonner",
          "3) Suivez les étapes de paiement (simulation)",
          "4) Votre compte passe en Premium immédiatement"
        ].join('\n');
      }
      if (li === 'course_search' && lastResultsRef.current?.items?.length) {
        const first = lastResultsRef.current.items[0];
        return `Parfait. J'ouvre le premier résultat: "${first.title}". Vous pourrez ensuite cliquer sur S'inscrire.`;
      }
      if (li === 'messages') {
        return "J'ouvre la messagerie. Rédigez votre question dans la conversation ouverte.";
      }
      if (li === 'library_search') {
        return "J'ouvre la Médiathèque avec votre recherche appliquée. Téléchargez le document voulu.";
      }
      if (li === 'internship') {
        return [
          "J'ouvre la page des stages. Conseils:",
          "- Filtrez par secteur et région",
          "- Triez par Plus récent",
          "- Cliquez sur Postuler et déposez votre CV"
        ].join('\n');
      }
    }
    
    // Recherche de mots-clés dans le texte
    for (const [key, responses] of Object.entries(intelligentAnswers)) {
      if (lowerText.includes(key) || 
          lowerText.includes(key.replace('é', 'e')) || 
          lowerText.includes(key.replace('è', 'e'))) {
        return getRandomResponse(responses);
      }
    }

    // Réponses contextuelles selon le rôle de l'utilisateur
    if (user?.role === 'teacher') {
      if (lowerText.includes('cours') || lowerText.includes('enseigner')) {
        return 'En tant que formateur, vous pouvez créer des cours interactifs, organiser des sessions live et suivre les progrès de vos étudiants. Voulez-vous que je vous guide ?';
      }
      if (lowerText.includes('étudiant') || lowerText.includes('élève')) {
        return 'Vous pouvez voir tous vos étudiants inscrits dans la section "Mes Étudiants" et suivre leur progression en temps réel.';
      }
    }

    // Réponses par défaut plus intelligentes
    // Réponse standard plus claire + suggestion d'options
    return [
      'Je veux vous répondre clairement, mais votre question est large.',
      "Précisez l'objectif (ex: 'inscription cours math', 'prix premium', 'télécharger document').",
      "Aide rapide: cours • premium • médiathèque • stages • messages • paramètres • certificats"
    ].join('\n');
  };

  // Recherche intelligente de cours (RAG simple sur les mockCourses)
  const searchCourses = useCallback((query: string) => {
    const q = query.toLowerCase();
    const tokens = q.split(/\s+/).filter(Boolean);
    const scored = mockCourses.map(c => {
      const hay = `${c.title} ${c.description} ${c.category} ${c.level}`.toLowerCase();
      const score = tokens.reduce((acc, t) => acc + (hay.includes(t) ? 1 : 0), 0) + (hay.includes(q) ? 1 : 0);
      return { course: c, score };
    }).filter(s => s.score > 0).sort((a, b) => b.score - a.score || (b.course.rating - a.course.rating));
    return scored.slice(0, 3).map(s => s.course);
  }, []);

  // Analyse d'intention basique
  const analyzeIntent = useCallback((q: string) => {
    const text = q.toLowerCase();
    if (/^(ouvre|ouvrir|voir) (le|la)? ?(premier|1(er)?)/.test(text) || /(le premier)/.test(text)) {
      return { intent: 'open_first', query: '' } as const;
    }
    if (/cours|leçon|lecon|matière|matiere|math|svt|fran|français|francais|anglais|python|programme|recherche|chercher/.test(text)) {
      return { intent: 'course_search', query: q } as const;
    }
    if (/document|doc|pdf|livre|bibli(o|othèque)?|mediath|médiath|library|t(é|e)l(é|e)charger/.test(text)) {
      return { intent: 'library_search', query: q } as const;
    }
    if (/stage|stages|internship|apprentiss/.test(text)) {
      return { intent: 'internship', query: q } as const;
    }
    if (/actualité|news/.test(text)) {
      return { intent: 'news', query: '' } as const;
    }
    if (/premium|abonnement|payer|prix|co(û|u)t|tarif|facture/.test(text)) {
      return { intent: 'premium', query: '' } as const;
    }
    if (/message|support|assistance|contacter/.test(text)) {
      return { intent: 'messages', query: '' } as const;
    }
    if (/param(è|e)tres|settings|profil/.test(text)) {
      return { intent: 'settings', query: '' } as const;
    }
    if (/certificat|certif|attestation/.test(text)) {
      return { intent: 'certificate', query: '' } as const;
    }
    if (/inscription|s'inscrire|sinscrire|enregistrer|adh(é|e)rer/.test(text)) {
      return { intent: 'enroll', query: '' } as const;
    }
    return { intent: 'unknown', query: q } as const;
  }, []);

  const streamBotResponse = useCallback((fullText: string, results?: Message['results']) => {
    if (isStreamingRef.current) return; // éviter chevauchement
    isStreamingRef.current = true;
    let index = 0;
    const id = (Date.now() + 1).toString();
    const base: Message = { id, text: '', isBot: true, timestamp: new Date(), results };
    setMessages(prev => [...prev, base]);
    lastResultsRef.current = results || null;
    const interval = setInterval(() => {
      index += 2; // vitesse 2 caractères
      const partial = fullText.slice(0, index);
      setMessages(prev => prev.map(m => (m.id === id ? { ...m, text: partial } : m)));
      if (index >= fullText.length) {
        clearInterval(interval);
        isStreamingRef.current = false;
        setIsTyping(false);
      }
    }, 20);
    // Failsafe: débloquer au bout de 12s même en cas d'erreur d'interval
    setTimeout(() => {
      if (isStreamingRef.current) {
        isStreamingRef.current = false;
        setIsTyping(false);
      }
    }, 12000);
  }, []);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulation de frappe plus réaliste
    setTimeout(() => {
      try {
        const intent = analyzeIntent(inputValue);

      lastIntentRef.current = intent;

      if (intent.intent === 'open_first' && lastResultsRef.current?.items?.length) {
        const first = lastResultsRef.current.items[0];
        navigate(`/courses?search=${encodeURIComponent(first.title)}`);
        streamBotResponse(`J'ouvre le premier résultat: "${first.title}".`);
        return;
      }

      if (intent.intent === 'course_search') {
        const results = searchCourses(intent.query);
        if (results.length > 0) {
          const text = `J'ai trouvé ${results.length} cours correspondant à votre recherche. Voici mes suggestions :`;
          streamBotResponse(text, {
            type: 'course',
            items: results.map(r => ({ id: r.id, title: r.title, category: r.category, level: r.level }))
          });
          return;
        }
      }

      if (intent.intent === 'library_search') {
        navigate(`/library?search=${encodeURIComponent(intent.query)}`);
        streamBotResponse(`Je vous redirige vers la Médiathèque pour consulter les documents liés à "${inputValue}".`);
        return;
      }

      if (intent.intent === 'internship') {
        navigate('/internships');
        streamBotResponse(`Je vous redirige vers la page des stages. Utilisez les filtres pour affiner votre recherche.`);
        return;
      }

      if (intent.intent === 'news') {
        navigate('/news');
        streamBotResponse(`J'ouvre la page Actualités pour les dernières informations.`);
        return;
      }

      if (intent.intent === 'premium') {
        navigate('/premium');
        streamBotResponse(`Je vous redirige vers la page Premium pour choisir votre formule.`);
        return;
      }

      if (intent.intent === 'messages') {
        navigate('/messages');
        streamBotResponse(`J'ouvre la messagerie pour échanger avec l'équipe ou vos formateurs.`);
        return;
      }

      if (intent.intent === 'settings') {
        navigate('/settings');
        streamBotResponse(`J'ouvre les Paramètres pour mettre à jour votre profil et vos préférences.`);
        return;
      }

      if (intent.intent === 'certificate') {
        streamBotResponse(`Pour obtenir un certificat, complétez 100% d'un cours éligible. Le certificat sera disponible au téléchargement dans la Médiathèque si vous êtes Premium.`);
        return;
      }

      if (intent.intent === 'enroll') {
        navigate('/courses');
        streamBotResponse(`Pour vous inscrire, choisissez un cours puis cliquez sur "S'inscrire". Besoin d'aide pour sélectionner un niveau ?`);
        return;
      }

      // Fallback: LLM externe si clé présente, sinon règles internes
      const apiKey = (import.meta as any)?.env?.VITE_OPENAI_API_KEY;
      if (apiKey) {
        const hist: ChatMessage[] = messages.slice(-6).map(m => ({
          role: m.isBot ? 'assistant' : 'user',
          content: m.text,
        }));
        abortRef.current?.abort();
        abortRef.current = new AbortController();
        askLLM(inputValue, hist, abortRef.current.signal)
          .then((answer) => {
            streamBotResponse(answer);
          })
          .catch(() => {
            const fallback = findIntelligentAnswer(inputValue);
            streamBotResponse(fallback);
          });
      } else {
        const answer = findIntelligentAnswer(inputValue);
        streamBotResponse(answer);
      }
      } catch (e) {
        streamBotResponse("Désolé, une erreur est survenue. Réessayez ou reformulez votre question.");
      }
    }, Math.random() * 600 + 400); // délai plus court avant streaming
  };

  const handleVoiceInput = () => {
    const supported = typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
    const secure = typeof window !== 'undefined' && window.isSecureContext === true;
    if (!supported || !secure) {
      streamBotResponse([
        !supported ? 'Votre navigateur ne prend pas en charge la reconnaissance vocale.' : '',
        !secure ? 'Le micro nécessite un contexte sécurisé (HTTPS ou http://localhost).' : '',
        'Astuce: utilisez Chrome/Edge et ouvrez l\'app en HTTPS ou en local.'
      ].filter(Boolean).join('\n'));
      return;
    }

    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    } else if (isListening) {
      setIsListening(false);
      recognitionRef.current?.stop();
    }
  };

  const clearConversation = () => {
    setMessages([initialGreeting]);
    try { localStorage.removeItem(storageKey); } catch {}
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-xl animate-pulse relative"
        >
          <Bot className="w-8 h-8" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
          <Sparkles className="w-4 h-4 absolute -top-2 -left-2 text-yellow-400 animate-bounce" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 h-[500px]">
      <Card className="w-full h-full flex flex-col shadow-2xl border-0 bg-card overflow-hidden">
        {/* Header amélioré */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bot className="w-6 h-6" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
            </div>
            <div>
              <span className="font-semibold">Assistant DOREMI</span>
              <p className="text-xs opacity-90">IA Éducative Intelligente</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearConversation}
              className="text-white hover:bg-white/20"
              title="Effacer la conversation"
            >
              Réinitialiser
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20"
              title="Fermer"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.isBot ? "justify-start" : "justify-end"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-md",
                  message.isBot
                    ? "bg-white dark:bg-gray-700 text-foreground border border-gray-200 dark:border-gray-600"
                    : "bg-gradient-to-r from-blue-600 to-green-600 text-white"
                )}
              >
                {message.text}
                {message.results?.type === 'course' && (
                  <div className="mt-3 space-y-2">
                    {message.results.items.map(item => (
                      <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 dark:border-gray-600 px-3 py-2 bg-white/60 dark:bg-gray-600/50">
                        <div className="min-w-0">
                          <p className="font-medium truncate">{item.title}</p>
                          <p className="text-xs text-gray-500 truncate">{item.category} • {item.level}</p>
                        </div>
                        <Button size="sm" variant="outline" className="h-7" onClick={() => navigate(`/courses?search=${encodeURIComponent(item.title)}`)}>
                          Ouvrir
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <div className={cn(
                  "text-xs mt-1 opacity-70",
                  message.isBot ? "text-muted-foreground" : "text-white/70"
                )}>
                  {message.timestamp.toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-700 rounded-2xl px-4 py-3 border border-gray-200 dark:border-gray-600 shadow-md">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 pb-4 bg-white dark:bg-gray-800 border-t">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Posez-moi une question..."
              className="flex-1 rounded-full border-gray-300 focus:border-blue-500"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleVoiceInput}
              className={cn(
                "px-3 rounded-full",
                isListening && "bg-red-500 text-white hover:bg-red-600"
              )}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Button 
              onClick={handleSendMessage} 
              size="sm" 
              className="rounded-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              disabled={!inputValue.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="mt-2 text-xs text-center text-muted-foreground">
            Propulsé par l'IA DOREMI • Disponible 24h/24
          </div>
        </div>
      </Card>
    </div>
  );
};
