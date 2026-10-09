using FinanceApp.Api.Features.Subscriptions.Dtos;

namespace FinanceApp.Api.Features.Subscriptions;

public interface ISubscriptionsService
{
    Task<IReadOnlyList<SubscriptionDto>> GetAllSubscriptionsAsync(bool? activeOnly = null, CancellationToken cancellationToken = default);
    Task<SubscriptionDto> GetSubscriptionByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<SubscriptionDto> CreateSubscriptionAsync(CreateSubscriptionRequest request, CancellationToken cancellationToken = default);
    Task<SubscriptionDto> UpdateSubscriptionAsync(int id, UpdateSubscriptionRequest request, CancellationToken cancellationToken = default);
    Task DeleteSubscriptionAsync(int id, CancellationToken cancellationToken = default);
}