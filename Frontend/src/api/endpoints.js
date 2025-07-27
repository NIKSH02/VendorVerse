// API Endpoints Configuration
export const API_ENDPOINTS = {
    // Base URLs
    BASE_URL: 'http://localhost:5000/api/v1',
    
    // Auth endpoints
    AUTH: {
        // Email verification (Signup)
        SEND_VERIFICATION_OTP: '/users/send-verification-otp',
        VERIFY_EMAIL_OTP: '/users/verify-email-otp',
        RESEND_VERIFICATION_OTP: '/users/resend-verification-otp',
        
        // User registration & login
        REGISTER: '/users/register',
        LOGIN: '/users/login',
        LOGOUT: '/users/logout',
        
        // Signin with OTP
        SEND_SIGNIN_OTP: '/users/send-signin-otp',
        VERIFY_SIGNIN_OTP: '/users/verify-signin-otp',
        RESEND_SIGNIN_OTP: '/users/resend-signin-otp',
        
        // Token management
        REFRESH_TOKEN: '/users/refresh-token',
        GET_CURRENT_USER: '/users/get-user'
    },
    
    // User endpoints
    USER: {
        PROFILE: '/users/profile',
        UPDATE_ACCOUNT: '/users/update-account',
        CHANGE_PASSWORD: '/users/change-password',
        CHANGE_AVATAR: '/users/change-avatar',
        CHANGE_COVER: '/users/change-cover-images',
        WATCH_HISTORY: '/users/watch-history'
    }
};

// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500
};

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized. Please login again.',
    SERVER_ERROR: 'Server error. Please try again later.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    OTP_EXPIRED: 'OTP has expired. Please request a new one.',
    OTP_INVALID: 'Invalid OTP. Please try again.',
    EMAIL_EXISTS: 'Email is already registered.',
    USER_NOT_FOUND: 'User not found.',
    RATE_LIMIT: 'Too many requests. Please wait before trying again.'
};

export default API_ENDPOINTS;
