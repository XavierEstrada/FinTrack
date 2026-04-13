namespace fintrack_backend.Models;

public class SavingsGoal
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal TargetAmount { get; set; }
    public DateOnly Month { get; set; }
    public DateTime CreatedAt { get; set; }
}
