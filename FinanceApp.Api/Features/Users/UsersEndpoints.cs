using FinanceApp.Api.Domain.Enums;
using FinanceApp.Api.Features.Users.Dtos;

namespace FinanceApp.Api.Features.Users;

public static class UsersEndpoints
{
    public static IEndpointRouteBuilder MapUsersEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/users")
            .WithTags("Users")
            .RequireAuthorization(policy => policy.RequireRole(nameof(UserRole.Admin)));

        group.MapGet("/", async (IUsersService usersService, CancellationToken ct) =>
        {
            var users = await usersService.GetAllUsersAsync(ct);
            return Results.Ok(users);
        });

        group.MapPost("/", async (CreateUserRequest request, IUsersService usersService, CancellationToken ct) =>
        {
            var createdUser = await usersService.CreateUserAsync(request, ct);
            return Results.Created($"/api/users/{createdUser.Id}", createdUser);
        });

        group.MapPut("/{id:int}/role", async (int id, UpdateUserRoleRequest request, IUsersService usersService, CancellationToken ct) =>
        {
            var updatedUser = await usersService.UpdateUserRoleAsync(id, request, ct);
            return Results.Ok(updatedUser);
        });

        group.MapDelete("/{id:int}", async (int id, IUsersService usersService, CancellationToken ct) =>
        {
            await usersService.DeactivateUserAsync(id, ct);
            return Results.NoContent();
        });

        return app;
    }
}