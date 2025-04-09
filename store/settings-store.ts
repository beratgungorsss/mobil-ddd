import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  soundEffects: boolean;
  hapticFeedback: boolean;
  autoSave: boolean;
  defaultLanguage: string;
  quizDifficulty: 'easy' | 'medium' | 'hard';
  sessionReminders: boolean;
}

interface SettingsState {
  settings: AppSettings;
  isLoading: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  notifications: true,
  soundEffects: true,
  hapticFeedback: true,
  autoSave: true,
  defaultLanguage: 'English',
  quizDifficulty: 'medium',
  sessionReminders: true,
};

export const useSettingsStore = create<
  SettingsState & {
    updateSettings: (updates: Partial<AppSettings>) => void;
    resetSettings: () => void;
  }
>(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      isLoading: false,
      
      updateSettings: (updates) => {
        set(state => ({
          settings: {
            ...state.settings,
            ...updates
          }
        }));
      },
      
      resetSettings: () => {
        set({
          settings: DEFAULT_SETTINGS
        });
      }
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);