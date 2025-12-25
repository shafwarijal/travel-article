import axios from 'axios';

// Base URL dari environment variable atau default
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://extra-brooke-yeremiadio-46b2183e.koyeb.app';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

// Request interceptor untuk menambahkan token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor untuk handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired atau invalid
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
