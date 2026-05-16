import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: false,
      toggleTheme: () =>
        set((state) => {
          const next = !state.isDark;
          document.documentElement.classList.toggle('dark', next);
          return { isDark: next };
        }),
    }),
    { name: 'smart-leads-theme' }
  )
);

export const initTheme = (): void => {
  const stored = localStorage.getItem('smart-leads-theme');
  if (stored) {
    try {
      const { state } = JSON.parse(stored) as { state: { isDark: boolean } };
      document.documentElement.classList.toggle('dark', state.isDark);
    } catch {
      /* ignore */
    }
  }
};
