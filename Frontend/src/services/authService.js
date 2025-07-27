import apiClient from "../api/axios";

// Auth API endpoints
const authAPI = {
  // Email verification for signup
  sendVerificationOTP: async (email, username) => {
    const response = await apiClient.post("/users/send-verification-otp", {
      email,
      username,
    });
    return response.data;
  },

  verifyEmailOTP: async (email, otp) => {
    const response = await apiClient.post("/users/verify-email-otp", {
      email,
      otp,
    });
    return response.data;
  },

  resendVerificationOTP: async (email, username) => {
    const response = await apiClient.post("/users/resend-verification-otp", {
      email,
      username,
    });
    return response.data;
  },

  // User registration
  register: async (userData) => {
    const response = await apiClient.post("/users/register", userData);
    return response.data;
  },

  // Email/Username & Password signin
  loginWithPassword: async (emailOrUsername, password) => {
    // Determine if the input is an email or username
    const isEmail = emailOrUsername.includes("@");

    const loginData = {
      password,
    };

    // Set either email or username based on the input
    if (isEmail) {
      loginData.email = emailOrUsername;
    } else {
      loginData.username = emailOrUsername;
    }

    const response = await apiClient.post("/users/login", loginData);
    return response.data;
  },

  // Email OTP signin
  sendSigninOTP: async (email) => {
    const response = await apiClient.post("/users/send-signin-otp", {
      email,
    });
    console.log(response);
    return response.data;
  },

  verifySigninOTP: async (email, otp) => {
    const response = await apiClient.post("/users/verify-signin-otp", {
      email,
      otp,
    });
    return response.data;
  },

  resendSigninOTP: async (email) => {
    const response = await apiClient.post("/users/resend-signin-otp", {
      email,
    });
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await apiClient.post("/users/logout");
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await apiClient.get("/users/get-user");
    return response.data;
  },

  // Update account details
  updateAccountDetails: async (userData) => {
    const response = await apiClient.patch("/users/update-account", userData);
    return response.data;
  },

  // Change password
  changePassword: async (oldPassword, newPassword) => {
    const response = await apiClient.patch("/users/change-password", {
      oldPassword,
      newPassword,
    });
    return response.data;
  },

  // Refresh token
  refreshToken: async () => {
    const response = await apiClient.post("/users/refresh-token");
    return response.data;
  },
};

export default authAPI;
