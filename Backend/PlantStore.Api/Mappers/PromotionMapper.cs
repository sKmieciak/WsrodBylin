using PlantStore.Api.Dtos;
using PlantStore.Api.DTOs;
using PlantStore.Api.Models;

namespace PlantStore.Api.Mappers
{
    public static class PromotionMapper
    {
        public static PromotionDto ToDto(this Promotion promotion)
        {
            return new PromotionDto
            {
                Id = promotion.Id,
                Name = promotion.Name,
                DiscountPercentage = promotion.DiscountPercentage,
                StartDate = promotion.StartDate,
                EndDate = promotion.EndDate,
                ProductIds = promotion.Products.Select(p => p.Id).ToList(),
                ProductNames = promotion.Products.Select(p => p.Name).ToList()
            };
        }

        public static Promotion ToModel(this CreatePromotionDto dto, List<Product> products)
        {
            return new Promotion
            {
                Name = dto.Name,
                DiscountPercentage = dto.DiscountPercentage,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Products = products
            };
        }
    }
}
