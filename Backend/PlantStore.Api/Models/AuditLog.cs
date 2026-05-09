namespace PlantStore.Api.Models
{
    public class AuditLog
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int AdminId { get; set; }
        public string AdminEmail { get; set; } = string.Empty;
        public string AdminName { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public string EntityType { get; set; } = string.Empty;
        public int? EntityId { get; set; }
        public string Details { get; set; } = string.Empty;
    }
}
