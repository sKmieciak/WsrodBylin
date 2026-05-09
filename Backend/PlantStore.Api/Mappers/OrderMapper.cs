using PlantStore.Api.Dtos;
using PlantStore.Api.Models;

namespace PlantStore.Api.Mappers
{
    public static class OrderMapper
    {
        public static OrderDto ToDto(Order order)
        {
            return new OrderDto
            {
                Id = order.Id,
                CreatedAt = order.CreatedAt,
                Courier = order.Courier,
                PaymentMethod = order.PaymentMethod,
                DeliveryCost = order.DeliveryCost,
                Status = order.Status,
                PaymentStatus = order.PaymentStatus,
                Items = order.Items.Select(oi => new OrderItemDto
                {
                    ProductId = oi.ProductId,
                    ProductName = oi.Product?.Name ?? string.Empty,
                    ProductImage = oi.Product?.ImageUrl ?? string.Empty,
                    Quantity = oi.Quantity,
                    PriceAtPurchase = oi.PriceAtPurchase
                }).ToList()
            };
        }
    }
}
