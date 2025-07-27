import React from "react";

function ThemeToggle({ theme, setTheme }) {
  return (
    <button
      aria-label="Toggle theme"
      onClick={() => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        // Also set the class on the root HTML element for system-wide theme
        document.documentElement.classList.remove(theme);
        document.documentElement.classList.add(newTheme);
      }}
      className="relative ml-4 p-2 rounded-full transition-all duration-500 
        bg-gradient-to-r from-orange-500/10 to-yellow-500/10 dark:from-gray-700 dark:to-gray-600
        hover:from-orange-500/20 hover:to-yellow-500/20 dark:hover:from-gray-600 dark:hover:to-gray-500
        transform hover:scale-110 hover:rotate-12
        shadow-lg dark:shadow-orange-500/20"
    >
      <div className="relative">
        {theme === "light" ? (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-gray-800 dark:text-orange-400 transform transition-transform duration-500 rotate-0"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
            />
          </svg>
        ) : (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-yellow-400 transform transition-transform duration-500 rotate-180"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
            />
          </svg>
        )}
        <div className={`absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-400 opacity-0 dark:opacity-20 rounded-full blur transition-opacity duration-500`} />
      </div>
    </button>
  );
}

export default ThemeToggle;