namespace FinanceApp.Api.Domain.Entities;

public class GroceryProduct
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal DefaultPrice { get; set; } = 0.00m;

    // Navigation properties
    public ICollection<GroceryListItem> ListItems { get; set; } = new List<GroceryListItem>();
}