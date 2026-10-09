using FinanceApp.Api.Domain.Enums;

namespace FinanceApp.Api.Features.Users.Dtos;

public record CreateUserRequest(
    string Username,
    string Password,
    UserRole Role = UserRole.Basic);