using fintrack_backend.Data;
using fintrack_backend.DTOs;
using Microsoft.EntityFrameworkCore;

namespace fintrack_backend.Services;

public class ReportService(AppDbContext db)
{
    public async Task<SummaryDto> GetSummaryAsync(Guid userId, DateTime from, DateTime to)
    {
        var totals = await db.Transactions
            .Where(t => t.UserId == userId && t.Date >= from && t.Date <= to)
            .GroupBy(t => t.Type)
            .Select(g => new { Type = g.Key, Total = g.Sum(t => t.Amount) })
            .ToListAsync();

        var income  = totals.FirstOrDefault(t => t.Type == "income")?.Total  ?? 0m;
        var expense = totals.FirstOrDefault(t => t.Type == "expense")?.Total ?? 0m;

        return new SummaryDto
        {
            TotalIncome  = income,
            TotalExpense = expense,
            Balance      = income - expense,
            From         = from,
            To           = to,
        };
    }

    public async Task<IEnumerable<CategoryReportDto>> GetByCategoryAsync(
        Guid userId, DateTime from, DateTime to)
    {
        // Agrupar gastos por categoría
        var groups = await db.Transactions
            .Where(t => t.UserId == userId && t.Type == "expense"
                        && t.Date >= from && t.Date <= to)
            .GroupBy(t => t.CategoryId)
            .Select(g => new { CategoryId = g.Key, Total = g.Sum(t => t.Amount) })
            .ToListAsync();

        if (groups.Count == 0)
            return [];

        // Cargar nombres en una sola query
        var categoryIds = groups
            .Where(g => g.CategoryId.HasValue)
            .Select(g => g.CategoryId!.Value)
            .ToList();

        var categories = await db.Categories
            .Where(c => categoryIds.Contains(c.Id))
            .ToDictionaryAsync(c => c.Id);

        var totalExpense = groups.Sum(g => g.Total);

        return groups
            .OrderByDescending(g => g.Total)
            .Select(g =>
            {
                categories.TryGetValue(g.CategoryId ?? Guid.Empty, out var cat);
                return new CategoryReportDto
                {
                    CategoryId   = g.CategoryId,
                    CategoryName = cat?.Name ?? "Sin categoría",
                    CategoryColor = cat?.Color,
                    Total        = g.Total,
                    Percentage   = totalExpense > 0
                        ? Math.Round(g.Total / totalExpense * 100, 2)
                        : 0m,
                };
            });
    }

    public async Task<IEnumerable<MonthlyTrendDto>> GetMonthlyTrendAsync(
        Guid userId, int months = 6)
    {
        var from = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1)
                       .AddMonths(-(months - 1));

        var transactions = await db.Transactions
            .Where(t => t.UserId == userId && t.Date >= from)
            .Select(t => new { t.Date.Year, t.Date.Month, t.Type, t.Amount })
            .ToListAsync();

        return transactions
            .GroupBy(t => new { t.Year, t.Month })
            .OrderBy(g => g.Key.Year).ThenBy(g => g.Key.Month)
            .Select(g => new MonthlyTrendDto
            {
                Month   = $"{g.Key.Year}-{g.Key.Month:D2}",
                Income  = g.Where(t => t.Type == "income").Sum(t => t.Amount),
                Expense = g.Where(t => t.Type == "expense").Sum(t => t.Amount),
                Balance = g.Where(t => t.Type == "income").Sum(t => t.Amount)
                          - g.Where(t => t.Type == "expense").Sum(t => t.Amount),
            });
    }
}
