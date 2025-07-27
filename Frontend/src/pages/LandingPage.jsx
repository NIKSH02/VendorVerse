import React, { useState, useRef, useEffect } from "react";
import LocationPopup from "../components/LocationPopup";
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
  const [locationSet, setLocationSet] = useState(false);

  const [activeSection, setActiveSection] = useState(null);
  const rawSectionRef = useRef(null);
  const specialSectionRef = useRef(null);
  const requestSectionRef = useRef(null);

  // Move this function above its first usage
  const handleCategoryClick = (category) => {
    let targetRef = null;
    if (category === 'raw') targetRef = rawSectionRef;
    else if (category === 'special') targetRef = specialSectionRef;
    else if (category === 'request') targetRef = requestSectionRef;
    setActiveSection(category);
    if (targetRef && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLocationSet = (location) => {
    setLocationSet(true);
    // Optionally store location in context or localStorage
  };

  return (
    <div className="relative min-h-screen">
      {/* Blurred background when popup is open */}
      <div className={locationSet ? "" : "opacity-80 pointer-events-none select-none"}>
        <div className=" min-h-screen duration-30">
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
            initial={{ opacity: 0.6 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <HowItWorks />
          </motion.div>
          {/* Footer */}
          <Footer />
        </div>
      </div>
      {/* Location popup modal */}
      {!locationSet && (
        <LocationPopup onLocationSet={handleLocationSet} />
      )}
    </div>
  );

}
