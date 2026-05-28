using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantStore.Api.Auth;
using PlantStore.Api.Data;
using PlantStore.Api.Dtos;
using PlantStore.Api.Mappers;
using PlantStore.Api.Models;
using PlantStore.Api.Services;
using System.Security.Claims;

namespace PlantStore.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IEmailService _email;
        private readonly IPushService _push;
        private readonly IAuditService _audit;

        public OrderController(AppDbContext context, IEmailService email, IPushService push, IAuditService audit)
        {
            _context = context;
            _email = email;
            _push = push;
            _audit = audit;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
        {
            int? userId = null;
            if (User.Identity?.IsAuthenticated == true)
                userId = GetUserId();

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

                if (item.Quantity > 16)
                    return BadRequest($"Maksymalna ilość produktu w zamówieniu wynosi 16 szt. ({product.Name}).");

                if (product.InStock < item.Quantity)
                    return BadRequest($"Niewystarczający stan magazynu: {product.Name} (dostępne: {product.InStock}).");

                product.InStock -= item.Quantity;

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
                DeliveryCost = dto.DeliveryCost,
                Status = OrderStatus.Pending,
                Items = orderItems,
                ShippingFirstName = dto.ShippingFirstName,
                ShippingLastName = dto.ShippingLastName,
                ShippingEmail = dto.ShippingEmail,
                ShippingPhone = dto.ShippingPhone,
                ShippingStreet = dto.ShippingStreet,
                ShippingHouseNumber = dto.ShippingHouseNumber,
                ShippingPostalCode = dto.ShippingPostalCode,
                ShippingCity = dto.ShippingCity,
                ShippingCountry = dto.ShippingCountry,
                PaczkomatPoint = dto.PaczkomatPoint,
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Load full order with user + product names for emails
            var fullOrder = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.Items).ThenInclude(i => i.Product)
                .FirstAsync(o => o.Id == order.Id);

            _ = Task.Run(async () =>
            {
                try { await _email.SendOrderConfirmationAsync(fullOrder); } catch { }
                try { await _email.SendOrderNotificationAsync(fullOrder); } catch { }
                try
                {
                    var name = $"{order.ShippingFirstName} {order.ShippingLastName}".Trim();
                    var total = fullOrder.Items.Sum(i => i.PriceAtPurchase * i.Quantity) + fullOrder.DeliveryCost;
                    await _push.SendToAllAsync(
                        $"Nowe zamówienie #{order.Id}",
                        $"{name} — {total:F2} zł ({order.PaymentMethod})",
                        $"/admin/orders"
                    );
                }
                catch { }
            });

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
                .AsNoTracking()
                .ToListAsync();

            var result = orders.Select(OrderMapper.ToDto);
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateOrderStatusDto dto)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            order.Status = dto.Status;
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();
            await _audit.LogAsync("Zmiana statusu", "Zamówienie", id, $"Status: {dto.Status}");

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("{id}/payment-status")]
        public async Task<IActionResult> UpdatePaymentStatus(int id, [FromBody] UpdatePaymentStatusDto dto)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            order.PaymentStatus = dto.PaymentStatus;
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();
            await _audit.LogAsync("Zmiana płatności", "Zamówienie", id, $"Status: {dto.PaymentStatus}");

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("admin/{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.Items)
                    .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return NotFound();

            foreach (var item in order.Items)
            {
                if (item.Product != null)
                    item.Product.InStock += item.Quantity;
            }

            var customer = $"{order.ShippingFirstName} {order.ShippingLastName}".Trim();
            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
            await _audit.LogAsync("Usunięto", "Zamówienie", id, $"Klient: {customer}");

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("admin")]
        public async Task<IActionResult> GetAllOrders([FromQuery] int page = 1, [FromQuery] int pageSize = 50)
        {
            var total = await _context.Orders.CountAsync();

            var orders = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.Items)
                    .ThenInclude(i => i.Product)
                .OrderByDescending(o => o.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .AsNoTracking()
                .ToListAsync();

            var result = orders.Select(order => new OrderAdminDto
            {
                Id = order.Id,
                UserFullName = order.User != null
                    ? $"{order.User.FirstName} {order.User.LastName}"
                    : $"{order.ShippingFirstName} {order.ShippingLastName}",
                UserEmail = order.User?.Email ?? order.ShippingEmail,
                UserPhone = order.User?.PhoneNumber ?? order.ShippingPhone,
                Address = $"{order.ShippingStreet} {order.ShippingHouseNumber}, {order.ShippingPostalCode} {order.ShippingCity}, {order.ShippingCountry}",
                CreatedAt = order.CreatedAt,
                Status = order.Status,
                PaymentStatus = order.PaymentStatus,
                Courier = order.Courier,
                PaymentMethod = order.PaymentMethod,
                DeliveryCost = order.DeliveryCost,
                TrackingNumber = order.TrackingNumber,
                PaczkomatPoint = order.PaczkomatPoint,
                Items = order.Items.Select(item => new OrderItemDto
                {
                    ProductId = item.ProductId,
                    ProductName = item.Product!.Name,
                    ProductImage = item.Product.ImageUrl ?? string.Empty,
                    Quantity = item.Quantity,
                    PriceAtPurchase = item.PriceAtPurchase
                }).ToList()
            });

            return Ok(new { data = result, total, page, pageSize });
        }

    }
}
