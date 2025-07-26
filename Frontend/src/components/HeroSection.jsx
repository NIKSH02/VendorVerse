import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";

// Placeholder ChatBox Component (unchanged as per request)
const ChatBox = () => {
  return (
    <div className="flex flex-col h-full w-full p-4 bg-gray-50">
      <div className="flex-grow flex items-center justify-center text-gray-500 text-center text-sm">
        Your AI Chat will appear here.
        <br />
        Ask questions about vendor registration!
      </div>
      <div className="flex items-center p-2 border-t border-gray-200">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-grow p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button className="ml-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
          Send
        </button>
      </div>
    </div>
  );
};

// HeroSection Component - Redesigned
function HeroSection() {
  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut", delay: 0.3 } },
  };

  const chatBoxVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.5 } },
  };

  return (
    <section className="relative w-full min-h-screen bg-gradient-to-br from-orange-50 to-white px-6 py-20 flex justify-center items-center overflow-hidden font-inter">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet" />

      {/* Abstract background pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <svg className="w-full h-full" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <pattern id="pattern-circles" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#F97316" />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
        </svg>
      </div>

      {/* Main content container - Adjusted py- values to move content upward */}
      <div className="relative z-10 max-w-7xl w-full flex flex-col lg:flex-row items-center justify-between gap-16 py-8 sm:py-12">
        {/* LEFT: Text and Vendor Image */}
        <div className="flex flex-col items-center lg:items-start justify-center lg:w-1/2 text-center lg:text-left">
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-black mb-6 leading-tight drop-shadow-md"
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            Empowering <span className="text-orange-600">Street Vendors</span>
          </motion.h1>
          <motion.p
            className="text-xl sm:text-2xl text-gray-800 max-w-2xl mb-10"
            variants={textVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2, ...textVariants.visible.transition }}
          >
            Your ultimate partner for sourcing, managing, and growing your street food business.
          </motion.p>
          <motion.img
            // Updated src to a placeholder for a street food vendor
            src="https://placehold.co/400x500/FF8C00/FFFFFF?text=Street+Food+Vendor+Icon"
            alt="Street Food Vendor"
            className="w-72 sm:w-96 object-contain drop-shadow-xl rounded-xl border-4 border-white"
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x500/E0E0E0/000000?text=Image+Not+Found"; }}
          />
        </div>

        {/* RIGHT: Animated Chat Box */}
        <motion.div
          className="flex flex-col items-center w-full lg:w-1/2"
          variants={chatBoxVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-xl border-8 border-orange-500 transition-transform duration-500 ease-in-out">
            <div className="bg-orange-600 text-white flex justify-between items-center px-6 py-4 rounded-t-2xl">
              <span className="bg-orange-700 text-white text-lg font-bold px-4 py-2 rounded-full shadow-inner">
                Vendor AI Assistant
              </span>
              <span className="text-white text-3xl font-bold cursor-pointer">...</span>
            </div>
            <div className="w-full h-[450px] flex items-center justify-center bg-gray-50">
              <ChatBox />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Main App component that renders only the HeroSection
const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Ensure Tailwind CSS is configured in your project */}
      <HeroSection />
    </div>
  );
};

export default App;
