using AutoMapper;
using fintrack_backend.Data;
using fintrack_backend.DTOs;
using fintrack_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace fintrack_backend.Services;

public class TransactionService(AppDbContext db, IMapper mapper)
{
    public async Task<TransactionListDto> GetAllAsync(
        Guid userId, int page, int limit,
        string? type, Guid? categoryId,
        DateOnly? from, DateOnly? to, string? search)
    {
        var query = db.Transactions
            .Include(t => t.Category)
            .Where(t => t.UserId == userId)
            .AsQueryable();

        if (!string.IsNullOrEmpty(type))
            query = query.Where(t => t.Type == type);

        if (categoryId.HasValue)
            query = query.Where(t => t.CategoryId == categoryId);

        if (from.HasValue)
            query = query.Where(t => t.Date >= from.Value);

        if (to.HasValue)
            query = query.Where(t => t.Date <= to.Value);

        if (!string.IsNullOrEmpty(search))
            query = query.Where(t => t.Description != null &&
                                     t.Description.ToLower().Contains(search.ToLower()));

        var total = await query.CountAsync();

        var data = await query
            .OrderByDescending(t => t.Date)
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToListAsync();

        return new TransactionListDto
        {
            Data  = mapper.Map<IEnumerable<TransactionDto>>(data),
            Total = total,
            Page  = page,
            Limit = limit,
        };
    }

    public async Task<TransactionDto?> GetByIdAsync(Guid id, Guid userId)
    {
        var tx = await db.Transactions
            .Include(t => t.Category)
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        return tx is null ? null : mapper.Map<TransactionDto>(tx);
    }

    public async Task<TransactionDto> CreateAsync(CreateTransactionDto dto, Guid userId)
    {
        var tx = mapper.Map<Transaction>(dto);
        tx.UserId = userId;

        db.Transactions.Add(tx);
        await db.SaveChangesAsync();

        await db.Entry(tx).Reference(t => t.Category).LoadAsync();
        return mapper.Map<TransactionDto>(tx);
    }

    public async Task<TransactionDto?> UpdateAsync(Guid id, UpdateTransactionDto dto, Guid userId)
    {
        var tx = await db.Transactions
            .Include(t => t.Category)
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (tx is null) return null;

        mapper.Map(dto, tx);
        await db.SaveChangesAsync();

        await db.Entry(tx).Reference(t => t.Category).LoadAsync();
        return mapper.Map<TransactionDto>(tx);
    }

    public async Task<bool> DeleteAsync(Guid id, Guid userId)
    {
        var tx = await db.Transactions
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (tx is null) return false;

        db.Transactions.Remove(tx);
        await db.SaveChangesAsync();
        return true;
    }
}
