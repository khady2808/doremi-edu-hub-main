import React from 'react';
import { useLocation } from 'react-router-dom';

export const Footer: React.FC = () => {
  const location = useLocation();
  // Ne pas afficher le footer sur Login/Register
  if (["/login", "/register"].includes(location.pathname)) return null;

  return (
    <footer className="mt-auto w-full bg-black text-white py-6">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="text-sm">© 2025 DOREMI — Tous droits réservés.</div>
        <div className="text-sm">Contact : <a href="mailto:contact@doremi-edu.sn" className="underline underline-offset-2 hover:opacity-90">contact@doremi-edu.sn</a></div>
      </div>
    </footer>
  );
};

export default Footer;