import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import {
  User,
  Package,
  ShoppingCart,
  ShoppingBag,
  Star,
  Bell,
  Home,
  LogOut,
  Menu,
  X,
  ArrowLeft,
} from "lucide-react";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const DashboardSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const navigationItems = [
    {
      id: "profile",
      path: "/dashboard/profile",
      label: "My Profile",
      icon: User,
      description: "Manage your account and financial overview",
    },
    {
      id: "myListings",
      path: "/dashboard/listings",
      label: "My Listings",
      icon: Package,
      description: "Manage your product listings",
    },
    {
      id: "ordersToFulfill",
      path: "/dashboard/orders-to-fulfill",
      label: "Orders to Fulfill",
      icon: ShoppingCart,
      description: "Orders you need to process",
    },
    {
      id: "ordersPlaced",
      path: "/dashboard/orders-placed",
      label: "Orders I Placed",
      icon: ShoppingBag,
      description: "Orders you have placed",
    },
    {
      id: "reviews",
      path: "/dashboard/reviews",
      label: "Reviews",
      icon: Star,
      description: "Manage your reviews",
    },
    {
      id: "notifications",
      path: "/dashboard/notifications",
      label: "Notifications",
      icon: Bell,
      description: "Stay updated with alerts",
    },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, navigate to auth page
      navigate("/auth");
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-white rounded-lg shadow-lg border border-gray-200"
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isMobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        initial={{ x: -250, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-200">
            <motion.div
              className="flex items-center space-x-3 mb-4"
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            >
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Home className="text-white" size={24} />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-800">
                  RawConnect
                </span>
                <p className="text-sm text-gray-500">Dashboard</p>
              </div>
            </motion.div>

            {/* Back to Home Button */}
            <motion.button
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
              onClick={() => navigate("/")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </motion.button>
          </div>

          {/* Navigation Menu */}
          <div className="flex-1 py-6">
            <nav className="px-4 space-y-2">
              {navigationItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileSidebarOpen(false); // Close mobile sidebar on selection
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left relative ${
                    isActive(item.path)
                      ? "bg-orange-100 text-orange-600 border-l-4 border-orange-500"
                      : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                  }`}
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  title={item.description}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                  {isActive(item.path) && (
                    <motion.div
                      className="absolute right-0 top-0 bottom-0 w-1 bg-orange-500 rounded-l"
                      layoutId="activeTab"
                    />
                  )}
                </motion.button>
              ))}
            </nav>
          </div>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-gray-200">
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-800">
                Welcome {user?.name || user?.username || "User"}
              </p>
              <p className="text-xs text-gray-500">
                {user?.email || "user@example.com"}
              </p>
              {user && user.isProfileComplete === true && (
                <p className="text-xs text-green-600 mt-1">
                  ✅ Profile completed
                </p>
              )}
              {user && user.isProfileComplete === false && (
                <p className="text-xs text-amber-600 mt-1">
                  ⚠️ Please complete your profile
                </p>
              )}
              {/* Debug info - remove this after testing */}
              {user && (
                <p className="text-xs text-gray-400 mt-1">
                  Profile Status: {String(user.isProfileComplete)}
                </p>
              )}
            </div>
            <motion.button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut size={18} />
              <span className="font-medium">Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default DashboardSidebar;
