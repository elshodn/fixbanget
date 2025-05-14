// src/stores/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialUsers } from '../lib/mockData';

export const useAuthStore = create(persist(
  (set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    register: async (userData) => {
      set({ isLoading: true, error: null });
      try {
        const fakeToken = "mock_token_" + userData.email;
        const user = {
          ...userData,
          accessToken: fakeToken
        };
        set({ user, isAuthenticated: true, isLoading: false });
      } catch (err) {
        set({ error: "Ошибка при регистрации", isLoading: false });
      }
    },

    login: async (email, password) => {
      set({ isLoading: true, error: null });
      await new Promise((res) => setTimeout(res, 500));
      const foundUser = initialUsers.find(
        (user) => user.email === email && user.password === password
      );

      if (foundUser) {
        set({ user: foundUser, isAuthenticated: true, isLoading: false });
      } else {
        set({ error: 'Неверная почта или пароль', isLoading: false });
      }
    },

    logout: () => {
      set({ user: null, isAuthenticated: false });
    }
  }),
  {
    name: 'auth-storage', // key for localStorage
    partialize: (state) => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated
    })
  }
));
