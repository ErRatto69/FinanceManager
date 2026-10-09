namespace FinanceApp.Api.Features.Grocery.Dtos;

public record UpdateGroceryItemDetailsRequest(
    decimal Quantity,
    string Unit);