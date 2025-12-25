import type { ReactNode } from 'react';

import { FileText, FolderPlus, Globe, LogOut, Mail, Plus } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/hooks/useTranslation';
import { locales } from '@/i18n';
import { useAuthStore } from '@/store/auth';
import { useLocaleStore } from '@/store/locale';

import '@/components/layout/main-layout.css';

interface MainLayoutProps {
  children: ReactNode;
}

// Routes that should not display the header
const ROUTES_WITHOUT_HEADER = ['/login', '/register'];

export const MainLayout = ({ children }: MainLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { locale, setLocale } = useLocaleStore();

  const showHeader = !ROUTES_WITHOUT_HEADER.includes(location.pathname);

  const getNavigationItems = () => {
    if (location.pathname === '/') {
      return [
        { label: t('layout.nav.articles'), href: '#hero-section' },
        { label: t('layout.nav.recentComments'), href: '#comments-section' },
        { label: t('layout.nav.latestArticles'), href: '#articles-section' },
      ];
    }
    return [];
  };

  const navigationItems = getNavigationItems();

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      navigate(href);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // If route is in whitelist, render children without header
  if (!showHeader) {
    return <>{children}</>;
  }

  return (
    <div className="main-layout">
      {/* Header */}
      <header className="main-header">
        <div className="container">
          <div className="header-content">
            <div className="logo" onClick={() => navigate('/')}>
              <span className="logo-icon">✈️</span>
              <span className="logo-text">TravelArticle</span>
            </div>

            {navigationItems.length > 0 && (
              <nav className="nav-menu">
                {navigationItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleNavClick(item.href)}
                    className="nav-link"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            )}

            <div className="header-actions">
              {/* Language Switcher */}
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="cursor-pointer"
                  >
                    <Globe className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  {locales.map((loc) => (
                    <DropdownMenuItem
                      key={loc.value}
                      onClick={() => setLocale(loc.value)}
                      className={`cursor-pointer ${
                        locale === loc.value
                          ? 'bg-accent text-accent-foreground'
                          : ''
                      }`}
                    >
                      {loc.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Auth Actions */}
              {isAuthenticated ? (
                <>
                  {/* Create Dropdown */}
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="cursor-pointer"
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={() => navigate('/article/create')}
                        className="cursor-pointer"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        {t('layout.create.article')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate('/category/create')}
                        className="cursor-pointer"
                      >
                        <FolderPlus className="mr-2 h-4 w-4" />
                        {t('layout.create.category')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* User Profile Dropdown */}
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="user-avatar-button cursor-pointer"
                      >
                        <div className="user-avatar">
                          {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem disabled className="cursor-default">
                        <Mail className="mr-2 h-4 w-4" />
                        {user?.email}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-destructive focus:text-destructive cursor-pointer"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        {t('layout.user.signOut')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/login')}
                    className="cursor-pointer"
                  >
                    {t('auth.signIn')}
                  </Button>
                  <Button
                    onClick={() => navigate('/register')}
                    className="cursor-pointer"
                  >
                    {t('auth.signUp')}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">{children}</main>
    </div>
  );
};
