using FinanceApp.Api.Features.Grocery.Dtos;

namespace FinanceApp.Api.Features.Grocery;

public interface IGroceryService
{
    Task<IReadOnlyList<GroceryItemDto>> GetActiveItemsAsync(CancellationToken cancellationToken = default);
    Task<GroceryItemDto> AddItemAsync(AddGroceryItemRequest request, CancellationToken cancellationToken = default);
    Task<GroceryItemDto> ToggleItemCheckedAsync(int id, CancellationToken cancellationToken = default);
    Task<GroceryItemDto> UpdateItemDetailsAsync(int id, UpdateGroceryItemDetailsRequest request, CancellationToken cancellationToken = default);
    Task RemoveItemAsync(int id, CancellationToken cancellationToken = default);
    Task<decimal> UpdateProductPriceAsync(int productId, UpdateProductPriceRequest request, CancellationToken cancellationToken = default);
    Task CheckoutAsync(CheckoutRequest request, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<GroceryProductDto>> GetCatalogProductsAsync(string? search = null, CancellationToken cancellationToken = default);
    Task DeleteCatalogProductAsync(int productId, CancellationToken cancellationToken = default);
}