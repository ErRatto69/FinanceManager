namespace FinanceApp.Api.Features.Stats.Dtos;

public record MonthlyStatsDto(
    int Month,
    int Year,
    decimal TotalSpent,
    IReadOnlyList<CategorySpendingDto> Categories);