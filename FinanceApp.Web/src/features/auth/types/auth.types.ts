import type { UserRole } from '../../../types/user.types';

export interface LoginRequest {
    username: string;
    password: string;
}

export interface UserProfileDto {
    id: number;
    username: string;
    role: UserRole;
}

export interface LoginResponse {
    token: string;
    expiration: string;
    user: UserProfileDto;
}