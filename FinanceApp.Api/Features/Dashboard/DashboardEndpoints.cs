using FinanceApp.Api.Domain.Enums;

namespace FinanceApp.Api.Features.Dashboard;

public static class DashboardEndpoints
{
    public static IEndpointRouteBuilder MapDashboardEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/dashboard")
            .WithTags("Dashboard")
            .RequireAuthorization(policy => policy.RequireRole(nameof(UserRole.Admin), nameof(UserRole.Standard)));

        group.MapGet("/summary", async (IDashboardService dashboardService, CancellationToken ct) =>
        {
            var summary = await dashboardService.GetSummaryAsync(ct);
            return Results.Ok(summary);
        });

        return app;
    }
}