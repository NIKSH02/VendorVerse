const OrderChat = require("./models/OrderChat.model");
const Order = require("./models/Order.model");
const User = require("./models/User.model");

const orderChatSocket = (io) => {
  // Store active chat connections
  const activeChatUsers = new Map(); // userId -> Set of orderIds they're connected to
  const chatRooms = new Map(); // orderId -> Set of connected userIds
  const userSockets = new Map(); // userId -> socketId

  io.on("connection", (socket) => {
    console.log(`New socket connection for order chat: ${socket.id}`);

    // Handle user joining an order chat room
    socket.on("joinOrderChat", async (data) => {
      try {
        const { userId, orderId, userToken } = data;

        if (!userId || !orderId) {
          socket.emit("orderChatError", {
            message: "Missing userId or orderId",
          });
          return;
        }

        // Verify order exists and user has access
        const order = await Order.findById(orderId);
        if (!order) {
          socket.emit("orderChatError", { message: "Order not found" });
          return;
        }

        // Check if user is buyer or seller
        if (
          order.buyerId.toString() !== userId &&
          order.sellerId.toString() !== userId
        ) {
          socket.emit("orderChatError", {
            message: "Unauthorized access to chat",
          });
          return;
        }

        // Check order status
        if (
          ![
            "confirmed",
            "processing",
            "shipped",
            "delivered",
            "completed",
          ].includes(order.status)
        ) {
          socket.emit("orderChatError", {
            message: "Chat not available for this order status",
          });
          return;
        }

        // Store user socket mapping
        userSockets.set(userId, socket.id);

        // Join the order-specific room
        const roomName = `order_chat_${orderId}`;
        socket.join(roomName);

        // Track active users
        if (!activeChatUsers.has(userId)) {
          activeChatUsers.set(userId, new Set());
        }
        activeChatUsers.get(userId).add(orderId);

        if (!chatRooms.has(orderId)) {
          chatRooms.set(orderId, new Set());
        }
        chatRooms.get(orderId).add(userId);

        // Store user info on socket
        socket.orderChatUser = { userId, orderId };

        console.log(`User ${userId} joined order chat for order ${orderId}`);

        // Notify other user in the chat that someone joined
        socket.to(roomName).emit("userJoinedOrderChat", {
          userId,
          orderId,
          timestamp: new Date(),
        });

        // Send confirmation to joining user
        socket.emit("orderChatJoined", {
          orderId,
          roomName,
          message: "Successfully joined order chat",
        });
      } catch (error) {
        console.error("Error in joinOrderChat:", error);
        socket.emit("orderChatError", { message: "Failed to join order chat" });
      }
    });

    // Handle sending messages in order chat
    socket.on("sendOrderChatMessage", async (data) => {
      try {
        console.log("Received sendOrderChatMessage:", data);
        const { userId, orderId, message, senderName } = data;

        if (!userId || !orderId || !message || !senderName) {
          console.log("Missing required fields:", {
            userId,
            orderId,
            message,
            senderName,
          });
          socket.emit("orderChatError", { message: "Missing required fields" });
          return;
        }

        if (message.trim().length === 0) {
          socket.emit("orderChatError", { message: "Message cannot be empty" });
          return;
        }

        if (message.length > 1000) {
          socket.emit("orderChatError", {
            message: "Message too long (max 1000 characters)",
          });
          return;
        }

        // Verify order and user access
        const order = await Order.findById(orderId);
        if (!order) {
          console.log("Order not found:", orderId);
          socket.emit("orderChatError", { message: "Order not found" });
          return;
        }

        console.log("Order found:", {
          orderId: order._id.toString(),
          buyerId: order.buyerId.toString(),
          sellerId: order.sellerId.toString(),
          status: order.status,
        });

        // Check if user is buyer or seller
        const userIdString = userId.toString();
        if (
          order.buyerId.toString() !== userIdString &&
          order.sellerId.toString() !== userIdString
        ) {
          console.log(
            "Unauthorized access - User:",
            userIdString,
            "Order buyer:",
            order.buyerId.toString(),
            "Order seller:",
            order.sellerId.toString()
          );
          socket.emit("orderChatError", { message: "Unauthorized" });
          return;
        }

        // Determine sender type
        const senderType =
          order.buyerId.toString() === userIdString ? "buyer" : "seller";
        const receiverType = senderType === "buyer" ? "seller" : "buyer";

        console.log("User authorization successful:", {
          userId: userIdString,
          senderType,
          receiverType,
        });

        // Get or create order chat
        let orderChat = await OrderChat.findOne({ orderId });
        console.log("Existing orderChat found:", orderChat ? "YES" : "NO");

        if (!orderChat) {
          console.log("Creating new orderChat...");
          orderChat = new OrderChat({
            orderId,
            buyerId: order.buyerId,
            sellerId: order.sellerId,
            messages: [],
          });
          await orderChat.save();
          console.log("New orderChat created");
        }

        // Create new message
        const newMessage = {
          senderId: userIdString, // Use string version
          senderName,
          senderType,
          message: message.trim(),
          timestamp: new Date(),
          isRead: false,
        };

        console.log("Creating new message:", newMessage);

        // Add message to chat
        orderChat.messages.push(newMessage);
        console.log(
          "Message added to chat. Total messages:",
          orderChat.messages.length
        );

        // Update last message
        orderChat.lastMessage = {
          message: message.trim(),
          timestamp: newMessage.timestamp,
          senderId: userIdString, // Use string version
        };

        // Update unread count for receiver
        if (senderType === "buyer") {
          orderChat.unreadCount.sellerUnread += 1;
        } else {
          orderChat.unreadCount.buyerUnread += 1;
        }

        console.log("Saving orderChat to database...");
        // Save to database
        await orderChat.save();
        console.log(
          "OrderChat saved successfully. Final message count:",
          orderChat.messages.length
        );

        // Prepare message for broadcast
        const messageData = {
          _id: orderChat.messages[orderChat.messages.length - 1]._id,
          senderId: userIdString, // Use string version
          senderName,
          senderType,
          message: message.trim(),
          timestamp: newMessage.timestamp,
          orderId,
        };

        console.log(
          "Broadcasting message to room:",
          `order_chat_${orderId}`,
          messageData
        );

        // Broadcast to all users in the order chat room
        const roomName = `order_chat_${orderId}`;
        io.to(roomName).emit("receiveOrderChatMessage", messageData);

        // Confirm message sent to sender
        socket.emit("orderChatMessageSent", {
          success: true,
          messageId: messageData._id,
          timestamp: messageData.timestamp,
        });

        // Send notification to the other user if they're not in the chat
        const otherUserId =
          senderType === "buyer"
            ? order.sellerId.toString()
            : order.buyerId.toString();
        const isOtherUserInChat = chatRooms.get(orderId)?.has(otherUserId);

        if (!isOtherUserInChat) {
          // Send notification about new message
          const otherUserSocketId = userSockets.get(otherUserId);
          if (otherUserSocketId) {
            io.to(otherUserSocketId).emit("newOrderChatNotification", {
              orderId,
              orderItemName: order.itemName,
              senderName,
              message: message.substring(0, 100),
              timestamp: newMessage.timestamp,
              unreadCount:
                receiverType === "buyer"
                  ? orderChat.unreadCount.buyerUnread
                  : orderChat.unreadCount.sellerUnread,
            });
          }
        }

        console.log(
          `Message sent in order chat ${orderId} by ${senderName}: ${message.substring(0, 50)}...`
        );
      } catch (error) {
        console.error("Error in sendOrderChatMessage:", error);
        console.error("Error stack:", error.stack);
        socket.emit("orderChatError", {
          message: "Failed to send message",
          details: error.message,
        });
      }
    });

    // Handle typing indicators in order chat
    socket.on("orderChatTyping", (data) => {
      try {
        const { userId, orderId, isTyping, senderName } = data;

        if (!userId || !orderId) {
          return;
        }

        const roomName = `order_chat_${orderId}`;
        socket.to(roomName).emit("orderChatUserTyping", {
          userId,
          orderId,
          senderName,
          isTyping,
          timestamp: new Date(),
        });
      } catch (error) {
        console.error("Error in orderChatTyping:", error);
      }
    });

    // Handle leaving order chat
    socket.on("leaveOrderChat", (data) => {
      try {
        const { userId, orderId } = data;

        if (!userId || !orderId) {
          return;
        }

        const roomName = `order_chat_${orderId}`;
        socket.leave(roomName);

        // Clean up tracking
        if (activeChatUsers.has(userId)) {
          activeChatUsers.get(userId).delete(orderId);
          if (activeChatUsers.get(userId).size === 0) {
            activeChatUsers.delete(userId);
          }
        }

        if (chatRooms.has(orderId)) {
          chatRooms.get(orderId).delete(userId);
          if (chatRooms.get(orderId).size === 0) {
            chatRooms.delete(orderId);
          }
        }

        // Notify other user
        socket.to(roomName).emit("userLeftOrderChat", {
          userId,
          orderId,
          timestamp: new Date(),
        });

        console.log(`User ${userId} left order chat for order ${orderId}`);
      } catch (error) {
        console.error("Error in leaveOrderChat:", error);
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      try {
        if (socket.orderChatUser) {
          const { userId, orderId } = socket.orderChatUser;

          // Clean up all tracking for this user
          userSockets.delete(userId);

          if (activeChatUsers.has(userId)) {
            const userOrderIds = activeChatUsers.get(userId);
            userOrderIds.forEach((orderIdInChat) => {
              if (chatRooms.has(orderIdInChat)) {
                chatRooms.get(orderIdInChat).delete(userId);
                if (chatRooms.get(orderIdInChat).size === 0) {
                  chatRooms.delete(orderIdInChat);
                }
              }

              // Notify others in each chat room
              const roomName = `order_chat_${orderIdInChat}`;
              socket.to(roomName).emit("userLeftOrderChat", {
                userId,
                orderId: orderIdInChat,
                timestamp: new Date(),
              });
            });

            activeChatUsers.delete(userId);
          }

          console.log(`User ${userId} disconnected from order chat`);
        }
      } catch (error) {
        console.error("Error in order chat disconnect:", error);
      }
    });

    // Handle ping for connection health check
    socket.on("orderChatPing", () => {
      socket.emit("orderChatPong");
    });
  });

  // Cleanup function for graceful shutdown
  const cleanup = () => {
    activeChatUsers.clear();
    chatRooms.clear();
    userSockets.clear();
  };

  return { cleanup };
};

module.exports = orderChatSocket;
