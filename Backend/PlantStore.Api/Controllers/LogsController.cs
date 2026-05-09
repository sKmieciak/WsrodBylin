using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantStore.Api.Data;

namespace PlantStore.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class LogsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LogsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetLogs([FromQuery] int page = 1, [FromQuery] int pageSize = 50)
        {
            var total = await _context.AppLogs.CountAsync();
            var logs = await _context.AppLogs
                .OrderByDescending(l => l.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .AsNoTracking()
                .ToListAsync();

            return Ok(new { data = logs, total, page, pageSize });
        }

        [HttpDelete]
        public async Task<IActionResult> ClearLogs()
        {
            _context.AppLogs.RemoveRange(_context.AppLogs);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
