import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Locale } from '@/i18n';
import { defaultLocale } from '@/i18n';

interface LocaleStore {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleStore>()(
  persist(
    (set) => ({
      locale: defaultLocale,
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: 'locale-storage',
    },
  ),
);
