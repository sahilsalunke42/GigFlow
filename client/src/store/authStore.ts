import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthState } from '@/types';
import { TOKEN_KEY, USER_KEY } from '@/utils/constants';

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  hydrateFromStorage: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setUser: (user: User | null) => {
        if (user) {
          localStorage.setItem(USER_KEY, JSON.stringify(user));
        } else {
          localStorage.removeItem(USER_KEY);
        }
        set((state) => ({
          ...state,
          user,
          isAuthenticated: !!user,
        }));
      },

      setToken: (token: string | null) => {
        if (token) {
          localStorage.setItem(TOKEN_KEY, token);
        } else {
          localStorage.removeItem(TOKEN_KEY);
        }
        set((state) => ({
          ...state,
          token,
          isAuthenticated: !!token,
        }));
      },

      login: (user: User, token: string) => {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        localStorage.setItem(TOKEN_KEY, token);
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      hydrateFromStorage: () => {
        const token = localStorage.getItem(TOKEN_KEY);
        const userStr = localStorage.getItem(USER_KEY);
        let user: User | null = null;

        if (userStr) {
          try {
            user = JSON.parse(userStr);
          } catch {
            localStorage.removeItem(USER_KEY);
          }
        }

        set({
          token: token || null,
          user: user || null,
          isAuthenticated: !!(token && user),
        });
      },
    }),
    {
      name: 'auth-store',
      version: 1,
    }
  )
);
