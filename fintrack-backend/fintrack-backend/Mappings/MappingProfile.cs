using AutoMapper;
using fintrack_backend.DTOs;
using fintrack_backend.Models;

namespace fintrack_backend.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Transaction, TransactionDto>()
            .ForMember(d => d.CategoryName,  o => o.MapFrom(s => s.Category != null ? s.Category.Name  : null))
            .ForMember(d => d.CategoryColor, o => o.MapFrom(s => s.Category != null ? s.Category.Color : null));

        CreateMap<CreateTransactionDto, Transaction>()
            .ForMember(d => d.Id,        o => o.MapFrom(_ => Guid.NewGuid()))
            .ForMember(d => d.CreatedAt, o => o.MapFrom(_ => DateTime.UtcNow))
            .ForMember(d => d.UpdatedAt, o => o.MapFrom(_ => DateTime.UtcNow));

        CreateMap<UpdateTransactionDto, Transaction>()
            .ForMember(d => d.UpdatedAt, o => o.MapFrom(_ => DateTime.UtcNow));

        CreateMap<Category, CategoryDto>();
    }
}
