import { apiClient } from '../../../api/apiClient';
import type {
    TransactionDto,
    CreateTransactionRequest,
    UpdateTransactionRequest,
    TransactionFilterParams,
} from '../types/transaction.types';

export const transactionsApi = {
    getAll: async (filters: TransactionFilterParams = {}): Promise<TransactionDto[]> => {
        const response = await apiClient.get<TransactionDto[]>('/api/transactions', {
            params: filters,
        });
        return response.data;
    },

    getById: async (id: number): Promise<TransactionDto> => {
        const response = await apiClient.get<TransactionDto>(`/api/transactions/${id}`);
        return response.data;
    },

    create: async (payload: CreateTransactionRequest): Promise<TransactionDto> => {
        const response = await apiClient.post<TransactionDto>('/api/transactions', payload);
        return response.data;
    },

    update: async (id: number, payload: UpdateTransactionRequest): Promise<TransactionDto> => {
        const response = await apiClient.put<TransactionDto>(`/api/transactions/${id}`, payload);
        return response.data;
    },

    payNow: async (id: number): Promise<TransactionDto> => {
        const response = await apiClient.patch<TransactionDto>(`/api/transactions/${id}/pay`);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/api/transactions/${id}`);
    },
};