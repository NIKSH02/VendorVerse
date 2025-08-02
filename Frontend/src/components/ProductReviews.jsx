import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, User, Calendar, MessageSquare } from "lucide-react";
import { reviewsAPI } from "../services/reviewsAPI";
import toast from "react-hot-toast";

const ProductReviews = ({
  listingId,
  sellerId,
  showFullReviews,
  onToggleReviews,
}) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reviewStats, setReviewStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });

  // Fetch reviews for this product/seller
  const fetchProductReviews = async () => {
    if (!listingId && !sellerId) return;

    try {
      setLoading(true);
      let response;

      // Try to get reviews by listingId first, fallback to sellerId
      if (listingId) {
        response = await reviewsAPI.getProductReviews(listingId);
      } else if (sellerId) {
        response = await reviewsAPI.getSellerReviews(sellerId);
      }

      console.log("Product reviews response:", response);

      const fetchedReviews = response?.data?.reviews || response?.data || [];
      setReviews(Array.isArray(fetchedReviews) ? fetchedReviews : []);

      // Calculate review statistics
      if (fetchedReviews.length > 0) {
        const totalReviews = fetchedReviews.length;
        const totalRating = fetchedReviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        const averageRating = totalRating / totalReviews;

        // Calculate rating distribution
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        fetchedReviews.forEach((review) => {
          if (distribution.hasOwnProperty(review.rating)) {
            distribution[review.rating]++;
          }
        });

        setReviewStats({
          totalReviews,
          averageRating,
          ratingDistribution: distribution,
        });
      } else {
        setReviewStats({
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        });
      }
    } catch (error) {
      console.error("Error fetching product reviews:", error);
      setReviews([]);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductReviews();
  }, [listingId, sellerId]);

  // Render star rating
  const renderStars = (rating, size = 16) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            fill={star <= rating ? "currentColor" : "none"}
            className={`${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="border-t border-gray-200 p-6 lg:p-8">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Customer Reviews</h3>
          {reviewStats.totalReviews > 0 && (
            <div className="flex items-center mt-2">
              {renderStars(Math.round(reviewStats.averageRating), 20)}
              <span className="ml-2 text-lg font-semibold text-gray-700">
                {reviewStats.averageRating.toFixed(1)}
              </span>
              <span className="ml-1 text-gray-500">
                ({reviewStats.totalReviews} review
                {reviewStats.totalReviews !== 1 ? "s" : ""})
              </span>
            </div>
          )}
        </div>

        {reviewStats.totalReviews > 0 && (
          <button
            onClick={onToggleReviews}
            className="flex items-center text-orange-600 hover:text-orange-700 font-semibold transition-colors"
          >
            <Star size={18} className="mr-2" fill="currentColor" />
            {showFullReviews ? "Hide" : "Show"} All Reviews
          </button>
        )}
      </div>

      {reviewStats.totalReviews === 0 ? (
        <div className="text-center py-12">
          <MessageSquare size={48} className="text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-600 mb-2">
            No Reviews Yet
          </h4>
          <p className="text-gray-500">
            Be the first to review this product after making a purchase.
          </p>
        </div>
      ) : (
        <>
          {/* Rating Distribution (shown only when there are reviews) */}
          {showFullReviews && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 p-4 bg-gray-50 rounded-lg"
            >
              <h4 className="font-semibold text-gray-800 mb-4">
                Rating Breakdown
              </h4>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center text-sm">
                    <span className="w-2 text-gray-600">{rating}</span>
                    <Star
                      size={14}
                      className="mx-2 text-yellow-400"
                      fill="currentColor"
                    />
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            reviewStats.totalReviews > 0
                              ? (reviewStats.ratingDistribution[rating] /
                                  reviewStats.totalReviews) *
                                100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="w-8 text-right text-gray-600">
                      {reviewStats.ratingDistribution[rating]}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Reviews List */}
          <AnimatePresence>
            {showFullReviews && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 overflow-hidden"
              >
                {reviews.map((review, index) => (
                  <motion.div
                    key={review._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 p-6 rounded-xl border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                          <User size={20} className="text-orange-600" />
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900">
                            {review.fromUserId?.name ||
                              review.fromUserId?.username ||
                              "Anonymous Buyer"}
                          </span>
                          <div className="flex items-center mt-1">
                            {renderStars(review.rating)}
                            <span className="ml-2 text-sm text-gray-500">
                              ({review.rating}/5)
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={14} className="mr-1" />
                        {formatDate(review.createdAt)}
                      </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed">
                      {review.comment}
                    </p>

                    {/* Show order info if available */}
                    {review.orderId && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                          Verified Purchase:{" "}
                          {review.orderId.itemName || "Product"}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default ProductReviews;
