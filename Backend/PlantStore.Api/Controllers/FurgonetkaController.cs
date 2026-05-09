using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantStore.Api.Data;
using PlantStore.Api.Models;

namespace PlantStore.Api.Controllers
{
    [ApiController]
    public class FurgonetkaController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public FurgonetkaController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        private bool IsAuthorized()
        {
            var expectedToken = _config["Furgonetka:Token"];
            var authHeader = Request.Headers["Authorization"].ToString();
            var token = authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase)
                ? authHeader[7..].Trim()
                : authHeader.Trim();
            return !string.IsNullOrEmpty(expectedToken) && token == expectedToken;
        }

        private static string MapCountryCode(string? country) => country?.ToLower() switch
        {
            "polska" or "poland" or "pl" => "PL",
            "niemcy" or "germany" or "de" => "DE",
            "czechy" or "czech republic" or "cz" => "CZ",
            _ => string.IsNullOrEmpty(country) ? "PL" : country.ToUpper()
        };

        private static string MapCourierToService(string courier) => courier.ToLower() switch
        {
            var s when s.Contains("paczkomat") => "inpost",
            var s when s.Contains("kurier inpost") => "inpostkurier",
            var s when s.Contains("dpd") => "dpd",
            var s when s.Contains("dhl") => "dhl",
            var s when s.Contains("gls") => "gls",
            var s when s.Contains("ups") => "ups",
            var s when s.Contains("orlen") => "orlen",
            var s when s.Contains("poczta") => "poczta",
            _ => "inpostkurier"
        };

        // GET /orders — Furgonetka pobiera zamówienia ze sklepu
        [HttpGet("/orders")]
        public async Task<IActionResult> GetOrders([FromQuery] string? datetime, [FromQuery] int limit = 100)
        {
            if (!IsAuthorized()) return Unauthorized();

            var query = _context.Orders
                .Include(o => o.Items)
                    .ThenInclude(i => i.Product)
                .AsQueryable();

            if (!string.IsNullOrEmpty(datetime) && DateTime.TryParse(datetime, out var since))
                query = query.Where(o => o.CreatedAt > since);

            var orders = await query
                .OrderBy(o => o.CreatedAt)
                .Take(limit)
                .AsNoTracking()
                .ToListAsync();

            var result = orders.Select(o =>
            {
                var totalProductsPrice = o.Items.Sum(i => i.PriceAtPurchase * i.Quantity);

                return new
                {
                    sourceOrderId = o.Id.ToString(),
                    sourceClientId = o.UserId?.ToString() ?? o.ShippingEmail,
                    datetimeOrder = o.CreatedAt.ToString("yyyy-MM-ddTHH:mm:ss"),
                    sourceDatetimeChange = o.CreatedAt.ToString("yyyy-MM-ddTHH:mm:ss"),
                    service = MapCourierToService(o.Courier),
                    serviceDescription = o.Courier,
                    status = o.PaymentStatus == PaymentStatus.Paid ? "paid" : "unpaid",
                    totalPrice = totalProductsPrice + o.DeliveryCost,
                    shippingCost = o.DeliveryCost,
                    shippingMethodId = 0,
                    shippingTaxRate = 23,
                    totalPaid = o.PaymentStatus == PaymentStatus.Paid ? totalProductsPrice + o.DeliveryCost : 0,
                    codAmount = 0,
                    totalWeight = 0.5,
                    point = o.PaczkomatPoint,
                    comment = "",
                    shippingAddress = new
                    {
                        company = "",
                        name = o.ShippingFirstName,
                        surname = o.ShippingLastName,
                        street = $"{o.ShippingStreet} {o.ShippingHouseNumber}".Trim(),
                        city = o.ShippingCity,
                        postcode = o.ShippingPostalCode,
                        countryCode = MapCountryCode(o.ShippingCountry),
                        phone = o.ShippingPhone,
                        email = o.ShippingEmail
                    },
                    invoiceAddress = new
                    {
                        company = "",
                        name = o.ShippingFirstName,
                        surname = o.ShippingLastName,
                        street = $"{o.ShippingStreet} {o.ShippingHouseNumber}".Trim(),
                        city = o.ShippingCity,
                        postcode = o.ShippingPostalCode,
                        countryCode = MapCountryCode(o.ShippingCountry),
                        phone = o.ShippingPhone,
                        email = o.ShippingEmail,
                        nip = ""
                    },
                    products = o.Items.Select(i => new
                    {
                        sourceProductId = i.ProductId,
                        name = i.Product!.Name,
                        priceGross = i.PriceAtPurchase,
                        priceNet = Math.Round(i.PriceAtPurchase / 1.23m, 2),
                        vat = 23,
                        taxRate = 23,
                        weight = 0.5,
                        quantity = i.Quantity,
                        width = 20,
                        height = 20,
                        depth = 20,
                        sku = i.ProductId.ToString(),
                        gtin = "",
                        imageUrl = i.Product.ImageUrl ?? "",
                        unit = "szt."
                    }),
                    paymentDatetime = o.PaymentStatus == PaymentStatus.Paid
                        ? o.CreatedAt.ToString("yyyy-MM-ddTHH:mm:ss")
                        : (string?)null
                };
            });

            return Ok(result);
        }

        // POST /orders/{sourceOrderId}/payments — Furgonetka informuje o płatności
        [HttpPost("/orders/{sourceOrderId}/payments")]
        public async Task<IActionResult> UpdatePayment(string sourceOrderId, [FromBody] FurgonetkaPaymentDto dto)
        {
            if (!IsAuthorized()) return Unauthorized();

            if (!int.TryParse(sourceOrderId, out var orderId))
                return NotFound();

            var order = await _context.Orders.FindAsync(orderId);
            if (order == null) return NotFound();

            if (dto.PaymentStatus == "completed" || dto.PaymentStatus == "paid")
                order.PaymentStatus = PaymentStatus.Paid;

            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // POST /orders/{id}/tracking — Furgonetka przesyła numer śledzenia
        [HttpPost("/orders/{id}/tracking")]
        public async Task<IActionResult> AddTracking(string id, [FromBody] FurgonetkaTrackingDto dto)
        {
            if (!IsAuthorized()) return Unauthorized();

            if (!int.TryParse(id, out var orderId))
                return NotFound();

            var order = await _context.Orders.FindAsync(orderId);
            if (order == null) return NotFound();

            order.TrackingNumber = dto.Tracking?.Number;
            order.Status = OrderStatus.Shipped;
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }

    public class FurgonetkaPaymentDto
    {
        public string PaymentStatus { get; set; } = string.Empty;
        public decimal PaidAmount { get; set; }
    }

    public class FurgonetkaTrackingDto
    {
        public TrackingInfo? Tracking { get; set; }
    }

    public class TrackingInfo
    {
        public string? Number { get; set; }
        public string? Url { get; set; }
    }
}
