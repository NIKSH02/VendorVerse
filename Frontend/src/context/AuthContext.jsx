import React, { createContext, useReducer, useEffect } from "react";
import authAPI from "../services/authService";

// Auth Context
const AuthContext = createContext();

// Auth Actions
const AUTH_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_USER: "SET_USER",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  LOGOUT: "LOGOUT",
  SET_EMAIL_VERIFIED: "SET_EMAIL_VERIFIED",
  SET_EMAIL_VERIFICATION_SENT: "SET_EMAIL_VERIFICATION_SENT",
  SET_IS_VERIFYING_OTP: "SET_IS_VERIFYING_OTP",
};

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isEmailVerified: false,
  emailVerificationSent: false,
  isVerifyingOtp: false,
};

// Auth Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
        error: null,
      };

    case AUTH_ACTIONS.SET_USER:
      console.log("AuthContext: SET_USER action triggered", {
        user: action.payload,
        isAuthenticated: !!action.payload
      });
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AUTH_ACTIONS.LOGOUT:
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      return {
        ...initialState,
      };

    case AUTH_ACTIONS.SET_EMAIL_VERIFIED:
      return {
        ...state,
        isEmailVerified: action.payload,
      };

    case AUTH_ACTIONS.SET_EMAIL_VERIFICATION_SENT:
      return {
        ...state,
        emailVerificationSent: action.payload,
      };

    case AUTH_ACTIONS.SET_IS_VERIFYING_OTP:
      return {
        ...state,
        isVerifyingOtp: action.payload,
      };

    default:
      return state;
  }
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      const savedUser = localStorage.getItem("user");

      if (token && savedUser) {
        try {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
          const response = await authAPI.getCurrentUser();
          dispatch({ type: AUTH_ACTIONS.SET_USER, payload: response.data });
        } catch {
          // Token might be invalid
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        } finally {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      }
    };

    checkAuth();
  }, []);

  // Email verification functions (Signup)
  const sendVerificationOTP = async (email, username) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      const response = await authAPI.sendVerificationOTP(email, username);
      dispatch({
        type: AUTH_ACTIONS.SET_EMAIL_VERIFICATION_SENT,
        payload: true,
      });
      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to send verification OTP";
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const verifyEmailOTP = async (email, otp) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_IS_VERIFYING_OTP, payload: true });
      const response = await authAPI.verifyEmailOTP(email, otp);
      dispatch({ type: AUTH_ACTIONS.SET_EMAIL_VERIFIED, payload: true });
      dispatch({ type: AUTH_ACTIONS.SET_IS_VERIFYING_OTP, payload: false });
      return response;
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_IS_VERIFYING_OTP, payload: false });
      const errorMessage =
        error.response?.data?.message || "Invalid or expired OTP";
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    }
  };

  const resendVerificationOTP = async (email, username) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      const response = await authAPI.resendVerificationOTP(email, username);
      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to resend OTP";
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Registration
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      const response = await authAPI.register(userData);
      
      // Check if the response contains user and token data
      if (response.data && response.data.user) {
        dispatch({ type: AUTH_ACTIONS.SET_USER, payload: response.data.user });

        // Save to localStorage if tokens are provided
        if (response.data.accessToken) {
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
      } else {
        // Fallback for older response format
        dispatch({ type: AUTH_ACTIONS.SET_USER, payload: response.data });
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      throw error;
    }
  };

  // Login with email/username & password
  const loginWithPassword = async (emailOrUsername, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      const response = await authAPI.loginWithPassword(
        emailOrUsername,
        password
      );
      dispatch({ type: AUTH_ACTIONS.SET_USER, payload: response.data.user });

      // Save to localStorage
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Logout
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Update account details
  const updateAccountDetails = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      const response = await authAPI.updateAccountDetails(userData);
      dispatch({ type: AUTH_ACTIONS.SET_USER, payload: response.data });

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(response.data));

      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update account details";
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Change password
  const changePassword = async (oldPassword, newPassword) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      const response = await authAPI.changePassword(oldPassword, newPassword);
      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to change password";
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const value = {
    ...state,
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
