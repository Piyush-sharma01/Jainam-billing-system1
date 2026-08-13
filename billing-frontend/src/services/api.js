import axios from 'axios';
import { startRequest, stopRequest } from './loadingTracker';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Track every request/response through this shared instance so the global
// loading bar (and "waking up the server" banner) can react automatically —
// every page that uses productAPI, clientAPI, invoiceAPI, brandAPI, etc.
// is covered without touching each page's code.
api.interceptors.request.use(
  (config) => {
    startRequest();
    return config;
  },
  (error) => {
    stopRequest();
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    stopRequest();
    return response;
  },
  (error) => {
    stopRequest();
    return Promise.reject(error);
  }
);

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

export default api;