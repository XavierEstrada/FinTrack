namespace fintrack_backend.DTOs;

public class BudgetDto
{
    public Guid Id { get; set; }
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string? CategoryIcon { get; set; }
    public string? CategoryColor { get; set; }
    public string CategoryType { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime Month { get; set; }
    public decimal Spent { get; set; }          // calculado en el servicio
}

public class UpsertBudgetDto
{
    public Guid CategoryId { get; set; }
    public decimal Amount { get; set; }
    public DateTime Month { get; set; }         // primer día del mes: 2025-01-01
}
