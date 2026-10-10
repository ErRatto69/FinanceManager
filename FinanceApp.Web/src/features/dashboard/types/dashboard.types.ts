import type { CurrencyType } from '../../../types/user.types';

export interface UnpaidBillDto {
    id: number;
    title: string;
    amount: number;
    currency: CurrencyType;
    exchangeRate: number;
    amountChf: number;
    dueDate: string;
    categoryId: number;
    categoryName: string;
    categoryColor: string;
    categoryIcon: string;
    createdByUserId: number;
    createdByUsername: string;
}

export interface RecentTransactionDto {
    id: number;
    title: string;
    amount: number;
    currency: CurrencyType;
    amountChf: number;
    paidDate: string;
    categoryId: number;
    categoryName: string;
    categoryColor: string;
    categoryIcon: string;
    createdByUserId: number;
    createdByUsername: string;
}

export interface ActiveSubscriptionSummaryDto {
    id: number;
    name: string;
    amount: number;
    currency: CurrencyType;
    amountChf: number;
    renewalDay: number;
    categoryId: number;
    categoryName: string;
    categoryColor: string;
    categoryIcon: string;
}

export interface DashboardSummaryDto {
    monthlySpentTotal: number;
    activeSubscriptionsMonthlyTotal: number;
    unpaidBills: UnpaidBillDto[];
    recentTransactions: RecentTransactionDto[];
    activeSubscriptions: ActiveSubscriptionSummaryDto[];
}