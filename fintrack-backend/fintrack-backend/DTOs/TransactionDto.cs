namespace fintrack_backend.DTOs;

public class TransactionDto
{
    public Guid Id { get; set; }
    public Guid? CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public string? CategoryIcon { get; set; }
    public string? CategoryColor { get; set; }
    public decimal Amount { get; set; }
    public string Type { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateOnly Date { get; set; }
    public string? ReceiptUrl { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateTransactionDto
{
    public Guid? CategoryId { get; set; }
    public decimal Amount { get; set; }
    public string Type { get; set; } = "expense";
    public string? Description { get; set; }
    public DateOnly Date { get; set; }
    public string? ReceiptUrl { get; set; }
}

public class UpdateTransactionDto
{
    public Guid? CategoryId { get; set; }
    public decimal Amount { get; set; }
    public string Type { get; set; } = "expense";
    public string? Description { get; set; }
    public DateOnly Date { get; set; }
    public string? ReceiptUrl { get; set; }
}

public class TransactionListDto
{
    public IEnumerable<TransactionDto> Data { get; set; } = [];
    public int Total { get; set; }
    public int Page { get; set; }
    public int Limit { get; set; }
    public decimal TotalIncome { get; set; }
    public decimal TotalExpense { get; set; }
}
