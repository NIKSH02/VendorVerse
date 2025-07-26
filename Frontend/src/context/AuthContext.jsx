import React, { createContext, useReducer, useEffect } from 'react';
import authAPI from '../services/authService';

// Auth Context
const AuthContext = createContext();

// Auth Actions
const AUTH_ACTIONS = {
    SET_LOADING: 'SET_LOADING',
    SET_USER: 'SET_USER',
    SET_ERROR: 'SET_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR',
    LOGOUT: 'LOGOUT',
    SET_EMAIL_VERIFIED: 'SET_EMAIL_VERIFIED',
    SET_EMAIL_VERIFICATION_SENT: 'SET_EMAIL_VERIFICATION_SENT',
    SET_IS_VERIFYING_OTP: 'SET_IS_VERIFYING_OTP',
    SET_SIGNIN_METHOD: 'SET_SIGNIN_METHOD',
    SET_SIGNIN_OTP_SENT: 'SET_SIGNIN_OTP_SENT',
    SET_SIGNIN_OTP_VERIFIED: 'SET_SIGNIN_OTP_VERIFIED',
    SET_IS_VERIFYING_SIGNIN_OTP: 'SET_IS_VERIFYING_SIGNIN_OTP'
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
    signinMethod: null, // 'username' or 'email'
    signinOtpSent: false,
    signinOtpVerified: false,
    isVerifyingSigninOtp: false
};

// Auth Reducer
const authReducer = (state, action) => {
    switch (action.type) {
        case AUTH_ACTIONS.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload,
                error: null
            };

        case AUTH_ACTIONS.SET_USER:
            return {
                ...state,
                user: action.payload,
                isAuthenticated: !!action.payload,
                isLoading: false,
                error: null
            };

        case AUTH_ACTIONS.SET_ERROR:
            return {
                ...state,
                error: action.payload,
                isLoading: false
            };

        case AUTH_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: null
            };

        case AUTH_ACTIONS.LOGOUT:
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            return {
                ...initialState
            };

        case AUTH_ACTIONS.SET_EMAIL_VERIFIED:
            return {
                ...state,
                isEmailVerified: action.payload
            };

        case AUTH_ACTIONS.SET_EMAIL_VERIFICATION_SENT:
            return {
                ...state,
                emailVerificationSent: action.payload
            };

        case AUTH_ACTIONS.SET_IS_VERIFYING_OTP:
            return {
                ...state,
                isVerifyingOtp: action.payload
            };

        case AUTH_ACTIONS.SET_SIGNIN_METHOD:
            return {
                ...state,
                signinMethod: action.payload,
                signinOtpSent: false,
                signinOtpVerified: false
            };

        case AUTH_ACTIONS.SET_SIGNIN_OTP_SENT:
            return {
                ...state,
                signinOtpSent: action.payload
            };

        case AUTH_ACTIONS.SET_SIGNIN_OTP_VERIFIED:
            return {
                ...state,
                signinOtpVerified: action.payload
            };

        case AUTH_ACTIONS.SET_IS_VERIFYING_SIGNIN_OTP:
            return {
                ...state,
                isVerifyingSigninOtp: action.payload
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
            const token = localStorage.getItem('accessToken');
            const savedUser = localStorage.getItem('user');

            if (token && savedUser) {
                try {
                    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
                    const response = await authAPI.getCurrentUser();
                    dispatch({ type: AUTH_ACTIONS.SET_USER, payload: response.data });
                } catch {
                    // Token might be invalid
                    dispatch({ type: AUTH_ACTIONS.LOGOUT });
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
            dispatch({ type: AUTH_ACTIONS.SET_EMAIL_VERIFICATION_SENT, payload: true });
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to send verification OTP';
            dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
            throw error;
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
            const errorMessage = error.response?.data?.message || 'Invalid or expired OTP';
            dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
            throw error;
        }
    };

    const resendVerificationOTP = async (email, username) => {
        try {
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
            const response = await authAPI.resendVerificationOTP(email, username);
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to resend OTP';
            dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
            throw error;
        }
    };

    // Registration
    const register = async (userData) => {
        try {
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
            const response = await authAPI.register(userData);
            dispatch({ type: AUTH_ACTIONS.SET_USER, payload: response.data });
            
            // Save to localStorage
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed';
            dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
            throw error;
        }
    };

    // Login with username & password
    const loginWithPassword = async (username, password) => {
        try {
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
            const response = await authAPI.loginWithPassword(username, password);
            dispatch({ type: AUTH_ACTIONS.SET_USER, payload: response.data.user });
            
            // Save to localStorage
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed';
            dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
            throw error;
        }
    };

    // Email OTP signin functions
    const sendSigninOTP = async (email) => {
        try {
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
            const response = await authAPI.sendSigninOTP(email);
            dispatch({ type: AUTH_ACTIONS.SET_SIGNIN_OTP_SENT, payload: true });
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to send signin OTP';
            dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
            throw error;
        }
    };

    const verifySigninOTP = async (email, otp) => {
        try {
            dispatch({ type: AUTH_ACTIONS.SET_IS_VERIFYING_SIGNIN_OTP, payload: true });
            const response = await authAPI.verifySigninOTP(email, otp);
            dispatch({ type: AUTH_ACTIONS.SET_USER, payload: response.data.user });
            dispatch({ type: AUTH_ACTIONS.SET_SIGNIN_OTP_VERIFIED, payload: true });
            dispatch({ type: AUTH_ACTIONS.SET_IS_VERIFYING_SIGNIN_OTP, payload: false });
            
            // Save to localStorage
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            return response;
        } catch (error) {
            dispatch({ type: AUTH_ACTIONS.SET_IS_VERIFYING_SIGNIN_OTP, payload: false });
            const errorMessage = error.response?.data?.message || 'Invalid or expired OTP';
            dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
            throw error;
        }
    };

    const resendSigninOTP = async (email) => {
        try {
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
            const response = await authAPI.resendSigninOTP(email);
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to resend signin OTP';
            dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
            throw error;
        }
    };

    // Logout
    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
    };

    // Clear error
    const clearError = () => {
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
    };

    // Set signin method
    const setSigninMethod = (method) => {
        dispatch({ type: AUTH_ACTIONS.SET_SIGNIN_METHOD, payload: method });
    };

    // Reset signin OTP states
    const resetSigninOtpStates = () => {
        dispatch({ type: AUTH_ACTIONS.SET_SIGNIN_OTP_SENT, payload: false });
        dispatch({ type: AUTH_ACTIONS.SET_SIGNIN_OTP_VERIFIED, payload: false });
    };

    const value = {
        ...state,
        sendVerificationOTP,
        verifyEmailOTP,
        resendVerificationOTP,
        register,
        loginWithPassword,
        sendSigninOTP,
        verifySigninOTP,
        resendSigninOTP,
        logout,
        clearError,
        setSigninMethod,
        resetSigninOtpStates
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
