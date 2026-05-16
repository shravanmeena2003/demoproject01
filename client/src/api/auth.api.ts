import { apiClient } from './client';
import { ApiResponse, AuthData, User } from '@/types';
import { LoginFormData, RegisterFormData } from '@/schemas/auth.schema';

export const authApi = {
  login: async (data: LoginFormData): Promise<AuthData> => {
    const res = await apiClient.post<ApiResponse<AuthData>>('/auth/login', data);
    return res.data.data;
  },

  register: async (data: Omit<RegisterFormData, 'confirmPassword'>): Promise<AuthData> => {
    const res = await apiClient.post<ApiResponse<AuthData>>('/auth/register', data);
    return res.data.data;
  },

  getMe: async (): Promise<User> => {
    const res = await apiClient.get<ApiResponse<User>>('/auth/me');
    return res.data.data;
  },
};
