using fintrack_backend.DTOs;
using fintrack_backend.Extensions;
using fintrack_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace fintrack_backend.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize]
public class AdminController(AdminService service) : ControllerBase
{
    // ── Estadísticas globales ────────────────────────────────────────────────

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        if (!await service.IsAdminAsync(User.GetUserId()))
            return Forbid();

        return Ok(await service.GetStatsAsync());
    }

    // ── Usuarios ─────────────────────────────────────────────────────────────

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        if (!await service.IsAdminAsync(User.GetUserId()))
            return Forbid();

        return Ok(await service.GetUsersAsync());
    }

    // ── Categorías del sistema ───────────────────────────────────────────────

    [HttpPost("categories")]
    public async Task<IActionResult> CreateSystemCategory([FromBody] CreateCategoryDto dto)
    {
        if (!await service.IsAdminAsync(User.GetUserId()))
            return Forbid();

        var created = await service.CreateSystemCategoryAsync(dto);
        return CreatedAtAction(nameof(GetStats), created);
    }

    [HttpPut("categories/{id:guid}")]
    public async Task<IActionResult> UpdateSystemCategory(Guid id, [FromBody] UpdateCategoryDto dto)
    {
        if (!await service.IsAdminAsync(User.GetUserId()))
            return Forbid();

        var updated = await service.UpdateSystemCategoryAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("categories/{id:guid}")]
    public async Task<IActionResult> DeleteSystemCategory(Guid id)
    {
        if (!await service.IsAdminAsync(User.GetUserId()))
            return Forbid();

        var deleted = await service.DeleteSystemCategoryAsync(id);
        if (!deleted)
            return Conflict("No se puede eliminar: la categoría tiene transacciones asociadas o no existe.");

        return NoContent();
    }
}
