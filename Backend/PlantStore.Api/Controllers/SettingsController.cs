using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantStore.Api.Data;
using PlantStore.Api.Models;

namespace PlantStore.Api.Controllers
{
    [ApiController]
    [Route("api/settings")]
    public class SettingsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SettingsController(AppDbContext context)
        {
            _context = context;
        }

        // Public — order success page reads bank transfer details
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var settings = await _context.Settings.ToListAsync();
            var dict = settings.ToDictionary(s => s.Key, s => s.Value);
            return Ok(dict);
        }

        // Admin only — save all settings at once
        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<IActionResult> SaveAll([FromBody] Dictionary<string, string> data)
        {
            foreach (var (key, value) in data)
            {
                var existing = await _context.Settings.FindAsync(key);
                if (existing != null)
                    existing.Value = value;
                else
                    _context.Settings.Add(new Setting { Key = key, Value = value });
            }

            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
