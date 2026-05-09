using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantStore.Api.Data;

namespace PlantStore.Api.Controllers
{
    [ApiController]
    [Route("api/audit")]
    [Authorize(Roles = "Admin")]
    public class AuditController : ControllerBase
    {
        private readonly AppDbContext _db;

        public AuditController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> GetLogs([FromQuery] int page = 1, [FromQuery] int pageSize = 50)
        {
            var total = await _db.AuditLogs.CountAsync();
            var logs = await _db.AuditLogs
                .OrderByDescending(l => l.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .AsNoTracking()
                .ToListAsync();

            return Ok(new { data = logs, total });
        }
    }
}
