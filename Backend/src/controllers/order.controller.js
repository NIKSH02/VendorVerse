const Order = require("../models/Order.model");
const User = require("../models/User.model");
const SupplierListing = require("../models/SupplierListing.model");
const asyncHandler = require("../utils/asynchandler");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");

// Place an order
const placeOrder = asyncHandler(async (req, res) => {
  const {
    productId,
    quantity,
    deliveryType = "delivery",
    deliveryAddress,
    pickupAddress,
    notes,
  } = req.body;

  if (!productId || !quantity) {
    throw new ApiError(400, "Product ID and quantity are required");
  }

  // Get product details
  const product = await SupplierListing.findOne({
    _id: productId,
    isActive: true,
  }).populate("userId", "name username isSupplier address");

  if (!product) {
    throw new ApiError(404, "Product not found or not available");
  }

  const sellerId = product.userId._id;

  // Check if buyer is trying to buy their own product
  if (sellerId.toString() === req.user._id) {
    throw new ApiError(400, "You cannot place an order for your own product");
  }

  // Check product availability
  if (product.quantityAvailable < quantity) {
    throw new ApiError(
      400,
      `Insufficient quantity. Available: ${product.quantityAvailable} ${product.unit}`
    );
  }

  // Check seller's pending orders limit
  const sellerLimit = await Order.checkSellerPendingLimit(sellerId);
  if (!sellerLimit.canAcceptMore) {
    throw new ApiError(400, sellerLimit.message);
  }

  // Address validation
  let finalDeliveryAddress = deliveryAddress;
  let finalPickupAddress = pickupAddress;

  if (deliveryType === "delivery") {
    if (!deliveryAddress) {
      // Auto-use buyer's address
      const buyer = await User.findById(req.user._id).select("address");
      if (buyer.address && buyer.address.street) {
        finalDeliveryAddress = `${buyer.address.street}, ${buyer.address.city}, ${buyer.address.state} - ${buyer.address.pincode}`;
      } else {
        throw new ApiError(
          400,
          "Delivery address required. Please update your profile address or provide delivery address."
        );
      }
    }
  } else {
    if (!pickupAddress) {
      finalPickupAddress = product.location.address;
    }
  }

  // Calculate pricing
  const basePrice = product.pricePerUnit * quantity;
  const deliveryFee =
    deliveryType === "delivery" && product.deliveryAvailable
      ? product.deliveryFee
      : 0;
  const totalPrice = basePrice + deliveryFee;

  // Calculate expected delivery date
  const expectedDeliveryDate = new Date();
  expectedDeliveryDate.setDate(
    expectedDeliveryDate.getDate() + (deliveryType === "delivery" ? 7 : 3)
  );

  // Create order - this will appear in:
  // 1. Buyer's "Orders I Placed" (getBuyerOrderHistory - filtered by buyerId)
  // 2. Seller's "Orders to Fulfill" (getSellerOrders - filtered by sellerId)
  const order = new Order({
    buyerId: req.user._id, // Person placing the order (buyer)
    sellerId, // Product owner who needs to fulfill order (seller)
    listingId: productId,
    itemName: product.itemName,
    quantity,
    unit: product.unit,
    basePrice,
    deliveryFee,
    totalPrice,
    deliveryType,
    orderType: "from-listing",
    deliveryAddress: finalDeliveryAddress,
    pickupAddress: finalPickupAddress,
    expectedDeliveryDate,
    notes:
      notes || `Order for ${quantity} ${product.unit} of ${product.itemName}`,
    // Store product snapshot for history
    productSnapshot: {
      itemName: product.itemName,
      imageUrl: product.imageUrl,
      category: product.category,
      type: product.type,
      description: product.description,
      sellerLocation: product.location,
    },
  });

  await order.save();

  // Send notification to seller about new order
  try {
    if (global.notificationService) {
      await global.notificationService.notifyOrderPlaced(
        req.user._id, // buyerId
        sellerId,
        {
          _id: order._id,
          itemName: product.itemName,
          quantity: order.quantity,
          unit: order.unit,
          totalPrice: order.totalPrice,
          buyerName: req.user.name || req.user.username,
        }
      );
    }
  } catch (notificationError) {
    console.error("Failed to send order notification:", notificationError);
    // Don't fail the order creation if notification fails
  }

  // Populate order details for response
  await order.populate([
    { path: "buyerId", select: "name username phone email" },
    { path: "sellerId", select: "name username phone email rating trustScore" },
    {
      path: "listingId",
      select: "itemName imageUrl category type pricePerUnit",
    },
  ]);

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        order,
        'Order placed successfully! Order will appear in your "Orders Placed" and seller will see it in "Orders to Fulfill".'
      )
    );
});

