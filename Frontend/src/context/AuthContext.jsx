import React, { createContext, useState, useEffect } from "react";
import authAPI from "../services/authService";

// Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      console.log("AuthContext: Initializing auth...");
      const token = localStorage.getItem("accessToken");
      const savedUser = localStorage.getItem("user");

      if (token && savedUser) {
        try {
          console.log("AuthContext: Found token and saved user, verifying...");
          const response = await authAPI.getCurrentUser();
          console.log("AuthContext: Server verification successful");

          // Backend returns: { status, data: user, message, success }
          const currentUser = response.data || response; // Handle both possible structures
          setUser(currentUser);
          setIsAuthenticated(true);
          localStorage.setItem("user", JSON.stringify(currentUser));
        } catch (error) {
          console.log("AuthContext: Server verification failed:", error);

          // Only logout if it's definitely an auth error (401/403)
          if (
            error.response?.status === 401 ||
            error.response?.status === 403
          ) {
            console.log("AuthContext: Invalid token, clearing auth");
            clearAuth();
          } else {
            // For network errors, restore from localStorage
            console.log(
              "AuthContext: Network error, restoring from localStorage"
            );
            try {
              const parsedUser = JSON.parse(savedUser);
              setUser(parsedUser);
              setIsAuthenticated(true);
              // Clear potentially invalid token
              localStorage.removeItem("accessToken");
            } catch {
              console.log("AuthContext: Failed to parse saved user");
              clearAuth();
            }
          }
        }
      } else {
        console.log("AuthContext: No token or saved user found");
      }

      setIsLoading(false);
      console.log("AuthContext: Initialization complete");
    };

    initializeAuth();
  }, []);

  // Helper function to clear auth state
  const clearAuth = () => {
    console.log("AuthContext: Clearing auth state");
    setUser(null);
    setIsAuthenticated(false);
    setIsEmailVerified(false);
    setEmailVerificationSent(false);
    setIsVerifyingOtp(false);
    setError(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  };

  // Helper function to set authenticated user
  const setAuthenticatedUser = (userData, token = null) => {
    console.log("AuthContext: Setting authenticated user");
    setUser(userData);
    setIsAuthenticated(true);
    setError(null);

    if (token) {
      localStorage.setItem("accessToken", token);
    }
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Email verification functions (Signup)
  const sendVerificationOTP = async (email, username) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authAPI.sendVerificationOTP(email, username);
      setEmailVerificationSent(true);
      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to send verification OTP";
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmailOTP = async (verificationData) => {
    try {
      setIsVerifyingOtp(true);
      setError(null);

      // verificationData now contains: { email, otp, username, password, name, fullname }
      const response = await authAPI.verifyEmailOTP(verificationData);

      // Since verification now includes registration, handle user login
      // Backend returns: { status, data: { user, accessToken, refreshToken }, message, success }
      const responseData = response.data || response; // Handle both possible structures
      if (responseData && responseData.user) {
        setUser(responseData.user);
        setIsAuthenticated(true); // Fixed: was setIsLoggedIn(true)
        setIsEmailVerified(true);

        // Store tokens if provided
        if (responseData.accessToken) {
          localStorage.setItem("accessToken", responseData.accessToken);
        }

        console.log(
          "User verified and registered successfully:",
          responseData.user
        );
      }

      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Invalid or expired OTP";
      setError(errorMessage);
      throw error;
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const resendVerificationOTP = async (email, username) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authAPI.resendVerificationOTP(email, username);
      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to resend OTP";
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Registration
  const register = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authAPI.register(userData);

      // Handle the response
      const responseData = response.data || response; // Handle both possible structures
      if (responseData && responseData.user) {
        setAuthenticatedUser(responseData.user, responseData.accessToken);
      } else {
        setAuthenticatedUser(responseData);
      }

      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Login with email/username & password
  const loginWithPassword = async (emailOrUsername, password) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authAPI.loginWithPassword(
        emailOrUsername,
        password
      );
      // Backend returns: { status, data: { accessToken, user }, message, success }
      // So we need to access response.data.data instead of response.data
      const { user, accessToken } = response.data || response; // Handle both possible structures
      setAuthenticatedUser(user, accessToken);
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuth();
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Update account details
  const updateAccountDetails = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authAPI.updateAccountDetails(userData);
      // Backend returns: { status, data: user, message, success }
      const updatedUser = response.data || response; // Handle both possible structures
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update account details";
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Change password
  const changePassword = async (oldPassword, newPassword) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authAPI.changePassword(oldPassword, newPassword);
      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to change password";
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Debug: Log state changes
  useEffect(() => {
    console.log("AuthContext State Changed:", {
      isAuthenticated,
      isLoading,
      user: user ? "USER_EXISTS" : "NO_USER",
      error: error ? "ERROR_EXISTS" : "NO_ERROR",
    });
  }, [isAuthenticated, isLoading, user, error]);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    isEmailVerified,
    emailVerificationSent,
    isVerifyingOtp,
    sendVerificationOTP,
    verifyEmailOTP,
    resendVerificationOTP,
    register,
    loginWithPassword,
    logout,
    clearError,
    updateAccountDetails,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
