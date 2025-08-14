const asyncHandler = require("../utils/asynchandler.js");
const ApiError = require("../utils/apiError.js");
const ApiResponse = require("../utils/apiResponse.js");
const OrderChat = require("../models/OrderChat.model.js");
const Order = require("../models/Order.model.js");
const User = require("../models/User.model.js");

// Create or get existing chat for an order
const getOrCreateOrderChat = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.id;

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
  if (
    order.buyerId._id.toString() !== userId &&
    order.sellerId._id.toString() !== userId
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
  const userId = req.user.id;
  const { page = 1, limit = 50 } = req.query;

  if (!orderId) {
    throw new ApiError(400, "Order ID is required");
  }

  // Verify user access to this chat
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (
    order.buyerId.toString() !== userId &&
    order.sellerId.toString() !== userId
  ) {
    throw new ApiError(403, "You are not authorized to access this chat");
  }

  const orderChat = await OrderChat.findOne({ orderId });
  if (!orderChat) {
    throw new ApiError(404, "Chat not found for this order");
  }

  // Calculate pagination
  const skip = (page - 1) * limit;
  const totalMessages = orderChat.messages.length;

  // Get paginated messages (most recent first)
  const messages = orderChat.messages
    .slice(-skip - limit, totalMessages - skip)
    .reverse();

  // Mark messages as read for the current user
  const userType = order.buyerId.toString() === userId ? "buyer" : "seller";

  // Update unread count
  if (userType === "buyer" && orderChat.unreadCount.buyerUnread > 0) {
    orderChat.unreadCount.buyerUnread = 0;
    await orderChat.save();
  } else if (userType === "seller" && orderChat.unreadCount.sellerUnread > 0) {
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
  const userId = req.user.id;
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

module.exports = {
  getOrCreateOrderChat,
  getOrderChatMessages,
  getUserOrderChats,
};
