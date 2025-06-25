using PlantStore.Api.DTOs;
using PlantStore.Api.Models;
using System.Diagnostics.Metrics;
using System.IO;

namespace PlantStore.Api.Mappers
{
    public static class UserMapper
    {
        public static void UpdateFromDto(this User user, UpdateUserDto dto)
        {
            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.Email = dto.Email;
            user.PhoneNumber = dto.PhoneNumber;

            user.Street = dto.Street;
            user.HouseNumber = dto.HouseNumber;
            user.PostalCode = dto.PostalCode;
            user.City = dto.City;
            user.Country = dto.Country;
            user.AddressAddon = dto.AddressAddon;

            user.IsCompanyAccount = dto.IsCompanyAccount;
        }

    }

}
