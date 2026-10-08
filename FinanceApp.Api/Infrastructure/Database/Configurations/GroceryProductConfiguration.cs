using FinanceApp.Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinanceApp.Api.Infrastructure.Database.Configurations;

public class GroceryProductConfiguration : IEntityTypeConfiguration<GroceryProduct>
{
    public void Configure(EntityTypeBuilder<GroceryProduct> builder)
    {
        builder.ToTable("grocery_products");

        builder.HasKey(p => p.Id);
        builder.Property(p => p.Id).HasColumnName("id").UseIdentityAlwaysColumn();

        builder.Property(p => p.Name)
            .HasColumnName("name")
            .HasColumnType("citext")
            .HasMaxLength(100)
            .IsRequired();

        builder.HasIndex(p => p.Name).IsUnique();

        builder.Property(p => p.DefaultPrice)
            .HasColumnName("default_price")
            .HasPrecision(10, 2)
            .HasDefaultValue(0.00m)
            .IsRequired();
    }
}