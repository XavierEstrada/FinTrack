using AutoMapper;
using fintrack_backend.Data;
using fintrack_backend.DTOs;
using fintrack_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace fintrack_backend.Services;

public class SavingsGoalService(AppDbContext db, IMapper mapper)
{
    public async Task<IEnumerable<SavingsGoalDto>> GetByMonthAsync(Guid userId, string month)
    {
        if (!DateOnly.TryParseExact(month + "-01", "yyyy-MM-dd",
                System.Globalization.CultureInfo.InvariantCulture,
                System.Globalization.DateTimeStyles.None, out var monthDate))
            throw new ArgumentException("Formato de mes inválido. Use yyyy-MM.");

        var monthEnd = monthDate.AddMonths(1);

        var goals = await db.SavingsGoals
            .Where(g => g.UserId == userId && g.Month == monthDate)
            .OrderBy(g => g.CreatedAt)
            .ToListAsync();

        if (goals.Count == 0) return [];

        // Dinero neto ahorrado en el mes: ingresos − gastos (mínimo 0)
        var income = await db.Transactions
            .Where(t => t.UserId == userId
                        && t.Type == "income"
                        && t.Date >= monthDate
                        && t.Date < monthEnd)
            .SumAsync(t => (decimal?)t.Amount) ?? 0m;

        var expenses = await db.Transactions
            .Where(t => t.UserId == userId
                        && t.Type == "expense"
                        && t.Date >= monthDate
                        && t.Date < monthEnd)
            .SumAsync(t => (decimal?)t.Amount) ?? 0m;

        var saved = Math.Max(0m, income - expenses);

        return goals.Select(g =>
        {
            var dto = mapper.Map<SavingsGoalDto>(g);
            dto.Saved = saved;
            return dto;
        });
    }

    public async Task<SavingsGoalDto> CreateAsync(CreateSavingsGoalDto input, Guid userId)
    {
        var goal = new SavingsGoal
        {
            Id           = Guid.NewGuid(),
            UserId       = userId,
            Name         = input.Name.Trim(),
            TargetAmount = input.TargetAmount,
            Month        = input.Month,
            CreatedAt    = DateTime.UtcNow,
        };

        db.SavingsGoals.Add(goal);
        await db.SaveChangesAsync();

        var dto = mapper.Map<SavingsGoalDto>(goal);
        dto.Saved = 0m;
        return dto;
    }

    public async Task<SavingsGoalDto?> UpdateAsync(Guid id, UpdateSavingsGoalDto input, Guid userId)
    {
        var goal = await db.SavingsGoals
            .FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId);

        if (goal is null) return null;

        goal.Name         = input.Name.Trim();
        goal.TargetAmount = input.TargetAmount;

        await db.SaveChangesAsync();

        var dto = mapper.Map<SavingsGoalDto>(goal);
        dto.Saved = 0m;   // el frontend refetch trae el valor real
        return dto;
    }

    public async Task<bool> DeleteAsync(Guid id, Guid userId)
    {
        var goal = await db.SavingsGoals
            .FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId);

        if (goal is null) return false;

        db.SavingsGoals.Remove(goal);
        await db.SaveChangesAsync();
        return true;
    }
}
