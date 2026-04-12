using fintrack_backend.DTOs;
using fintrack_backend.Extensions;
using fintrack_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace fintrack_backend.Controllers;

[ApiController]
[Route("api/profile")]
[Authorize]
public class ProfileController(ProfileService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var userId  = User.GetUserId();
        var profile = await service.GetAsync(userId);
        return profile is null ? NotFound() : Ok(profile);
    }

    [HttpPut]
    public async Task<IActionResult> Update([FromBody] UpdateProfileDto dto)
    {
        var userId  = User.GetUserId();
        var updated = await service.UpdateAsync(userId, dto);
        return updated is null ? NotFound() : Ok(updated);
    }
}
