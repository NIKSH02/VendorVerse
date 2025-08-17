import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Send,
  Package,
  User,
  Phone,
  VideoIcon,
  MoreVertical,
  Info,
} from "lucide-react";
import { useOrderChat } from "../context/OrderChatContext";
import { useAuth } from "../context/AuthContext";
import orderChatAPI from "../services/orderChatAPI";
import toast from "react-hot-toast";

const OrderChatPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
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
      try {
        setIsLoading(true);
        const response = await orderChatAPI.getOrCreateOrderChat(orderId);
        if (response.success) {
          setOrderData(response.data);
        }
      } catch (error) {
        console.error("Error loading order data:", error);
        toast.error("Failed to load chat");
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId && user) {
      loadOrderData();
      joinOrderChat(orderId);
      loadChatMessages(orderId);
      clearUnreadCount(orderId);
    }

    return () => {
      if (orderId) {
        leaveOrderChat(orderId);
      }
    };
  }, [orderId, user]);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    if (messageInputRef.current && !isLoading) {
      messageInputRef.current.focus();
    }
  }, [isLoading]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="font-semibold text-gray-900">
                    {otherParty?.name || otherParty?.username || "User"}
                  </h1>
                  <div className="flex items-center space-x-2 text-sm">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isConnected ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></span>
                    <span className="text-gray-500">
                      {isConnected ? "Online" : "Offline"}
                    </span>
                    {typingUser && (
                      <span className="text-blue-500 animate-pulse">
                        • typing...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowOrderInfo(!showOrderInfo)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Order Info"
              >
                <Info size={20} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <MoreVertical size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-6xl mx-auto w-full flex">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Order Info Panel */}
          <AnimatePresence>
            {showOrderInfo && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-blue-50 border-b border-blue-200 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Package size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {orderData?.orderId?.itemName || "Order"}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span>
                          Qty: {orderData?.orderId?.quantity}{" "}
                          {orderData?.orderId?.unit}
                        </span>
                        <span>•</span>
                        <span>₹{orderData?.orderId?.totalPrice}</span>
                        <span>•</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            orderData?.orderId?.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : orderData?.orderId?.status === "processing"
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
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages Area */}
          <div
            className="flex-1 overflow-y-auto p-6 space-y-1"
            style={{ height: "calc(100vh - 200px)" }}
          >
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <Package size={48} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">
                    Start your conversation
                  </h3>
                  <p className="text-sm">
                    Send a message to begin chatting about this order.
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
                    className={`flex ${isLastInGroup ? "mb-4" : "mb-1"} ${
                      isOwn ? "justify-end" : "justify-start"
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div
                      className={`max-w-lg px-4 py-2 text-sm relative ${
                        isOwn
                          ? `bg-blue-500 text-white shadow-md ${
                              isFirstInGroup ? "rounded-t-2xl" : "rounded-t-md"
                            } ${
                              isLastInGroup
                                ? "rounded-bl-2xl rounded-br-md"
                                : "rounded-b-md"
                            }`
                          : `bg-white text-gray-800 border shadow-sm ${
                              isFirstInGroup ? "rounded-t-2xl" : "rounded-t-md"
                            } ${
                              isLastInGroup
                                ? "rounded-br-2xl rounded-bl-md"
                                : "rounded-b-md"
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
                          className={`flex items-center justify-between mt-2 ${
                            isOwn ? "text-blue-100" : "text-gray-500"
                          }`}
                        >
                          <p className="text-xs">
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          {isOwn && <div className="text-xs ml-2">✓✓</div>}
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
                className="flex justify-start mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="bg-white border shadow-sm px-4 py-2 rounded-t-2xl rounded-br-2xl rounded-bl-md">
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
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <div className="relative">
                  <textarea
                    ref={messageInputRef}
                    value={message}
                    onChange={handleTyping}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-32"
                    style={{ minHeight: "48px" }}
                    disabled={!isConnected}
                  />
                </div>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || !isConnected}
                className="w-12 h-12 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
            {!isConnected && (
              <p className="text-xs text-red-500 mt-2">
                Disconnected - Reconnecting...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderChatPage;
