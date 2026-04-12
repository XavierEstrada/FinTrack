using AutoMapper;
using fintrack_backend.Data;
using fintrack_backend.DTOs;
using fintrack_backend.Extensions;
using fintrack_backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace fintrack_backend.Controllers;

[ApiController]
[Route("api/categories")]
[Authorize]
public class CategoriesController(AppDbContext db, IMapper mapper) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = User.GetUserId();

        var categories = await db.Categories
            .Where(c => c.IsSystem || c.UserId == userId)
            .OrderBy(c => c.Type)
            .ThenBy(c => c.Name)
            .ToListAsync();

        return Ok(mapper.Map<IEnumerable<CategoryDto>>(categories));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto)
    {
        var userId   = User.GetUserId();
        var category = mapper.Map<Category>(dto);
        category.UserId    = userId;
        category.IsSystem  = false;
        category.CreatedAt = DateTime.UtcNow;

        db.Categories.Add(category);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll), mapper.Map<CategoryDto>(category));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCategoryDto dto)
    {
        var userId   = User.GetUserId();
        var category = await db.Categories
            .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId && !c.IsSystem);

        if (category is null) return NotFound();

        category.Name  = dto.Name;
        category.Icon  = dto.Icon;
        category.Color = dto.Color;
        await db.SaveChangesAsync();

        return Ok(mapper.Map<CategoryDto>(category));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId   = User.GetUserId();
        var category = await db.Categories
            .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId && !c.IsSystem);

        if (category is null) return NotFound();

        var hasTransactions = await db.Transactions.AnyAsync(t => t.CategoryId == id);
        if (hasTransactions)
            return Conflict("No se puede eliminar: la categoría tiene transacciones asociadas.");

        db.Categories.Remove(category);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
