using FinanceApp.Api.Domain.Enums;

namespace FinanceApp.Api.Features.Subscriptions.Dtos;

public record CreateSubscriptionRequest(
    string Name,
    decimal Amount,
    CurrencyType Currency,
    int RenewalDay,
    int CategoryId);