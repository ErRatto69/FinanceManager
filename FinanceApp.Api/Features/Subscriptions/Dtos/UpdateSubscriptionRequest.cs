using FinanceApp.Api.Domain.Enums;

namespace FinanceApp.Api.Features.Subscriptions.Dtos;

public record UpdateSubscriptionRequest(
    string Name,
    decimal Amount,
    CurrencyType Currency,
    int RenewalDay,
    int CategoryId,
    bool IsActive);