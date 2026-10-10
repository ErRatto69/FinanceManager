import { apiClient } from '../../../api/apiClient';
import type { LoginRequest, LoginResponse, UserProfileDto } from '../types/auth.types';

export const authApi = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>('/api/auth/login', credentials);
        return response.data;
    },

    getCurrentUser: async (): Promise<UserProfileDto> => {
        const response = await apiClient.get<UserProfileDto>('/api/auth/me');
        return response.data;
    },
};