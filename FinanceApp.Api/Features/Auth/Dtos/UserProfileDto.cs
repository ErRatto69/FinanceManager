using FinanceApp.Api.Domain.Enums;

namespace FinanceApp.Api.Features.Auth.Dtos;

public record UserProfileDto(int Id, string Username, UserRole Role);