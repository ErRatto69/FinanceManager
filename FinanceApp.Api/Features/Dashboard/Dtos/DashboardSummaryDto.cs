namespace FinanceApp.Api.Features.Dashboard.Dtos;

public record DashboardSummaryDto(
    decimal MonthlySpentTotal,
    decimal ActiveSubscriptionsMonthlyTotal,
    IReadOnlyList<UnpaidBillDto> UnpaidBills,
    IReadOnlyList<RecentTransactionDto> RecentTransactions,
    IReadOnlyList<ActiveSubscriptionSummaryDto> ActiveSubscriptions);