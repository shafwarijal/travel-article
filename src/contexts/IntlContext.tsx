import type { ReactNode } from 'react';
import { IntlProvider } from 'react-intl';
import { defaultLocale, messages } from '@/i18n';
import { useLocaleStore } from '@/store/locale';

interface IntlProviderWrapperProps {
  children: ReactNode;
}

const IntlProviderWrapper = ({ children }: IntlProviderWrapperProps) => {
  const locale = useLocaleStore((state) => state.locale);

  return (
    <IntlProvider
      locale={locale}
      messages={messages[locale]}
      defaultLocale={defaultLocale}
    >
      {children}
    </IntlProvider>
  );
};

export default IntlProviderWrapper;
