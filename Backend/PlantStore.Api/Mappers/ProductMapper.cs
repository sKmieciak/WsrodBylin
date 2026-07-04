using PlantStore.Api.Dtos;
using PlantStore.Api.Models;

namespace PlantStore.Api.Mappers
{
    public static class ProductMapper
    {
        public static ProductDto ToDto(Product product)
        {
            return new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,

                // Galeria zdjęć
                ImageUrls = product.Images.Select(i => i.Url).ToList(),

                // Domyślne zdjęcie (z pola głównego)
                DefaultImageUrl = product.ImageUrl,

                InStock = product.InStock,
                IsNew = product.IsNew,
                CategoryId = product.CategoryId,
                CategoryName = product.Category?.Name
            };
        }
    }
}
