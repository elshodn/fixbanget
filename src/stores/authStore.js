import { create } from 'zustand';
import { initialUsers } from '../lib/mockData';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('user'),
  isLoading: false,
  error: null,


  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const userExists = initialUsers.some(user => user.email === userData.email);
      if (userExists) {
        throw new Error('Пользователь с таким email уже существует');
      }

      const newUser = {
        ...userData,
        id: Date.now().toString(),
        accessToken: `mock_token_${userData.email}`,
      };

      localStorage.setItem('user', JSON.stringify(newUser));
      
      set({ 
        user: newUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return true;
    } catch (err) {
      set({ 
        error: err.message || 'Ошибка при регистрации',
        isLoading: false,
      });
      return false;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const foundUser = initialUsers.find(
        user => user.email === email && user.password === password
      );

      if (!foundUser) {
        throw new Error('Неверная почта или пароль');
      }

      localStorage.setItem('user', JSON.stringify(foundUser));
      
      set({
        user: foundUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return true;
    } catch (err) {
      set({
        error: err.message || 'Ошибка при входе в систему',
        isLoading: false,
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),

  checkAuth: () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      set({ user, isAuthenticated: true });
    } else {
      set({ user: null, isAuthenticated: false });
    }
  },
}));