const Notification = require("../models/Notification.model");
const jwt = require("jsonwebtoken");

class NotificationSocketHandler {
  constructor(io) {
    this.io = io;
    this.connectedUsers = new Map(); // userId -> socketId mapping
    this.userSockets = new Map(); // socketId -> user data mapping

    this.setupSocketHandlers();
  }

  setupSocketHandlers() {
    this.io.on("connection", (socket) => {
      console.log("🔌 New socket connection:", socket.id);

      // Handle user authentication and registration
      socket.on("auth", async (data) => {
        try {
          const { token } = data;

          if (!token) {
            socket.emit("auth_error", { message: "No token provided" });
            return;
          }

          // Verify JWT token
          const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
          const userId = decoded._id;

          // Store user connection
          this.connectedUsers.set(userId, socket.id);
          this.userSockets.set(socket.id, { userId, token });

          // Join user to their personal notification room
          socket.join(`user_${userId}`);

          console.log(
            `✅ User ${userId} authenticated and joined notification room`
          );

          // Send authentication success
          socket.emit("auth_success", {
            message: "Successfully connected to notifications",
            userId,
          });

          // Send notification summary
          await this.sendNotificationSummary(userId);
        } catch (error) {
          console.error("❌ Authentication error:", error);
          socket.emit("auth_error", { message: "Invalid token" });
        }
      });

      // Handle marking notification as read
      socket.on("mark_notification_read", async (data) => {
        try {
          const userData = this.userSockets.get(socket.id);
          if (!userData) {
            socket.emit("error", { message: "Not authenticated" });
            return;
          }

          const { notificationId } = data;

          await Notification.findByIdAndUpdate(notificationId, {
            isRead: true,
            readAt: new Date(),
          });

          // Broadcast updated notification to user
          socket.emit("notification_updated", {
            notificationId,
            isRead: true,
            readAt: new Date(),
          });

          // Send updated summary
          await this.sendNotificationSummary(userData.userId);
        } catch (error) {
          console.error("❌ Error marking notification as read:", error);
          socket.emit("error", {
            message: "Failed to mark notification as read",
          });
        }
      });

      // Handle marking all notifications as read
      socket.on("mark_all_notifications_read", async () => {
        try {
          const userData = this.userSockets.get(socket.id);
          if (!userData) {
            socket.emit("error", { message: "Not authenticated" });
            return;
          }

          await Notification.markAllAsRead(userData.userId);

          // Notify user that all notifications are read
          socket.emit("all_notifications_read");

          // Send updated summary
          await this.sendNotificationSummary(userData.userId);
        } catch (error) {
          console.error("❌ Error marking all notifications as read:", error);
          socket.emit("error", {
            message: "Failed to mark all notifications as read",
          });
        }
      });

      // Handle getting notification summary
      socket.on("get_notification_summary", async () => {
        try {
          const userData = this.userSockets.get(socket.id);
          if (!userData) {
            socket.emit("error", { message: "Not authenticated" });
            return;
          }

          await this.sendNotificationSummary(userData.userId);
        } catch (error) {
          console.error("❌ Error getting notification summary:", error);
        }
      });

      // Handle test notifications (for development/testing)
      socket.on("test_notification", (notification) => {
        try {
          const userData = this.userSockets.get(socket.id);
          if (!userData) {
            socket.emit("error", { message: "Not authenticated" });
            return;
          }

          console.log("🧪 Test notification received:", notification);

          // Echo the test notification back to the same user
          socket.emit("new_notification", {
            ...notification,
            priorityColor: this.getPriorityColor(notification.priority),
            typeIcon: this.getTypeIcon(notification.type),
          });
        } catch (error) {
          console.error("❌ Error handling test notification:", error);
        }
      });

      // Handle socket disconnection
      socket.on("disconnect", () => {
        console.log("🔌 Socket disconnected:", socket.id);

        const userData = this.userSockets.get(socket.id);
        if (userData) {
          this.connectedUsers.delete(userData.userId);
          this.userSockets.delete(socket.id);
          console.log(
            `❌ User ${userData.userId} disconnected from notifications`
          );
        }
      });
    });
  }

  // Send notification summary to a specific user
  async sendNotificationSummary(userId) {
    try {
      const summary = await Notification.getUserNotificationSummary(userId);
      const socketId = this.connectedUsers.get(userId);

      if (socketId) {
        this.io.to(socketId).emit("notification_summary", summary);
      }
    } catch (error) {
      console.error("❌ Error sending notification summary:", error);
    }
  }

  // Send real-time notification to a specific user
  async sendNotificationToUser(userId, notificationData) {
    try {
      console.log(
        `📢 Sending notification to user ${userId}:`,
        notificationData.title
      );

      // Send to user's notification room
      this.io.to(`user_${userId}`).emit("new_notification", {
        ...notificationData,
        timeAgo: "Just now",
        priorityColor: this.getPriorityColor(notificationData.priority),
        typeIcon: this.getTypeIcon(notificationData.type),
      });

      // Update notification summary
      await this.sendNotificationSummary(userId);
    } catch (error) {
      console.error("❌ Error sending notification to user:", error);
    }
  }

  // Send notification to multiple users
  async sendNotificationToUsers(userIds, notificationData) {
    const promises = userIds.map((userId) =>
      this.sendNotificationToUser(userId, notificationData)
    );
    await Promise.all(promises);
  }

  // Broadcast system-wide notification
  async broadcastSystemNotification(notificationData) {
    try {
      console.log(
        "📢 Broadcasting system notification:",
        notificationData.title
      );

      this.io.emit("system_notification", {
        ...notificationData,
        timeAgo: "Just now",
        priorityColor: this.getPriorityColor(notificationData.priority),
        typeIcon: this.getTypeIcon(notificationData.type),
      });
    } catch (error) {
      console.error("❌ Error broadcasting system notification:", error);
    }
  }

  // Helper method to get priority color
  getPriorityColor(priority) {
    const colors = {
      low: "bg-blue-500",
      medium: "bg-yellow-500",
      high: "bg-orange-500",
      urgent: "bg-red-500",
    };
    return colors[priority] || "bg-gray-500";
  }

  // Helper method to get type icon
  getTypeIcon(type) {
    const icons = {
      order_placed: "ShoppingCart",
      order_confirmed: "CheckCircle",
      order_shipped: "Truck",
      order_completed: "Package",
      material_request_response: "MessageSquare",
      material_request_accepted: "ThumbsUp",
      sample_request: "TestTube",
      sample_approved: "Check",
      review_received: "Star",
      payment_received: "DollarSign",
      system_announcement: "Megaphone",
      promotion: "Gift",
    };
    return icons[type] || "Bell";
  }

  // Get connected user count
  getConnectedUserCount() {
    return this.connectedUsers.size;
  }

  // Get specific user's socket ID
  getUserSocketId(userId) {
    return this.connectedUsers.get(userId);
  }

  // Check if user is connected
  isUserConnected(userId) {
    return this.connectedUsers.has(userId);
  }

  // Cleanup method for graceful shutdown
  cleanup() {
    console.log("🧹 Cleaning up notification socket connections...");
    this.connectedUsers.clear();
    this.userSockets.clear();
  }
}

module.exports = NotificationSocketHandler;
