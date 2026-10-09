namespace FinanceApp.Api.Features.Auth.Dtos;

public record LoginResponse(string Token, DateTime Expiration, UserProfileDto User);