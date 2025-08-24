
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crown,
  Check,
  X,
  Download,
  MessageSquare,
  BookOpen,
  Award,
  Zap,
  Star,
  Users,
  Shield,
  Sparkles,
  Infinity,
  TrendingUp,
  Video,
  FileText,
  Globe,
  Rocket,
  Target,
  Gift,
  Heart,
  Clock,
  Lock,
  Unlock,
  ArrowRight,
  Play,
  Headphones,
  Monitor,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const subscriptionPlans = [
  {
    id: 'basic',
    name: 'Basique',
    price: 0,
    period: 'Gratuit',
    description: 'Parfait pour découvrir DOREMI',
    features: [
      'Accès aux cours publics',
      'Tableau de bord personnel',
      'Support communautaire',
      'Progression sauvegardée'
    ],
    limitations: [
      'Pas de téléchargement',
      'Pas de certificats',
      'Messagerie limitée',
      'Pas de contenu premium'
    ],
    buttonText: 'Plan actuel',
    popular: false,
    gradient: 'from-gray-400 to-gray-600',
    icon: Globe,
    color: 'gray'
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 10,
    period: '/mois',
    description: 'Idéal pour les étudiants sérieux',
    features: [
      'Tous les avantages Basique',
      'Accès à tous les cours',
      'Téléchargement PDF illimité',
      'Messagerie étendue',
      'Support prioritaire',
      'Certificats de complétion'
    ],
    limitations: [
      'Pas de téléchargement vidéo',
      'Contenu premium limité'
    ],
    buttonText: 'Choisir Standard',
    popular: false,
    gradient: 'from-blue-500 to-blue-700',
    icon: BookOpen,
    color: 'blue'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 20,
    period: '/mois',
    description: 'L\'expérience complète DOREMI',
    features: [
      'Tous les avantages Standard',
      'Téléchargement vidéos HD',
      'Contenu exclusif Premium',
      'Certificats officiels PDF',
      'Support 24/7 prioritaire',
      'Groupes d\'étude privés',
      'Stockage illimité',
      'Accès anticipé aux nouveautés'
    ],
    limitations: [],
    buttonText: 'Choisir Premium',
    popular: true,
    gradient: 'from-yellow-400 via-yellow-500 to-yellow-600',
    icon: Crown,
    color: 'yellow'
  }
];

const whyPremiumFeatures = [
  {
    icon: Infinity,
    title: 'Accès Illimité',
    description: 'Tous les cours, toutes les ressources, sans aucune limite',
    color: 'from-purple-400 to-purple-600'
  },
  {
    icon: Download,
    title: 'Téléchargement',
    description: 'Accédez à vos cours hors ligne, partout et à tout moment',
    color: 'from-blue-400 to-blue-600'
  },
  {
    icon: Star,
    title: 'Contenu Exclusif',
    description: 'Cours premium, masterclass et contenus réservés aux membres',
    color: 'from-yellow-400 to-yellow-600'
  },
  {
    icon: Award,
    title: 'Certificats Officiels',
    description: 'Certificats PDF reconnus pour valoriser votre CV',
    color: 'from-green-400 to-green-600'
  },
  {
    icon: Users,
    title: 'Communauté VIP',
    description: 'Rejoignez des groupes d\'étude privés avec d\'autres Premium',
    color: 'from-pink-400 to-pink-600'
  },
  {
    icon: Shield,
    title: 'Support Prioritaire',
    description: 'Support 24/7 avec temps de réponse garanti',
    color: 'from-red-400 to-red-600'
  }
];

const comparisonFeatures = [
  { name: 'Accès aux cours publics', basic: true, standard: true, premium: true },
  { name: 'Accès à tous les cours', basic: false, standard: true, premium: true },
  { name: 'Téléchargement PDF', basic: false, standard: true, premium: true },
  { name: 'Téléchargement vidéos', basic: false, standard: false, premium: true },
  { name: 'Certificats de complétion', basic: false, standard: true, premium: true },
  { name: 'Certificats officiels PDF', basic: false, standard: false, premium: true },
  { name: 'Messagerie', basic: 'Limitée', standard: 'Étendue', premium: 'Illimitée' },
  { name: 'Support', basic: 'Communautaire', standard: 'Prioritaire', premium: '24/7 VIP' },
  { name: 'Contenu premium', basic: false, standard: 'Partiel', premium: true },
  { name: 'Groupes d\'étude', basic: false, standard: false, premium: true },
  { name: 'Stockage', basic: 'Limité', standard: '5GB', premium: 'Illimité' }
];

