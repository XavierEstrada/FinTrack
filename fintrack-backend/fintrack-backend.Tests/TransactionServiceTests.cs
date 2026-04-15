using AutoMapper;
using fintrack_backend.Data;
using fintrack_backend.DTOs;
using fintrack_backend.Mappings;
using fintrack_backend.Models;
using fintrack_backend.Services;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace fintrack_backend.Tests;

/// <summary>
/// Tests de TransactionService.
/// Usamos una base de datos en memoria (EF InMemory) para no depender
/// de PostgreSQL real — los tests corren rápido y sin infraestructura externa.
/// </summary>
public class TransactionServiceTests : IDisposable
{
    private readonly AppDbContext      _db;
    private readonly TransactionService _svc;
    private readonly Guid              _userId = Guid.NewGuid();

    public TransactionServiceTests()
    {
        // Cada test recibe su propia DB en memoria con nombre único
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _db = new AppDbContext(options);

        var services = new ServiceCollection();
        services.AddLogging();
        services.AddAutoMapper(cfg => cfg.AddProfile<MappingProfile>());
        var mapper = services.BuildServiceProvider().GetRequiredService<IMapper>();

        _svc = new TransactionService(_db, mapper);
    }

    public void Dispose() => _db.Dispose();

    // ── Helpers ──────────────────────────────────────────────────────────────

    private Transaction MakeTx(string type, decimal amount, string description = "Test",
                                DateOnly? date = null)
        => new()
        {
            Id          = Guid.NewGuid(),
            UserId      = _userId,
            Type        = type,
            Amount      = amount,
            Description = description,
            Date        = date ?? DateOnly.FromDateTime(DateTime.Today),
            CreatedAt   = DateTime.UtcNow,
            UpdatedAt   = DateTime.UtcNow,
        };

    private async Task SeedAsync(params Transaction[] txs)
    {
        _db.Transactions.AddRange(txs);
        await _db.SaveChangesAsync();
    }

    // ── Paginación ────────────────────────────────────────────────────────────

    [Fact]
    public async Task GetAllAsync_SinFiltros_DevuelveTodas()
    {
        await SeedAsync(
            MakeTx("expense", 100),
            MakeTx("income",  200),
            MakeTx("expense", 300)
        );

        var result = await _svc.GetAllAsync(_userId, page: 1, limit: 10,
                                             type: null, categoryId: null,
                                             from: null, to: null, search: null);

        result.Total.Should().Be(3);
        result.Data.Should().HaveCount(3);
    }

    [Fact]
    public async Task GetAllAsync_Paginacion_DevuelveSubconjunto()
    {
        await SeedAsync(
            MakeTx("expense", 1),
            MakeTx("expense", 2),
            MakeTx("expense", 3),
            MakeTx("expense", 4),
            MakeTx("expense", 5)
        );

        var result = await _svc.GetAllAsync(_userId, page: 2, limit: 2,
                                             type: null, categoryId: null,
                                             from: null, to: null, search: null);

        result.Total.Should().Be(5);   // total sin paginar
        result.Data.Should().HaveCount(2); // solo la página 2
        result.Page.Should().Be(2);
        result.Limit.Should().Be(2);
    }

    [Fact]
    public async Task GetAllAsync_NoDevuelveTransaccionesDeOtroUsuario()
    {
        var otherUser = Guid.NewGuid();
        _db.Transactions.Add(new Transaction
        {
            Id = Guid.NewGuid(), UserId = otherUser,
            Type = "expense", Amount = 999, Description = "Ajena",
            Date = DateOnly.FromDateTime(DateTime.Today),
            CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow,
        });
        await _db.SaveChangesAsync();

        var result = await _svc.GetAllAsync(_userId, 1, 10, null, null, null, null, null);

        result.Total.Should().Be(0);
        result.Data.Should().BeEmpty();
    }

    // ── Filtros ───────────────────────────────────────────────────────────────

    [Fact]
    public async Task GetAllAsync_FiltroTipo_DevuelveSoloEseTipo()
    {
        await SeedAsync(
            MakeTx("expense", 50),
            MakeTx("expense", 75),
            MakeTx("income",  200)
        );

        var result = await _svc.GetAllAsync(_userId, 1, 10,
                                             type: "expense",
                                             categoryId: null, from: null, to: null, search: null);

        result.Total.Should().Be(2);
        result.Data.Should().AllSatisfy(t => t.Type.Should().Be("expense"));
    }

