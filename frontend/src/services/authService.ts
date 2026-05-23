import { api } from './api';
import type { AuthSession, LoginInput } from '../models/Auth';

export const authService = {
  async login(credentials: LoginInput): Promise<AuthSession> {
    const response = await api.post<AuthSession>('/auth/login', credentials);
    return response.data;
  },

  async requestPasswordReset(email: string): Promise<{ message: string; expiresAt?: string }> {
    try {
      const response = await api.post<{ message: string; expiresAt?: string }>('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      const message =
        typeof error === 'object' && error && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;

      throw new Error(
        message || 'Não foi possível enviar o código de recuperação. Configure SMTP_USER e SMTP_PASS do Gmail no backend.',
      );
    }
  },

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>('/auth/reset-password', { token, password });
      return response.data;
    } catch (error) {
      const message =
        typeof error === 'object' && error && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;

      throw new Error(message || 'Não foi possível redefinir a senha.');
    }
  },
};