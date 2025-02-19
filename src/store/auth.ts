import { create } from 'zustand';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (login: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

export const useAuth = create<AuthState>((set) => {
  const token = sessionStorage.getItem('netflix_token');
  const isAuthenticated = !!token;
  const user = isAuthenticated ? null : null;

  return {
    user,
    isAuthenticated,
    login: async (login, password) => {
      try {
        const response = await axios.post('https://mflix.moleniuk.com/api/auth/login', { login, password });
        const { token, user } = response.data;

        sessionStorage.setItem('netflix_token', token);
        set({ user, isAuthenticated: true });
      } catch (error) {
        throw new Error('Invalid credentials');
      }
    },
    logout: () => {
      sessionStorage.removeItem('netflix_token');
      set({ user: null, isAuthenticated: false });
    },
    register: async (name, email, password) => {
      try {
        const response = await axios.post('/auth/register', { name, email, password });
        const { token, user } = response.data;

        sessionStorage.setItem('netflix_token', token);
        set({ user, isAuthenticated: true });
      } catch (error) {
        throw new Error('Registration failed');
      }
    }
  };
});
