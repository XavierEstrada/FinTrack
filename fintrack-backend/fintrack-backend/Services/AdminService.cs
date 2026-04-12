using AutoMapper;
using fintrack_backend.Data;
using fintrack_backend.DTOs;
using fintrack_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace fintrack_backend.Services;

public class AdminService(AppDbContext db, IMapper mapper)
{
    public async Task<bool> IsAdminAsync(Guid userId)
    {
        var profile = await db.Profiles.FindAsync(userId);
        return profile?.Role == "admin";
    }

    public async Task<AdminStatsDto> GetStatsAsync()
    {
        var totalUsers        = await db.Profiles.CountAsync();
        var totalTransactions = await db.Transactions.CountAsync();
        var totalVolume       = await db.Transactions.SumAsync(t => (decimal?)t.Amount) ?? 0m;

        return new AdminStatsDto
        {
            TotalUsers        = totalUsers,
            TotalTransactions = totalTransactions,
            TotalVolume       = totalVolume,
        };
    }

    public async Task<IEnumerable<AdminUserDto>> GetUsersAsync()
    {
        var profiles = await db.Profiles.ToListAsync();

        var countMap = await db.Transactions
            .GroupBy(t => t.UserId)
            .Select(g => new { UserId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(g => g.UserId, g => g.Count);

        return profiles.Select(p => new AdminUserDto
        {
            Id               = p.Id,
            FullName         = p.FullName,
            Currency         = p.Currency,
            Role             = p.Role,
            TransactionCount = countMap.GetValueOrDefault(p.Id, 0),
            CreatedAt        = p.CreatedAt,
        });
    }

    // ── Categorías del sistema ───────────────────────────────────────────────

    public async Task<CategoryDto> CreateSystemCategoryAsync(CreateCategoryDto dto)
    {
        var category = mapper.Map<Category>(dto);
        category.Id       = Guid.NewGuid();
        category.IsSystem = true;
        category.UserId   = null;
        category.CreatedAt = DateTime.UtcNow;

        db.Categories.Add(category);
        await db.SaveChangesAsync();
        return mapper.Map<CategoryDto>(category);
    }

    public async Task<CategoryDto?> UpdateSystemCategoryAsync(Guid id, UpdateCategoryDto dto)
    {
        var category = await db.Categories
            .FirstOrDefaultAsync(c => c.Id == id && c.IsSystem);

        if (category is null) return null;

        category.Name  = dto.Name;
        category.Icon  = dto.Icon;
        category.Color = dto.Color;
        await db.SaveChangesAsync();

        return mapper.Map<CategoryDto>(category);
    }

    public async Task<bool> DeleteSystemCategoryAsync(Guid id)
    {
        var category = await db.Categories
            .FirstOrDefaultAsync(c => c.Id == id && c.IsSystem);

        if (category is null) return false;

        var hasTransactions = await db.Transactions
            .AnyAsync(t => t.CategoryId == id);

        if (hasTransactions) return false;

        db.Categories.Remove(category);
        await db.SaveChangesAsync();
        return true;
    }
}
