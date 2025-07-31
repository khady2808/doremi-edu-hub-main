import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const links = [
  { label: 'Accueil', to: '/' },
  { label: 'Cours', to: '/courses' },
  { label: 'Messagerie', to: '/messages' },
  { label: 'Premium', to: '/premium' },
  { label: 'Contact', to: '/contact' },
];

const socialLinks = [
  { icon: <FaFacebook />, url: 'https://facebook.com', label: 'Facebook' },
  { icon: <FaTwitter />, url: 'https://twitter.com', label: 'Twitter' },
  { icon: <FaInstagram />, url: 'https://instagram.com', label: 'Instagram' },
];

export const Footer: React.FC = () => {
  const location = useLocation();
  // Ne pas afficher le footer sur Login/Register
  if (["/login", "/register"].includes(location.pathname)) return null;

  return (
    <footer className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-8 mt-12 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-8">
        {/* Logo & Nom */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="font-extrabold text-2xl tracking-widest drop-shadow-lg">DOREMI</div>
          <div className="text-xs text-white/70 font-light">Plateforme éducative</div>
        </div>
        {/* Liens utiles */}
        <nav className="flex flex-wrap gap-4 text-sm font-medium justify-center">
          {links.map(link => (
            <Link key={link.to} to={link.to} className="hover:underline hover:text-green-200 transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>
        {/* Réseaux sociaux & contact */}
        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="flex gap-4 mb-1">
            {socialLinks.map(s => (
              <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="text-white hover:text-green-200 text-xl transition-colors">
                {s.icon}
              </a>
            ))}
          </div>
          <div className="text-xs text-white/80">
            <span className="block">contact@doremi-edu.com</span>
            <span className="block">+33 1 23 45 67 89</span>
          </div>
        </div>
      </div>
      <div className="mt-6 border-t border-white/20 pt-4 text-center text-xs text-white/70">
        © 2025 DOREMI - Tous droits réservés. | Mentions légales fictives.
      </div>
    </footer>
  );
};

export default Footer;