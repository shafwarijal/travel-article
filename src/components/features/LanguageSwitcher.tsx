import { Globe } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { locales } from '@/i18n';
import { useLocaleStore } from '@/store/locale';

export const LanguageSwitcher = () => {
  const { locale, setLocale } = useLocaleStore();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="cursor-pointer">
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc.value}
            onClick={() => setLocale(loc.value)}
            className={`cursor-pointer ${
              locale === loc.value ? 'bg-accent text-accent-foreground' : ''
            }`}
          >
            {loc.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
