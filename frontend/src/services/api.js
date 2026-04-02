import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}`);

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to include the auth token and user ID
api.interceptors.request.use(
    (config) => {
        // 1. Get User ID (Used by current backend demo/protect middleware)
        const userId = localStorage.getItem('userId');
        if (userId) {
            config.headers['x-user-id'] = userId;
        }

        // 2. Get JWT Token (For future-proof JWT support)
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user && user.token) {
                    config.headers.Authorization = `Bearer ${user.token}`;
                }
            } catch (e) {
                // Silently ignore if 'user' key is not JSON
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
