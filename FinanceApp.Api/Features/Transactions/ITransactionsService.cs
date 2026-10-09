using FinanceApp.Api.Domain.Enums;
using FinanceApp.Api.Features.Transactions.Dtos;

namespace FinanceApp.Api.Features.Transactions;

public interface ITransactionsService
{
    Task<IReadOnlyList<TransactionDto>> GetTransactionsAsync(
        int? month = null,
        int? year = null,
        bool? isPaid = null,
        int? categoryId = null,
        CancellationToken cancellationToken = default);

    Task<TransactionDto> GetTransactionByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<TransactionDto> CreateTransactionAsync(CreateTransactionRequest request, CancellationToken cancellationToken = default);
    Task<TransactionDto> UpdateTransactionAsync(int id, UpdateTransactionRequest request, CancellationToken cancellationToken = default);
    Task<TransactionDto> PayTransactionAsync(int id, CancellationToken cancellationToken = default);
    Task DeleteTransactionAsync(int id, CancellationToken cancellationToken = default);
}