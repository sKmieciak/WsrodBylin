namespace PlantStore.Api.Dtos
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }

        public List<string> ImageUrls { get; set; } = new();
        public string? DefaultImageUrl { get; set; } // 👈 nowość

        public int InStock { get; set; }
        public int CategoryId { get; set; }
        public string? CategoryName { get; set; }
    }
}
