import apiClient from "../api/axios";

// =============================================================================
// NOTIFICATIONS API
// =============================================================================
export const notificationsAPI = {
  // Get user notifications
  getUserNotifications: async (filters = {}) => {
    try {
      const response = await apiClient.get("/notifications", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await apiClient.patch(
        `/notifications/${notificationId}/read`
      );
      return response.data;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await apiClient.patch("/notifications/read-all");
      return response.data;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    try {
      const response = await apiClient.delete(
        `/notifications/${notificationId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  },

  // Clear all notifications
  clearAllNotifications: async () => {
    try {
      const response = await apiClient.delete("/notifications/clear-all");
      return response.data;
    } catch (error) {
      console.error("Error clearing all notifications:", error);
      throw error;
    }
  },

  // Get unread notifications count
  getUnreadCount: async () => {
    try {
      const response = await apiClient.get("/notifications/unread-count");
      return response.data;
    } catch (error) {
      console.error("Error fetching unread count:", error);
      throw error;
    }
  },

  // Get notification preferences
  getNotificationPreferences: async () => {
    try {
      const response = await apiClient.get("/notifications/preferences");
      return response.data;
    } catch (error) {
      console.error("Error fetching notification preferences:", error);
      throw error;
    }
  },

  // Update notification preferences
  updateNotificationPreferences: async (preferences) => {
    try {
      const response = await apiClient.put(
        "/notifications/preferences",
        preferences
      );
      return response.data;
    } catch (error) {
      console.error("Error updating notification preferences:", error);
      throw error;
    }
  },

  // Send notification (admin/system use)
  sendNotification: async (notificationData) => {
    try {
      const response = await apiClient.post(
        "/notifications/send",
        notificationData
      );
      return response.data;
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  },

  // Subscribe to push notifications
  subscribeToPush: async (subscription) => {
    try {
      const response = await apiClient.post(
        "/notifications/subscribe",
        subscription
      );
      return response.data;
    } catch (error) {
      console.error("Error subscribing to push notifications:", error);
      throw error;
    }
  },

  // Unsubscribe from push notifications
  unsubscribeFromPush: async () => {
    try {
      const response = await apiClient.delete("/notifications/unsubscribe");
      return response.data;
    } catch (error) {
      console.error("Error unsubscribing from push notifications:", error);
      throw error;
    }
  },
};

export default notificationsAPI;
