const Review = require("../models/Review.model");
const Sample = require("../models/Sample.model");
const Order = require("../models/Order.model");
const User = require("../models/User.model");
const SupplierListing = require("../models/SupplierListing.model");
const asyncHandler = require("../utils/asynchandler");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");

// Create a review for sample or order
const createReview = asyncHandler(async (req, res) => {
  const {
    reviewType, // 'sample' or 'order'
    targetId, // sampleId or orderId
    rating,
    comment,
    categories = {},
  } = req.body;

  if (!reviewType || !targetId || !rating || !comment) {
    throw new ApiError(
      400,
      "Review type, target ID, rating, and comment are required"
    );
  }

  if (!["sample", "order"].includes(reviewType)) {
    throw new ApiError(400, 'Review type must be "sample" or "order"');
  }

  let targetDoc, toUserId, productId;

  if (reviewType === "sample") {
    // Verify sample exists and user can review it
    targetDoc = await Sample.findById(targetId)
      .populate("supplierId", "_id name")
      .populate("productDetails.productId", "_id");

    if (!targetDoc) {
      throw new ApiError(404, "Sample not found");
    }

    // Note: Ownership check removed - anyone can review any received sample
    // if (targetDoc.receiverId.toString() !== req.user._id.toString()) {
    //   throw new ApiError(403, "You can only review samples you received");
    // }

    if (targetDoc.status !== "received" && targetDoc.status !== "reviewed") {
      throw new ApiError(400, "Sample must be received before reviewing");
    }

    if (targetDoc.isReviewed && targetDoc.reviewId) {
      throw new ApiError(400, "Sample has already been reviewed");
    }

    toUserId = targetDoc.supplierId._id;
    productId = targetDoc.productDetails.productId._id;
  } else {
    // Verify order exists and user can review it
    targetDoc = await Order.findById(targetId)
      .populate("sellerId", "_id name")
      .populate("listingId", "_id");

    if (!targetDoc) {
      throw new ApiError(404, "Order not found");
    }

    // Note: Ownership check removed - anyone can review any completed order
    // console.log("🔍 Debug - Order ownership check:");
    // console.log("targetDoc.buyerId:", targetDoc.buyerId);
    // console.log("targetDoc.buyerId.toString():", targetDoc.buyerId.toString());
    // console.log("req.user._id:", req.user._id);
    // console.log("req.user._id.toString():", req.user._id.toString());
    // console.log("Comparison result:", targetDoc.buyerId.toString() === req.user._id.toString());

    // if (targetDoc.buyerId.toString() !== req.user._id.toString()) {
    //   throw new ApiError(403, "You can only review orders you placed");
    // }

    if (targetDoc.status !== "completed") {
      throw new ApiError(400, "Order must be completed before reviewing");
    }

    if (targetDoc.reviewId) {
      throw new ApiError(400, "Order has already been reviewed");
    }

    toUserId = targetDoc.sellerId._id;
    productId = targetDoc.listingId._id;
  }

  // Check if user already reviewed this specific target
  const existingReviewQuery = {
    fromUserId: req.user._id,
    reviewType: reviewType,
  };

  if (reviewType === "sample") {
    existingReviewQuery.sampleId = targetId;
  } else {
    existingReviewQuery.orderId = targetId;
  }

  console.log(
    "🔍 Checking for existing review with query:",
    existingReviewQuery
  );
  const existingReview = await Review.findOne(existingReviewQuery);

  if (existingReview) {
    console.log("❌ Found existing review:", existingReview._id);
    throw new ApiError(400, `You have already reviewed this ${reviewType}`);
  }

  console.log("✅ No existing review found, proceeding to create new review");

  // Create review with explicit field assignment
  const reviewData = {
    fromUserId: req.user._id,
    toUserId,
    reviewType,
    rating,
    comment,
    categories: {
      quality: categories.quality || rating,
      delivery: categories.delivery || rating,
      communication: categories.communication || rating,
      value: categories.value || rating,
    },
  };

  // Add the specific ID field based on review type
  if (reviewType === "sample") {
    reviewData.sampleId = targetId;
  } else {
    reviewData.orderId = targetId;
  }

  const review = new Review(reviewData);

  await review.save();

  // Create notification for the reviewed user
  try {
    const Notification = require("../models/Notification.model");
    const User = require("../models/User.model");

    // Get the full user details to ensure we have name/username
    const fromUser = await User.findById(req.user._id).select("name username");
    const displayName = fromUser.name || fromUser.username || "Someone";

    await Notification.create({
      userId: toUserId,
      type: "review_received",
      title: "New Review Received",
      message: `${displayName} left a ${rating}-star review for your ${reviewType}`,
      data: {
        reviewId: review._id,
        fromUserId: req.user._id,
        fromUserName: displayName,
        rating,
        reviewType,
        targetId,
        comment:
          comment.substring(0, 100) + (comment.length > 100 ? "..." : ""),
      },
      actionRequired: false,
      priority: rating >= 4 ? "medium" : rating >= 3 ? "low" : "high",
      category: "order",
    });

    // Also send real-time notification via socket if available
    if (global.notificationService) {
      await global.notificationService.notifyReviewReceived(toUserId, {
        reviewId: review._id,
        fromUserName: displayName,
        rating,
        reviewType,
        comment:
          comment.substring(0, 100) + (comment.length > 100 ? "..." : ""),
      });
    }

    console.log("✅ Review notification created successfully");
  } catch (notificationError) {
    console.error(
      "❌ Failed to create review notification:",
      notificationError
    );
    // Don't fail the review creation if notification fails
  }

  // Populate review for response
  await review.populate([
    { path: "fromUserId", select: "name username" },
    { path: "toUserId", select: "name username rating trustScore" },
  ]);

  res
    .status(201)
    .json(
      new ApiResponse(201, review, `${reviewType} review created successfully`)
    );
});

