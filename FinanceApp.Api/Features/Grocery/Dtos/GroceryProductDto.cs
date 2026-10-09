namespace FinanceApp.Api.Features.Grocery.Dtos;

public record GroceryProductDto(
    int Id,
    string Name,
    decimal DefaultPrice);