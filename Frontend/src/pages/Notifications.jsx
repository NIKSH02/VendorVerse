import React, { useState, useEffect } from "react";
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
  RefreshCw,
  Wifi,
  WifiOff,
  Ban,
} from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import { ordersAPI } from "../services/ordersAPI";
import toast from "react-hot-toast";

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
  const {
    notifications,
    notificationSummary,
    isConnected,
    loading,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    loadNotifications,
    deleteNotification: contextDeleteNotification,
    clearAllNotifications: contextClearAllNotifications,
    unreadCount,
  } = useNotifications();

  const [filter, setFilter] = useState("all");
  const [showActions, setShowActions] = useState(null);
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);
  const [temporarilyCleared, setTemporarilyCleared] = useState(false);

  // Load initial notifications from API
  useEffect(() => {
    const loadInitialNotifications = async () => {
      try {
        await loadNotifications({ page: 1, limit: 20 });
        setHasLoadedInitial(true);
      } catch (error) {
        console.error("Error loading initial notifications:", error);
        toast.error("Failed to load notifications");
      }
    };

    if (!hasLoadedInitial) {
      loadInitialNotifications();
    }
  }, [loadNotifications, hasLoadedInitial]);

  const filteredNotifications = temporarilyCleared
    ? []
    : notifications.filter((notification) => {
        if (filter === "all") return true;
        if (filter === "unread") return !notification.isRead;

        // Special handling for review filter
        if (filter === "review") {
          return notification.type === "review_received";
        }

        // Check for exact type match or category match
        return notification.type === filter || notification.category === filter;
      });

  const handleMarkAsRead = (notification) => {
    if (!notification.isRead) {
      markNotificationAsRead(notification._id);
    }
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
    toast.success("All notifications marked as read");
  };

  const deleteNotification = async (id) => {
    try {
      await contextDeleteNotification(id);
      toast.success("Notification deleted");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const clearAllNotifications = async () => {
    if (
      window.confirm(
        "Are you sure you want to temporarily clear all notifications from view? They will reappear when you refresh or reload the page."
      )
    ) {
      setTemporarilyCleared(true);
      toast.success("All notifications cleared from view");
    }
  };

  const cancelOrder = async (orderId, reason = "") => {
    try {
      await ordersAPI.cancelOrder(orderId, reason);
      toast.success("Order cancelled successfully");
      // Refresh notifications to show cancellation notification
      await loadNotifications({ page: 1, limit: 20 });
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error(error.response?.data?.message || "Failed to cancel order");
    }
  };

  const refreshNotifications = async () => {
    try {
      setTemporarilyCleared(false); // Reset temporary clear state
      await loadNotifications({ page: 1, limit: 20 });
      toast.success("Notifications refreshed");
    } catch (error) {
      toast.error("Failed to refresh notifications");
    }
  };

  const getFilterOptions = () => [
    {
      value: "all",
      label: "All",
      count: temporarilyCleared ? 0 : notifications.length,
    },
    {
      value: "unread",
      label: "Unread",
      count: temporarilyCleared ? 0 : unreadCount,
    },
    {
      value: "order",
      label: "Orders",
      count: temporarilyCleared
        ? 0
        : notifications.filter((n) => n.category === "order").length,
    },
    {
      value: "delivery",
      label: "Delivery",
      count: temporarilyCleared
        ? 0
        : notifications.filter((n) => n.type === "order_shipped").length,
    },
    {
      value: "review",
      label: "Reviews",
      count: temporarilyCleared
        ? 0
        : notifications.filter((n) => n.type === "review_received").length,
    },
    {
      value: "message",
      label: "Messages",
      count: temporarilyCleared
        ? 0
        : notifications.filter((n) => n.category === "social").length,
    },
  ];

  const getNotificationIcon = (type) => {
    const iconMap = {
      order_placed: ShoppingCart,
      order_confirmed: Check,
      order_shipped: Truck,
      order_completed: Archive,
      review_received: Star,
      material_request_response: MessageSquare,
      system_announcement: Settings,
      payment_received: Star,
    };
    return iconMap[type] || Bell;
  };

  const getNotificationColor = (notification) => {
    if (notification.priority === "urgent") return "bg-red-500";
    if (notification.priority === "high") return "bg-orange-500";
    if (notification.priority === "medium") return "bg-yellow-500";
    return "bg-blue-500";
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInSeconds = Math.floor((now - notificationDate) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

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
            <div className="flex items-center space-x-2">
              <Bell size={24} className="text-orange-500" />
              {isConnected ? (
                <Wifi size={16} className="text-green-500" title="Connected" />
              ) : (
                <WifiOff
                  size={16}
                  className="text-red-500"
                  title="Disconnected"
                />
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </motion.div>

          <div className="flex items-center space-x-2">
            <motion.button
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={refreshNotifications}
              variants={fadeInUp}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Refresh notifications"
            >
              <RefreshCw size={18} />
            </motion.button>
            {unreadCount > 0 && (
              <motion.button
                className="px-3 py-2 text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
                onClick={handleMarkAllAsRead}
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
              {temporarilyCleared ? "Cleared from view" : "Clear all"}
            </motion.button>
            {temporarilyCleared && (
              <motion.button
                className="px-3 py-2 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                onClick={() => {
                  setTemporarilyCleared(false);
                  toast.success("Notifications restored");
                }}
                variants={fadeInUp}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Restore all
              </motion.button>
            )}
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
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <span className="ml-2 text-gray-600">
                Loading notifications...
              </span>
            </div>
          )}

          {!loading &&
            filteredNotifications.map((notification, index) => {
              const IconComponent = getNotificationIcon(notification.type);
              const timeAgo =
                notification.timeAgo || formatTimeAgo(notification.createdAt);

              return (
                <motion.div
                  key={notification._id}
                  className={`bg-white border rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer ${
                    !notification.isRead
                      ? "border-orange-200 bg-orange-50"
                      : "border-gray-200"
                  }`}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  {...scaleOnHover}
                  onClick={() => handleMarkAsRead(notification)}
                >
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div
                      className={`p-2 rounded-lg ${getNotificationColor(
                        notification
                      )} text-white flex-shrink-0`}
                    >
                      <IconComponent size={20} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3
                          className={`font-semibold ${
                            !notification.isRead
                              ? "text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {notification.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          )}
                          <span className="text-xs text-gray-500">
                            {timeAgo}
                          </span>
                          <div className="relative">
                            <motion.button
                              className="p-1 text-gray-400 hover:text-gray-600 rounded"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowActions(
                                  showActions === notification._id
                                    ? null
                                    : notification._id
                                );
                              }}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <MoreVertical size={16} />
                            </motion.button>

                            <AnimatePresence>
                              {showActions === notification._id && (
                                <motion.div
                                  className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 min-w-[150px]"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                >
                                  {!notification.isRead && (
                                    <button
                                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleMarkAsRead(notification);
                                        setShowActions(null);
                                      }}
                                    >
                                      <Check size={14} />
                                      <span>Mark as read</span>
                                    </button>
                                  )}

                                  {/* Cancel Order Option - only for order notifications placed by current user */}
                                  {(notification.type === "order_placed" ||
                                    notification.type === "order_confirmed") &&
                                    notification.data?.orderId && (
                                      <button
                                        className="w-full px-3 py-2 text-left text-sm text-orange-600 hover:bg-orange-50 flex items-center space-x-2"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const reason = prompt(
                                            "Please provide a reason for cancellation (optional):"
                                          );
                                          if (reason !== null) {
                                            // User didn't click cancel
                                            cancelOrder(
                                              notification.data.orderId,
                                              reason
                                            );
                                          }
                                          setShowActions(null);
                                        }}
                                      >
                                        <Ban size={14} />
                                        <span>Cancel Order</span>
                                      </button>
                                    )}

                                  <button
                                    className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteNotification(notification._id);
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
                          !notification.isRead
                            ? "text-gray-800"
                            : "text-gray-600"
                        }`}
                      >
                        {notification.message}
                      </p>

                      {/* Show priority indicator for high/urgent notifications */}
                      {(notification.priority === "high" ||
                        notification.priority === "urgent") && (
                        <div
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                            notification.priority === "urgent"
                              ? "bg-red-100 text-red-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {notification.priority === "urgent" ? "🚨" : "⚠️"}{" "}
                          {notification.priority.toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}

          {!loading && filteredNotifications.length === 0 && (
            <motion.div
              className="text-center py-12 bg-white rounded-lg border border-gray-200"
              variants={fadeInUp}
            >
              <Bell size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">
                {temporarilyCleared
                  ? "All notifications have been temporarily cleared from view."
                  : filter === "all"
                  ? isConnected
                    ? "No notifications yet. You'll see them here when they arrive!"
                    : "Unable to load notifications. Check your connection."
                  : `No ${filter} notifications found.`}
              </p>
              {temporarilyCleared ? (
                <button
                  onClick={() => {
                    setTemporarilyCleared(false);
                    toast.success("Notifications restored");
                  }}
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Restore Notifications
                </button>
              ) : !isConnected ? (
                <button
                  onClick={refreshNotifications}
                  className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Retry Connection
                </button>
              ) : null}
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