// Get reviews for a user (reviews they received)
const getUserReviews = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 10, reviewType } = req.query;

  const filter = { toUserId: userId, isVerified: true };
  if (reviewType) filter.reviewType = reviewType;

  const skip = (page - 1) * limit;

  const reviews = await Review.find(filter)
    .populate("fromUserId", "name username")
    .populate({
      path: "sampleId",
      select: "itemName category type productDetails",
      populate: {
        path: "productDetails.productId",
        select: "itemName imageUrl",
      },
    })
    .populate({
      path: "orderId",
      select: "itemName productSnapshot",
      populate: {
        path: "listingId",
        select: "itemName imageUrl",
      },
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Review.countDocuments(filter);

  // Enhanced reviews with product info
  const enhancedReviews = reviews.map((review) => {
    const reviewObj = review.toObject();

    if (review.sampleId) {
      reviewObj.productInfo = {
        name: review.sampleId.itemName,
        category: review.sampleId.category,
        type: review.sampleId.type,
        image: review.sampleId.productDetails?.productId?.imageUrl,
      };
    } else if (review.orderId) {
      reviewObj.productInfo = {
        name: review.orderId.itemName,
        image: review.orderId.listingId?.imageUrl,
        snapshot: review.orderId.productSnapshot,
      };
    }

    reviewObj.daysAgo = Math.floor(
      (new Date() - review.createdAt) / (1000 * 60 * 60 * 24)
    );
    return reviewObj;
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        reviews: enhancedReviews,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
      "User reviews fetched successfully"
    )
  );
});

