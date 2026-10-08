using FinanceApp.Api.Domain.Enums;

namespace FinanceApp.Api.Domain.Entities;

public class Transaction
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public CurrencyType Currency { get; set; } = CurrencyType.CHF;
    public decimal ExchangeRate { get; set; } = 1.0000m;
    public decimal AmountChf { get; set; }
    public DateOnly DueDate { get; set; }
    public bool IsPaid { get; set; } = false;
    public DateOnly? PaidDate { get; set; }
    public string? BillingPeriod { get; set; }
    
    public int? SubscriptionId { get; set; }
    public int CategoryId { get; set; }
    public int CreatedByUserId { get; set; }

    // Navigation properties
    public Subscription? Subscription { get; set; }
    public Category Category { get; set; } = null!;
    public AppUser CreatedByUser { get; set; } = null!;
}