// Get user's order history (as buyer) - Orders they have placed
const getBuyerOrderHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  // Filter by buyerId to show orders this user has placed
  const filter = { buyerId: req.user._id };
  if (status) filter.status = status;

  const skip = (page - 1) * limit;

  const orders = await Order.find(filter)
    .populate("sellerId", "name username rating trustScore phone")
    .populate("listingId", "itemName imageUrl category type")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Order.countDocuments(filter);

  // Enhanced order data
  const enhancedOrders = orders.map((order) => {
    const orderObj = order.toObject();
    orderObj.canReview = order.isReviewable && !order.reviewId;
    orderObj.daysOld = Math.floor(
      (new Date() - order.createdAt) / (1000 * 60 * 60 * 24)
    );
    orderObj.statusColor = getOrderStatusColor(order.status);
    orderObj.nextAction = getBuyerNextAction(order);
    return orderObj;
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        orders: enhancedOrders,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
      "Buyer order history fetched successfully"
    )
  );
});

// Get seller's order management (incoming orders) - Orders they need to fulfill
const getSellerOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  // Filter by sellerId to show orders this user needs to fulfill
  const filter = { sellerId: req.user._id };
  if (status) filter.status = status;

  const skip = (page - 1) * limit;

  const orders = await Order.find(filter)
    .populate("buyerId", "name username rating trustScore phone email")
    .populate("listingId", "itemName imageUrl category type")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Order.countDocuments(filter);

  // Enhanced order data with seller actions
  const enhancedOrders = orders.map((order) => {
    const orderObj = order.toObject();
    orderObj.daysOld = Math.floor(
      (new Date() - order.createdAt) / (1000 * 60 * 60 * 24)
    );
    orderObj.statusColor = getOrderStatusColor(order.status);
    orderObj.nextAction = getSellerNextAction(order);
    orderObj.buyerInfo = {
      name: order.buyerId.name,
      username: order.buyerId.username,
      rating: order.buyerId.rating,
      phone: order.buyerId.phone,
    };
    return orderObj;
  });

  // Get seller statistics
  const sellerLimit = await Order.checkSellerPendingLimit(req.user._id);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        orders: enhancedOrders,
        sellerStats: sellerLimit,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
      "Seller orders fetched successfully"
    )
  );
});

