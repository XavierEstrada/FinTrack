namespace fintrack_backend.DTOs;

public class AdminStatsDto
{
    public int TotalUsers { get; set; }
    public int TotalTransactions { get; set; }
    public decimal TotalVolume { get; set; }
}

public class AdminUserDto
{
    public Guid Id { get; set; }
    public string? FullName { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public int TransactionCount { get; set; }
    public DateTime CreatedAt { get; set; }
}
