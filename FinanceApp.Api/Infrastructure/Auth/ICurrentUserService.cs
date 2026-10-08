using FinanceApp.Api.Domain.Enums;

namespace FinanceApp.Api.Infrastructure.Auth;

public interface ICurrentUserService
{
    int? UserId { get; }
    string? Username { get; }
    UserRole? Role { get; }
    bool IsAuthenticated { get; }
}