namespace FinanceApp.Api.Features.Grocery.Dtos;

public record AddGroceryItemRequest(
    string ProductName,
    decimal Quantity = 1.00m,
    string Unit = "pz");