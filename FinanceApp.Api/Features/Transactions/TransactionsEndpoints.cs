using FinanceApp.Api.Domain.Enums;
using FinanceApp.Api.Features.Transactions.Dtos;

namespace FinanceApp.Api.Features.Transactions;

public static class TransactionsEndpoints
{
    public static IEndpointRouteBuilder MapTransactionsEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/transactions")
            .WithTags("Transactions")
            .RequireAuthorization(policy => policy.RequireRole(nameof(UserRole.Admin), nameof(UserRole.Standard)));

        group.MapGet("/", async (
            int? month,
            int? year,
            bool? isPaid,
            int? categoryId,
            ITransactionsService service,
            CancellationToken ct) =>
        {
            var transactions = await service.GetTransactionsAsync(month, year, isPaid, categoryId, ct);
            return Results.Ok(transactions);
        });

        group.MapGet("/{id:int}", async (int id, ITransactionsService service, CancellationToken ct) =>
        {
            var transaction = await service.GetTransactionByIdAsync(id, ct);
            return Results.Ok(transaction);
        });

        group.MapPost("/", async (CreateTransactionRequest request, ITransactionsService service, CancellationToken ct) =>
        {
            var created = await service.CreateTransactionAsync(request, ct);
            return Results.Created($"/api/transactions/{created.Id}", created);
        });

        group.MapPut("/{id:int}", async (int id, UpdateTransactionRequest request, ITransactionsService service, CancellationToken ct) =>
        {
            var updated = await service.UpdateTransactionAsync(id, request, ct);
            return Results.Ok(updated);
        });

        group.MapPatch("/{id:int}/pay", async (int id, ITransactionsService service, CancellationToken ct) =>
        {
            var paid = await service.PayTransactionAsync(id, ct);
            return Results.Ok(paid);
        });

        group.MapDelete("/{id:int}", async (int id, ITransactionsService service, CancellationToken ct) =>
        {
            await service.DeleteTransactionAsync(id, ct);
            return Results.NoContent();
        });

        return app;
    }
}