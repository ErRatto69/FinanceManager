using FinanceApp.Api.Common.Exceptions;
using FinanceApp.Api.Features.Stats.Dtos;
using FinanceApp.Api.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace FinanceApp.Api.Features.Stats;

public class StatsService : IStatsService
{
    private readonly FinanceDbContext _dbContext;

    public StatsService(FinanceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<MonthlyStatsDto> GetMonthlyStatsAsync(int? month = null, int? year = null, CancellationToken cancellationToken = default)
    {
        var targetMonth = month ?? DateTime.UtcNow.Month;
        var targetYear = year ?? DateTime.UtcNow.Year;

        if (targetMonth is < 1 or > 12)
        {
            throw new BadRequestException("Month must be between 1 and 12.");
        }

        if (targetYear is < 2000 or > 2100)
        {
            throw new BadRequestException("Year is outside the valid supported range.");
        }

        // Fetch paid transactions for the requested month/year
        var paidTransactions = await _dbContext.Transactions
            .AsNoTracking()
            .Where(t => t.IsPaid &&
                        t.PaidDate.HasValue &&
                        t.PaidDate.Value.Year == targetYear &&
                        t.PaidDate.Value.Month == targetMonth)
            .Include(t => t.Category)
            .ToListAsync(cancellationToken);

        var totalSpent = paidTransactions.Sum(t => t.AmountChf);

        // Group transactions by category and compute counts, sums and percentages
        var categoryGroups = paidTransactions
            .GroupBy(t => t.Category)
            .Select(group =>
            {
                var categoryTotal = group.Sum(t => t.AmountChf);
                var percentage = totalSpent > 0m
                    ? Math.Round((categoryTotal / totalSpent) * 100m, 2, MidpointRounding.AwayFromZero)
                    : 0.00m;

                return new CategorySpendingDto(
                    group.Key.Id,
                    group.Key.Name,
                    group.Key.Color,
                    group.Key.Icon,
                    categoryTotal,
                    group.Count(),
                    percentage);
            })
            .OrderByDescending(c => c.TotalAmount)
            .ThenBy(c => c.CategoryName)
            .ToList();

        return new MonthlyStatsDto(
            targetMonth,
            targetYear,
            totalSpent,
            categoryGroups);
    }
}