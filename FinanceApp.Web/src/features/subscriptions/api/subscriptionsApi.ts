import { apiClient } from '../../../api/apiClient';
import type {
    SubscriptionDto,
    CreateSubscriptionRequest,
    UpdateSubscriptionRequest,
} from '../types/subscription.types';

export const subscriptionsApi = {
    getAll: async (activeOnly?: boolean): Promise<SubscriptionDto[]> => {
        const params = activeOnly !== undefined ? { activeOnly } : {};
        const response = await apiClient.get<SubscriptionDto[]>('/api/subscriptions', { params });
        return response.data;
    },

    getById: async (id: number): Promise<SubscriptionDto> => {
        const response = await apiClient.get<SubscriptionDto>(`/api/subscriptions/${id}`);
        return response.data;
    },

    create: async (payload: CreateSubscriptionRequest): Promise<SubscriptionDto> => {
        const response = await apiClient.post<SubscriptionDto>('/api/subscriptions', payload);
        return response.data;
    },

    update: async (id: number, payload: UpdateSubscriptionRequest): Promise<SubscriptionDto> => {
        const response = await apiClient.put<SubscriptionDto>(`/api/subscriptions/${id}`, payload);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/api/subscriptions/${id}`);
    },
};