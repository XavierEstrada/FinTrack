using fintrack_backend.DTOs;
using fintrack_backend.Extensions;
using fintrack_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace fintrack_backend.Controllers;

[ApiController]
[Route("api/budgets")]
[Authorize]
public class BudgetsController(BudgetService service) : ControllerBase
{
    /// <summary>GET /api/budgets?month=2025-01</summary>
    [HttpGet]
    public async Task<IActionResult> GetByMonth([FromQuery] string month)
    {
        if (string.IsNullOrWhiteSpace(month))
            return BadRequest("El parámetro 'month' es requerido (formato: yyyy-MM).");

        try
        {
            var userId = User.GetUserId();
            var result = await service.GetByMonthAsync(userId, month);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>POST /api/budgets — crea o actualiza (upsert por user+category+month)</summary>
    [HttpPost]
    public async Task<IActionResult> Upsert([FromBody] UpsertBudgetDto dto)
    {
        var userId = User.GetUserId();
        var result = await service.UpsertAsync(dto, userId);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId  = User.GetUserId();
        var deleted = await service.DeleteAsync(id, userId);
        return deleted ? NoContent() : NotFound();
    }
}
