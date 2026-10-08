using FinanceApp.Api.Domain.Entities;
using FinanceApp.Api.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinanceApp.Api.Infrastructure.Database.Configurations;

public class TransactionConfiguration : IEntityTypeConfiguration<Transaction>
{
    public void Configure(EntityTypeBuilder<Transaction> builder)
    {
        builder.ToTable("transactions");

        builder.HasKey(t => t.Id);
        builder.Property(t => t.Id).HasColumnName("id").UseIdentityAlwaysColumn();

        builder.Property(t => t.Title)
            .HasColumnName("title")
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(t => t.Amount)
            .HasColumnName("amount")
            .HasPrecision(12, 2)
            .IsRequired();

        builder.Property(t => t.Currency)
            .HasColumnName("currency")
            .HasConversion<string>()
            .HasMaxLength(3)
            .HasDefaultValue(CurrencyType.CHF)
            .IsRequired();

        builder.Property(t => t.ExchangeRate)
            .HasColumnName("exchange_rate")
            .HasPrecision(10, 4)
            .HasDefaultValue(1.0000m)
            .IsRequired();

        builder.Property(t => t.AmountChf)
            .HasColumnName("amount_chf")
            .HasPrecision(12, 2)
            .IsRequired();

        builder.Property(t => t.DueDate)
            .HasColumnName("due_date")
            .IsRequired();

        builder.Property(t => t.IsPaid)
            .HasColumnName("is_paid")
            .HasDefaultValue(false)
            .IsRequired();

        builder.Property(t => t.PaidDate)
            .HasColumnName("paid_date");

        builder.Property(t => t.BillingPeriod)
            .HasColumnName("billing_period")
            .HasMaxLength(7);

        builder.Property(t => t.SubscriptionId)
            .HasColumnName("subscription_id");

        builder.Property(t => t.CategoryId)
            .HasColumnName("category_id")
            .IsRequired();

        builder.Property(t => t.CreatedByUserId)
            .HasColumnName("created_by_user_id")
            .IsRequired();
        
        builder.HasOne(t => t.Subscription)
            .WithMany(s => s.Transactions)
            .HasForeignKey(t => t.SubscriptionId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(t => t.Category)
            .WithMany(c => c.Transactions)
            .HasForeignKey(t => t.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(t => t.CreatedByUser)
            .WithMany(u => u.Transactions)
            .HasForeignKey(t => t.CreatedByUserId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasIndex(t => new { t.IsPaid, t.PaidDate })
            .HasDatabaseName("idx_transactions_is_paid_paid_date");

        builder.HasIndex(t => t.DueDate)
            .HasDatabaseName("idx_transactions_due_date");

        builder.HasIndex(t => t.AmountChf)
            .HasDatabaseName("idx_transactions_amount_chf");

        builder.HasIndex(t => new { t.CategoryId, t.IsPaid, t.PaidDate })
            .HasDatabaseName("idx_transactions_category_paid");
        
        builder.HasIndex(t => new { t.SubscriptionId, t.BillingPeriod })
            .IsUnique()
            .HasFilter("subscription_id IS NOT NULL")
            .HasDatabaseName("uq_sub_billing_period");
    }
}