using PlantStore.Api.Dtos;
using PlantStore.Api.Models;

namespace PlantStore.Api.Mappers
{
    public static class CartItemMapper
    {
        public static CartItemDto ToDto(CartItem item)
        {
            return new CartItemDto
            {
                Id = item.Id,
                ProductId = item.ProductId,
                ProductName = item.Product?.Name ?? string.Empty,
                ProductImage = item.Product?.ImageUrl ?? string.Empty,
                ProductPrice = item.Product?.Price ?? 0,
                Quantity = item.Quantity
            };
        }
    }
}
