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

        public string? ImageUrl { get; set; }  // domyślne zdjęcie

        public List<IFormFile> Images { get; set; } = new(); // 👈 zmiana

        [Range(0, int.MaxValue)]
        public int InStock { get; set; }

        public bool IsNew { get; set; }

        [Required]
        public int CategoryId { get; set; }
    }
}
