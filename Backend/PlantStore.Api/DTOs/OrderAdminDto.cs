using PlantStore.Api.Models;

namespace PlantStore.Api.Dtos
{
    public class OrderAdminDto
    {
        public int Id { get; set; }
        public string UserFullName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public string? Address { get; set; }
        public DateTime CreatedAt { get; set; }
        public OrderStatus Status { get; set; }

        public List<OrderItemDto> Items { get; set; } = new();
    }
}
