using FinanceApp.Api.Common.Exceptions;
using FinanceApp.Api.Domain.Entities;
using FinanceApp.Api.Domain.Enums;
using FinanceApp.Api.Features.Grocery.Dtos;
using FinanceApp.Api.Features.Grocery.Hubs;
using FinanceApp.Api.Infrastructure.Auth;
using FinanceApp.Api.Infrastructure.Database;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace FinanceApp.Api.Features.Grocery;

public class GroceryService : IGroceryService
{
    private readonly FinanceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;
    private readonly IHubContext<GroceryHub, IGroceryClient> _hubContext;

    public GroceryService(
        FinanceDbContext dbContext,
        ICurrentUserService currentUserService,
        IHubContext<GroceryHub, IGroceryClient> hubContext)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
        _hubContext = hubContext;
    }

    public async Task<IReadOnlyList<GroceryItemDto>> GetActiveItemsAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.GroceryListItems
            .AsNoTracking()
            .Include(g => g.Product)
            .Include(g => g.AddedByUser)
            .OrderBy(g => g.IsChecked)
            .ThenByDescending(g => g.Id)
            .Select(g => MapToDto(g))
            .ToListAsync(cancellationToken);
    }

    public async Task<GroceryItemDto> AddItemAsync(AddGroceryItemRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.ProductName))
        {
            throw new BadRequestException("Product name cannot be empty.");
        }

        if (request.Quantity <= 0)
        {
            throw new BadRequestException("Quantity must be greater than zero.");
        }

        var currentUserId = _currentUserService.UserId;
        if (!currentUserId.HasValue)
        {
            throw new UnauthorizedException("Authenticated user could not be identified.");
        }

        var trimmedName = request.ProductName.Trim();

        // 1. Find or create product in catalog
        var product = await _dbContext.GroceryProducts
            .FirstOrDefaultAsync(p => p.Name == trimmedName, cancellationToken);

        if (product is null)
        {
            product = new GroceryProduct
            {
                Name = trimmedName,
                DefaultPrice = 0.00m
            };
            _dbContext.GroceryProducts.Add(product);
            await _dbContext.SaveChangesAsync(cancellationToken);
        }

        // 2. Check if product already exists unchecked in the active list
        var existingItem = await _dbContext.GroceryListItems
            .Include(g => g.Product)
            .Include(g => g.AddedByUser)
            .FirstOrDefaultAsync(g => g.ProductId == product.Id && !g.IsChecked, cancellationToken);

        GroceryItemDto resultDto;

        if (existingItem is not null)
        {
            existingItem.Quantity += request.Quantity;
            existingItem.Unit = string.IsNullOrWhiteSpace(request.Unit) ? existingItem.Unit : request.Unit.Trim();
            await _dbContext.SaveChangesAsync(cancellationToken);

            resultDto = MapToDto(existingItem);
            await _hubContext.Clients.All.ItemUpdated(resultDto);
        }
        else
        {
            var newItem = new GroceryListItem
            {
                ProductId = product.Id,
                Quantity = request.Quantity,
                Unit = string.IsNullOrWhiteSpace(request.Unit) ? "pz" : request.Unit.Trim(),
                IsChecked = false,
                AddedByUserId = currentUserId.Value
            };

            _dbContext.GroceryListItems.Add(newItem);
            await _dbContext.SaveChangesAsync(cancellationToken);

            var user = await _dbContext.AppUsers.FindAsync([currentUserId.Value], cancellationToken);
            newItem.Product = product;
            newItem.AddedByUser = user!;

            resultDto = MapToDto(newItem);
            await _hubContext.Clients.All.ItemAdded(resultDto);
        }

        return resultDto;
    }

    public async Task<GroceryItemDto> ToggleItemCheckedAsync(int id, CancellationToken cancellationToken = default)
    {
        var item = await _dbContext.GroceryListItems
            .Include(g => g.Product)
            .Include(g => g.AddedByUser)
            .FirstOrDefaultAsync(g => g.Id == id, cancellationToken);

        if (item is null)
        {
            throw new NotFoundException($"Grocery item with ID {id} not found.");
        }

        item.IsChecked = !item.IsChecked;
        await _dbContext.SaveChangesAsync(cancellationToken);

        await _hubContext.Clients.All.ItemToggled(item.Id, item.IsChecked);

        return MapToDto(item);
    }

    public async Task<GroceryItemDto> UpdateItemDetailsAsync(int id, UpdateGroceryItemDetailsRequest request, CancellationToken cancellationToken = default)
    {
        if (request.Quantity <= 0)
        {
            throw new BadRequestException("Quantity must be greater than zero.");
        }

        var item = await _dbContext.GroceryListItems
            .Include(g => g.Product)
            .Include(g => g.AddedByUser)
            .FirstOrDefaultAsync(g => g.Id == id, cancellationToken);

        if (item is null)
        {
            throw new NotFoundException($"Grocery item with ID {id} not found.");
        }

        item.Quantity = request.Quantity;
        item.Unit = string.IsNullOrWhiteSpace(request.Unit) ? "pz" : request.Unit.Trim();

        await _dbContext.SaveChangesAsync(cancellationToken);

        var resultDto = MapToDto(item);
        await _hubContext.Clients.All.ItemUpdated(resultDto);

        return resultDto;
    }

    public async Task RemoveItemAsync(int id, CancellationToken cancellationToken = default)
    {
        var item = await _dbContext.GroceryListItems
            .FirstOrDefaultAsync(g => g.Id == id, cancellationToken);

        if (item is null)
        {
            throw new NotFoundException($"Grocery item with ID {id} not found.");
        }

        _dbContext.GroceryListItems.Remove(item);
        await _dbContext.SaveChangesAsync(cancellationToken);

        await _hubContext.Clients.All.ItemDeleted(id);
    }

    public async Task<decimal> UpdateProductPriceAsync(int productId, UpdateProductPriceRequest request, CancellationToken cancellationToken = default)
    {
        if (request.Price < 0)
        {
            throw new BadRequestException("Product price cannot be negative.");
        }

        var product = await _dbContext.GroceryProducts
            .FirstOrDefaultAsync(p => p.Id == productId, cancellationToken);

        if (product is null)
        {
            throw new NotFoundException($"Product with ID {productId} not found.");
        }

        product.DefaultPrice = request.Price;
        await _dbContext.SaveChangesAsync(cancellationToken);

        await _hubContext.Clients.All.ProductPriceUpdated(productId, request.Price);

        return product.DefaultPrice;
    }

    public async Task CheckoutAsync(CheckoutRequest request, CancellationToken cancellationToken = default)
    {
        if (request.ActualTotal < 0)
        {
            throw new BadRequestException("Checkout total cannot be negative.");
        }

        var currentUserId = _currentUserService.UserId;
        if (!currentUserId.HasValue)
        {
            throw new UnauthorizedException("Authenticated user could not be identified.");
        }

        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        // Retrieve system category for groceries
        var groceryCategory = await _dbContext.Categories
            .FirstOrDefaultAsync(c => c.IsSystem || c.Name == "Spesa & Cibo", cancellationToken)
            ?? await _dbContext.Categories.OrderBy(c => c.Id).FirstAsync(cancellationToken);

        // Execute checkout and list clearing atomically
        await using var dbTransaction = await _dbContext.Database.BeginTransactionAsync(cancellationToken);

        var transaction = new Transaction
        {
            Title = "Spesa Supermercato",
            Amount = request.ActualTotal,
            Currency = CurrencyType.CHF,
            ExchangeRate = 1.0000m,
            AmountChf = request.ActualTotal,
            DueDate = today,
            IsPaid = true,
            PaidDate = today,
            CategoryId = groceryCategory.Id,
            CreatedByUserId = currentUserId.Value
        };

        _dbContext.Transactions.Add(transaction);

        var activeItems = await _dbContext.GroceryListItems.ToListAsync(cancellationToken);
        _dbContext.GroceryListItems.RemoveRange(activeItems);

        await _dbContext.SaveChangesAsync(cancellationToken);
        await dbTransaction.CommitAsync(cancellationToken);

        await _hubContext.Clients.All.ListCleared();
    }

    public async Task<IReadOnlyList<GroceryProductDto>> GetCatalogProductsAsync(string? search = null, CancellationToken cancellationToken = default)
    {
        var query = _dbContext.GroceryProducts
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var trimmedSearch = search.Trim();
            query = query.Where(p => EF.Functions.ILike(p.Name, $"%{trimmedSearch}%"));
        }

        return await query
            .OrderBy(p => p.Name)
            .Select(p => new GroceryProductDto(p.Id, p.Name, p.DefaultPrice))
            .ToListAsync(cancellationToken);
    }

    public async Task DeleteCatalogProductAsync(int productId, CancellationToken cancellationToken = default)
    {
        var product = await _dbContext.GroceryProducts
            .FirstOrDefaultAsync(p => p.Id == productId, cancellationToken);

        if (product is null)
        {
            throw new NotFoundException($"Product with ID {productId} not found.");
        }

        _dbContext.GroceryProducts.Remove(product);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    private static GroceryItemDto MapToDto(GroceryListItem g) => new(
        g.Id,
        g.ProductId,
        g.Product.Name,
        g.Quantity,
        g.Unit,
        g.Product.DefaultPrice,
        g.IsChecked,
        g.AddedByUser.Id,
        g.AddedByUser.Username);
}