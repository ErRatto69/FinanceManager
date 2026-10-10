import type { UserRole } from '../../../types/user.types';

export interface UserDto {
    id: number;
    username: string;
    role: UserRole;
    isActive: boolean;
    createdAt: string;
}

export interface CreateUserRequest {
    username: string;
    password: string;
    role: UserRole;
}

export interface UpdateUserRoleRequest {
    role: UserRole;
}