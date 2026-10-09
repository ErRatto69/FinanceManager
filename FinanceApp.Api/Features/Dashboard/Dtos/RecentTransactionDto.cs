using FinanceApp.Api.Domain.Enums;

namespace FinanceApp.Api.Features.Dashboard.Dtos;

public record RecentTransactionDto(
    int Id,
    string Title,
    decimal Amount,
    CurrencyType Currency,
    decimal AmountChf,
    DateOnly PaidDate,
    int CategoryId,
    string CategoryName,
    string CategoryColor,
    string CategoryIcon,
    int CreatedByUserId,
    string CreatedByUsername);