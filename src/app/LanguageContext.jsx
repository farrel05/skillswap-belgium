'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  // Toujours démarrer en 'fr' côté serveur pour éviter l'hydration mismatch
  const [lang, setLang] = useState('fr');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Lire localStorage uniquement côté client, après le montage
    const saved = localStorage.getItem('ss_lang');
    if (saved) setLang(saved);
    setMounted(true);
  }, []);

  const changeLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('ss_lang', newLang);
  };

  // Pendant le SSR et le premier render client, on rend 'fr' — pas de mismatch
  return (
    <LanguageContext.Provider value={{ lang, changeLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLang() {
  return useContext(LanguageContext);
}
