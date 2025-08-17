const asyncHandler = require("../utils/asynchandler.js");
const ApiError = require("../utils/apiError.js");
const ApiResponse = require("../utils/apiResponse.js");
const OrderChat = require("../models/OrderChat.model.js");
const Order = require("../models/Order.model.js");
const User = require("../models/User.model.js");

// Create or get existing chat for an order
const getOrCreateOrderChat = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user._id || req.user.id; // Handle both _id and id

  if (!orderId) {
    throw new ApiError(400, "Order ID is required");
  }

  // Verify order exists and user is part of it
  const order = await Order.findById(orderId)
    .populate("buyerId", "name username")
    .populate("sellerId", "name username");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Check if user is either buyer or seller
  const userIdString = userId.toString();
  if (
    order.buyerId._id.toString() !== userIdString &&
    order.sellerId._id.toString() !== userIdString
  ) {
    throw new ApiError(403, "You are not authorized to access this chat");
  }

  // Check if order is confirmed or processing/shipped (chat should only be available for confirmed+ orders)
  if (
    !["confirmed", "processing", "shipped", "delivered", "completed"].includes(
      order.status
    )
  ) {
    throw new ApiError(400, "Chat is only available for confirmed orders");
  }

  // Try to find existing chat
  let orderChat = await OrderChat.findOne({ orderId });

  // If no chat exists, create one
  if (!orderChat) {
    orderChat = new OrderChat({
      orderId: order._id,
      buyerId: order.buyerId._id,
      sellerId: order.sellerId._id,
      messages: [],
    });
    await orderChat.save();
  }

  // Populate the chat with order and user details
  await orderChat.populate([
    {
      path: "orderId",
      select: "itemName quantity unit totalPrice status deliveryType",
    },
    {
      path: "buyerId",
      select: "name username",
    },
    {
      path: "sellerId",
      select: "name username",
    },
  ]);

  res
    .status(200)
    .json(new ApiResponse(200, orderChat, "Order chat retrieved successfully"));
});

// Get chat messages for an order
const getOrderChatMessages = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user._id || req.user.id; // Handle both _id and id
  const { page = 1, limit = 50 } = req.query;

  if (!orderId) {
    throw new ApiError(400, "Order ID is required");
  }

  // Verify user access to this chat
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Ensure userId is a string for comparison
  const userIdString = userId?.toString();
  const buyerIdString = order.buyerId?.toString();
  const sellerIdString = order.sellerId?.toString();

  if (buyerIdString !== userIdString && sellerIdString !== userIdString) {
    throw new ApiError(403, "You are not authorized to access this chat");
  }

  const orderChat = await OrderChat.findOne({ orderId });

  if (!orderChat) {
    // Create new chat if it doesn't exist (same logic as getOrCreateOrderChat)
    const newOrderChat = new OrderChat({
      orderId: order._id,
      buyerId: order.buyerId,
      sellerId: order.sellerId,
      messages: [],
    });

    await newOrderChat.save();

    // Return empty messages for new chat
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          messages: [],
          pagination: {
            currentPage: parseInt(page),
            totalMessages: 0,
            hasMore: false,
          },
          unreadCount: {
            buyerUnread: 0,
            sellerUnread: 0,
          },
        },
        "New chat created, no messages yet"
      )
    );
  } // Calculate pagination for existing chat
  const skip = (page - 1) * limit;
  const totalMessages = orderChat.messages.length;

  // Get paginated messages (chronological order - oldest to newest)
  // For first page, get the most recent messages
  let messages;
  if (page === 1) {
    // Get the last 'limit' messages in chronological order
    messages = orderChat.messages.slice(-limit);
  } else {
    // For pagination, get older messages
    const startIndex = Math.max(0, totalMessages - skip - limit);
    const endIndex = totalMessages - skip;
    messages = orderChat.messages.slice(startIndex, endIndex);
  }

  // Ensure messages are sorted by timestamp (oldest to newest)
  messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  // Mark messages as read for the current user
  const userType =
    order.buyerId.toString() === userIdString ? "buyer" : "seller";

  // Update unread count
  if (userType === "buyer" && orderChat.unreadCount?.buyerUnread > 0) {
    orderChat.unreadCount.buyerUnread = 0;
    await orderChat.save();
  } else if (userType === "seller" && orderChat.unreadCount?.sellerUnread > 0) {
    orderChat.unreadCount.sellerUnread = 0;
    await orderChat.save();
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        messages,
        pagination: {
          currentPage: parseInt(page),
          totalMessages,
          hasMore: skip + messages.length < totalMessages,
        },
        unreadCount: orderChat.unreadCount,
      },
      "Messages retrieved successfully"
    )
  );
});

