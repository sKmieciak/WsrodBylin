using PlantStore.Api.Models;

namespace PlantStore.Api.Dtos
{
    public class OrderDto
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Courier { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;
        public decimal DeliveryCost { get; set; }
        public OrderStatus Status { get; set; }
        public PaymentStatus PaymentStatus { get; set; }
        public List<OrderItemDto> Items { get; set; } = new();
    }
}
