using FinanceApp.Api.Domain.Enums;

namespace FinanceApp.Api.Domain.Entities;

public class Subscription
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public CurrencyType Currency { get; set; } = CurrencyType.CHF;
    public int RenewalDay { get; set; }
    public int CategoryId { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public Category Category { get; set; } = null!;
    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}