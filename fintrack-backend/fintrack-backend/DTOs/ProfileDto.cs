namespace fintrack_backend.DTOs;

public class ProfileDto
{
    public Guid Id { get; set; }
    public string? FullName { get; set; }
    public string? AvatarUrl { get; set; }
    public string Currency { get; set; } = "USD";
    public string Role { get; set; } = "user";
    public DateTime CreatedAt { get; set; }
}

public class UpdateProfileDto
{
    public string? FullName { get; set; }
    public string Currency { get; set; } = "USD";
}
