using System.ComponentModel.DataAnnotations;

namespace PlantStore.Api.Dtos
{
    public class CreateUserAddressDto
    {
        [Required]
        public string Label { get; set; } = string.Empty;

        [Required]
        public string Street { get; set; } = string.Empty;

        [Required]
        public string City { get; set; } = string.Empty;

        [Required]
        public string PostalCode { get; set; } = string.Empty;

        [Required]
        public string Country { get; set; } = string.Empty;
    }
}
