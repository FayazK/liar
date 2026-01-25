import axios from 'axios';

// Create axios instance with Laravel configuration
const api = axios.create({
    baseURL: '/',
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add CSRF token
api.interceptors.request.use(
    (config) => {
        // Get CSRF token from meta tag
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (token) {
            config.headers['X-CSRF-TOKEN'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// Response interceptor to handle common errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 419) {
            // CSRF token mismatch - reload page to get fresh token
            window.location.reload();
        }
        return Promise.reject(error);
    },
);

export default api;
