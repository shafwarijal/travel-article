import { useIntl } from 'react-intl';
import type { PrimitiveType } from 'react-intl';
import { useLocaleStore } from '@/store/locale';

/**
 * Custom hook untuk mempermudah penggunaan intl
 * Contoh penggunaan:
 *
 * const { t, locale, setLocale } = useTranslation();
 *
 * // Cara 1: menggunakan t (shorthand)
 * const title = t('auth.login');
 *
 * // Cara 2: menggunakan formatMessage (full API)
 * const welcomeMsg = formatMessage({ id: 'app.welcome' }, { name: 'John' });
 *
 * // Cara 3: mengubah bahasa
 * setLocale('id'); // atau 'en'
 */
export const useTranslation = () => {
  const intl = useIntl();
  const { locale, setLocale } = useLocaleStore();

  const t = (id: string, values?: Record<string, PrimitiveType>) => {
    return intl.formatMessage({ id }, values);
  };

  return {
    t,
    formatMessage: intl.formatMessage,
    formatDate: intl.formatDate,
    formatTime: intl.formatTime,
    formatNumber: intl.formatNumber,
    locale,
    setLocale,
  };
};
