
import React, { useState, useEffect } from "react";
import { LocationProvider } from "./components/LocationProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import { useLocation } from "./hooks/useLocation";
import LandingPage from "./pages/LandingPage";
import CommunityRequests from './pages/CommunityRequests';


function AppContent({ theme }) {
  const { location } = useLocation();
  return location ? <LandingPage theme={theme} /> : null;
}

function App() {
  // Initialize theme from localStorage or system preference
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    // Fall back to system preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? "dark" 
      : "light";
  });

  // Apply theme to document and save to localStorage
  useEffect(() => {
    // Save theme preference
    localStorage.setItem('theme', theme);
    
    // Apply theme class to document
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only update if user hasn't manually set a preference
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen transition-all duration-500">
      <ErrorBoundary>
        <LocationProvider>
          <Navbar theme={theme} setTheme={setTheme} />
          <AppContent theme={theme} />
        </LocationProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;