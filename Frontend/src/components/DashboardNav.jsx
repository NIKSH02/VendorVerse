import React from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  User,
  Package,
  ShoppingCart,
  ShoppingBag,
  Star,
  Bell,
  ArrowLeft,
} from "lucide-react";

const DashboardNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      path: "/dashboard/profile",
      label: "Profile",
      icon: User,
      description: "Manage your account and financial overview",
    },
    {
      path: "/dashboard/listings",
      label: "My Listings",
      icon: Package,
      description: "Manage your product listings",
    },
    {
      path: "/dashboard/orders-to-fulfill",
      label: "Orders to Fulfill",
      icon: ShoppingCart,
      description: "Orders you need to process",
    },
    {
      path: "/dashboard/orders-placed",
      label: "Orders Placed",
      icon: ShoppingBag,
      description: "Orders you have placed",
    },
    {
      path: "/dashboard/reviews",
      label: "Reviews",
      icon: Star,
      description: "Manage your reviews",
    },
    {
      path: "/dashboard/notifications",
      label: "Notifications",
      icon: Bell,
      description: "Stay updated with alerts",
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.div
      className="bg-white border-b border-gray-200 px-6 py-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <motion.button
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          onClick={() => navigate("/")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </motion.button>

        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
      </div>

      <div className="flex space-x-1 overflow-x-auto pb-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <motion.button
              key={item.path}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                isActive(item.path)
                  ? "bg-orange-500 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
              onClick={() => navigate(item.path)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={item.description}
            >
              <IconComponent size={18} />
              <span>{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default DashboardNav;