const PricingCard = ({ plan, delay }: { plan: typeof subscriptionPlans[0], delay: number }) => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const handleSubscribe = () => {
    if (plan.id === 'basic') {
      alert('Vous utilisez déjà le plan Basique !');
      return;
    }
    
    alert(`Redirection vers Stripe pour l'abonnement ${plan.name} à ${plan.price}€${plan.period}...`);
    console.log('Stripe integration:', {
      planId: plan.id,
      amount: plan.price * 100,
      currency: 'eur',
      userId: user?.id
    });
  };

  const IconComponent = plan.icon;

  return (
    <Card 
      className={`relative transform transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${isHovered ? 'scale-105' : 'scale-100'} ${
        plan.popular ? 'border-4 border-yellow-400 shadow-2xl' : 'border-2 border-border'
      } overflow-hidden group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Effet de fond animé */}
      <div className={`absolute inset-0 bg-gradient-to-r ${plan.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
      
      {plan.popular && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <Badge className="premium-badge px-6 py-2 text-lg animate-pulse bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
            <Sparkles className="w-5 h-5 mr-2" />
            Le plus populaire
          </Badge>
        </div>
      )}
      
      <CardHeader className={`text-center ${plan.popular ? 'pt-8' : 'pt-6'} relative z-10`}>
        <div className={`w-20 h-20 bg-gradient-to-r ${plan.gradient} rounded-3xl flex items-center justify-center mx-auto mb-6 animate-bounce-gentle shadow-lg group-hover:shadow-2xl transition-all duration-300`}>
          <IconComponent className="w-10 h-10 text-white" />
        </div>
        
        <CardTitle className={`text-3xl font-bold ${plan.popular ? 'bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent' : ''}`}>
          {plan.name}
        </CardTitle>
        
        <CardDescription className="text-lg mt-2">{plan.description}</CardDescription>
        
        <div className="text-6xl font-bold mt-6">
          {plan.price === 0 ? (
            <span className="text-green-600">Gratuit</span>
          ) : (
            <>
              <span className={plan.popular ? 'bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent' : ''}>
                {plan.price}€
              </span>
              <span className="text-xl font-normal text-muted-foreground">{plan.period}</span>
            </>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-8 relative z-10">
        <div className="space-y-6">
          <h4 className="font-semibold text-green-600 flex items-center text-lg">
            <Check className="w-6 h-6 mr-3" />
            Inclus :
          </h4>
          <ul className="space-y-4">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-4 group/item">
                <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform duration-200">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm group-hover/item:text-green-600 transition-colors duration-200">{feature}</span>
              </li>
            ))}
          </ul>
          
          {plan.limitations.length > 0 && (
            <>
              <h4 className="font-semibold text-red-600 flex items-center mt-8 text-lg">
                <X className="w-6 h-6 mr-3" />
                Non inclus :
              </h4>
              <ul className="space-y-3">
                {plan.limitations.map((limitation, index) => (
                  <li key={index} className="flex items-center gap-4 group/item">
                    <X className="w-7 h-7 text-red-500 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-200" />
                    <span className="text-sm text-muted-foreground group-hover/item:text-red-600 transition-colors duration-200">{limitation}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        
        <Button 
          size="lg"
          className={`w-full h-14 text-lg font-semibold ${
            plan.popular 
              ? 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black shadow-lg hover:shadow-xl' 
              : plan.id === 'basic'
              ? 'bg-gray-400 text-gray-700'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
          } transform hover:scale-105 transition-all duration-300`}
          onClick={handleSubscribe}
          disabled={plan.id === 'basic'}
        >
          {plan.id === 'premium' && <Zap className="w-6 h-6 mr-3" />}
          {plan.buttonText}
          {plan.id !== 'basic' && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />}
        </Button>
      </CardContent>
    </Card>
  );
};

const FeatureCard = ({ feature, delay }: { feature: typeof whyPremiumFeatures[0], delay: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Card 
      className={`transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} hover:scale-105 hover:shadow-2xl group overflow-hidden`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
      <CardContent className="p-8 text-center relative z-10">
        <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center mx-auto mb-6 animate-bounce-gentle shadow-lg group-hover:shadow-2xl transition-all duration-300`}>
          <feature.icon className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-xl font-bold mb-4 group-hover:text-blue-600 transition-colors duration-200">{feature.title}</h3>
        <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
      </CardContent>
    </Card>
  );
};

export const Premium: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-20 overflow-hidden">
      {/* Header moderne avec animations */}
      <div className="text-center space-y-8 py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50 rounded-3xl relative overflow-hidden">
        {/* Effets de fond animés */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400/10 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-24 h-24 bg-purple-400/10 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-10 left-1/4 w-20 h-20 bg-blue-400/10 rounded-full animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative z-10">
          <div className="relative mb-8">
            <div className="w-32 h-32 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-3xl flex items-center justify-center mx-auto animate-bounce shadow-2xl">
              <Crown className="w-16 h-16 text-white" />
            </div>
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-300 rounded-full animate-ping"></div>
            <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-yellow-200/20 rounded-full animate-ping delay-1000"></div>
          </div>
          
          <h1 className="text-7xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent mb-6">
            DOREMI Premium
          </h1>
          
          <p className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
            Débloquez le potentiel illimité de votre apprentissage avec nos abonnements adaptés à tous les besoins
          </p>
          
          <div className="flex items-center justify-center gap-6 text-lg text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>7 jours d'essai gratuit</span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>Annulation à tout moment</span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>Support 24/7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="space-y-12">
        <div className="text-center">
          <h2 className="text-5xl font-bold mb-4">Choisissez votre plan</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Des options flexibles pour tous les budgets et tous les besoins d'apprentissage
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {subscriptionPlans.map((plan, index) => (
            <PricingCard key={plan.id} plan={plan} delay={index * 200} />
          ))}
        </div>
      </div>

      {/* Why Premium */}
      <div className="space-y-12">
        <div className="text-center">
          <h2 className="text-5xl font-bold mb-4">Pourquoi devenir Premium ?</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez tous les avantages exclusifs qui vous attendent avec DOREMI Premium
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {whyPremiumFeatures.map((feature, index) => (
            <FeatureCard key={index} feature={feature} delay={index * 150} />
          ))}
        </div>
      </div>

      {/* Comparison Table moderne */}
      <Card className="max-w-7xl mx-auto shadow-2xl border-0">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-4xl font-bold mb-4">Comparaison détaillée</CardTitle>
          <CardDescription className="text-xl">
            Découvrez en détail ce qui est inclus dans chaque plan
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-6 px-8 font-bold text-lg">Fonctionnalité</th>
                  <th className="text-center py-6 px-8 font-bold text-lg">Basique</th>
                  <th className="text-center py-6 px-8 font-bold text-lg bg-blue-50 rounded-t-lg">Standard</th>
                  <th className="text-center py-6 px-8 font-bold text-lg bg-gradient-to-r from-yellow-100 to-orange-100 rounded-t-lg">
                    Premium
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-muted/30 transition-colors">
                    <td className="py-6 px-8 font-medium text-lg">{feature.name}</td>
                    <td className="text-center py-6 px-8">
                      {typeof feature.basic === 'boolean' ? (
                        feature.basic ? (
                          <Check className="w-7 h-7 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-7 h-7 text-red-500 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm text-orange-600 font-medium bg-orange-50 px-3 py-1 rounded-full">{feature.basic}</span>
                      )}
                    </td>
                    <td className="text-center py-6 px-8 bg-blue-50">
                      {typeof feature.standard === 'boolean' ? (
                        feature.standard ? (
                          <Check className="w-7 h-7 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-7 h-7 text-red-500 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm text-blue-600 font-medium bg-blue-100 px-3 py-1 rounded-full">{feature.standard}</span>
                      )}
                    </td>
                    <td className="text-center py-6 px-8 bg-gradient-to-r from-yellow-50 to-orange-50">
                      {typeof feature.premium === 'boolean' ? (
                        feature.premium ? (
                          <Check className="w-7 h-7 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-7 h-7 text-red-500 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm text-yellow-600 font-medium bg-yellow-100 px-3 py-1 rounded-full">{feature.premium}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* CTA Banner moderne */}
      <Card className="max-w-6xl mx-auto bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 border-0 shadow-2xl overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-40 h-40 bg-yellow-400/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-orange-400/10 rounded-full animate-pulse delay-1000"></div>
        </div>
        <CardContent className="p-20 text-center relative z-10">
          <div className="animate-bounce mb-10">
            <Crown className="w-24 h-24 text-yellow-500 mx-auto" />
          </div>
          <h3 className="text-5xl font-bold mb-8 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Prêt à transformer votre apprentissage ?
          </h3>
          <p className="text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
            Rejoignez des milliers d'étudiants qui ont choisi DOREMI Premium pour accélérer leur apprentissage et atteindre leurs objectifs professionnels
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold px-12 py-6 text-2xl shadow-2xl transform hover:scale-110 transition-all duration-300"
              onClick={() => alert('Redirection vers l\'abonnement Premium...')}
            >
              <Sparkles className="w-8 h-8 mr-4" />
              Rejoindre Premium maintenant
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="px-12 py-6 text-xl border-2 border-blue-500 hover:bg-blue-50 shadow-lg transform hover:scale-105 transition-all duration-300"
              onClick={() => alert('Redirection vers l\'abonnement Standard...')}
            >
              <TrendingUp className="w-7 h-7 mr-3" />
              Essayer Standard
            </Button>
          </div>
          <div className="flex items-center justify-center gap-8 text-lg text-muted-foreground">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-green-500" />
              <span>7 jours d'essai gratuit</span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span>Annulation à tout moment</span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-500" />
              <span>Support 24/7</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
