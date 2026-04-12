using AutoMapper;
using fintrack_backend.Data;
using fintrack_backend.DTOs;
using fintrack_backend.Extensions;
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

        // Devuelve las categorías del sistema + las propias del usuario
        var categories = await db.Categories
            .Where(c => c.IsSystem || c.UserId == userId)
            .OrderBy(c => c.Type)
            .ThenBy(c => c.Name)
            .ToListAsync();

        return Ok(mapper.Map<IEnumerable<CategoryDto>>(categories));
    }
}
