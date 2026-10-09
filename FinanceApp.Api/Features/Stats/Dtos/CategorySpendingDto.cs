namespace FinanceApp.Api.Features.Stats.Dtos;

public record CategorySpendingDto(
    int CategoryId,
    string CategoryName,
    string Color,
    string Icon,
    decimal TotalAmount,
    int TransactionCount,
    decimal Percentage);