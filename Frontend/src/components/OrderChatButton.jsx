import React from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useOrderChat } from "../context/OrderChatContext";

const OrderChatButton = ({ order, onClick, className = "" }) => {
  const { getUnreadCount } = useOrderChat();
  const unreadCount = getUnreadCount(order._id);

  // Only show chat button for confirmed or later status orders
  const canChat = [
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "completed",
  ].includes(order.status);

  if (!canChat) return null;

  return (
    <motion.button
      onClick={() => onClick(order)}
      className={`relative flex items-center space-x-2 px-3 py-2 text-blue-600 hover:text-blue-800 border border-blue-300 hover:border-blue-400 rounded-lg transition-colors ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title="Chat with the other party"
    >
      <MessageCircle size={16} />
      <span className="text-sm">Chat</span>

      {/* Unread count badge */}
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </motion.button>
  );
};

export default OrderChatButton;
