using PlantStore.Api.Dtos;
using PlantStore.Api.Models;

namespace PlantStore.Api.Mappers
{
    public static class OrderItemMapper
    {
        public static OrderItemDto ToDto(OrderItem item)
        {
            return new OrderItemDto
            {
                ProductId = item.ProductId,
                ProductName = item.Product?.Name ?? string.Empty,
                Quantity = item.Quantity,
                PriceAtPurchase = item.PriceAtPurchase
            };
        }
    }
}
