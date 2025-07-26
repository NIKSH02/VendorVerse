
import { FaHome, FaUserPlus, FaInfoCircle } from "react-icons/fa";
import React, { useState } from "react";
import ThemeToggle from "./ThemeToggle";

function Navbar({ theme, setTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-lg sticky top-0 z-20 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-4">
        <div className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center">
          <span className="text-orange-500 mr-2">🍛</span>
          StreetSupply
        </div>
        
        <button 
          className="md:hidden ml-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" 
          onClick={() => setMenuOpen(!menuOpen)} 
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div className={`flex-col md:flex-row md:flex items-center gap-6 md:gap-8 absolute md:static top-16 left-0 w-full md:w-auto bg-white dark:bg-gray-900 md:bg-transparent md:dark:bg-transparent shadow-lg md:shadow-none transition-all duration-300 ${menuOpen ? 'flex' : 'hidden md:flex'}`}>
          <a href="#home" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 font-medium transition-colors px-4 py-3 md:p-0 hover:bg-gray-50 dark:hover:bg-gray-800 md:hover:bg-transparent rounded-lg">
            <FaHome /> <span data-translate="true">Home</span>
          </a>
          <a href="#signup" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 font-medium transition-colors px-4 py-3 md:p-0 hover:bg-gray-50 dark:hover:bg-gray-800 md:hover:bg-transparent rounded-lg">
            <FaUserPlus /> <span data-translate="true">Signup</span>
          </a>
          <a href="#about" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 font-medium transition-colors px-4 py-3 md:p-0 hover:bg-gray-50 dark:hover:bg-gray-800 md:hover:bg-transparent rounded-lg">
            <FaInfoCircle /> <span data-translate="true">About</span>
          </a>
          
          <button className="ml-0 md:ml-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-full md:w-auto mt-2 md:mt-0">
            <span data-translate="true">+ New Request</span>
          </button>
          
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;