using FinanceApp.Api.Domain.Entities;
using FinanceApp.Api.Domain.Enums;
using FinanceApp.Api.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace FinanceApp.Api.Infrastructure.BackgroundJobs;

public class SubscriptionBillingWorker : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<SubscriptionBillingWorker> _logger;
    private static readonly TimeSpan CheckInterval = TimeSpan.FromHours(1);

    public SubscriptionBillingWorker(
        IServiceScopeFactory scopeFactory,
        ILogger<SubscriptionBillingWorker> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Subscription Billing Worker started.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ProcessBillingCycleAsync(stoppingToken);
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                _logger.LogError(ex, "An error occurred while generating monthly subscription bills.");
            }

            await Task.Delay(CheckInterval, stoppingToken);
        }
    }

    public async Task ProcessBillingCycleAsync(CancellationToken cancellationToken)
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<FinanceDbContext>();

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var currentBillingPeriod = today.ToString("yyyy-MM");

        var activeSubscriptions = await db.Subscriptions
            .AsNoTracking()
            .Where(s => s.IsActive)
            .ToListAsync(cancellationToken);

        if (activeSubscriptions.Count == 0)
        {
            return;
        }

        // Identify subscriptions that already have an issued bill for this period
        var existingBillSubscriptionIds = await db.Transactions
            .AsNoTracking()
            .Where(t => t.BillingPeriod == currentBillingPeriod && t.SubscriptionId != null)
            .Select(t => t.SubscriptionId!.Value)
            .ToHashSetAsync(cancellationToken);

        var systemAdmin = await db.AppUsers
            .AsNoTracking()
            .Where(u => u.Role == UserRole.Admin && u.IsActive)
            .OrderBy(u => u.Id)
            .FirstOrDefaultAsync(cancellationToken);

        if (systemAdmin is null)
        {
            _logger.LogWarning("No active Admin user found to associate generated subscription transactions.");
            return;
        }

        var newTransactions = new List<Transaction>();
        var daysInCurrentMonth = DateTime.DaysInMonth(today.Year, today.Month);

        foreach (var sub in activeSubscriptions)
        {
            if (existingBillSubscriptionIds.Contains(sub.Id))
            {
                continue;
            }

            var effectiveRenewalDay = Math.Min(sub.RenewalDay, daysInCurrentMonth);

            // Bill is due if today has reached or passed the renewal day of the current month
            if (today.Day >= effectiveRenewalDay)
            {
                var exchangeRate = sub.Currency == CurrencyType.EUR ? 0.9500m : 1.0000m;
                var amountChf = Math.Round(sub.Amount * exchangeRate, 2, MidpointRounding.AwayFromZero);

                var transaction = new Transaction
                {
                    Title = sub.Name,
                    Amount = sub.Amount,
                    Currency = sub.Currency,
                    ExchangeRate = exchangeRate,
                    AmountChf = amountChf,
                    DueDate = new DateOnly(today.Year, today.Month, effectiveRenewalDay),
                    IsPaid = false,
                    PaidDate = null,
                    BillingPeriod = currentBillingPeriod,
                    SubscriptionId = sub.Id,
                    CategoryId = sub.CategoryId,
                    CreatedByUserId = systemAdmin.Id
                };

                newTransactions.Add(transaction);
            }
        }

        if (newTransactions.Count > 0)
        {
            db.Transactions.AddRange(newTransactions);
            await db.SaveChangesAsync(cancellationToken);

            _logger.LogInformation(
                "Generated {Count} subscription billing transaction(s) for period {Period}.",
                newTransactions.Count,
                currentBillingPeriod);
        }
    }
}