namespace PlantStore.Api.Models
{
    public class Order
    {
        public int Id { get; set; }

        public int? UserId { get; set; }
        public User? User { get; set; }

        public DateTime CreatedAt { get; set; }

        public string Courier { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;
        public decimal DeliveryCost { get; set; }

        // Shipping address (always stored on order, not borrowed from User)
        public string ShippingFirstName { get; set; } = string.Empty;
        public string ShippingLastName { get; set; } = string.Empty;
        public string ShippingEmail { get; set; } = string.Empty;
        public string ShippingPhone { get; set; } = string.Empty;
        public string ShippingStreet { get; set; } = string.Empty;
        public string ShippingHouseNumber { get; set; } = string.Empty;
        public string ShippingPostalCode { get; set; } = string.Empty;
        public string ShippingCity { get; set; } = string.Empty;
        public string ShippingCountry { get; set; } = string.Empty;

        public List<OrderItem> Items { get; set; } = new();
        public OrderStatus Status { get; set; } = OrderStatus.Pending;
        public string? PaymentIntentId { get; set; }
        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
        public string? TrackingNumber { get; set; }
        public string? PaczkomatPoint { get; set; }
    }
}
