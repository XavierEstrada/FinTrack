using AutoMapper;
using fintrack_backend.Data;
using fintrack_backend.DTOs;
using fintrack_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace fintrack_backend.Services;

public class BudgetService(AppDbContext db, IMapper mapper)
{
    /// <summary>
    /// Devuelve los presupuestos del mes indicado junto con el gasto real de cada categoría.
    /// </summary>
    public async Task<IEnumerable<BudgetDto>> GetByMonthAsync(Guid userId, string month)
    {
        if (!DateTime.TryParseExact(month + "-01", "yyyy-MM-dd",
                System.Globalization.CultureInfo.InvariantCulture,
                System.Globalization.DateTimeStyles.None, out var monthDate))
            throw new ArgumentException("Formato de mes inválido. Use yyyy-MM.");

        var monthEnd = monthDate.AddMonths(1);

        var budgets = await db.Budgets
            .Include(b => b.Category)
            .Where(b => b.UserId == userId && b.Month == monthDate)
            .ToListAsync();

        if (budgets.Count == 0)
            return [];

        // Gasto real por categoría en el mes — una sola query
        var categoryIds = budgets.Select(b => b.CategoryId).ToList();

        var spendingMap = await db.Transactions
            .Where(t => t.UserId == userId
                        && t.CategoryId.HasValue
                        && categoryIds.Contains(t.CategoryId.Value)
                        && t.Type == "expense"
                        && t.Date >= monthDate
                        && t.Date < monthEnd)
            .GroupBy(t => t.CategoryId!.Value)
            .Select(g => new { CategoryId = g.Key, Total = g.Sum(t => t.Amount) })
            .ToDictionaryAsync(x => x.CategoryId, x => x.Total);

        return budgets.Select(b =>
        {
            var dto = mapper.Map<BudgetDto>(b);
            dto.Spent = spendingMap.GetValueOrDefault(b.CategoryId, 0m);
            return dto;
        });
    }

    /// <summary>
    /// Crea o actualiza el presupuesto de una categoría para un mes dado.
    /// </summary>
    public async Task<BudgetDto> UpsertAsync(UpsertBudgetDto input, Guid userId)
    {
        var existing = await db.Budgets
            .Include(b => b.Category)
            .FirstOrDefaultAsync(b => b.UserId == userId
                                      && b.CategoryId == input.CategoryId
                                      && b.Month == input.Month);

        if (existing is not null)
        {
            existing.Amount = input.Amount;
            await db.SaveChangesAsync();
            return mapper.Map<BudgetDto>(existing);
        }

        var budget = new Budget
        {
            Id        = Guid.NewGuid(),
            UserId     = userId,
            CategoryId = input.CategoryId,
            Amount     = input.Amount,
            Month      = input.Month,
            CreatedAt  = DateTime.UtcNow,
        };

        db.Budgets.Add(budget);
        await db.SaveChangesAsync();
        await db.Entry(budget).Reference(b => b.Category).LoadAsync();

        return mapper.Map<BudgetDto>(budget);
    }

    public async Task<bool> DeleteAsync(Guid id, Guid userId)
    {
        var budget = await db.Budgets
            .FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);

        if (budget is null) return false;

        db.Budgets.Remove(budget);
        await db.SaveChangesAsync();
        return true;
    }
}
