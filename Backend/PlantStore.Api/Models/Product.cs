namespace PlantStore.Api.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }

        public string? ImageUrl { get; set; } // 👈 jako domyślne zdjęcie

        public int InStock { get; set; }
        public bool IsNew { get; set; }

        public int CategoryId { get; set; }
        public Category? Category { get; set; }

        public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public ICollection<Promotion> Promotions { get; set; } = new List<Promotion>();
    }
}
