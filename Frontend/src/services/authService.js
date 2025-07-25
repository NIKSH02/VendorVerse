import apiClient from '../api/axios';

// Auth API endpoints
const authAPI = {
    // Email verification for signup
    sendVerificationOTP: async (email, username) => {
        const response = await apiClient.post('/users/send-verification-otp', {
            email,
            username
        });
        return response.data;
    },

    verifyEmailOTP: async (email, otp) => {
        const response = await apiClient.post('/users/verify-email-otp', {
            email,
            otp
        });
        return response.data;
    },

    resendVerificationOTP: async (email, username) => {
        const response = await apiClient.post('/users/resend-verification-otp', {
            email,
            username
        });
        return response.data;
    },

    // User registration
    register: async (userData) => {
        const response = await apiClient.post('/users/register', userData);
        return response.data;
    },

    // Username & Password signin
    loginWithPassword: async (username, password) => {
        const response = await apiClient.post('/users/login', {
            username,
            password
        });
        return response.data;
    },

    // Email OTP signin
    sendSigninOTP: async (email) => {
        const response = await apiClient.post('/users/send-signin-otp', {
            email
        });
        return response.data;
    },

    verifySigninOTP: async (email, otp) => {
        const response = await apiClient.post('/users/verify-signin-otp', {
            email,
            otp
        });
        return response.data;
    },

    resendSigninOTP: async (email) => {
        const response = await apiClient.post('/users/resend-signin-otp', {
            email
        });
        return response.data;
    },

    // Logout
    logout: async () => {
        const response = await apiClient.post('/users/logout');
        return response.data;
    },

    // Get current user
    getCurrentUser: async () => {
        const response = await apiClient.get('/users/get-user');
        return response.data;
    },

    // Refresh token
    refreshToken: async () => {
        const response = await apiClient.post('/users/refresh-token');
        return response.data;
    }
};

export default authAPI;
