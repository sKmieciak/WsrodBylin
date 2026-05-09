using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantStore.Api.Data;
using PlantStore.Api.Mappers;
using PlantStore.Api.DTOs;
using PlantStore.Api.Services;

namespace PlantStore.Api.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/admin/reviews")]
    public class AdminReviewsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IAuditService _audit;

        public AdminReviewsController(AppDbContext context, IAuditService audit)
        {
            _context = context;
            _audit = audit;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AdminReviewDto>>> GetAll()
        {
            var reviews = await _context.Reviews
                .Include(r => r.Product)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return reviews.Select(r => r.ToAdminDto()).ToList();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null) return NotFound();

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
            await _audit.LogAsync("Usunięto", "Recenzja", id, $"Autor: {review.AuthorName}");

            return NoContent();
        }

        [HttpPut("{id}/approve")]
        public async Task<IActionResult> Approve(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null) return NotFound();
            review.IsVisible = true;
            await _context.SaveChangesAsync();
            await _audit.LogAsync("Zatwierdzono", "Recenzja", id, $"Autor: {review.AuthorName}");
            return Ok();
        }

        [HttpPut("{id}/reject")]
        public async Task<IActionResult> Reject(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null) return NotFound();
            review.IsVisible = false;
            await _context.SaveChangesAsync();
            await _audit.LogAsync("Ukryto", "Recenzja", id, $"Autor: {review.AuthorName}");
            return Ok();
        }
    }
}
