import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationSummary, setNotificationSummary] = useState({
    totalNotifications: 0,
    unreadCount: 0,
    actionRequiredCount: 0,
    highPriorityCount: 0,
  });
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  // Socket connection setup
  useEffect(() => {
    if (!user || !token) {
      return;
    }

    console.log("🔔 Initializing notification socket connection...");

    // Determine base URL based on environment
    const USE_LOCAL_SERVER = import.meta.env.VITE_USE_LOCAL_SERVER === "true";
    const SOCKET_URL = USE_LOCAL_SERVER
      ? import.meta.env.VITE_LOCAL_API_URL?.replace("/api", "") ||
        "http://localhost:5001"
      : import.meta.env.VITE_HOSTED_API_URL?.replace("/api", "") ||
        "https://vendorverse-uzqz.onrender.com";

    // Create socket connection
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Connection event handlers
    newSocket.on("connect", () => {
      console.log("🔌 Connected to notification server");
      setIsConnected(true);

      // Authenticate with server
      newSocket.emit("auth", { token });
    });

    newSocket.on("disconnect", () => {
      console.log("🔌 Disconnected from notification server");
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
      setIsConnected(false);
    });

    // Authentication event handlers
    newSocket.on("auth_success", (data) => {
      console.log("✅ Notification authentication successful:", data);
      // Request initial notification summary
      newSocket.emit("get_notification_summary");
    });

    newSocket.on("auth_error", (error) => {
      console.error("❌ Notification authentication failed:", error);
      toast.error("Failed to connect to notifications");
    });

    // Notification event handlers
    newSocket.on("notification_summary", (summary) => {
      console.log("📊 Received notification summary:", summary);
      setNotificationSummary(summary);
    });

    newSocket.on("new_notification", (notification) => {
      console.log("🔔 New notification received:", notification);

      // Add to notifications list
      setNotifications((prev) => [notification, ...prev]);

      // Show toast notification
      toast(
        (t) => (
          <div className="flex items-start space-x-3">
            <div
              className={`p-2 rounded-lg ${notification.priorityColor} text-white flex-shrink-0`}
            >
              <div className="w-4 h-4">🔔</div>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{notification.title}</p>
              <p className="text-xs text-gray-600">{notification.message}</p>
            </div>
          </div>
        ),
        {
          duration: notification.priority === "urgent" ? 8000 : 4000,
          position: "top-right",
          style: {
            maxWidth: "400px",
          },
        }
      );
    });

    newSocket.on("notification_updated", (data) => {
      console.log("📝 Notification updated:", data);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === data.notificationId
            ? { ...notification, ...data }
            : notification
        )
      );
    });

    newSocket.on("all_notifications_read", () => {
      console.log("📖 All notifications marked as read");
      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
          readAt: new Date(),
        }))
      );
    });

    newSocket.on("system_notification", (notification) => {
      console.log("📢 System notification received:", notification);

      // Show prominent toast for system notifications
      toast(
        (t) => (
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-blue-500 text-white flex-shrink-0">
              <div className="w-4 h-4">📢</div>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{notification.title}</p>
              <p className="text-xs text-gray-600">{notification.message}</p>
            </div>
          </div>
        ),
        {
          duration: 6000,
          position: "top-center",
          style: {
            maxWidth: "500px",
            background: "#3B82F6",
            color: "white",
          },
        }
      );
    });

    newSocket.on("error", (error) => {
      console.error("❌ Socket error:", error);
      toast.error(error.message || "An error occurred");
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      console.log("🧹 Cleaning up notification socket...");
      newSocket.disconnect();
    };
  }, [user, token]);

  // Function to mark notification as read
  const markNotificationAsRead = useCallback(
    (notificationId) => {
      if (socket && isConnected) {
        socket.emit("mark_notification_read", { notificationId });
      }
    },
    [socket, isConnected]
  );

  // Function to mark all notifications as read
  const markAllNotificationsAsRead = useCallback(() => {
    if (socket && isConnected) {
      socket.emit("mark_all_notifications_read");
    }
  }, [socket, isConnected]);

  // Function to refresh notification summary
  const refreshNotificationSummary = useCallback(() => {
    if (socket && isConnected) {
      socket.emit("get_notification_summary");
    }
  }, [socket, isConnected]);

  // Function to load notifications from API (for pagination)
  const loadNotifications = useCallback(async (filters = {}) => {
    try {
      setLoading(true);

      // Import here to avoid circular dependency
      const { default: apiClient } = await import("../api/axios");

      const response = await apiClient.get("/notifications", {
        params: filters,
      });

      const fetchedNotifications = response.data?.data?.notifications || [];

      if (filters.page === 1) {
        // Replace notifications if it's the first page
        setNotifications(fetchedNotifications);
      } else {
        // Append notifications for pagination
        setNotifications((prev) => [...prev, ...fetchedNotifications]);
      }

      return response.data;
    } catch (error) {
      console.error("❌ Error loading notifications:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to delete notification
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      // Import here to avoid circular dependency
      const { notificationsAPI } = await import("../services/notificationsAPI");

      // Delete from backend
      await notificationsAPI.deleteNotification(notificationId);

      // Remove from local state
      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== notificationId)
      );

      // Update notification summary
      setNotificationSummary((prev) => ({
        ...prev,
        totalNotifications: Math.max(0, prev.totalNotifications - 1),
        unreadCount: Math.max(0, prev.unreadCount - 1), // Assume deleted notification was unread
      }));

      return true;
    } catch (error) {
      console.error("❌ Error deleting notification:", error);
      throw error;
    }
  }, []);

  // Function to clear all notifications
  const clearAllNotifications = useCallback(async () => {
    try {
      // Import here to avoid circular dependency
      const { notificationsAPI } = await import("../services/notificationsAPI");

      // Clear from backend
      await notificationsAPI.clearAllNotifications();

      // Clear local state
      setNotifications([]);

      // Reset notification summary
      setNotificationSummary({
        totalNotifications: 0,
        unreadCount: 0,
        actionRequiredCount: 0,
        highPriorityCount: 0,
      });

      return true;
    } catch (error) {
      console.error("❌ Error clearing notifications:", error);
      throw error;
    }
  }, []);

  const value = {
    socket,
    notifications,
    notificationSummary,
    isConnected,
    loading,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    refreshNotificationSummary,
    loadNotifications,
    deleteNotification,
    clearAllNotifications,
    unreadCount: notificationSummary.unreadCount,
    totalNotifications: notificationSummary.totalNotifications,
    actionRequiredCount: notificationSummary.actionRequiredCount,
    highPriorityCount: notificationSummary.highPriorityCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
