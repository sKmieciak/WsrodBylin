using PlantStore.Api.Dtos;
using PlantStore.Api.Models;

namespace PlantStore.Api.Mappers
{
    public static class UserAddressMapper
    {
        public static UserAddressDto ToDto(this UserAddress address) => new()
        {
            Id = address.Id,
            Label = address.Label,
            Street = address.Street,
            City = address.City,
            PostalCode = address.PostalCode,
            Country = address.Country
        };

        public static UserAddress ToEntity(this CreateUserAddressDto dto, int userId) => new()
        {
            UserId = userId,
            Label = dto.Label,
            Street = dto.Street,
            City = dto.City,
            PostalCode = dto.PostalCode,
            Country = dto.Country
        };
    }
}
