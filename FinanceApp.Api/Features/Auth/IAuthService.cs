using FinanceApp.Api.Features.Auth.Dtos;

namespace FinanceApp.Api.Features.Auth;

public interface IAuthService
{
    Task<LoginResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
    Task<UserProfileDto> GetCurrentUserProfileAsync(CancellationToken cancellationToken = default);
}