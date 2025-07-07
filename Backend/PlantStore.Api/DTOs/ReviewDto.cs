namespace PlantStore.Api.DTOs
{
    public class ReviewDto
    {
        public string AuthorName { get; set; } = string.Empty;
        public string Email { get; set; }

        public string Content { get; set; } = string.Empty;
        public int Rating { get; set; } // 1–5
    }

}
