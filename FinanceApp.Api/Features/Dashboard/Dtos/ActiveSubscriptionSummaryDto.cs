using FinanceApp.Api.Domain.Enums;

namespace FinanceApp.Api.Features.Dashboard.Dtos;

public record ActiveSubscriptionSummaryDto(
    int Id,
    string Name,
    decimal Amount,
    CurrencyType Currency,
    decimal AmountChf,
    int RenewalDay,
    int CategoryId,
    string CategoryName,
    string CategoryColor,
    string CategoryIcon);