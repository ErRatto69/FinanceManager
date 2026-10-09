using FinanceApp.Api.Features.Dashboard.Dtos;

namespace FinanceApp.Api.Features.Dashboard;

public interface IDashboardService
{
    Task<DashboardSummaryDto> GetSummaryAsync(CancellationToken cancellationToken = default);
}