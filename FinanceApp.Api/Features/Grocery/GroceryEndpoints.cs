using FinanceApp.Api.Features.Grocery.Dtos;

namespace FinanceApp.Api.Features.Grocery;

public static class GroceryEndpoints
{
    public static IEndpointRouteBuilder MapGroceryEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/grocery")
            .WithTags("Grocery")
            .RequireAuthorization();

        group.MapGet("/", async (IGroceryService service, CancellationToken ct) =>
        {
            var items = await service.GetActiveItemsAsync(ct);
            return Results.Ok(items);
        });

        group.MapPost("/", async (AddGroceryItemRequest request, IGroceryService service, CancellationToken ct) =>
        {
            var item = await service.AddItemAsync(request, ct);
            return Results.Ok(item);
        });

        group.MapPatch("/{id:int}/toggle", async (int id, IGroceryService service, CancellationToken ct) =>
        {
            var item = await service.ToggleItemCheckedAsync(id, ct);
            return Results.Ok(item);
        });

        group.MapPatch("/{id:int}/details", async (int id, UpdateGroceryItemDetailsRequest request, IGroceryService service, CancellationToken ct) =>
        {
            var item = await service.UpdateItemDetailsAsync(id, request, ct);
            return Results.Ok(item);
        });

        group.MapDelete("/{id:int}", async (int id, IGroceryService service, CancellationToken ct) =>
        {
            await service.RemoveItemAsync(id, ct);
            return Results.NoContent();
        });

        group.MapPatch("/products/{productId:int}/price", async (int productId, UpdateProductPriceRequest request, IGroceryService service, CancellationToken ct) =>
        {
            var updatedPrice = await service.UpdateProductPriceAsync(productId, request, ct);
            return Results.Ok(new { ProductId = productId, DefaultPrice = updatedPrice });
        });

        group.MapPost("/checkout", async (CheckoutRequest request, IGroceryService service, CancellationToken ct) =>
        {
            await service.CheckoutAsync(request, ct);
            return Results.Ok(new { Message = "Checkout completed and grocery list cleared." });
        });

        group.MapGet("/products", async (string? search, IGroceryService service, CancellationToken ct) =>
        {
            var products = await service.GetCatalogProductsAsync(search, ct);
            return Results.Ok(products);
        });

        group.MapDelete("/products/{id:int}", async (int id, IGroceryService service, CancellationToken ct) =>
        {
            await service.DeleteCatalogProductAsync(id, ct);
            return Results.NoContent();
        });

        return app;
    }
}