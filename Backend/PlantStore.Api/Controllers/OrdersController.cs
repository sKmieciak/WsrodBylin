using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantStore.Api.Auth;
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
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrderController(AppDbContext context)
        {
            _context = context;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
        {
            var userId = GetUserId();

            // Pobierz dane produktów (ceny itp.)
            var productIds = dto.Items.Select(i => i.ProductId).ToList();
            var products = await _context.Products
                .Where(p => productIds.Contains(p.Id))
                .ToDictionaryAsync(p => p.Id);

            if (!products.Any())
                return BadRequest("Nieprawidłowe produkty.");

            var orderItems = new List<OrderItem>();

            foreach (var item in dto.Items)
            {
                if (!products.ContainsKey(item.ProductId))
                    return BadRequest($"Produkt ID {item.ProductId} nie istnieje.");

                var product = products[item.ProductId];

                orderItems.Add(new OrderItem
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    PriceAtPurchase = product.Price
                });
            }

            var order = new Order
            {
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                Courier = dto.Courier,
                PaymentMethod = dto.PaymentMethod,
                Status = OrderStatus.Pending,
                Items = orderItems
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return Ok(new { order.Id });
        }


        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            var userId = GetUserId();
            var orders = await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.Items)
                    .ThenInclude(i => i.Product)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            var result = orders.Select(OrderMapper.ToDto);
            return Ok(result);
        }
        [Authorize]
        [AdminOnly]
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateOrderStatusDto dto)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            order.Status = dto.Status;
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [Authorize]
        [AdminOnly]
        [HttpGet("admin")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.Items)
                    .ThenInclude(i => i.Product)
                .ToListAsync();

            var result = orders.Select(order => new OrderAdminDto
            {
                Id = order.Id,
                UserFullName = $"{order.User.FirstName} {order.User.LastName}",
                UserEmail = order.User.Email,

                // Składany adres:
                Address = $"{order.User.Street} {order.User.HouseNumber}, {order.User.PostalCode} {order.User.City}, {order.User.Country}",

                CreatedAt = order.CreatedAt,
                Status = order.Status,

                Items = order.Items.Select(item => new OrderItemDto
                {
                    ProductId = item.ProductId,
                    ProductName = item.Product.Name,
                    ProductImage = item.Product.ImageUrl ?? string.Empty,
                    Quantity = item.Quantity,
                    PriceAtPurchase = item.PriceAtPurchase
                }).ToList()
            });

            return Ok(result);
        }

    }
}
