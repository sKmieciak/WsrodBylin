namespace PlantStore.Api.Models
{
    public class AppLog
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string Level { get; set; } = "Error";
        public string Message { get; set; } = string.Empty;
        public string? ExceptionType { get; set; }
        public string? StackTrace { get; set; }
        public string? RequestPath { get; set; }
        public string? RequestMethod { get; set; }
    }
}