// Get all chats for a user
const getUserOrderChats = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id; // Handle both _id and id
  const { page = 1, limit = 20 } = req.query;

  const skip = (page - 1) * limit;

  // Find all chats where user is buyer or seller
  const chats = await OrderChat.find({
    $or: [{ buyerId: userId }, { sellerId: userId }],
    isActive: true,
  })
    .populate({
      path: "orderId",
      select: "itemName quantity unit totalPrice status deliveryType",
    })
    .populate({
      path: "buyerId",
      select: "name username",
    })
    .populate({
      path: "sellerId",
      select: "name username",
    })
    .sort({ "lastMessage.timestamp": -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const totalChats = await OrderChat.countDocuments({
    $or: [{ buyerId: userId }, { sellerId: userId }],
    isActive: true,
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        chats,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalChats / limit),
          hasMore: skip + chats.length < totalChats,
        },
      },
      "User chats retrieved successfully"
    )
  );
});

// Send a message in order chat (REST API fallback)
const sendOrderChatMessage = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { message } = req.body;
  const userId = req.user._id || req.user.id;

  if (!orderId || !message) {
    throw new ApiError(400, "Order ID and message are required");
  }

  if (message.trim().length === 0) {
    throw new ApiError(400, "Message cannot be empty");
  }

  if (message.length > 1000) {
    throw new ApiError(400, "Message too long (max 1000 characters)");
  }

  // Verify order and user access
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const userIdString = userId?.toString();
  const buyerIdString = order.buyerId?.toString();
  const sellerIdString = order.sellerId?.toString();

  if (buyerIdString !== userIdString && sellerIdString !== userIdString) {
    throw new ApiError(403, "You are not authorized to access this chat");
  }

  // Determine sender type
  const senderType = buyerIdString === userIdString ? "buyer" : "seller";

  // Get or create order chat
  let orderChat = await OrderChat.findOne({ orderId });
  if (!orderChat) {
    orderChat = new OrderChat({
      orderId: order._id,
      buyerId: order.buyerId,
      sellerId: order.sellerId,
      messages: [],
    });
  }

  // Create new message
  const newMessage = {
    senderId: userIdString,
    senderName: req.user.name || req.user.username,
    senderType,
    message: message.trim(),
    timestamp: new Date(),
    isRead: false,
  };

  // Add message to chat
  orderChat.messages.push(newMessage);

  // Update last message
  orderChat.lastMessage = {
    message: message.trim(),
    timestamp: newMessage.timestamp,
    senderId: userIdString,
  };

  // Update unread count for receiver
  if (senderType === "buyer") {
    orderChat.unreadCount.sellerUnread += 1;
  } else {
    orderChat.unreadCount.buyerUnread += 1;
  }

  // Save to database
  await orderChat.save();

  // Return the sent message
  const sentMessage = orderChat.messages[orderChat.messages.length - 1];

  res.status(200).json(
    new ApiResponse(
      200,
      {
        message: sentMessage,
        totalMessages: orderChat.messages.length,
      },
      "Message sent successfully"
    )
  );
});

module.exports = {
  getOrCreateOrderChat,
  getOrderChatMessages,
  getUserOrderChats,
  sendOrderChatMessage,
};
