export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'tenant' | 'owner';
  phone?: string;
}

export interface Property {
  _id: string;
  id?: string;
  title: string;
  description: string;
  type: any,
  price: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  images: any;
  amenities: string[];
  bedrooms?: any;
  bathrooms?: any;
  area: number;
  available: boolean;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFormData {
  title: string;
  description: string;
  type: any,
  price: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  images: any;
  amenities: any;
  bedrooms?: any;
  bathrooms?: any;
  area: any;
  available: boolean;
}

export interface PropertyResponse {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface PropertyFilters {
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  state?: string;
  available?: boolean;
  page?: number;
  limit?: number;
  search?: string;
} 