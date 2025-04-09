import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, LoginCredentials, RegisterCredentials, User } from '@/types/auth';

// Mock API functions - replace with actual API calls
const mockLogin = async (credentials: LoginCredentials): Promise<{ user: User, token: string }> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock successful login
  if (credentials.email === "demo@example.com" && credentials.password === "password") {
    return {
      user: {
        id: "user-1",
        email: credentials.email,
        name: "Demo User",
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      },
      token: "mock-jwt-token-12345",
    };
  }
  
  throw new Error("Invalid credentials");
};

const mockRegister = async (credentials: RegisterCredentials): Promise<{ user: User, token: string }> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock successful registration
  return {
    user: {
      id: "user-" + Math.floor(Math.random() * 1000),
      email: credentials.email,
      name: credentials.name,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    },
    token: "mock-jwt-token-" + Math.floor(Math.random() * 100000),
  };
};

const mockForgotPassword = async (email: string): Promise<void> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock successful password reset email
  if (!email.includes('@')) {
    throw new Error("Invalid email address");
  }
  
  return;
};

export const useAuthStore = create<
  AuthState & {
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => void;
    forgotPassword: (email: string) => Promise<void>;
  }
>(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await mockLogin(credentials);
          set({ user, token, isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : "Login failed" 
          });
        }
      },
      
      register: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await mockRegister(credentials);
          set({ user, token, isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : "Registration failed" 
          });
        }
      },
      
      logout: () => {
        set({ user: null, token: null, error: null });
      },
      
      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          await mockForgotPassword(email);
          set({ isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : "Password reset failed" 
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);