// Update order status (seller actions)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { action, notes, exchangeCode } = req.body; // action: 'accept', 'process', 'ship', 'complete', 'cancel'

  if (!["accept", "process", "ship", "complete", "cancel"].includes(action)) {
    throw new ApiError(
      400,
      "Invalid action. Must be accept, process, ship, complete, or cancel"
    );
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Removed seller-only check: allow any authenticated user to update order status

  // Validate status transitions
  const validTransitions = {
    pending: ["accept", "cancel"],
    confirmed: ["process", "cancel"],
    processing: ["ship", "cancel"],
    shipped: ["complete", "cancel"],
  };

  if (!validTransitions[order.status]?.includes(action)) {
    throw new ApiError(
      400,
      `Cannot ${action} order with status ${order.status}`
    );
  }

  // Update order status
  switch (action) {
    case "accept":
      if (order.status !== "pending") {
        throw new ApiError(400, "Only pending orders can be accepted");
      }
      order.status = "confirmed";
      break;
    case "process":
      order.status = "processing";
      // Exchange code will be generated by pre-save middleware
      break;
    case "ship":
      order.status = "shipped";
      break;
    case "complete":
      // Only require exchange code for 'complete' action
      if (!exchangeCode || typeof exchangeCode !== "string") {
        throw new ApiError(
          400,
          "Exchange code is required to complete the order."
        );
      }
      if (!order.exchangeCode || typeof order.exchangeCode !== "string") {
        throw new ApiError(400, "No exchange code generated for this order.");
      }
      // Compare codes case-insensitively and trimmed
      const submittedCode = exchangeCode.trim().toUpperCase();
      const dbCode = order.exchangeCode.trim().toUpperCase();
      if (submittedCode !== dbCode) {
        throw new ApiError(
          400,
          "Invalid exchange code. Please enter the correct code provided by the buyer."
        );
      }
      order.status = "completed";
      order.completedAt = new Date();
      break;
    case "cancel":
      order.status = "cancelled";
      order.cancelReason = notes || "Cancelled by seller";
      order.canceledAt = new Date();
      break;
  }

  if (notes && action !== "cancel") {
    order.sellerNotes = notes;
  }

  await order.save();

  // Send notifications based on action
  try {
    if (global.notificationService) {
      const buyerId = order.buyerId._id || order.buyerId;
      const sellerId = order.sellerId._id || order.sellerId;

      switch (action) {
        case "accept":
          await global.notificationService.notifyOrderConfirmed(
            buyerId,
            sellerId,
            {
              _id: order._id,
              itemName: order.itemName,
              sellerName: req.user.name || req.user.username,
            }
          );
          break;
        case "ship":
          await global.notificationService.notifyOrderShipped(buyerId, {
            _id: order._id,
            itemName: order.itemName,
            trackingInfo: order.trackingInfo,
          });
          break;
        case "complete":
          await global.notificationService.notifyOrderCompleted(
            buyerId,
            sellerId,
            {
              _id: order._id,
              itemName: order.itemName,
              sellerName: req.user.name || req.user.username,
              buyerName: order.buyerId.name || order.buyerId.username,
            }
          );
          break;
        case "cancel":
          await global.notificationService.notifyOrderCancelled(
            buyerId,
            sellerId,
            {
              _id: order._id,
              itemName: order.itemName,
              cancelReason: order.cancelReason,
              cancelledBy: req.user.name || req.user.username,
            }
          );
          break;
      }
    }
  } catch (notificationError) {
    console.error(
      "Failed to send order status notification:",
      notificationError
    );
    // Don't fail the order update if notification fails
  }

  await order.populate([
    { path: "buyerId", select: "name username phone email" },
    { path: "sellerId", select: "name username phone" },
    { path: "listingId", select: "itemName imageUrl" },
  ]);

  res
    .status(200)
    .json(new ApiResponse(200, order, `Order ${action}ed successfully`));
});

// Buyer provides exchange code to seller (buyer action)
const provideExchangeCode = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Removed buyer-only check: allow any authenticated user to fetch exchange code

  // Allow exchange code to be viewed at any status

  if (!order.exchangeCode) {
    throw new ApiError(400, "Exchange code not yet generated");
  }

  await order.populate([
    { path: "buyerId", select: "name username" },
    { path: "sellerId", select: "name username phone" },
    { path: "listingId", select: "itemName imageUrl" },
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        exchangeCode: order.exchangeCode,
        orderDetails: {
          orderId: order._id,
          itemName: order.itemName,
          quantity: order.quantity,
          seller: order.sellerId,
        },
      },
      "Exchange code retrieved successfully. Share this with the seller upon delivery."
    )
  );
});

// Get order details
const getOrderDetails = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId)
    .populate("buyerId", "name username phone email rating trustScore address")
    .populate("sellerId", "name username phone email rating trustScore address")
    .populate(
      "listingId",
      "itemName imageUrl category type description location"
    )
    .populate("reviewId");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Check if user is involved in this order
  const isInvolved =
    order.buyerId._id.toString() === req.user._id ||
    order.sellerId._id.toString() === req.user._id;

  if (!isInvolved) {
    throw new ApiError(403, "You are not authorized to view this order");
  }

  // Enhanced order with timeline
  const orderObj = order.toObject();
  orderObj.userRole =
    order.buyerId._id.toString() === req.user._id ? "buyer" : "seller";
  orderObj.timeline = generateOrderTimeline(order);
  orderObj.canReview =
    order.isReviewable && !order.reviewId && orderObj.userRole === "buyer";

  res
    .status(200)
    .json(new ApiResponse(200, orderObj, "Order details fetched successfully"));
});

