using FinanceApp.Api.Domain.Enums;

namespace FinanceApp.Api.Features.Users.Dtos;

public record UserDto(
    int Id,
    string Username,
    UserRole Role,
    bool IsActive,
    DateTimeOffset CreatedAt);