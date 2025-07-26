import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import HeroSection from "../components/HeroSection";
import AddSupplierItemForm from "../components/AddSupplierItemForm";
import CategoryShowcase from "../components/CategoryShowcase";
import NewRequestSection from "../components/NewRequestSection";
import RawItemsSection from "../components/RawItemsSection";
import SpecialItemsSection from "../components/SpecialItemsSection";
import HowItWorks from "../components/HowItWorks";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";


export default function LandingPage() {
  const [activeSection, setActiveSection] = useState(null);
  const rawSectionRef = useRef(null);
  const specialSectionRef = useRef(null);
  const requestSectionRef = useRef(null);

  const handleCategoryClick = (category) => {
    let targetRef;
    switch(category) {
      case 'raw':
        targetRef = rawSectionRef;
        break;
      case 'special':
        targetRef = specialSectionRef;
        break;
      case 'request':
        targetRef = requestSectionRef;
        break;
      default:
        targetRef = null;
    }

    if (activeSection === category) {
      setActiveSection(null);
      // Scroll back to categories when deselecting
      window.scrollTo({
        top: document.querySelector('#category-section')?.offsetTop || 0,
        behavior: 'smooth'
      });
    } else {
      setActiveSection(category);
      
      // First scroll to just above the content section
      const contentSection = document.querySelector('#content-section');
      if (contentSection) {
        const offset = window.innerWidth <= 768 ? 80 : 100; // More offset on mobile
        const targetY = contentSection.offsetTop - offset;
        
        window.scrollTo({
          top: targetY,
          behavior: 'smooth'
        });
      }
      
      // Then let the content animate in
      if (targetRef?.current) {
        setTimeout(() => {
          const offset = window.innerWidth <= 768 ? 80 : 100;
          const elementTop = targetRef.current.offsetTop - offset;
          window.scrollTo({
            top: elementTop,
            behavior: 'smooth'
          });
        }, 300); // Delay to allow the animation to start
      }
    }
  };

  const sectionVariants = {
    hidden: { 
      opacity: 0, 
      y: 100, // Start from further down
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        duration: 0.8,
        bounce: 0.3
      }
    },
    exit: {
      opacity: 0,
      y: -50,
      scale: 0.95,
      transition: {
        duration: 0.3
      }
    }
  };

  useEffect(() => {
    if (activeSection && window.innerWidth <= 768) {
      // Add extra offset for mobile screens
      window.scrollBy({
        top: 60,
        behavior: 'smooth'
      });
    }
  }, [activeSection]);

  return (
    <div className="bg-white dark:bg-[#181818] min-h-screen transition-colors duration-300">
      
      <div className="mt-[-32px]">
        <Navbar />
        <CategoryShowcase onCategoryClick={handleCategoryClick} activeSection={activeSection} />
      </div>
      
      <div className="relative scroll-mt-16" id="content-section">
        <AnimatePresence mode="wait">
          {activeSection === "raw" && (
            <motion.div
              ref={rawSectionRef}
              key="raw-section"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={sectionVariants}
              className="overflow-hidden pt-8"
            >
              <RawItemsSection />
            </motion.div>
          )}
          {activeSection === "special" && (
            <motion.div
              ref={specialSectionRef}
              key="special-section"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={sectionVariants}
              className="overflow-hidden"
            >
              <SpecialItemsSection />
            </motion.div>
          )}
          {activeSection === "request" && (
            <motion.div
              ref={requestSectionRef}
              key="request-section"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={sectionVariants}
              className="overflow-hidden"
            >
              <NewRequestSection />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Add Supplier Item Form - always visible for demo, or restrict as needed */}
        
      </div>

      {/* How It Works Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <HowItWorks />
      </motion.div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
