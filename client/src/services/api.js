import axios from 'axios';

// Create axios instance with base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses and errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth token if unauthorized
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (email, password) =>
    apiClient.post('/auth/login/', { email, password }),
  signup: (userData) =>
    apiClient.post('/auth/signup/', userData),
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
};

// Product APIs
export const productAPI = {
  getAll: () => apiClient.get('/products'),
  getById: (id) => apiClient.get(`/products/${id}`),
  create: (productData) => apiClient.post('/products', productData),
  update: (id, productData) => apiClient.put(`/products/${id}`, productData),
  delete: (id) => apiClient.delete(`/products/${id}`),
};

// Order APIs
export const orderAPI = {
  getAll: () => apiClient.get('/orders'),
  getById: (id) => apiClient.get(`/orders/${id}`),
  create: (orderData) => apiClient.post('/orders', orderData),
  updateStatus: (id, status) => apiClient.patch(`/orders/${id}/status`, { status }),
};

// Feedback APIs
export const feedbackAPI = {
  submit: (feedbackData) => apiClient.post('/feedback', feedbackData),
  getAll: () => apiClient.get('/feedback'),
};

// Customer APIs
export const customerAPI = {
  getProfile: () => apiClient.get('/customers/profile'),
  updateProfile: (profileData) => apiClient.put('/customers/profile', profileData),
};

// Sentiment Analysis APIs
export const sentimentAPI = {
  getAnalysis: () => apiClient.get('/sentiment/analysis'),
  getTrends: () => apiClient.get('/sentiment/trends'),
};

export default apiClient;
