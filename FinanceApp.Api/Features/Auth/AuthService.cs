using FinanceApp.Api.Common.Exceptions;
using FinanceApp.Api.Features.Auth.Dtos;
using FinanceApp.Api.Infrastructure.Auth;
using FinanceApp.Api.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace FinanceApp.Api.Features.Auth;

public class AuthService : IAuthService
{
    private readonly FinanceDbContext _dbContext;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly ICurrentUserService _currentUserService;

    public AuthService(
        FinanceDbContext dbContext,
        IPasswordHasher passwordHasher,
        IJwtTokenService jwtTokenService,
        ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _passwordHasher = passwordHasher;
        _jwtTokenService = jwtTokenService;
        _currentUserService = currentUserService;
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
        {
            throw new BadRequestException("Username and password are required.");
        }

        var user = await _dbContext.AppUsers
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Username == request.Username, cancellationToken);

        if (user is null || !user.IsActive)
        {
            throw new UnauthorizedException("Invalid username or password.");
        }

        var isPasswordValid = _passwordHasher.VerifyPassword(request.Password, user.PasswordHash);
        if (!isPasswordValid)
        {
            throw new UnauthorizedException("Invalid username or password.");
        }

        var (token, expiration) = _jwtTokenService.GenerateToken(user);
        var userDto = new UserProfileDto(user.Id, user.Username, user.Role);

        return new LoginResponse(token, expiration, userDto);
    }

    public async Task<UserProfileDto> GetCurrentUserProfileAsync(CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUserService.UserId;
        if (!currentUserId.HasValue)
        {
            throw new UnauthorizedException("User is not authenticated.");
        }

        var user = await _dbContext.AppUsers
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == currentUserId.Value, cancellationToken);

        if (user is null || !user.IsActive)
        {
            throw new UnauthorizedException("User account not found or deactivated.");
        }

        return new UserProfileDto(user.Id, user.Username, user.Role);
    }
}