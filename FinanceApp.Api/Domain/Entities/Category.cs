namespace FinanceApp.Api.Domain.Entities;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Icon { get; set; } = "Tag";
    public string Color { get; set; } = "#0d6efd";
    public bool IsSystem { get; set; } = false;

    // Navigation properties
    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    public ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
}