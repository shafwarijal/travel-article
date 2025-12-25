import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => {
        set({ theme });
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { theme: newTheme };
        }),
    }),
    {
      name: 'theme-storage',
    },
  ),
);

// Initialize theme on load
const initTheme = () => {
  const storedTheme = localStorage.getItem('theme-storage');
  if (storedTheme) {
    const { state } = JSON.parse(storedTheme);
    if (state?.theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  } else {
    // Default to dark if no stored theme document.documentElement.classList.add('dark');
  }
};

initTheme();
