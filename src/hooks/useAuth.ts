import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth';
import type { LoginRequest, RegisterRequest } from '@/types/auth';

/**
 * Custom hook for login mutation
 *
 * Features:
 * - Handles login API request with TanStack Query mutation
 * - Automatic state management (loading, error, success)
 * - Saves auth token and user to store on success
 * - Automatic navigation to dashboard or redirect URL on success
 * - Query cache invalidation for user data
 * - Supports redirect parameter for post-login navigation
 *
 * @example
 * ```tsx
 * const loginMutation = useLogin('/article/123'); // with redirect
 * // or
 * const loginMutation = useLogin(); // default to dashboard
 *
 * const handleLogin = async (data) => {
 *   try {
 *     await loginMutation.mutateAsync(data);
 *   } catch (error) {
 *     console.error(error);
 *   }
 * };
 * ```
 */
export const useLogin = (redirectPath?: string) => {
  const navigate = useNavigate();
  const { login: loginToStore } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      // Save to auth store
      loginToStore(response.jwt, response.user);

      // Invalidate any user-specific queries if needed
      queryClient.invalidateQueries({ queryKey: ['user'] });

      // Navigate to redirect path or default dashboard
      navigate(redirectPath || '/dashboard');
    },
  });
};

/**
 * Custom hook for register mutation
 *
 * Features:
 * - Handles registration API request with TanStack Query mutation
 * - Automatic state management (loading, error, success)
 * - Saves auth token and user to store on success
 * - Automatic navigation to dashboard on success
 * - Query cache invalidation for user data
 *
 * @example
 * ```tsx
 * const registerMutation = useRegister();
 *
 * const handleRegister = async (data) => {
 *   try {
 *     await registerMutation.mutateAsync(data);
 *   } catch (error) {
 *     console.error(error);
 *   }
 * };
 * ```
 */
export const useRegister = () => {
  const navigate = useNavigate();
  const { login: loginToStore } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (response) => {
      // Save to auth store
      loginToStore(response.jwt, response.user);

      // Invalidate any user-specific queries if needed
      queryClient.invalidateQueries({ queryKey: ['user'] });

      // Navigate to dashboard
      navigate('/dashboard');
    },
  });
};

/**
 * Custom hook for logout mutation
 *
 * Features:
 * - Handles logout with TanStack Query mutation
 * - Clears auth token and user from storage
 * - Clears all query cache
 * - Automatic navigation to login page
 *
 * @example
 * ```tsx
 * const logoutMutation = useLogout();
 *
 * return (
 *   <button onClick={() => logoutMutation.mutate()}>
 *     Logout
 *   </button>
 * );
 * ```
 */
export const useLogout = () => {
  const navigate = useNavigate();
  const { logout: logoutFromStore } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      authService.logout();
      return Promise.resolve();
    },
    onSuccess: () => {
      // Clear auth store
      logoutFromStore();

      // Clear all queries cache
      queryClient.clear();

      // Navigate to login
      navigate('/login');
    },
  });
};