// Get order dashboard/summary
const getOrderDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get order statistics
  const orderStats = await Order.getUserOrderStats(userId);

  // Get recent orders as buyer (orders placed by this user)
  const recentBuyerOrders = await Order.find({ buyerId: userId })
    .populate("sellerId", "name username")
    .populate("listingId", "itemName imageUrl")
    .sort({ updatedAt: -1 })
    .limit(3);

  // Get recent orders as seller (orders to be fulfilled by this user)
  const recentSellerOrders = await Order.find({ sellerId: userId })
    .populate("buyerId", "name username")
    .populate("listingId", "itemName imageUrl")
    .sort({ updatedAt: -1 })
    .limit(3);

  // Combine and enhance recent orders
  const allRecentOrders = [
    ...recentBuyerOrders.map((order) => ({
      ...order.toObject(),
      userRole: "buyer",
      counterparty: order.sellerId,
    })),
    ...recentSellerOrders.map((order) => ({
      ...order.toObject(),
      userRole: "seller",
      counterparty: order.buyerId,
    })),
  ]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  // Get reviewable orders
  const reviewableOrders = await Order.countDocuments({
    buyerId: userId,
    isReviewable: true,
    reviewId: { $exists: false },
  });

  const dashboardData = {
    statistics: {
      asBuyer: processOrderStats(orderStats.asBuyer),
      asSeller: processOrderStats(orderStats.asSeller),
    },
    recentOrders: allRecentOrders,
    reviewableCount: reviewableOrders,
    orderFlow: {
      description:
        "When you place an order, it appears in your 'Orders Placed' and seller's 'Orders to Fulfill'",
      endpoints: {
        ordersPlaced: "/api/orders/buyer/history",
        ordersToFulfill: "/api/orders/seller/orders",
      },
    },
  };

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        dashboardData,
        "Order dashboard fetched successfully"
      )
    );
});

// Helper functions
const getOrderStatusColor = (status) => {
  const colors = {
    pending: "#f59e0b", // amber
    confirmed: "#3b82f6", // blue
    processing: "#8b5cf6", // purple
    shipped: "#06b6d4", // cyan
    delivered: "#10b981", // green
    completed: "#6b7280", // gray
    cancelled: "#ef4444", // red
  };
  return colors[status] || "#6b7280";
};

const getBuyerNextAction = (order) => {
  switch (order.status) {
    case "pending":
      return "Waiting for seller to accept order";
    case "confirmed":
      return "Seller accepted order, preparing to process";
    case "processing":
      return "Order being processed. Exchange code available.";
    case "shipped":
      return "Order shipped, awaiting delivery";
    case "completed":
      return order.reviewId ? "Order completed" : "Add a review";
    case "cancelled":
      return "Order was cancelled";
    default:
      return "No action required";
  }
};

const getSellerNextAction = (order) => {
  switch (order.status) {
    case "pending":
      return "Accept or cancel order";
    case "confirmed":
      return "Start processing order";
    case "processing":
      return "Ship order when ready";
    case "shipped":
      return "Mark as complete when buyer provides exchange code";
    case "completed":
      return "Order completed successfully";
    case "cancelled":
      return "Order was cancelled";
    default:
      return "No action required";
  }
};

const generateOrderTimeline = (order) => {
  const timeline = [
    {
      status: "placed",
      date: order.createdAt,
      description: `Order placed by ${order.buyerId.name}`,
      completed: true,
    },
  ];

  if (
    ["confirmed", "processing", "shipped", "completed"].includes(order.status)
  ) {
    timeline.push({
      status: "accepted",
      date: order.updatedAt,
      description: `Order accepted by ${order.sellerId.name}`,
      completed: true,
    });
  }

  if (["processing", "shipped", "completed"].includes(order.status)) {
    timeline.push({
      status: "processing",
      date: order.updatedAt,
      description: "Order moved to processing. Exchange code generated.",
      completed: true,
    });
  }

  if (["shipped", "completed"].includes(order.status)) {
    timeline.push({
      status: "shipped",
      date: order.updatedAt,
      description: "Order shipped",
      completed: true,
    });
  }

  if (order.status === "completed") {
    timeline.push({
      status: "completed",
      date: order.completedAt,
      description: "Order completed with exchange code verification",
      completed: true,
    });
  }

  if (order.status === "cancelled") {
    timeline.push({
      status: "cancelled",
      date: order.canceledAt,
      description: `Order cancelled: ${order.cancelReason}`,
      completed: true,
    });
  }

  return timeline;
};

const processOrderStats = (stats) => {
  const result = {
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    completed: 0,
    cancelled: 0,
    totalAmount: 0,
    totalOrders: 0,
  };

  stats.forEach((stat) => {
    result[stat._id] = stat.count;
    result.totalAmount += stat.totalAmount;
    result.totalOrders += stat.count;
  });

  return result;
};

