import axiosInstance from '@/lib/axios';
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types/auth';

export const authService = {
  // Login
  async login(data: LoginRequest): Promise<AuthResponse> {
    const params = new URLSearchParams();
    params.append('identifier', data.identifier);
    params.append('password', data.password);

    const response = await axiosInstance.post<AuthResponse>(
      '/api/auth/local',
      params,
    );

    // Save token and user to session storage
    if (response.data.jwt) {
      sessionStorage.setItem('authToken', response.data.jwt);
      sessionStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  },

  // Register
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const params = new URLSearchParams();
    params.append('email', data.email);
    params.append('username', data.username);
    params.append('password', data.password);

    const response = await axiosInstance.post<AuthResponse>(
      '/api/auth/local/register',
      params,
    );

    // Save token and user to session storage
    if (response.data.jwt) {
      sessionStorage.setItem('authToken', response.data.jwt);
      sessionStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  },

  // Logout
  logout(): void {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
  },

  // Get current token
  getToken(): string | null {
    return sessionStorage.getItem('authToken');
  },

  // Get current user
  getUser(): AuthResponse['user'] | null {
    const user = sessionStorage.getItem('user');
    return user ? (JSON.parse(user) as AuthResponse['user']) : null;
  },

  // Check if authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
