using AutoMapper;
using fintrack_backend.Data;
using fintrack_backend.DTOs;
using fintrack_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace fintrack_backend.Services;

public class BudgetService(AppDbContext db, IMapper mapper)
{
    public async Task<IEnumerable<BudgetDto>> GetByMonthAsync(Guid userId, string month)
    {
        if (!DateOnly.TryParseExact(month + "-01", "yyyy-MM-dd",
                System.Globalization.CultureInfo.InvariantCulture,
                System.Globalization.DateTimeStyles.None, out var monthDate))
            throw new ArgumentException("Formato de mes inválido. Use yyyy-MM.");

        var monthEnd = monthDate.AddMonths(1);

        var budgets = await db.Budgets
            .Include(b => b.Category)
            .Where(b => b.UserId == userId &&
                        ((!b.IsAnnual && b.Month == monthDate) ||
                         (b.IsAnnual  && b.Month.Year == monthDate.Year)))
            .ToListAsync();

        if (budgets.Count == 0) return [];

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

    public async Task<BudgetDto> UpsertAsync(UpsertBudgetDto input, Guid userId)
    {
        // Annual budgets are unique per user + category + year.
        // Regular budgets are unique per user + category + month.
        var existing = input.IsAnnual
            ? await db.Budgets
                .Include(b => b.Category)
                .FirstOrDefaultAsync(b => b.UserId == userId
                                          && b.CategoryId == input.CategoryId
                                          && b.IsAnnual
                                          && b.Month.Year == input.Month.Year)
            : await db.Budgets
                .Include(b => b.Category)
                .FirstOrDefaultAsync(b => b.UserId == userId
                                          && b.CategoryId == input.CategoryId
                                          && !b.IsAnnual
                                          && b.Month == input.Month);

        if (existing is not null)
        {
            existing.Amount   = input.Amount;
            existing.IsAnnual = input.IsAnnual;
            await db.SaveChangesAsync();
            return mapper.Map<BudgetDto>(existing);
        }

        // Annual budgets are always stored anchored to January 1 of the given year.
        var storedMonth = input.IsAnnual
            ? new DateOnly(input.Month.Year, 1, 1)
            : input.Month;

        var budget = new Budget
        {
            Id         = Guid.NewGuid(),
            UserId     = userId,
            CategoryId = input.CategoryId,
            Amount     = input.Amount,
            Month      = storedMonth,
            IsAnnual   = input.IsAnnual,
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
