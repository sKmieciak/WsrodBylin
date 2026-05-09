using PlantStore.Api.Models;

namespace PlantStore.Api.Dtos
{
    public class OrderAdminDto
    {
        public int Id { get; set; }
        public string UserFullName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public string? UserPhone { get; set; }
        public string? Address { get; set; }
        public DateTime CreatedAt { get; set; }
        public OrderStatus Status { get; set; }
        public PaymentStatus PaymentStatus { get; set; }
        public string Courier { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;
        public decimal DeliveryCost { get; set; }
        public string? TrackingNumber { get; set; }
        public string? PaczkomatPoint { get; set; }
        public List<OrderItemDto> Items { get; set; } = new();
    }
}
