using FinanceApp.Api.Common.Exceptions;
using FinanceApp.Api.Domain.Entities;
using FinanceApp.Api.Domain.Enums;
using FinanceApp.Api.Features.Transactions.Dtos;
using FinanceApp.Api.Infrastructure.Auth;
using FinanceApp.Api.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace FinanceApp.Api.Features.Transactions;

public class TransactionsService : ITransactionsService
{
    private readonly FinanceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;
    private const decimal EurExchangeRate = 0.9500m;
    private const decimal ChfExchangeRate = 1.0000m;

    public TransactionsService(FinanceDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<IReadOnlyList<TransactionDto>> GetTransactionsAsync(
        int? month = null,
        int? year = null,
        bool? isPaid = null,
        int? categoryId = null,
        CancellationToken cancellationToken = default)
    {
        var query = _dbContext.Transactions
            .AsNoTracking()
            .Include(t => t.Category)
            .Include(t => t.CreatedByUser)
            .AsQueryable();

        if (isPaid.HasValue)
        {
            query = query.Where(t => t.IsPaid == isPaid.Value);
        }

        if (categoryId.HasValue)
        {
            query = query.Where(t => t.CategoryId == categoryId.Value);
        }

        if (year.HasValue && month.HasValue)
        {
            query = query.Where(t =>
                (t.IsPaid && t.PaidDate.HasValue && t.PaidDate.Value.Year == year.Value && t.PaidDate.Value.Month == month.Value) ||
                (!t.IsPaid && t.DueDate.Year == year.Value && t.DueDate.Month == month.Value));
        }

        return await query
            .OrderByDescending(t => t.IsPaid ? t.PaidDate : t.DueDate)
            .ThenByDescending(t => t.Id)
            .Select(t => MapToDto(t))
            .ToListAsync(cancellationToken);
    }

    public async Task<TransactionDto> GetTransactionByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var transaction = await _dbContext.Transactions
            .AsNoTracking()
            .Include(t => t.Category)
            .Include(t => t.CreatedByUser)
            .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);

        if (transaction is null)
        {
            throw new NotFoundException($"Transaction with ID {id} not found.");
        }

