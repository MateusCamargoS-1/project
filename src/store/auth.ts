import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import { api } from '../lib/axios';

interface User {
  nome: string;
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
  const token = sessionStorage.getItem('mflix_token');
  const isAuthenticated = !!token;
  const user = isAuthenticated ? null : null;

  return {
    user,
    isAuthenticated,
    login: async (login, password) => {
      try {
        const response = await api.post('/auth/login', { login, password });
        const user = response.data;

        if(!user) {
          throw new Error('Token not received');
        }

        const decodedUser: any = jwtDecode(user);

        sessionStorage.setItem('mflix_token', user);
        sessionStorage.setItem('mflix_user', JSON.stringify(decodedUser));

        set({ user: decodedUser, isAuthenticated: true });
      } catch (error) {
        throw new Error('Invalid credentials');
      }
    },
    logout: () => {
      sessionStorage.removeItem('mflix_token');
      set({ user: null, isAuthenticated: false });
    },
    register: async (name, email, password) => {
      try {
        const response = await api.post('/auth/register', { name, email, password });
        const { token, user } = response.data;

        sessionStorage.setItem('mflix_token', token);
        set({ user, isAuthenticated: true });
      } catch (error) {
        throw new Error('Registration failed');
      }
    }
  };
});
