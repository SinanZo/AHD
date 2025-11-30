import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'ar' : 'en';
    setCurrentLanguage(newLanguage);
    
    // Update document direction and language
    document.documentElement.lang = newLanguage;
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    
    // Store language preference
    localStorage.setItem('language', newLanguage);
    
    // Trigger a custom event for language change
    window.dispatchEvent(new CustomEvent('languageChange', { detail: newLanguage }));
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="border-border hover:bg-muted/50 transition-colors"
    >
      <Globe className="w-4 h-4 mr-2" />
      {currentLanguage === 'en' ? 'العربية' : 'English'}
    </Button>
  );
}

