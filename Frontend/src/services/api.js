import apiClient from "../api/axios";

// User Profile API functions
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
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading profile picture:", error);
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
};

// Export other API categories here as you build them
export default {
  profile: profileAPI,
};
