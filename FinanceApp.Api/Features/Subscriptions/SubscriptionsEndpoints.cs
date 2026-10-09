using FinanceApp.Api.Domain.Enums;
using FinanceApp.Api.Features.Subscriptions.Dtos;

namespace FinanceApp.Api.Features.Subscriptions;

public static class SubscriptionsEndpoints
{
    public static IEndpointRouteBuilder MapSubscriptionsEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/subscriptions")
            .WithTags("Subscriptions")
            .RequireAuthorization(policy => policy.RequireRole(nameof(UserRole.Admin), nameof(UserRole.Standard)));

        group.MapGet("/", async (bool? activeOnly, ISubscriptionsService service, CancellationToken ct) =>
        {
            var subscriptions = await service.GetAllSubscriptionsAsync(activeOnly, ct);
            return Results.Ok(subscriptions);
        });

        group.MapGet("/{id:int}", async (int id, ISubscriptionsService service, CancellationToken ct) =>
        {
            var subscription = await service.GetSubscriptionByIdAsync(id, ct);
            return Results.Ok(subscription);
        });

        group.MapPost("/", async (CreateSubscriptionRequest request, ISubscriptionsService service, CancellationToken ct) =>
        {
            var created = await service.CreateSubscriptionAsync(request, ct);
            return Results.Created($"/api/subscriptions/{created.Id}", created);
        });

        group.MapPut("/{id:int}", async (int id, UpdateSubscriptionRequest request, ISubscriptionsService service, CancellationToken ct) =>
        {
            var updated = await service.UpdateSubscriptionAsync(id, request, ct);
            return Results.Ok(updated);
        });

        group.MapDelete("/{id:int}", async (int id, ISubscriptionsService service, CancellationToken ct) =>
        {
            await service.DeleteSubscriptionAsync(id, ct);
            return Results.NoContent();
        });

        return app;
    }
}