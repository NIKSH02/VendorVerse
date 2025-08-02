import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  Star,
  Send,
  Package,
  User,
  Calendar,
  MessageSquare,
  Trash2,
} from "lucide-react";
import { useOrders } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";
import { reviewsAPI } from "../services/reviewsAPI";
import toast from "react-hot-toast";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const Reviews = () => {
  const { reviewableOrders, fetchReviewableOrders } = useOrders();
  const { user } = useAuth(); // Get current user info
  const [activeTab, setActiveTab] = useState("write"); // "write" or "my-reviews"
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingReview, setDeletingReview] = useState(null);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  // Review form state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Fetch user's reviews
  const fetchUserReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewsAPI.getUserReviews();
      console.log("User reviews response:", response);
      // The reviews are nested under response.data.reviews
      const reviews = response?.data?.reviews || [];
      setUserReviews(Array.isArray(reviews) ? reviews : []);
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      setUserReviews([]); // Set empty array on error
      toast.error("Failed to fetch your reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewableOrders();
    fetchUserReviews();
  }, []);

  const handleSubmitReview = async () => {
    if (!selectedOrder) return;

    if (!reviewText.trim()) {
      toast.error("Please write a review");
      return;
    }

    try {
      setSubmitting(true);

      console.log("Selected Order:", selectedOrder);
      console.log("Current User:", user);
      console.log("Current User ID:", user?._id);
      console.log(
        "Selected Order ID:",
        selectedOrder?._id || selectedOrder?.orderId
      );
      console.log("Order structure keys:", Object.keys(selectedOrder));

      const targetId = selectedOrder._id || selectedOrder.orderId;
      console.log("Target ID to be sent:", targetId);

      const reviewData = {
        reviewType: "order",
        targetId: targetId,
        rating,
        comment: reviewText.trim(),
        categories: {
          quality: rating,
          delivery: rating,
          communication: rating,
          value: rating,
        },
      };

      console.log("Review Data being sent:", reviewData);

      await reviewsAPI.submitReview(reviewData);

      // Reset form
      setSelectedOrder(null);
      setRating(5);
      setReviewText("");
      setShowReviewForm(false);

      // Refresh data
      await Promise.all([fetchReviewableOrders(), fetchUserReviews()]);

      toast.success("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const startReview = (order) => {
    setSelectedOrder(order);
    setRating(5);
    setReviewText("");
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId) => {
    console.log("🗑️ Delete button clicked for review ID:", reviewId);

    // Temporarily bypass toast confirmation for debugging
    if (window.confirm("Are you sure you want to delete this review?")) {
      console.log("✅ User confirmed delete, calling confirmDeleteReview...");
      await confirmDeleteReview(reviewId);
    } else {
      console.log("❌ User cancelled delete");
    }
  };

  const confirmDeleteReview = async (reviewId) => {
    console.log("🔥 Starting delete process for review:", reviewId);
    console.log("🔍 Review ID type:", typeof reviewId);
    console.log("🔍 Review ID length:", reviewId.length);

    try {
      setDeletingReview(reviewId);
      console.log("📡 Calling reviewsAPI.deleteReview...");
      console.log("📡 Full API URL will be: /reviews/" + reviewId);

      const result = await reviewsAPI.deleteReview(reviewId);
      console.log("✅ Delete API response:", result);

      // Remove the review from local state
      setUserReviews((prevReviews) =>
        prevReviews.filter((review) => review._id !== reviewId)
      );

      // Refresh reviewable orders as the deleted review might make an order reviewable again
      await fetchReviewableOrders();

      toast.success("Review deleted successfully!");
    } catch (error) {
      console.error("❌ Error deleting review:", error);
      console.error("❌ Error details:", error.response?.data || error.message);
      console.error("❌ Error status:", error.response?.status);
      console.error("❌ Full error object:", error);
      toast.error(
        `Failed to delete review: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setDeletingReview(null);
      setReviewToDelete(null);
    }
  };

  const renderStars = (
    currentRating,
    interactive = false,
    onRatingChange = null
  ) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() =>
              interactive && onRatingChange && onRatingChange(star)
            }
            disabled={!interactive}
            className={`${
              interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
            } transition-transform`}
          >
            <Star
              size={interactive ? 24 : 16}
              fill={star <= currentRating ? "currentColor" : "none"}
              className={`${
                star <= currentRating ? "text-yellow-400" : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <motion.div
        className="space-y-6"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-2xl font-bold text-gray-800"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          Reviews
        </motion.h1>

        {/* Tab Navigation */}
        <div className="flex space-x-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("write")}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
              activeTab === "write"
                ? "text-orange-600 border-b-2 border-orange-600 bg-orange-50"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Write Reviews ({reviewableOrders.length})
          </button>
          <button
            onClick={() => setActiveTab("my-reviews")}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
              activeTab === "my-reviews"
                ? "text-orange-600 border-b-2 border-orange-600 bg-orange-50"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            My Reviews ({userReviews.length})
          </button>
        </div>

        {/* Write Reviews Tab */}
        {activeTab === "write" && (
          <motion.div
            key="write-reviews"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {reviewableOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No Orders to Review
                </h3>
                <p className="text-gray-500">
                  Complete some orders to leave reviews for sellers.
                </p>
              </div>
            ) : (
              <motion.div
                className="space-y-4"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {reviewableOrders.map((order, index) => (
                  <motion.div
                    key={order._id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                    variants={fadeInUp}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {order.itemName}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Package
                              size={16}
                              className="mr-2 text-orange-500"
                            />
                            <span>
                              Quantity: {order.quantity} {order.unit}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <User size={16} className="mr-2 text-blue-500" />
                            <span>
                              Seller:{" "}
                              {order.sellerId?.name || order.sellerId?.username}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Calendar
                              size={16}
                              className="mr-2 text-green-500"
                            />
                            <span>
                              Completed:{" "}
                              {new Date(
                                order.completedAt || order.updatedAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">
                              Total: ₹{order.totalPrice}
                            </span>
                          </div>
                        </div>
                      </div>

                      <motion.button
                        onClick={() => startReview(order)}
                        className="flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Star size={16} />
                        <span>Write Review</span>
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* My Reviews Tab */}
        {activeTab === "my-reviews" && (
          <motion.div
            key="my-reviews"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              </div>
            ) : !Array.isArray(userReviews) || userReviews.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare
                  size={48}
                  className="text-gray-400 mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No Reviews Yet
                </h3>
                <p className="text-gray-500">
                  Your submitted reviews will appear here.
                </p>
              </div>
            ) : (
              <motion.div
                className="space-y-4"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {Array.isArray(userReviews) &&
                  userReviews.map((review, index) => (
                    <motion.div
                      key={review._id}
                      className="bg-white border border-gray-200 rounded-lg p-6"
                      variants={fadeInUp}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {review.orderId?.itemName || "Product Review"}
                            </h3>
                            {renderStars(review.rating)}
                          </div>
                          <p className="text-gray-700 mb-3">{review.comment}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>
                              Seller:{" "}
                              {review.toUserId?.name ||
                                review.toUserId?.username}
                            </span>
                            <span>•</span>
                            <span>
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Delete Button */}
                        <motion.button
                          onClick={() => handleDeleteReview(review._id)}
                          disabled={deletingReview === review._id}
                          className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-red-200 hover:border-red-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title="Delete Review"
                        >
                          {deletingReview === review._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <Trash2 size={16} />
                          )}
                          <span className="text-sm">
                            {deletingReview === review._id
                              ? "Deleting..."
                              : "Delete"}
                          </span>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Review Form Modal */}
        <AnimatePresence>
          {showReviewForm && selectedOrder && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReviewForm(false)}
            >
              <motion.div
                className="bg-white rounded-lg max-w-md w-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Write a Review
                  </h3>
                  <p className="text-gray-600 mt-1">{selectedOrder.itemName}</p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Rating
                    </label>
                    {renderStars(rating, true, setRating)}
                  </div>

                  {/* Review Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                      placeholder="Share your experience with this product and seller..."
                    />
                  </div>

                  {/* Order Details */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-2">
                      Order Details
                    </h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        Quantity: {selectedOrder.quantity} {selectedOrder.unit}
                      </p>
                      <p>Seller: {selectedOrder.sellerId?.name}</p>
                      <p>Total: ₹{selectedOrder.totalPrice}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200 flex space-x-3">
                  <motion.button
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setShowReviewForm(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    onClick={handleSubmitReview}
                    disabled={submitting || !reviewText.trim()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Send size={16} />
                    <span>
                      {submitting ? "Submitting..." : "Submit Review"}
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </DashboardLayout>
  );
};

export default Reviews;
