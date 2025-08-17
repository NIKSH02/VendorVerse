import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Package,
  User,
  Minimize2,
  Maximize2,
  ExternalLink,
} from "lucide-react";
import { useOrderChat } from "../context/OrderChatContext";
import { useAuth } from "../context/AuthContext";
import { useOrderChatNavigation } from "../utils/orderChatUtils";
import toast from "react-hot-toast";

const OrderChatModal = ({ orderId, orderData, isOpen, onClose }) => {
  const { user } = useAuth();
  const { goToOrderChat } = useOrderChatNavigation();
  const {
    joinOrderChat,
    leaveOrderChat,
    sendMessage,
    sendTypingIndicator,
    loadChatMessages,
    getMessagesForOrder,
    getTypingUser,
    clearUnreadCount,
    isConnected,
  } = useOrderChat();

  const [message, setMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const messages = getMessagesForOrder(orderId);
  const typingUser = getTypingUser(orderId);

  // Determine user type and other party info
  const currentUserId = user?._id || user?.id;
  const userType =
    orderData?.buyerId?._id === currentUserId ? "buyer" : "seller";
  const otherParty =
    userType === "buyer" ? orderData?.sellerId : orderData?.buyerId;

  // Join chat when modal opens
  useEffect(() => {
    if (isOpen && orderId && user) {
      joinOrderChat(orderId);
      loadChatMessages(orderId);
      clearUnreadCount(orderId);

      return () => {
        leaveOrderChat(orderId);
      };
    }
  }, [isOpen, orderId, user]);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle sending message
  const handleSendMessage = () => {
    if (!message.trim() || !isConnected) return;

    sendMessage(orderId, message);
    setMessage("");
  };

  // Handle typing
  const handleTyping = (e) => {
    setMessage(e.target.value);

    // Send typing indicator
    sendTypingIndicator(orderId, true);

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingIndicator(orderId, false);
    }, 1000);
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0  bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <motion.div
          className={`bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col ${
            isMinimized ? "h-16" : "h-96"
          } transition-all duration-300`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-orange-50 rounded-t-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <MessageCircle size={16} className="text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Order Chat</h3>
                <p className="text-xs text-gray-600">
                  {userType === "buyer" ? "with Seller" : "with Buyer"}:{" "}
                  {otherParty?.name || otherParty?.username}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => {
                  goToOrderChat(orderId);
                  onClose();
                }}
                className="p-1 hover:bg-orange-200 rounded transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Open in full screen"
              >
                <ExternalLink size={16} />
              </motion.button>
              <motion.button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-orange-200 rounded transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isMinimized ? (
                  <Maximize2 size={16} />
                ) : (
                  <Minimize2 size={16} />
                )}
              </motion.button>
              <motion.button
                onClick={onClose}
                className="p-1 hover:bg-orange-200 rounded transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={16} />
              </motion.button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Order Info */}
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <Package size={14} className="text-gray-500" />
                  <span className="text-sm text-gray-700">
                    {orderData?.itemName} - {orderData?.quantity}{" "}
                    {orderData?.unit}
                  </span>
                  <span className="text-xs text-gray-500">
                    ₹{orderData?.totalPrice}
                  </span>
                </div>
              </div>

              {/* Connection Status */}
              {!isConnected && (
                <div className="px-4 py-2 bg-red-50 border-b border-red-200">
                  <p className="text-sm text-red-600">
                    Disconnected - Reconnecting...
                  </p>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {isLoading ? (
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500 text-sm">
                      <MessageCircle
                        size={32}
                        className="mx-auto mb-2 text-gray-400"
                      />
                      <p>No messages yet</p>
                      <p className="text-xs">Start the conversation!</p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isOwn = msg.senderId === currentUserId;
                    const prevMsg = messages[index - 1];
                    const nextMsg = messages[index + 1];
                    const isFirstInGroup =
                      !prevMsg || prevMsg.senderId !== msg.senderId;
                    const isLastInGroup =
                      !nextMsg || nextMsg.senderId !== msg.senderId;

                    console.log(
                      "Message:",
                      msg,
                      "IsOwn:",
                      isOwn,
                      "CurrentUserId:",
                      currentUserId
                    );
                    return (
                      <motion.div
                        key={msg._id || index}
                        className={`flex ${isLastInGroup ? "mb-3" : "mb-1"} ${
                          isOwn ? "justify-end" : "justify-start"
                        }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div
                          className={`max-w-xs px-3 py-2 text-sm relative ${
                            isOwn
                              ? `bg-blue-500 text-white shadow-md ${
                                  isFirstInGroup
                                    ? "rounded-t-lg"
                                    : "rounded-t-sm"
                                } ${
                                  isLastInGroup
                                    ? "rounded-bl-lg rounded-br-none"
                                    : "rounded-b-sm"
                                }`
                              : `bg-white text-gray-800 border shadow-sm ${
                                  isFirstInGroup
                                    ? "rounded-t-lg"
                                    : "rounded-t-sm"
                                } ${
                                  isLastInGroup
                                    ? "rounded-br-lg rounded-bl-none"
                                    : "rounded-b-sm"
                                }`
                          }`}
                        >
                          {/* Sender name for non-own messages (only show on first message in group) */}
                          {!isOwn && isFirstInGroup && (
                            <p className="text-xs font-semibold text-blue-600 mb-1">
                              {msg.senderName}
                            </p>
                          )}
                          <p className="break-words leading-relaxed">
                            {msg.message}
                          </p>
                          {/* Timestamp (only show on last message in group) */}
                          {isLastInGroup && (
                            <div
                              className={`flex items-center justify-between mt-1 ${
                                isOwn ? "text-blue-100" : "text-gray-500"
                              }`}
                            >
                              <p className="text-xs">
                                {new Date(msg.timestamp).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </p>
                              {isOwn && <div className="text-xs ml-2">✓</div>}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}

                {/* Typing Indicator */}
                {typingUser && (
                  <motion.div
                    className="flex justify-start mb-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="bg-white border shadow-sm px-3 py-2 rounded-t-lg rounded-br-lg rounded-bl-none">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {typingUser.senderName} is typing...
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={handleTyping}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    disabled={!isConnected}
                  />
                  <motion.button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || !isConnected}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      message.trim() && isConnected
                        ? "bg-orange-500 hover:bg-orange-600 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    whileHover={{
                      scale: message.trim() && isConnected ? 1.05 : 1,
                    }}
                    whileTap={{
                      scale: message.trim() && isConnected ? 0.95 : 1,
                    }}
                  >
                    <Send size={16} />
                  </motion.button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OrderChatModal;
