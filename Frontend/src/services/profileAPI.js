import apiClient from "../api/axios";

// =============================================================================
// USER PROFILE API
// =============================================================================
export const profileAPI = {
  // Get user profile with statistics
  getUserProfile: async (userId = null) => {
    try {
      const endpoint = userId
        ? `/profile/statistics/${userId}`
        : "/profile/statistics";
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (profileData) => {
    try {
      const response = await apiClient.put("/profile/update", profileData);
      return response.data;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  },

  // Upload profile picture
  uploadProfilePicture: async (file) => {
    try {
      const formData = new FormData();
      formData.append("profilePicture", file);
      const response = await apiClient.post(
        "/profile/upload/profile",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      throw error;
    }
  },

  // Upload cover image
  uploadCoverImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append("coverImage", file);
      const response = await apiClient.post("/profile/upload/cover", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading cover image:", error);
      throw error;
    }
  },

  // Get connections
  getConnections: async () => {
    try {
      const response = await apiClient.get("/profile/connections");
      return response.data;
    } catch (error) {
      console.error("Error fetching connections:", error);
      throw error;
    }
  },

  // Send connection request
  sendConnectionRequest: async (userId) => {
    try {
      const response = await apiClient.post(
        `/profile/connections/request/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error sending connection request:", error);
      throw error;
    }
  },

  // Respond to connection request
  respondToConnectionRequest: async (requestId, action) => {
    try {
      const response = await apiClient.put(
        `/profile/connections/respond/${requestId}`,
        { action }
      );
      return response.data;
    } catch (error) {
      console.error("Error responding to connection request:", error);
      throw error;
    }
  },

  // Get connection suggestions
  getConnectionSuggestions: async () => {
    try {
      const response = await apiClient.get("/profile/suggestions/connections");
      return response.data;
    } catch (error) {
      console.error("Error fetching connection suggestions:", error);
      throw error;
    }
  },

  // Get user order history
  getUserOrderHistory: async () => {
    try {
      const response = await apiClient.get("/profile/orders");
      return response.data;
    } catch (error) {
      console.error("Error fetching order history:", error);
      throw error;
    }
  },

  // Get user product listings
  getUserProductListings: async () => {
    try {
      const response = await apiClient.get("/profile/listings");
      return response.data;
    } catch (error) {
      console.error("Error fetching product listings:", error);
      throw error;
    }
  },

  // Get user notifications summary
  getNotificationSummary: async () => {
    try {
      const response = await apiClient.get("/profile/notifications/summary");
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  // Get user reviews
  getUserReviews: async () => {
    try {
      const response = await apiClient.get("/profile/reviews");
      return response.data;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }
  },

  // Get user material requests
  getUserMaterialRequests: async () => {
    try {
      const response = await apiClient.get("/profile/material-requests");
      return response.data;
    } catch (error) {
      console.error("Error fetching material requests:", error);
      throw error;
    }
  },

  // Get user negotiations
  getUserNegotiations: async () => {
    try {
      const response = await apiClient.get("/profile/negotiations");
      return response.data;
    } catch (error) {
      console.error("Error fetching negotiations:", error);
      throw error;
    }
  },
};

export default profileAPI;
