import apiClient from "../api/axios";

// =============================================================================
// REVIEWS API
// =============================================================================
export const reviewsAPI = {
  // Submit review
  submitReview: async (reviewData) => {
    try {
      const response = await apiClient.post("/reviews/create", reviewData);
      return response.data;
    } catch (error) {
      console.error("Error submitting review:", error);
      throw error;
    }
  },

  // Get user's reviews
  getUserReviews: async (filters = {}) => {
    try {
      const response = await apiClient.get("/reviews/my-reviews", {
        params: filters,
      });
      console.log(response.data); // Debugging line to log response data
      return response.data;
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      throw error;
    }
  },

  // Get received reviews (for sellers)
  getReceivedReviews: async (filters = {}) => {
    try {
      const response = await apiClient.get("/reviews/received", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching received reviews:", error);
      throw error;
    }
  },

  // Get all reviews for a specific product/listing
  getProductReviews: async (productId) => {
    try {
      const response = await apiClient.get(`/reviews/product/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching product reviews:", error);
      throw error;
    }
  },

  // Get all reviews for a specific seller
  getSellerReviews: async (sellerId) => {
    try {
      const response = await apiClient.get(`/reviews/seller/${sellerId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching seller reviews:", error);
      throw error;
    }
  },

  // Get reviewable items for the current user
  getReviewableItems: async () => {
    try {
      const response = await apiClient.get("/reviews/reviewable");
      return response.data;
    } catch (error) {
      console.error("Error fetching reviewable items:", error);
      throw error;
    }
  },

  // Get review by ID
  getReviewById: async (reviewId) => {
    try {
      const response = await apiClient.get(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching review:", error);
      throw error;
    }
  },

  // Update review
  updateReview: async (reviewId, reviewData) => {
    try {
      const response = await apiClient.put(`/reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      console.error("Error updating review:", error);
      throw error;
    }
  },

  // Delete review
  deleteReview: async (reviewId) => {
    try {
      console.log("🗑️ reviewsAPI.deleteReview called with ID:", reviewId);
      const response = await apiClient.delete(`/reviews/${reviewId}`);
      console.log("✅ Delete review API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error in reviewsAPI.deleteReview:", error);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);
      throw error;
    }
  },

  // Get review statistics
  getReviewStats: async (sellerId) => {
    try {
      const response = await apiClient.get(`/reviews/stats/${sellerId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching review statistics:", error);
      throw error;
    }
  },

  // Rate review (helpful/not helpful)
  rateReview: async (reviewId, rating) => {
    try {
      const response = await apiClient.post(`/reviews/${reviewId}/rate`, {
        rating,
      });
      return response.data;
    } catch (error) {
      console.error("Error rating review:", error);
      throw error;
    }
  },

  // Get trending reviews
  getTrendingReviews: async (filters = {}) => {
    try {
      const response = await apiClient.get("/reviews/trending", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching trending reviews:", error);
      throw error;
    }
  },
};

export default reviewsAPI;
