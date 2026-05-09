using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantStore.Api.Data;
using PlantStore.Api.Services;

namespace PlantStore.Api.Controllers
{
    [ApiController]
    [Route("api/push")]
    public class PushController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IPushService _push;

        public PushController(AppDbContext db, IPushService push)
        {
            _db = db;
            _push = push;
        }

        [HttpGet("vapid-public-key")]
        [AllowAnonymous]
        public IActionResult GetPublicKey() => Ok(new { publicKey = _push.GetPublicKey() });

        [HttpPost("subscribe")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Subscribe([FromBody] SubscribeDto dto)
        {
            var existing = await _db.PushSubscriptions
                .FirstOrDefaultAsync(s => s.Endpoint == dto.Endpoint);

            if (existing != null) return Ok();

            _db.PushSubscriptions.Add(new Models.PushSubscription
            {
                Endpoint = dto.Endpoint,
                P256DH = dto.P256DH,
                Auth = dto.Auth,
            });
            await _db.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("unsubscribe")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Unsubscribe([FromBody] UnsubscribeDto dto)
        {
            var sub = await _db.PushSubscriptions
                .FirstOrDefaultAsync(s => s.Endpoint == dto.Endpoint);
            if (sub != null)
            {
                _db.PushSubscriptions.Remove(sub);
                await _db.SaveChangesAsync();
            }
            return Ok();
        }
    }

    public record SubscribeDto(string Endpoint, string P256DH, string Auth);
    public record UnsubscribeDto(string Endpoint);
}
