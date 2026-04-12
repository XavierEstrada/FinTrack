using System.Security.Claims;

namespace fintrack_backend.Extensions;

public static class ClaimsExtensions
{
    /// <summary>
    /// Extrae el user_id del claim "sub" del JWT de Supabase.
    /// </summary>
    public static Guid GetUserId(this ClaimsPrincipal user)
    {
        var sub = user.FindFirstValue(ClaimTypes.NameIdentifier)
                  ?? user.FindFirstValue("sub")
                  ?? throw new UnauthorizedAccessException("Token inválido: falta el claim sub.");

        return Guid.Parse(sub);
    }
}
