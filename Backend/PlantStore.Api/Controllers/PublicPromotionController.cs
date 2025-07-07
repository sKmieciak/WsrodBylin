using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantStore.Api.Data;
using PlantStore.Api.Mappers;
using PlantStore.Api.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace PlantStore.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PublicPromotionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PublicPromotionsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("active")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<PromotionDto>>> GetActivePromotions()
        {
            var today = DateTime.UtcNow.Date;

            var activePromotions = await _context.Promotions
                .AsNoTracking()
                .Include(p => p.Products)
                .Where(p => p.StartDate.Date <= today && p.EndDate.Date >= today)
                .ToListAsync();


            return Ok(activePromotions.Select(p => p.ToDto()));
        }
    }
}