    [Fact]
    public async Task GetAllAsync_FiltroBusqueda_DevuelveCoincidencias()
    {
        await SeedAsync(
            MakeTx("expense", 50,  "Supermercado"),
            MakeTx("expense", 75,  "Gasolina"),
            MakeTx("income",  200, "Salario mensual")
        );

        var result = await _svc.GetAllAsync(_userId, 1, 10,
                                             type: null, categoryId: null,
                                             from: null, to: null, search: "salario");

        result.Total.Should().Be(1);
        result.Data.First().Description.Should().Be("Salario mensual");
    }

    [Fact]
    public async Task GetAllAsync_FiltroFechas_DevuelveSoloElRango()
    {
        await SeedAsync(
            MakeTx("expense", 50, date: new DateOnly(2026, 3, 1)),
            MakeTx("expense", 75, date: new DateOnly(2026, 4, 10)),
            MakeTx("expense", 99, date: new DateOnly(2026, 4, 30))
        );

        var result = await _svc.GetAllAsync(_userId, 1, 10,
                                             type: null, categoryId: null,
                                             from: new DateOnly(2026, 4, 1),
                                             to:   new DateOnly(2026, 4, 30),
                                             search: null);

        result.Total.Should().Be(2);
    }

    // ── Totales ───────────────────────────────────────────────────────────────

    [Fact]
    public async Task GetAllAsync_CalculaTotalIncomeYExpenseDelFiltroCompleto()
    {
        await SeedAsync(
            MakeTx("income",  1000),
            MakeTx("income",  500),
            MakeTx("expense", 300),
            MakeTx("expense", 200)
        );

        var result = await _svc.GetAllAsync(_userId, 1, 10, null, null, null, null, null);

        result.TotalIncome.Should().Be(1500);
        result.TotalExpense.Should().Be(500);
    }

    [Fact]
    public async Task GetAllAsync_TotalesRespetanFiltroTipo()
    {
        await SeedAsync(
            MakeTx("income",  1000),
            MakeTx("expense", 300)
        );

        // Filtrar solo ingresos → TotalExpense debe ser 0
        var result = await _svc.GetAllAsync(_userId, 1, 10,
                                             type: "income",
                                             categoryId: null, from: null, to: null, search: null);

        result.TotalIncome.Should().Be(1000);
        result.TotalExpense.Should().Be(0);
    }

    // ── CRUD ──────────────────────────────────────────────────────────────────

    [Fact]
    public async Task CreateAsync_GuardaLaTransaccionEnDB()
    {
        var dto = new CreateTransactionDto
        {
            Type        = "expense",
            Amount      = 150,
            Description = "Cena",
            Date        = DateOnly.FromDateTime(DateTime.Today),
        };

        var created = await _svc.CreateAsync(dto, _userId);

        created.Id.Should().NotBeEmpty();
        created.Amount.Should().Be(150);
        created.Description.Should().Be("Cena");

        _db.Transactions.Should().HaveCount(1);
    }

    [Fact]
    public async Task DeleteAsync_EliminaLaTransaccion()
    {
        var tx = MakeTx("expense", 50);
        await SeedAsync(tx);

        var deleted = await _svc.DeleteAsync(tx.Id, _userId);

        deleted.Should().BeTrue();
        _db.Transactions.Should().BeEmpty();
    }

    [Fact]
    public async Task DeleteAsync_DevuelveFalseParaIdInexistente()
    {
        var deleted = await _svc.DeleteAsync(Guid.NewGuid(), _userId);
        deleted.Should().BeFalse();
    }

    [Fact]
    public async Task DeleteAsync_NoPermiteEliminarTransaccionDeOtroUsuario()
    {
        var tx = MakeTx("expense", 50);
        await SeedAsync(tx);

        var deleted = await _svc.DeleteAsync(tx.Id, Guid.NewGuid()); // otro userId

        deleted.Should().BeFalse();
        _db.Transactions.Should().HaveCount(1);
    }
}
