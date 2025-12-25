import enMessages from './locales/en.json';
import idMessages from './locales/id.json';

export type Locale = 'en' | 'id';

export const messages = {
  en: enMessages,
  id: idMessages,
};

export const defaultLocale: Locale = 'id';

export const locales: { value: Locale; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'id', label: 'Indonesia' },
];
