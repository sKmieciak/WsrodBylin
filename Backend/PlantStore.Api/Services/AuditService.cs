using System.Security.Claims;
using PlantStore.Api.Data;
using PlantStore.Api.Models;

namespace PlantStore.Api.Services
{
    public class AuditService : IAuditService
    {
        private readonly AppDbContext _db;
        private readonly IHttpContextAccessor _http;

        public AuditService(AppDbContext db, IHttpContextAccessor http)
        {
            _db = db;
            _http = http;
        }

        public async Task LogAsync(string action, string entityType, int? entityId = null, string? details = null)
        {
            var user = _http.HttpContext?.User;
            var idStr = user?.FindFirstValue(ClaimTypes.NameIdentifier);
            _ = int.TryParse(idStr, out var adminId);

            _db.AuditLogs.Add(new AuditLog
            {
                AdminId = adminId,
                AdminEmail = user?.FindFirstValue(ClaimTypes.Email) ?? "?",
                AdminName = user?.FindFirstValue(ClaimTypes.Name) ?? "?",
                Action = action,
                EntityType = entityType,
                EntityId = entityId,
                Details = details ?? string.Empty,
            });

            await _db.SaveChangesAsync();
        }
    }
}