// Get reviews for a product (sample or order reviews for a specific product)
const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { page = 1, limit = 10, reviewType } = req.query;

  const skip = (page - 1) * limit;

  let reviews = [];
  let total = 0;

  if (!reviewType || reviewType === "sample") {
    // Get sample reviews for this product
    const sampleReviews = await Review.find({
      reviewType: "sample",
      isVerified: true,
    })
      .populate({
        path: "sampleId",
        match: { "productDetails.productId": productId },
        select: "itemName category type quantity unit",
      })
      .populate("fromUserId", "name username")
      .sort({ createdAt: -1 });

    reviews = reviews.concat(sampleReviews.filter((r) => r.sampleId));
  }

  if (!reviewType || reviewType === "order") {
    // Get order reviews for this product
    const orderReviews = await Review.find({
      reviewType: "order",
      isVerified: true,
    })
      .populate({
        path: "orderId",
        match: { listingId: productId },
        select: "itemName quantity unit totalPrice",
      })
      .populate("fromUserId", "name username")
      .sort({ createdAt: -1 });

    reviews = reviews.concat(orderReviews.filter((r) => r.orderId));
  }

  // Sort all reviews by date
  reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  total = reviews.length;
  reviews = reviews.slice(skip, skip + Number(limit));

  // Enhanced reviews
  const enhancedReviews = reviews.map((review) => {
    const reviewObj = review.toObject();
    reviewObj.daysAgo = Math.floor(
      (new Date() - review.createdAt) / (1000 * 60 * 60 * 24)
    );

    if (review.sampleId) {
      reviewObj.purchaseInfo = {
        type: "sample",
        quantity: review.sampleId.quantity,
        unit: review.sampleId.unit,
      };
    } else if (review.orderId) {
      reviewObj.purchaseInfo = {
        type: "order",
        quantity: review.orderId.quantity,
        unit: review.orderId.unit,
        amount: review.orderId.totalPrice,
      };
    }

    return reviewObj;
  });

  // Calculate review statistics
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  const ratingDistribution = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  res.status(200).json(
    new ApiResponse(
      200,
      {
        reviews: enhancedReviews,
        statistics: {
          averageRating: parseFloat(avgRating),
          totalReviews: total,
          ratingDistribution,
        },
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
      "Product reviews fetched successfully"
    )
  );
});

// Get reviewable items for user (samples and orders that can be reviewed)
const getReviewableItems = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get reviewable samples
  const reviewableSamples = await Sample.find({
    receiverId: userId,
    status: "received",
    isReviewed: false,
  })
    .populate("supplierId", "name username")
    .populate({
      path: "productDetails.productId",
      select: "itemName imageUrl",
    })
    .sort({ createdAt: -1 });

  // Get reviewable orders
  const reviewableOrders = await Order.find({
    buyerId: userId,
    status: "completed",
    isReviewable: true,
    reviewId: { $exists: false },
  })
    .populate("sellerId", "name username")
    .populate("listingId", "itemName imageUrl")
    .sort({ createdAt: -1 });

  const reviewableItems = {
    samples: reviewableSamples.map((sample) => ({
      _id: sample._id,
      type: "sample",
      itemName: sample.itemName,
      imageUrl: sample.imageUrl,
      supplier: sample.supplierId,
      quantity: sample.quantity,
      unit: sample.unit,
      createdAt: sample.createdAt,
      daysAgo: Math.floor(
        (new Date() - sample.createdAt) / (1000 * 60 * 60 * 24)
      ),
    })),
    orders: reviewableOrders.map((order) => ({
      _id: order._id,
      type: "order",
      itemName: order.itemName,
      imageUrl: order.listingId?.imageUrl,
      seller: order.sellerId,
      quantity: order.quantity,
      unit: order.unit,
      totalPrice: order.totalPrice,
      createdAt: order.createdAt,
      daysAgo: Math.floor(
        (new Date() - order.createdAt) / (1000 * 60 * 60 * 24)
      ),
    })),
  };

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        reviewableItems,
        "Reviewable items fetched successfully"
      )
    );
});

// Mark review as helpful/not helpful
const markReviewHelpful = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { helpful } = req.body; // true for helpful, false for not helpful

  const review = await Review.findById(reviewId);
  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  if (helpful) {
    review.isHelpful.helpfulCount += 1;
  } else {
    review.isHelpful.notHelpfulCount += 1;
  }

  await review.save();

  res.status(200).json(
    new ApiResponse(
      200,
      {
        helpfulCount: review.isHelpful.helpfulCount,
        notHelpfulCount: review.isHelpful.notHelpfulCount,
      },
      "Review feedback recorded"
    )
  );
});

