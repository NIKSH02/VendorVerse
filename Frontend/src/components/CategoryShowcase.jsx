import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

const categories = [
  {
    id: 1,
    title: "Raw Items",
    description: "Fresh vegetables, grains, and spices sourced directly from farmers",
    image: "/asian-market-booth-vendor-buyers-isolated-white-background-indian-street-souk-kiosk-spices-local-outdoor-bazaar-vector-200378147.webp",
    gradient: "from-orange-400 via-orange-500 to-orange-600",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  {
    id: 2,
    title: "Special Items",
    description: "Premium and seasonal ingredients for special occasions",
    image: "/asian-market-booth-vendor-buyers-isolated-white-background-indian-street-souk-kiosk-spices-local-outdoor-bazaar-vector-200378147.webp",
    gradient: "from-orange-500 via-orange-600 to-orange-700",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    )
  },
  {
    id: 3,
    title: "Make Request",
    description: "Can't find what you need? Make a custom request",
    image: "/farmer.png",
    gradient: "from-orange-600 via-orange-700 to-orange-800",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
];

function CategoryShowcase({ onCategoryClick, activeSection }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    let scrollPosition = 0;
    const scrollSpeed = 0.5; // Pixels per frame
    let animationFrameId;

    const animate = () => {
      scrollPosition += scrollSpeed;
      
      // Reset position when we've scrolled one item width
      if (scrollPosition >= container.children[0].offsetWidth) {
        scrollPosition = 0;
      }
      
      // Apply the scroll position
      container.style.transform = `translateX(-${scrollPosition}px)`;
      
      animationFrameId = requestAnimationFrame(animate);
    };

    // Start the animation
    animate();

    // Pause animation on hover
    const handleMouseEnter = () => cancelAnimationFrame(animationFrameId);
    const handleMouseLeave = () => animate();

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <motion.section 
      id="category-section" 
      className="relative w-full py-20 overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Pattern */}
      <motion.div 
        className="absolute inset-0 opacity-40 dark:opacity-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1.2 }}
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10"
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <div className="h-full w-full">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-orange-500/5"
              initial={{
                scale: 0,
                rotate: 0,
                opacity: 0
              }}
              animate={{
                scale: 1,
                rotate: 360,
                opacity: 0.5
              }}
              transition={{
                duration: Math.random() * 2 + 1,
                delay: i * 0.2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              style={{
                width: `${Math.random() * 200 + 50}px`,
                height: `${Math.random() * 200 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Browse by{" "}
            <motion.span 
              className="text-orange-500"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Category
            </motion.span>
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Discover our extensive range of products and services
          </motion.p>
        </motion.div>

        {/* Categories Container */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Gradient Fade Edges */}
          <motion.div 
            className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-900 z-10"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          />
          <motion.div 
            className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent dark:from-gray-900 z-10"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          />

          {/* Scrolling Container */}
          <div className="overflow-hidden">
            <motion.div 
              ref={containerRef} 
              className="flex gap-8 py-10 transition-transform duration-1000 ease-linear"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {/* Duplicate categories for infinite scroll effect */}
              {[...categories, ...categories].map((category, index) => (
                <motion.div
                  key={`${category.id}-${index}`}
                  className="flex-none w-[240px] sm:w-[280px]"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  animate={{
                    scale: activeSection === (category.id === 1 ? 'raw' : category.id === 2 ? 'special' : 'request') ? 1.08 : 1
                  }}
                  whileHover={{ scale: activeSection === (category.id === 1 ? 'raw' : category.id === 2 ? 'special' : 'request') ? 1.12 : 1.03 }}
                >
                  <motion.div 
                    className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl overflow-hidden group shadow-lg dark:shadow-orange-500/10"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Circular Background */}
                    <motion.div 
                      className={`absolute -right-16 -top-16 w-52 h-52 rounded-full bg-gradient-to-br ${category.gradient}`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 0.8 }}
                      transition={{ duration: 0.5 }}
                    />
                    
                    {/* Content */}
                    <div                     className="relative p-4 sm:p-5 h-[320px] sm:h-[360px] flex flex-col">
                      {/* Icon */}
                      <motion.div 
                        className="mb-4 text-gray-800 dark:text-gray-100 z-10"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        whileHover={{ rotate: 360, scale: 1.1 }}
                      >
                        {category.icon}
                      </motion.div>
                      
                      {/* Text Content */}
                      <motion.div 
                        className="flex-1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <motion.h3 
                          className="relative z-10 mb-2 text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          {category.title}
                        </motion.h3>
                        <motion.p 
                          className="text-sm sm:text-base text-gray-600 dark:text-gray-300 z-10 relative"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                        >
                          {category.description}
                        </motion.p>
                      </motion.div>

                      {/* Circular Image */}
                      <motion.div 
                        className="absolute bottom-0 right-0 w-40 h-40 sm:w-48 sm:h-48 rounded-tl-full overflow-hidden"
                        initial={{ scale: 0, x: 100 }}
                        animate={{ scale: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      >
                        <motion.img
                          src={category.image}
                          alt={category.title}
                          className="w-full h-full object-cover transform scale-150 origin-top-left"
                          whileHover={{ scale: 1.7 }}
                          transition={{ duration: 0.4 }}
                        />
                      </motion.div>

                      {/* Action Button */}
                      <motion.button 
                        onClick={() => onCategoryClick(category.id === 1 ? 'raw' : category.id === 2 ? 'special' : 'request')}
                        className={`mt-3 sm:mt-5 px-4 sm:px-5 py-2 backdrop-blur-sm rounded-xl z-10 relative
                                 shadow-lg font-semibold text-sm sm:text-base
                                 ${activeSection === (category.id === 1 ? 'raw' : category.id === 2 ? 'special' : 'request')
                                   ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white dark:from-orange-600 dark:to-orange-700'
                                   : 'bg-white/80 text-gray-900 dark:bg-gray-700/50 dark:text-white hover:bg-orange-50 dark:hover:bg-orange-600/30'}`}
                        whileHover={{ scale: 1.03, boxShadow: "0 8px 20px rgba(0,0,0,0.1)" }}
                        whileTap={{ scale: 0.97 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.6 }}
                      >
                        {activeSection === (category.id === 1 ? 'raw' : category.id === 2 ? 'special' : 'request')
                          ? 'Selected'
                          : 'Explore Now'}
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default CategoryShowcase;
