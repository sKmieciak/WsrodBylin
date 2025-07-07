namespace PlantStore.Api.DTOs
{
    public class ReviewResponseDto
    {
        public int Id { get; set; }
        public string AuthorName { get; set; } = string.Empty;
        public string Email { get; set; }

        public string Content { get; set; } = string.Empty;
        public int Rating { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
