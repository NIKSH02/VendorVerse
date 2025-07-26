import axios from 'axios';

// Base URL for your backend API
const BASE_URL = 'http://localhost:5000/api/v1';

// Create axios instance
const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Include cookies for authentication
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        // Get token from localStorage if available
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 (Unauthorized) errors
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh token
                const refreshResponse = await axios.post(
                    `${BASE_URL}/users/refresh-token`,
                    {},
                    { withCredentials: true }
                );

                const newToken = refreshResponse.data.data.accessToken;
                localStorage.setItem('accessToken', newToken);

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Refresh failed, redirect to login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                window.location.href = '/';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