        return MapToDto(transaction);
    }

    public async Task<TransactionDto> CreateTransactionAsync(CreateTransactionRequest request, CancellationToken cancellationToken = default)
    {
        ValidateTransactionParameters(request.Title, request.Amount);

        var currentUserId = _currentUserService.UserId;
        if (!currentUserId.HasValue)
        {
            throw new UnauthorizedException("Authenticated user could not be identified.");
        }

        var category = await _dbContext.Categories
            .FirstOrDefaultAsync(c => c.Id == request.CategoryId, cancellationToken);

        if (category is null)
        {
            throw new BadRequestException($"Category with ID {request.CategoryId} does not exist.");
        }

        var exchangeRate = request.Currency == CurrencyType.EUR ? EurExchangeRate : ChfExchangeRate;
        var amountChf = Math.Round(request.Amount * exchangeRate, 2, MidpointRounding.AwayFromZero);

        DateOnly? paidDate = request.IsPaid
            ? (request.PaidDate ?? DateOnly.FromDateTime(DateTime.UtcNow))
            : null;

        var transaction = new Transaction
        {
            Title = request.Title.Trim(),
            Amount = request.Amount,
            Currency = request.Currency,
            ExchangeRate = exchangeRate,
            AmountChf = amountChf,
            DueDate = request.DueDate,
            IsPaid = request.IsPaid,
            PaidDate = paidDate,
            CategoryId = request.CategoryId,
            CreatedByUserId = currentUserId.Value
        };

        _dbContext.Transactions.Add(transaction);
        await _dbContext.SaveChangesAsync(cancellationToken);

        var user = await _dbContext.AppUsers.FindAsync([currentUserId.Value], cancellationToken);

        return new TransactionDto(
            transaction.Id,
            transaction.Title,
            transaction.Amount,
            transaction.Currency,
            transaction.ExchangeRate,
            transaction.AmountChf,
            transaction.DueDate,
            transaction.IsPaid,
            transaction.PaidDate,
            transaction.BillingPeriod,
            transaction.SubscriptionId,
            category.Id,
            category.Name,
            user!.Id,
            user.Username);
    }

    public async Task<TransactionDto> UpdateTransactionAsync(int id, UpdateTransactionRequest request, CancellationToken cancellationToken = default)
    {
        ValidateTransactionParameters(request.Title, request.Amount);

        var transaction = await _dbContext.Transactions
            .Include(t => t.Category)
            .Include(t => t.CreatedByUser)
            .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);

        if (transaction is null)
        {
            throw new NotFoundException($"Transaction with ID {id} not found.");
        }

        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        // Blocco modifica se la transazione era già saldata in un mese precedente
        if (transaction.IsPaid && transaction.PaidDate.HasValue)
        {
            if (transaction.PaidDate.Value.Year != today.Year || transaction.PaidDate.Value.Month != today.Month)
            {
                throw new BadRequestException("Paid transactions from previous months cannot be modified.");
            }
        }

        if (transaction.CategoryId != request.CategoryId)
        {
            var categoryExists = await _dbContext.Categories
                .AnyAsync(c => c.Id == request.CategoryId, cancellationToken);

            if (!categoryExists)
            {
                throw new BadRequestException($"Category with ID {request.CategoryId} does not exist.");
            }

            transaction.CategoryId = request.CategoryId;
        }

        var exchangeRate = request.Currency == CurrencyType.EUR ? EurExchangeRate : ChfExchangeRate;
        var amountChf = Math.Round(request.Amount * exchangeRate, 2, MidpointRounding.AwayFromZero);

        DateOnly? paidDate = request.IsPaid
            ? (request.PaidDate ?? transaction.PaidDate ?? today)
            : null;

        transaction.Title = request.Title.Trim();
        transaction.Amount = request.Amount;
        transaction.Currency = request.Currency;
        transaction.ExchangeRate = exchangeRate;
        transaction.AmountChf = amountChf;
        transaction.DueDate = request.DueDate;
        transaction.IsPaid = request.IsPaid;
        transaction.PaidDate = paidDate;

        await _dbContext.SaveChangesAsync(cancellationToken);

        var categoryName = (await _dbContext.Categories.FindAsync([transaction.CategoryId], cancellationToken))!.Name;

        return new TransactionDto(
            transaction.Id,
            transaction.Title,
            transaction.Amount,
            transaction.Currency,
            transaction.ExchangeRate,
            transaction.AmountChf,
            transaction.DueDate,
            transaction.IsPaid,
            transaction.PaidDate,
            transaction.BillingPeriod,
            transaction.SubscriptionId,
            transaction.CategoryId,
            categoryName,
            transaction.CreatedByUser.Id,
            transaction.CreatedByUser.Username);
    }

    public async Task<TransactionDto> PayTransactionAsync(int id, CancellationToken cancellationToken = default)
    {
        var transaction = await _dbContext.Transactions
            .Include(t => t.Category)
            .Include(t => t.CreatedByUser)
            .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);

        if (transaction is null)
        {
            throw new NotFoundException($"Transaction with ID {id} not found.");
        }

        if (transaction.IsPaid)
        {
            throw new BadRequestException("This transaction has already been paid.");
        }

        transaction.IsPaid = true;
        transaction.PaidDate = DateOnly.FromDateTime(DateTime.UtcNow);

        await _dbContext.SaveChangesAsync(cancellationToken);

        return MapToDto(transaction);
    }

    public async Task DeleteTransactionAsync(int id, CancellationToken cancellationToken = default)
    {
        var transaction = await _dbContext.Transactions
            .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);

        if (transaction is null)
        {
            throw new NotFoundException($"Transaction with ID {id} not found.");
        }

        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        // Blocco cancellazione se la transazione era già saldata in un mese precedente
        if (transaction.IsPaid && transaction.PaidDate.HasValue)
        {
            if (transaction.PaidDate.Value.Year != today.Year || transaction.PaidDate.Value.Month != today.Month)
            {
                throw new BadRequestException("Paid transactions from previous months cannot be deleted.");
            }
        }

        _dbContext.Transactions.Remove(transaction);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    private static void ValidateTransactionParameters(string title, decimal amount)
    {
        if (string.IsNullOrWhiteSpace(title))
        {
            throw new BadRequestException("Transaction title is required.");
        }

        if (amount <= 0)
        {
            throw new BadRequestException("Transaction amount must be greater than zero.");
        }
    }

    private static TransactionDto MapToDto(Transaction t) => new(
        t.Id,
        t.Title,
        t.Amount,
        t.Currency,
        t.ExchangeRate,
        t.AmountChf,
        t.DueDate,
        t.IsPaid,
        t.PaidDate,
        t.BillingPeriod,
        t.SubscriptionId,
        t.Category.Id,
        t.Category.Name,
        t.CreatedByUser.Id,
        t.CreatedByUser.Username);
}