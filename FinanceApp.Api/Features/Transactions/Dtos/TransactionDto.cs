using FinanceApp.Api.Domain.Enums;

namespace FinanceApp.Api.Features.Transactions.Dtos;

public record TransactionDto(
    int Id,
    string Title,
    decimal Amount,
    CurrencyType Currency,
    decimal ExchangeRate,
    decimal AmountChf,
    DateOnly DueDate,
    bool IsPaid,
    DateOnly? PaidDate,
    string? BillingPeriod,
    int? SubscriptionId,
    int CategoryId,
    string CategoryName,
    int CreatedByUserId,
    string CreatedByUsername);