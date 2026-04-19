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

// Customer Profile APIs
export const customerAPI = {
  getProfile: () =>
    apiClient.get('/customer/profile/'),
  updateProfile: (profileData) =>
    apiClient.post('/customer/profile/', profileData),
};

// Product APIs
export const productAPI = {
  getAll: () =>
    apiClient.get('/products/'),
  getAdminList: () =>
    apiClient.get('/products/admin_list/'),
  getById: (id) =>
    apiClient.get(`/products/${id}/`),
  create: (productData) =>
    apiClient.post('/products/', productData),
  update: (id, productData) =>
    apiClient.patch(`/products/${id}/`, productData),
  delete: (id) =>
    apiClient.delete(`/products/${id}/`),
};

// Order APIs
export const orderAPI = {
  getAll: () =>
    apiClient.get('/orders/'),
  getById: (id) =>
    apiClient.get(`/orders/${id}/`),
  createFromCart: (orderData) =>
    apiClient.post('/orders/create_from_cart/', orderData),
  updateStatus: (id, status) =>
    apiClient.patch(`/orders/${id}/update_status/`, { status }),
  cancel: (id) =>
    apiClient.post(`/orders/${id}/cancel_order/`),
  delete: (id) =>
    apiClient.delete(`/orders/${id}/delete_order/`),
};

// Feedback APIs
export const feedbackAPI = {
  submit: (feedbackData) =>
    apiClient.post('/feedback/', feedbackData),
  getAll: () =>
    apiClient.get('/feedback/'),
  getAnalytics: () =>
    apiClient.get('/feedback/analytics/'),
  getRecent: () =>
    apiClient.get('/feedback/recent/'),
  checkModel: () =>
    apiClient.post('/feedback/check_model/'),
};

// Sentiment Analysis APIs (integrated with Feedback)
// Use feedbackAPI.getAnalytics() and feedbackAPI.getRecent() instead

export { apiClient };
export default apiClient;
