namespace fintrack_backend.Models;

public class Budget
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid CategoryId { get; set; }
    public decimal Amount { get; set; }
    public DateOnly Month { get; set; }
    public bool IsAnnual { get; set; }
    public DateTime CreatedAt { get; set; }

    public Category? Category { get; set; }
}
