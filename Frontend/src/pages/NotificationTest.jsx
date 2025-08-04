import React from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../layouts/DashboardLayout";
import { useNotifications } from "../context/NotificationContext";
import { Bell, Send, TestTube, Gift, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

const NotificationTest = () => {
  const { socket, isConnected } = useNotifications();

  const sendTestNotification = (type) => {
    if (!socket || !isConnected) {
      toast.error("Not connected to notification server");
      return;
    }

    // This would typically be done from the backend, but for testing purposes
    const testNotifications = {
      order: {
        type: "order_placed",
        title: "Test Order Received",
        message: "You have received a test order for Fresh Tomatoes (5kg)",
        priority: "high",
        category: "order",
      },
      review: {
        type: "review_received",
        title: "Test Review",
        message: "Someone left a test 5-star review for your product",
        priority: "low",
        category: "social",
      },
      system: {
        type: "system_announcement",
        title: "Test System Announcement",
        message: "This is a test system announcement to all users",
        priority: "medium",
        category: "system",
      },
      urgent: {
        type: "payment_received",
        title: "Test Urgent Notification",
        message: "This is a test urgent notification",
        priority: "urgent",
        category: "payment",
      },
    };

    // Simulate receiving a notification (in real app, this comes from backend)
    const notification = {
      _id: "test-" + Date.now(),
      ...testNotifications[type],
      createdAt: new Date(),
      isRead: false,
      timeAgo: "Just now",
    };

    // Manually trigger the notification event for testing
    socket.emit("test_notification", notification);
    toast.success(`Sent test ${type} notification!`);
  };

  return (
    <DashboardLayout>
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-3">
          <TestTube size={24} className="text-orange-500" />
          <h1 className="text-2xl font-bold text-gray-800">
            Notification Testing
          </h1>
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span className="text-sm text-gray-600">
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Test Real-time Notifications
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.button
              onClick={() => sendTestNotification("order")}
              className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!isConnected}
            >
              <div className="p-2 bg-green-500 text-white rounded-lg">
                <Send size={20} />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-gray-800">
                  Order Notification
                </h3>
                <p className="text-sm text-gray-600">
                  Test order received notification
                </p>
              </div>
            </motion.button>

            <motion.button
              onClick={() => sendTestNotification("review")}
              className="flex items-center space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!isConnected}
            >
              <div className="p-2 bg-yellow-500 text-white rounded-lg">
                <Bell size={20} />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-gray-800">
                  Review Notification
                </h3>
                <p className="text-sm text-gray-600">
                  Test review received notification
                </p>
              </div>
            </motion.button>

            <motion.button
              onClick={() => sendTestNotification("system")}
              className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!isConnected}
            >
              <div className="p-2 bg-blue-500 text-white rounded-lg">
                <MessageSquare size={20} />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-gray-800">
                  System Announcement
                </h3>
                <p className="text-sm text-gray-600">
                  Test system notification
                </p>
              </div>
            </motion.button>

            <motion.button
              onClick={() => sendTestNotification("urgent")}
              className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!isConnected}
            >
              <div className="p-2 bg-red-500 text-white rounded-lg">
                <Gift size={20} />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-gray-800">
                  Urgent Notification
                </h3>
                <p className="text-sm text-gray-600">
                  Test urgent priority notification
                </p>
              </div>
            </motion.button>
          </div>

          {!isConnected && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">
                ⚠️ Not connected to notification server. Please check your
                connection and try refreshing the page.
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            How to Test
          </h2>
          <div className="space-y-3 text-sm text-gray-600">
            <p>1. Make sure you're connected (green dot above)</p>
            <p>2. Click any of the test buttons above</p>
            <p>3. You should see a toast notification appear</p>
            <p>4. Check the Notifications page to see the new notification</p>
            <p>5. Notice the notification badge in the sidebar</p>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default NotificationTest;
