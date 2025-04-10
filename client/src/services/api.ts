import axios from 'axios';
import { QueryClient } from '@tanstack/react-query';
import { Interest, Property, PropertyResponse } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    role: 'owner' | 'tenant';
    phone?: string;
  }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Property API
export const propertyApi = {
  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get<PropertyResponse>('/properties', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const res = await api.get<Property>(`/properties/${id}`);
    return res.data;
  },

  getOwnerProperties: async () => {
    const response = await api.get<Property[]>('/properties/owner/properties');
    return response.data;
  },

  create: async (data: Omit<Property, '_id' | 'owner' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post<Property>('/properties/createProperties', {
      ...data,
      images: data.images, // These should now be only URLs
    });
    return response.data;
  },

  update: async (_id: string, updates: Partial<Property>) => {
    const response = await api.put<Property>(`/properties/${_id}`, updates);
    return response.data;
  },

  delete: async (_id: string) => {
    await api.delete(`/properties/${_id}`);
  },

  search: async (query: string) => {
    const response = await api.get<PropertyResponse>('/properties/search', {
      params: { q: query },
    });
    return response.data;
  },

  getMyProperties: async () => {
    const response = await api.get<Property[]>('/properties/my-properties');
    return response.data;
  },
//  uploadImages: async (formData: FormData) => {
//   const response = await api.post<Property>('/upload-images', formData);
//     return response.data;
//   },
uploadImages: async (formData: FormData) => {
  const response = await api.post('/upload-images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // optional, axios can detect this
    },
  });
  return response.data;
},
}; 

export const interestApi = {
  addInterest: async (propertyId: string) => {
    const res = await api.post('/interests/add', { propertyId });
    return res.data;
  },

  removeInterest: async (propertyId: string) => {
    // Make sure we're sending propertyId in the request body
    const res = await api.delete('/interests/remove', { 
      data: { propertyId } // Use 'data' for DELETE request body
    });
    // or if you want to keep using POST
    // const res = await api.post('/interests/remove', { propertyId });
    return res.data;
  },
  checkInterest: async (propertyId: string): Promise<{ interested: boolean }> => {
    const res = await api.get(`/interests/check/${propertyId}`);
    return res.data;
  },
  toggleInterest: async ({
    propertyId,
    interested,
  }: {
    propertyId: string;
    interested: boolean;
  }): Promise<Interest | { success: boolean }> => {
    return interested
      ? interestApi.addInterest(propertyId)
      : interestApi.removeInterest(propertyId);
  },

  getMyInterests: async (): Promise<Interest[]> => {
    const res = await api.get('/interests/my');
    return res.data;
  },

  requestVisit: async (interestId: string): Promise<Interest> => {
    const res = await api.post('/interests/request-visit', { interestId });
    return res.data;
  },
 
};
