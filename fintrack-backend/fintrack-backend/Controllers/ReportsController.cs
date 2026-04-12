using fintrack_backend.Extensions;
using fintrack_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace fintrack_backend.Controllers;

[ApiController]
[Route("api/reports")]
[Authorize]
public class ReportsController(ReportService service) : ControllerBase
{
    /// <summary>GET /api/reports/summary?from=2025-01-01&amp;to=2025-12-31</summary>
    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary(
        [FromQuery] DateTime from,
        [FromQuery] DateTime to)
    {
        var userId = User.GetUserId();
        var result = await service.GetSummaryAsync(userId, from, to);
        return Ok(result);
    }

    /// <summary>GET /api/reports/by-category?from=2025-01-01&amp;to=2025-12-31</summary>
    [HttpGet("by-category")]
    public async Task<IActionResult> GetByCategory(
        [FromQuery] DateTime from,
        [FromQuery] DateTime to)
    {
        var userId = User.GetUserId();
        var result = await service.GetByCategoryAsync(userId, from, to);
        return Ok(result);
    }

    /// <summary>GET /api/reports/monthly-trend?months=6</summary>
    [HttpGet("monthly-trend")]
    public async Task<IActionResult> GetMonthlyTrend([FromQuery] int months = 6)
    {
        if (months is < 1 or > 24)
            return BadRequest("El parámetro 'months' debe estar entre 1 y 24.");

        var userId = User.GetUserId();
        var result = await service.GetMonthlyTrendAsync(userId, months);
        return Ok(result);
    }
}
