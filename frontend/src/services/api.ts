import axios from 'axios';
import keycloak from '../keycloak';
import type { Product, Order } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:8888',
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  if (keycloak.token) {
    config.headers.Authorization = `Bearer ${keycloak.token}`;
  }
  return config;
});

// Products API
export const productApi = {
  getAll: () => api.get<Product[]>('/products').then((res) => res.data),

  getById: (id: number) => api.get<Product>(`/products/${id}`).then((res) => res.data),

  create: (product: Omit<Product, 'id'>) =>
    api.post<Product>('/products', product).then((res) => res.data),

  delete: (id: number) => api.delete(`/products/${id}`),
};

// Orders API
export const orderApi = {
  getAll: () => api.get<Order[]>('/orders').then((res) => res.data),

  getById: (id: number) => api.get<Order>(`/orders/${id}`).then((res) => res.data),

  create: (order: { items: { productId: number; quantity: number; price: number }[] }) =>
    api.post<Order>('/orders', order).then((res) => res.data),
};

export default api;
