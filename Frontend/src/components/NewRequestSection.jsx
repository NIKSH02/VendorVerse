import React from "react";
import { motion } from "framer-motion";

const requestItems = [
  { 
    name: "Premium Onions",
    detail: "Premium Quality Red Onions",
    time: "2 min ago",
    quantity: "20 KG",
    location: "Chandni Chowk",
    urgency: "High"
  },
  { 
    name: "Fresh Tomatoes",
    detail: "Farm Fresh Tomatoes",
    time: "5 min ago",
    quantity: "50 KG",
    location: "Karol Bagh",
    urgency: "Medium"
  },
  { 
    name: "Pure Paneer",
    detail: "Fresh & Pure Daily",
    time: "10 min ago",
    quantity: "30 KG",
    location: "Lajpat Nagar",
    urgency: "Low"
  }
];

const requestStyles = [
  { bg: "from-orange-400 to-red-500", accent: "text-orange-500", icon: "🌾" },
  { bg: "from-amber-400 to-orange-500", accent: "text-amber-500", icon: "🥬" },
  { bg: "from-yellow-400 to-amber-500", accent: "text-yellow-600", icon: "🥕" }
];

export default function NewRequestSection() {
  return (
    <section className="w-full py-16 px-4 bg-[white]  transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Side Image */}
          <motion.div 
            className="lg:w-1/3 hidden lg:block"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="/farmer.png"
              alt="Farmer"
              className="w-full h-auto object-contain max-h-[600px]"
            />
          </motion.div>

          {/* Right Side Content */}
          <div className="lg:w-2/3 w-full">
            {/* Section Header */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Market<span className="text-[#ff9500]"> Requests</span>
              </h2>
              <p className="text-gray-600">Stay updated with the latest market demands</p>
            </motion.div>

            {/* Requests Card */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-[#ff9500] to-orange-600 p-6">
                <h3 className="text-xl text-white font-semibold">Recent Requests</h3>
              </div>

              {/* Requests List */}
              <div className="divide-y divide-gray-100">
                {requestItems.map((item, index) => (
                  <motion.div
                    key={index}
                    className="p-4 hover:bg-gray-50 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center gap-4">
                      {/* User Icon */}
                      <motion.div 
                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${requestStyles[index].bg} text-white flex items-center justify-center text-lg font-semibold shadow-lg`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                          delay: index * 0.1 
                        }}
                        whileHover={{ 
                          scale: 1.1,
                          rotate: 5,
                          transition: { duration: 0.2 }
                        }}
                      >
                        {item.name.charAt(0)}
                      </motion.div>

                      {/* Request Details */}
                      <motion.div 
                        className="flex-1 min-w-0"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <motion.h4 
                            className="text-base font-semibold text-gray-900 truncate"
                            whileHover={{ scale: 1.02 }}
                          >
                            {item.name}
                          </motion.h4>
                          <motion.span 
                            className={`text-sm ${requestStyles[index].accent}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
                          >
                            {item.time}
                          </motion.span>
                        </div>
                        <motion.div 
                          className="flex items-center gap-2 text-sm text-gray-500"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 + 0.4 }}
                        >
                          <span>{item.quantity}</span>
                          <span>•</span>
                          <span>{item.location}</span>
                          <motion.div 
                            className={`ml-2 px-2 py-0.5 rounded-full text-xs
                              ${item.urgency === 'High' ? 'bg-red-100 text-red-600' :
                                item.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                                'bg-green-100 text-green-600'}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {item.urgency}
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* View All Button */}
              <motion.div 
                className="p-4 bg-gray-50"
                whileHover={{ backgroundColor: 'rgba(255, 149, 0, 0.1)' }}
              >
                <motion.button 
                  className="w-full text-center text-[#ff9500] font-semibold hover:text-orange-600 transition-colors"
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.location.href = '/Global'}
                >
                  View All Requests
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
