using Microsoft.EntityFrameworkCore;
using PlantStore.Api.Data;
using PlantStore.Api.Models;
using System.Security.Claims;
using Stripe.Checkout;
using Microsoft.AspNetCore.Mvc;
using PlantStore.Api.DTOs;
using Stripe;

namespace PlantStore.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public PaymentsController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
            Stripe.StripeConfiguration.ApiKey = _config["Stripe:SecretKey"];
        }

        [HttpPost("create-checkout-session")]
        public async Task<IActionResult> CreateCheckoutSession([FromBody] CreateStripeSessionDto dto)
        {
            var order = await _context.Orders
                .Include(o => o.User)
                .OrderByDescending(o => o.CreatedAt)
                .FirstOrDefaultAsync();

            if (order == null)
                return BadRequest("Nie znaleziono zamówienia.");

            var domain = _config["FrontendBaseUrl"] ?? "http://localhost:5173";

            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = dto.Items.Select(item => new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        UnitAmount = (long)(item.Price * 100),
                        Currency = "pln",
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = item.ProductName,
                        },
                    },
                    Quantity = item.Quantity
                }).ToList(),
                Mode = "payment",
                SuccessUrl = domain + "/payment-success?session_id={CHECKOUT_SESSION_ID}",
                CancelUrl = domain + "/payment-cancelled",
                Metadata = new Dictionary<string, string>
                {
                    { "orderId", order.Id.ToString() }
                }
            };

            var service = new SessionService();
            var session = service.Create(options);

            order.PaymentIntentId = session.PaymentIntentId;
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            return Ok(new { sessionId = session.Id });
        }
        [HttpPost("webhook")]
        public async Task<IActionResult> StripeWebhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            var secret = _config["Stripe:WebhookSecret"];

            Event stripeEvent;
            try
            {
                stripeEvent = EventUtility.ConstructEvent(
                    json,
                    Request.Headers["Stripe-Signature"],
                    secret
                );
            }
            catch (Exception ex)
            {
                return BadRequest($"Webhook error: {ex.Message}");
            }

            if (stripeEvent.Type == "checkout.session.completed")
            {
                var session = stripeEvent.Data.Object as Session;

                if (session?.Metadata?["orderId"] != null)
                {
                    var orderId = int.Parse(session.Metadata["orderId"]);
                    var order = await _context.Orders.FindAsync(orderId);

                    if (order != null)
                    {
                        order.PaymentStatus = PaymentStatus.Paid;
                        _context.Orders.Update(order);
                        await _context.SaveChangesAsync();
                    }
                }
            }


            return Ok();
        }

    }
}
