import { useMemo, useState } from 'react';

import { ArrowLeft } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { LanguageSwitcher } from '@/components/features/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';

import '@/pages/_login/login.css';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect');
  const category = searchParams.get('category');

  // Determine redirect destination: article detail, category filter, or home
  const redirectDestination = useMemo(() => {
    if (redirectPath) return redirectPath;
    if (category) return `/?category=${encodeURIComponent(category)}`;
    return '/';
  }, [redirectPath, category]);

  // Use TanStack Query mutation for login with redirect support
  const loginMutation = useLogin(redirectDestination);

  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  // Memoize loading state
  const isLoading = useMemo(
    () => loginMutation.isPending,
    [loginMutation.isPending],
  );

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage('');

    try {
      await loginMutation.mutateAsync(data);
    } catch (error) {
      type ErrorWithResponse = {
        response?: {
          data?: {
            error?: {
              message?: string;
            };
          };
        };
        message?: string;
      };

      const err = error as ErrorWithResponse;
      const message =
        err.response?.data?.error?.message ||
        err.message ||
        'Login failed. Please try again.';
      setErrorMessage(message);
    }
  };

  return (
    <div className="login-container">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="login-main-content">
        <div className="login-left">
          <div className="login-hero-content">
            <h1>
              <FormattedMessage id="login.text" />
            </h1>
          </div>
        </div>
        <div className="login-right">
          <FormProvider {...methods}>
            <Card className="w-full max-w-lg border-gray-800 bg-gray-900/50 backdrop-blur-sm lg:max-w-2/3 xl:max-w-1/2">
              <CardHeader className="text-center">
                <div className="mb-4 flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/')}
                    className="cursor-pointer gap-2 text-gray-400 hover:text-white"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <FormattedMessage id="auth.backToHome" />
                  </Button>
                </div>

                <CardTitle className="text-2xl">
                  <FormattedMessage id="auth.login" />
                </CardTitle>
                <CardDescription>
                  <FormattedMessage id="auth.loginSubtitle" />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-4"
                >
                  {errorMessage && (
                    <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
                      {errorMessage}
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="identifier">
                      <FormattedMessage id="auth.email" />
                    </Label>
                    <Input
                      id="identifier"
                      type="email"
                      placeholder={t('auth.email')}
                      {...register('identifier')}
                      className={errors.identifier ? 'border-destructive' : ''}
                    />
                    {errors.identifier && (
                      <p className="text-destructive text-xs">
                        {errors.identifier.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="password">
                      <FormattedMessage id="auth.password" />
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder={t('auth.password')}
                      {...register('password')}
                      className={errors.password ? 'border-destructive' : ''}
                    />
                    {errors.password && (
                      <p className="text-destructive text-xs">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <a href="#" className="text-primary text-sm hover:underline">
                    <FormattedMessage id="auth.forgotPassword" />
                  </a>

                  <Button
                    type="submit"
                    className="mt-2 w-full cursor-pointer"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <FormattedMessage id="common.loading" />
                    ) : (
                      <FormattedMessage id="auth.signIn" />
                    )}
                  </Button>

                  <p className="text-muted-foreground mt-4 text-center text-sm">
                    <FormattedMessage id="auth.noAccount" />{' '}
                    <a
                      href="/register"
                      className="text-primary font-medium hover:underline"
                    >
                      <FormattedMessage id="auth.signUp" />
                    </a>
                  </p>
                </form>
              </CardContent>
            </Card>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
