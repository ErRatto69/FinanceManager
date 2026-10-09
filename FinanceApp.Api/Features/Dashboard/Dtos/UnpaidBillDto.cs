using FinanceApp.Api.Domain.Enums;

namespace FinanceApp.Api.Features.Dashboard.Dtos;

public record UnpaidBillDto(
    int Id,
    string Title,
    decimal Amount,
    CurrencyType Currency,
    decimal ExchangeRate,
    decimal AmountChf,
    DateOnly DueDate,
    int CategoryId,
    string CategoryName,
    string CategoryColor,
    string CategoryIcon,
    int CreatedByUserId,
    string CreatedByUsername);