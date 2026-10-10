import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsApi } from '../api/transactionsApi';
import type {
    CreateTransactionRequest,
    UpdateTransactionRequest,
    TransactionFilterParams,
} from '../types/transaction.types';

export const TRANSACTIONS_QUERY_KEY = ['transactions'];

export const useTransactionsQuery = (filters: TransactionFilterParams = {}) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: [...TRANSACTIONS_QUERY_KEY, filters],
        queryFn: () => transactionsApi.getAll(filters),
    });

    const invalidateRelatedQueries = () => {
        queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
        queryClient.invalidateQueries({ queryKey: ['stats'] });
    };

    const createMutation = useMutation({
        mutationFn: (payload: CreateTransactionRequest) => transactionsApi.create(payload),
        onSuccess: invalidateRelatedQueries,
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: UpdateTransactionRequest }) =>
            transactionsApi.update(id, payload),
        onSuccess: invalidateRelatedQueries,
    });

    const payNowMutation = useMutation({
        mutationFn: (id: number) => transactionsApi.payNow(id),
        onSuccess: invalidateRelatedQueries,
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => transactionsApi.delete(id),
        onSuccess: invalidateRelatedQueries,
    });

    return {
        ...query,
        createTransaction: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        updateTransaction: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
        payNow: payNowMutation.mutateAsync,
        isPaying: payNowMutation.isPending,
        deleteTransaction: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
    };
};