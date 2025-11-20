import apiClient from '@/lib/axios';
import { User } from '../types/user';

export const userApi = {
  getAll: async (): Promise => {
    const response = await apiClient.get('/users/');
    return response.data;
  },

  getById: async (id: number): Promise => {
    const response = await apiClient.get(`/users/${id}/`);
    return response.data;
  },

  create: async (user: Omit): Promise => {
    const response = await apiClient.post('/users/', user);
    return response.data;
  },

  update: async (id: number, user: Omit): Promise => {
    const response = await apiClient.put(`/users/${id}/`, user);
    return response.data;
  },

  delete: async (id: number): Promise => {
    await apiClient.delete(`/users/${id}/`);
  },
};