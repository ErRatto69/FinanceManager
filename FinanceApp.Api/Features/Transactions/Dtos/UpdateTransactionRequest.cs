using FinanceApp.Api.Domain.Enums;

namespace FinanceApp.Api.Features.Transactions.Dtos;

public record UpdateTransactionRequest(
    string Title,
    decimal Amount,
    CurrencyType Currency,
    DateOnly DueDate,
    int CategoryId,
    bool IsPaid,
    DateOnly? PaidDate);