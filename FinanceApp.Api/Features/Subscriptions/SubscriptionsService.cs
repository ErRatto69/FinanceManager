using FinanceApp.Api.Common.Exceptions;
using FinanceApp.Api.Domain.Entities;
using FinanceApp.Api.Features.Subscriptions.Dtos;
using FinanceApp.Api.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace FinanceApp.Api.Features.Subscriptions;

public class SubscriptionsService : ISubscriptionsService
{
    private readonly FinanceDbContext _dbContext;

    public SubscriptionsService(FinanceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<SubscriptionDto>> GetAllSubscriptionsAsync(bool? activeOnly = null, CancellationToken cancellationToken = default)
    {
        var query = _dbContext.Subscriptions
            .AsNoTracking()
            .Include(s => s.Category)
            .AsQueryable();

        if (activeOnly.HasValue)
        {
            query = query.Where(s => s.IsActive == activeOnly.Value);
        }

        return await query
            .OrderBy(s => s.Name)
            .Select(s => new SubscriptionDto(
                s.Id,
                s.Name,
                s.Amount,
                s.Currency,
                s.RenewalDay,
                s.CategoryId,
                s.Category.Name,
                s.IsActive))
            .ToListAsync(cancellationToken);
    }

    public async Task<SubscriptionDto> GetSubscriptionByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var subscription = await _dbContext.Subscriptions
            .AsNoTracking()
            .Include(s => s.Category)
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);

        if (subscription is null)
        {
            throw new NotFoundException($"Subscription with ID {id} not found.");
        }

        return new SubscriptionDto(
            subscription.Id,
            subscription.Name,
            subscription.Amount,
            subscription.Currency,
            subscription.RenewalDay,
            subscription.CategoryId,
            subscription.Category.Name,
            subscription.IsActive);
    }

    public async Task<SubscriptionDto> CreateSubscriptionAsync(CreateSubscriptionRequest request, CancellationToken cancellationToken = default)
    {
        ValidateSubscriptionParameters(request.Name, request.Amount, request.RenewalDay);

        var category = await _dbContext.Categories
            .FirstOrDefaultAsync(c => c.Id == request.CategoryId, cancellationToken);

        if (category is null)
        {
            throw new BadRequestException($"Category with ID {request.CategoryId} does not exist.");
        }

        var subscription = new Subscription
        {
            Name = request.Name.Trim(),
            Amount = request.Amount,
            Currency = request.Currency,
            RenewalDay = request.RenewalDay,
            CategoryId = request.CategoryId,
            IsActive = true
        };

        _dbContext.Subscriptions.Add(subscription);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new SubscriptionDto(
            subscription.Id,
            subscription.Name,
            subscription.Amount,
            subscription.Currency,
            subscription.RenewalDay,
            subscription.CategoryId,
            category.Name,
            subscription.IsActive);
    }

    public async Task<SubscriptionDto> UpdateSubscriptionAsync(int id, UpdateSubscriptionRequest request, CancellationToken cancellationToken = default)
    {
        ValidateSubscriptionParameters(request.Name, request.Amount, request.RenewalDay);

        var subscription = await _dbContext.Subscriptions
            .Include(s => s.Category)
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);

        if (subscription is null)
        {
            throw new NotFoundException($"Subscription with ID {id} not found.");
        }

        if (subscription.CategoryId != request.CategoryId)
        {
            var categoryExists = await _dbContext.Categories
                .AnyAsync(c => c.Id == request.CategoryId, cancellationToken);

            if (!categoryExists)
            {
                throw new BadRequestException($"Category with ID {request.CategoryId} does not exist.");
            }

            subscription.CategoryId = request.CategoryId;
        }

        subscription.Name = request.Name.Trim();
        subscription.Amount = request.Amount;
        subscription.Currency = request.Currency;
        subscription.RenewalDay = request.RenewalDay;
        subscription.IsActive = request.IsActive;

        await _dbContext.SaveChangesAsync(cancellationToken);

        // Reload updated category name if changed
        var categoryName = subscription.Category?.Id == subscription.CategoryId
            ? subscription.Category.Name
            : (await _dbContext.Categories.FindAsync([subscription.CategoryId], cancellationToken))!.Name;

        return new SubscriptionDto(
            subscription.Id,
            subscription.Name,
            subscription.Amount,
            subscription.Currency,
            subscription.RenewalDay,
            subscription.CategoryId,
            categoryName,
            subscription.IsActive);
    }

    public async Task DeleteSubscriptionAsync(int id, CancellationToken cancellationToken = default)
    {
        var subscription = await _dbContext.Subscriptions
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);

        if (subscription is null)
        {
            throw new NotFoundException($"Subscription with ID {id} not found.");
        }

        _dbContext.Subscriptions.Remove(subscription);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    private static void ValidateSubscriptionParameters(string name, decimal amount, int renewalDay)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new BadRequestException("Subscription name is required.");
        }

        if (amount < 0)
        {
            throw new BadRequestException("Subscription amount cannot be negative.");
        }

        if (renewalDay is < 1 or > 31)
        {
            throw new BadRequestException("Renewal day must be between 1 and 31.");
        }
    }
}