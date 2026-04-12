namespace fintrack_backend.Models;

public class Category
{
    public Guid Id { get; set; }
    public Guid? UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Icon { get; set; }
    public string? Color { get; set; }
    public string Type { get; set; } = "expense";
    public bool IsSystem { get; set; }
    public DateTime CreatedAt { get; set; }
}
