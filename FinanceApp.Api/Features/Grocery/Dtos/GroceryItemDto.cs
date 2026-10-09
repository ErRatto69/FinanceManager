namespace FinanceApp.Api.Features.Grocery.Dtos;

public record GroceryItemDto(
    int Id,
    int ProductId,
    string ProductName,
    decimal Quantity,
    string Unit,
    decimal UnitPrice,
    bool IsChecked,
    int AddedByUserId,
    string AddedByUsername);