import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/usersApi';
import type { CreateUserRequest, UpdateUserRoleRequest } from '../types/user-admin.types';

export const USERS_QUERY_KEY = ['users'];

export const useUsersQuery = () => {
    const queryClient = useQueryClient();

    const usersQuery = useQuery({
        queryKey: USERS_QUERY_KEY,
        queryFn: usersApi.getAllUsers,
    });

    const createUserMutation = useMutation({
        mutationFn: (payload: CreateUserRequest) => usersApi.createUser(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
        },
    });

    const updateRoleMutation = useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: UpdateUserRoleRequest }) =>
            usersApi.updateUserRole(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
        },
    });

    const deactivateUserMutation = useMutation({
        mutationFn: (id: number) => usersApi.deactivateUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
        },
    });

    return {
        ...usersQuery,
        createUser: createUserMutation.mutateAsync,
        isCreating: createUserMutation.isPending,
        updateRole: updateRoleMutation.mutateAsync,
        isUpdatingRole: updateRoleMutation.isPending,
        deactivateUser: deactivateUserMutation.mutateAsync,
        isDeactivating: deactivateUserMutation.isPending,
    };
};