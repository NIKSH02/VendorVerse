import { FaHome, FaUserPlus, FaInfoCircle, FaGlobe, FaUserCircle } from "react-icons/fa";
import React, { useState } from "react";
import { Link } from 'react-router-dom';
import ThemeToggle from "./ThemeToggle";

// List of top Indian languages and their codes for a custom dropdown
const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'mr', name: 'Marathi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'bn', name: 'Bengali' },
  { code: 'te', name: 'Telugu' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'ur', name: 'Urdu' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' },
];

// Helper function to find and collect all translatable text from the DOM
const collectTextFromDOM = () => {
  const textNodes = [];
  // You might want to define a specific area, e.g., an ID for your main content
  const contentArea = document.getElementById('root') || document.body;
  
  const walk = document.createTreeWalker(contentArea, NodeFilter.SHOW_TEXT, null, false);
  let node;
  while ((node = walk.nextNode())) {
    const trimmedText = node.nodeValue.trim();
    if (trimmedText.length > 0 && node.parentNode.tagName !== 'SCRIPT' && node.parentNode.tagName !== 'STYLE') {
      textNodes.push({ node, originalText: trimmedText });
    }
  }
  return textNodes;
};

// Helper function to update the DOM with translated text
const updateDOMWithTranslation = (textNodes, translatedTexts) => {
  if (textNodes.length !== translatedTexts.length) {
    console.error('Mismatch between original and translated text arrays.');
    return;
  }
  textNodes.forEach((item, index) => {
    item.node.nodeValue = translatedTexts[index];
  });
};

function Navbar({ theme, setTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);

  // Function to change the language by calling the backend
  const changeLanguage = async (langCode) => {
    const selectedLang = LANGUAGES.find(lang => lang.code === langCode);
    setSelectedLanguage(selectedLang);
    setLangDropdownOpen(false);

    if (langCode === 'en') {
      // Revert to original language (you would need to store the original text)
      // This part requires more advanced state management
      // For now, we'll just stop the translation process
      return; 
    }

    try {
      const textNodes = collectTextFromDOM();
      const textToTranslate = textNodes.map(item => item.originalText);

      // Make a POST request to your backend server
      const response = await fetch('http://localhost:3001/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textToTranslate, targetLanguage: langCode }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      updateDOMWithTranslation(textNodes, data.translatedText);

    } catch (error) {
      console.error('Failed to translate page:', error);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-lg sticky top-0 z-20 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-4">
        {/* ... (rest of your existing navbar code) ... */}
        <div className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center">
          <span className="text-orange-500 mr-2">🍛</span>
          StreetSupply
        </div>
        
        <div className="flex items-center md:hidden">
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <button 
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" 
            onClick={() => setMenuOpen(!menuOpen)} 
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        <div className={`flex-col md:flex-row md:flex items-center gap-6 md:gap-8 absolute md:static top-16 left-0 w-full md:w-auto bg-white dark:bg-gray-900 md:bg-transparent md:dark:bg-transparent shadow-lg md:shadow-none transition-all duration-300 ${menuOpen ? 'flex' : 'hidden md:flex'}`}>
          <Link to="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 font-medium transition-colors px-4 py-3 md:p-0 hover:bg-gray-50 dark:hover:bg-gray-800 md:hover:bg-transparent rounded-lg">
            <FaHome /> <span data-translate="true">Home</span>
          </Link>
          <Link to="/authpage" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 font-medium transition-colors px-4 py-3 md:p-0 hover:bg-gray-50 dark:hover:bg-gray-800 md:hover:bg-transparent rounded-lg">
            <FaUserPlus /> <span data-translate="true">Signup</span>
          </Link>
          <Link to="/about" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 font-medium transition-colors px-4 py-3 md:p-0 hover:bg-gray-50 dark:hover:bg-gray-800 md:hover:bg-transparent rounded-lg">
            <FaInfoCircle /> <span data-translate="true">About</span>
          </Link>

          {/* Profile Link */}
          <Link to="/Profile" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 font-medium transition-colors px-4 py-3 md:p-0 hover:bg-gray-50 dark:hover:bg-gray-800 md:hover:bg-transparent rounded-lg">
            <FaUserCircle className="text-2xl" /> <span data-translate="true">Profile</span>
          </Link>

          <button className="ml-0 md:ml-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-full md:w-auto mt-2 md:mt-0">
            <span data-translate="true">+ New Request</span>
          </button>

          {/* Custom Language Dropdown */}
          <div className="relative inline-block text-left z-30">
            <div>
              <button 
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="inline-flex justify-center w-full rounded-md border border-gray-300 dark:border-gray-700 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-orange-500"
                id="language-menu-button"
                aria-expanded={langDropdownOpen}
                aria-haspopup="true"
              >
                <FaGlobe className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                {selectedLanguage.name}
                <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {langDropdownOpen && (
              <div 
                className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="language-menu-button"
                tabIndex="-1"
              >
                <div className="py-1" role="none">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                      role="menuitem"
                      tabIndex="-1"
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;