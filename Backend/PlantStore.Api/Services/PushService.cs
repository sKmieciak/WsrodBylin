using PlantStore.Api.Data;
using Microsoft.EntityFrameworkCore;
using WebPush;
using System.Text.Json;

namespace PlantStore.Api.Services
{
    public class PushService : IPushService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<PushService> _logger;
        private string _publicKey = string.Empty;
        private string _privateKey = string.Empty;

        public PushService(IServiceScopeFactory scopeFactory, ILogger<PushService> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
            EnsureVapidKeys();
        }

        private void EnsureVapidKeys()
        {
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var pub = db.Settings.Find("vapidPublicKey");
            var priv = db.Settings.Find("vapidPrivateKey");

            if (pub != null && priv != null && !string.IsNullOrEmpty(pub.Value))
            {
                _publicKey = pub.Value;
                _privateKey = priv!.Value;
                return;
            }

            var keys = VapidHelper.GenerateVapidKeys();
            _publicKey = keys.PublicKey;
            _privateKey = keys.PrivateKey;

            db.Settings.Add(new Models.Setting { Key = "vapidPublicKey", Value = _publicKey });
            db.Settings.Add(new Models.Setting { Key = "vapidPrivateKey", Value = _privateKey });
            db.SaveChanges();

            _logger.LogInformation("Wygenerowano klucze VAPID.");
        }

        public string GetPublicKey() => _publicKey;

        public async Task SendToAllAsync(string title, string body, string? url = null)
        {
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var subscriptions = await db.PushSubscriptions.AsNoTracking().ToListAsync();
            if (!subscriptions.Any()) return;

            var client = new WebPushClient();
            client.SetVapidDetails("mailto:admin@wsrodbylin.pl", _publicKey, _privateKey);

            var payload = JsonSerializer.Serialize(new { title, body, url = url ?? "/admin/orders" });

            var stale = new List<int>();

            foreach (var sub in subscriptions)
            {
                try
                {
                    var pushSub = new PushSubscription(sub.Endpoint, sub.P256DH, sub.Auth);
                    await client.SendNotificationAsync(pushSub, payload);
                }
                catch (WebPushException ex) when (ex.StatusCode == System.Net.HttpStatusCode.Gone
                                                || ex.StatusCode == System.Net.HttpStatusCode.NotFound)
                {
                    stale.Add(sub.Id);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning("Push do {Endpoint} nie powiódł się: {Msg}", sub.Endpoint, ex.Message);
                }
            }

            if (stale.Any())
            {
                var toRemove = db.PushSubscriptions.Where(s => stale.Contains(s.Id));
                db.PushSubscriptions.RemoveRange(toRemove);
                await db.SaveChangesAsync();
            }
        }
    }
}