// Get user's given reviews (reviews they wrote)
const getUserGivenReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, reviewType } = req.query;

  const filter = { fromUserId: req.user._id };
  if (reviewType) filter.reviewType = reviewType;

  const skip = (page - 1) * limit;

  const reviews = await Review.find(filter)
    .populate("toUserId", "name username")
    .populate({
      path: "sampleId",
      select: "itemName category type",
      populate: {
        path: "productDetails.productId",
        select: "itemName imageUrl",
      },
    })
    .populate({
      path: "orderId",
      select: "itemName",
      populate: {
        path: "listingId",
        select: "itemName imageUrl",
      },
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Review.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        reviews,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
      "User given reviews fetched successfully"
    )
  );
});

// Get reviews for a specific seller
const getSellerReviews = asyncHandler(async (req, res) => {
  const { sellerId } = req.params;
  const { page = 1, limit = 10, reviewType } = req.query;

  const filter = { toUserId: sellerId, isVerified: true };
  if (reviewType) filter.reviewType = reviewType;

  const skip = (page - 1) * limit;

  const reviews = await Review.find(filter)
    .populate("fromUserId", "name username")
    .populate({
      path: "sampleId",
      select: "itemName category type productDetails",
      populate: {
        path: "productDetails.productId",
        select: "itemName imageUrl",
      },
    })
    .populate({
      path: "orderId",
      select: "itemName productSnapshot",
      populate: {
        path: "listingId",
        select: "itemName imageUrl",
      },
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Review.countDocuments(filter);

  // Calculate average rating and distribution
  const ratingStats = await Review.aggregate([
    { $match: filter },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: "$rating",
        },
      },
    },
  ]);

  // Calculate rating distribution
  let distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  if (ratingStats.length > 0) {
    ratingStats[0].ratingDistribution.forEach((rating) => {
      if (distribution.hasOwnProperty(rating)) {
        distribution[rating]++;
      }
    });
  }

  const stats =
    ratingStats.length > 0
      ? {
          averageRating: Number(ratingStats[0].averageRating.toFixed(1)),
          totalReviews: ratingStats[0].totalReviews,
          ratingDistribution: distribution,
        }
      : {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: distribution,
        };

  res.status(200).json(
    new ApiResponse(
      200,
      {
        reviews,
        stats,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
      "Seller reviews retrieved successfully"
    )
  );
});

// Delete a review (only the author can delete their own review)
const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  const review = await Review.findById(reviewId);
  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  // Check if the current user is the author of the review
  if (review.fromUserId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own reviews");
  }

  // If this is an order review, remove the reviewId reference from the order
  if (review.orderId) {
    const Order = require("../models/Order.model");
    await Order.findByIdAndUpdate(review.orderId, {
      $unset: { reviewId: 1 },
      isReviewable: true,
    });
  }

  // If this is a sample review, update the sample status
  if (review.sampleId) {
    const Sample = require("../models/Sample.model");
    await Sample.findByIdAndUpdate(review.sampleId, {
      isReviewed: false,
      $unset: { reviewId: 1 },
      status: "received",
    });
  }

  // Delete the review
  await Review.findByIdAndDelete(reviewId);

  // Recalculate the reviewed user's rating
  const User = require("../models/User.model");
  const remainingReviews = await Review.find({
    toUserId: review.toUserId,
    isVerified: true,
  });

  if (remainingReviews.length > 0) {
    const avgRating =
      remainingReviews.reduce((sum, r) => sum + r.rating, 0) /
      remainingReviews.length;
    await User.findByIdAndUpdate(review.toUserId, {
      rating: Math.round(avgRating * 10) / 10,
      $inc: { trustScore: review.reviewType === "sample" ? -2 : -1 },
    });
  } else {
    // No reviews left, reset rating
    await User.findByIdAndUpdate(review.toUserId, {
      rating: 0,
      $inc: { trustScore: review.reviewType === "sample" ? -2 : -1 },
    });
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, "Review deleted successfully"));
});

module.exports = {
  createReview,
  getUserReviews,
  getProductReviews,
  getReviewableItems,
  markReviewHelpful,
  getUserGivenReviews,
  getSellerReviews,
  deleteReview,
};
