using FinanceApp.Api.Features.Auth.Dtos;

namespace FinanceApp.Api.Features.Auth;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/auth").WithTags("Authentication");

        group.MapPost("/login", async (LoginRequest request, IAuthService authService, CancellationToken ct) =>
        {
            var response = await authService.LoginAsync(request, ct);
            return Results.Ok(response);
        });

        group.MapGet("/me", async (IAuthService authService, CancellationToken ct) =>
        {
            var profile = await authService.GetCurrentProfileAsync(ct);
            return Results.Ok(profile);
        }).RequireAuthorization();

        return app;
    }

    private static async Task<UserProfileDto> GetCurrentProfileAsync(this IAuthService authService, CancellationToken ct)
    {
        return await authService.GetCurrentUserProfileAsync(ct);
    }
}