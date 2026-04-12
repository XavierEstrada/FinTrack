namespace fintrack_backend.Models;

public class Budget
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid CategoryId { get; set; }
    public decimal Amount { get; set; }
    public DateTime Month { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navegación
    public Category? Category { get; set; }
}
