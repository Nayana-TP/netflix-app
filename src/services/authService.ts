import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export interface User {
  user_id: string;
  user_name: string;
  email: string;
  phone_number?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user_id?: string;
}

export const authService = {
  register: async (userData: {
    user_name: string;
    email: string;
    phone_number?: string;
    password: string;
  }): Promise<RegisterResponse> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  login: async (credentials: {
    user_name: string;
    password: string;
  }): Promise<LoginResponse> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  verifyToken: async (token: string): Promise<{ success: boolean; user?: any }> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Token verification failed');
    }
  },

  healthCheck: async (): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Health check failed');
    }
  },
};

export const tokenStorage = {
  setToken: (token: string) => {
    localStorage.setItem('netflix_token', token);
  },

  getToken: (): string | null => {
    return localStorage.getItem('netflix_token');
  },

  removeToken: () => {
    localStorage.removeItem('netflix_token');
  },

  setUser: (user: User) => {
    localStorage.setItem('netflix_user', JSON.stringify(user));
  },

  getUser: (): User | null => {
    const userStr = localStorage.getItem('netflix_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  removeUser: () => {
    localStorage.removeItem('netflix_user');
  },
};
