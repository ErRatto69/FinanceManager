using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace FinanceApp.Api.Features.Grocery.Hubs;

[Authorize]
public class GroceryHub : Hub<IGroceryClient>
{
}