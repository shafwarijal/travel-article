import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/services/auth.service';
import type { User } from '@/types/auth';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,

      login: (token: string, user: User) => {
        sessionStorage.setItem('authToken', token);
        sessionStorage.setItem('user', JSON.stringify(user));
        set({ isAuthenticated: true, user, token });
      },

      logout: () => {
        authService.logout();
        set({ isAuthenticated: false, user: null, token: null });
      },

      checkAuth: () => {
        const token = authService.getToken();
        const user = authService.getUser();
        if (token && user) {
          set({ isAuthenticated: true, user, token });
        } else {
          set({ isAuthenticated: false, user: null, token: null });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
      }),
    },
  ),
);
