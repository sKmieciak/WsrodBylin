using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace PlantStore.Api.Dtos
{
    public class ProductUpdateDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Range(0, 9999)]
        public decimal Price { get; set; }

        public string? ImageUrl { get; set; }  // tylko na wypadek gdy nie podajemy pliku

        public IFormFile? Image { get; set; } // 👈 Nowe pole

        [Range(0, int.MaxValue)]
        public int InStock { get; set; }

        [Required]
        public int CategoryId { get; set; }
    }
}
