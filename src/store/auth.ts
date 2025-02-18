import { create } from 'zustand';
import { api } from '../lib/axios';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('netflix_token', token);
      set({ user, isAuthenticated: true });
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  },
  logout: () => {
    localStorage.removeItem('netflix_token');
    set({ user: null, isAuthenticated: false });
  },
  register: async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('netflix_token', token);
      set({ user, isAuthenticated: true });
    } catch (error) {
      throw new Error('Registration failed');
    }
  },
}));