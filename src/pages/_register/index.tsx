import { useMemo, useState } from 'react';

import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

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
import { useRegister } from '@/hooks/useAuth';
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';

import '@/pages/_login/login.css';

function RegisterPage() {
  const intl = useIntl();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  // Use TanStack Query mutation for register
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // Memoize loading state
  const isLoading = useMemo(
    () => registerMutation.isPending,
    [registerMutation.isPending],
  );

  const onSubmit = async (data: RegisterFormData) => {
    setErrorMessage('');

    try {
      const { ...registerData } = data;
      await registerMutation.mutateAsync(registerData);
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
        'Registration failed. Please try again.';
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
          <Card className="w-full max-w-md border-gray-800 bg-gray-900/50 backdrop-blur-sm">
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
                <FormattedMessage id="auth.registerTitle" />
              </CardTitle>
              <CardDescription>
                <FormattedMessage id="auth.registerSubtitle" />
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
                  <Label htmlFor="username">
                    <FormattedMessage id="auth.fullName" />
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder={intl.formatMessage({ id: 'auth.fullName' })}
                    {...register('username')}
                    className={errors.username ? 'border-destructive' : ''}
                  />
                  {errors.username && (
                    <p className="text-destructive text-xs">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">
                    <FormattedMessage id="auth.email" />
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={intl.formatMessage({ id: 'auth.email' })}
                    {...register('email')}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-destructive text-xs">
                      {errors.email.message}
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
                    placeholder={intl.formatMessage({ id: 'auth.password' })}
                    {...register('password')}
                    className={errors.password ? 'border-destructive' : ''}
                  />
                  {errors.password && (
                    <p className="text-destructive text-xs">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="confirmPassword">
                    <FormattedMessage id="auth.confirmPassword" />
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder={intl.formatMessage({
                      id: 'auth.confirmPassword',
                    })}
                    {...register('confirmPassword')}
                    className={
                      errors.confirmPassword ? 'border-destructive' : ''
                    }
                  />
                  {errors.confirmPassword && (
                    <p className="text-destructive text-xs">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="mt-2 w-full cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <FormattedMessage id="common.loading" />
                  ) : (
                    <FormattedMessage id="auth.signUp" />
                  )}
                </Button>

                <p className="text-muted-foreground mt-4 text-center text-sm">
                  <FormattedMessage id="auth.haveAccount" />{' '}
                  <a
                    href="/login"
                    className="text-primary font-medium hover:underline"
                  >
                    <FormattedMessage id="auth.signIn" />
                  </a>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
