using fintrack_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace fintrack_backend.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Profile> Profiles => Set<Profile>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Transaction> Transactions => Set<Transaction>();
    public DbSet<Budget> Budgets => Set<Budget>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Mapear nombres de tablas en snake_case (Supabase usa snake_case)
        modelBuilder.Entity<Profile>(e =>
        {
            e.ToTable("profiles");
            e.HasKey(p => p.Id);
            e.Property(p => p.Id).HasColumnName("id");
            e.Property(p => p.FullName).HasColumnName("full_name");
            e.Property(p => p.AvatarUrl).HasColumnName("avatar_url");
            e.Property(p => p.Currency).HasColumnName("currency");
            e.Property(p => p.Role).HasColumnName("role");
            e.Property(p => p.CreatedAt).HasColumnName("created_at");
        });

        modelBuilder.Entity<Category>(e =>
        {
            e.ToTable("categories");
            e.HasKey(c => c.Id);
            e.Property(c => c.Id).HasColumnName("id");
            e.Property(c => c.UserId).HasColumnName("user_id");
            e.Property(c => c.Name).HasColumnName("name");
            e.Property(c => c.Icon).HasColumnName("icon");
            e.Property(c => c.Color).HasColumnName("color");
            e.Property(c => c.Type).HasColumnName("type");
            e.Property(c => c.IsSystem).HasColumnName("is_system");
            e.Property(c => c.CreatedAt).HasColumnName("created_at");
        });

        modelBuilder.Entity<Transaction>(e =>
        {
            e.ToTable("transactions");
            e.HasKey(t => t.Id);
            e.Property(t => t.Id).HasColumnName("id");
            e.Property(t => t.UserId).HasColumnName("user_id");
            e.Property(t => t.CategoryId).HasColumnName("category_id");
            e.Property(t => t.Amount).HasColumnName("amount");
            e.Property(t => t.Type).HasColumnName("type");
            e.Property(t => t.Description).HasColumnName("description");
            e.Property(t => t.Date).HasColumnName("date");
            e.Property(t => t.ReceiptUrl).HasColumnName("receipt_url");
            e.Property(t => t.CreatedAt).HasColumnName("created_at");
            e.Property(t => t.UpdatedAt).HasColumnName("updated_at");
            e.HasOne(t => t.Category).WithMany().HasForeignKey(t => t.CategoryId);
        });

        modelBuilder.Entity<Budget>(e =>
        {
            e.ToTable("budgets");
            e.HasKey(b => b.Id);
            e.Property(b => b.Id).HasColumnName("id");
            e.Property(b => b.UserId).HasColumnName("user_id");
            e.Property(b => b.CategoryId).HasColumnName("category_id");
            e.Property(b => b.Amount).HasColumnName("amount");
            e.Property(b => b.Month).HasColumnName("month");
            e.Property(b => b.CreatedAt).HasColumnName("created_at");
            e.HasOne(b => b.Category).WithMany().HasForeignKey(b => b.CategoryId);
        });
    }
}
