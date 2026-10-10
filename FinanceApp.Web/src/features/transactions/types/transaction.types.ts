import type { CurrencyType } from '../../../types/user.types';

export interface TransactionDto {
    id: number;
    title: string;
    amount: number;
    currency: CurrencyType;
    exchangeRate: number;
    amountChf: number;
    dueDate: string; // formato YYYY-MM-DD
    isPaid: boolean;
    paidDate: string | null;
    billingPeriod: string | null;
    subscriptionId: number | null;
    categoryId: number;
    categoryName: string;
    createdByUserId: number;
    createdByUsername: string;
}

export interface CreateTransactionRequest {
    title: string;
    amount: number;
    currency: CurrencyType;
    dueDate: string;
    categoryId: number;
    isPaid?: boolean;
    paidDate?: string | null;
}

export interface UpdateTransactionRequest {
    title: string;
    amount: number;
    currency: CurrencyType;
    dueDate: string;
    categoryId: number;
    isPaid: boolean;
    paidDate: string | null;
}

export interface TransactionFilterParams {
    month?: number;
    year?: number;
    isPaid?: boolean;
    categoryId?: number;
}