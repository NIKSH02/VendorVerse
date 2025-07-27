import React, { useState, useEffect } from 'react';
import { Package, ClipboardList, Utensils, Bot } from 'lucide-react';
import RawItemSection from './RawItemsSection';
import { motion, AnimatePresence } from 'framer-motion';
import NewRequestSection from './NewRequestSection';
import SpecialItemsSection from './SpecialItemsSection';
import HeroSection from './HeroSection';
import { useNavigate } from 'react-router-dom';

const CategoryShowcase = () => {
  const headingText = "welcome to street supply.";
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const navigate = useNavigate();
  // Refs for each section
  const rawRef = React.useRef(null);
  const requestRef = React.useRef(null);
  const specialRef = React.useRef(null);
  const heroRef = React.useRef(null);

  // Scroll to section when activeSection changes
  useEffect(() => {
    let ref = null;
    if (activeSection === 'raw') ref = rawRef;
    else if (activeSection === 'request') ref = requestRef;
    else if (activeSection === 'special') ref = specialRef;
    else if (activeSection === 'hero') ref = heroRef;
    if (ref && ref.current) {
      setTimeout(() => {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100); // Wait for section to render
    }
  }, [activeSection]);

  useEffect(() => {
    if (index < headingText.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText((prev) => prev + headingText[index]);
        setIndex((prev) => prev + 1);
      }, 75);
      return () => clearTimeout(timeoutId);
    }
  }, [index, headingText]);

  const cardsData = [
    {
      title: "Raw Materials",
      icon: Package,
      description: "Source the freshest ingredients for your street food creations.",
      section: "raw",
      onExplore: () => setActiveSection('raw')
    },
    {
      title: "Recent Requests",
      icon: ClipboardList,
      description: "See the latest demands from the street food community.",
      section: "request",
      onExplore: () => setActiveSection('request')
    },
    {
      title: "Special Items",
      icon: Utensils,
      description: "Discover unique and hard-to-find ingredients like boiled aloo vada masala.",
      section: "special",
      onExplore: () => setActiveSection('special')
    },
    {
      title: "Become a Vendor AI",
      icon: Bot,
      description: "Leverage AI to optimize your street food business operations.",
      section: "hero",
      onExplore: () => setActiveSection('hero')
    },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'raw':
        return (
          <div ref={rawRef}>
            <AnimatePresence>
              <motion.div
                key="raw-section"
                initial={{ opacity: 0, scale: 0.7, rotate: -10, y: 100 }}
                animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0.7, rotate: 10, y: 100 }}
                transition={{ type: 'spring', stiffness: 120, damping: 14, duration: 0.7 }}
              >
                <RawItemSection />
              </motion.div>
            </AnimatePresence>
          </div>
        );
      case 'request':
        return <div ref={requestRef}><NewRequestSection /></div>;
      case 'special':
        return (
          <div ref={specialRef}>
            <AnimatePresence>
              <motion.div
                key="special-section"
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 80 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <SpecialItemsSection />
              </motion.div>
            </AnimatePresence>
          </div>
        );
      case 'hero':
        return <div ref={heroRef}><HeroSection /></div>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-inter flex flex-col items-center justify-center p-4 sm:p-8">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-center mb-4 mt-0 text-black leading-tight" style={{ marginTop: '15px' }}>
        <span className="typewriter-text">
          {displayedText}
          <span className="inline-block w-1.5 h-8 sm:h-10 lg:h-12 bg-orange-500 animate-blink ml-1"></span>
        </span>
      </h1>
      {/* Restored Search Bar */}
      <div className="flex justify-center mb-8 w-full">
        <div className="relative w-full max-w-xl">
          <input
            type="text"
            placeholder="Search for any item, category, or vendor..."
            className="w-full py-3 pl-10 pr-4 rounded-xl border border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 bg-white text-base shadow placeholder-gray-400 transition-all duration-200"
            style={{ boxShadow: '0 2px 12px 0 rgba(251, 146, 60, 0.08)' }}
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
          </span>
        </div>
      </div>
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 w-full max-w-5xl"
        initial={{ opacity: 0, scale: 0.95, y: 60 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.8, bounce: 0.25 }}
      >
        {cardsData.map((card, idx) => (
          <Card
            key={idx}
            title={card.title}
            icon={card.icon}
            description={card.description}
            onExplore={card.onExplore}
          />
        ))}
      </motion.div>
      {renderSection()}
      <style>
        {`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 0.75s step-end infinite;
        }
        .font-inter {
            font-family: 'Inter', sans-serif;
        }
        `}
      </style>
    </div>
  );
};

const Card = ({ title, icon: Icon, description, onExplore }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1
                    border border-orange-200 flex flex-col items-center p-5 text-center min-h-[230px] h-full" style={{ minHeight: '230px', height: '100%', maxWidth: '270px', margin: '0 auto' }}>
      <div className="p-3 bg-orange-500 text-white rounded-full mb-3 shadow">
        <Icon size={36} />
      </div>
      <h3 className="text-lg font-bold text-black mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-3 flex-grow">{description}</p>
      <button
        className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-5 rounded-full
                         shadow hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2
                         focus:ring-orange-500 focus:ring-opacity-75 text-sm"
        onClick={onExplore}
      >
        Explore
      </button>
    </div>
  );
};

export default CategoryShowcase;
