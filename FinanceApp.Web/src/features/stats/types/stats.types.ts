export interface CategorySpendingDto {
    categoryId: number;
    categoryName: string;
    color: string;
    icon: string;
    totalAmount: number;
    transactionCount: number;
    percentage: number;
}

export interface MonthlyStatsDto {
    month: number;
    year: number;
    totalSpent: number;
    categories: CategorySpendingDto[];
}