// Get all orders for a user (both as buyer and seller) - Comprehensive view
const getAllUserOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, type = "all" } = req.query; // type: 'buyer', 'seller', 'all'
  const userId = req.user._id;

  let filter = {};

  switch (type) {
    case "buyer":
      filter = { buyerId: userId };
      break;
    case "seller":
      filter = { sellerId: userId };
      break;
    default:
      filter = {
        $or: [{ buyerId: userId }, { sellerId: userId }],
      };
  }

  const skip = (page - 1) * limit;

  const orders = await Order.find(filter)
    .populate("buyerId", "name username phone email")
    .populate("sellerId", "name username phone email")
    .populate("listingId", "itemName imageUrl category type")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Order.countDocuments(filter);

  // Enhanced order data with user role
  const enhancedOrders = orders.map((order) => {
    const orderObj = order.toObject();
    orderObj.userRole =
      order.buyerId._id.toString() === userId ? "buyer" : "seller";
    orderObj.counterparty =
      orderObj.userRole === "buyer" ? order.sellerId : order.buyerId;
    orderObj.orderCategory =
      orderObj.userRole === "buyer" ? "Orders I Placed" : "Orders to Fulfill";
    return orderObj;
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        orders: enhancedOrders,
        orderFlow: {
          buyer: "Orders you have placed (you are the buyer)",
          seller: "Orders you need to fulfill (you are the seller)",
          current:
            type === "all"
              ? "All orders"
              : type === "buyer"
                ? "Orders I Placed"
                : "Orders to Fulfill",
        },
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
      "All user orders fetched successfully"
    )
  );
});

// Get reviewable orders for buyer (completed orders without reviews)
const getReviewableOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    buyerId: req.user._id,
    status: "completed",
    isReviewable: true,
    reviewId: { $exists: false },
  })
    .populate("sellerId", "name username rating")
    .populate("listingId", "itemName imageUrl category")
    .sort({ completedAt: -1 });

  const reviewableOrders = orders.map((order) => ({
    orderId: order._id,
    itemName: order.itemName,
    quantity: order.quantity,
    totalPrice: order.totalPrice,
    completedAt: order.completedAt,
    seller: {
      id: order.sellerId._id,
      name: order.sellerId.name,
      username: order.sellerId.username,
      rating: order.sellerId.rating,
    },
    product: {
      id: order.listingId._id,
      name: order.listingId.itemName,
      image: order.listingId.imageUrl,
      category: order.listingId.category,
    },
  }));

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        reviewableOrders,
        "Reviewable orders fetched successfully"
      )
    );
});

// Get user's financial summary for profile
const getUserFinancialSummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get buyer expenditure (total spent on orders)
  const buyerExpenditure = await Order.aggregate([
    { $match: { buyerId: userId, status: "completed" } },
    {
      $group: {
        _id: null,
        totalExpenditure: { $sum: "$totalPrice" },
        totalOrders: { $sum: 1 },
      },
    },
  ]);

  // Get seller revenue (total earned from sales)
  const sellerRevenue = await Order.aggregate([
    { $match: { sellerId: userId, status: "completed" } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalPrice" },
        totalSales: { $sum: 1 },
      },
    },
  ]);

  // Get monthly breakdown for the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyData = await Order.aggregate([
    {
      $match: {
        $or: [{ buyerId: userId }, { sellerId: userId }],
        status: "completed",
        completedAt: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$completedAt" },
          month: { $month: "$completedAt" },
          userRole: {
            $cond: [{ $eq: ["$buyerId", userId] }, "buyer", "seller"],
          },
        },
        amount: { $sum: "$totalPrice" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const financialSummary = {
    expenditure: {
      total: buyerExpenditure[0]?.totalExpenditure || 0,
      orderCount: buyerExpenditure[0]?.totalOrders || 0,
    },
    revenue: {
      total: sellerRevenue[0]?.totalRevenue || 0,
      salesCount: sellerRevenue[0]?.totalSales || 0,
    },
    monthlyBreakdown: monthlyData,
    netBalance:
      (sellerRevenue[0]?.totalRevenue || 0) -
      (buyerExpenditure[0]?.totalExpenditure || 0),
  };

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        financialSummary,
        "Financial summary fetched successfully"
      )
    );
});

module.exports = {
  placeOrder,
  getBuyerOrderHistory,
  getSellerOrders,
  updateOrderStatus,
  provideExchangeCode,
  getOrderDetails,
  getOrderDashboard,
  getAllUserOrders,
  getReviewableOrders,
  getUserFinancialSummary,
};
