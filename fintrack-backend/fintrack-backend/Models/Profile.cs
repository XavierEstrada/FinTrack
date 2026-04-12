namespace fintrack_backend.Models;

public class Profile
{
    public Guid Id { get; set; }
    public string? FullName { get; set; }
    public string? AvatarUrl { get; set; }
    public string Currency { get; set; } = "USD";
    public string Role { get; set; } = "user";
    public DateTime CreatedAt { get; set; }
}
