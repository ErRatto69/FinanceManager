using FinanceApp.Api.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
                       ?? throw new InvalidOperationException("Connection string 'DefaultConnection' non trovata.");

builder.Services.AddDbContext<FinanceDbContext>(options =>
{
    options.UseNpgsql(connectionString);
});

var app = builder.Build();

app.MapGet("/api/test-db", async (FinanceDbContext db) =>
{
    var canConnect = await db.Database.CanConnectAsync();
    if (!canConnect)
    {
        return Results.Problem("Impossibile stabilire la connessione con il database.");
    }

    var usersCount = await db.AppUsers.CountAsync();
    var categories = await db.Categories
        .Select(c => new { c.Id, c.Name, c.Color, c.IsSystem })
        .ToListAsync();

    return Results.Ok(new
    {
        status = "Connected",
        registeredUsers = usersCount,
        categoriesCount = categories.Count,
        categories
    });
});

app.MapGet("/", () => "FinanceApp API is running");

app.Run();