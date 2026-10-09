using FinanceApp.Api.Features.Users.Dtos;

namespace FinanceApp.Api.Features.Users;

public interface IUsersService
{
    Task<IReadOnlyList<UserDto>> GetAllUsersAsync(CancellationToken cancellationToken = default);
    Task<UserDto> CreateUserAsync(CreateUserRequest request, CancellationToken cancellationToken = default);
    Task<UserDto> UpdateUserRoleAsync(int id, UpdateUserRoleRequest request, CancellationToken cancellationToken = default);
    Task DeactivateUserAsync(int id, CancellationToken cancellationToken = default);
}