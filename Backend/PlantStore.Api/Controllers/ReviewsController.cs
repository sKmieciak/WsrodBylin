using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantStore.Api.Data;
using PlantStore.Api.DTOs;
using PlantStore.Api.Mappers;
using PlantStore.Api.Validators;

[ApiController]
[Route("api/products/{productId}/reviews")]
public class ReviewsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReviewsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ReviewResponseDto>>> GetReviews(int productId)
    {
        var reviews = await _context.Reviews
            .Where(r => r.ProductId == productId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return reviews.Select(r => r.ToDto()).ToList();
    }

    [HttpPost]
    public async Task<ActionResult<ReviewResponseDto>> AddReview(int productId, [FromBody] ReviewDto dto)
    {
        var validator = new ReviewDtoValidator();
        var result = validator.Validate(dto);

        if (!result.IsValid)
        {
            return BadRequest(result.Errors.Select(e => e.ErrorMessage));
        }

        var review = dto.ToEntity(productId);
        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetReviews), new { productId }, review.ToDto());
    }
}
