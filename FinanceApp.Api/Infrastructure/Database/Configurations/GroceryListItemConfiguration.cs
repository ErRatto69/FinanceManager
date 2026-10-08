using FinanceApp.Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinanceApp.Api.Infrastructure.Database.Configurations;

public class GroceryListItemConfiguration : IEntityTypeConfiguration<GroceryListItem>
{
    public void Configure(EntityTypeBuilder<GroceryListItem> builder)
    {
        builder.ToTable("grocery_list_items");

        builder.HasKey(g => g.Id);
        builder.Property(g => g.Id).HasColumnName("id").UseIdentityAlwaysColumn();

        builder.Property(g => g.ProductId)
            .HasColumnName("product_id")
            .IsRequired();

        builder.Property(g => g.Quantity)
            .HasColumnName("quantity")
            .HasPrecision(10, 2)
            .HasDefaultValue(1.00m)
            .IsRequired();

        builder.Property(g => g.Unit)
            .HasColumnName("unit")
            .HasMaxLength(10)
            .HasDefaultValue("pz")
            .IsRequired();

        builder.Property(g => g.IsChecked)
            .HasColumnName("is_checked")
            .HasDefaultValue(false)
            .IsRequired();

        builder.Property(g => g.AddedByUserId)
            .HasColumnName("added_by_user_id")
            .IsRequired();

        builder.HasOne(g => g.Product)
            .WithMany(p => p.ListItems)
            .HasForeignKey(g => g.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(g => g.AddedByUser)
            .WithMany(u => u.GroceryListItems)
            .HasForeignKey(g => g.AddedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(g => g.IsChecked)
            .HasDatabaseName("idx_grocery_list_checked");
    }
}