import React from "react";
import { motion } from "framer-motion";
import DashboardSidebar from "../components/DashboardSidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64">
        <motion.div
          className="container mx-auto px-6 py-8 mt-16 lg:mt-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardLayout;
