using AutoMapper;
using fintrack_backend.Data;
using fintrack_backend.DTOs;
using Microsoft.EntityFrameworkCore;

namespace fintrack_backend.Services;

public class ProfileService(AppDbContext db, IMapper mapper)
{
    public async Task<ProfileDto?> GetAsync(Guid userId)
    {
        var profile = await db.Profiles.FindAsync(userId);
        return profile is null ? null : mapper.Map<ProfileDto>(profile);
    }

    public async Task<ProfileDto?> UpdateAsync(Guid userId, UpdateProfileDto dto)
    {
        var profile = await db.Profiles.FindAsync(userId);
        if (profile is null) return null;

        profile.FullName = dto.FullName;
        profile.Currency = dto.Currency;
        await db.SaveChangesAsync();

        return mapper.Map<ProfileDto>(profile);
    }
}
