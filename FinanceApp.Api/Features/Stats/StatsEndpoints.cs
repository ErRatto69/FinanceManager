using FinanceApp.Api.Domain.Enums;

namespace FinanceApp.Api.Features.Stats;

public static class StatsEndpoints
{
    public static IEndpointRouteBuilder MapStatsEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/stats")
            .WithTags("Statistics")
            .RequireAuthorization(policy => policy.RequireRole(nameof(UserRole.Admin), nameof(UserRole.Standard)));

        group.MapGet("/", async (int? month, int? year, IStatsService statsService, CancellationToken ct) =>
        {
            var stats = await statsService.GetMonthlyStatsAsync(month, year, ct);
            return Results.Ok(stats);
        });

        return app;
    }
}