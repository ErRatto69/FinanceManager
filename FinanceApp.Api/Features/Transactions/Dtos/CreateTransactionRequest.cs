using FinanceApp.Api.Domain.Enums;

namespace FinanceApp.Api.Features.Transactions.Dtos;

public record CreateTransactionRequest(
    string Title,
    decimal Amount,
    CurrencyType Currency,
    DateOnly DueDate,
    int CategoryId,
    bool IsPaid = false,
    DateOnly? PaidDate = null);