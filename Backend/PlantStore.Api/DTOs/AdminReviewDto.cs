namespace PlantStore.Api.DTOs
{
    public class AdminReviewDto
    {
        public int Id { get; set; }
        public string AuthorName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public int Rating { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsVisible { get; set; }

        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
    }
}
