import { apiClient } from '../../../api/apiClient';
import type { UserDto, CreateUserRequest, UpdateUserRoleRequest } from '../types/user-admin.types';

export const usersApi = {
    getAllUsers: async (): Promise<UserDto[]> => {
        const response = await apiClient.get<UserDto[]>('/api/users');
        return response.data;
    },

    createUser: async (payload: CreateUserRequest): Promise<UserDto> => {
        const response = await apiClient.post<UserDto>('/api/users', payload);
        return response.data;
    },

    updateUserRole: async (id: number, payload: UpdateUserRoleRequest): Promise<UserDto> => {
        const response = await apiClient.put<UserDto>(`/api/users/${id}/role`, payload);
        return response.data;
    },

    deactivateUser: async (id: number): Promise<void> => {
        await apiClient.delete(`/api/users/${id}`);
    },
};