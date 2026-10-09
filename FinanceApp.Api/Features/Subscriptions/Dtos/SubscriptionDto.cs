using FinanceApp.Api.Domain.Enums;

namespace FinanceApp.Api.Features.Subscriptions.Dtos;

public record SubscriptionDto(
    int Id,
    string Name,
    decimal Amount,
    CurrencyType Currency,
    int RenewalDay,
    int CategoryId,
    string CategoryName,
    bool IsActive);