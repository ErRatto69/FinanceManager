import type { CurrencyType } from '../../../types/user.types';

export interface SubscriptionDto {
    id: number;
    name: string;
    amount: number;
    currency: CurrencyType;
    renewalDay: number;
    categoryId: number;
    categoryName: string;
    isActive: boolean;
}

export interface CreateSubscriptionRequest {
    name: string;
    amount: number;
    currency: CurrencyType;
    renewalDay: number;
    categoryId: number;
}

export interface UpdateSubscriptionRequest {
    name: string;
    amount: number;
    currency: CurrencyType;
    renewalDay: number;
    categoryId: number;
    isActive: boolean;
}