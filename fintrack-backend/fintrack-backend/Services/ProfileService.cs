using AutoMapper;
using fintrack_backend.Data;
using fintrack_backend.DTOs;
using Microsoft.EntityFrameworkCore;

namespace fintrack_backend.Services;

public class ProfileService(AppDbContext db, IMapper mapper, IHttpClientFactory httpClientFactory, IConfiguration config)
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

    public async Task DeleteAccountAsync(Guid userId)
    {
        // 1. Eliminar todos los datos del usuario
        await db.Transactions.Where(t => t.UserId == userId).ExecuteDeleteAsync();
        await db.Budgets.Where(b => b.UserId == userId).ExecuteDeleteAsync();
        await db.Categories.Where(c => c.UserId == userId && !c.IsSystem).ExecuteDeleteAsync();

        var profile = await db.Profiles.FindAsync(userId);
        if (profile is not null)
        {
            db.Profiles.Remove(profile);
            await db.SaveChangesAsync();
        }

        // 2. Eliminar usuario de auth.users via Supabase Admin API
        var projectUrl     = config["Supabase:ProjectUrl"];
        var serviceRoleKey = config["Supabase:ServiceRoleKey"];

        if (string.IsNullOrEmpty(projectUrl) || string.IsNullOrEmpty(serviceRoleKey)
            || serviceRoleKey == "TU_SERVICE_ROLE_KEY_AQUI")
            return;

        var client  = httpClientFactory.CreateClient();
        var request = new HttpRequestMessage(
            HttpMethod.Delete,
            $"{projectUrl}/auth/v1/admin/users/{userId}");

        request.Headers.Add("apikey", serviceRoleKey);
        request.Headers.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", serviceRoleKey);

        await client.SendAsync(request);
    }
}
