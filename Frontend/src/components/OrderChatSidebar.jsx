import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Package,
  User,
  Minimize2,
  Maximize2,
  Info,
  Phone,
  VideoIcon,
} from "lucide-react";
import { useOrderChat } from "../context/OrderChatContext";
import { useAuth } from "../context/AuthContext";
import orderChatAPI from "../services/orderChatAPI";
import toast from "react-hot-toast";

const OrderChatSidebar = ({ orderId, isOpen, onClose }) => {
  const { user } = useAuth();
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
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showOrderInfo, setShowOrderInfo] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const messageInputRef = useRef(null);

  const messages = getMessagesForOrder(orderId);
  const typingUser = getTypingUser(orderId);

  // Determine user type and other party info
  const currentUserId = user?._id || user?.id;
  const userType =
    orderData?.buyerId?._id === currentUserId ? "buyer" : "seller";
  const otherParty =
    userType === "buyer" ? orderData?.sellerId : orderData?.buyerId;

  // Load order data and join chat
  useEffect(() => {
    const loadOrderData = async () => {
      if (!orderId || !isOpen) return;

      try {
        setIsLoading(true);
        const response = await orderChatAPI.getOrCreateOrderChat(orderId);
        if (response.success) {
          setOrderData(response.data);
        }
      } catch (error) {
        console.error("Error loading order data:", error);
        toast.error("Failed to load chat");
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && orderId && user) {
      loadOrderData();
      joinOrderChat(orderId);
      loadChatMessages(orderId);
      clearUnreadCount(orderId);
    }

    return () => {
      if (orderId && isOpen) {
        leaveOrderChat(orderId);
      }
    };
  }, [isOpen, orderId, user]);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (messageInputRef.current && isOpen && !isLoading && !isMinimized) {
      setTimeout(() => messageInputRef.current?.focus(), 100);
    }
  }, [isOpen, isLoading, isMinimized]);

  // Handle sending message
  const handleSendMessage = () => {
    if (!message.trim() || !isConnected) return;

    sendMessage(orderId, message);
    setMessage("");
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
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

    // Stop typing indicator after 1 second
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
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-25 z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed right-0 top-0 h-full bg-white shadow-2xl z-50 flex flex-col ${
              isMinimized ? "w-80" : "w-96"
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-white truncate">
                      {isLoading
                        ? "Loading..."
                        : otherParty?.name || otherParty?.username || "User"}
                    </h2>
                    <div className="flex items-center space-x-2 text-xs">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isConnected ? "bg-green-400" : "bg-red-400"
                        }`}
                      ></span>
                      <span className="text-blue-100">
                        {isConnected ? "Online" : "Offline"}
                      </span>
                      {typingUser && (
                        <span className="text-yellow-300 animate-pulse">
                          • typing...
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setShowOrderInfo(!showOrderInfo)}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                    title="Order Info"
                  >
                    <Info size={18} />
                  </button>
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                    title={isMinimized ? "Expand" : "Minimize"}
                  >
                    {isMinimized ? (
                      <Maximize2 size={18} />
                    ) : (
                      <Minimize2 size={18} />
                    )}
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                    title="Close"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Order Info Panel */}
                <AnimatePresence>
                  {showOrderInfo && orderData && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-blue-50 border-b border-blue-200 overflow-hidden"
                    >
                      <div className="p-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                            <Package size={20} className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 text-sm truncate">
                              {orderData?.orderId?.itemName || "Order"}
                            </h3>
                            <div className="text-xs text-gray-600 mt-1 space-y-1">
                              <div>
                                Qty: {orderData?.orderId?.quantity}{" "}
                                {orderData?.orderId?.unit}
                              </div>
                              <div className="flex items-center space-x-2">
                                <span>₹{orderData?.orderId?.totalPrice}</span>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs ${
                                    orderData?.orderId?.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : orderData?.orderId?.status ===
                                        "processing"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {orderData?.orderId?.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Connection Status */}
                {!isConnected && (
                  <div className="px-4 py-2 bg-red-50 border-b border-red-200">
                    <p className="text-sm text-red-600">
                      Disconnected - Reconnecting...
                    </p>
                  </div>
                )}

                {/* Messages Area */}
                <div
                  className="flex-1 overflow-y-auto p-4 space-y-1 bg-gray-50"
                  style={{ height: "calc(100vh - 200px)" }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-600">
                          Loading messages...
                        </p>
                      </div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-gray-500">
                        <Package
                          size={32}
                          className="mx-auto mb-3 text-gray-400"
                        />
                        <h3 className="text-sm font-medium mb-1">
                          Start your conversation
                        </h3>
                        <p className="text-xs">
                          Send a message about this order.
                        </p>
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

                      return (
                        <motion.div
                          key={msg._id || index}
                          className={`flex ${isLastInGroup ? "mb-3" : "mb-1"} ${
                            isOwn ? "justify-end" : "justify-start"
                          }`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <div
                            className={`max-w-xs px-3 py-2 text-xs relative ${
                              isOwn
                                ? `bg-blue-500 text-white shadow-sm ${
                                    isFirstInGroup
                                      ? "rounded-t-lg"
                                      : "rounded-t-sm"
                                  } ${
                                    isLastInGroup
                                      ? "rounded-bl-lg rounded-br-sm"
                                      : "rounded-b-sm"
                                  }`
                                : `bg-white text-gray-800 border shadow-sm ${
                                    isFirstInGroup
                                      ? "rounded-t-lg"
                                      : "rounded-t-sm"
                                  } ${
                                    isLastInGroup
                                      ? "rounded-br-lg rounded-bl-sm"
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
                                {isOwn && <div className="text-xs ml-1">✓</div>}
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
                      exit={{ opacity: 0 }}
                    >
                      <div className="bg-white border shadow-sm px-3 py-2 rounded-t-lg rounded-br-lg rounded-bl-sm">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">
                            typing...
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="border-t border-gray-200 p-3 bg-white">
                  <div className="flex items-end space-x-2">
                    <div className="flex-1">
                      <textarea
                        ref={messageInputRef}
                        value={message}
                        onChange={handleTyping}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        rows={1}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-20"
                        disabled={!isConnected}
                      />
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || !isConnected}
                      className="w-8 h-8 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Minimized State */}
            {isMinimized && (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center text-gray-500">
                  <User size={24} className="mx-auto mb-2" />
                  <p className="text-xs">Chat minimized</p>
                  {messages.length > 0 && (
                    <p className="text-xs text-blue-500 mt-1">
                      {messages.length} messages
                    </p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OrderChatSidebar;
