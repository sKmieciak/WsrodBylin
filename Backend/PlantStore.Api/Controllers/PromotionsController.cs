using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantStore.Api.Data;
using PlantStore.Api.DTOs;
using PlantStore.Api.Dtos;
using PlantStore.Api.Mappers;
using PlantStore.Api.Models;
using PlantStore.Api.Services;

namespace PlantStore.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class PromotionsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IAuditService _audit;

        public PromotionsController(AppDbContext context, IAuditService audit)
        {
            _context = context;
            _audit = audit;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PromotionDto>>> GetAll()
        {
            var promotions = await _context.Promotions
                .Include(p => p.Products)
                .ToListAsync();

            return Ok(promotions.Select(p => p.ToDto()));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PromotionDto>> Get(int id)
        {
            var promotion = await _context.Promotions
                .Include(p => p.Products)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (promotion == null)
                return NotFound();

            return Ok(promotion.ToDto());
        }

        [HttpPost]
        public async Task<ActionResult<PromotionDto>> Create(CreatePromotionDto dto)
        {
            var products = await _context.Products
                .Where(p => dto.ProductIds.Contains(p.Id))
                .ToListAsync();

            if (products.Count != dto.ProductIds.Count)
                return BadRequest("Jedno lub więcej produktów nie istnieje.");

            var promotion = dto.ToModel(products);

            _context.Promotions.Add(promotion);
            await _context.SaveChangesAsync();
            await _audit.LogAsync("Dodano", "Promocja", promotion.Id, promotion.Name);

            return CreatedAtAction(nameof(Get), new { id = promotion.Id }, promotion.ToDto());
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, CreatePromotionDto dto)
        {
            var promotion = await _context.Promotions
                .Include(p => p.Products)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (promotion == null)
                return NotFound();

            var products = await _context.Products
                .Where(p => dto.ProductIds.Contains(p.Id))
                .ToListAsync();

            if (products.Count != dto.ProductIds.Count)
                return BadRequest("Jedno lub więcej produktów nie istnieje.");

            // Aktualizacja ręczna (bo UpdateModel nie ma)
            promotion.Name = dto.Name;
            promotion.DiscountPercentage = dto.DiscountPercentage;
            promotion.StartDate = dto.StartDate;
            promotion.EndDate = dto.EndDate;
            promotion.Products = products;

            await _context.SaveChangesAsync();
            await _audit.LogAsync("Edytowano", "Promocja", id, promotion.Name);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var promotion = await _context.Promotions
                .Include(p => p.Products)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (promotion == null)
                return NotFound();

            var name = promotion.Name;
            _context.Promotions.Remove(promotion);
            await _context.SaveChangesAsync();
            await _audit.LogAsync("Usunięto", "Promocja", id, name);

            return NoContent();
        }
    }
}
