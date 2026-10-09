using System.Text;
using System.Text.Json.Serialization;
using FinanceApp.Api.Features.Auth;
using FinanceApp.Api.Features.Dashboard;
using FinanceApp.Api.Features.Grocery;
using FinanceApp.Api.Features.Stats;
using FinanceApp.Api.Features.Subscriptions;
using FinanceApp.Api.Features.Transactions;
using FinanceApp.Api.Features.Users;
using FinanceApp.Api.Infrastructure.Auth;
using FinanceApp.Api.Infrastructure.BackgroundJobs;
using FinanceApp.Api.Infrastructure.Database;
using FinanceApp.Api.Middlewares;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' was not found.");

builder.Services.AddDbContext<FinanceDbContext>(options =>
{
    options.UseNpgsql(connectionString);
});

// Options 
builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection(JwtOptions.SectionName));
var jwtOptions = new JwtOptions();
builder.Configuration.GetSection(JwtOptions.SectionName).Bind(jwtOptions);

if (string.IsNullOrWhiteSpace(jwtOptions.SecretKey))
{
    throw new InvalidOperationException("JWT SecretKey is missing or empty in configuration.");
}

// Exception Handling
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

// Core & Auth Services
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IPasswordHasher, BcryptPasswordHasher>();
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUsersService, UsersService>();

// Features services
builder.Services.AddScoped<ISubscriptionsService, SubscriptionsService>();
builder.Services.AddHostedService<SubscriptionBillingWorker>();
builder.Services.AddScoped<ITransactionsService, TransactionsService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IStatsService, StatsService>();
builder.Services.AddSignalR();
builder.Services.AddScoped<IGroceryService, GroceryService>();

// Authentication & JWT Bearer
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtOptions.Issuer,
            ValidAudience = jwtOptions.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.SecretKey)),
            ClockSkew = TimeSpan.Zero
        };
        
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseExceptionHandler();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<FinanceDbContext>();
    var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();

    var admin = await db.AppUsers.FirstOrDefaultAsync(u => u.Username == "Admin");
    if (admin is not null && !hasher.VerifyPassword("AdminPassword123!", admin.PasswordHash))
    {
        admin.PasswordHash = hasher.HashPassword("AdminPassword123!");
        await db.SaveChangesAsync();
    }
}

app.UseAuthentication();
app.UseAuthorization();

// Route Mappings
app.MapAuthEndpoints();
app.MapUsersEndpoints();
app.MapSubscriptionsEndpoints();
app.MapTransactionsEndpoints();
app.MapDashboardEndpoints();
app.MapStatsEndpoints();
app.MapGroceryEndpoints();

app.MapGet("/", () => "FinanceApp API is running");

app.Run();