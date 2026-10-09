using FinanceApp.Api.Common.Exceptions;
using FinanceApp.Api.Domain.Entities;
using FinanceApp.Api.Domain.Enums;
using FinanceApp.Api.Features.Users.Dtos;
using FinanceApp.Api.Infrastructure.Auth;
using FinanceApp.Api.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace FinanceApp.Api.Features.Users;

public class UsersService : IUsersService
{
    private readonly FinanceDbContext _dbContext;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ICurrentUserService _currentUserService;

    public UsersService(
        FinanceDbContext dbContext,
        IPasswordHasher passwordHasher,
        ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _passwordHasher = passwordHasher;
        _currentUserService = currentUserService;
    }

    public async Task<IReadOnlyList<UserDto>> GetAllUsersAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.AppUsers
            .AsNoTracking()
            .OrderBy(u => u.Id)
            .Select(u => new UserDto(
                u.Id,
                u.Username,
                u.Role,
                u.IsActive,
                u.CreatedAt))
            .ToListAsync(cancellationToken);
    }

    public async Task<UserDto> CreateUserAsync(CreateUserRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Username))
        {
            throw new BadRequestException("Username is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Password) || request.Password.Length < 6)
        {
            throw new BadRequestException("Password must be at least 6 characters long.");
        }

        var usernameExists = await _dbContext.AppUsers
            .AnyAsync(u => u.Username == request.Username, cancellationToken);

        if (usernameExists)
        {
            throw new BadRequestException($"Username '{request.Username}' is already taken.");
        }

        var hashedPassword = _passwordHasher.HashPassword(request.Password);

        var newUser = new AppUser
        {
            Username = request.Username.Trim(),
            PasswordHash = hashedPassword,
            Role = request.Role,
            IsActive = true,
            CreatedAt = DateTimeOffset.UtcNow
        };

        _dbContext.AppUsers.Add(newUser);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new UserDto(
            newUser.Id,
            newUser.Username,
            newUser.Role,
            newUser.IsActive,
            newUser.CreatedAt);
    }

    public async Task<UserDto> UpdateUserRoleAsync(int id, UpdateUserRoleRequest request, CancellationToken cancellationToken = default)
    {
        var user = await _dbContext.AppUsers
            .FirstOrDefaultAsync(u => u.Id == id, cancellationToken);

        if (user is null)
        {
            throw new NotFoundException($"User with ID {id} not found.");
        }

        // Prevent demoting the last active Admin
        if (user.Role == UserRole.Admin && request.Role != UserRole.Admin)
        {
            var activeAdminsCount = await _dbContext.AppUsers
                .CountAsync(u => u.Role == UserRole.Admin && u.IsActive, cancellationToken);

            if (activeAdminsCount <= 1)
            {
                throw new BadRequestException("Cannot demote the last remaining active Admin.");
            }
        }

        user.Role = request.Role;
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new UserDto(
            user.Id,
            user.Username,
            user.Role,
            user.IsActive,
            user.CreatedAt);
    }

    public async Task DeactivateUserAsync(int id, CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUserService.UserId;
        if (currentUserId == id)
        {
            throw new BadRequestException("You cannot deactivate your own account.");
        }

        var user = await _dbContext.AppUsers
            .FirstOrDefaultAsync(u => u.Id == id, cancellationToken);

        if (user is null)
        {
            throw new NotFoundException($"User with ID {id} not found.");
        }

        // Prevent deactivating the last active Admin
        if (user.Role == UserRole.Admin && user.IsActive)
        {
            var activeAdminsCount = await _dbContext.AppUsers
                .CountAsync(u => u.Role == UserRole.Admin && u.IsActive, cancellationToken);

            if (activeAdminsCount <= 1)
            {
                throw new BadRequestException("Cannot deactivate the last remaining active Admin.");
            }
        }

        user.IsActive = false;
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}