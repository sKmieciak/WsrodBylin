using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantStore.Api.Data;
using PlantStore.Api.Dtos;
using PlantStore.Api.Mappers;
using PlantStore.Api.Models;
using System.Security.Claims;

namespace PlantStore.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CartController(AppDbContext context)
        {
            _context = context;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            var userId = GetUserId();
            var cartItems = await _context.CartItems
                .Where(ci => ci.UserId == userId)
                .Include(ci => ci.Product)
                .ToListAsync();

            var result = cartItems.Select(CartItemMapper.ToDto);
            return Ok(result);
        }
        [HttpPost]
        public async Task<IActionResult> AddToCart([FromBody] CartItemCreateDto dto)
        {
            var userId = GetUserId();

            var product = await _context.Products.FindAsync(dto.ProductId);
            if (product == null) return NotFound();
            if (product.InStock <= 0)
                return BadRequest($"Produkt {product.Name} jest obecnie niedostępny.");

            var existing = await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.ProductId == dto.ProductId);

            var currentTotal = await _context.CartItems
                .Where(ci => ci.UserId == userId)
                .SumAsync(ci => ci.Quantity);

            if (existing != null)
            {
                var newQty = Math.Min(16, existing.Quantity + dto.Quantity);
                if (currentTotal - existing.Quantity + newQty > 16)
                    newQty = 16 - (currentTotal - existing.Quantity);
                newQty = Math.Min(newQty, product.InStock);
                existing.Quantity = Math.Max(1, newQty);
            }
            else
            {
                var allowed = Math.Min(Math.Min(dto.Quantity, 16 - currentTotal), product.InStock);
                if (allowed <= 0) return BadRequest("Koszyk pełny — maksymalna łączna ilość to 16 szt.");
                _context.CartItems.Add(new CartItem
                {
                    UserId = userId,
                    ProductId = dto.ProductId,
                    Quantity = allowed
                });
            }

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPut("{productId}")]
        public async Task<IActionResult> UpdateQuantity(int productId, [FromBody] CartItemUpdateDto dto)
        {
            var userId = GetUserId();
            var item = await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.ProductId == productId);

            if (item == null) return NotFound();

            var otherTotal = await _context.CartItems
                .Where(ci => ci.UserId == userId && ci.ProductId != productId)
                .SumAsync(ci => ci.Quantity);

            var stock = await _context.Products
                .Where(p => p.Id == productId)
                .Select(p => p.InStock)
                .FirstOrDefaultAsync();

            var maxQty = Math.Max(1, Math.Min(16 - otherTotal, stock));
            item.Quantity = Math.Clamp(dto.Quantity, 1, maxQty);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{cartItemId}")]
        public async Task<IActionResult> RemoveFromCart(int cartItemId)
        {
            var userId = GetUserId();
            var items = await _context.CartItems.Where(ci => ci.UserId == userId).ToListAsync();
            var item = items.FirstOrDefault(ci => ci.Id == cartItemId);

            if (item == null) return NotFound();

            _context.CartItems.Remove(item);
            await _context.SaveChangesAsync();

            return Ok();
        }

    }
}
