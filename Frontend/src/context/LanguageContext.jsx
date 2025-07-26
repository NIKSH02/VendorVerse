import React, { useState, useCallback } from 'react';
import { LanguageContext } from './LanguageContext.context';

// Cache for translations to avoid repeated API calls
const translationCache = new Map();

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);

  // Test the translation API on mount
  React.useEffect(() => {
    const testTranslation = async () => {
      try {
        const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: 'Hello World',
            target: 'es',
            source: 'en'
          })
        });
        
        const data = await response.json();
        if (!response.ok) {
          console.error('Translation API test failed:', data);
        } else {
          console.log('Translation API test successful:', data);
        }
      } catch (error) {
        console.error('Translation API test error:', error);
      }
    };
    testTranslation();
  }, []);

  const translateText = useCallback(async (text, targetLang) => {
    if (targetLang === 'en') return text;

    // Check cache first
    const cacheKey = `${text}:${targetLang}`;
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey);
    }

    try {
      console.log('Making translation request for:', text, 'to language:', targetLang);
      const apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;
      console.log('API Key available:', !!apiKey);
      
      // Using the basic translate API endpoint
      const encodedText = encodeURIComponent(text);
      const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodedText}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Translation API Error:', errorData);
        throw new Error(`Translation failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Translation response:', data);
      
      if (!data.data || !data.data.translations || !data.data.translations[0]) {
        console.error('Invalid translation response:', data);
        return text;
      }

      const translation = data.data.translations[0].translatedText;
      console.log('Translated text:', translation);
      
      // Cache the translation
      translationCache.set(cacheKey, translation);
      
      return translation;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }, []);

  const changeLanguage = useCallback(async (newLanguage) => {
    if (currentLanguage === newLanguage) return;
    setIsTranslating(true);
    console.log('Changing language to:', newLanguage);

    try {
      // Find all translatable elements
      const elements = document.querySelectorAll('[data-translate="true"]');
      console.log('Found translatable elements:', elements.length);
      
      // Batch translations for efficiency
      const translationPromises = Array.from(elements).map(async (element) => {
        const originalText = element.getAttribute('data-original-text') || element.textContent;
        
        // Store original text if not already stored
        if (!element.getAttribute('data-original-text')) {
          element.setAttribute('data-original-text', originalText);
        }

        // For English, restore original text
        if (newLanguage === 'en') {
          element.textContent = originalText;
          return;
        }

        // Translate text
        const translatedText = await translateText(originalText, newLanguage);
        element.textContent = translatedText;
      });

      // Wait for all translations to complete
      await Promise.all(translationPromises);
      
      // Update language state
      setCurrentLanguage(newLanguage);
      // Store preference
      localStorage.setItem('preferredLanguage', newLanguage);
    } catch (error) {
      console.error('Language change error:', error);
    } finally {
      setIsTranslating(false);
    }
  }, [currentLanguage, translateText]);

  // Initialize language from localStorage on mount
  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      changeLanguage(savedLanguage);
    }
  }, [changeLanguage]);

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      changeLanguage,
      isTranslating 
    }}>
      {children}
      {isTranslating && (
        <div className="fixed bottom-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          Translating...
        </div>
      )}
    </LanguageContext.Provider>
  );
};


