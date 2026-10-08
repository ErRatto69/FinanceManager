using FinanceApp.Api.Domain.Entities;

namespace FinanceApp.Api.Infrastructure.Auth;

public interface IJwtTokenService
{
    (string Token, DateTime Expiration) GenerateToken(AppUser user);
}