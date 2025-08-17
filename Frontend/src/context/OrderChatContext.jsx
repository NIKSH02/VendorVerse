import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { useAuth } from "./AuthContext";
import orderChatAPI from "../services/orderChatAPI";
import io from "socket.io-client";
import toast from "react-hot-toast";

const OrderChatContext = createContext();

export const useOrderChat = () => {
  const context = useContext(OrderChatContext);
  if (!context) {
    throw new Error("useOrderChat must be used within an OrderChatProvider");
  }
  return context;
};

export const OrderChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connectedChats, setConnectedChats] = useState(new Set());
  const [messages, setMessages] = useState({}); // orderId -> messages array
  const [typingUsers, setTypingUsers] = useState({}); // orderId -> typing user info
  const [unreadCounts, setUnreadCounts] = useState({}); // orderId -> unread count
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const typingTimeouts = useRef({});

  // Initialize socket connection
  useEffect(() => {
    if (user) {
      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";
      const newSocket = io(API_BASE_URL, {
        withCredentials: true,
        transports: ["websocket", "polling"],
      });

      newSocket.on("connect", () => {
        console.log("Order chat socket connected");
        setIsConnected(true);
      });

      newSocket.on("disconnect", () => {
        console.log("Order chat socket disconnected");
        setIsConnected(false);
      });

      // Handle errors
      newSocket.on("orderChatError", (error) => {
        console.error("Order chat error:", error);
        toast.error(error.message || "Chat error occurred");
      });

      // Handle successful join
      newSocket.on("orderChatJoined", (data) => {
        console.log("Successfully joined order chat:", data.orderId);
        setConnectedChats((prev) => new Set(prev).add(data.orderId));
      });

      // Handle receiving messages
      newSocket.on("receiveOrderChatMessage", (messageData) => {
        console.log("Received order chat message:", messageData);
        console.log(
          "Appending to end of messages array for order:",
          messageData.orderId
        );
        setMessages((prev) => ({
          ...prev,
          [messageData.orderId]: [
            ...(prev[messageData.orderId] || []),
            messageData,
          ],
        }));

        // Update unread count if user is not the sender
        if (messageData.senderId !== (user._id || user.id)) {
          setUnreadCounts((prev) => ({
            ...prev,
            [messageData.orderId]: (prev[messageData.orderId] || 0) + 1,
          }));
        }
      });

      // Handle message sent confirmation
      newSocket.on("orderChatMessageSent", (data) => {
        console.log("Message sent confirmation:", data);
      });

      // Handle typing indicators
      newSocket.on("orderChatUserTyping", (data) => {
        if (data.userId !== (user._id || user.id)) {
          setTypingUsers((prev) => ({
            ...prev,
            [data.orderId]: data.isTyping
              ? {
                  userId: data.userId,
                  senderName: data.senderName,
                  timestamp: data.timestamp,
                }
              : null,
          }));

          // Clear typing indicator after timeout
          if (data.isTyping) {
            if (typingTimeouts.current[data.orderId]) {
              clearTimeout(typingTimeouts.current[data.orderId]);
            }
            typingTimeouts.current[data.orderId] = setTimeout(() => {
              setTypingUsers((prev) => ({
                ...prev,
                [data.orderId]: null,
              }));
            }, 3000);
          }
        }
      });

      // Handle user join/leave notifications
      newSocket.on("userJoinedOrderChat", (data) => {
        console.log(
          `User ${data.userId} joined order chat for order ${data.orderId}`
        );
      });

      newSocket.on("userLeftOrderChat", (data) => {
        console.log(
          `User ${data.userId} left order chat for order ${data.orderId}`
        );
      });

      // Handle notifications for new messages
      newSocket.on("newOrderChatNotification", (data) => {
        toast(`New message from ${data.senderName}`, {
          icon: "💬",
          duration: 4000,
        });
      });

      // Health check
      newSocket.on("orderChatPong", () => {
        console.log("Order chat pong received");
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
        setSocket(null);
        setIsConnected(false);
        setConnectedChats(new Set());
      };
    }
  }, [user]);

  // Join order chat
  const joinOrderChat = (orderId) => {
    if (socket && user && orderId) {
      console.log("Joining order chat with user:", user);
      socket.emit("joinOrderChat", {
        userId: user._id || user.id, // Handle both _id and id
        orderId,
        userToken: user.token,
      });
    }
  };

  // Leave order chat
  const leaveOrderChat = (orderId) => {
    if (socket && user && orderId) {
      socket.emit("leaveOrderChat", {
        userId: user.id,
        orderId,
      });
      setConnectedChats((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  // Send message
  const sendMessage = (orderId, message) => {
    if (socket && user && orderId && message.trim()) {
      console.log("Sending message with user:", user);
      socket.emit("sendOrderChatMessage", {
        userId: user._id || user.id, // Handle both _id and id
        orderId,
        message: message.trim(),
        senderName: user.name || user.username,
      });
    }
  };

  // Send typing indicator
  const sendTypingIndicator = (orderId, isTyping) => {
    if (socket && user && orderId) {
      socket.emit("orderChatTyping", {
        userId: user._id || user.id, // Handle both _id and id
        orderId,
        isTyping,
        senderName: user.name || user.username,
      });
    }
  };

  // Get or create order chat
  const getOrCreateOrderChat = async (orderId) => {
    try {
      setLoading(true);
      const response = await orderChatAPI.getOrCreateOrderChat(orderId);
      return response.data;
    } catch (error) {
      console.error("Error getting order chat:", error);
      toast.error("Failed to open chat");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Load chat messages
  const loadChatMessages = async (orderId, page = 1) => {
    try {
      setLoading(true);
      const response = await orderChatAPI.getOrderChatMessages(orderId, page);

      console.log(
        `Loading messages for order ${orderId}, page ${page}:`,
        response.data.messages
      );

      if (page === 1) {
        // First load - replace messages (backend returns oldest to newest)
        console.log("First load - setting messages:", response.data.messages);
        setMessages((prev) => ({
          ...prev,
          [orderId]: response.data.messages || [],
        }));
      } else {
        // Load more (older messages) - prepend to beginning since they're older
        const olderMessages = response.data.messages || [];
        const existingMessages = prev[orderId] || [];
        console.log("Loading more - prepending older messages:", olderMessages);
        console.log("Existing messages:", existingMessages);

        setMessages((prev) => ({
          ...prev,
          [orderId]: [...olderMessages, ...existingMessages],
        }));
      }

      // Clear unread count when loading messages
      setUnreadCounts((prev) => ({
        ...prev,
        [orderId]: 0,
      }));

      return response.data;
    } catch (error) {
      console.error("Error loading chat messages:", error);
      toast.error("Failed to load messages");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get user's order chats
  const getUserOrderChats = async (page = 1) => {
    try {
      setLoading(true);
      const response = await orderChatAPI.getUserOrderChats(page);
      return response.data;
    } catch (error) {
      console.error("Error getting user chats:", error);
      toast.error("Failed to load chats");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Clear unread count for an order
  const clearUnreadCount = (orderId) => {
    setUnreadCounts((prev) => ({
      ...prev,
      [orderId]: 0,
    }));
  };

  // Ping for connection health check
  const ping = () => {
    if (socket) {
      socket.emit("orderChatPing");
    }
  };

  const contextValue = {
    // State
    socket,
    isConnected,
    connectedChats,
    messages,
    typingUsers,
    unreadCounts,
    loading,

    // Actions
    joinOrderChat,
    leaveOrderChat,
    sendMessage,
    sendTypingIndicator,
    getOrCreateOrderChat,
    loadChatMessages,
    getUserOrderChats,
    clearUnreadCount,
    ping,

    // Utility
    isUserConnectedToChat: (orderId) => connectedChats.has(orderId),
    getMessagesForOrder: (orderId) => messages[orderId] || [],
    getUnreadCount: (orderId) => unreadCounts[orderId] || 0,
    getTypingUser: (orderId) => typingUsers[orderId],
  };

  return (
    <OrderChatContext.Provider value={contextValue}>
      {children}
    </OrderChatContext.Provider>
  );
};
