import React, { useState, useEffect } from 'react';
import { Package, ClipboardList, Utensils, Bot } from 'lucide-react';
import RawItemSection from './RawItemsSection';
import { motion, AnimatePresence } from 'framer-motion';
import NewRequestSection from './NewRequestSection';
import SpecialItemsSection from './SpecialItemsSection';
import HeroSection from './HeroSection';

const CategoryShowcase = () => {
  const headingText = "welcome to street supply.";
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);
  const [activeSection, setActiveSection] = useState('');

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
      section: "raw"
    },
    {
      title: "Recent Requests",
      icon: ClipboardList,
      description: "See the latest demands from the street food community.",
      section: "request"
    },
    {
      title: "Special Items",
      icon: Utensils,
      description: "Discover unique and hard-to-find ingredients like boiled aloo vada masala.",
      section: "special"
    },
    {
      title: "Become a Vendor AI",
      icon: Bot,
      description: "Leverage AI to optimize your street food business operations.",
      section: "hero"
    },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'raw':
        return (
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
        );
      case 'request':
        return <NewRequestSection />;
      case 'special':
        return (
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
        );
      case 'hero':
        return <HeroSection />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-inter flex flex-col items-center justify-center p-4 sm:p-8">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-center mb-12 text-black leading-tight">
        <span className="typewriter-text">
          {displayedText}
          <span className="inline-block w-1.5 h-8 sm:h-10 lg:h-12 bg-orange-500 animate-blink ml-1"></span>
        </span>
      </h1>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl"
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
            onExplore={() => setActiveSection(card.section)}
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
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2
                    border-2 border-orange-200 flex flex-col items-center p-6 text-center">
      <div className="p-4 bg-orange-500 text-white rounded-full mb-4 shadow-md">
        <Icon size={48} />
      </div>
      <h3 className="text-2xl font-bold text-black mb-2">{title}</h3>
      <p className="text-gray-600 text-base mb-6 flex-grow">{description}</p>
      <button
        className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-full
                         shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2
                         focus:ring-orange-500 focus:ring-opacity-75"
        onClick={onExplore}
      >
        Explore
      </button>
    </div>
  );
};

export default CategoryShowcase;
