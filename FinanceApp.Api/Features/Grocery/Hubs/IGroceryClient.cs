using FinanceApp.Api.Features.Grocery.Dtos;

namespace FinanceApp.Api.Features.Grocery.Hubs;

public interface IGroceryClient
{
    Task ItemAdded(GroceryItemDto item);
    Task ItemUpdated(GroceryItemDto item);
    Task ItemToggled(int id, bool isChecked);
    Task ItemDeleted(int id);
    Task ListCleared();
    Task ProductPriceUpdated(int productId, decimal newPrice);
}