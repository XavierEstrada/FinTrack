using fintrack_backend.DTOs;
using fintrack_backend.Extensions;
using fintrack_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace fintrack_backend.Controllers;

[ApiController]
[Route("api/transactions")]
[Authorize]
public class TransactionsController(TransactionService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int limit = 10,
        [FromQuery] string? type = null,
        [FromQuery] Guid? categoryId = null,
        [FromQuery] DateOnly? from = null,
        [FromQuery] DateOnly? to = null,
        [FromQuery] string? search = null)
    {
        var userId = User.GetUserId();
        var result = await service.GetAllAsync(userId, page, limit, type, categoryId, from, to, search);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var userId = User.GetUserId();
        var tx = await service.GetByIdAsync(id, userId);
        return tx is null ? NotFound() : Ok(tx);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTransactionDto dto)
    {
        var userId  = User.GetUserId();
        var created = await service.CreateAsync(dto, userId);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTransactionDto dto)
    {
        var userId  = User.GetUserId();
        var updated = await service.UpdateAsync(id, dto, userId);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId  = User.GetUserId();
        var deleted = await service.DeleteAsync(id, userId);
        return deleted ? NoContent() : NotFound();
    }
}
