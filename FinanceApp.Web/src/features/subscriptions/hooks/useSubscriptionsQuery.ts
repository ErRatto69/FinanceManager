import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionsApi } from '../api/subscriptionsApi';
import type {
    CreateSubscriptionRequest,
    UpdateSubscriptionRequest,
} from '../types/subscription.types';

export const SUBSCRIPTIONS_QUERY_KEY = ['subscriptions'];

export const useSubscriptionsQuery = (activeOnly?: boolean) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: [...SUBSCRIPTIONS_QUERY_KEY, activeOnly],
        queryFn: () => subscriptionsApi.getAll(activeOnly),
    });

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    };

    const createMutation = useMutation({
        mutationFn: (payload: CreateSubscriptionRequest) => subscriptionsApi.create(payload),
        onSuccess: invalidate,
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: UpdateSubscriptionRequest }) =>
            subscriptionsApi.update(id, payload),
        onSuccess: invalidate,
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => subscriptionsApi.delete(id),
        onSuccess: invalidate,
    });

    return {
        ...query,
        createSubscription: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        updateSubscription: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
        deleteSubscription: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
    };
};