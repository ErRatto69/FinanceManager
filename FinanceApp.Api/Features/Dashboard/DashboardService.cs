using FinanceApp.Api.Domain.Enums;
using FinanceApp.Api.Features.Dashboard.Dtos;
using FinanceApp.Api.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace FinanceApp.Api.Features.Dashboard;

public class DashboardService : IDashboardService
{
    private readonly FinanceDbContext _dbContext;
    private const decimal EurExchangeRate = 0.9500m;

    public DashboardService(FinanceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<DashboardSummaryDto> GetSummaryAsync(CancellationToken cancellationToken = default)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var currentYear = today.Year;
        var currentMonth = today.Month;

        // 1. Total spent this month on paid transactions (in CHF)
        var monthlySpentTotal = await _dbContext.Transactions
            .AsNoTracking()
            .Where(t => t.IsPaid && 
                        t.PaidDate.HasValue && 
                        t.PaidDate.Value.Year == currentYear && 
                        t.PaidDate.Value.Month == currentMonth)
            .SumAsync(t => t.AmountChf, cancellationToken);

        // 2. Unpaid bills ordered by DueDate ascending
        var unpaidBills = await _dbContext.Transactions
            .AsNoTracking()
            .Where(t => !t.IsPaid)
            .Include(t => t.Category)
            .Include(t => t.CreatedByUser)
            .OrderBy(t => t.DueDate)
            .ThenBy(t => t.Id)
            .Select(t => new UnpaidBillDto(
                t.Id,
                t.Title,
                t.Amount,
                t.Currency,
                t.ExchangeRate,
                t.AmountChf,
                t.DueDate,
                t.Category.Id,
                t.Category.Name,
                t.Category.Color,
                t.Category.Icon,
                t.CreatedByUser.Id,
                t.CreatedByUser.Username))
            .ToListAsync(cancellationToken);

        // 3. Recent 10 paid transactions
        var recentTransactions = await _dbContext.Transactions
            .AsNoTracking()
            .Where(t => t.IsPaid && t.PaidDate.HasValue)
            .Include(t => t.Category)
            .Include(t => t.CreatedByUser)
            .OrderByDescending(t => t.PaidDate)
            .ThenByDescending(t => t.Id)
            .Take(10)
            .Select(t => new RecentTransactionDto(
                t.Id,
                t.Title,
                t.Amount,
                t.Currency,
                t.AmountChf,
                t.PaidDate!.Value,
                t.Category.Id,
                t.Category.Name,
                t.Category.Color,
                t.Category.Icon,
                t.CreatedByUser.Id,
                t.CreatedByUser.Username))
            .ToListAsync(cancellationToken);

        // 4. Active subscriptions with normalized CHF amounts
        var activeSubscriptionsEntities = await _dbContext.Subscriptions
            .AsNoTracking()
            .Where(s => s.IsActive)
            .Include(s => s.Category)
            .OrderBy(s => s.RenewalDay)
            .ToListAsync(cancellationToken);

        var activeSubscriptions = activeSubscriptionsEntities.Select(s =>
        {
            var rate = s.Currency == CurrencyType.EUR ? EurExchangeRate : 1.0000m;
            var amountChf = Math.Round(s.Amount * rate, 2, MidpointRounding.AwayFromZero);

            return new ActiveSubscriptionSummaryDto(
                s.Id,
                s.Name,
                s.Amount,
                s.Currency,
                amountChf,
                s.RenewalDay,
                s.Category.Id,
                s.Category.Name,
                s.Category.Color,
                s.Category.Icon);
        }).ToList();

        var activeSubscriptionsMonthlyTotal = activeSubscriptions.Sum(s => s.AmountChf);

        return new DashboardSummaryDto(
            monthlySpentTotal,
            activeSubscriptionsMonthlyTotal,
            unpaidBills,
            recentTransactions,
            activeSubscriptions);
    }
}