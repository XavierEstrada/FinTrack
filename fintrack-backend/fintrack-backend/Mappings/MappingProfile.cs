using AutoMapper;
using fintrack_backend.DTOs;
using fintrack_backend.Models;

namespace fintrack_backend.Mappings;

public class MappingProfile : AutoMapper.Profile
{
    public MappingProfile()
    {
        // ── Transactions ─────────────────────────────────────────────────────
        CreateMap<Transaction, TransactionDto>()
            .ForMember(d => d.CategoryName,  o => o.MapFrom(s => s.Category != null ? s.Category.Name  : null))
            .ForMember(d => d.CategoryIcon,  o => o.MapFrom(s => s.Category != null ? s.Category.Icon  : null))
            .ForMember(d => d.CategoryColor, o => o.MapFrom(s => s.Category != null ? s.Category.Color : null));

        CreateMap<CreateTransactionDto, Transaction>()
            .ForMember(d => d.Id,        o => o.MapFrom(_ => Guid.NewGuid()))
            .ForMember(d => d.CreatedAt, o => o.MapFrom(_ => DateTime.UtcNow))
            .ForMember(d => d.UpdatedAt, o => o.MapFrom(_ => DateTime.UtcNow));

        CreateMap<UpdateTransactionDto, Transaction>()
            .ForMember(d => d.UpdatedAt, o => o.MapFrom(_ => DateTime.UtcNow));

        // ── Categories ───────────────────────────────────────────────────────
        CreateMap<Category, CategoryDto>();

        CreateMap<CreateCategoryDto, Category>()
            .ForMember(d => d.Id,        o => o.Ignore())
            .ForMember(d => d.UserId,    o => o.Ignore())
            .ForMember(d => d.IsSystem,  o => o.Ignore())
            .ForMember(d => d.CreatedAt, o => o.Ignore());

        // ── Budgets ──────────────────────────────────────────────────────────
        CreateMap<Budget, BudgetDto>()
            .ForMember(d => d.CategoryName,  o => o.MapFrom(s => s.Category != null ? s.Category.Name  : string.Empty))
            .ForMember(d => d.CategoryIcon,  o => o.MapFrom(s => s.Category != null ? s.Category.Icon  : null))
            .ForMember(d => d.CategoryColor, o => o.MapFrom(s => s.Category != null ? s.Category.Color : null))
            .ForMember(d => d.CategoryType,  o => o.MapFrom(s => s.Category != null ? s.Category.Type  : string.Empty))
            .ForMember(d => d.Spent, o => o.Ignore());   // calculado en BudgetService

        // ── Profile ──────────────────────────────────────────────────────────
        CreateMap<Models.Profile, ProfileDto>();

        CreateMap<UpdateProfileDto, Models.Profile>()
            .ForMember(d => d.Id,        o => o.Ignore())
            .ForMember(d => d.AvatarUrl, o => o.Ignore())
            .ForMember(d => d.Role,      o => o.Ignore())
            .ForMember(d => d.CreatedAt, o => o.Ignore());
    }
}
