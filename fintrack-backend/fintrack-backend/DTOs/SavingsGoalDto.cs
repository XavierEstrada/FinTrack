namespace fintrack_backend.DTOs;

public class SavingsGoalDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal TargetAmount { get; set; }
    public DateOnly Month { get; set; }
    public decimal Saved { get; set; }   // calculado: max(0, ingresos - gastos del mes)
}

public class CreateSavingsGoalDto
{
    public string Name { get; set; } = string.Empty;
    public decimal TargetAmount { get; set; }
    public DateOnly Month { get; set; }
}

public class UpdateSavingsGoalDto
{
    public string Name { get; set; } = string.Empty;
    public decimal TargetAmount { get; set; }
}
