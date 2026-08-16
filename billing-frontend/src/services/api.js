import axios from 'axios';
import { getCurrentUser } from './currentUser';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Track in-flight requests globally so any page can show a loading state
// without wiring up its own loading logic. GlobalLoadingBar listens for
// these events.
let activeRequests = 0;

api.interceptors.request.use((config) => {
  activeRequests += 1;
  if (activeRequests === 1) {
    window.dispatchEvent(new Event('api-loading-start'));
  }

  // Attach who's making the request so the backend can filter clients/
  // invoices per marketing member. Harmless for admin/client requests —
  // the backend only filters when role is 'marketing'.
  const user = getCurrentUser();
  if (user) {
    config.headers['X-User-Role'] = user.role || '';
    config.headers['X-Username'] = user.username || '';
  }

  return config;
}, (error) => {
  activeRequests = Math.max(0, activeRequests - 1);
  if (activeRequests === 0) {
    window.dispatchEvent(new Event('api-loading-end'));
  }
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  activeRequests = Math.max(0, activeRequests - 1);
  if (activeRequests === 0) {
    window.dispatchEvent(new Event('api-loading-end'));
  }
  return response;
}, (error) => {
  activeRequests = Math.max(0, activeRequests - 1);
  if (activeRequests === 0) {
    window.dispatchEvent(new Event('api-loading-end'));
  }
  return Promise.reject(error);
});

// Products API
export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  search: (keyword) => api.get(`/products/search/${keyword}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// Clients API
export const clientAPI = {
  getAll: () => api.get('/clients'),
  getById: (id) => api.get(`/clients/${id}`),
  search: (keyword) => api.get(`/clients/search/${keyword}`),
  create: (data) => api.post('/clients', data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`),
};

// Invoices API
export const invoiceAPI = {
  getAll: () => api.get('/invoices'),
  getById: (id) => api.get(`/invoices/${id}`),
  getByStatus: (status) => api.get(`/invoices/status/${status}`),
  create: (data) => api.post('/invoices', data),
  updateStatus: (id, status) => api.put(`/invoices/${id}/status/${status}`),
  sendEmail: (id, email) => api.post(`/invoices/${id}/send-email?email=${encodeURIComponent(email)}`),
  delete: (id) => api.delete(`/invoices/${id}`),
};
// Brands API
export const brandAPI = {
  getAll: () => api.get('/brands'),
  create: (data) => api.post('/brands', data),
  delete: (id) => api.delete(`/brands/${id}`),
};

// Categories API
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Auth API — marketing team login (owner/client login stay hardcoded in Login.jsx)
export const authAPI = {
  login: (username, password) => api.post('/auth/login', { username, password }),
};

// Marketing team management (Owner only — page itself is gated by role)
export const userAPI = {
  getMarketingTeam: () => api.get('/users'),
  createMarketingUser: (data) => api.post('/users', data),
  delete: (id) => api.delete(`/users/${id}`),
};

export default api;
