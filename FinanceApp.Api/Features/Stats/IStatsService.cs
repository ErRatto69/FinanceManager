using FinanceApp.Api.Features.Stats.Dtos;

namespace FinanceApp.Api.Features.Stats;

public interface IStatsService
{
    Task<MonthlyStatsDto> GetMonthlyStatsAsync(int? month = null, int? year = null, CancellationToken cancellationToken = default);
}