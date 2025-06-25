namespace PlantStore.Api.Models
{
    public class Review
    {
        public int Id { get; set; }
        public string AuthorName { get; set; } = string.Empty;
        public string Email { get; set; }
        public string Content { get; set; } = string.Empty;
        public int Rating { get; set; } // np. 1–5
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Relacja do produktu
        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;
    }

}
