import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  Bell,
  Check,
  X,
  Filter,
  MoreVertical,
  Archive,
  Star,
  ShoppingCart,
  Truck,
  MessageSquare,
  Settings,
} from "lucide-react";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const scaleOnHover = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "order",
      title: "New Order Received",
      message: "You have received a new order for Fresh Tomatoes (5kg)",
      time: "2 minutes ago",
      read: false,
      icon: ShoppingCart,
      color: "bg-green-500",
    },
    {
      id: 2,
      type: "delivery",
      title: "Order Shipped",
      message: "Your order #12345 has been shipped and is on the way",
      time: "1 hour ago",
      read: false,
      icon: Truck,
      color: "bg-blue-500",
    },
    {
      id: 3,
      type: "review",
      title: "New Review",
      message: "Someone left a 5-star review for your product",
      time: "3 hours ago",
      read: true,
      icon: Star,
      color: "bg-yellow-500",
    },
    {
      id: 4,
      type: "message",
      title: "New Message",
      message: "You have a new message from buyer about Wheat Seeds",
      time: "1 day ago",
      read: true,
      icon: MessageSquare,
      color: "bg-purple-500",
    },
    {
      id: 5,
      type: "system",
      title: "Profile Updated",
      message: "Your profile information has been successfully updated",
      time: "2 days ago",
      read: true,
      icon: Settings,
      color: "bg-gray-500",
    },
  ]);

  const [filter, setFilter] = useState("all");
  const [showActions, setShowActions] = useState(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
    return notification.type === filter;
  });

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const clearAllNotifications = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all notifications? This action cannot be undone."
      )
    ) {
      setNotifications([]);
    }
  };

  const getFilterOptions = () => [
    { value: "all", label: "All", count: notifications.length },
    { value: "unread", label: "Unread", count: unreadCount },
    {
      value: "order",
      label: "Orders",
      count: notifications.filter((n) => n.type === "order").length,
    },
    {
      value: "delivery",
      label: "Delivery",
      count: notifications.filter((n) => n.type === "delivery").length,
    },
    {
      value: "review",
      label: "Reviews",
      count: notifications.filter((n) => n.type === "review").length,
    },
    {
      value: "message",
      label: "Messages",
      count: notifications.filter((n) => n.type === "message").length,
    },
  ];

  return (
    <DashboardLayout>
      <motion.div
        className="space-y-6"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <motion.div
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Bell size={24} className="text-orange-500" />
            <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </motion.div>

          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <motion.button
                className="px-3 py-2 text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
                onClick={markAllAsRead}
                variants={fadeInUp}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Mark all as read
              </motion.button>
            )}
            <motion.button
              className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              onClick={clearAllNotifications}
              variants={fadeInUp}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear all
            </motion.button>
          </div>
        </div>

        {/* Filter Tabs */}
        <motion.div
          className="bg-white p-4 rounded-lg border border-gray-200"
          variants={fadeInUp}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center space-x-1 overflow-x-auto">
            {getFilterOptions().map((option) => (
              <motion.button
                key={option.value}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === option.value
                    ? "bg-orange-500 text-white"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                }`}
                onClick={() => setFilter(option.value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {option.label} ({option.count})
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Notifications List */}
        <motion.div
          className="space-y-3"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {filteredNotifications.map((notification, index) => {
            const IconComponent = notification.icon;
            return (
              <motion.div
                key={notification.id}
                className={`bg-white border rounded-lg p-4 hover:shadow-lg transition-all ${
                  !notification.read
                    ? "border-orange-200 bg-orange-50"
                    : "border-gray-200"
                }`}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
                {...scaleOnHover}
              >
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div
                    className={`p-2 rounded-lg ${notification.color} text-white flex-shrink-0`}
                  >
                    <IconComponent size={20} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3
                        className={`font-semibold ${
                          !notification.read ? "text-gray-900" : "text-gray-700"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {!notification.read && (
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        )}
                        <span className="text-xs text-gray-500">
                          {notification.time}
                        </span>
                        <div className="relative">
                          <motion.button
                            className="p-1 text-gray-400 hover:text-gray-600 rounded"
                            onClick={() =>
                              setShowActions(
                                showActions === notification.id
                                  ? null
                                  : notification.id
                              )
                            }
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <MoreVertical size={16} />
                          </motion.button>

                          <AnimatePresence>
                            {showActions === notification.id && (
                              <motion.div
                                className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 min-w-[150px]"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                              >
                                {!notification.read && (
                                  <button
                                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                    onClick={() => {
                                      markAsRead(notification.id);
                                      setShowActions(null);
                                    }}
                                  >
                                    <Check size={14} />
                                    <span>Mark as read</span>
                                  </button>
                                )}
                                <button
                                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                  onClick={() => {
                                    deleteNotification(notification.id);
                                    setShowActions(null);
                                  }}
                                >
                                  <X size={14} />
                                  <span>Delete</span>
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                    <p
                      className={`text-sm ${
                        !notification.read ? "text-gray-800" : "text-gray-600"
                      }`}
                    >
                      {notification.message}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {filteredNotifications.length === 0 && (
            <motion.div
              className="text-center py-12 bg-white rounded-lg border border-gray-200"
              variants={fadeInUp}
            >
              <Bell size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">
                {filter === "all"
                  ? "No notifications yet."
                  : `No ${filter} notifications found.`}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Click outside to close actions */}
        {showActions && (
          <div
            className="fixed inset-0 z-5"
            onClick={() => setShowActions(null)}
          />
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default Notifications;
