import apiClient from "../api/axios";

// =============================================================================
// USER AUTHENTICATION API
// =============================================================================
export const authAPI = {
  // User registration
  register: async (userData) => {
    try {
      const response = await apiClient.post("/users/register", userData);
      return response.data;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  },

  // User login
  login: async (credentials) => {
    try {
      const response = await apiClient.post("/users/login", credentials);
      return response.data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  },

  // User logout
  logout: async () => {
    try {
      const response = await apiClient.post("/users/logout");
      return response.data;
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await apiClient.post("/users/refresh-token");
      return response.data;
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get("/users/get-user");
      return response.data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  },

  // Update account details
  updateAccount: async (accountData) => {
    try {
      const response = await apiClient.patch(
        "/users/update-account",
        accountData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating account:", error);
      throw error;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await apiClient.patch(
        "/users/change-password",
        passwordData
      );
      return response.data;
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  },

  // Upload avatar
  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const response = await apiClient.patch("/users/change-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      throw error;
    }
  },

  // Upload cover images
  uploadCoverImages: async (files) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("cover images", file);
      });
      const response = await apiClient.patch(
        "/users/change-cover-images",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading cover images:", error);
      throw error;
    }
  },

  // OTP Services
  sendVerificationOTP: async (email) => {
    try {
      const response = await apiClient.post("/users/send-verification-otp", {
        email,
      });
      return response.data;
    } catch (error) {
      console.error("Error sending verification OTP:", error);
      throw error;
    }
  },

  verifyEmailOTP: async (otpData) => {
    try {
      const response = await apiClient.post("/users/verify-email-otp", otpData);
      return response.data;
    } catch (error) {
      console.error("Error verifying email OTP:", error);
      throw error;
    }
  },

  resendVerificationOTP: async (email) => {
    try {
      const response = await apiClient.post("/users/resend-verification-otp", {
        email,
      });
      return response.data;
    } catch (error) {
      console.error("Error resending verification OTP:", error);
      throw error;
    }
  },

  sendSigninOTP: async (email) => {
    try {
      const response = await apiClient.post("/users/send-signin-otp", {
        email,
      });
      return response.data;
    } catch (error) {
      console.error("Error sending signin OTP:", error);
      throw error;
    }
  },

  verifySigninOTP: async (otpData) => {
    try {
      const response = await apiClient.post(
        "/users/verify-signin-otp",
        otpData
      );
      return response.data;
    } catch (error) {
      console.error("Error verifying signin OTP:", error);
      throw error;
    }
  },

  resendSigninOTP: async (email) => {
    try {
      const response = await apiClient.post("/users/resend-signin-otp", {
        email,
      });
      return response.data;
    } catch (error) {
      console.error("Error resending signin OTP:", error);
      throw error;
    }
  },
};

export default authAPI;
