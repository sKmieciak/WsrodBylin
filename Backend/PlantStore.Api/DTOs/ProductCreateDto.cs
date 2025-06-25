using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace PlantStore.Api.Dtos
{
    public class ProductCreateDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Range(0, 9999)]
        public decimal Price { get; set; }

        [Range(0, int.MaxValue)]
        public int InStock { get; set; }

        [Required]
        public int CategoryId { get; set; }

        public IFormFile? Image { get; set; }
    }
}
