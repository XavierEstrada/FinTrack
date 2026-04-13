using fintrack_backend.DTOs;
using fintrack_backend.Extensions;
using fintrack_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace fintrack_backend.Controllers;

[ApiController]
[Route("api/savings-goals")]
[Authorize]
public class SavingsGoalsController(SavingsGoalService service) : ControllerBase
{
    /// <summary>GET /api/savings-goals?month=2025-05</summary>
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

    /// <summary>POST /api/savings-goals</summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSavingsGoalDto dto)
    {
        var userId = User.GetUserId();
        var result = await service.CreateAsync(dto, userId);
        return CreatedAtAction(nameof(GetByMonth), new { month = result.Month.ToString("yyyy-MM") }, result);
    }

    /// <summary>PUT /api/savings-goals/{id}</summary>
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateSavingsGoalDto dto)
    {
        var userId = User.GetUserId();
        var result = await service.UpdateAsync(id, dto, userId);
        return result is null ? NotFound() : Ok(result);
    }

    /// <summary>DELETE /api/savings-goals/{id}</summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId  = User.GetUserId();
        var deleted = await service.DeleteAsync(id, userId);
        return deleted ? NoContent() : NotFound();
    }
}
