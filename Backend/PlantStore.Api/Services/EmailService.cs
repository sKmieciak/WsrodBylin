using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using PlantStore.Api.Models;

namespace PlantStore.Api.Services
{
    public interface IEmailService
    {
        Task SendOrderConfirmationAsync(Order order);
        Task SendOrderNotificationAsync(Order order);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration config, ILogger<EmailService> logger)
        {
            _config = config;
            _logger = logger;
        }

        private string BuildOrderItemsHtml(Order order)
        {
            var rows = string.Join("", order.Items.Select(i =>
                $"<tr>" +
                $"<td style='padding:6px 12px;border-bottom:1px solid #eee'>{i.Product?.Name ?? $"Produkt #{i.ProductId}"}</td>" +
                $"<td style='padding:6px 12px;border-bottom:1px solid #eee;text-align:center'>{i.Quantity}</td>" +
                $"<td style='padding:6px 12px;border-bottom:1px solid #eee;text-align:right'>{i.PriceAtPurchase:F2} zł</td>" +
                $"<td style='padding:6px 12px;border-bottom:1px solid #eee;text-align:right'>{i.PriceAtPurchase * i.Quantity:F2} zł</td>" +
                $"</tr>"
            ));

            var productTotal = order.Items.Sum(i => i.PriceAtPurchase * i.Quantity);
            var total = productTotal + order.DeliveryCost;

            return $@"
<table style='width:100%;border-collapse:collapse;font-size:14px'>
  <thead>
    <tr style='background:#f3f4f6'>
      <th style='padding:8px 12px;text-align:left'>Produkt</th>
      <th style='padding:8px 12px;text-align:center'>Ilość</th>
      <th style='padding:8px 12px;text-align:right'>Cena</th>
      <th style='padding:8px 12px;text-align:right'>Suma</th>
    </tr>
  </thead>
  <tbody>{rows}</tbody>
  <tfoot>
    <tr>
      <td colspan='3' style='padding:6px 12px;text-align:right;color:#555'>Dostawa ({order.Courier})</td>
      <td style='padding:6px 12px;text-align:right'>{order.DeliveryCost:F2} zł</td>
    </tr>
    <tr>
      <td colspan='3' style='padding:8px 12px;text-align:right;font-weight:bold'>Łącznie</td>
      <td style='padding:8px 12px;text-align:right;font-weight:bold;color:#16a34a'>{total:F2} zł</td>
    </tr>
  </tfoot>
</table>";
        }

        private static string BuildAddressBlock(Order order) =>
            $"{order.ShippingFirstName} {order.ShippingLastName}<br>" +
            $"{order.ShippingStreet} {order.ShippingHouseNumber}<br>" +
            $"{order.ShippingPostalCode} {order.ShippingCity}<br>" +
            $"{order.ShippingCountry}<br>" +
            $"Tel: {order.ShippingPhone}";

        public async Task SendOrderConfirmationAsync(Order order)
        {
            var body = $@"
<div style='font-family:sans-serif;max-width:600px;margin:auto'>
  <div style='background:#16a34a;padding:20px;border-radius:8px 8px 0 0'>
    <h1 style='color:white;margin:0;font-size:22px'>Wśród Bylin</h1>
  </div>
  <div style='padding:24px;background:#fff;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px'>
    <h2 style='color:#16a34a'>Dziękujemy za zamówienie!</h2>
    <p>Cześć <strong>{order.ShippingFirstName}</strong>,</p>
    <p>Twoje zamówienie <strong>#{order.Id}</strong> zostało przyjęte i jest w trakcie realizacji.</p>

    <h3 style='margin-top:24px'>Zamówione produkty</h3>
    {BuildOrderItemsHtml(order)}

    <div style='margin-top:20px;padding:16px;background:#f9fafb;border-radius:8px'>
      <strong>Adres dostawy:</strong><br>
      <span style='color:#555'>{BuildAddressBlock(order)}</span>
    </div>

    <div style='margin-top:12px;padding:16px;background:#f9fafb;border-radius:8px'>
      <strong>Metoda płatności:</strong> {order.PaymentMethod}
    </div>

    <p style='margin-top:24px;color:#555;font-size:13px'>
      W razie pytań zadzwoń: <a href='tel:+48723047028'>723 047 028</a>
      lub napisz na <a href='mailto:WsrodBylin@wp.pl'>WsrodBylin@wp.pl</a>
    </p>
  </div>
</div>";

            await SendAsync(order.ShippingEmail, $"Potwierdzenie zamówienia #{order.Id} – Wśród Bylin", body);
        }

        public async Task SendOrderNotificationAsync(Order order)
        {
            var total = order.Items.Sum(i => i.PriceAtPurchase * i.Quantity) + order.DeliveryCost;

            var body = $@"
<div style='font-family:sans-serif;max-width:600px;margin:auto'>
  <h2>Nowe zamówienie #{order.Id}</h2>
  <p><strong>Klient:</strong> {order.ShippingFirstName} {order.ShippingLastName} ({order.ShippingEmail})<br>
  <strong>Telefon:</strong> {order.ShippingPhone}</p>
  <p><strong>Adres:</strong> {order.ShippingStreet} {order.ShippingHouseNumber}, {order.ShippingPostalCode} {order.ShippingCity}</p>
  <p><strong>Dostawa:</strong> {order.Courier} – {order.DeliveryCost:F2} zł<br>
  <strong>Płatność:</strong> {order.PaymentMethod}</p>

  <h3>Produkty</h3>
  {BuildOrderItemsHtml(order)}
  <p style='font-size:18px;font-weight:bold;color:#16a34a'>Łącznie: {total:F2} zł</p>
</div>";

            var notifyTo = _config["Email:NotifyTo"] ?? "";
            await SendAsync(notifyTo, $"Nowe zamówienie #{order.Id} od {order.ShippingFirstName} {order.ShippingLastName}", body);
        }

        private async Task SendAsync(string to, string subject, string htmlBody)
        {
            var host = _config["Email:SmtpHost"];
            var port = int.TryParse(_config["Email:SmtpPort"], out var p) ? p : 587;
            var username = _config["Email:Username"];
            var password = _config["Email:Password"];
            var from = _config["Email:From"] ?? username;

            if (string.IsNullOrEmpty(password))
            {
                _logger.LogWarning("Email not sent (no password configured): {Subject}", subject);
                return;
            }

            var message = new MimeMessage();
            message.From.Add(MailboxAddress.Parse(from));
            message.To.Add(MailboxAddress.Parse(to));
            message.Subject = subject;
            message.Body = new TextPart("html") { Text = htmlBody };

            using var smtp = new SmtpClient();
            try
            {
                await smtp.ConnectAsync(host, port, SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync(username, password);
                await smtp.SendAsync(message);
            }
            finally
            {
                await smtp.DisconnectAsync(true);
            }
        }
    }
}
