import { Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/store/theme';

export const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="cursor-pointer"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
};
