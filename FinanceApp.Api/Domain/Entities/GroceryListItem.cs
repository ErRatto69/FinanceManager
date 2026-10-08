namespace FinanceApp.Api.Domain.Entities;

public class GroceryListItem
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public decimal Quantity { get; set; } = 1.00m;
    public string Unit { get; set; } = "pz";
    public bool IsChecked { get; set; } = false;
    public int AddedByUserId { get; set; }

    // Navigation properties
    public GroceryProduct Product { get; set; } = null!;
    public AppUser AddedByUser { get; set; } = null!;
}